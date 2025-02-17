using System.Threading.Tasks;
using Abp.Application.Services;

namespace SME.Portal.MultiTenancy
{
    public interface ISubscriptionAppService : IApplicationService
    {
        Task DisableRecurringPayments();

        Task EnableRecurringPayments();
    }
}
