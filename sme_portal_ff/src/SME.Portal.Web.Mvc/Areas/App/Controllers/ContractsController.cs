using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.Contracts;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Lenders;
using SME.Portal.Lenders.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Contracts)]
    public class ContractsController : PortalControllerBase
    {
        private readonly IContractsAppService _contractsAppService;

        public ContractsController(IContractsAppService contractsAppService)
        {
            _contractsAppService = contractsAppService;
        }

        public ActionResult Index()
        {
            var model = new ContractsViewModel
			{
				FilterText = ""
			};

            return View(model);
        } 
       

		[AbpMvcAuthorize(AppPermissions.Pages_Administration_Contracts_Create, AppPermissions.Pages_Administration_Contracts_Edit)]
		public async Task<PartialViewResult> CreateOrEditModal(int? id)
		{
			GetContractForEditOutput getContractForEditOutput;

			if (id.HasValue){
				getContractForEditOutput = await _contractsAppService.GetContractForEdit(new EntityDto { Id = (int) id });
			}
			else {
				getContractForEditOutput = new GetContractForEditOutput{
					Contract = new CreateOrEditContractDto()
				};
			getContractForEditOutput.Contract.Start = DateTime.Now;
			getContractForEditOutput.Contract.Expiry = DateTime.Now;
			}

			var viewModel = new CreateOrEditContractModalViewModel()
			{
				Contract = getContractForEditOutput.Contract,
				LenderName = getContractForEditOutput.LenderName,
				UserName = getContractForEditOutput.UserName,                
			};

			return PartialView("_CreateOrEditModal", viewModel);
		}
			

        public async Task<PartialViewResult> ViewContractModal(int id)
        {
			var getContractForViewDto = await _contractsAppService.GetContractForView(id);

            var model = new ContractViewModel()
            {
                Contract = getContractForViewDto.Contract
                , LenderName = getContractForViewDto.LenderName 

                , UserName = getContractForViewDto.UserName 

            };

            return PartialView("_ViewContractModal", model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Contracts_Create, AppPermissions.Pages_Administration_Contracts_Edit)]
        public PartialViewResult LenderLookupTableModal(int? id, string displayName)
        {
            var viewModel = new ContractLenderLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_ContractLenderLookupTableModal", viewModel);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Contracts_Create, AppPermissions.Pages_Administration_Contracts_Edit)]
        public PartialViewResult UserLookupTableModal(long? id, string displayName)
        {
            var viewModel = new ContractUserLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_ContractUserLookupTableModal", viewModel);
        }

    }
}