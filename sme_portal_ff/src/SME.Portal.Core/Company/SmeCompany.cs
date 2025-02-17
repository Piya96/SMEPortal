using SME.Portal.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace SME.Portal.Company
{
    [Table("Companies")]
    [Audited]
    public class SmeCompany : FullAuditedEntity, IMustHaveTenant
    {
        public int TenantId { get; set; }

        [Required]
        public virtual string Name { get; set; }

        public virtual string RegistrationNumber { get; set; }

        public virtual string Type { get; set; }

        public virtual DateTime? RegistrationDate { get; set; }

        public virtual DateTime? StartedTradingDate { get; set; }

        [Required]
        public virtual string RegisteredAddress { get; set; }

        public virtual string VerificationRecordJson { get; set; }

        [Required]
        public virtual string Customers { get; set; }

        [Required]
        public virtual string BeeLevel { get; set; }

        [Required]
        public virtual string Industries { get; set; }

        [Required]
        public virtual string PropertiesJson { get; set; }

        public virtual string WebSite { get; set; }

        public virtual long UserId { get; set; }

        [ForeignKey("UserId")]
        public User UserFk { get; set; }

    }
}