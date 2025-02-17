using System.Threading.Tasks;
using SME.Portal.Sessions.Dto;

namespace SME.Portal.Web.Session
{
    public interface IPerRequestSessionCache
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformationsAsync();
    }
}
