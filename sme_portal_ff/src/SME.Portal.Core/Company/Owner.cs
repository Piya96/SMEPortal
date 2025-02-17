using SME.Portal.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace SME.Portal.Company
{
    [Table("Owners")]
    [Audited]
    public class Owner : FullAuditedEntity<long>, IMustHaveTenant
    {
        public int TenantId { get; set; }

        [Required]
        [StringLength(OwnerConsts.MaxNameLength, MinimumLength = OwnerConsts.MinNameLength)]
        public virtual string Name { get; set; }

        [Required]
        [StringLength(OwnerConsts.MaxSurnameLength, MinimumLength = OwnerConsts.MinSurnameLength)]
        public virtual string Surname { get; set; }

        [Required]
        [StringLength(OwnerConsts.MaxEmailAddressLength, MinimumLength = OwnerConsts.MinEmailAddressLength)]
        public virtual string EmailAddress { get; set; }

        [Required]
        public virtual string PhoneNumber { get; set; }

        public virtual bool IsPhoneNumberConfirmed { get; set; }

        [Required]
        public virtual string IdentityOrPassport { get; set; }

        public virtual bool IsIdentityOrPassportConfirmed { get; set; }

        [Required]
        public virtual string Race { get; set; }

        [Required]
        public virtual string VerificationRecordJson { get; set; }

        public virtual long UserId { get; set; }

        [Required]
        public virtual string PropertiesJson { get; set; }

        [ForeignKey("UserId")]
        public User UserFk { get; set; }

    }
}