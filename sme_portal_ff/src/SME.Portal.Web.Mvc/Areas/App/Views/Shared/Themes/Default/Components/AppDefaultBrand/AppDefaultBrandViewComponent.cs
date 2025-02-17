using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using SME.Portal.Web.Areas.App.Models.Layout;
using SME.Portal.Web.Session;
using SME.Portal.Web.Views;

namespace SME.Portal.Web.Areas.App.Views.Shared.Themes.Default.Components.AppDefaultBrand
{
    public class AppDefaultBrandViewComponent : PortalViewComponent
    {
        private readonly IPerRequestSessionCache _sessionCache;

        public AppDefaultBrandViewComponent(IPerRequestSessionCache sessionCache)
        {
            _sessionCache = sessionCache;
        }

        public async Task<string> GetUrl()
        {
            var loginInfo = await _sessionCache.GetCurrentLoginInformationsAsync();
            
            var url = "~/";
            if (loginInfo.Tenant != null && loginInfo.Tenant.Id == 2 )
            {
                url = "https://finfind.co.za";
            }

            return url;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var headerModel = new HeaderViewModel
            {
                Url = await GetUrl(),
                LoginInformations = await _sessionCache.GetCurrentLoginInformationsAsync()
            };

            return View(headerModel);
        }
    }
}
