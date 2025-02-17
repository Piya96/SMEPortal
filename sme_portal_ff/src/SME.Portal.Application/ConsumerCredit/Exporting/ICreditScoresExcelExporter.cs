using System.Collections.Generic;
using SME.Portal.ConsumerCredit.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.ConsumerCredit.Exporting
{
    public interface ICreditScoresExcelExporter
    {
        FileDto ExportToFile(List<GetCreditScoreForViewDto> creditScores);
    }
}