using SME.Portal.Lenders.Dtos;
using System.Collections.Generic;

namespace SME.Portal.Web.Areas.App.Models.FinanceProducts
{
    public class FundFormDraftViewModel
    {
        public FundFormViewDto FinanceProductDraft { get; set; }
        public string FinanceForResultList { get; set; }
        public string RequiredDocResultList { get; set; }
        public string NotRequiredDocResultList { get; set; }
        public string CompanyRegTypeResultList { get; set; }
        public string ProvinceResultList { get; set; }
        public string BEELevelResultList { get; set; }
        public string IndustrySectorResultList { get; set; }
    }
}
