using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.ListItems;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.List;
using SME.Portal.List.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_ListItems)]
    public class ListItemsController : PortalControllerBase
    {
        private readonly IListItemsAppService _listItemsAppService;

        public ListItemsController(IListItemsAppService listItemsAppService)
        {
            _listItemsAppService = listItemsAppService;
        }

        public ActionResult Index()
        {
            var model = new ListItemsViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_ListItems_Create, AppPermissions.Pages_Administration_ListItems_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetListItemForEditOutput getListItemForEditOutput;

            if (id.HasValue)
            {
                getListItemForEditOutput = await _listItemsAppService.GetListItemForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getListItemForEditOutput = new GetListItemForEditOutput
                {
                    ListItem = new CreateOrEditListItemDto()
                };
            }

            var viewModel = new CreateOrEditListItemModalViewModel()
            {
                ListItem = getListItemForEditOutput.ListItem,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewListItemModal(int id)
        {
            var getListItemForViewDto = await _listItemsAppService.GetListItemForView(id);

            var model = new ListItemViewModel()
            {
                ListItem = getListItemForViewDto.ListItem
            };

            return PartialView("_ViewListItemModal", model);
        }

    }
}