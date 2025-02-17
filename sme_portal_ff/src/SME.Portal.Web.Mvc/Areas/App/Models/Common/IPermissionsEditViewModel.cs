using System.Collections.Generic;
using SME.Portal.Authorization.Permissions.Dto;

namespace SME.Portal.Web.Areas.App.Models.Common
{
    public interface IPermissionsEditViewModel
    {
        List<FlatPermissionDto> Permissions { get; set; }

        List<string> GrantedPermissionNames { get; set; }
    }
}