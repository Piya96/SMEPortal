using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Controllers;

namespace SME.Portal.Web.Public.Controllers
{
    public class HomeController : PortalControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}