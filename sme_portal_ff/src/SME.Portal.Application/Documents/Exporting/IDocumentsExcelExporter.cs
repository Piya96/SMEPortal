using System.Collections.Generic;
using SME.Portal.Documents.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Documents.Exporting
{
    public interface IDocumentsExcelExporter
    {
        FileDto ExportToFile(List<GetDocumentForViewDto> documents);
    }
}