using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;
using SME.Portal.Authorization.Users;

namespace SME.Portal.Company
{
    [Table("OwnerCompanyMapping")]
    [Audited]
    public class OwnerCompanyMap : FullAuditedEntity, IMustHaveTenant
    {
        public int TenantId { get; set; }

        public virtual bool IsPrimaryOwner { get; set; }

        public virtual long? UserId { get; set; }

        [ForeignKey("UserId")]
        public User UserFk { get; set; }

        public virtual long? OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public Owner OwnerFk { get; set; }

        public virtual int? SmeCompanyId { get; set; }

        [ForeignKey("SmeCompanyId")]
        public SmeCompany SmeCompanyFk { get; set; }

    }
}