using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Company.Exporting
{
    public class OwnerCompanyMappingExcelExporter : NpoiExcelExporterBase, IOwnerCompanyMappingExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public OwnerCompanyMappingExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetOwnerCompanyMapForViewDto> ownerCompanyMapping)
        {
            return CreateExcelPackage(
                "OwnerCompanyMapping.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("OwnerCompanyMapping"));

                    AddHeader(
                        sheet,
                        L("IsPrimaryOwner"),
                        (L("Owner")) + L("IdentityOrPassport"),
                        (L("SmeCompany")) + L("RegistrationNumber")
                        );

                    AddObjects(
                        sheet, 2, ownerCompanyMapping,
                        _ => _.OwnerCompanyMap.IsPrimaryOwner,
                        _ => _.OwnerIdentityOrPassport,
                        _ => _.SmeCompanyRegistrationNumber
                        );

                });
        }
    }
}