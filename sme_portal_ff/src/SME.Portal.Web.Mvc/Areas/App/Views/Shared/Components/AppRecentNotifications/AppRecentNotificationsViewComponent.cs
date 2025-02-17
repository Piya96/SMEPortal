using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.Layout;
using SME.Portal.Web.Views;

namespace SME.Portal.Web.Areas.App.Views.Shared.Components.AppRecentNotifications
{
    public class AppRecentNotificationsViewComponent : PortalViewComponent
    {
        public Task<IViewComponentResult> InvokeAsync(string cssClass)
        {
            var model = new RecentNotificationsViewModel
            {
                CssClass = cssClass
            };
            
            return Task.FromResult<IViewComponentResult>(View(model));
        }
    }
}
