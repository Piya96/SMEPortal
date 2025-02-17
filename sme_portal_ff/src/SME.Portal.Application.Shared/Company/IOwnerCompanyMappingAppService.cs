using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Company
{
    public interface IOwnerCompanyMappingAppService : IApplicationService
    {
        Task<PagedResultDto<GetOwnerCompanyMapForViewDto>> GetAll(GetAllOwnerCompanyMappingInput input);
        Task<List<OwnerCompanyMapDto>> GetAllForUserId(long userId);
        Task<GetOwnerCompanyMapForViewDto> GetOwnerCompanyMapForView(int id);

        Task<GetOwnerCompanyMapForEditOutput> GetOwnerCompanyMapForEdit(EntityDto input);

        Task<int> CreateOrEdit(CreateOrEditOwnerCompanyMapDto input);

        Task Delete(EntityDto input);
        Task HardDeleteForUser(long userId);

        Task<FileDto> GetOwnerCompanyMappingToExcel(GetAllOwnerCompanyMappingForExcelInput input);

        Task<PagedResultDto<OwnerCompanyMapOwnerLookupTableDto>> GetAllOwnerForLookupTable(GetAllForLookupTableInput input);

        Task<PagedResultDto<OwnerCompanyMapSmeCompanyLookupTableDto>> GetAllSmeCompanyForLookupTable(GetAllForLookupTableInput input);

    }
}