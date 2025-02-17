using SME.Portal.Lenders.Dtos;
using SME.Portal.SME.Dtos;

namespace SME.Portal.Web.Areas.App.Models.FinanceProducts
{
    public class FinanceProductSummaryViewModel
    {
        public string FinanceProductName { get; set; }

        public string ProductSummaryHtml { get; set; }

        public FinanceProductCriteriaDto FinanceProductProperties { get; set; }

        public LenderDto Lender { get; set; }
    }
}
