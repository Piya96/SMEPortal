using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.MultiTenancy;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Authorization;
using SME.Portal.Web.Controllers;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize]
    public class HomeController : PortalControllerBase
    {
        public async Task<ActionResult> Index()
        {
            // host entry point
            if (AbpSession.MultiTenancySide == MultiTenancySides.Host)
            {
                if (await IsGrantedAsync(AppPermissions.Pages_Tenants))
                {
                    return RedirectToAction("Index", "Tenants");
                }
            }
            // tenant admin entry point
            else
            {
                if (await IsGrantedAsync(AppPermissions.Pages_LenderAdmin))
                {
                    return RedirectToAction("", "Lenders", new { area = "App" });
                }

                if (await IsGrantedAsync(AppPermissions.Pages_UserAdmin))
                {
                    return RedirectToAction("", "Users", new { area = "App" });
                }
            }

            // Default page if no permission to the pages above
            return RedirectToAction("Index", "sme");
        }
    }
}