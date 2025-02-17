using Abp.Authorization;
using SME.Portal.Authorization.Roles;
using SME.Portal.Authorization.Users;

namespace SME.Portal.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
