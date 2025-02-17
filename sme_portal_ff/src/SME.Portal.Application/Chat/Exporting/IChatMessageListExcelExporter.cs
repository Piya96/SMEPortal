using System.Collections.Generic;
using Abp;
using SME.Portal.Chat.Dto;
using SME.Portal.Dto;

namespace SME.Portal.Chat.Exporting
{
    public interface IChatMessageListExcelExporter
    {
        FileDto ExportToFile(UserIdentifier user, List<ChatMessageExportDto> messages);
    }
}
