using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.FinanceProducts;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Lenders;
using SME.Portal.Lenders.Dtos;
using Abp.Application.Services.Dto;
using System.Linq;
using SME.Portal.List;
using SME.Portal.Currency;
using SME.Portal.Authorization.Users;
using Newtonsoft.Json;
using System.Collections.Generic;
using SME.Portal.Install;
using SME.Portal.List.Dtos;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using SME.Portal.Configuration;
using SME.Portal.Lenders.Helpers;


namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize]
    public class FinanceProductsController : PortalControllerBase
    {
        private readonly IFinanceProductsAppService _financeProductsAppService;
        private readonly ILendersAppService _lendersAppService;
        private readonly IListItemsAppService _listItemsAppService;
        private readonly ICurrencyPairsAppService _currencyPairsAppService;
        private readonly IUserAppService _userAppService;
        private readonly IInstallAppService _installAppService;
        private readonly IConfigurationRoot _appConfiguration;

        public FinanceProductsController(IFinanceProductsAppService financeProductsAppService,
                                          ILendersAppService lendersAppService,
                                          IListItemsAppService listItemsAppService,
                                          ICurrencyPairsAppService currencyPairsAppService,
                                          IUserAppService userAppService,
                                          IInstallAppService installAppService, IWebHostEnvironment env)
        {
            _financeProductsAppService = financeProductsAppService;
            _lendersAppService = lendersAppService;
            _listItemsAppService = listItemsAppService;
            _currencyPairsAppService = currencyPairsAppService;
            _userAppService = userAppService;
            _installAppService = installAppService;
            _appConfiguration = env.GetAppConfiguration();
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_FinanceProducts)]
        public async Task<ActionResult> Index(int? id)
        {
            var model = new FinanceProductsViewModel
            {
                FilterText = "",
                LenderId = id
            };

            await BindSearch(model);

            return View(model);
        }

        private async Task BindSearch(FinanceProductsViewModel model)
        {
            model.Lenders = await _lendersAppService.GetAllEx();
            model.FinanceForLists = _listItemsAppService.GetAllGrandChildLists(ListIdsHelper.FinanceForListId);
            model.DocumentTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.DocumentTypeListIds);
            model.CustomerTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.CustomerTypeListId);
            model.ProvinceTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.ProvinceTypeListId);
            model.LoanIndexTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.LoanIndexTypeListId);
            model.LoanTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.LoanTypeListId);
            model.TechInnovationStageTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.TechInnovationStageTypeListId);
            model.IncomeReceivedTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.IncomeReceivedTypeListId);
            model.IndustrySectorLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.IndustrySectorListId);
            model.CompanyRegistrationTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.CompanyRegistrationTypeListId);
            model.StatusClassificationLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.StatusClassificationListId);
            model.StartupFundingLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.StartupFundingListId);
            model.Countries = _listItemsAppService.GetAllChildLists(ListIdsHelper.CountriesListId);
            model.LastUpdatedLegend = await _financeProductsAppService.GetLastUpdatedStatus();
            model.StaffMembers = await _userAppService.GetUsersList();
            model.BeeLevelLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.BeeLevelListId);
            model.OwnershipLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.OwnershipListId);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_FinanceProducts_Create, AppPermissions.Pages_Administration_FinanceProducts_Edit)]
        public async Task<ActionResult> Manage(int? id, string step)
        {
            var model = new ManageFinanceProductViewModel { FinanceProduct = new FinanceProductViewDto() };

            await BindManage(model, id);
            var properties = model.GetType().GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
            foreach(var item in properties)
            {
                if (item.Name.StartsWith("Step"))
                {
                    var value = item.GetValue(model) as string;
                    if (String.IsNullOrEmpty(value))
                    {
                        item.SetValue(model, "incomplete");
                    }
                }
            }
            if(id != 0 && id != null)
            {
                await _financeProductsAppService.UpdateCheckedOutSubjectId((int)id, (int)AbpSession.UserId);
            }
            model.CurrentStep = step;
            model.ProvinceTypeStrings = JsonConvert.SerializeObject(model.ProvinceTypeLists);
            model.OwnershipStrings = JsonConvert.SerializeObject(model.OwnershipLists);
            return View("Manage/ManageFinanceProduct", model);
        }

        public PartialViewResult ManageEdit(ManageFinanceProductViewModel modelObj)
        {
            var model = new ManageFinanceProductViewModel { FinanceProduct = new FinanceProductViewDto() };

            var objData = modelObj;
            var financeProdData = new FinanceProductViewDto();

            if(objData?.MatchCriteriaJsonString != null)
            {
                 objData.MatchCriteriaJsonString = objData.MatchCriteriaJsonString.Replace("\"IsDeleted\":null", "\"IsDeleted\":false");
                 financeProdData =  JsonConvert.DeserializeObject<FinanceProductViewDto>(objData.MatchCriteriaJsonString);
            }

            if (objData.LenderId != 0 && !String.IsNullOrEmpty(objData.FinanceProductName))
            {
                model.StepGeneralStatus = "complete";
            }
            else { model.StepGeneralStatus = "incomplete"; }
            if (financeProdData.MaxLoanAmount != 0 && financeProdData.MaxLoanAmount != null)
            {
                model.StepLoanAmountStatus = "complete";
            }
            else { model.StepLoanAmountStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.FinanceForSubListIds))
            {
                model.StepFinanceForStatus = "complete";
            }
            else { model.StepFinanceForStatus = "incomplete"; }
            if (financeProdData.SaCitizensOnly != null || financeProdData.IncludePermanentResidents != null)
            {
                model.StepSACitizenStatus = "complete";
            }
            else { model.StepSACitizenStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.CompanyRegistrationTypeListIds))
            {
                model.StepCompanyRegTypeStatus = "complete";
            }
            else { model.StepCompanyRegTypeStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.ProvinceListIds))
            {
                model.StepProvinceStatus = "complete";
            }
            else { model.StepProvinceStatus = "incomplete"; }
            if (financeProdData.MinimumMonthsTrading != null)
            {
                model.StepMonthsTradingStatus = "complete";
            }
            else { model.StepMonthsTradingStatus = "incomplete"; }
            if (financeProdData.MaxAverageAnnualTurnover != 0 && financeProdData.MaxAverageAnnualTurnover != null)
            {
                model.StepAverageAnnualTurnoverStatus = "complete";
            }
            else { model.StepAverageAnnualTurnoverStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.IndustrySectorListIds))
            {
                model.StepIndustrySectorsStatus = "complete";
            }
            else { model.StepIndustrySectorsStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.MonthlyOrSporadicIncome))
            {
                model.StepMonthlyIncomeStatus = "complete";
            }
            else { model.StepMonthlyIncomeStatus = "incomplete"; }
            if (financeProdData.RequiresProfitability != null)
            {
                model.StepProfitabilityStatus = "complete";
            }
            else { model.StepProfitabilityStatus = "incomplete"; }
            if (financeProdData.RequireBusinessCollateral != null || financeProdData.RequireOwnerCollateral != null)
            {
                model.StepCollateralStatus = "complete";
            }
            else { model.StepCollateralStatus = "incomplete"; }
            if (financeProdData.RequireBusinessCollateral != null || financeProdData.RequireOwnerCollateral != null)
            {
                model.StepCollateralStatus = "complete";
            }
            else { model.StepCollateralStatus = "incomplete"; }
            if (financeProdData.OwnershipRules != null && financeProdData.OwnershipRules.Count() != 0)
            {

                model.StepOwnershipStatus = "complete";
                
            }
            else { model.StepOwnershipStatus = "incomplete"; }
            if (financeProdData.RequireBusinessCollateral != null || financeProdData.RequireOwnerCollateral != null)
            {
                model.StepCollateralStatus = "complete";
            }
            else { model.StepCollateralStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.BeeLevelListIds))
            {
                model.StepBEELevelStatus = "complete";
            }
            else { model.StepBEELevelStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.CountryListIds))
            {
                model.StepCountryStatus = "complete";
            }
            else { model.StepCountryStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.CustomerTypeListIds))
            {
                model.StepCustomerTypesStatus = "complete";
            }
            else { model.StepCustomerTypesStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.RequiredDocumentTypeListIds) || !String.IsNullOrEmpty(financeProdData.NotRequiredDocumentTypeListIds))
            {
                model.StepDocumentTypeStatus = "complete";
            }
            else { model.StepDocumentTypeStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(objData.LenderType))
            {
                model.StepLoanIndexStatus = "complete";
            }
            else { model.StepLoanIndexStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(financeProdData.LoanTypeListIds))
            {
                model.StepLoanTypeStatus = "complete";
            }
            else { model.StepLoanTypeStatus = "incomplete"; }
            if (!String.IsNullOrEmpty(objData.Summary))
            {
                model.StepSummaryPageStatus = "complete";
            }
            else { model.StepSummaryPageStatus = "incomplete"; }
            if (objData.CommentPresent == true)
            {
                model.StepCommentStatus = "complete";
            }
            else { model.StepCommentStatus = "incomplete"; }
            if (objData.WebsiteUrlPresent == true)
            {
                model.StepWebsitesURLsStatus = "complete";
            }
            else { model.StepWebsitesURLsStatus = "incomplete"; }
            if (objData.ResearchUrlPresent == true)
            {
                model.StepResearchURLsStatus = "complete";
            }
            else { model.StepResearchURLsStatus = "incomplete"; }
            return PartialView("_Menu", model);
        }

        [HttpPost]
        public async Task CheckOutReset(int id)
        {
            await _financeProductsAppService.UpdateCheckedOutSubjectId(id, null); 
        }


        [HttpPost]
        public async Task<PartialViewResult> AddOwnershipRule(ManageFinanceProductViewModel model)
        {
            var rule = new CreateOrEditFinanceProductDto
            {
               Id = model.FinanceProductId,
               MatchCriteriaJson = model.MatchCriteriaJsonString,
            };
            await _financeProductsAppService.CreateOrEdit(rule);
            model.FinanceProduct = _financeProductsAppService.GetFinanceProductById(new EntityDto { Id = model.FinanceProductId });
            model.OwnershipLists = JsonConvert.DeserializeObject<List<ListItemDto>>(model.OwnershipStrings);
            return PartialView("_OwnershipTable", model);
        }

        [HttpPost]
        public async Task<PartialViewResult> DeleteOwnershipRule(ManageFinanceProductViewModel model)
        {
            var rule = new CreateOrEditFinanceProductDto
            {
               Id = model.FinanceProductId,
               MatchCriteriaJson = model.MatchCriteriaJsonString,
            };
            await _financeProductsAppService.CreateOrEdit(rule);
            model.FinanceProduct = _financeProductsAppService.GetFinanceProductById(new EntityDto { Id = model.FinanceProductId });
            model.OwnershipLists = JsonConvert.DeserializeObject<List<ListItemDto>>(model.OwnershipStrings);
            return PartialView("_OwnershipTable", model);
        }

        [HttpPost]
        public async Task<PartialViewResult> AddWebsiteUrl(ManageFinanceProductViewModel model)
        {
            var websiteurl = new CreateWebsiteUrlDto
            {
                Url = model.WebsiteUrl,
                IsPrimary = model.IsPrimary,
                FinanceProductId = model.FinanceProductId,
            };
            var insertedWebsiteUrl = await _financeProductsAppService.AddWebsiteUrl(websiteurl);
            await _financeProductsAppService.ResetPrimaryUrls(insertedWebsiteUrl, model.FinanceProductId);
            var websiteurls = await _financeProductsAppService.GetWebsiteUrlsByFinanceProductId(model.FinanceProductId);
            model.WebsiteUrls = new List<WebsiteUrlDto>(websiteurls);
            return PartialView("_WebsiteUrlsList", model);
        }

        [HttpPost]
        public async Task<PartialViewResult> AddResearchUrl(ManageFinanceProductViewModel model)
        {
            var researchurl = new CreateResearchUrlDto
            {
                Url = model.ResearchUrl,
                FinanceProductId = model.FinanceProductId,
            };
            await _financeProductsAppService.AddResearchUrl(researchurl);
            var researchurls = await _financeProductsAppService.GetResearchUrlsByFinanceProductId(model.FinanceProductId);
            model.ResearchUrls = new List<ResearchUrlDto>(researchurls);
            return PartialView("_ResearchUrlsList", model);
        }

        [HttpPost]
        public async Task<PartialViewResult> AddFinanceProductComment(ManageFinanceProductViewModel model)
        {
            var comment = new FinanceProductCommentDto
            {
                Text = model.FinanceProductCommentText,
                FinanceProductId = model.FinanceProductId,
                UserId = model.FinanceProductCommentUserId,
            };
            await _financeProductsAppService.CreateFinanceProductComment(comment);
            var comments = await _financeProductsAppService.GetFinanceProductCommentsByFinanceProductId(model.FinanceProductId);
            model.FinanceProductComments = new List<FinanceProductCommentDto>(comments);
            return PartialView("_CommentsList", model);
        }

        [HttpPost]
        public async Task<PartialViewResult> DeleteWebsiteUrl(ManageFinanceProductViewModel model)
        {
            await _financeProductsAppService.DeleteWebsiteUrl(model.WebsiteUrlId);
            var websiteurls = await _financeProductsAppService.GetWebsiteUrlsByFinanceProductId(model.FinanceProductId);
            model.WebsiteUrls = new List<WebsiteUrlDto>(websiteurls);
            return PartialView("_WebsiteUrlsList", model);
        }

        [HttpPost]
        public async Task<PartialViewResult> DeleteResearchUrl(ManageFinanceProductViewModel model)
        {
            await _financeProductsAppService.DeleteResearchUrl(model.ResearchUrlId);
            var researchurls = await _financeProductsAppService.GetResearchUrlsByFinanceProductId(model.FinanceProductId);
            model.ResearchUrls = new List<ResearchUrlDto>(researchurls);
            return PartialView("_ResearchUrlsList", model);
        }

        [HttpPost]
        public async Task<PartialViewResult> DeleteFinanceProductComment(ManageFinanceProductViewModel model)
        {
            await _financeProductsAppService.DeleteFinanceProductComments(model.FinanceProductCommentId);
            var comments = await _financeProductsAppService.GetFinanceProductCommentsByFinanceProductId(model.FinanceProductId);
            model.FinanceProductComments = new List<FinanceProductCommentDto>(comments);
            return PartialView("_CommentsList", model);
        }

        private async Task BindManage(ManageFinanceProductViewModel model, int? id)
        {
            model.Lenders = await _lendersAppService.GetAllEx();
            model.Lenders = model.Lenders.OrderBy(p => p.Name).ToList();
            model.FinanceForLists = _listItemsAppService.GetAllGrandChildLists(ListIdsHelper.FinanceForListId);
            model.FinanceForSubLists = model.FinanceForLists.SelectMany(a => _listItemsAppService.GetAllChildLists(a.ListId)).ToList();
            model.FinanceForSubChildLists = model.FinanceForSubLists.SelectMany(a => _listItemsAppService.GetAllChildLists(a.ListId)).ToList();
            model.IndustrySectorLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.IndustrySectorListId);
            model.IndustrySectorSubLists = model.IndustrySectorLists.SelectMany(a => _listItemsAppService.GetAllChildLists(a.ListId)).ToList();
            model.ProvinceTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.ProvinceTypeListId);
            model.CompanyRegistrationTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.CompanyRegistrationTypeListId);
            model.BeeLevelLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.BeeLevelListId);
            model.Countries = _listItemsAppService.GetAllChildLists(ListIdsHelper.CountriesListId);
            model.CustomerTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.CustomerTypeListId);
            model.DocumentTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.DocumentTypeListIds);
            model.LoanIndexLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.LoanIndexTypeListIds);
            model.LoanTypeLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.LoanTypeListIds);
            model.LoanTypeSubLists = model.LoanTypeLists.SelectMany(a => _listItemsAppService.GetAllChildLists(a.ListId)).ToList();
            model.OwnershipLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.OwnershipListId);
            model.CurrencyPairs = _currencyPairsAppService.GetAllCurrencyPairs();
            model.StaffMembers = await _userAppService.GetUsersList();

            if (id != null && id != 0)
            {
                model.FinanceProduct = _financeProductsAppService.GetFinanceProductById(new EntityDto { Id = (int)id });
                model.WebsiteUrls = await _financeProductsAppService.GetWebsiteUrlsByFinanceProductId((int)id);
                model.ResearchUrls = await _financeProductsAppService.GetResearchUrlsByFinanceProductId((int)id);
                model.FinanceProductComments = await _financeProductsAppService.GetFinanceProductCommentsByFinanceProductId((int)id);
                model.IsEdit = true;
            }
            else
            {
                model.IsEdit = false;
            }
        }
        
    }
}