using System.Collections.Generic;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Lenders.Exporting
{
    public interface IMatchesExcelExporter
    {
        FileDto ExportToFile(List<GetMatchForViewDto> matches);
    }
}