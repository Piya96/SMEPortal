using SME.Portal.Lenders.Dtos;
using System.Collections.Generic;

namespace SME.Portal.Web.Areas.App.Models.FinanceProducts
{
    public class FundFormsViewModel
    {
        public List<FundFormDto> FundForms { get; set; }
        public int FinanceProductIdInFundForms { get; set; }
    }
}