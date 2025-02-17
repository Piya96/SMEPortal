using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Documents.Dtos
{
    public class GetDocumentForEditOutput
    {
        public CreateOrEditDocumentDto Document { get; set; }

        public string SmeCompanyName { get; set; }

    }
}