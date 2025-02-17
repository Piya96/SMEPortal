using System.Collections.Generic;
using SME.Portal.Authorization.Permissions.Dto;

namespace SME.Portal.Authorization.Users.Dto
{
    public class GetUserPermissionsForEditOutput
    {
        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}