using System.Collections.Generic;
using SME.Portal.SME.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.SME.Exporting
{
    public interface IApplicationsExcelExporter
    {
        FileDto ExportToFile(List<GetApplicationForViewDto> applications);
    }
}