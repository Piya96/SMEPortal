using System.Threading.Tasks;
using SME.Portal.Authorization.Users;

namespace SME.Portal.WebHooks
{
    public interface IAppWebhookPublisher
    {
        Task PublishTestWebhook();
    }
}
