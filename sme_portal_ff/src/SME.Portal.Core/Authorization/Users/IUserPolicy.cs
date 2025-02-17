using System.Threading.Tasks;
using Abp.Domain.Policies;

namespace SME.Portal.Authorization.Users
{
    public interface IUserPolicy : IPolicy
    {
        Task CheckMaxUserCountAsync(int tenantId);
    }
}
