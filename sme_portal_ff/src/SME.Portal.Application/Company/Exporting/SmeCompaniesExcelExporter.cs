using System.Collections.Generic;
using Abp.Runtime.Session;
using Abp.Timing.Timezone;
using SME.Portal.DataExporting.Excel.NPOI;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;
using SME.Portal.Storage;

namespace SME.Portal.Company.Exporting
{
    public class SmeCompaniesExcelExporter : NpoiExcelExporterBase, ISmeCompaniesExcelExporter
    {

        private readonly ITimeZoneConverter _timeZoneConverter;
        private readonly IAbpSession _abpSession;

        public SmeCompaniesExcelExporter(
            ITimeZoneConverter timeZoneConverter,
            IAbpSession abpSession,
            ITempFileCacheManager tempFileCacheManager) :
    base(tempFileCacheManager)
        {
            _timeZoneConverter = timeZoneConverter;
            _abpSession = abpSession;
        }

        public FileDto ExportToFile(List<GetSmeCompanyForViewDto> smeCompanies)
        {
            return CreateExcelPackage(
                "SmeCompanies.xlsx",
                excelPackage =>
                {

                    var sheet = excelPackage.CreateSheet(L("SmeCompanies"));

                    AddHeader(
                        sheet,
                        L("Name"),
                        L("RegistrationNumber"),
                        L("Type"),
                        L("RegistrationDate"),
                        L("StartedTradingDate"),
                        L("RegisteredAddress"),
                        L("VerificationRecordJson"),
                        L("Customers"),
                        L("BeeLevel"),
                        L("Industries"),
                        L("PropertiesJson"),
                        L("WebSite"),
                        (L("User")) + L("Name")
                        );

                    AddObjects(
                        sheet, 2, smeCompanies,
                        _ => _.SmeCompany.Name,
                        _ => _.SmeCompany.RegistrationNumber,
                        _ => _.SmeCompany.Type,
                        _ => _timeZoneConverter.Convert(_.SmeCompany.RegistrationDate, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _timeZoneConverter.Convert(_.SmeCompany.StartedTradingDate, _abpSession.TenantId, _abpSession.GetUserId()),
                        _ => _.SmeCompany.RegisteredAddress,
                        _ => _.SmeCompany.VerificationRecordJson,
                        _ => _.SmeCompany.Customers,
                        _ => _.SmeCompany.BeeLevel,
                        _ => _.SmeCompany.Industries,
                        _ => _.SmeCompany.PropertiesJson,
                        _ => _.SmeCompany.WebSite,
                        _ => _.UserName
                        );

                    for (var i = 1; i <= smeCompanies.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[4], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(4); for (var i = 1; i <= smeCompanies.Count; i++)
                    {
                        SetCellDataFormat(sheet.GetRow(i).Cells[5], "yyyy-mm-dd");
                    }
                    sheet.AutoSizeColumn(5);
                });
        }
    }
}