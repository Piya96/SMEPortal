using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Company;
using SME.Portal.Configuration;
using SME.Portal.Timing;
using SME.Portal.SME;
using SME.Portal.List;
using Abp.Domain.Repositories;
using SME.Portal.SME.Subscriptions;

namespace SME.Portal.Web.Areas.App.Controllers
{
	[Area("App")]
	[AbpMvcAuthorize]
	public class ___TENANT___BasicScreeningController : BasicScreeningControllerBase
	{
		public ___TENANT___BasicScreeningController(
			IProfileAppService profileAppService,
			ITimingAppService timingAppService,
			OwnersAppServiceExt ownersAppServiceExt,
			SmeCompaniesAppServiceExt smeCompaniesServiceExt,
			ApplicationAppServiceExt applicationAppServiceExt,
			IRepository<ListItem, int> listItemRepository,
			ApplicationAppServiceExt applicationsAppServiceExt,
			SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt,
			IAppConfigurationAccessor configurationAccessor
		) : base(
				profileAppService,
				timingAppService,
				ownersAppServiceExt,
				smeCompaniesServiceExt,
				applicationAppServiceExt,
				listItemRepository,
				applicationsAppServiceExt,
				smeSubscriptionsAppServiceExt,
				configurationAccessor
			)
		{
		}

		protected override string GetTenantName()
		{
			return "___TENANT___";
		}
	}
}
