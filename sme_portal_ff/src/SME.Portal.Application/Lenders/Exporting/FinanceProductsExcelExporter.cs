using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Lenders.Exporting
{
    public class FinanceProductsExcelExporter : NpoiExcelExporterBase, IFinanceProductsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public FinanceProductsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetFinanceProductForViewDto> financeProducts)
        {
            return CreateExcelPackage(
                "FinanceProducts.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("FinanceProducts"));

                    AddHeader(
                        sheet,
                        L("Name"),
                        L("Version"),
                        L("VersionLabel"),
                        L("ShowMatchResults"),
                        L("Enabled"),
                        (L("Lender")) + L("Name"),
                        (L("CurrencyPair")) + L("Name")
                        );

                    AddObjects(
                        sheet, 2, financeProducts,
                        _ => _.FinanceProduct.Name,
                        _ => _.FinanceProduct.Version,
                        _ => _.FinanceProduct.VersionLabel,
                        _ => _.FinanceProduct.ShowMatchResults,
                        _ => _.FinanceProduct.Enabled,
                        _ => _.LenderName,
                        _ => _.CurrencyPairName
                        );

                });
        }
    }
}