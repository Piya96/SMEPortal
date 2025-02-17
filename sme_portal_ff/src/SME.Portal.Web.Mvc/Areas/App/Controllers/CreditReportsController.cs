using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.CreditReports;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.ConsumerCredit;
using SME.Portal.ConsumerCredit.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_CreditReports)]
    public class CreditReportsController : PortalControllerBase
    {
        private readonly ICreditReportsAppService _creditReportsAppService;

        public CreditReportsController(ICreditReportsAppService creditReportsAppService)
        {
            _creditReportsAppService = creditReportsAppService;
        }

        public ActionResult Index()
        {
            var model = new CreditReportsViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_CreditReports_Create, AppPermissions.Pages_CreditReports_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetCreditReportForEditOutput getCreditReportForEditOutput;

            if (id.HasValue)
            {
                getCreditReportForEditOutput = await _creditReportsAppService.GetCreditReportForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getCreditReportForEditOutput = new GetCreditReportForEditOutput
                {
                    CreditReport = new CreateOrEditCreditReportDto()
                };
                getCreditReportForEditOutput.CreditReport.EnquiryDate = DateTime.Now;
            }

            var viewModel = new CreateOrEditCreditReportModalViewModel()
            {
                CreditReport = getCreditReportForEditOutput.CreditReport,
                UserName = getCreditReportForEditOutput.UserName,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewCreditReportModal(int id)
        {
            var getCreditReportForViewDto = await _creditReportsAppService.GetCreditReportForView(id);

            var model = new CreditReportViewModel()
            {
                CreditReport = getCreditReportForViewDto.CreditReport
                ,
                UserName = getCreditReportForViewDto.UserName

            };

            return PartialView("_ViewCreditReportModal", model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_CreditReports_Create, AppPermissions.Pages_CreditReports_Edit)]
        public PartialViewResult UserLookupTableModal(long? id, string displayName)
        {
            var viewModel = new CreditReportUserLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_CreditReportUserLookupTableModal", viewModel);
        }

    }
}