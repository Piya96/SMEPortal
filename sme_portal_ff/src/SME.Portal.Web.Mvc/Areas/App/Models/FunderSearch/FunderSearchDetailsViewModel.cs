using SME.Portal.Common.Dto;
using SME.Portal.Company.Dtos;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.SME.Dtos;
using System.Collections.Generic;

namespace SME.Portal.Web.Areas.App.Models.FunderSearch
{
	public class FunderSearchDetailViewModel
	{
		public ApplicationDto FunderSearch { get; set; }

		public Dictionary<int, GetSmeCompanyForViewDto> Companies { get; set; }

		public Dictionary<int, GetOwnerForViewDto> Owners { get; set; }

		public Dictionary<int, List<NameValuePairDto>> ApplicationProperties { get; set; }

		public Dictionary<int, Dictionary<string, List<FinanceProductDto>>> MatchedFinanceProducts { get; set; }

		public Dictionary<int, SmeSubscriptionDto> CompanySmeSubscriptions { get; set; }

		public bool Reload { get; set; }
		public bool HasOnboarded { get; set; }

	}
}
