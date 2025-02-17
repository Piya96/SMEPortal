using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.Sme.Subscriptions.Exporting;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;

namespace SME.Portal.Sme.Subscriptions
{
    //[AbpAuthorize(AppPermissions.Pages_Administration_SmeSubscriptions)]
    public class SmeSubscriptionsAppService : PortalAppServiceBase, ISmeSubscriptionsAppService
    {
        private readonly IRepository<SmeSubscription> _smeSubscriptionRepository;
        private readonly ISmeSubscriptionsExcelExporter _smeSubscriptionsExcelExporter;

        public SmeSubscriptionsAppService(IRepository<SmeSubscription> smeSubscriptionRepository, ISmeSubscriptionsExcelExporter smeSubscriptionsExcelExporter)
        {
            _smeSubscriptionRepository = smeSubscriptionRepository;
            _smeSubscriptionsExcelExporter = smeSubscriptionsExcelExporter;

        }

        public async Task<PagedResultDto<GetSmeSubscriptionForViewDto>> GetAll(GetAllSmeSubscriptionsInput input)
        {

            var filteredSmeSubscriptions = _smeSubscriptionRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Status.Contains(input.Filter))
                        .WhereIf(input.MinStartDateFilter != null, e => e.StartDate >= input.MinStartDateFilter)
                        .WhereIf(input.MaxStartDateFilter != null, e => e.StartDate <= input.MaxStartDateFilter)
                        .WhereIf(input.MinExpiryDateFilter != null, e => e.ExpiryDate >= input.MinExpiryDateFilter)
                        .WhereIf(input.MaxExpiryDateFilter != null, e => e.ExpiryDate <= input.MaxExpiryDateFilter)
                        .WhereIf(input.MinNextBillingDateFilter != null, e => e.NextBillingDate >= input.MinNextBillingDateFilter)
                        .WhereIf(input.MaxNextBillingDateFilter != null, e => e.NextBillingDate <= input.MaxNextBillingDateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.StatusFilter), e => e.Status == input.StatusFilter)
                        .WhereIf(input.MinOwnerCompanyMapIdFilter != null, e => e.OwnerCompanyMapId >= input.MinOwnerCompanyMapIdFilter)
                        .WhereIf(input.MaxOwnerCompanyMapIdFilter != null, e => e.OwnerCompanyMapId <= input.MaxOwnerCompanyMapIdFilter);

            var pagedAndFilteredSmeSubscriptions = filteredSmeSubscriptions
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var smeSubscriptions = from o in pagedAndFilteredSmeSubscriptions
                                   select new GetSmeSubscriptionForViewDto()
                                   {
                                       SmeSubscription = new SmeSubscriptionDto
                                       {
                                           StartDate = o.StartDate,
                                           ExpiryDate = o.ExpiryDate,
                                           NextBillingDate = o.NextBillingDate,
                                           Status = o.Status,
                                           OwnerCompanyMapId = o.OwnerCompanyMapId,
                                           Id = o.Id,
                                           EditionId = o.EditionId
                                       }
                                   };

            var totalCount = await filteredSmeSubscriptions.CountAsync();

            return new PagedResultDto<GetSmeSubscriptionForViewDto>(
                totalCount,
                await smeSubscriptions.ToListAsync()
            );
        }

        public async Task<GetSmeSubscriptionForViewDto> GetSmeSubscriptionForView(int id)
        {
            var smeSubscription = await _smeSubscriptionRepository.GetAsync(id);

            var output = new GetSmeSubscriptionForViewDto { SmeSubscription = ObjectMapper.Map<SmeSubscriptionDto>(smeSubscription) };

            return output;
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_SmeSubscriptions_Edit)]
        public async Task<GetSmeSubscriptionForEditOutput> GetSmeSubscriptionForEdit(EntityDto input)
        {
            var smeSubscription = await _smeSubscriptionRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetSmeSubscriptionForEditOutput { SmeSubscription = ObjectMapper.Map<CreateOrEditSmeSubscriptionDto>(smeSubscription) };

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditSmeSubscriptionDto input)
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

        //[AbpAuthorize(AppPermissions.Pages_Administration_SmeSubscriptions_Create)]
        protected virtual async Task Create(CreateOrEditSmeSubscriptionDto input)
        {
            var smeSubscription = ObjectMapper.Map<SmeSubscription>(input);

            if (AbpSession.TenantId != null)
            {
                smeSubscription.TenantId = (int)AbpSession.TenantId;
            }

            await _smeSubscriptionRepository.InsertAsync(smeSubscription);
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_SmeSubscriptions_Edit)]
        protected virtual async Task Update(CreateOrEditSmeSubscriptionDto input)
        {
            var smeSubscription = await _smeSubscriptionRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, smeSubscription);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_SmeSubscriptions_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _smeSubscriptionRepository.DeleteAsync(input.Id);
        }

        public async Task<FileDto> GetSmeSubscriptionsToExcel(GetAllSmeSubscriptionsForExcelInput input)
        {

            var filteredSmeSubscriptions = _smeSubscriptionRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Status.Contains(input.Filter))
                        .WhereIf(input.MinStartDateFilter != null, e => e.StartDate >= input.MinStartDateFilter)
                        .WhereIf(input.MaxStartDateFilter != null, e => e.StartDate <= input.MaxStartDateFilter)
                        .WhereIf(input.MinExpiryDateFilter != null, e => e.ExpiryDate >= input.MinExpiryDateFilter)
                        .WhereIf(input.MaxExpiryDateFilter != null, e => e.ExpiryDate <= input.MaxExpiryDateFilter)
                        .WhereIf(input.MinNextBillingDateFilter != null, e => e.NextBillingDate >= input.MinNextBillingDateFilter)
                        .WhereIf(input.MaxNextBillingDateFilter != null, e => e.NextBillingDate <= input.MaxNextBillingDateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.StatusFilter), e => e.Status == input.StatusFilter)
                        .WhereIf(input.MinOwnerCompanyMapIdFilter != null, e => e.OwnerCompanyMapId >= input.MinOwnerCompanyMapIdFilter)
                        .WhereIf(input.MaxOwnerCompanyMapIdFilter != null, e => e.OwnerCompanyMapId <= input.MaxOwnerCompanyMapIdFilter);

            var query = (from o in filteredSmeSubscriptions
                         select new GetSmeSubscriptionForViewDto()
                         {
                             SmeSubscription = new SmeSubscriptionDto
                             {
                                 StartDate = o.StartDate,
                                 ExpiryDate = o.ExpiryDate,
                                 NextBillingDate = o.NextBillingDate,
                                 Status = o.Status,
                                 OwnerCompanyMapId = o.OwnerCompanyMapId,
                                 Id = o.Id
                             }
                         });

            var smeSubscriptionListDtos = await query.ToListAsync();

            return _smeSubscriptionsExcelExporter.ExportToFile(smeSubscriptionListDtos);
        }

    }
}