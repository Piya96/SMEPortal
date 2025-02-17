﻿using System.Collections.Generic;
using SME.Portal.Company.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Company.Exporting
{
    public interface IOwnersExcelExporter
    {
        FileDto ExportToFile(List<GetOwnerForViewDto> owners);
    }
}