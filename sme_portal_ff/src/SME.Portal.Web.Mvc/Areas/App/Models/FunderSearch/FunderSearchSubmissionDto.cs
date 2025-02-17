using SME.Portal.Authorization.Users.Profile.Dto;
using SME.Portal.Company.Dtos;
using SME.Portal.Documents.Dtos;
using SME.Portal.List;
using SME.Portal.List.Dtos;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.SME.Dtos;
using System;
using System.Collections.Generic;

namespace SME.Portal.Web.Areas.App.Models.FunderSearch
{
	public class CreateEditFunderSearchViewModel
	{
		public bool IsOnboarded { get; set; }

		public GetSmeCompanyForViewDto SmeCompany { get; set; }

		public CurrentUserProfileEditDto UserProfile { get; set; }

		public GetOwnerForViewDto OwnerProfile { get; set; }

		public List<ListItemDto> ListItemsEx { get; internal set; }
		public List<ListItem> ListItems { get; internal set; }
		public List<GetDocumentForViewDto> Documents { get; internal set; }

		public SmeSubscriptionDto Subscription { get; set; }

		public GetApplicationForEditOutput Application { get; set; }
	}

	public class FunderSearchLockDto
	{
		public int Id { get; set; }
	}

	public class FunderSearchSubmissionDto
	{
		public int? Id { get; set; }
		public string JsonStr { get; set; }
		public string MatchCriteriaJson { get; set; }
		public string FunderSearchJson { get; set; }
		public bool Partial { get; set; }
		public string PropertiesJson { get; set; }
	}

	public class FunderSearchSefaLASSubmissionDto
	{
		public int Id { get; set; }
	}

	public class FunderSearchSubmissionResultDto
	{
		public bool Status { get; set; }
		public string Message { get; set; }
	}

	public class FunderSearchSummaryGet
	{
		public int CompanyId { get; set; }
		public int ApplicationId { get; set; }
	}

	public class FunderSearchSummaryInput
	{
		public string Html { get; set; }
		public string CompanyName { get; set; }
		public int CompanyId { get; set; }
		public int ApplicationId { get; set; }
	}

	public class FunderSearchSummaryOutput
	{
		public byte[] Bytes { get; set; }
		public string FileName { get; set; }
	}
}
