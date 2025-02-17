using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Lenders.Exporting
{
    public class ContractsExcelExporter : NpoiExcelExporterBase, IContractsExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public ContractsExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
			ITempFileCacheManager tempFileCacheManager) :  
	base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetContractForViewDto> contracts)
        {
            return CreateExcelPackage(
                "Contracts.xlsx",
                excelPackage =>
                {
                    
                    var sheet = excelPackage.CreateSheet(L("Contracts"));

                    AddHeader(
                        sheet,
                        L("Start"),
                        L("Expiry"),
                        L("Commission"),
                        (L("Lender")) + L("Name"),
                        (L("User")) + L("Name")
                        );

                    AddObjects(
                        sheet, 2, contracts,
                        _ => _timeZoneConverter.Convert(_.Contract.Start, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _timeZoneConverter.Convert(_.Contract.Expiry, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _.Contract.Commission,
                        _ => _.LenderName,
                        _ => _.UserName
                        );

					
					for (var i = 1; i <= contracts.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[1], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(1);for (var i = 1; i <= contracts.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[2], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(2);
                });
        }
    }
}
