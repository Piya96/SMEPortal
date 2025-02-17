using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.Matches;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Lenders;
using SME.Portal.Lenders.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Matches)]
    public class MatchesController : PortalControllerBase
    {
        private readonly IMatchesAppService _matchesAppService;

        public MatchesController(IMatchesAppService matchesAppService)
        {
            _matchesAppService = matchesAppService;
        }

        public ActionResult Index()
        {
            var model = new MatchesViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Matches_Create, AppPermissions.Pages_Administration_Matches_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetMatchForEditOutput getMatchForEditOutput;

            if (id.HasValue)
            {
                getMatchForEditOutput = await _matchesAppService.GetMatchForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getMatchForEditOutput = new GetMatchForEditOutput
                {
                    Match = new CreateOrEditMatchDto()
                };
            }

            var viewModel = new CreateOrEditMatchModalViewModel()
            {
                Match = getMatchForEditOutput.Match,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewMatchModal(int id)
        {
            var getMatchForViewDto = await _matchesAppService.GetMatchForView(id);

            var model = new MatchViewModel()
            {
                Match = getMatchForViewDto.Match
            };

            return PartialView("_ViewMatchModal", model);
        }

    }
}