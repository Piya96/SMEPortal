using System.Collections.Generic;
using SME.Portal.Auditing.Dto;
using SME.Portal.Dto;

namespace SME.Portal.Auditing.Exporting
{
    public interface IAuditLogListExcelExporter
    {
        FileDto ExportToFile(List<AuditLogListDto> auditLogListDtos);

        FileDto ExportToFile(List<EntityChangeListDto> entityChangeListDtos);
    }
}
