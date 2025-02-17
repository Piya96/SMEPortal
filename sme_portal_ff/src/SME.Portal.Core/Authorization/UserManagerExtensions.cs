using System.Threading.Tasks;
using Abp.Authorization.Users;
using SME.Portal.Authorization.Users;

namespace SME.Portal.Authorization
{
    public static class UserManagerExtensions
    {
        public static async Task<User> GetAdminAsync(this UserManager userManager)
        {
            return await userManager.FindByNameAsync(AbpUserBase.AdminUserName);
        }
    }
}
