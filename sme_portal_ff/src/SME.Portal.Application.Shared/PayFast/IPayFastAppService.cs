
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Abp.Application.Services;

using PayFast;
using PayFast.ApiTypes;
using SME.Portal.PayFast.Dtos;

namespace SME.Portal.PayFast
{
    public interface IPayFastAppService : IApplicationService
    {
        Task<IActionResult> NotifyHandler(PayFastNotify notifyReq);

        Task<UpdateResponse> FetchSubscription(string token);

        Task CancelSubscription(string token, bool test = false);

        Task PauseSubscription(string token, bool test = false);

        Task UnPauseCubscription(string token, bool test = false);

        string GetPaymentRedirectUrl(PaymentRedirectDto dt, int tenantId);

    }
}
