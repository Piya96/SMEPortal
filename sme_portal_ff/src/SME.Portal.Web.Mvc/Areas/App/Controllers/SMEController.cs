using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Company;
using SME.Portal.Configuration;
using SME.Portal.Timing;
using SME.Portal.SME;
using SME.Portal.List;
using Abp.Domain.Repositories;
using Abp.MultiTenancy;
using SME.Portal.Authorization;
using SME.Portal.SME.Subscriptions;
using System;
using SME.Portal.Authorization.Users;
using System.Linq;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize]
    public class SMEController : BasicScreeningControllerBase
	{
		private readonly IUserEmailer _userEmailer;

		public SMEController(
			IProfileAppService profileAppService,
			ITimingAppService timingAppService,
			OwnersAppServiceExt ownersAppServiceExt,
			SmeCompaniesAppServiceExt smeCompaniesServiceExt,
			ApplicationAppServiceExt applicationAppServiceExt,
			IRepository<ListItem, int> listItemRepository,
			ApplicationAppServiceExt applicationsAppServiceExt,
			SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt,
			IAppConfigurationAccessor configurationAccessor,
			IUserEmailer userEmailer
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
			_userEmailer = userEmailer;
		}

		public class SubmitErrorArgs
		{
			public int ApplicationId { get; set; }
			public string Name { get; set; }
			public string Details { get; set; }
			public string MasterTemplate { get; set; }
			public string ErrorTemplate { get; set; }
		}

		[HttpPost]
		public async Task<ActionResult> SubmitError([FromBody] SubmitErrorArgs args)
		{
			try
			{
				await _userEmailer.SendApplicationFailedNotification(
					args.Name,
					args.Details,
					args.MasterTemplate,
					args.ErrorTemplate
				);

				return Json(new { success = true });
			}
			catch(Exception x)
			{
				Logger.Error(x.Message);

				return Json(new { success = false });
			}
		}

		public override async Task<IActionResult> __Index__(string userMessage = null)
		{
			// Tenant SME split
			if(AbpSession.TenantId == 2)
			{
				return RedirectToAction("__Index__", "FinfindBasicScreening");
			}

			if(AbpSession.TenantId == 3)
			{
				return RedirectToAction("Index", "SefaSme");
			}

			if(AbpSession.TenantId == 5)
			{
				return RedirectToAction("Index", "ECDCSme");
			}

			if(AbpSession.TenantId == 9)
			{
				return RedirectToAction("__Index__", "CompanyPartnersBasicScreening");
			}

			if(AbpSession.TenantId == 10)
			{
				return RedirectToAction("__Index__", "AfricanBankBasicScreening");
			}

			if(AbpSession.TenantId == 12)
			{
				//return RedirectToAction("__Index__", "___TENANT___BasicScreening");
				return RedirectToAction("__Index__", "HlooloBasicScreening");
			}
			return await base.__Index__(userMessage);
		}

		[Route("~/index", Name = "IndexPage")]
        public async Task<IActionResult> Index(string userMessage = null)
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
			}
			#endregion
			return RedirectToAction("Insert", "UserJourney");
			//return RedirectToAction("__Index__", "SME");
		}

		public IActionResult Support()
		{
			return View();
		}

		protected override string GetTenantName()
		{
			return "SME";
		}

		protected override string GetBasicScreeningName()
		{
			return "";
		}
	}
}
