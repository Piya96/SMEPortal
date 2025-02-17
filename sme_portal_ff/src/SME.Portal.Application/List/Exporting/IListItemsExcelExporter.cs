using System.Collections.Generic;
using SME.Portal.List.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.List.Exporting
{
    public interface IListItemsExcelExporter
    {
        FileDto ExportToFile(List<GetListItemForViewDto> listItems);
    }
}