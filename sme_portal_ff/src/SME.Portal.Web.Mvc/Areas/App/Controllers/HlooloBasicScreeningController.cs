using System.Threading.Tasks;

using Abp.AspNetCore.Mvc.Authorization;
using Abp.Configuration;

using Microsoft.AspNetCore.Mvc;

using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Authorization.Users.Profile.Dto;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using SME.Portal.Configuration;
using SME.Portal.Timing;
using SME.Portal.Timing.Dto;
using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.Web.Areas.App.Models.SME;
using SME.Portal.Web.Controllers;
using SME.Portal.Web.Areas.App.Models.Owners;
using SME.Portal.Web.Areas.App.Models.SmeCompanies;

using SME.Portal.Common.Dtos;
using SME.Portal.SME;
using SME.Portal.List;
using Abp.Domain.Repositories;
using System.Linq;
using SME.Portal.SME.Dtos;
using SME.Portal.List.Dtos;
using Abp.MultiTenancy;
using SME.Portal.Authorization;
using SME.Portal.SME.Subscriptions;
using System.Collections.Generic;
using SME.Portal.Sme.Subscriptions.Dtos;
using Abp.Application.Navigation;
using SME.Portal.Web.Areas.App.Startup;
using System;
using Abp.Runtime.Security;

namespace SME.Portal.Web.Areas.App.Controllers
{
	[Area("App")]
	[AbpMvcAuthorize]
	public class HlooloBasicScreeningController : BasicScreeningControllerBase
	{
		public HlooloBasicScreeningController(
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
			return "Hloolo";
		}
	}
}
