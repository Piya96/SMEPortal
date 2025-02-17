
using SME.Portal.Common.Dto;
using SME.Portal.Company.Dtos;
using SME.Portal.Documents.Dtos;
using SME.Portal.Lenders.Dtos;
using SME.Portal.List.Dtos;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.SME.Dtos;
using System.Collections.Generic;
using SME.Portal.Web.Areas.App.Models.Profile;

namespace SME.Portal.Web.Areas.App.Models.FunderSearch
{
    public class FunderSearchesViewModel
    {
		public MySettingsViewModel Settings { get; set; }

        public Dictionary<int, GetSmeCompanyForViewDto> Companies { get; set; }
        
        public Dictionary<int, GetOwnerForViewDto> Owners { get; set; }

        public List<GetApplicationForViewDto> PagedFunderSearches { get; set; }

        public Dictionary<int, List<NameValuePairDto>> ApplicationProperties { get; set; }

        public Dictionary<int, Dictionary<string, List<FinanceProductDto>>> MatchedFinanceProducts { get; set; }

        public Dictionary<int, SmeSubscriptionDto> CompanySmeSubscriptions { get; set; }

        public Dictionary<int, List<DocumentDto>> CompanyDocuments { get; set; }

        public Dictionary<int, bool> ShowMatches { get; set; }

        public Dictionary<int, bool> ShowPricing { get; set; }

        public List<ListItemDto> ListItems { get; set; }

        public List<GetSmeCompanyForViewDto> AllCompanies { get; set; }

        public bool Reload { get; set; }
		public string View { get; set; }
		public bool DoesCreditReportExist { get; set; }
		public bool HasOnboarded { get; set; }

		public bool IsBaseline { get; set; }
	}
}
