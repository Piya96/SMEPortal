using System.Threading.Tasks;
using Abp.Application.Services;
using SME.Portal.Editions.Dto;
using SME.Portal.MultiTenancy.Dto;

namespace SME.Portal.MultiTenancy
{
    public interface ITenantRegistrationAppService: IApplicationService
    {
        Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input);

        Task<EditionsSelectOutput> GetEditionsForSelect();

        Task<EditionSelectDto> GetEdition(int editionId);
    }
}