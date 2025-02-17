using Abp.AspNetCore.Mvc.Authorization;
using SME.Portal.Authorization;
using SME.Portal.Storage;
using Abp.BackgroundJobs;
using Abp.Authorization;

namespace SME.Portal.Web.Controllers
{
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Users)]
    public class UsersController : UsersControllerBase
    {
        public UsersController(IBinaryObjectManager binaryObjectManager, IBackgroundJobManager backgroundJobManager)
            : base(binaryObjectManager, backgroundJobManager)
        {
        }
    }
}