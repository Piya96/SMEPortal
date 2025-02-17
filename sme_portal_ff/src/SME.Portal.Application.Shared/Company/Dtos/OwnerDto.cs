using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.Company.Dtos
{
    public class OwnerDto : EntityDto<long>
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string EmailAddress { get; set; }

        public string PhoneNumber { get; set; }

        public bool IsPhoneNumberConfirmed { get; set; }

        public string IdentityOrPassport { get; set; }

        public bool IsIdentityOrPassportConfirmed { get; set; }

        public string Race { get; set; }

        public string VerificationRecordJson { get; set; }
        
        public string PropertiesJson { get; set; }

        public long UserId { get; set; }

        public DateTime? CreationTime { get; set; }


    }
}