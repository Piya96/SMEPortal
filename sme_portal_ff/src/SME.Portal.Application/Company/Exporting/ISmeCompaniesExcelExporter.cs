using System.Collections.Generic;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Company.Exporting
{
    public interface ISmeCompaniesExcelExporter
    {
        FileDto ExportToFile(List<GetSmeCompanyForViewDto> smeCompanies);
    }
}