using Abp.Application.Services.Dto;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SME.Portal.Authorization;
using SME.Portal.Authorization.Users;
using SME.Portal.Currency;
using SME.Portal.Install;
using SME.Portal.Install.Dto;
using SME.Portal.Lenders;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Lenders.Helpers;
using SME.Portal.Web.Areas.App.Models.FinanceProducts;
using SME.Portal.Web.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SME.Portal.Configuration;
using Newtonsoft.Json;
using SME.Portal.List.Dtos;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [AllowAnonymous]
    [Area("App")]
    public class FundFormsController : PortalControllerBase
    {
        private readonly IFundFormsAppService _fundFormsAppService;
        private readonly IFinanceProductsAppService _financeProductsAppService;
        private readonly ICurrencyPairsAppService _currencyPairsAppService;
        private readonly IUserAppService _userAppService;
        private readonly ILendersAppService _lendersAppService;
        private readonly IInstallAppService _installAppService;
        private readonly IConfigurationRoot _appConfiguration;

        public FundFormsController(IFinanceProductsAppService financeProductsAppService,
                                          IFundFormsAppService fundFormsAppService,
                                          ILendersAppService lendersAppService,
                                          ICurrencyPairsAppService currencyPairsAppService,
                                          IUserAppService userAppService,
                                          IInstallAppService installAppService, IWebHostEnvironment env)
        {
            _fundFormsAppService = fundFormsAppService;
            _financeProductsAppService = financeProductsAppService;
            _currencyPairsAppService = currencyPairsAppService;
            _userAppService = userAppService;
            _lendersAppService = lendersAppService;
            _installAppService = installAppService;
            _appConfiguration = env.GetAppConfiguration();
        }

        public IActionResult Index()
        {
            return View();
        }
        [AllowAnonymous]
        public async Task<ActionResult> ManageFundForms(FundFormInput input)
        {
            try
            {
                var model = new ManageFundFormViewModel { FinanceProduct = new FinanceProductViewDto(), ManageFundFormToken = input.Token, EncryptedFundFormToken = input.c };
                await BindManageFundForms(model, input.Token);
                model.OwnershipStrings = JsonConvert.SerializeObject(model.OwnershipLists);
                if (model.FundFormError)
                {
                    return View("~/Areas/App/Views/FundForms/_ErrorFundForm.cshtml");
                }
                else if (model.FinanceProduct.BeenCompleted)
                {
                    return View("~/Areas/App/Views/FundForms/_FinishedFundForm.cshtml", model);
                }
                else if (model.FundFormExpired)
                {
                    return View("~/Areas/App/Views/FundForms/_ExpiredFundForm.cshtml");
                }
                return View("~/Areas/App/Views/FundForms/ManageFundForms.cshtml", model);
            }
            catch (Exception e)
            {
                return View("~/Areas/App/Views/FundForms/_ErrorFundForm.cshtml");
            }
        }

        public PartialViewResult SendFundForm(int financeProductId)
        {
            var viewModel = new SendFundFormsModalViewModel()
            {
                FundForm = new FundFormDto()
                {
                    FinanceProductId = financeProductId
                }
            };
            return PartialView("~/Areas/App/Views/FundForms/_SendFundForm.cshtml", viewModel);
        }

        private async Task BindManageFundForms(ManageFundFormViewModel model, Guid tokens)
        {
            model.FinanceProduct = await _fundFormsAppService.GetManageFundFormByFinanceProductId(tokens);
            if(model.FinanceProduct == null)
            {
                model.FundFormError = true;
                return;
            }
            else if ((DateTimeExt.GetSaNow() - model.FinanceProduct.TokenIssueDate).TotalDays > 7)
            {
                model.FundFormExpired = true;
                return;
            }
            model.FinanceForLists = _fundFormsAppService.GetAllGrandChildLists(ListIdsHelper.FinanceForListId, model.FinanceProduct.TenantId);
            model.FinanceForSubLists = model.FinanceForLists.SelectMany(a => _fundFormsAppService.GetAllChildLists(a.ListId, model.FinanceProduct.TenantId)).ToList();
            model.FinanceForSubChildLists = model.FinanceForSubLists.SelectMany(a => _fundFormsAppService.GetAllChildLists(a.ListId, model.FinanceProduct.TenantId)).ToList();
            model.IndustrySectorLists = _fundFormsAppService.GetAllChildLists(ListIdsHelper.IndustrySectorListId, model.FinanceProduct.TenantId);
            model.IndustrySectorSubLists = model.IndustrySectorLists.SelectMany(a => _fundFormsAppService.GetAllChildLists(a.ListId, model.FinanceProduct.TenantId)).ToList();
            model.ProvinceTypeLists = _fundFormsAppService.GetAllChildLists(ListIdsHelper.ProvinceTypeListId, model.FinanceProduct.TenantId);
            model.CompanyRegistrationTypeLists = _fundFormsAppService.GetAllChildLists(ListIdsHelper.CompanyRegistrationTypeListId, model.FinanceProduct.TenantId);
            model.BeeLevelLists = _fundFormsAppService.GetAllChildLists(ListIdsHelper.BeeLevelListId, model.FinanceProduct.TenantId);
            model.Countries = _fundFormsAppService.GetAllChildLists(ListIdsHelper.CountriesListId, model.FinanceProduct.TenantId);
            model.CustomerTypeLists = _fundFormsAppService.GetAllChildLists(ListIdsHelper.CustomerTypeListId, model.FinanceProduct.TenantId);
            model.DocumentTypeLists = _fundFormsAppService.GetAllChildLists(ListIdsHelper.DocumentTypeListIds, model.FinanceProduct.TenantId);
            model.LoanIndexLists = _fundFormsAppService.GetAllChildLists(ListIdsHelper.LoanIndexTypeListIds, model.FinanceProduct.TenantId);
            model.LoanTypeLists = _fundFormsAppService.GetAllChildLists(ListIdsHelper.LoanTypeListIds, model.FinanceProduct.TenantId);
            model.LoanTypeSubLists = model.LoanTypeLists.SelectMany(a => _fundFormsAppService.GetAllChildLists(a.ListId, model.FinanceProduct.TenantId)).ToList();
            model.OwnershipLists = _fundFormsAppService.GetAllChildLists(ListIdsHelper.OwnershipListId, model.FinanceProduct.TenantId);
        }

        public async Task<ActionResult> FundForms(int? id)
        {
            var model = new FundFormsViewModel { FundForms = new List<FundFormDto>(), FinanceProductIdInFundForms = (int)id };
            var fundforms = await _fundFormsAppService.GetFundFormsByFinanceProductId((int)id);
            model.FundForms = new List<FundFormDto>(fundforms);
            return View("~/Areas/App/Views/FundForms/_FundForm.cshtml", model); 
        }
        public async Task<ActionResult> FinanceProductDraftView(int? id)
        {
            var model = new FundFormDraftViewModel();

            var draft = _fundFormsAppService.GetFundFormDraftViewById(new EntityDto { Id = (int)id });
            model.FinanceProductDraft = draft;

            model.FinanceForResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.FinanceForSubListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.FinanceForSubListIds, model.FinanceProductDraft.TenantId) : null;
            model.RequiredDocResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.RequiredDocumentTypeListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.RequiredDocumentTypeListIds, model.FinanceProductDraft.TenantId) : null;
            model.NotRequiredDocResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.NotRequiredDocumentTypeListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.NotRequiredDocumentTypeListIds, model.FinanceProductDraft.TenantId) : null;
            model.CompanyRegTypeResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.CompanyRegistrationTypeListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.CompanyRegistrationTypeListIds, model.FinanceProductDraft.TenantId) : null;
            model.ProvinceResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.ProvinceListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.ProvinceListIds, model.FinanceProductDraft.TenantId) : null;
            model.BEELevelResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.BeeLevelListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.BeeLevelListIds, model.FinanceProductDraft.TenantId) : null;
            model.IndustrySectorResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.IndustrySectorListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.IndustrySectorListIds, model.FinanceProductDraft.TenantId) : null;
            model.FinanceProductDraft.Province = !String.IsNullOrEmpty(model.FinanceProductDraft.Province) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.Province, model.FinanceProductDraft.TenantId) : null;
            return View("~/Areas/App/Views/FundForms/_FundFormDraftView.cshtml", model);
        }

        [AbpAllowAnonymous]
        public async Task<ActionResult> ExportPdf(int? id)
        {
            var model = new FundFormDraftViewModel();

            var draft = _fundFormsAppService.GetFundFormDraftViewById(new EntityDto { Id = (int)id });
            model.FinanceProductDraft = draft;
            model.FinanceForResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.FinanceForSubListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.FinanceForSubListIds, model.FinanceProductDraft.TenantId) : null;
            model.RequiredDocResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.RequiredDocumentTypeListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.RequiredDocumentTypeListIds, model.FinanceProductDraft.TenantId) : null;
            model.NotRequiredDocResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.NotRequiredDocumentTypeListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.NotRequiredDocumentTypeListIds, model.FinanceProductDraft.TenantId) : null;
            model.CompanyRegTypeResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.CompanyRegistrationTypeListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.CompanyRegistrationTypeListIds, model.FinanceProductDraft.TenantId) : null;
            model.ProvinceResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.ProvinceListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.ProvinceListIds, model.FinanceProductDraft.TenantId) : null;
            model.BEELevelResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.BeeLevelListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.BeeLevelListIds, model.FinanceProductDraft.TenantId) : null;
            model.IndustrySectorResultList = !String.IsNullOrEmpty(model.FinanceProductDraft.IndustrySectorListIds) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.IndustrySectorListIds, model.FinanceProductDraft.TenantId) : null;
            model.FinanceProductDraft.Province = !String.IsNullOrEmpty(model.FinanceProductDraft.Province) ? await _fundFormsAppService.GetListItemsName(model.FinanceProductDraft.Province, model.FinanceProductDraft.TenantId) : null;
            return View("~/Areas/App/Views/FundForms/_ExportPdf.cshtml", model);
        }

        public async Task<IActionResult> DownLoadExportPdf(int id)
        {
            var date = DateRangeHelper.Today(DateTimeExt.GetSaNow());
            var fpd = _fundFormsAppService.GetFundFormDraftViewById(new EntityDto { Id = (int)id });

            //_appConfiguration.ControlPanelPortalUrl = "http://bc24ea3a.ngrok.io";
            //THIS NEEDS TO STAY HERE TO OVERRIDE  WHAT IS IN THE ENV FILES. THE PDF SERVICE CAN'T CALL HTTPS
            //var ControlPanelPortalUrl = "http://085db7c9.ngrok.io";
            var baseurl = new AppSettingsJsonDto();
            baseurl = _installAppService.GetAppSettingsJson();

            return await HtmlToPdfHelper.GetPdf(baseurl.WebSiteUrl+"/App/FundForms/ExportPdf/"+id, $"{fpd.LenderName}-{fpd.FinanceProductName}-{date.StartDateDisplay}", _appConfiguration["ApiToPdf:ApiToPdfBaseUrl"]);
        }
        [AbpAllowAnonymous]
        public async Task CreateOrEdit(CreateOrEditFundFormDto input)
        {
            await _fundFormsAppService.CreateOrEditFundForm(input);
        }

        [HttpPost]
        public async Task<PartialViewResult> AddOwnershipRule(CreateOrEditFundFormDto input)
        {
            await _fundFormsAppService.CreateOrEditFundForm(input);
            var model = new ManageFundFormViewModel();
            model.FinanceProduct = await _fundFormsAppService.GetManageFundFormByFinanceProductId(input.Token);
            model.OwnershipLists = JsonConvert.DeserializeObject<List<ListItemDto>>(model.OwnershipStrings);
            return PartialView("../FinanceProducts/_OwnershipTable", model);
        }

        [HttpPost]
        public async Task<PartialViewResult> DeleteOwnershipRule(CreateOrEditFundFormDto input)
        {
            await _fundFormsAppService.CreateOrEditFundForm(input);
            var model = new ManageFundFormViewModel();
            model.FinanceProduct = await _fundFormsAppService.GetManageFundFormByFinanceProductId(input.Token);
            model.OwnershipLists = JsonConvert.DeserializeObject<List<ListItemDto>>(model.OwnershipStrings);
            return PartialView("../FinanceProducts/_OwnershipTable", model);
        }

        [AbpAllowAnonymous]
        public async Task<ActionResult> FundFormSuccess(FundFormInput input)
        {
            var model = new ManageFundFormViewModel();
            model.FinanceProduct = await _fundFormsAppService.GetManageFundFormByFinanceProductId(input.Token);
            return View("~/Areas/App/Views/FundForms/_FinishedFundForm.cshtml", model);
        }
        [AbpMvcAuthorize(AppPermissions.Pages_Administration_FinanceProducts_Edit)]
        public async Task MergeFundForm(int fundFormId)
        {
            var data = new CreateOrEditFinanceProductDto();
            var fundForm = _fundFormsAppService.GetFundFormDraftViewById(new EntityDto { Id = (int)fundFormId });
            data.MatchCriteriaJson = fundForm.MatchCriteriaJson;
            data.Name = fundForm.FinanceProductName;
            data.Id = fundForm.FinanceProductId;
            await _financeProductsAppService.CreateOrEdit(data);
            if(fundForm != null && !String.IsNullOrEmpty(fundForm.FundWebsiteAddress))
            {
                await _financeProductsAppService.MergeFundFormsPrimaryWebsiteUrls(fundForm.FinanceProductId, fundForm.FundWebsiteAddress);
            }
        }
    }
}
