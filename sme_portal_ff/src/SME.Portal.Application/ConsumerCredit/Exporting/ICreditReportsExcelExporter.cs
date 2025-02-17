using System.Collections.Generic;
using SME.Portal.ConsumerCredit.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.ConsumerCredit.Exporting
{
    public interface ICreditReportsExcelExporter
    {
        FileDto ExportToFile(List<GetCreditReportForViewDto> creditReports);
    }
}