using SME.Portal.Authorization.Users;

using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.Company.Exporting;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;

namespace SME.Portal.Company
{
    [AbpAuthorize]
    //[AbpAuthorize(AppPermissions.Pages_Administration_SmeCompanies)]
    public class SmeCompaniesAppService : PortalAppServiceBase, ISmeCompaniesAppService
    {
        private readonly IRepository<SmeCompany> _smeCompanyRepository;
        private readonly ISmeCompaniesExcelExporter _smeCompaniesExcelExporter;
        private readonly IRepository<User, long> _lookup_userRepository;

        public SmeCompaniesAppService(IRepository<SmeCompany> smeCompanyRepository, ISmeCompaniesExcelExporter smeCompaniesExcelExporter, IRepository<User, long> lookup_userRepository)
        {
            _smeCompanyRepository = smeCompanyRepository;
            _smeCompaniesExcelExporter = smeCompaniesExcelExporter;
            _lookup_userRepository = lookup_userRepository;

        }

        public async Task<PagedResultDto<GetSmeCompanyForViewDto>> GetAll(GetAllSmeCompaniesInput input)
        {

            var filteredSmeCompanies = _smeCompanyRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.RegistrationNumber.Contains(input.Filter) || e.Type.Contains(input.Filter) || e.RegisteredAddress.Contains(input.Filter) || e.VerificationRecordJson.Contains(input.Filter) || e.Customers.Contains(input.Filter) || e.BeeLevel.Contains(input.Filter) || e.Industries.Contains(input.Filter) || e.PropertiesJson.Contains(input.Filter) || e.WebSite.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.RegistrationNumberFilter), e => e.RegistrationNumber == input.RegistrationNumberFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.TypeFilter), e => e.Type == input.TypeFilter)
                        .WhereIf(input.MinRegistrationDateFilter != null, e => e.RegistrationDate >= input.MinRegistrationDateFilter)
                        .WhereIf(input.MaxRegistrationDateFilter != null, e => e.RegistrationDate <= input.MaxRegistrationDateFilter)
                        .WhereIf(input.MinStartedTradingDateFilter != null, e => e.StartedTradingDate >= input.MinStartedTradingDateFilter)
                        .WhereIf(input.MaxStartedTradingDateFilter != null, e => e.StartedTradingDate <= input.MaxStartedTradingDateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.RegisteredAddressFilter), e => e.RegisteredAddress == input.RegisteredAddressFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CustomersFilter), e => e.Customers == input.CustomersFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.PropertiesJsonFilter), e => e.PropertiesJson == input.PropertiesJsonFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.WebSiteFilter), e => e.WebSite == input.WebSiteFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var pagedAndFilteredSmeCompanies = filteredSmeCompanies
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var smeCompanies = from o in pagedAndFilteredSmeCompanies
                               join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                               from s1 in j1.DefaultIfEmpty()

                               select new GetSmeCompanyForViewDto()
                               {
                                   SmeCompany = new SmeCompanyDto
                                   {
                                       Name = o.Name,
                                       RegistrationNumber = o.RegistrationNumber,
                                       Type = o.Type,
                                       RegistrationDate = o.RegistrationDate,
                                       StartedTradingDate = o.StartedTradingDate,
                                       RegisteredAddress = o.RegisteredAddress,
                                       VerificationRecordJson = o.VerificationRecordJson,
                                       Customers = o.Customers,
                                       BeeLevel = o.BeeLevel,
                                       Industries = o.Industries,
                                       PropertiesJson = o.PropertiesJson,
                                       WebSite = o.WebSite,
                                       Id = o.Id
                                   },
                                   UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                               };

            var totalCount = await filteredSmeCompanies.CountAsync();

            return new PagedResultDto<GetSmeCompanyForViewDto>(
                totalCount,
                await smeCompanies.ToListAsync()
            );
        }

        public async Task<GetSmeCompanyForViewDto> GetSmeCompanyForView(int id)
        {
            var smeCompany = await _smeCompanyRepository.GetAsync(id);

            var output = new GetSmeCompanyForViewDto { SmeCompany = ObjectMapper.Map<SmeCompanyDto>(smeCompany) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.SmeCompany.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_SmeCompanies_Edit)]
        public async Task<GetSmeCompanyForEditOutput> GetSmeCompanyForEdit(EntityDto input)
        {
            var smeCompany = await _smeCompanyRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetSmeCompanyForEditOutput { SmeCompany = ObjectMapper.Map<CreateOrEditSmeCompanyDto>(smeCompany) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.SmeCompany.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
        }

        public virtual async Task<int> CreateOrEdit(CreateOrEditSmeCompanyDto input)
        {
            if (input.Id == null)
            {
                return await Create(input);
            }
            else
            {
                return await Update(input);
            }
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_SmeCompanies_Create)]
        protected virtual async Task<int> Create(CreateOrEditSmeCompanyDto input)
        {
            await CanCreate(input);

            var smeCompany = ObjectMapper.Map<SmeCompany>(input);

            if (AbpSession.TenantId != null)
                smeCompany.TenantId = (int)AbpSession.TenantId;

            var id = await _smeCompanyRepository.InsertAndGetIdAsync(smeCompany);

            return id;
        }

        private async Task CanCreate(CreateOrEditSmeCompanyDto input)
        {
            if (AbpSession.UserId.HasValue)
            {
                if(await _smeCompanyRepository.CountAsync(x => x.UserId == AbpSession.UserId) > 5)
                {
                    var message = $"Additional Companies cannot be Created for current UserId: {AbpSession.UserId.Value}";
                    Logger.Warn(message);
                    throw new SystemException(message);
                }
            }
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_SmeCompanies_Edit)]
        protected virtual async Task<int> Update(CreateOrEditSmeCompanyDto input)
        {
            var smeCompany = await _smeCompanyRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, smeCompany);

            return smeCompany.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_SmeCompanies_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _smeCompanyRepository.DeleteAsync(input.Id);
        }

        public async Task HardDeleteForUser(long userId)
        {
            await _smeCompanyRepository.HardDeleteAsync(a => a.UserId == userId);
        }

        public async Task<FileDto> GetSmeCompaniesToExcel(GetAllSmeCompaniesForExcelInput input)
        {

            var filteredSmeCompanies = _smeCompanyRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.RegistrationNumber.Contains(input.Filter) || e.Type.Contains(input.Filter) || e.RegisteredAddress.Contains(input.Filter) || e.VerificationRecordJson.Contains(input.Filter) || e.Customers.Contains(input.Filter) || e.BeeLevel.Contains(input.Filter) || e.Industries.Contains(input.Filter) || e.PropertiesJson.Contains(input.Filter) || e.WebSite.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.RegistrationNumberFilter), e => e.RegistrationNumber == input.RegistrationNumberFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.TypeFilter), e => e.Type == input.TypeFilter)
                        .WhereIf(input.MinRegistrationDateFilter != null, e => e.RegistrationDate >= input.MinRegistrationDateFilter)
                        .WhereIf(input.MaxRegistrationDateFilter != null, e => e.RegistrationDate <= input.MaxRegistrationDateFilter)
                        .WhereIf(input.MinStartedTradingDateFilter != null, e => e.StartedTradingDate >= input.MinStartedTradingDateFilter)
                        .WhereIf(input.MaxStartedTradingDateFilter != null, e => e.StartedTradingDate <= input.MaxStartedTradingDateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.RegisteredAddressFilter), e => e.RegisteredAddress == input.RegisteredAddressFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.CustomersFilter), e => e.Customers == input.CustomersFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.PropertiesJsonFilter), e => e.PropertiesJson == input.PropertiesJsonFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.WebSiteFilter), e => e.WebSite == input.WebSiteFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var query = (from o in filteredSmeCompanies
                         join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetSmeCompanyForViewDto()
                         {
                             SmeCompany = new SmeCompanyDto
                             {
                                 Name = o.Name,
                                 RegistrationNumber = o.RegistrationNumber,
                                 Type = o.Type,
                                 RegistrationDate = o.RegistrationDate,
                                 StartedTradingDate = o.StartedTradingDate,
                                 RegisteredAddress = o.RegisteredAddress,
                                 VerificationRecordJson = o.VerificationRecordJson,
                                 Customers = o.Customers,
                                 BeeLevel = o.BeeLevel,
                                 Industries = o.Industries,
                                 PropertiesJson = o.PropertiesJson,
                                 WebSite = o.WebSite,
                                 Id = o.Id
                             },
                             UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                         });

            var smeCompanyListDtos = await query.ToListAsync();

            return _smeCompaniesExcelExporter.ExportToFile(smeCompanyListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_SmeCompanies)]
        public async Task<PagedResultDto<SmeCompanyUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_userRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var userList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<SmeCompanyUserLookupTableDto>();
            foreach (var user in userList)
            {
                lookupTableDtoList.Add(new SmeCompanyUserLookupTableDto
                {
                    Id = user.Id,
                    DisplayName = user.Name?.ToString()
                });
            }

            return new PagedResultDto<SmeCompanyUserLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

        virtual public Task<bool> BackgroundChecksResult(int id)
        {
            throw new NotImplementedException();
        }
    }
}