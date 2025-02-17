using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Models.Common.UserJourney
{
	public enum OnboardingStage
	{
		// White label, Sefa, ECDC.
		Intro,
		// White label, Sefa, ECDC.
		UserProfile,
		// White label, Sefa, ECDC.
		OwnerProfile,
		// White label, Sefa, ECDC.
		BusinessProfile,
		// White label, Sefa, ECDC.
		Summary,
		// White label, Sefa, ECDC.
		Exit,
		// White label, Sefa, ECDC.
		Complete
	}

	public enum ApplicationStage
	{
		// White label, Sefa, ECDC.
		Intro,
		// White label, Sefa, ECDC.
		FundingRequirements,
		// ECDC.
		ProductMatching,
		// White label, Sefa, ECDC.
		CompanyInfo,
		// White label, Sefa, ECDC.
		FinancialInfo,
		// White label.
		LenderDocuments,
		// White label, Sefa, ECDC.
		DocumentUploads,
		// White label, Sefa, ECDC.
		Summary,
		// Sefa, ECDC.
		Exit,
		// White label, Sefa, ECDC.
		Complete,
		// White label, Sefa, ECDC.
		Cancelled,
		// White label, Sefa, ECDC.
		Abandoned
	}

	public class Onboarding
	{
		[JsonProperty("stage")]
		public OnboardingStage Stage { get; set; }

		[JsonProperty("page")]
		public int Page { get; set; }
	}

	public class App
	{
		[JsonProperty("application")]
		public int Id { get; set; }

		[JsonProperty("stage")]
		public ApplicationStage Stage { get; set; }

		[JsonProperty("page")]
		public int Page { get; set; }
	}

	public class UserJourney
	{
		[JsonProperty("onboarding")]
		public Onboarding Onboarding { get; set; }

		[JsonProperty("application")]
		public App[] Application { get; set; }

		public static UserJourney get(string jsonStr)
		{
			return JsonConvert.DeserializeObject<UserJourney>(jsonStr);
		}
	};

	public class UserJourneyReturn
	{
		public string Controller { get; set; }
		public string Action { get; set; }
		public int Id { get; set; }
	}
}
