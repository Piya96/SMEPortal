using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.Lenders;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Lenders;
using SME.Portal.Lenders.Dtos;
using SME.Portal.List;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using SME.Portal.Configuration;
using SME.Portal.Lenders.Helpers;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Lenders)]
    public class LendersController : PortalControllerBase
    {
        private readonly ILendersAppService _lendersAppService;
        private readonly IFinanceProductsAppService _financeProductsAppService;
        private readonly IListItemsAppService _listItemsAppService;
        private readonly IConfigurationRoot _appConfiguration;

        public LendersController(ILendersAppService lendersAppService, IListItemsAppService listItemsAppService, IFinanceProductsAppService financeProductsAppService, IWebHostEnvironment env)
        {
            _lendersAppService = lendersAppService;
            _listItemsAppService = listItemsAppService;
            _financeProductsAppService = financeProductsAppService;
            _appConfiguration = env.GetAppConfiguration();
        }

        public ActionResult Index()
        {
            var provincLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.ProvinceTypeListId);
            var lenderType = _listItemsAppService.GetAllChildLists(ListIdsHelper.LoanIndexTypeListIds);
            var model = new LendersViewModel
            {
                FilterText = "",
                ProvinceTypeLists = provincLists,
                LenderTypeLists = lenderType
            };

            return View(model);
        }


        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Lenders_Create, AppPermissions.Pages_Administration_Lenders_Edit)]
        public async Task<ActionResult> CreateOrEditModal(int? id)
        {
            GetLenderForEditOutput getLenderForEditOutput;
            var financeProductList = new List<FinanceProductDto>();
            if (id.HasValue)
            {
                getLenderForEditOutput = await _lendersAppService.GetLenderForEdit(id.Value);
                financeProductList = _financeProductsAppService.GetAllFinanceProductsByLenderId(id.Value);
            }
            else
            {
                getLenderForEditOutput = new GetLenderForEditOutput
                {
                    Lender = new CreateOrEditLenderDto()
                };
            }

            var countries = await _lendersAppService.GetCountries();
            var lenderType = _listItemsAppService.GetAllChildLists(ListIdsHelper.LoanIndexTypeListIds);
            var provincLists = _listItemsAppService.GetAllChildLists(ListIdsHelper.ProvinceTypeListId);
            var viewModel = new CreateOrEditLenderModalViewModel()
            {
                Lender = getLenderForEditOutput.Lender,
                Country = countries,
                LenderTypeLists = lenderType,
                ProvinceTypeLists = provincLists,
                FinanceProducts = financeProductList,
                FinanceProductCount = financeProductList.Where(f => !f.Enabled).Count(),
            };

            return View("_CreateOrEdit", viewModel);
        }

        public async Task<PartialViewResult> CommentsLenderModal(int id)
        {
            var getLenderCommentForViewDto = await _lendersAppService.GetLenderCommentForView(id);
            var Comment = new CommentDto()
            {
                LenderId = id,
            };

            var viewModel = new CommentsLenderModalViewModel()
            {
                Comment = Comment,
                Comments = getLenderCommentForViewDto,
            };

            return PartialView("_CommentsModal", viewModel);
        }

    }
}