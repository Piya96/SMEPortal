using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.ConsumerCredit.Dtos;

using System.Net;
using System.Net.Http;

using SME.Portal.Authentication;
using Abp.Authorization;
using Abp.Json;
using Abp.Configuration;
using SME.Portal.Configuration;

using SME.Portal.Authorization.Users;

using SME.Portal.CCS.Dtos;
using SME.Portal.CCS.Interface;

using Newtonsoft.Json;
using System.Text;

namespace SME.Portal.ConsumerCredit
{
	[AbpAuthorize]
	public class CCSAppService :
		PortalAppServiceBase,
		ICCSAppService
	{
		private FinfindAzureApiGatewaySettings Settings;

		private readonly IRepository<CreditScore> _creditScoreRepository;
		private readonly IRepository<User, long> _lookup_userRepository;

		public CCSAppService(
			IRepository<CreditScore> creditScoreRepository,
			IRepository<User, long> lookup_userRepository,
			ISettingManager settingManager
		)
		{
			_creditScoreRepository = creditScoreRepository;
			_lookup_userRepository = lookup_userRepository;

			var settingValue = settingManager.GetSettingValueForApplication(AppSettings.FinfindApi.AzureApiGateway);
			var settings = settingValue.FromJsonString<FinfindAzureApiGatewaySettings>();

			if(!settings.Enabled)
				throw new ArgumentException("FinfindApi is not enabled");

			if(string.IsNullOrEmpty(settings.KeyName))
				throw new ArgumentException("FinfindApi KeyName is not defined");

			if(string.IsNullOrEmpty(settings.KeyValue))
				throw new ArgumentException("FinfindApi KeyValue is not defined");

			if(string.IsNullOrEmpty(settings.ApiUrl))
				throw new ArgumentException("FinfindApi Base Api Url is not defined");

			Settings = settings;
		}

		public CCSStatusDto GetStatus()
		{
			var creditScoreRecord = _creditScoreRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();

			CreditScoreDto creditScoreDto = ObjectMapper.Map<CreditScoreDto>(creditScoreRecord);

            return new CCSStatusDto
            {
                Status = CanFetchCreditScore(creditScoreDto) == true ? "Available" : "Existing"
            };
		}

		public int GetScoreByUser(long userId)
		{
			try
			{
				var creditScoreRecord = _creditScoreRepository.GetAll().Where(x => x.UserId == userId).OrderBy(x => x.EnquiryDate).FirstOrDefault();

				if (creditScoreRecord != null)
				{
					return creditScoreRecord.Score;
				}
				else
				{
					return -1;
				}
			}
			catch(WebException ex)
			{
				throw new Exception("An error occurred:" + ex.Message);
			}
		}

		public async Task<CCSOutputDto> GetScore(
			CCSInputDto input
		)
		{
			try
			{
				var creditScoreRecord = _creditScoreRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
				CreditScoreDto creditScoreDto = ObjectMapper.Map<CreditScoreDto>(creditScoreRecord);
				// From local DB.
				if(CanFetchCreditScore(creditScoreDto) == true)
				{
					// From cpb.
					if(input.UpdateIfAllowed == true)
					{
						var creditScoreValue = await HttpRequestScore(input);

						CreateOrEditCreditScoreDto dto = new CreateOrEditCreditScoreDto
						{
							Score = creditScoreValue,
							EnquiryDate = DateTime.Now,
							UserId = (long)AbpSession.UserId
						};

						var id = await InsertAndGetIdAsync(dto);
						creditScoreRecord = _creditScoreRepository.Get(id);
					}
					else
					{
						if(creditScoreRecord == null)
						{
							creditScoreRecord = new CreditScore
							{
								TenantId = (int)AbpSession.TenantId,
								UserId = (long)AbpSession.UserId,
							};
						}
					}
				}

				var output = new CCSOutputDto 
				{
					Status = "",
					Data = new GetCreditScoreForViewDto { CreditScore = ObjectMapper.Map<CreditScoreDto>(creditScoreRecord) }
				};

				var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)AbpSession.UserId);
				output.Data.UserName = _lookupUser?.Name?.ToString();
				output.Data.CreditScore.Status = "";
				return output;
			}
			catch(WebException ex)
			{
				throw new Exception("An error occurred:" + ex.Message);
			}
		}

		private bool CanFetchCreditScore(
			CreditScoreDto creditReportDto
		)
		{
			// TODO: Make sure what EnquiryDate actually means!
			if(creditReportDto == null || ((DateTime.Now.Date - creditReportDto.EnquiryDate).Days > 182))
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		private async Task<int> HttpRequestScore(
			CCSInputDto input
		)
		{
			var ApiUrl = "https://ff-apim.azure-api.net";
			var endpoint = $"/integrations/cpb/creditscore/" + input.IdentityNumber;
			//var endpoint = $"/staging/integrations/cpb/creditscore/" + input.IdentityNumber;
			var uri = new Uri(new Uri(ApiUrl), endpoint);
			var uriBuilder = new UriBuilder(uri);

			HttpRequestMessage request = new HttpRequestMessage
			{
				RequestUri = uriBuilder.Uri,
				Method = HttpMethod.Post,
				Content = null
			};

			// set key values
			request.Headers.Add(Settings.KeyName, Settings.KeyValue);

			HttpResponseMessage response = await new HttpClient().SendAsync(request);

			var jsonBlob = await response.Content.ReadAsStringAsync();
			dynamic obj = Newtonsoft.Json.JsonConvert.DeserializeObject<object>(jsonBlob);
			var creditScore = 0;
			// TODO: Make sure this parsing method is solid!
			foreach(var item in obj)
			{
				if(item.Name == "CreditScoreList")
				{
					creditScore = item.Value[0].CreditScore;
					break;
				}
			}
			return creditScore;
		}

		protected virtual async Task<int> InsertAndGetIdAsync(
			CreateOrEditCreditScoreDto input
		)
		{
			CreditScore creditScore = new CreditScore
			{
				Score = input.Score,
				EnquiryDate = input.EnquiryDate,
				UserId = input.UserId
			};
			if(AbpSession.TenantId != null)
			{
				creditScore.TenantId = (int)AbpSession.TenantId;
			}
			return await _creditScoreRepository.InsertAndGetIdAsync(creditScore);
		}
	}
}
