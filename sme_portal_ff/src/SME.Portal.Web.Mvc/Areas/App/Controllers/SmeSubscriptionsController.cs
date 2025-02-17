using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.SmeSubscriptions;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Sme.Subscriptions;
using SME.Portal.Sme.Subscriptions.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_SmeSubscriptions)]
    public class SmeSubscriptionsController : PortalControllerBase
    {
        private readonly ISmeSubscriptionsAppService _smeSubscriptionsAppService;

        public SmeSubscriptionsController(ISmeSubscriptionsAppService smeSubscriptionsAppService)
        {
            _smeSubscriptionsAppService = smeSubscriptionsAppService;
        }

        public ActionResult Index()
        {
            var model = new SmeSubscriptionsViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_SmeSubscriptions_Create, AppPermissions.Pages_Administration_SmeSubscriptions_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetSmeSubscriptionForEditOutput getSmeSubscriptionForEditOutput;

            if (id.HasValue)
            {
                getSmeSubscriptionForEditOutput = await _smeSubscriptionsAppService.GetSmeSubscriptionForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getSmeSubscriptionForEditOutput = new GetSmeSubscriptionForEditOutput
                {
                    SmeSubscription = new CreateOrEditSmeSubscriptionDto()
                };
                getSmeSubscriptionForEditOutput.SmeSubscription.StartDate = DateTime.Now;
                getSmeSubscriptionForEditOutput.SmeSubscription.ExpiryDate = DateTime.Now;
                getSmeSubscriptionForEditOutput.SmeSubscription.NextBillingDate = DateTime.Now;
            }

            var viewModel = new CreateOrEditSmeSubscriptionModalViewModel()
            {
                SmeSubscription = getSmeSubscriptionForEditOutput.SmeSubscription,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewSmeSubscriptionModal(int id)
        {
            var getSmeSubscriptionForViewDto = await _smeSubscriptionsAppService.GetSmeSubscriptionForView(id);

            var model = new SmeSubscriptionViewModel()
            {
                SmeSubscription = getSmeSubscriptionForViewDto.SmeSubscription
            };

            return PartialView("_ViewSmeSubscriptionModal", model);
        }

    }
}