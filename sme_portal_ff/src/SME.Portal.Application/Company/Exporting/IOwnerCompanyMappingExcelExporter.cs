using System.Collections.Generic;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Company.Exporting
{
    public interface IOwnerCompanyMappingExcelExporter
    {
        FileDto ExportToFile(List<GetOwnerCompanyMapForViewDto> ownerCompanyMapping);
    }
}