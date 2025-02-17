using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using SME.Portal.MultiTenancy.Dto;
using SME.Portal.MultiTenancy.Payments.Dto;
using Abp.Application.Services.Dto;

namespace SME.Portal.MultiTenancy.Payments
{
    public interface IPaymentAppService : IApplicationService
    {
        Task<PaymentInfoDto> GetPaymentInfo(PaymentInfoInput input);

        Task<long> CreatePayment(CreatePaymentDto input);

        //Task<long> CreatePaymentForUser(CreatePaymentDto input);

        Task CancelPayment(CancelPaymentDto input);

        Task<PagedResultDto<SubscriptionPaymentListDto>> GetPaymentHistory(GetPaymentHistoryInput input);

        Task<PagedResultDto<SubscriptionPaymentListDto>> GetSmePaymentHistory(GetPaymentHistoryInput input);

        List<PaymentGatewayModel> GetActiveGateways(GetActiveGatewaysInput input);

        Task<SubscriptionPaymentDto> GetPaymentAsync(long paymentId);

        //Task<List<SubscriptionPaymentDto>> GetPaymentForUser(long userId, SubscriptionPaymentStatus status);

        Task<SubscriptionPaymentDto> GetLastCompletedPayment();

        Task SetAsPaid(long paymentId, string externalPaymentId, string externalPaymentToken, string invoiceNo);

        Task SetAsCancelled(long paymentId);

        Task BuyNowSucceed(long paymentId);

        Task NewRegistrationSucceed(long paymentId);

        Task UpgradeSucceed(long paymentId);

        Task ExtendSucceed(long paymentId);

        Task PaymentFailed(long paymentId);

        Task SwitchBetweenFreeEditions(int upgradeEditionId);

        Task UpgradeSubscriptionCostsLessThenMinAmount(int editionId);

        Task<bool> HasAnyPayment();
        
    }
}
