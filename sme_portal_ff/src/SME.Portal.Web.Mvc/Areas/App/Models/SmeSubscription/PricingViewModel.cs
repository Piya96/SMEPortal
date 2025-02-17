using SME.Portal.Company.Dtos;
using SME.Portal.Editions.Dto;

namespace SME.Portal.Web.Areas.App.Models.SmeSubscription
{
    public class PricingViewModel
    {
        public SmeCompanyDto Company { get; set; }
        public EditionSelectDto Free { get; set; }
        public EditionSelectDto Paid { get; set; }
    }
}
