using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Currency.Dtos;
using SME.Portal.Dto;


namespace SME.Portal.Currency
{
    public interface ICurrencyPairsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetCurrencyPairForViewDto>> GetAll(GetAllCurrencyPairsInput input);
        List<CurrencyPairDto> GetAllCurrencyPairs();

        Task<GetCurrencyPairForViewDto> GetCurrencyPairForView(int id);

		Task<GetCurrencyPairForEditOutput> GetCurrencyPairForEdit(EntityDto input);

		Task CreateOrEdit(CreateOrEditCurrencyPairDto input);

		Task Delete(EntityDto input);

		Task<FileDto> GetCurrencyPairsToExcel(GetAllCurrencyPairsForExcelInput input);

		
    }
}