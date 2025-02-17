using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;

namespace SME.Portal.MultiTenancy.Payments
{
    public interface ISubscriptionPaymentRepository : IRepository<SubscriptionPayment, long>
    {
        Task<SubscriptionPayment> GetByGatewayAndPaymentIdAsync(SubscriptionPaymentGatewayType gateway, string paymentId);

        Task<SubscriptionPayment> GetLastCompletedPaymentOrDefaultAsync(int tenantId, SubscriptionPaymentGatewayType? gateway, bool? isRecurring);

        Task<SubscriptionPayment> GetLastPaymentOrDefaultAsync(int tenantId, SubscriptionPaymentGatewayType? gateway, bool? isRecurring);

        Task<List<SubscriptionPayment>> GetByUserIdAsync(long userId, SubscriptionPaymentStatus status);
    }
}
