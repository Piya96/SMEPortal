using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Lenders.Exporting
{
    public class MatchesExcelExporter : NpoiExcelExporterBase, IMatchesExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public MatchesExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetMatchForViewDto> matches)
        {
            return CreateExcelPackage(
                "Matches.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("Matches"));

                    AddHeader(
                        sheet,
                        L("Notes"),
                        L("ApplicationId"),
                        L("LeadDisplayName"),
                        L("MatchSuccessful"),
                        L("FinanceProductIds"),
                        L("ExclusionIds")
                        );

                    AddObjects(
                        sheet, 2, matches,
                        _ => _.Match.Notes,
                        _ => _.Match.ApplicationId,
                        _ => _.Match.LeadDisplayName,
                        _ => _.Match.MatchSuccessful,
                        _ => _.Match.FinanceProductIds,
                        _ => _.Match.ExclusionIds
                        );

                });
        }
    }
}