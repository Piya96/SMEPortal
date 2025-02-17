using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Company
{
    public interface ISmeCompaniesAppService : IApplicationService
    {
        Task<PagedResultDto<GetSmeCompanyForViewDto>> GetAll(GetAllSmeCompaniesInput input);

        Task<GetSmeCompanyForViewDto> GetSmeCompanyForView(int id);

        Task<GetSmeCompanyForEditOutput> GetSmeCompanyForEdit(EntityDto input);

        Task<int> CreateOrEdit(CreateOrEditSmeCompanyDto input);

        Task Delete(EntityDto input);

        Task HardDeleteForUser(long userId);

        Task<FileDto> GetSmeCompaniesToExcel(GetAllSmeCompaniesForExcelInput input);

        Task<PagedResultDto<SmeCompanyUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);

        Task<bool> BackgroundChecksResult(int id);

    }
}