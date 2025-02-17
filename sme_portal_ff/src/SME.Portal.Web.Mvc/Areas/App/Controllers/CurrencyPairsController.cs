using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.CurrencyPairs;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Currency;
using SME.Portal.Currency.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_CurrencyPairs)]
    public class CurrencyPairsController : PortalControllerBase
    {
        private readonly ICurrencyPairsAppService _currencyPairsAppService;

        public CurrencyPairsController(ICurrencyPairsAppService currencyPairsAppService)
        {
            _currencyPairsAppService = currencyPairsAppService;
        }

        public ActionResult Index()
        {
            var model = new CurrencyPairsViewModel
			{
				FilterText = ""
			};

            return View(model);
        } 
       

			 [AbpMvcAuthorize(AppPermissions.Pages_Administration_CurrencyPairs_Create, AppPermissions.Pages_Administration_CurrencyPairs_Edit)]
			public async Task<PartialViewResult> CreateOrEditModal(int? id)
			{
				GetCurrencyPairForEditOutput getCurrencyPairForEditOutput;

				if (id.HasValue){
					getCurrencyPairForEditOutput = await _currencyPairsAppService.GetCurrencyPairForEdit(new EntityDto { Id = (int) id });
				}
				else {
					getCurrencyPairForEditOutput = new GetCurrencyPairForEditOutput{
						CurrencyPair = new CreateOrEditCurrencyPairDto()
					};
				}

				var viewModel = new CreateOrEditCurrencyPairModalViewModel()
				{
					CurrencyPair = getCurrencyPairForEditOutput.CurrencyPair,                
				};

				return PartialView("_CreateOrEditModal", viewModel);
			}
			

        public async Task<PartialViewResult> ViewCurrencyPairModal(int id)
        {
			var getCurrencyPairForViewDto = await _currencyPairsAppService.GetCurrencyPairForView(id);

            var model = new CurrencyPairViewModel()
            {
                CurrencyPair = getCurrencyPairForViewDto.CurrencyPair
            };

            return PartialView("_ViewCurrencyPairModal", model);
        }


    }
}