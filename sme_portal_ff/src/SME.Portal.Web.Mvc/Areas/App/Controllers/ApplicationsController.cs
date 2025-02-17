using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.Applications;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.SME;
using SME.Portal.SME.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Applications)]
    public class ApplicationsController : PortalControllerBase
    {
        private readonly IApplicationsAppService _applicationsAppService;

        public ApplicationsController(IApplicationsAppService applicationsAppService)
        {
            _applicationsAppService = applicationsAppService;
        }

        public ActionResult Index()
        {
            var model = new ApplicationsViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Applications_Create, AppPermissions.Pages_Administration_Applications_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetApplicationForEditOutput getApplicationForEditOutput;

            if (id.HasValue)
            {
                getApplicationForEditOutput = await _applicationsAppService.GetApplicationForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getApplicationForEditOutput = new GetApplicationForEditOutput
                {
                    Application = new CreateOrEditApplicationDto()
                };
                getApplicationForEditOutput.Application.Locked = DateTime.Now;
            }

            var viewModel = new CreateOrEditApplicationModalViewModel()
            {
                Application = getApplicationForEditOutput.Application,
                UserName = getApplicationForEditOutput.UserName,
                SmeCompanyName = getApplicationForEditOutput.SmeCompanyName,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewApplicationModal(int id)
        {
            var getApplicationForViewDto = await _applicationsAppService.GetApplicationForView(id);

            var model = new ApplicationViewModel()
            {
                Application = getApplicationForViewDto.Application
                ,
                UserName = getApplicationForViewDto.UserName

                ,
                SmeCompanyName = getApplicationForViewDto.SmeCompanyName

            };

            return PartialView("_ViewApplicationModal", model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Applications_Create, AppPermissions.Pages_Administration_Applications_Edit)]
        public PartialViewResult UserLookupTableModal(long? id, string displayName)
        {
            var viewModel = new ApplicationUserLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_ApplicationUserLookupTableModal", viewModel);
        }
        
        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Applications_Create, AppPermissions.Pages_Administration_Applications_Edit)]
        public PartialViewResult SmeCompanyLookupTableModal(int? id, string displayName)
        {
            var viewModel = new ApplicationSmeCompanyLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_ApplicationSmeCompanyLookupTableModal", viewModel);
        }

    }
}