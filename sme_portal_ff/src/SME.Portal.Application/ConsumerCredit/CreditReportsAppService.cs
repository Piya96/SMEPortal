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

using Abp.Json;
using Abp.Configuration;
using SME.Portal.Authentication;
using SME.Portal.Configuration;
using System.Text;
using Newtonsoft.Json;

namespace SME.Portal.ConsumerCredit
{
    [AbpAuthorize]
    public class CreditReportsAppService : PortalAppServiceBase, ICreditReportsAppService
    {
		private FinfindAzureApiGatewaySettings Settings;

		private readonly IRepository<CreditReport> _creditReportRepository;
        private readonly ICreditReportsExcelExporter _creditReportsExcelExporter;
        private readonly IRepository<User, long> _lookup_userRepository;

        public CreditReportDto GetForCurrentUser()
        {
            var creditReportDto = _creditReportRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
            return ObjectMapper.Map<CreditReportDto>(creditReportDto);
        }

        public CreditReportsAppService(
			IRepository<CreditReport> creditReportRepository,
			ICreditReportsExcelExporter creditReportsExcelExporter,
			IRepository<User, long> lookup_userRepository,
			ISettingManager settingManager
		)
        {
            _creditReportRepository = creditReportRepository;
            _creditReportsExcelExporter = creditReportsExcelExporter;
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

        public async Task<PagedResultDto<GetCreditReportForViewDto>> GetAll(GetAllCreditReportsInput input)
        {

            var filteredCreditReports = _creditReportRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.CreditReportJson.Contains(input.Filter))
                        .WhereIf(input.MinEnquiryDateFilter != null, e => e.EnquiryDate >= input.MinEnquiryDateFilter)
                        .WhereIf(input.MaxEnquiryDateFilter != null, e => e.EnquiryDate <= input.MaxEnquiryDateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var pagedAndFilteredCreditReports = filteredCreditReports
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var creditReports = from o in pagedAndFilteredCreditReports
                                join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                                from s1 in j1.DefaultIfEmpty()

                                select new GetCreditReportForViewDto()
                                {
                                    CreditReport = new CreditReportDto
                                    {
                                        CreditReportJson = o.CreditReportJson,
                                        EnquiryDate = o.EnquiryDate,
                                        Id = o.Id
                                    },
                                    UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                                };

            var totalCount = await filteredCreditReports.CountAsync();

            return new PagedResultDto<GetCreditReportForViewDto>(
                totalCount,
                await creditReports.ToListAsync()
            );
        }

        public async Task<GetCreditReportForViewDto> GetCreditReportForView(int id)
        {
            var creditReport = await _creditReportRepository.GetAsync(id);

            var output = new GetCreditReportForViewDto { CreditReport = ObjectMapper.Map<CreditReportDto>(creditReport) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.CreditReport.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
        }

		/*private async Task<string> HttpRequest(
			CreditReportPOSTArgsDto input
		)
		{
			var ApiUrl = "https://ff-apim.azure-api.net";
			var endpoint = $"/staging/integrations/cpb/creditreport";
			var uri = new Uri(new Uri(ApiUrl), endpoint);
			var uriBuilder = new UriBuilder(uri);

			var jsonPayload = JsonConvert.SerializeObject(input);
			HttpRequestMessage request = new HttpRequestMessage {
				RequestUri = uriBuilder.Uri,
				Method = HttpMethod.Post,
				Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
			};

			request.Headers.Add(Settings.KeyName, Settings.KeyValue);

			HttpResponseMessage response = await new HttpClient().SendAsync(request);

			return await response.Content.ReadAsStringAsync();
		}

		public async Task<CreditReportStatusDto> GetCreditReportByUser(
			CreditReportPOSTArgsDto input
		)
		{
			try
			{
				var creditReportRecord = _creditReportRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
				CreditReportDto creditReportDto = ObjectMapper.Map<CreditReportDto>(creditReportRecord);
				var output = new CreditReportStatusDto();
				output.Status = "Existing";
				if(CanFetchCreditReport(creditReportDto) == true)
				{
					output.Status = "Available";
					if(input.UpdateIfAllowed == true)
					{
						var jsonBlob = await HttpRequest(input);
						CreateOrEditCreditReportDto dto = new CreateOrEditCreditReportDto();
						dto.CreditReportJson = jsonBlob;
						dto.EnquiryDate = DateTime.Now;
						dto.UserId = (long)AbpSession.UserId;
						var id = await InsertAndGetIdAsync(dto);
						creditReportRecord = _creditReportRepository.Get(id);
					}
				}

				return output;
			}
			catch(WebException ex)
			{
				throw new Exception("An error occurred:" + ex.Message);
			}
		}

		private bool CanFetchCreditReport(
			CreditReportDto creditReport
		)
		{
			// TODO: Make sure what EnquiryDate actually means!
			if(creditReport == null || ((DateTime.Now.Date - creditReport.EnquiryDate).Days > 365))
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		public async Task<GetCreditReportForViewDto> GetCreditReportForViewByUser()
		{
			try
			{
				// TODO: Error checking!!!
				var creditReportRecord = _creditReportRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
				CreditReportDto creditReportDto = ObjectMapper.Map<CreditReportDto>(creditReportRecord);
				var output = new GetCreditReportForViewDto { CreditReport = ObjectMapper.Map<CreditReportDto>(creditReportRecord) };
				var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.CreditReport.UserId);
				output.UserName = _lookupUser?.Name?.ToString();
				return output;
			}
			catch(WebException ex)
			{
				throw new Exception("An error occurred:" + ex.Message);
			}
		}*/

		[AbpAuthorize(AppPermissions.Pages_CreditReports_Edit)]
        public async Task<GetCreditReportForEditOutput> GetCreditReportForEdit(EntityDto input)
        {
            var creditReport = await _creditReportRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetCreditReportForEditOutput { CreditReport = ObjectMapper.Map<CreateOrEditCreditReportDto>(creditReport) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.CreditReport.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditCreditReportDto input)
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

        ////[AbpAuthorize(AppPermissions.Pages_CreditReports_Create)]
        protected virtual async Task Create(CreateOrEditCreditReportDto input)
        {
            var creditReport = ObjectMapper.Map<CreditReport>(input);

            if (AbpSession.TenantId != null)
            {
                creditReport.TenantId = (int?)AbpSession.TenantId;
            }

            await _creditReportRepository.InsertAsync(creditReport);
        }

		protected virtual async Task<int> InsertAndGetIdAsync(
			CreateOrEditCreditReportDto input
		)
		{
			var creditReport = ObjectMapper.Map<CreditReport>(input);

			if(AbpSession.TenantId != null)
			{
				creditReport.TenantId = (int?)AbpSession.TenantId;
			}

			return await _creditReportRepository.InsertAndGetIdAsync(creditReport);
		}

		[AbpAuthorize(AppPermissions.Pages_CreditReports_Edit)]
        protected virtual async Task Update(CreateOrEditCreditReportDto input)
        {
            var creditReport = await _creditReportRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, creditReport);
        }

        [AbpAuthorize(AppPermissions.Pages_CreditReports_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _creditReportRepository.DeleteAsync(input.Id);
        }

        [AbpAllowAnonymous]
        public async Task DeleteForUser(long userId)
        {
            await _creditReportRepository.DeleteAsync(a => a.UserId == userId);
        }

        public async Task<FileDto> GetCreditReportsToExcel(GetAllCreditReportsForExcelInput input)
        {

            var filteredCreditReports = _creditReportRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.CreditReportJson.Contains(input.Filter))
                        .WhereIf(input.MinEnquiryDateFilter != null, e => e.EnquiryDate >= input.MinEnquiryDateFilter)
                        .WhereIf(input.MaxEnquiryDateFilter != null, e => e.EnquiryDate <= input.MaxEnquiryDateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var query = (from o in filteredCreditReports
                         join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetCreditReportForViewDto()
                         {
                             CreditReport = new CreditReportDto
                             {
                                 CreditReportJson = o.CreditReportJson,
                                 EnquiryDate = o.EnquiryDate,
                                 Id = o.Id
                             },
                             UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                         });

            var creditReportListDtos = await query.ToListAsync();

            return _creditReportsExcelExporter.ExportToFile(creditReportListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_CreditReports)]
        public async Task<PagedResultDto<CreditReportUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_userRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var userList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<CreditReportUserLookupTableDto>();
            foreach (var user in userList)
            {
                lookupTableDtoList.Add(new CreditReportUserLookupTableDto
                {
                    Id = user.Id,
                    DisplayName = user.Name?.ToString()
                });
            }

            return new PagedResultDto<CreditReportUserLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }
    }
}