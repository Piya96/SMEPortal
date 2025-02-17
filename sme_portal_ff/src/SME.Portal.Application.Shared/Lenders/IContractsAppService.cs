using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Dto;


namespace SME.Portal.Lenders
{
    public interface IContractsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetContractForViewDto>> GetAll(GetAllContractsInput input);

        Task<GetContractForViewDto> GetContractForView(int id);

		Task<GetContractForEditOutput> GetContractForEdit(EntityDto input);

		Task CreateOrEdit(CreateOrEditContractDto input);

		Task Delete(EntityDto input);

		Task<FileDto> GetContractsToExcel(GetAllContractsForExcelInput input);

		
		Task<PagedResultDto<ContractLenderLookupTableDto>> GetAllLenderForLookupTable(GetAllForLookupTableInput input);
		
		Task<PagedResultDto<ContractUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);
		
    }
}