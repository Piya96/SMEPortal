using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.ConsumerCredit.Dtos;

using System.Net;
using System.Net.Http;

using SME.Portal.Authentication;
using Abp.Json;
using Abp.Authorization;
using Abp.Configuration;
using SME.Portal.Configuration;

using SME.Portal.Authorization.Users;

using SME.Portal.CCR.Dtos;
using SME.Portal.CCR.Interface;

using SME.Portal.Common.Dtos;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using System.Text;
using SME.Portal.Integrations;

namespace SME.Portal.ConsumerCredit
{
	[AbpAuthorize]
	public class CCRAppService : PortalAppServiceBase, ICCRAppService
	{
		private readonly IRepository<CreditScore> _creditScoreRepository;
		private readonly IRepository<CreditReport> _creditReportRepository;
		private readonly IRepository<User, long> _lookup_userRepository;
		private readonly ICPBAppService _cpbAppService;


		public CCRAppService(
			IRepository<CreditScore> creditScoreRepository,
			IRepository<CreditReport> creditReportRepository,
			IRepository<User, long> lookup_userRepository,
			ISettingManager settingManager,
			ICPBAppService cpbAppService
		)
		{
			_creditScoreRepository = creditScoreRepository;
			_creditReportRepository = creditReportRepository;
			_lookup_userRepository = lookup_userRepository;
			_cpbAppService = cpbAppService;
		}

		public CCRStatusDto GetStatus()
		{
			var creditReportRecord = _creditReportRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
			
			CreditReportDto creditReportDto = ObjectMapper.Map<CreditReportDto>(creditReportRecord);
            
			return  new CCRStatusDto
            {
                Status = CanFetchCreditReport(creditReportDto) == true ? "Available" : "Existing"
            };
            
		}

		public async Task<CCROutputDto> GetReport( CCRInputDto input )
		{
			try
			{
				var creditReportRecord = _creditReportRepository.GetAll()
																.Where(x => x.UserId == AbpSession.UserId)
																.OrderBy(x => x.EnquiryDate)
																.FirstOrDefault();
				
				CreditReportDto creditReportDto = ObjectMapper.Map<CreditReportDto>(creditReportRecord);

				if(CanFetchCreditReport(creditReportDto) == true)
				{
					if(input.UpdateIfAllowed == true)
					{
						var jsonBlob = await _cpbAppService.CreditReport(input.IdentityNumber, input.Dob, input.FirstName, input.Surname, input.EnquiryReason, input.EnquiryDoneBy);

                        var id = await InsertAndGetIdAsync(new CreateOrEditCreditReportDto
						{
							CreditReportJson = jsonBlob,
							EnquiryDate = DateTime.Now,
							UserId = (long)AbpSession.UserId
						});

						creditReportRecord = _creditReportRepository.Get(id);
					}
				}
				// TODO: Error checking!!!
				var output = new CCROutputDto
				{
					Data = new GetCreditReportForViewDto { CreditReport = ObjectMapper.Map<CreditReportDto>(creditReportRecord) }
				};

				var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)AbpSession.UserId);
				output.Data.UserName = _lookupUser?.Name?.ToString();
				
				return output;
			}
			catch(WebException ex)
			{
				throw new Exception("An error occurred:" + ex.Message);
			}
		}

		public async Task<ResultDto<string>> GetTelephoneById(string id)
		{
			return new ResultDto<string>
			{
				Result = ResultEnum.Success,
				Message = "Success",
				Data = await _cpbAppService.TelephoneById(id)
			};
		}

		public bool DoesReportExist()
		{
			var creditReportRecord = _creditReportRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
			return creditReportRecord != null;
		}

		public async Task<ResultDto<GetCreditReportForViewDto>> DownloadReport()
		{
			ResultDto<GetCreditReportForViewDto> output = new ResultDto<GetCreditReportForViewDto>
			{
				Result = ResultEnum.Fail,
				Message = "",
				Data = null
			};
			try
			{
				var creditReportRecord = _creditReportRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
				CreditReportDto creditReportDto = ObjectMapper.Map<CreditReportDto>(creditReportRecord);
				if(creditReportDto != null)
				{
					output.Result = ResultEnum.Success;
					output.Message = "Ok";
					output.Data = new GetCreditReportForViewDto { CreditReport = ObjectMapper.Map<CreditReportDto>(creditReportRecord) };
					var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)AbpSession.UserId);
					output.Data.UserName = _lookupUser?.Name?.ToString();
				}
				else
				{
					output.Message = "Report not found";
				}
			}
			catch(WebException ex)
			{
				output.Result = ResultEnum.Exception;
				output.Message = ex.Message;
			}
			return output;
		}

		private async Task UpdateScoreByUserAndId(
			string json
		)
		{
			JObject o = JObject.Parse(json);
			var scoreArray = o["CreditScore"]["CreditScoreList"];
			var scoreValue = scoreArray[scoreArray.Count() - 1]["CreditScore"].Value<int>();

			var creditScoreRecord = _creditScoreRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
			if(creditScoreRecord != null)
			{
				creditScoreRecord.Score = scoreValue;
				await _creditScoreRepository.UpdateAsync(creditScoreRecord);
			}
			else
			{
				CreditScore creditScore = new CreditScore
				{
					Score = scoreValue,
					EnquiryDate = DateTime.Now,
					UserId = (long)AbpSession.UserId
				};
				if(AbpSession.TenantId != null)
				{
					creditScore.TenantId = (int)AbpSession.TenantId;
				}
				await _creditScoreRepository.InsertAndGetIdAsync(creditScore);
			}
		}

		private async Task UpdateScoreByUser(
			string json
		)
		{
			JObject o = JObject.Parse(json);
			var scoreArray = o["CreditScore"]["CreditScoreList"];
			var scoreValue = scoreArray[scoreArray.Count() - 1]["CreditScore"].Value<int>();

			var creditScoreRecord = _creditScoreRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
			if(creditScoreRecord != null)
			{
				creditScoreRecord.Score = scoreValue;
				await _creditScoreRepository.UpdateAsync(creditScoreRecord);
			}
			else
			{
				CreditScore creditScore = new CreditScore
				{
					Score = scoreValue,
					EnquiryDate = DateTime.Now,
					UserId = (long)AbpSession.UserId
				};
				if(AbpSession.TenantId != null)
				{
					creditScore.TenantId = (int)AbpSession.TenantId;
				}
				await _creditScoreRepository.InsertAndGetIdAsync(creditScore);
			}
		}

		public async Task<ResultDto<GetCreditReportForViewDto>> GetReportEx(CCRInputDto input)
		{
			ResultDto<GetCreditReportForViewDto> output = new ResultDto<GetCreditReportForViewDto>
			{
				Result = ResultEnum.Fail,
				Message = "",
				Data = null
			};

			if(input.IdentityNumber == "" || input.IdentityNumber == null)
			{
				output.Result = ResultEnum.Fail;
				output.Message = "Invalid Identity Number";
				return output;
			}

			try
			{
				var creditReportRecord = _creditReportRepository.GetAll()
																.Where(x => x.UserId == AbpSession.UserId)
																.OrderBy(x => x.EnquiryDate)
																.FirstOrDefault();

				CreditReportDto creditReportDto = ObjectMapper.Map<CreditReportDto>(creditReportRecord);

				if(CanFetchCreditReport(creditReportDto) == true)
				{
					if(input.UpdateIfAllowed)
					{
						var jsonBlob = await _cpbAppService.CreditReport(input.IdentityNumber, input.Dob, input.FirstName, input.Surname, input.EnquiryReason, input.EnquiryDoneBy);

						CreateOrEditCreditReportDto dto = new CreateOrEditCreditReportDto
                        {
                            CreditReportJson = jsonBlob,
                            EnquiryDate = DateTime.Now,
                            UserId = (long)AbpSession.UserId
                        };

                        if (IsValidReport(jsonBlob) == true)
						{
							if(creditReportRecord != null)
							{
								creditReportRecord.CreditReportJson = jsonBlob;
								creditReportRecord.EnquiryDate = DateTime.Now;
								await _creditReportRepository.UpdateAsync(creditReportRecord);
							}
							else
							{
								var id = await InsertAndGetIdAsync(dto);
								creditReportRecord = _creditReportRepository.Get(id);
							}
						}
					}
				}
				output.Result = ResultEnum.Success;
				output.Message = "Ok";
				output.Data = new GetCreditReportForViewDto { CreditReport = ObjectMapper.Map<CreditReportDto>(creditReportRecord) };

				await UpdateScoreByUser(output.Data.CreditReport.CreditReportJson);

				var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)AbpSession.UserId);
				output.Data.UserName = _lookupUser?.Name?.ToString();
			}
			catch(WebException ex)
			{
				output.Result = ResultEnum.Exception;
				output.Message = ex.Message;
			}
			return output;
		}

		public async Task<ResultDto<GetCreditReportForViewDto>> GetReportById(
			CCRInputDto input
		)
		{
			ResultDto<GetCreditReportForViewDto> output = new ResultDto<GetCreditReportForViewDto>
			{
				Result = ResultEnum.Fail,
				Message = "",
				Data = null
			};
			if(input.IdentityNumber == "" || input.IdentityNumber == null)
			{
				output.Result = ResultEnum.Fail;
				output.Message = "Invalid Identity Number";
				return output;
			}
			try
			{
				var creditReportRecord = _creditReportRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
				bool foundMatch = false;
				if(creditReportRecord != null)
				{
					dynamic json = JsonConvert.DeserializeObject(creditReportRecord.CreditReportJson);
					string id = json["Person"]["People"][0]["IDNumber"];
					foundMatch = id == input.IdentityNumber;
				}
				if(foundMatch == false)
				{
					var jsonBlob = await _cpbAppService.CreditReport(input.IdentityNumber, input.Dob, input.FirstName, input.Surname, input.EnquiryReason, input.EnquiryDoneBy);
					CreateOrEditCreditReportDto dto = new CreateOrEditCreditReportDto();
					dto.CreditReportJson = jsonBlob;
					dto.EnquiryDate = DateTime.Now;
					dto.UserId = (long)AbpSession.UserId;
					if(IsValidReport(jsonBlob) == true)
					{
						if(creditReportRecord != null)
						{
							creditReportRecord.CreditReportJson = jsonBlob;
							creditReportRecord.EnquiryDate = DateTime.Now;
							await _creditReportRepository.UpdateAsync(creditReportRecord);
						}
						else
						{
							var id = await InsertAndGetIdAsync(dto);
							creditReportRecord = _creditReportRepository.Get(id);
						}
					}
				}

				output.Result = ResultEnum.Success;
				output.Message = "Ok";
				output.Data = new GetCreditReportForViewDto { CreditReport = ObjectMapper.Map<CreditReportDto>(creditReportRecord) };

				await UpdateScoreByUser(output.Data.CreditReport.CreditReportJson);

				var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)AbpSession.UserId);
				output.Data.UserName = _lookupUser?.Name?.ToString();
			}
			catch(WebException ex)
			{
				output.Result = ResultEnum.Exception;
				output.Message = ex.Message;
			}
			return output;
		}

		private bool IsValidReport(string jsonBlob)
		{
			dynamic obj = JsonConvert.DeserializeObject<object>(jsonBlob);
			foreach(var item in obj)
			{
				if(item.Name == "Error")
				{
					return false;
				}
			}
			return true;
		}

		private bool CanFetchCreditReport(
			CreditReportDto creditReport
		)
		{
			// TODO: Keep an eye on this 24 hour expiry window.
			if(creditReport == null || ((DateTime.Now.Date - creditReport.EnquiryDate).Days > 1))
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		

		protected virtual async Task<int> InsertAndGetIdAsync(
			CreateOrEditCreditReportDto input
		)
		{
			CreditReport creditReport = new CreditReport
			{
				CreditReportJson = input.CreditReportJson,
				EnquiryDate = input.EnquiryDate,
				UserId = input.UserId
			};

			if(AbpSession.TenantId != null)
			{
				creditReport.TenantId = (int?)AbpSession.TenantId;
			}

			return await _creditReportRepository.InsertAndGetIdAsync(creditReport);
		}
	}
}
