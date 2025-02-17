using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Sme.Subscriptions.Exporting
{
    public class SmeSubscriptionsExcelExporter : NpoiExcelExporterBase, ISmeSubscriptionsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public SmeSubscriptionsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetSmeSubscriptionForViewDto> smeSubscriptions)
        {
            return CreateExcelPackage(
                "SmeSubscriptions.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("SmeSubscriptions"));

                    AddHeader(
                        sheet,
                        L("StartDate"),
                        L("ExpiryDate"),
                        L("NextBillingDate"),
                        L("Status"),
                        L("OwnerCompanyMapId")
                        );

                    AddObjects(
                        sheet, 2, smeSubscriptions,
                        _ => _timeZoneConverter.Convert(_.SmeSubscription.StartDate, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _timeZoneConverter.Convert(_.SmeSubscription.ExpiryDate, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _timeZoneConverter.Convert(_.SmeSubscription.NextBillingDate, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _.SmeSubscription.Status,
                        _ => _.SmeSubscription.OwnerCompanyMapId
                        );

                    for (var i = 1; i <= smeSubscriptions.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[1], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(1); for (var i = 1; i <= smeSubscriptions.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[2], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(2); for (var i = 1; i <= smeSubscriptions.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[3], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(3);
                });
        }
    }
}