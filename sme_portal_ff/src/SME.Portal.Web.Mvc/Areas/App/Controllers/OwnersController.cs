using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.Owners;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Owners)]
    public class OwnersController : PortalControllerBase
    {
        private readonly IOwnersAppService _ownersAppService;

        public OwnersController(IOwnersAppService ownersAppService)
        {
            _ownersAppService = ownersAppService;
        }

        public ActionResult Index()
        {
            var model = new OwnersViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Owners_Create, AppPermissions.Pages_Administration_Owners_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(long? id)
        {
            GetOwnerForEditOutput getOwnerForEditOutput;

            if (id.HasValue)
            {
                getOwnerForEditOutput = await _ownersAppService.GetOwnerForEdit(new EntityDto<long> { Id = (long)id });
            }
            else
            {
                getOwnerForEditOutput = new GetOwnerForEditOutput
                {
                    Owner = new CreateOrEditOwnerDto()
                };
            }

            var viewModel = new CreateOrEditOwnerModalViewModel()
            {
                Owner = getOwnerForEditOutput.Owner,
                UserName = getOwnerForEditOutput.UserName,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewOwnerModal(long id)
        {
            var getOwnerForViewDto = await _ownersAppService.GetOwnerForView(id);

            var model = new OwnerViewModel()
            {
                Owner = getOwnerForViewDto.Owner
                ,
                UserName = getOwnerForViewDto.UserName

            };

            return PartialView("_ViewOwnerModal", model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Owners_Create, AppPermissions.Pages_Administration_Owners_Edit)]
        public PartialViewResult UserLookupTableModal(long? id, string displayName)
        {
            var viewModel = new OwnerUserLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_OwnerUserLookupTableModal", viewModel);
        }

    }
}