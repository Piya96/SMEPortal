using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Documents.Dtos
{
    public class GetAllDocumentsForExcelInput
    {
        public string Filter { get; set; }

        public string TypeFilter { get; set; }

        public string FileNameFilter { get; set; }

        public string FileTypeFilter { get; set; }

        public string SmeCompanyNameFilter { get; set; }

    }
}