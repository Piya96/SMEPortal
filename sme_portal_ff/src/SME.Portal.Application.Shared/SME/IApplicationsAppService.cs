using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.SME.Dtos;
using SME.Portal.Dto;
using System.Collections.Generic;
using SME.Portal.SME;

namespace SME.Portal.SME
{
    public interface IApplicationsAppService : IApplicationService
    {
		//Task<FinanceProductMatchListDto> GetFinanceProductMatchesByUser();

        Task<PagedResultDto<GetApplicationForViewDto>> GetAll(GetAllApplicationsInput input);

        Task<GetApplicationForViewDto> GetApplicationForView(int id);

        Task<GetApplicationForEditOutput> GetApplicationForEdit(EntityDto input);

        Task<int> CreateOrEdit(CreateOrEditApplicationDto input);

        Task Delete(EntityDto input);

        Task HardDelete(EntityDto input);

        Task<FileDto> GetApplicationsToExcel(GetAllApplicationsForExcelInput input);

        Task<PagedResultDto<ApplicationUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);

        Task<PagedResultDto<ApplicationSmeCompanyLookupTableDto>> GetAllSmeCompanyForLookupTable(GetAllForLookupTableInput input);

        Task<IList<ApplicationDto>> GetLockedApplicationsByUserId(long userId);

    }
}