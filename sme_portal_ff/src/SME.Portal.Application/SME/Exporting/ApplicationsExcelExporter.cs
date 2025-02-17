using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.SME.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.SME.Exporting
{
    public class ApplicationsExcelExporter : NpoiExcelExporterBase, IApplicationsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public ApplicationsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetApplicationForViewDto> applications)
        {
            return CreateExcelPackage(
                "Applications.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("Applications"));

                    AddHeader(
                        sheet,
                        L("Locked"),
                        L("Status"),
                        (L("User")) + L("Name"),
                        (L("SmeCompany")) + L("Name")
                        );

                    AddObjects(
                        sheet, 2, applications,
                        _ => _timeZoneConverter.Convert(_.Application.Locked, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _.Application.Status,
                        _ => _.UserName,
                        _ => _.SmeCompanyName
                        );

                    for (var i = 1; i <= applications.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[1], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(1);
                });
        }
    }
}