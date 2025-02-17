using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Currency.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Currency.Exporting
{
    public class CurrencyPairsExcelExporter : NpoiExcelExporterBase, ICurrencyPairsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public CurrencyPairsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
			ITempFileCacheManager tempFileCacheManager) :  
	base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetCurrencyPairForViewDto> currencyPairs)
        {
            return CreateExcelPackage(
                "CurrencyPairs.xlsx",
                excelPackage =>
                {
                    
                    var sheet = excelPackage.CreateSheet(L("CurrencyPairs"));

                    AddHeader(
                        sheet,
                        L("Name"),
                        L("BaseCurrencyCode"),
                        L("TargetCurrencyCode"),
                        L("ExchangeRate"),
                        L("Symbol"),
                        L("Log")
                        );

                    AddObjects(
                        sheet, 2, currencyPairs,
                        _ => _.CurrencyPair.Name,
                        _ => _.CurrencyPair.BaseCurrencyCode,
                        _ => _.CurrencyPair.TargetCurrencyCode,
                        _ => _.CurrencyPair.ExchangeRate,
                        _ => _.CurrencyPair.Symbol,
                        _ => _.CurrencyPair.Log
                        );

					
					
                });
        }
    }
}
