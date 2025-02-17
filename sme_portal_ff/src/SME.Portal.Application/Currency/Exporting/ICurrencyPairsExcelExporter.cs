using System.Collections.Generic;
using SME.Portal.Currency.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Currency.Exporting
{
    public interface ICurrencyPairsExcelExporter
    {
        FileDto ExportToFile(List<GetCurrencyPairForViewDto> currencyPairs);
    }
}