using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Authorization;
using SME.Portal.DashboardCustomization;
using System.Threading.Tasks;
using SME.Portal.Web.Areas.App.Startup;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_SME_Dashboard)]
    public class SmeDashboardController : CustomizableDashboardControllerBase
    {
        public SmeDashboardController(
            DashboardViewConfiguration dashboardViewConfiguration,
            IDashboardCustomizationAppService dashboardCustomizationAppService)
            : base(dashboardViewConfiguration, dashboardCustomizationAppService)
        {

        }

        public async Task<ActionResult> Index()
        {
            return await GetView(PortalDashboardCustomizationConsts.DashboardNames.DefaultSmeDashboard);
        }
    }
}