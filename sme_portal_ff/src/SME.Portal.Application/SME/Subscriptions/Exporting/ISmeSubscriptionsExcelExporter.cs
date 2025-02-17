using System.Collections.Generic;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Sme.Subscriptions.Exporting
{
    public interface ISmeSubscriptionsExcelExporter
    {
        FileDto ExportToFile(List<GetSmeSubscriptionForViewDto> smeSubscriptions);
    }
}