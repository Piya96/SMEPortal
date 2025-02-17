using System.Threading.Tasks;
using Abp.Application.Services;
using SME.Portal.MultiTenancy.Payments.Dto;
using SME.Portal.MultiTenancy.Payments.Stripe.Dto;

namespace SME.Portal.MultiTenancy.Payments.Stripe
{
    public interface IStripePaymentAppService : IApplicationService
    {
        Task ConfirmPayment(StripeConfirmPaymentInput input);

        StripeConfigurationDto GetConfiguration();

        Task<SubscriptionPaymentDto> GetPaymentAsync(StripeGetPaymentInput input);

        Task<string> CreatePaymentSession(StripeCreatePaymentSessionInput input);
    }
}