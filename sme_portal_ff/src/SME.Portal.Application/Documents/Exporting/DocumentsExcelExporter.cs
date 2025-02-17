using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Documents.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Documents.Exporting
{
    public class DocumentsExcelExporter : NpoiExcelExporterBase, IDocumentsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public DocumentsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetDocumentForViewDto> documents)
        {
            return CreateExcelPackage(
                "Documents.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("Documents"));

                    AddHeader(
                        sheet,
                        L("Type"),
                        L("FileName"),
                        L("FileType"),
                        (L("SmeCompany")) + L("Name")
                        );

                    AddObjects(
                        sheet, 2, documents,
                        _ => _.Document.Type,
                        _ => _.Document.FileName,
                        _ => _.Document.FileType,
                        _ => _.SmeCompanyName
                        );

                });
        }
    }
}