using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.CreditScores;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.ConsumerCredit;
using SME.Portal.ConsumerCredit.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_CreditScores)]
    public class CreditScoresController : PortalControllerBase
    {
        private readonly ICreditScoresAppService _creditScoresAppService;

        public CreditScoresController(ICreditScoresAppService creditScoresAppService)
        {
            _creditScoresAppService = creditScoresAppService;
        }

        public ActionResult Index()
        {
            var model = new CreditScoresViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_CreditScores_Create, AppPermissions.Pages_CreditScores_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetCreditScoreForEditOutput getCreditScoreForEditOutput;

            if (id.HasValue)
            {
                getCreditScoreForEditOutput = await _creditScoresAppService.GetCreditScoreForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getCreditScoreForEditOutput = new GetCreditScoreForEditOutput
                {
                    CreditScore = new CreateOrEditCreditScoreDto()
                };
                getCreditScoreForEditOutput.CreditScore.EnquiryDate = DateTime.Now;
            }

            var viewModel = new CreateOrEditCreditScoreModalViewModel()
            {
                CreditScore = getCreditScoreForEditOutput.CreditScore,
                UserName = getCreditScoreForEditOutput.UserName,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewCreditScoreModal(int id)
        {
            var getCreditScoreForViewDto = await _creditScoresAppService.GetCreditScoreForView(id);

            var model = new CreditScoreViewModel()
            {
                CreditScore = getCreditScoreForViewDto.CreditScore
                ,
                UserName = getCreditScoreForViewDto.UserName

            };

            return PartialView("_ViewCreditScoreModal", model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_CreditScores_Create, AppPermissions.Pages_CreditScores_Edit)]
        public PartialViewResult UserLookupTableModal(long? id, string displayName)
        {
            var viewModel = new CreditScoreUserLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_CreditScoreUserLookupTableModal", viewModel);
        }

    }
}