using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Lenders.Exporting
{
    public class LendersExcelExporter : NpoiExcelExporterBase, ILendersExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public LendersExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
			ITempFileCacheManager tempFileCacheManager) :  
	base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetLenderForViewDto> lenders)
        {
            return CreateExcelPackage(
                "Lenders.xlsx",
                excelPackage =>
                {
                    
                    var sheet = excelPackage.CreateSheet(L("Lenders"));

                    AddHeader(
                        sheet,
                        L("Name"),
                        L("WebsiteUrl"),
                        L("Permalink"),
                        L("LogoName"),
                        L("FSPRegistrationNumber"),
                        L("IsSection12J"),
                        L("NcrNumber")
                        );

                    AddObjects(
                        sheet, 2, lenders,
                        _ => _.Lender.Name,
                        _ => _.Lender.WebsiteUrl,
                        _ => _.Lender.FSPRegistrationNumber,
                        _ => _.Lender.NcrNumber
                        );

					
					
                });
        }
    }
}
