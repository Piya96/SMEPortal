using System;
using System.ComponentModel.DataAnnotations;
using Abp.Auditing;
using Abp.Authorization.Users;
using Abp.Domain.Entities;
using SME.Portal.MultiTenancy.Payments;

namespace SME.Portal.Authorization.Users.Dto
{
    //Mapped to/from User in CustomDtoMapper
    public class UserEditDto : IPassivable
    {
        /// <summary>
        /// Set null to create a new user. Set user's Id to update a user
        /// </summary>
        public long? Id { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        public string Surname { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxUserNameLength)]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }

        [StringLength(UserConsts.MaxPhoneNumberLength)]
        public string PhoneNumber { get; set; }

        // Not used "Required" attribute since empty value is used to 'not change password'
        [StringLength(AbpUserBase.MaxPlainPasswordLength)]
        [DisableAuditing]
        public string Password { get; set; }

        public bool IsActive { get; set; }

        public bool ShouldChangePasswordOnNextLogin { get; set; }

        public virtual bool IsTwoFactorEnabled { get; set; }

        public virtual bool IsLockoutEnabled { get; set; }

        [StringLength(UserConsts.IdentityOrPassportMaxLength)]
        public string IdentityOrPassport { get; set; }

        public virtual bool IsIdentityOrPassportConfirmed { get; set; }

        [StringLength(UserConsts.RaceMaxLength)]
        public string Race { get; set; }

        public bool IsOwner { get; set; }

        [StringLength(UserConsts.RepresentativeCapacityMaxLength)]
        public string RepresentativeCapacity { get; set; }

        public bool IsOnboarded { get; set; }

        public int? EditionId { get; set; }

        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public SubscriptionPaymentType SubscriptionPaymentType { get; set; }
        public ResetFlag? ResetFlag { get; set; }
    }
}