using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Lenders
{
    public interface IMatchesAppService : IApplicationService
    {
        Task<PagedResultDto<GetMatchForViewDto>> GetAll(GetAllMatchesInput input);

        Task<GetMatchForViewDto> GetMatchForView(int id);

        Task<GetMatchForEditOutput> GetMatchForEdit(EntityDto input);

        Task CreateOrEdit(CreateOrEditMatchDto input);

        Task Delete(EntityDto input);

        Task HardDelete(EntityDto input);

        Task<FileDto> GetMatchesToExcel(GetAllMatchesForExcelInput input);

    }
}