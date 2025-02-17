using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.List.Dtos;
using SME.Portal.Dto;
using System.Collections.Generic;

namespace SME.Portal.List
{
    public interface IListItemsAppService : IApplicationService
    {
        Task<PagedResultDto<GetListItemForViewDto>> GetAll(GetAllListItemsInput input);

        List<ListItemDto> GetAll();

        Task<GetListItemForViewDto> GetListItemForView(int id);

        Task<GetListItemForEditOutput> GetListItemForEdit(EntityDto input);

        Task CreateOrEdit(CreateOrEditListItemDto input);

        Task Delete(EntityDto input);

        Task<FileDto> GetListItemsToExcel(GetAllListItemsForExcelInput input);

        List<ListItemDto> GetAllGrandChildLists(string grandParentListId);
        
        List<ListItemDto> GetAllChildLists(string parentListId);

        Task<string> GetListItemsName(string id);

    }
}