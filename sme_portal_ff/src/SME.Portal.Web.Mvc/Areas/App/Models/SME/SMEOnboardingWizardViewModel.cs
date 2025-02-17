using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.Web.Areas.App.Models.Owners;
using SME.Portal.Web.Areas.App.Models.SmeCompanies;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SME.Portal.Company.Dtos;
using SME.Portal.SME.Dtos;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.List.Dtos;

namespace SME.Portal.Web.Areas.App.Models.SME
{
	public class SMEModalView
	{
		public string View { get; set; }
	}

	public class SMEMode
	{
		public static int None = -1;
		public static int Normal = 0;
		public static int Add = 1;
		public static int Edit = 2;
	}

    public class SMEOnboardingWizardViewModel
    {
        public MySettingsViewModel MySettings { get; set; }
		public int Mode { get; set; }
		public int CompanyId { get; set; }
        public string UserMessage { get; set; }
		public int CompanyCount { get; set; }
		public List<ListItemDto> ListItems { get; set; }
	}

	public enum SMEUserMessageType
	{
		Success = 0,
		Failure = 1,
		Warning = 2,
		Info = 3
	}

	public class SMEUserMessage
	{
		public SMEUserMessageType Type { get; set; }
		public string Text { get; set; }
	}

	public class SMECompanyBackgroundCheck
	{
		public bool Pass { get; set; }
		public SMEUserMessage Message { get; set; }
	}

	public class SMECompanyInfo
	{
		public bool CanEdit { get; set; }
		public GetSmeCompanyForViewDto Company { get; set; }
		public SMECompanyBackgroundCheck BackgroundCheck { get; set; }
	}

	public class SMEOnboardingSummary
	{
		public List<ListItemDto> ListItems { get; set; }

		public string UserMessage { get; set; }
        public OwnerViewModel Owner { get; set; }
		public MySettingsViewModel MySettings { get; set; }

		public List<GetSmeCompanyForViewDto> Companies { get; set; }
		public List<GetApplicationForViewDto> Applications { get; set; }

		public List<GetApplicationForViewDto> Apps { get; set; }

		public Dictionary<int, SmeSubscriptionDto> CompanySmeSubscriptions { get; set; }

		public Dictionary<int, SMECompanyInfo> CompanyInfo { get; set; }
	}

	public class SMELandingMessageModel
	{
		public string Name { get; set; }
		public string Message { get; set; }
	}
}
