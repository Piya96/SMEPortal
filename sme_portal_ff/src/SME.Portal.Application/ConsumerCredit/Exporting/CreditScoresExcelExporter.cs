using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.ConsumerCredit.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.ConsumerCredit.Exporting
{
    public class CreditScoresExcelExporter : NpoiExcelExporterBase, ICreditScoresExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public CreditScoresExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetCreditScoreForViewDto> creditScores)
        {
            return CreateExcelPackage(
                "CreditScores.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("CreditScores"));

                    AddHeader(
                        sheet,
                        L("Score"),
                        L("EnquiryDate"),
                        (L("User")) + L("Name")
                        );

                    AddObjects(
                        sheet, 2, creditScores,
                        _ => _.CreditScore.Score,
                        _ => _timeZoneConverter.Convert(_.CreditScore.EnquiryDate, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _.UserName
                        );

                    for (var i = 1; i <= creditScores.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[2], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(2);
                });
        }
    }
}