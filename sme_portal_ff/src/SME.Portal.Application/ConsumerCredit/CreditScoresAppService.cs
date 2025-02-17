using SME.Portal.Authorization.Users;

using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.ConsumerCredit.Exporting;
using SME.Portal.ConsumerCredit.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;

using System.Net;
using System.Net.Http;

using SME.Portal.Authentication;
using Abp.Json;
using Abp.Configuration;
using SME.Portal.Configuration;

namespace SME.Portal.ConsumerCredit
{
    //[AbpAuthorize(AppPermissions.Pages_CreditScores)]
    public class CreditScoresAppService : PortalAppServiceBase, ICreditScoresAppService
    {
		private FinfindAzureApiGatewaySettings Settings;

		private readonly IRepository<CreditScore> _creditScoreRepository;
        private readonly ICreditScoresExcelExporter _creditScoresExcelExporter;
        private readonly IRepository<User, long> _lookup_userRepository;

        public CreditScoresAppService(
			IRepository<CreditScore> creditScoreRepository,
			ICreditScoresExcelExporter creditScoresExcelExporter,
			IRepository<User, long> lookup_userRepository,
			ISettingManager settingManager
		)
        {
            _creditScoreRepository = creditScoreRepository;
            _creditScoresExcelExporter = creditScoresExcelExporter;
            _lookup_userRepository = lookup_userRepository;

			// TODO: Make this setting stuff common!!!
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

        public CreditScoreDto GetForCurrentUser()
        {
            var creditScoreDto = _creditScoreRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
            
            return ObjectMapper.Map<CreditScoreDto>(creditScoreDto);
        }

        public async Task<PagedResultDto<GetCreditScoreForViewDto>> GetAll(GetAllCreditScoresInput input)
        {

            var filteredCreditScores = _creditScoreRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false)
                        .WhereIf(input.MinScoreFilter != null, e => e.Score >= input.MinScoreFilter)
                        .WhereIf(input.MaxScoreFilter != null, e => e.Score <= input.MaxScoreFilter)
                        .WhereIf(input.MinEnquiryDateFilter != null, e => e.EnquiryDate >= input.MinEnquiryDateFilter)
                        .WhereIf(input.MaxEnquiryDateFilter != null, e => e.EnquiryDate <= input.MaxEnquiryDateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var pagedAndFilteredCreditScores = filteredCreditScores
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var creditScores = from o in pagedAndFilteredCreditScores
                               join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                               from s1 in j1.DefaultIfEmpty()

                               select new GetCreditScoreForViewDto()
                               {
                                   CreditScore = new CreditScoreDto
                                   {
                                       Score = o.Score,
                                       EnquiryDate = o.EnquiryDate,
                                       Id = o.Id
                                   },
                                   UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                               };

            var totalCount = await filteredCreditScores.CountAsync();

            return new PagedResultDto<GetCreditScoreForViewDto>(
                totalCount,
                await creditScores.ToListAsync()
            );
        }

		/*private async Task<int> HttpRequest(
			CreditScorePOSTArgsDto input
		)
		{
			var ApiUrl = "https://ff-apim.azure-api.net";
			var endpoint = $"/staging/integrations/cpb/creditscore/" + input.IdentityNumber;
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

		public async Task<GetCreditScoreForViewDto> GetCreditScoreForViewByUser(
			CreditScorePOSTArgsDto input
		)
		{
			try
			{
				var creditScoreRecord = _creditScoreRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
				CreditScoreDto creditScoreDto = ObjectMapper.Map<CreditScoreDto>(creditScoreRecord);
				// From local DB.
				string status = "Existing";
				if(CanFetchCreditScore(creditScoreDto) == true)
				{
					// From cpb.
					status = "Available";
					if(input.UpdateIfAllowed == true)
					{
						var creditScoreValue = await HttpRequest(input);

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
				var output = new GetCreditScoreForViewDto { CreditScore = ObjectMapper.Map<CreditScoreDto>(creditScoreRecord) };
				var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)AbpSession.UserId);
				output.UserName = _lookupUser?.Name?.ToString();
				output.CreditScore.Status = status;
				return output;
			}
			catch(WebException ex)
			{
				throw new Exception("An error occurred:" + ex.Message);
			}
		}*/

		public async Task<GetCreditScoreForViewDto> GetCreditScoreForView(int id)
        {
            var creditScore = await _creditScoreRepository.GetAsync(id);

            var output = new GetCreditScoreForViewDto { CreditScore = ObjectMapper.Map<CreditScoreDto>(creditScore) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.CreditScore.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_CreditScores_Edit)]
        public async Task<GetCreditScoreForEditOutput> GetCreditScoreForEdit(EntityDto input)
        {
            var creditScore = await _creditScoreRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetCreditScoreForEditOutput { CreditScore = ObjectMapper.Map<CreateOrEditCreditScoreDto>(creditScore) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.CreditScore.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditCreditScoreDto input)
        {
            if (input.Id == null)
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }
        }

        [AbpAuthorize(AppPermissions.Pages_CreditScores_Create)]
        protected virtual async Task Create(CreateOrEditCreditScoreDto input)
        {
            var creditScore = ObjectMapper.Map<CreditScore>(input);

            if (AbpSession.TenantId != null)
            {
                creditScore.TenantId = (int)AbpSession.TenantId;
            }

            await _creditScoreRepository.InsertAsync(creditScore);
        }

        [AbpAuthorize(AppPermissions.Pages_CreditScores_Edit)]
        protected virtual async Task Update(CreateOrEditCreditScoreDto input)
        {
            var creditScore = await _creditScoreRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, creditScore);
        }

		protected virtual async Task<int> InsertAndGetIdAsync(
			CreateOrEditCreditScoreDto input
		)
		{
			var creditScore = ObjectMapper.Map<CreditScore>(input);

			if(AbpSession.TenantId != null)
			{
				creditScore.TenantId = (int) AbpSession.TenantId;
			}

			return await _creditScoreRepository.InsertAndGetIdAsync(creditScore);
		}

		[AbpAuthorize(AppPermissions.Pages_CreditScores_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _creditScoreRepository.DeleteAsync(input.Id);
        }

        [AbpAllowAnonymous]
        public async Task DeleteForUser(long userId)
        {
            await _creditScoreRepository.DeleteAsync(a => a.UserId == userId);
        }

        public async Task<FileDto> GetCreditScoresToExcel(GetAllCreditScoresForExcelInput input)
        {

            var filteredCreditScores = _creditScoreRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false)
                        .WhereIf(input.MinScoreFilter != null, e => e.Score >= input.MinScoreFilter)
                        .WhereIf(input.MaxScoreFilter != null, e => e.Score <= input.MaxScoreFilter)
                        .WhereIf(input.MinEnquiryDateFilter != null, e => e.EnquiryDate >= input.MinEnquiryDateFilter)
                        .WhereIf(input.MaxEnquiryDateFilter != null, e => e.EnquiryDate <= input.MaxEnquiryDateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var query = (from o in filteredCreditScores
                         join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetCreditScoreForViewDto()
                         {
                             CreditScore = new CreditScoreDto
                             {
                                 Score = o.Score,
                                 EnquiryDate = o.EnquiryDate,
                                 Id = o.Id
                             },
                             UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                         });

            var creditScoreListDtos = await query.ToListAsync();

            return _creditScoresExcelExporter.ExportToFile(creditScoreListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_CreditScores)]
        public async Task<PagedResultDto<CreditScoreUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_userRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var userList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<CreditScoreUserLookupTableDto>();
            foreach (var user in userList)
            {
                lookupTableDtoList.Add(new CreditScoreUserLookupTableDto
                {
                    Id = user.Id,
                    DisplayName = user.Name?.ToString()
                });
            }

            return new PagedResultDto<CreditScoreUserLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }
    }
}