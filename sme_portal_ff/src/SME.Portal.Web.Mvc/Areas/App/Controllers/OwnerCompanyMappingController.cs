using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.OwnerCompanyMapping;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping)]
    public class OwnerCompanyMappingController : PortalControllerBase
    {
        private readonly IOwnerCompanyMappingAppService _ownerCompanyMappingAppService;

        public OwnerCompanyMappingController(IOwnerCompanyMappingAppService ownerCompanyMappingAppService)
        {
            _ownerCompanyMappingAppService = ownerCompanyMappingAppService;
        }

        public ActionResult Index()
        {
            var model = new OwnerCompanyMappingViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping_Create, AppPermissions.Pages_Administration_OwnerCompanyMapping_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetOwnerCompanyMapForEditOutput getOwnerCompanyMapForEditOutput;

            if (id.HasValue)
            {
                getOwnerCompanyMapForEditOutput = await _ownerCompanyMappingAppService.GetOwnerCompanyMapForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getOwnerCompanyMapForEditOutput = new GetOwnerCompanyMapForEditOutput
                {
                    OwnerCompanyMap = new CreateOrEditOwnerCompanyMapDto()
                };
            }

            var viewModel = new CreateOrEditOwnerCompanyMapModalViewModel()
            {
                OwnerCompanyMap = getOwnerCompanyMapForEditOutput.OwnerCompanyMap,
                OwnerIdentityOrPassport = getOwnerCompanyMapForEditOutput.OwnerIdentityOrPassport,
                SmeCompanyRegistrationNumber = getOwnerCompanyMapForEditOutput.SmeCompanyRegistrationNumber,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewOwnerCompanyMapModal(int id)
        {
            var getOwnerCompanyMapForViewDto = await _ownerCompanyMappingAppService.GetOwnerCompanyMapForView(id);

            var model = new OwnerCompanyMapViewModel()
            {
                OwnerCompanyMap = getOwnerCompanyMapForViewDto.OwnerCompanyMap
                ,
                OwnerIdentityOrPassport = getOwnerCompanyMapForViewDto.OwnerIdentityOrPassport

                ,
                SmeCompanyRegistrationNumber = getOwnerCompanyMapForViewDto.SmeCompanyRegistrationNumber

            };

            return PartialView("_ViewOwnerCompanyMapModal", model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping_Create, AppPermissions.Pages_Administration_OwnerCompanyMapping_Edit)]
        public PartialViewResult OwnerLookupTableModal(long? id, string displayName)
        {
            var viewModel = new OwnerCompanyMapOwnerLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_OwnerCompanyMapOwnerLookupTableModal", viewModel);
        }
        [AbpMvcAuthorize(AppPermissions.Pages_Administration_OwnerCompanyMapping_Create, AppPermissions.Pages_Administration_OwnerCompanyMapping_Edit)]
        public PartialViewResult SmeCompanyLookupTableModal(int? id, string displayName)
        {
            var viewModel = new OwnerCompanyMapSmeCompanyLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_OwnerCompanyMapSmeCompanyLookupTableModal", viewModel);
        }

    }
}