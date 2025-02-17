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
    //[AbpAuthorize(AppPermissions.Pages_Administration_Owners)]
    public class OwnersAppService : PortalAppServiceBase, IOwnersAppService
    {
        private readonly IRepository<Owner, long> _ownerRepository;
        private readonly IOwnersExcelExporter _ownersExcelExporter;
        private readonly IRepository<User, long> _lookup_userRepository;

        public OwnersAppService(IRepository<Owner, long> ownerRepository, IOwnersExcelExporter ownersExcelExporter, IRepository<User, long> lookup_userRepository)
        {
            _ownerRepository = ownerRepository;
            _ownersExcelExporter = ownersExcelExporter;
            _lookup_userRepository = lookup_userRepository;

        }

        public async Task<PagedResultDto<GetOwnerForViewDto>> GetAll(GetAllOwnersInput input)
        {

            var filteredOwners = _ownerRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Surname.Contains(input.Filter) || e.EmailAddress.Contains(input.Filter) || e.PhoneNumber.Contains(input.Filter) || e.IdentityOrPassport.Contains(input.Filter) || e.Race.Contains(input.Filter) || e.VerificationRecordJson.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SurnameFilter), e => e.Surname == input.SurnameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.EmailAddressFilter), e => e.EmailAddress == input.EmailAddressFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.PhoneNumberFilter), e => e.PhoneNumber == input.PhoneNumberFilter)
                        .WhereIf(input.IsPhoneNumberConfirmedFilter.HasValue && input.IsPhoneNumberConfirmedFilter > -1, e => (input.IsPhoneNumberConfirmedFilter == 1 && e.IsPhoneNumberConfirmed) || (input.IsPhoneNumberConfirmedFilter == 0 && !e.IsPhoneNumberConfirmed))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.IdentityOrPassportFilter), e => e.IdentityOrPassport == input.IdentityOrPassportFilter)
                        .WhereIf(input.IsIdentityOrPassportConfirmedFilter.HasValue && input.IsIdentityOrPassportConfirmedFilter > -1, e => (input.IsIdentityOrPassportConfirmedFilter == 1 && e.IsIdentityOrPassportConfirmed) || (input.IsIdentityOrPassportConfirmedFilter == 0 && !e.IsIdentityOrPassportConfirmed))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.RaceFilter), e => e.Race == input.RaceFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.VerificationRecordJsonFilter), e => e.VerificationRecordJson == input.VerificationRecordJsonFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var pagedAndFilteredOwners = filteredOwners
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var owners = from o in pagedAndFilteredOwners
                         join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetOwnerForViewDto()
                         {
                             Owner = new OwnerDto
                             {
                                 Name = o.Name,
                                 Surname = o.Surname,
                                 EmailAddress = o.EmailAddress,
                                 PhoneNumber = o.PhoneNumber,
                                 IsPhoneNumberConfirmed = o.IsPhoneNumberConfirmed,
                                 IdentityOrPassport = o.IdentityOrPassport,
                                 IsIdentityOrPassportConfirmed = o.IsIdentityOrPassportConfirmed,
                                 Race = o.Race,
                                 VerificationRecordJson = o.VerificationRecordJson,
                                 PropertiesJson = o.PropertiesJson,
                                 Id = o.Id
                             },
                             UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                         };

            var totalCount = await filteredOwners.CountAsync();

            return new PagedResultDto<GetOwnerForViewDto>(
                totalCount,
                await owners.ToListAsync()
            );
        }

        public async Task<GetOwnerForViewDto> GetOwnerForView(long id)
        {
            var owner = await _ownerRepository.GetAsync(id);

            var output = new GetOwnerForViewDto { Owner = ObjectMapper.Map<OwnerDto>(owner) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.Owner.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Owners_Edit)]
        public async Task<GetOwnerForEditOutput> GetOwnerForEdit(EntityDto<long> input)
        {
            var owner = await _ownerRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetOwnerForEditOutput { Owner = ObjectMapper.Map<CreateOrEditOwnerDto>(owner) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.Owner.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
        }

        public virtual async Task<long> CreateOrEdit(CreateOrEditOwnerDto input)
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

        //[AbpAuthorize(AppPermissions.Pages_Administration_Owners_Create)]
        protected virtual async Task<long> Create(CreateOrEditOwnerDto input)
        {
            var owner = ObjectMapper.Map<Owner>(input);

            if (AbpSession.TenantId != null)
            {
                owner.TenantId = (int)AbpSession.TenantId;
            }

            return await _ownerRepository.InsertAndGetIdAsync(owner);
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Owners_Edit)]
        protected virtual async Task<long> Update(CreateOrEditOwnerDto input)
        {
            var owner = await _ownerRepository.FirstOrDefaultAsync((long)input.Id);
            ObjectMapper.Map(input, owner);

            return owner.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Owners_Delete)]
        public async Task Delete(EntityDto<long> input)
        {
            await _ownerRepository.DeleteAsync(input.Id);
        }

        [AbpAllowAnonymous]
        public async Task DeleteForUser(long userId)
        {
            await _ownerRepository.HardDeleteAsync(a => a.UserId == userId);
        }

        public async Task<FileDto> GetOwnersToExcel(GetAllOwnersForExcelInput input)
        {

            var filteredOwners = _ownerRepository.GetAll()
                        .Include(e => e.UserFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.Surname.Contains(input.Filter) || e.EmailAddress.Contains(input.Filter) || e.PhoneNumber.Contains(input.Filter) || e.IdentityOrPassport.Contains(input.Filter) || e.Race.Contains(input.Filter) || e.VerificationRecordJson.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SurnameFilter), e => e.Surname == input.SurnameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.EmailAddressFilter), e => e.EmailAddress == input.EmailAddressFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.PhoneNumberFilter), e => e.PhoneNumber == input.PhoneNumberFilter)
                        .WhereIf(input.IsPhoneNumberConfirmedFilter.HasValue && input.IsPhoneNumberConfirmedFilter > -1, e => (input.IsPhoneNumberConfirmedFilter == 1 && e.IsPhoneNumberConfirmed) || (input.IsPhoneNumberConfirmedFilter == 0 && !e.IsPhoneNumberConfirmed))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.IdentityOrPassportFilter), e => e.IdentityOrPassport == input.IdentityOrPassportFilter)
                        .WhereIf(input.IsIdentityOrPassportConfirmedFilter.HasValue && input.IsIdentityOrPassportConfirmedFilter > -1, e => (input.IsIdentityOrPassportConfirmedFilter == 1 && e.IsIdentityOrPassportConfirmed) || (input.IsIdentityOrPassportConfirmedFilter == 0 && !e.IsIdentityOrPassportConfirmed))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.RaceFilter), e => e.Race == input.RaceFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.VerificationRecordJsonFilter), e => e.VerificationRecordJson == input.VerificationRecordJsonFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

            var query = (from o in filteredOwners
                         join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetOwnerForViewDto()
                         {
                             Owner = new OwnerDto
                             {
                                 Name = o.Name,
                                 Surname = o.Surname,
                                 EmailAddress = o.EmailAddress,
                                 PhoneNumber = o.PhoneNumber,
                                 IsPhoneNumberConfirmed = o.IsPhoneNumberConfirmed,
                                 IdentityOrPassport = o.IdentityOrPassport,
                                 IsIdentityOrPassportConfirmed = o.IsIdentityOrPassportConfirmed,
                                 Race = o.Race,
                                 VerificationRecordJson = o.VerificationRecordJson,
                                 PropertiesJson = o.PropertiesJson,
                                 Id = o.Id
                             },
                             UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                         });

            var ownerListDtos = await query.ToListAsync();

            return _ownersExcelExporter.ExportToFile(ownerListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Owners)]
        public async Task<PagedResultDto<OwnerUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_userRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var userList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<OwnerUserLookupTableDto>();
            foreach (var user in userList)
            {
                lookupTableDtoList.Add(new OwnerUserLookupTableDto
                {
                    Id = user.Id,
                    DisplayName = user.Name?.ToString()
                });
            }

            return new PagedResultDto<OwnerUserLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }
    }
}