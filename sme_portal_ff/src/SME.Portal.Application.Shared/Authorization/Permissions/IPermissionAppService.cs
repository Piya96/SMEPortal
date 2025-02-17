using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization.Permissions.Dto;

namespace SME.Portal.Authorization.Permissions
{
    public interface IPermissionAppService : IApplicationService
    {
        ListResultDto<FlatPermissionWithLevelDto> GetAllPermissions();
    }
}
