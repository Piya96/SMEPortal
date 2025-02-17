using SME.Portal.Company.Dtos;
using SME.Portal.Documents.Dtos;
using SME.Portal.Editions.Dto;
using SME.Portal.Lenders.Dtos;
using System.Collections.Generic;

namespace SME.Portal.Web.Areas.App.Models.FunderSearch
{
    public class FunderSearchMatchesViewModel
    {
        public int ApplicationId { get; set; }
        public SmeCompanyDto SmeCompany { get; set; }
        public EditionListDto CompanyEdition { get; set; }
        public Dictionary<string, List<FinanceProductDto>> FinanceProducts { get; set; }
        public List<DocumentDto> CompanyDocuments { get; set; }
        public int MatchCount { get; set; }
        public string FunderSearchEditionDisplayName { get; set; }
        public string View { get; set; }
		public bool DoesCreditReportExist { get; set; }
		public bool ShowMatches { get; set; }
        public bool ShowPricing { get; set; }

    }
}
