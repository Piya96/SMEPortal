using System.Threading.Tasks;
using Abp.Application.Services;
using SME.Portal.Sessions.Dto;

namespace SME.Portal.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();

        Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken();
    }
}
