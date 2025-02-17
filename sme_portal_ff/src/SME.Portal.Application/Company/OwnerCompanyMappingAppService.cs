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
    //[AbpAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping)]
    public class OwnerCompanyMappingAppService : PortalAppServiceBase, IOwnerCompanyMappingAppService
    {
        private readonly IRepository<OwnerCompanyMap> _ownerCompanyMapRepository;
        private readonly IOwnerCompanyMappingExcelExporter _ownerCompanyMappingExcelExporter;
        private readonly IRepository<Owner, long> _lookup_ownerRepository;
        private readonly IRepository<SmeCompany, int> _lookup_smeCompanyRepository;

        public OwnerCompanyMappingAppService(IRepository<OwnerCompanyMap> ownerCompanyMapRepository, IOwnerCompanyMappingExcelExporter ownerCompanyMappingExcelExporter, IRepository<Owner, long> lookup_ownerRepository, IRepository<SmeCompany, int> lookup_smeCompanyRepository)
        {
            _ownerCompanyMapRepository = ownerCompanyMapRepository;
            _ownerCompanyMappingExcelExporter = ownerCompanyMappingExcelExporter;
            _lookup_ownerRepository = lookup_ownerRepository;
            _lookup_smeCompanyRepository = lookup_smeCompanyRepository;

        }

        public async Task<PagedResultDto<GetOwnerCompanyMapForViewDto>> GetAll(GetAllOwnerCompanyMappingInput input)
        {

            var filteredOwnerCompanyMapping = _ownerCompanyMapRepository.GetAll()
                        .Include(e => e.OwnerFk)
                        .Include(e => e.SmeCompanyFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false)
                        .WhereIf(input.IsPrimaryOwnerFilter.HasValue && input.IsPrimaryOwnerFilter > -1, e => (input.IsPrimaryOwnerFilter == 1 && e.IsPrimaryOwner) || (input.IsPrimaryOwnerFilter == 0 && !e.IsPrimaryOwner))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.OwnerIdentityOrPassportFilter), e => e.OwnerFk != null && e.OwnerFk.IdentityOrPassport == input.OwnerIdentityOrPassportFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SmeCompanyRegistrationNumberFilter), e => e.SmeCompanyFk != null && e.SmeCompanyFk.RegistrationNumber == input.SmeCompanyRegistrationNumberFilter);

            var pagedAndFilteredOwnerCompanyMapping = filteredOwnerCompanyMapping
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var ownerCompanyMapping = from o in pagedAndFilteredOwnerCompanyMapping
                                      join o1 in _lookup_ownerRepository.GetAll() on o.OwnerId equals o1.Id into j1
                                      from s1 in j1.DefaultIfEmpty()

                                      join o2 in _lookup_smeCompanyRepository.GetAll() on o.SmeCompanyId equals o2.Id into j2
                                      from s2 in j2.DefaultIfEmpty()

                                      select new GetOwnerCompanyMapForViewDto()
                                      {
                                          OwnerCompanyMap = new OwnerCompanyMapDto
                                          {
                                              IsPrimaryOwner = o.IsPrimaryOwner,
                                              Id = o.Id
                                          },
                                          OwnerIdentityOrPassport = s1 == null || s1.IdentityOrPassport == null ? "" : s1.IdentityOrPassport.ToString(),
                                          SmeCompanyRegistrationNumber = s2 == null || s2.RegistrationNumber == null ? "" : s2.RegistrationNumber.ToString()
                                      };

            var totalCount = await filteredOwnerCompanyMapping.CountAsync();

            return new PagedResultDto<GetOwnerCompanyMapForViewDto>(
                totalCount,
                await ownerCompanyMapping.ToListAsync()
            );
        }

        [AbpAllowAnonymous]
        public async Task<List<OwnerCompanyMapDto>> GetAllForUserId(long userId)
        {
            var result = await _ownerCompanyMapRepository.GetAllListAsync(a => a.UserId == userId);
            return result.Select(a => new OwnerCompanyMapDto
            {
                Id = a.Id,
                IsPrimaryOwner = a.IsPrimaryOwner,
                OwnerId = a.OwnerId,
                SmeCompanyId = a.SmeCompanyId,
                UserId = a.UserId
            }).ToList();
        }

        public async Task<GetOwnerCompanyMapForViewDto> GetOwnerCompanyMapForView(int id)
        {
            var ownerCompanyMap = await _ownerCompanyMapRepository.GetAsync(id);

            var output = new GetOwnerCompanyMapForViewDto { OwnerCompanyMap = ObjectMapper.Map<OwnerCompanyMapDto>(ownerCompanyMap) };

            if (output.OwnerCompanyMap.OwnerId != null)
            {
                var _lookupOwner = await _lookup_ownerRepository.FirstOrDefaultAsync((long)output.OwnerCompanyMap.OwnerId);
                output.OwnerIdentityOrPassport = _lookupOwner?.IdentityOrPassport?.ToString();
            }

            if (output.OwnerCompanyMap.SmeCompanyId != null)
            {
                var _lookupSmeCompany = await _lookup_smeCompanyRepository.FirstOrDefaultAsync((int)output.OwnerCompanyMap.SmeCompanyId);
                output.SmeCompanyRegistrationNumber = _lookupSmeCompany?.RegistrationNumber?.ToString();
            }

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping_Edit)]
        public async Task<GetOwnerCompanyMapForEditOutput> GetOwnerCompanyMapForEdit(EntityDto input)
        {
            var ownerCompanyMap = await _ownerCompanyMapRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetOwnerCompanyMapForEditOutput { OwnerCompanyMap = ObjectMapper.Map<CreateOrEditOwnerCompanyMapDto>(ownerCompanyMap) };

            if (output.OwnerCompanyMap.OwnerId != null)
            {
                var _lookupOwner = await _lookup_ownerRepository.FirstOrDefaultAsync((long)output.OwnerCompanyMap.OwnerId);
                output.OwnerIdentityOrPassport = _lookupOwner?.IdentityOrPassport?.ToString();
            }

            if (output.OwnerCompanyMap.SmeCompanyId != null)
            {
                var _lookupSmeCompany = await _lookup_smeCompanyRepository.FirstOrDefaultAsync((int)output.OwnerCompanyMap.SmeCompanyId);
                output.SmeCompanyRegistrationNumber = _lookupSmeCompany?.RegistrationNumber?.ToString();
            }

            return output;
        }

        public async Task<int> CreateOrEdit(CreateOrEditOwnerCompanyMapDto input)
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

        //[AbpAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping_Create)]
        protected virtual async Task<int> Create(CreateOrEditOwnerCompanyMapDto input)
        {
            var ownerCompanyMap = ObjectMapper.Map<OwnerCompanyMap>(input);

            if (AbpSession.TenantId != null)
            {
                ownerCompanyMap.TenantId = (int)AbpSession.TenantId;
            }

            if (AbpSession.UserId != null)
            {
                ownerCompanyMap.UserId = (int)AbpSession.UserId;
            }

            return await _ownerCompanyMapRepository.InsertAndGetIdAsync(ownerCompanyMap);
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping_Edit)]
        protected virtual async Task<int> Update(CreateOrEditOwnerCompanyMapDto input)
        {
            var ownerCompanyMap = await _ownerCompanyMapRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, ownerCompanyMap);

            return ownerCompanyMap.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _ownerCompanyMapRepository.DeleteAsync(input.Id);
        }

        [AbpAllowAnonymous]
        public async Task HardDeleteForUser(long userId)
        {
            await _ownerCompanyMapRepository.HardDeleteAsync(a => a.UserId == userId);
        }

        public async Task<FileDto> GetOwnerCompanyMappingToExcel(GetAllOwnerCompanyMappingForExcelInput input)
        {

            var filteredOwnerCompanyMapping = _ownerCompanyMapRepository.GetAll()
                        .Include(e => e.OwnerFk)
                        .Include(e => e.SmeCompanyFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false)
                        .WhereIf(input.IsPrimaryOwnerFilter.HasValue && input.IsPrimaryOwnerFilter > -1, e => (input.IsPrimaryOwnerFilter == 1 && e.IsPrimaryOwner) || (input.IsPrimaryOwnerFilter == 0 && !e.IsPrimaryOwner))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.OwnerIdentityOrPassportFilter), e => e.OwnerFk != null && e.OwnerFk.IdentityOrPassport == input.OwnerIdentityOrPassportFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SmeCompanyRegistrationNumberFilter), e => e.SmeCompanyFk != null && e.SmeCompanyFk.RegistrationNumber == input.SmeCompanyRegistrationNumberFilter);

            var query = (from o in filteredOwnerCompanyMapping
                         join o1 in _lookup_ownerRepository.GetAll() on o.OwnerId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         join o2 in _lookup_smeCompanyRepository.GetAll() on o.SmeCompanyId equals o2.Id into j2
                         from s2 in j2.DefaultIfEmpty()

                         select new GetOwnerCompanyMapForViewDto()
                         {
                             OwnerCompanyMap = new OwnerCompanyMapDto
                             {
                                 IsPrimaryOwner = o.IsPrimaryOwner,
                                 Id = o.Id
                             },
                             OwnerIdentityOrPassport = s1 == null || s1.IdentityOrPassport == null ? "" : s1.IdentityOrPassport.ToString(),
                             SmeCompanyRegistrationNumber = s2 == null || s2.RegistrationNumber == null ? "" : s2.RegistrationNumber.ToString()
                         });

            var ownerCompanyMapListDtos = await query.ToListAsync();

            return _ownerCompanyMappingExcelExporter.ExportToFile(ownerCompanyMapListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping)]
        public async Task<PagedResultDto<OwnerCompanyMapOwnerLookupTableDto>> GetAllOwnerForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_ownerRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.IdentityOrPassport != null && e.IdentityOrPassport.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var ownerList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<OwnerCompanyMapOwnerLookupTableDto>();
            foreach (var owner in ownerList)
            {
                lookupTableDtoList.Add(new OwnerCompanyMapOwnerLookupTableDto
                {
                    Id = owner.Id,
                    DisplayName = owner.IdentityOrPassport?.ToString()
                });
            }

            return new PagedResultDto<OwnerCompanyMapOwnerLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping)]
        public async Task<PagedResultDto<OwnerCompanyMapSmeCompanyLookupTableDto>> GetAllSmeCompanyForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_smeCompanyRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.RegistrationNumber != null && e.RegistrationNumber.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var smeCompanyList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<OwnerCompanyMapSmeCompanyLookupTableDto>();
            foreach (var smeCompany in smeCompanyList)
            {
                lookupTableDtoList.Add(new OwnerCompanyMapSmeCompanyLookupTableDto
                {
                    Id = smeCompany.Id,
                    DisplayName = smeCompany.RegistrationNumber?.ToString()
                });
            }

            return new PagedResultDto<OwnerCompanyMapSmeCompanyLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }
    }
}