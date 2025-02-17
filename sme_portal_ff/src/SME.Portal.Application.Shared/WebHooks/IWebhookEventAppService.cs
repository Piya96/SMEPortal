using System.Threading.Tasks;
using Abp.Webhooks;

namespace SME.Portal.WebHooks
{
    public interface IWebhookEventAppService
    {
        Task<WebhookEvent> Get(string id);
    }
}
