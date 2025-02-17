using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Documents.Dtos
{
    public class CreateOrEditDocumentDto : EntityDto<int?>
    {

        [Required]
        [StringLength(DocumentConsts.MaxTypeLength, MinimumLength = DocumentConsts.MinTypeLength)]
        public string Type { get; set; }

        [Required]
        [StringLength(DocumentConsts.MaxFileNameLength, MinimumLength = DocumentConsts.MinFileNameLength)]
        public string FileName { get; set; }

        [Required]
        [StringLength(DocumentConsts.MaxFileTypeLength, MinimumLength = DocumentConsts.MinFileTypeLength)]
        public string FileType { get; set; }

        public Guid BinaryObjectId { get; set; }

        public int SmeCompanyId { get; set; }

    }
}