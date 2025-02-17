using Microsoft.AspNetCore.Mvc;

namespace SME.Portal.Web.Controllers
{
    public class ECDCbusinessSupportController : PortalControllerBase
    {
        
        public ECDCbusinessSupportController()
        {
            
        }

        public IActionResult BusinessSupport()
        {
            return View("ECDC_business_support");
        }

        public IActionResult BusinessConsultant()
        {
            return View("ECDC_Business_advisor");
        }

        public IActionResult BusinessLinkTemplates()
        {
            return View("ECDC_links_templates");
        }

        public IActionResult RedirectToLinkTemplates()
        {
            return RedirectToAction("BusinessLinkTemplates");
        }

        public IActionResult RedirectToBusinessConsultant()
        {
            return RedirectToAction("BusinessConsultant");
        }

        public IActionResult RedirectToBusinessSupport()
        {
            return RedirectToAction("BusinessSupport");
        }

        public IActionResult RedirectToHomePage()
        {
            // Redirect to the HTTPS version of the site
            return RedirectPermanent("https://www.ecdc.co.za/");
        }
        
        public IActionResult RedirectToBusinessProfile()
        {
            // Redirect to the HTTPS version of the site
            return RedirectPermanent("https://www.finfind.co.za/hubfs/baseline-assessment/ecdc/index.html");
        }
        
        public IActionResult RedirectToDIAGNOSTIC()
        {
            return View("ECDC_diagnostics");
        }
        
        public IActionResult RedirectToBOOKKEEPING()
        {
            // Redirect to the HTTPS version of the site
            return RedirectPermanent("https://www.smeasy.co.za/");
        }
        
        public IActionResult RedirectToRECORDKEEPING()
        {
            // Redirect to the HTTPS version of the site
            return RedirectPermanent("https://admineasy.co.za/");
        }
    }
}
