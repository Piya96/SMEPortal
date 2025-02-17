using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.List.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.List.Exporting
{
    public class ListItemsExcelExporter : NpoiExcelExporterBase, IListItemsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public ListItemsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetListItemForViewDto> listItems)
        {
            return CreateExcelPackage(
                "ListItems.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("ListItems"));

                    AddHeader(
                        sheet,
                        L("Name"),
                        L("ParentListId"),
                        L("Priority"),
                        L("MetaOne"),
                        L("MetaTwo"),
                        L("ListId"),
                        L("Slug"),
                        L("MetaThree"),
                        L("Details")
                        );

                    AddObjects(
                        sheet, 2, listItems,
                        _ => _.ListItem.Name,
                        _ => _.ListItem.ParentListId,
                        _ => _.ListItem.Priority,
                        _ => _.ListItem.MetaOne,
                        _ => _.ListItem.MetaTwo,
                        _ => _.ListItem.ListId,
                        _ => _.ListItem.Slug,
                        _ => _.ListItem.MetaThree,
                        _ => _.ListItem.Details
                        );

                });
        }
    }
}