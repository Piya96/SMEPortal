using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.Layout;
using SME.Portal.Web.Views;

namespace SME.Portal.Web.Areas.App.Views.Shared.Components.
    AppQuickThemeSelect
{
    public class AppQuickThemeSelectViewComponent : PortalViewComponent
    {
        public Task<IViewComponentResult> InvokeAsync(string cssClass)
        {
            return Task.FromResult<IViewComponentResult>(View(new QuickThemeSelectionViewModel
            {
                CssClass = cssClass
            }));
        }
    }
}
