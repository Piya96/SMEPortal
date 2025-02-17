using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.ConsumerCredit.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.ConsumerCredit.Exporting
{
    public class CreditReportsExcelExporter : NpoiExcelExporterBase, ICreditReportsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public CreditReportsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetCreditReportForViewDto> creditReports)
        {
            return CreateExcelPackage(
                "CreditReports.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("CreditReports"));

                    AddHeader(
                        sheet,
                        L("CreditReportJson"),
                        L("EnquiryDate"),
                        (L("User")) + L("Name")
                        );

                    AddObjects(
                        sheet, 2, creditReports,
                        _ => _.CreditReport.CreditReportJson,
                        _ => _timeZoneConverter.Convert(_.CreditReport.EnquiryDate, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _.UserName
                        );

                    for (var i = 1; i <= creditReports.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[2], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(2);
                });
        }
    }
}