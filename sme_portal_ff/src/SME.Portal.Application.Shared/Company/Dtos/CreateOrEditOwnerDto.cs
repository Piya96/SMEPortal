using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Company.Dtos
{
    public class CreateOrEditOwnerDto : EntityDto<long?>
    {

        [Required]
        [StringLength(OwnerConsts.MaxNameLength, MinimumLength = OwnerConsts.MinNameLength)]
        public string Name { get; set; }

        [Required]
        [StringLength(OwnerConsts.MaxSurnameLength, MinimumLength = OwnerConsts.MinSurnameLength)]
        public string Surname { get; set; }

        [Required]
        [StringLength(OwnerConsts.MaxEmailAddressLength, MinimumLength = OwnerConsts.MinEmailAddressLength)]
        public string EmailAddress { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        public bool IsPhoneNumberConfirmed { get; set; }

        [Required]
        public string IdentityOrPassport { get; set; }

        public bool IsIdentityOrPassportConfirmed { get; set; }

        [Required]
        public string Race { get; set; }

        [Required]
        public string VerificationRecordJson { get; set; }
        
        public string PropertiesJson { get; set; }

        public long UserId { get; set; }


    }
}