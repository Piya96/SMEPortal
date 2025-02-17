using Abp.Application.Editions;
using Abp.Authorization;
using Abp.Domain.Repositories;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using SME.Portal.Editions;
using SME.Portal.Editions.Dto;
using SME.Portal.Sme.Subscriptions;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.Sme.Subscriptions.Exporting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.SME.Subscriptions
{
    public class SmeSubscriptionsAppServiceExt : SmeSubscriptionsAppService
    {
        private readonly IRepository<SmeSubscription> _smeSubscriptionRepository;
        private readonly ISmeSubscriptionsExcelExporter _smeSubscriptionsExcelExporter;
        private readonly IOwnerCompanyMappingAppService _ownerCompanyMappingAppService;
        private readonly IRepository<OwnerCompanyMap, int> _ownerCompanyMapRepo;
        private readonly IEditionAppService _editionAppService;
        private readonly IRepository<Edition, int> _editionRepo;

        public SmeSubscriptionsAppServiceExt( IRepository<SmeSubscription> smeSubscriptionRepository, 
                                              ISmeSubscriptionsExcelExporter smeSubscriptionsExcelExporter,
                                              IOwnerCompanyMappingAppService ownerCompanyMappingAppService,
                                              IEditionAppService editionAppService,
                                              IRepository<OwnerCompanyMap, int> ownerCompanyMapRepo,
                                              IRepository<Edition, int> editionRepo)
            : base(smeSubscriptionRepository, smeSubscriptionsExcelExporter)
        {
            _smeSubscriptionRepository = smeSubscriptionRepository;
            _smeSubscriptionsExcelExporter = smeSubscriptionsExcelExporter;
            _editionAppService = editionAppService;
            _ownerCompanyMappingAppService = ownerCompanyMappingAppService;
            _ownerCompanyMapRepo = ownerCompanyMapRepo;
            _editionRepo = editionRepo;
        }

        public async Task<SmeSubscriptionDto> GetCompanySmeSubscription(SmeCompanyDto company)
        {
            return await GetCompanySmeSubscriptionById(company.Id);
        }

        public async Task<SmeSubscriptionDto> GetCompanySmeSubscriptionById(int companyId)
        {
            var ownerCompanyMappings = _ownerCompanyMapRepo.GetAll().Where(x => x.SmeCompanyId == companyId).ToList();

            var ownerCompanyMapId = ownerCompanyMappings.FirstOrDefault(x => x.IsPrimaryOwner).Id;

            var smeSubscriptionItems = await base.GetAll(new GetAllSmeSubscriptionsInput()
            {
                MinOwnerCompanyMapIdFilter = ownerCompanyMapId,
                MaxOwnerCompanyMapIdFilter = ownerCompanyMapId
            });

            var smeSubscription = smeSubscriptionItems.Items.First().SmeSubscription;

            var edition = _editionRepo.Get(smeSubscription.EditionId);
            var editionListDto = ObjectMapper.Map<EditionListDto>(edition);

            smeSubscriptionItems.Items.First().SmeSubscription.EditionFk = editionListDto;

            return smeSubscriptionItems.Items.First().SmeSubscription;
        }

        [AbpAllowAnonymous]
        public async Task DeleteForOwnerCompanyMapId(long ownerCompanyMapId)
        {
           await _smeSubscriptionRepository.DeleteAsync(a => a.OwnerCompanyMapId == ownerCompanyMapId);
        }
    }
}
