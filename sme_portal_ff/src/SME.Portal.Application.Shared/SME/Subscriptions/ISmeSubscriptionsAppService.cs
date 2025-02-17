using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Sme.Subscriptions
{
    public interface ISmeSubscriptionsAppService : IApplicationService
    {
        Task<PagedResultDto<GetSmeSubscriptionForViewDto>> GetAll(GetAllSmeSubscriptionsInput input);

        Task<GetSmeSubscriptionForViewDto> GetSmeSubscriptionForView(int id);

        Task<GetSmeSubscriptionForEditOutput> GetSmeSubscriptionForEdit(EntityDto input);

        Task CreateOrEdit(CreateOrEditSmeSubscriptionDto input);

        Task Delete(EntityDto input);

        Task<FileDto> GetSmeSubscriptionsToExcel(GetAllSmeSubscriptionsForExcelInput input);

    }
}