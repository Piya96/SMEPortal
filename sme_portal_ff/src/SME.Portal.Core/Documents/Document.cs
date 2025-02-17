using SME.Portal.Company;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;
using SME.Portal.Storage;

namespace SME.Portal.Documents
{
    [Table("Documents")]
    [Audited]
    public class Document : FullAuditedEntity, IMustHaveTenant
    {
        
        public virtual int TenantId { get; set; }

        [Required]
        [StringLength(DocumentConsts.MaxTypeLength, MinimumLength = DocumentConsts.MinTypeLength)]
        public virtual string Type { get; set; }

        [Required]
        [StringLength(DocumentConsts.MaxFileNameLength, MinimumLength = DocumentConsts.MinFileNameLength)]
        public virtual string FileName { get; set; }

        [Required]
        [StringLength(DocumentConsts.MaxFileTypeLength, MinimumLength = DocumentConsts.MinFileTypeLength)]
        public virtual string FileType { get; set; }

        public virtual Guid BinaryObjectId { get; set; }

        public BinaryObject BinaryObjectFk { get; set; }

        public virtual int SmeCompanyId { get; set; }

        [ForeignKey("SmeCompanyId")]
        public SmeCompany SmeCompanyFk { get; set; }

    }
}