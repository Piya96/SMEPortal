using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.SME.Exporting;
using SME.Portal.SME.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using Abp.Runtime.Session;

using SME.Portal.Lenders;
using SME.Portal.Common.Dto;
using SME.Portal.List;
using System;
using Abp.Threading;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using Abp.BackgroundJobs;
using Abp.MultiTenancy;
using Newtonsoft.Json;

namespace SME.Portal.SME
{
    [AbpAuthorize]
    public class ApplicationsAppService : PortalAppServiceBase, IApplicationsAppService
    {
        private readonly IRepository<Match> _matchRepository;
        private readonly IRepository<Application> _applicationRepository;
        private readonly IApplicationsExcelExporter _applicationsExcelExporter;
        private readonly IRepository<User, long> _lookup_userRepository;
        private readonly IRepository<SmeCompany, int> _lookup_smeCompanyRepository;
        private readonly IAbpSession _session;
        private readonly IRepository<Owner, long> _ownerRepository;
        private readonly IRepository<ListItem, int> _listRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;
        protected readonly ITenantCache _tenantCache;

        public ApplicationsAppService(
            IRepository<Match> matchRepository,
            IRepository<Application> applicationRepository,
            IApplicationsExcelExporter applicationsExcelExporter,
            IRepository<User, long> lookup_userRepository,
            IRepository<SmeCompany, int> lookup_smeCompanyRepository,
            IAbpSession session,
            IRepository<Owner, long> ownerRepository,
            IRepository<ListItem, int> listRepository,
            IBackgroundJobManager backgroundJobManager,
            ITenantCache tenantCache)
        {
            _matchRepository = matchRepository;
            _applicationRepository = applicationRepository;
            _applicationsExcelExporter = applicationsExcelExporter;
            _lookup_userRepository = lookup_userRepository;
            _lookup_smeCompanyRepository = lookup_smeCompanyRepository;
            _session = session;
            _ownerRepository = ownerRepository;
            _listRepository = listRepository;
            _backgroundJobManager = backgroundJobManager;
            _tenantCache = tenantCache;
        }

        public async Task<PagedResultDto<GetApplicationForViewDto>> GetAll(GetAllApplicationsInput input)
        {

            var filteredApplications = _applicationRepository.GetAll()
                        .Include(e => e.UserFk)
                        .Include(e => e.SmeCompanyFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.MatchCriteriaJson.Contains(input.Filter) || e.Status.Contains(input.Filter))
                        .WhereIf(input.MinLockedFilter != null, e => e.Locked >= input.MinLockedFilter)
                        .WhereIf(input.MaxLockedFilter != null, e => e.Locked <= input.MaxLockedFilter)
                        .WhereIf(input.UserId.HasValue, e => e.UserFk.Id == input.UserId.Value)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.StatusFilter), e => e.Status == input.StatusFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.UserName == input.UserNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SmeCompanyNameFilter), e => e.SmeCompanyFk != null && e.SmeCompanyFk.Name == input.SmeCompanyNameFilter)
                        .WhereIf(input.SmeCompanyId.HasValue, e => e.SmeCompanyFk != null && e.SmeCompanyFk.Id == input.SmeCompanyId.Value);

            var pagedAndFilteredApplications = filteredApplications
                 .OrderBy(input.Sorting ?? "id asc")
                 .PageBy(input);

            var applications = from o in pagedAndFilteredApplications
                               join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                               from s1 in j1.DefaultIfEmpty()

                               join o2 in _lookup_smeCompanyRepository.GetAll() on o.SmeCompanyId equals o2.Id into j2
                               from s2 in j2.DefaultIfEmpty()

                               select new GetApplicationForViewDto()
                               {
                                   Application = new ApplicationDto
                                   {
                                       Locked = o.Locked,
                                       Status = o.Status,
                                       Id = o.Id,
                                       SmeCompanyId = o.SmeCompanyId,
                                       MatchCriteriaJson = o.MatchCriteriaJson,
                                       Created = o.CreationTime,
									   LastModificationTime = o.LastModificationTime
								   },
                                   UserName = s1 == null || s1.UserName == null ? "" : s1.UserName.ToString(),
                                   SmeCompanyName = s2 == null || s2.Name == null ? "" : s2.Name.ToString()
                               };

            var totalCount = await filteredApplications.CountAsync();

            return new PagedResultDto<GetApplicationForViewDto>(
                totalCount,
                await applications.ToListAsync()
            );
        }

        [AbpAllowAnonymous]
        public async Task<GetApplicationForViewDto> GetApplicationForView(int id)
        {
            var application = await _applicationRepository.GetAsync(id);

            var output = new GetApplicationForViewDto { Application = ObjectMapper.Map<ApplicationDto>(application) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.Application.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            var _lookupSmeCompany = await _lookup_smeCompanyRepository.FirstOrDefaultAsync((int)output.Application.SmeCompanyId);
            output.SmeCompanyName = _lookupSmeCompany?.Name?.ToString();

            return output;
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Applications_Edit)]
        public async Task<GetApplicationForEditOutput> GetApplicationForEdit(EntityDto input)
        {
            var application = await _applicationRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetApplicationForEditOutput { Application = ObjectMapper.Map<CreateOrEditApplicationDto>(application) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.Application.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            var _lookupSmeCompany = await _lookup_smeCompanyRepository.FirstOrDefaultAsync((int)output.Application.SmeCompanyId);
            output.SmeCompanyName = _lookupSmeCompany?.Name?.ToString();

            return output;
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Applications_Create)]
        public virtual async Task<int> CreateOrEdit(CreateOrEditApplicationDto input)
        {
            if (input.Id == null)
            {
                return await Create(input);
            }
            else
            {
                await Update(input);

                return (int)input.Id;
            }
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Applications_Create)]
        protected virtual async Task<int> Create(CreateOrEditApplicationDto input)
        {
            var application = ObjectMapper.Map<Application>(input);

            if (AbpSession.TenantId != null)
            {
                application.TenantId = (int?)AbpSession.TenantId;
            }

            return await _applicationRepository.InsertAndGetIdAsync(application);
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Applications_Edit)]
        protected virtual async Task Update(CreateOrEditApplicationDto input)
        {
            var application = await _applicationRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, application);
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Applications_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _applicationRepository.DeleteAsync(input.Id);
        }

        //[AbpAllowAnonymous]
        public async Task HardDelete(EntityDto input)
        {
            await _applicationRepository.HardDeleteAsync(a => a.Id == input.Id);
        }

        public async Task<FileDto> GetApplicationsToExcel(GetAllApplicationsForExcelInput input)
        {

            var filteredApplications = _applicationRepository.GetAll()
                        .Include(e => e.UserFk)
                        .Include(e => e.SmeCompanyFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.MatchCriteriaJson.Contains(input.Filter) || e.Status.Contains(input.Filter))
                        .WhereIf(input.MinLockedFilter != null, e => e.Locked >= input.MinLockedFilter)
                        .WhereIf(input.MaxLockedFilter != null, e => e.Locked <= input.MaxLockedFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.StatusFilter), e => e.Status == input.StatusFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SmeCompanyNameFilter), e => e.SmeCompanyFk != null && e.SmeCompanyFk.Name == input.SmeCompanyNameFilter);

            var query = (from o in filteredApplications
                         join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         join o2 in _lookup_smeCompanyRepository.GetAll() on o.SmeCompanyId equals o2.Id into j2
                         from s2 in j2.DefaultIfEmpty()

                         select new GetApplicationForViewDto()
                         {
                             Application = new ApplicationDto
                             {
                                 Locked = o.Locked,
                                 Status = o.Status,
                                 Id = o.Id
                             },
                             UserName = s1 == null || s1.Name == null ? "" : s1.Name.ToString(),
                             SmeCompanyName = s2 == null || s2.Name == null ? "" : s2.Name.ToString()
                         });

            var applicationListDtos = await query.ToListAsync();

            return _applicationsExcelExporter.ExportToFile(applicationListDtos);
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Applications)]
        public async Task<PagedResultDto<ApplicationUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_userRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var userList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<ApplicationUserLookupTableDto>();
            foreach (var user in userList)
            {
                lookupTableDtoList.Add(new ApplicationUserLookupTableDto
                {
                    Id = user.Id,
                    DisplayName = user.Name?.ToString()
                });
            }

            return new PagedResultDto<ApplicationUserLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Applications)]
        public async Task<PagedResultDto<ApplicationSmeCompanyLookupTableDto>> GetAllSmeCompanyForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_smeCompanyRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var smeCompanyList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<ApplicationSmeCompanyLookupTableDto>();
            foreach (var smeCompany in smeCompanyList)
            {
                lookupTableDtoList.Add(new ApplicationSmeCompanyLookupTableDto
                {
                    Id = smeCompany.Id,
                    DisplayName = smeCompany.Name?.ToString()
                });
            }

            return new PagedResultDto<ApplicationSmeCompanyLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }

        public async Task<IList<ApplicationDto>> GetLockedApplicationsByUserId(long userId)
        {
            var applications = await _applicationRepository
                                                    .GetAll()
                                                    .Where(a => a.Status == "Locked"
                                                    && a.IsDeleted == false
                                                    && a.UserId == userId
                                                    ).Select(a => new ApplicationDto
                                                    {
                                                        Status = a.Status,
                                                        Id = a.Id,
                                                        SmeCompanyId = a.SmeCompanyId,
                                                        UserId = a.UserId,
                                                        TenantId = a.TenantId.Value
                                                    }).ToListAsync();

            return applications;
        }

        public Task<string> AddSefaLASApplicationNo(CreateOrEditApplicationDto appForEditDto, string dataJson = "")
        {
            throw new NotImplementedException();
        }
        
    }
}