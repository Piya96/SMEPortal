using Abp.Domain.Repositories;
using Abp.Threading;
using SME.Portal.Company;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.SME.Subscriptions;

namespace SME.Portal.Accounts.UserTestAccountRestJobLogic
{
    public class SmeSubscriptionsAndPaymentsResetJob
    {
        private readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;
        private readonly IOwnerCompanyMappingAppService _ownerCompanyMappingAppService;
        private readonly IRepository<SubscriptionPayment, long> _subscriptionPaymentRepository;


        public SmeSubscriptionsAndPaymentsResetJob(
            SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt,
            IRepository<SubscriptionPayment, long> subscriptionPaymentRepository,
            IOwnerCompanyMappingAppService ownerCompanyMappingAppService)
        {
            _subscriptionPaymentRepository = subscriptionPaymentRepository;
            _smeSubscriptionsAppServiceExt = smeSubscriptionsAppServiceExt;
            _ownerCompanyMappingAppService = ownerCompanyMappingAppService;
        }

        public SmeSubscriptionsAndPaymentsResetJob DeleteSmeSubscriptionsAndPayments(long userId)
        {
            var ownerCompanyMappings = AsyncHelper.RunSync(() => _ownerCompanyMappingAppService.GetAllForUserId(userId));
            foreach (var mapping in ownerCompanyMappings)
            {
                AsyncHelper.RunSync(() => _smeSubscriptionsAppServiceExt.DeleteForOwnerCompanyMapId(mapping.Id));
            }

            AsyncHelper.RunSync(() => _ownerCompanyMappingAppService.HardDeleteForUser(userId));
            AsyncHelper.RunSync(() => _subscriptionPaymentRepository.HardDeleteAsync(a => a.UserId == userId));
            return this;
        }
    }
}
