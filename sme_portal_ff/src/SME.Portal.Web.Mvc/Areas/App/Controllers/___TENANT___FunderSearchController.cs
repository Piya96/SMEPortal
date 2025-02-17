using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.SME;
using SME.Portal.Timing;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Company;
using Abp.BackgroundJobs;
using SME.Portal.List;
using SME.Portal.Lenders;
using Abp.Domain.Uow;
using Abp.MultiTenancy;
using SME.Portal.SME.Subscriptions;
using SME.Portal.Storage;
using SME.Portal.Documents;
using Abp.Domain.Repositories;
using SME.Portal.Url;
using SME.Portal.PdfCrowd;
using SME.Portal.ConsumerCredit;
using Microsoft.AspNetCore.Hosting;
using SME.Portal.Configuration;

namespace SME.Portal.Web.Areas.App.Controllers
{
	[Area("App")]
	[AbpMvcAuthorize]
	public class ___TENANT___FunderSearchController : FunderSearchControllerBase
	{
		public ___TENANT___FunderSearchController(
			ApplicationAppServiceExt applicationsAppServiceExt,
			ApplicationsAppService applicationsAppService,
			IProfileAppService profileAppService,
			ITimingAppService timingAppService,
			SmeCompaniesAppServiceExt smeCompaniesAppServiceExt,
			OwnersAppServiceExt ownersAppServiceExt,
			IBackgroundJobManager backgroundJobManager,
			IListItemsAppService listItemAppService,
			IFinanceProductsAppService financeProductsAppService,
			IMatchesAppService matchesAppService,
			ILendersAppService lendersAppService,
			IUnitOfWorkManager unitOfWorkManager,
			ITenantCache tenantCache,
			SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt,
			DocumentsAppServiceExt documentsAppServiceExt,
			IBinaryObjectManager binaryObjectManager,
			IRepository<ListItem, int> listRepository,
			IWebUrlService webUrlService,
			PdfCrowdAppService pdfCrowdAppService,
			CCRAppService ccrAppService,
			IWebHostEnvironment webHostEnvironment,
			IAppConfigurationAccessor configurationAccessor
		) : base(
				applicationsAppServiceExt,
				applicationsAppService,
				profileAppService,
				timingAppService,
				smeCompaniesAppServiceExt,
				ownersAppServiceExt,
				backgroundJobManager,
				listItemAppService,
				financeProductsAppService,
				matchesAppService,
				lendersAppService,
				unitOfWorkManager,
				tenantCache,
				smeSubscriptionsAppServiceExt,
				documentsAppServiceExt,
				binaryObjectManager,
				listRepository,
				webUrlService,
				pdfCrowdAppService,
				ccrAppService,
				webHostEnvironment,
				configurationAccessor
			)
		{
		}

		protected override string GetProductionUrl()
		{
			return "https://app.finfind.co.za/";
		}

		protected override string GetTenantName()
		{
			return "___TENANT___";
		}
	}
}
