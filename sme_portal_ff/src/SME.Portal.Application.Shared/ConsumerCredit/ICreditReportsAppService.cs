using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.ConsumerCredit.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.ConsumerCredit
{
    public interface ICreditReportsAppService : IApplicationService
    {
        CreditReportDto GetForCurrentUser();

        Task<PagedResultDto<GetCreditReportForViewDto>> GetAll(GetAllCreditReportsInput input);

		//Task<CreditReportStatusDto> GetCreditReportByUser(CreditReportPOSTArgsDto input);

		Task<GetCreditReportForViewDto> GetCreditReportForView(int id);

		//Task<GetCreditReportForViewDto> GetCreditReportForViewByUser();

		Task<GetCreditReportForEditOutput> GetCreditReportForEdit(EntityDto input);

        Task CreateOrEdit(CreateOrEditCreditReportDto input);

        Task Delete(EntityDto input);
        Task DeleteForUser(long userId);

        Task<FileDto> GetCreditReportsToExcel(GetAllCreditReportsForExcelInput input);

        Task<PagedResultDto<CreditReportUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);

    }
}