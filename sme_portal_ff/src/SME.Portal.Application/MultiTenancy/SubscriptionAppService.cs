using System;
using System.Threading.Tasks;
using Abp.Events.Bus;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authorization;
using SME.Portal.MultiTenancy.Payments;

namespace SME.Portal.MultiTenancy
{
    public class SubscriptionAppService : PortalAppServiceBase, ISubscriptionAppService
    {
        public IEventBus EventBus { get; set; }

        public SubscriptionAppService()
        {
            EventBus = NullEventBus.Instance;
        }

        public async Task DisableRecurringPayments()
        {
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var tenant = await TenantManager.GetByIdAsync(AbpSession.GetTenantId());
                if (tenant.SubscriptionPaymentType == SubscriptionPaymentType.RecurringAutomatic)
                {
                    tenant.SubscriptionPaymentType = SubscriptionPaymentType.RecurringManual;
                    EventBus.Trigger(new RecurringPaymentsDisabledEventData
                    {
                        TenantId = AbpSession.GetTenantId(),
                        EditionId = tenant.EditionId.Value
                    });
                }
            }
        }

        public async Task EnableRecurringPayments()
        {
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var tenant = await TenantManager.GetByIdAsync(AbpSession.GetTenantId());
                if (tenant.SubscriptionPaymentType == SubscriptionPaymentType.RecurringManual)
                {
                    tenant.SubscriptionPaymentType = SubscriptionPaymentType.RecurringAutomatic;
                    tenant.SubscriptionEndDateUtc = null;

                    EventBus.Trigger(new RecurringPaymentsEnabledEventData
                    {
                        TenantId = AbpSession.GetTenantId()
                    });
                }
            }
        }

        public async Task CancelRecurringPayments()
        {
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var user = await GetCurrentUserAsync();

                if (user.SubscriptionPaymentType == SubscriptionPaymentType.RecurringAutomatic)
                {
                    EventBus.Trigger(new RecurringPaymentsCancelledEventData
                    {
                        UserId = user.Id
                    });
                }
            }
        }
    }
}