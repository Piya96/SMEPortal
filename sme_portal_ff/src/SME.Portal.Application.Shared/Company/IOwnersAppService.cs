using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Company
{
    public interface IOwnersAppService : IApplicationService
    {
        Task<PagedResultDto<GetOwnerForViewDto>> GetAll(GetAllOwnersInput input);

        Task<GetOwnerForViewDto> GetOwnerForView(long id);

        Task<GetOwnerForEditOutput> GetOwnerForEdit(EntityDto<long> input);

        Task<long> CreateOrEdit(CreateOrEditOwnerDto input);

        Task Delete(EntityDto<long> input);

        Task DeleteForUser(long userId);

        Task<FileDto> GetOwnersToExcel(GetAllOwnersForExcelInput input);

        Task<PagedResultDto<OwnerUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);

    }
}