using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.Documents.Dtos
{
    public class DocumentDto : EntityDto
    {
        public string Type { get; set; }

        public string FileName { get; set; }

        public string FileType { get; set; }

        public int SmeCompanyId { get; set; }
        public int CreatorUserId { get; set; }
        public Guid BinaryObjectId { get; set; }

    }
}