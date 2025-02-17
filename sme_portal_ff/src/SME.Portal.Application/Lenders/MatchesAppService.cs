using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.Lenders.Exporting;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;

namespace SME.Portal.Lenders
{
    //[AbpAuthorize(AppPermissions.Pages_Administration_Matches)]
    [AbpAuthorize]
    public class MatchesAppService : PortalAppServiceBase, IMatchesAppService
    {
        private readonly IRepository<Match> _matchRepository;
        private readonly IMatchesExcelExporter _matchesExcelExporter;
        private readonly IFinanceProductsAppService _financeProductsAppService;

        public MatchesAppService(IRepository<Match> matchRepository, IMatchesExcelExporter matchesExcelExporter, IFinanceProductsAppService financeProductsAppService)
        {
            _matchRepository = matchRepository;
            _matchesExcelExporter = matchesExcelExporter;
            _financeProductsAppService = financeProductsAppService;
        }

        [AbpAllowAnonymous]
        public async Task<PagedResultDto<GetMatchForViewDto>> GetAll(GetAllMatchesInput input)
        {

            var filteredMatches = _matchRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Notes.Contains(input.Filter) || e.LeadDisplayName.Contains(input.Filter) || e.FinanceProductIds.Contains(input.Filter) || e.ExclusionIds.Contains(input.Filter))
                        .WhereIf(input.MinApplicationIdFilter != null, e => e.ApplicationId >= input.MinApplicationIdFilter)
                        .WhereIf(input.MaxApplicationIdFilter != null, e => e.ApplicationId <= input.MaxApplicationIdFilter)
                        .WhereIf(input.ApplicationIdsFilter.Any(), e => input.ApplicationIdsFilter.Any(b => e.ApplicationId == b))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.LeadDisplayNameFilter), e => e.LeadDisplayName == input.LeadDisplayNameFilter)
                        .WhereIf(input.MatchSuccessfulFilter.HasValue && input.MatchSuccessfulFilter > -1, e => (input.MatchSuccessfulFilter == 1 && e.MatchSuccessful) || (input.MatchSuccessfulFilter == 0 && !e.MatchSuccessful))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.FinanceProductIdsFilter), e => e.FinanceProductIds == input.FinanceProductIdsFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ExclusionIdsFilter), e => e.ExclusionIds == input.ExclusionIdsFilter);

            var pagedAndFilteredMatches = filteredMatches
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var matches = from o in pagedAndFilteredMatches
                          select new GetMatchForViewDto()
                          {
                              Match = new MatchDto
                              {
                                  Notes = o.Notes,
                                  ApplicationId = o.ApplicationId,
                                  LeadDisplayName = o.LeadDisplayName,
                                  MatchSuccessful = o.MatchSuccessful,
                                  FinanceProductIds = o.FinanceProductIds,
                                  ExclusionIds = o.ExclusionIds,
                                  Id = o.Id
                              }
                          };

            var totalCount = await filteredMatches.CountAsync();

            return new PagedResultDto<GetMatchForViewDto>(
                totalCount,
                await matches.ToListAsync()
            );
        }

        public async Task<GetMatchForViewDto> GetMatchForView(int id)
        {
            var match = await _matchRepository.GetAsync(id);
            var financeProductIds = match.FinanceProductIds.Split(",").Select(a => int.Parse(a)).ToList();

            var financeProducts = _financeProductsAppService.GetAllFinanceProductsById(financeProductIds);
            var matchResult = ObjectMapper.Map<MatchDto>(match);
            matchResult.FinanceProductNames = financeProducts
                                                            .OrderBy(a => a.LenderName)
                                                            .ThenBy(a => a.Name)
                                                            .Select(a => $"{a.LenderName} - {a.Name}").ToList();

            var output = new GetMatchForViewDto { Match = matchResult };

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Matches_Edit)]
        public async Task<GetMatchForEditOutput> GetMatchForEdit(EntityDto input)
        {
            var match = await _matchRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetMatchForEditOutput { Match = ObjectMapper.Map<CreateOrEditMatchDto>(match) };

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditMatchDto input)
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

        [AbpAuthorize(AppPermissions.Pages_Administration_Matches_Create)]
        protected virtual async Task Create(CreateOrEditMatchDto input)
        {
            var match = ObjectMapper.Map<Match>(input);

            if (AbpSession.TenantId != null)
            {
                match.TenantId = (int)AbpSession.TenantId;
            }

            await _matchRepository.InsertAsync(match);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Matches_Edit)]
        protected virtual async Task Update(CreateOrEditMatchDto input)
        {
            var match = await _matchRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, match);
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Matches_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _matchRepository.DeleteAsync(input.Id);
        }

        [AbpAllowAnonymous]
        public async Task HardDelete(EntityDto input)
        {
            await _matchRepository.HardDeleteAsync(a => a.Id == input.Id);
        }

        public async Task<FileDto> GetMatchesToExcel(GetAllMatchesForExcelInput input)
        {

            var filteredMatches = _matchRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Notes.Contains(input.Filter) || e.LeadDisplayName.Contains(input.Filter) || e.FinanceProductIds.Contains(input.Filter) || e.ExclusionIds.Contains(input.Filter))
                        .WhereIf(input.MinApplicationIdFilter != null, e => e.ApplicationId >= input.MinApplicationIdFilter)
                        .WhereIf(input.MaxApplicationIdFilter != null, e => e.ApplicationId <= input.MaxApplicationIdFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.LeadDisplayNameFilter), e => e.LeadDisplayName == input.LeadDisplayNameFilter)
                        .WhereIf(input.MatchSuccessfulFilter.HasValue && input.MatchSuccessfulFilter > -1, e => (input.MatchSuccessfulFilter == 1 && e.MatchSuccessful) || (input.MatchSuccessfulFilter == 0 && !e.MatchSuccessful))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.FinanceProductIdsFilter), e => e.FinanceProductIds == input.FinanceProductIdsFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ExclusionIdsFilter), e => e.ExclusionIds == input.ExclusionIdsFilter);

            var query = (from o in filteredMatches
                         select new GetMatchForViewDto()
                         {
                             Match = new MatchDto
                             {
                                 Notes = o.Notes,
                                 ApplicationId = o.ApplicationId,
                                 LeadDisplayName = o.LeadDisplayName,
                                 MatchSuccessful = o.MatchSuccessful,
                                 FinanceProductIds = o.FinanceProductIds,
                                 ExclusionIds = o.ExclusionIds,
                                 Id = o.Id
                             }
                         });

            var matchListDtos = await query.ToListAsync();

            return _matchesExcelExporter.ExportToFile(matchListDtos);
        }

    }
}