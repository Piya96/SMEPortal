using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Controllers;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SME.Portal.SME;
using Abp.UI;
using SME.Portal.Timing;
using SME.Portal.Timing.Dto;
using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.Authorization.Users.Profile;

using Abp.Configuration;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using Abp.BackgroundJobs;
using SME.Portal.SME.Dtos;
using SME.Portal.List;
using SME.Portal.Common.Dto;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Lenders;
using Abp.Domain.Uow;
using Abp.MultiTenancy;
using SME.Portal.Authorization;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.SME.Subscriptions;
using SME.Portal.Web.Areas.App.Models.FunderSearch;
using SME.Portal.Storage;
using SME.Portal.Documents.Dtos;
using SME.Portal.Web.Areas.App.Models.SmeDocuments;
using SME.Portal.Documents;
using System.IO;
using Abp.Domain.Repositories;
using SME.Portal.Matching;
using Abp.Runtime.Security;
using Abp.Application.Services.Dto;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using SME.Portal.Url;
using Abp.Extensions;
using SME.Portal.PdfCrowd;
using SME.Portal.List.Dtos;
using Microsoft.AspNetCore.Authorization;
using System.Web;

using SME.Portal.ConsumerCredit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using SME.Portal.Configuration;

namespace SME.Portal.Web.Areas.App.Controllers
{
	[Area("App")]
	[AbpMvcAuthorize]
	public class AfricanBankFunderSearchController : FunderSearchControllerBase
	{
		public AfricanBankFunderSearchController(
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
			return "AfricanBank";
		}
	}
}
