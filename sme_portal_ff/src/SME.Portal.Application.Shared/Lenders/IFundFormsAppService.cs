using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Lenders.Dtos;
using SME.Portal.List.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.Lenders
{
    public interface IFundFormsAppService : IApplicationService
    {
        Task<FinanceProductViewDto> GetManageFundFormByFinanceProductId(Guid tokens);
        Task<List<FundFormDto>> GetFundFormsByFinanceProductId(int financeProductId);
        FundFormViewDto GetFundFormDraftViewById(EntityDto input);
        Task CreateOrEditFundForm(CreateOrEditFundFormDto input);
        List<ListItemDto> GetAllGrandChildLists(string grandParentListId, int? tenantId);
        List<ListItemDto> GetAllChildLists(string parentListId, int? tenantId);
        Task<string> GetListItemsName(string id, int? tenantId);
    }
}
