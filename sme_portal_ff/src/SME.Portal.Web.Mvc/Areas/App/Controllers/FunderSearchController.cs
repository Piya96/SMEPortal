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
    public class FunderSearchController : FunderSearchControllerBase
    {
		#region Constructor and utility methods

		public FunderSearchController(
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
            _finfindBaseline = true;
        }

        private string GetFromSettings(string name, string defaultValue = null)
        {
            return _appConfiguration[name] ?? defaultValue;
        }

		protected override string GetProductionUrl()
		{
			return "https://app.finfind.co.za/";
		}

		// Implement this method in the tenant specific controller.
		protected override string GetTenantName()
		{
			return "SME";
		}

		#endregion
		protected override string GetBasicScreeningName()
		{
			return "";
		}

		// Implement this method in the tenant specific controller.
		protected override string GetFunderSearchName()
		{
			return "FunderSearch";
		}

		public override async Task<IActionResult> Index(bool reload = true)
        {
            #region Authorize Routing

            if (AbpSession.MultiTenancySide == MultiTenancySides.Host)
            {
                if (await IsGrantedAsync(AppPermissions.Pages_Administration_Host_Dashboard))
                {
                    return RedirectToAction("Index", "HostDashboard");
                }

                if (await IsGrantedAsync(AppPermissions.Pages_Tenants))
                {
                    return RedirectToAction("Index", "Tenants");
                }
            }
            else
            {
                if (await IsGrantedAsync(AppPermissions.Pages_Tenant_Dashboard))
                {
                    return RedirectToAction("Index", "TenantDashboard");
                }

                // Tenant SME split
                if (AbpSession.TenantId == 3)
				{
					return RedirectToAction("Index", "SefaApplication");
				}

				if(AbpSession.TenantId == 5)
				{
					return RedirectToAction("Index", "ECDCFunderSearch");
				}

				if(AbpSession.TenantId == 9)
				{
					return RedirectToAction("Index", "CompanyPartnersFunderSearch");
				}

				if(AbpSession.TenantId == 10)
				{
					return RedirectToAction("Index", "AfricanBankFunderSearch");
					//return RedirectToAction("Index", "___TENANT___FunderSearch");
				}
				if(AbpSession.TenantId == 12)
				{
					return RedirectToAction("Index", "HlooloFunderSearch");
				}
			}
			// This will handle white label index method.
			return await base.Index(reload);
            #endregion
        }
    }
}
