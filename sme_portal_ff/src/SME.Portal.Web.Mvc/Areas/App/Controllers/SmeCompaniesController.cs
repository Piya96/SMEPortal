using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.SmeCompanies;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_SmeCompanies)]
    public class SmeCompaniesController : PortalControllerBase
    {
        private readonly ISmeCompaniesAppService _smeCompaniesAppService;

        public SmeCompaniesController(ISmeCompaniesAppService smeCompaniesAppService)
        {
            _smeCompaniesAppService = smeCompaniesAppService;
        }

        public ActionResult Index()
        {
            var model = new SmeCompaniesViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_SmeCompanies_Create, AppPermissions.Pages_Administration_SmeCompanies_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetSmeCompanyForEditOutput getSmeCompanyForEditOutput;

            if (id.HasValue)
            {
                getSmeCompanyForEditOutput = await _smeCompaniesAppService.GetSmeCompanyForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getSmeCompanyForEditOutput = new GetSmeCompanyForEditOutput
                {
                    SmeCompany = new CreateOrEditSmeCompanyDto()
                };
                getSmeCompanyForEditOutput.SmeCompany.RegistrationDate = DateTime.Now;
                getSmeCompanyForEditOutput.SmeCompany.StartedTradingDate = DateTime.Now;
            }

            var viewModel = new CreateOrEditSmeCompanyModalViewModel()
            {
                SmeCompany = getSmeCompanyForEditOutput.SmeCompany,
                UserName = getSmeCompanyForEditOutput.UserName,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewSmeCompanyModal(int id)
        {
            var getSmeCompanyForViewDto = await _smeCompaniesAppService.GetSmeCompanyForView(id);

            var model = new SmeCompanyViewModel()
            {
                SmeCompany = getSmeCompanyForViewDto.SmeCompany
                ,
                UserName = getSmeCompanyForViewDto.UserName

            };

            return PartialView("_ViewSmeCompanyModal", model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_SmeCompanies_Create, AppPermissions.Pages_Administration_SmeCompanies_Edit)]
        public PartialViewResult UserLookupTableModal(long? id, string displayName)
        {
            var viewModel = new SmeCompanyUserLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_SmeCompanyUserLookupTableModal", viewModel);
        }

    }
}