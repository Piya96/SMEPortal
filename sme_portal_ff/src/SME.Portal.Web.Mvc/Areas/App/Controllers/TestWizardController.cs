using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Controllers;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    public class TestWizardController : PortalControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
