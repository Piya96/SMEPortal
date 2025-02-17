using System;
using System.ComponentModel.DataAnnotations;
using Abp.Authorization.Users;
using SME.Portal.MultiTenancy.Payments;

namespace SME.Portal.Authorization.Users.Profile.Dto
{
    public class CurrentUserProfileEditDto
    {
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
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }

        public virtual bool IsEmailConfirmed { get; set; }

        [StringLength(UserConsts.MaxPhoneNumberLength)]
        public string PhoneNumber { get; set; }

        public virtual bool IsPhoneNumberConfirmed { get; set; }

        public string Timezone { get; set; }

        public string QrCodeSetupImageUrl { get; set; }

        public bool IsGoogleAuthenticatorEnabled { get; set; }

        public string IdentityOrPassport { get; set; }

        public virtual bool IsIdentityOrPassportConfirmed { get; set; }
       
        public string VerificationRecordJson { get; set; }

        public string Race { get; set; }

        public bool IsOwner { get; set; }

        public string RepresentativeCapacity { get; set; }

        public bool IsOnboarded { get; set; }

        public string PropertiesJson { get; set; }

        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public SubscriptionPaymentType SubscriptionPaymentType { get; set; }

	}
}
