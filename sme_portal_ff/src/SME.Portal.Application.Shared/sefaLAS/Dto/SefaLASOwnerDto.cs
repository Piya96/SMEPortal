using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.sefaLAS.Dto
{
    public class SefaLASOwnerDto
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string EmailAddress { get; set; }

        public string PhoneNumber { get; set; }

        public bool IsPhoneNumberConfirmed { get; set; }

        public string IdentityOrPassport { get; set; }

        public bool IsIdentityOrPassportConfirmed { get; set; }

        public string Race { get; set; }

        public string VerificationRecord { get; set; }

        public string Properties { get; set; }

        public DateTime? CreationTime { get; set; }

    }
}
