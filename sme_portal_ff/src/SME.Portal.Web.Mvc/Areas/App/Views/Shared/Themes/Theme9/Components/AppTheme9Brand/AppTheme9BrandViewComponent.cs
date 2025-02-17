using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.Layout;
using SME.Portal.Web.Session;
using SME.Portal.Web.Views;

namespace SME.Portal.Web.Areas.App.Views.Shared.Themes.Theme9.Components.AppTheme9Brand
{
    public class AppTheme9BrandViewComponent : PortalViewComponent
    {
        private readonly IPerRequestSessionCache _sessionCache;

        public AppTheme9BrandViewComponent(IPerRequestSessionCache sessionCache)
        {
            _sessionCache = sessionCache;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var headerModel = new HeaderViewModel
            {
                LoginInformations = await _sessionCache.GetCurrentLoginInformationsAsync()
            };

            return View(headerModel);
        }
    }
}
