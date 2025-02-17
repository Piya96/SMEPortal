using Abp.Application.Services.Dto;
using Abp.Webhooks;
using SME.Portal.WebHooks.Dto;

namespace SME.Portal.Web.Areas.App.Models.Webhooks
{
    public class CreateOrEditWebhookSubscriptionViewModel
    {
        public WebhookSubscription WebhookSubscription { get; set; }

        public ListResultDto<GetAllAvailableWebhooksOutput> AvailableWebhookEvents { get; set; }
    }
}
