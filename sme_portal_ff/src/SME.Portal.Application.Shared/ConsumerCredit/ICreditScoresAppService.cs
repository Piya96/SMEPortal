using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.ConsumerCredit.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.ConsumerCredit
{
    public interface ICreditScoresAppService : IApplicationService
    {
        CreditScoreDto GetForCurrentUser();

        Task<PagedResultDto<GetCreditScoreForViewDto>> GetAll(GetAllCreditScoresInput input);

		//Task<GetCreditScoreForViewDto> GetCreditScoreForViewByUser(CreditScorePOSTArgsDto input);

		Task<GetCreditScoreForViewDto> GetCreditScoreForView(int id);

        Task<GetCreditScoreForEditOutput> GetCreditScoreForEdit(EntityDto input);

        Task CreateOrEdit(CreateOrEditCreditScoreDto input);

        Task Delete(EntityDto input);
        Task DeleteForUser(long userId);

        Task<FileDto> GetCreditScoresToExcel(GetAllCreditScoresForExcelInput input);

        Task<PagedResultDto<CreditScoreUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);

    }
}