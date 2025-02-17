using SME.Portal.Company.Dtos;
using SME.Portal.List.Dtos;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.SME.Dtos;
using System.Collections.Generic;
using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.Documents.Dtos;

namespace SME.Portal.Web.Areas.App.Models.FunderSearch
{
    public class FunderSearchSummaryViewModel
    {
		public MySettingsViewModel Settings { get; set; }

		public SmeCompanyDto SmeCompany { get; set; }

        public OwnerDto OwnerProfile { get; set; }

        public List<ListItemDto> ListItems { get; set; }
        
        public SmeSubscriptionDto Subscription { get; set; }

        public ApplicationDto Application { get; set; }

		public List<UploadedSefaDocumentDto> Documents { get; set; }

		public string TenancyName { get; set; }

        public bool IncludeHeader { get; set; }

		public bool IsBaseline { get; set; }
	}
}
