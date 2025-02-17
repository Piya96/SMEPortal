using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Company.Exporting
{
    public class OwnersExcelExporter : NpoiExcelExporterBase, IOwnersExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public OwnersExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetOwnerForViewDto> owners)
        {
            return CreateExcelPackage(
                "Owners.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("Owners"));

                    AddHeader(
                        sheet,
                        L("Name"),
                        L("Surname"),
                        L("EmailAddress"),
                        L("PhoneNumber"),
                        L("IsPhoneNumberConfirmed"),
                        L("IdentityOrPassport"),
                        L("IsIdentityOrPassportConfirmed"),
                        L("Race"),
                        L("VerificationRecordJson"),
                        (L("User")) + L("Name")
                        );

                    AddObjects(
                        sheet, 2, owners,
                        _ => _.Owner.Name,
                        _ => _.Owner.Surname,
                        _ => _.Owner.EmailAddress,
                        _ => _.Owner.PhoneNumber,
                        _ => _.Owner.IsPhoneNumberConfirmed,
                        _ => _.Owner.IdentityOrPassport,
                        _ => _.Owner.IsIdentityOrPassportConfirmed,
                        _ => _.Owner.Race,
                        _ => _.Owner.VerificationRecordJson,
                        _ => _.UserName
                        );

                });
        }
    }
}