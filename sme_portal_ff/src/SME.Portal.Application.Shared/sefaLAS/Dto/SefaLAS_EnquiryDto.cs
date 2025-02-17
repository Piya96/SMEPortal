using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.sefaLAS
{
    public class SefaLAS_Dto
    {
        public string EnquiryNumber { get; set; }

        public string ApplicationNo { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Cell { get; set; }

        public string IdNumber { get; set; }

        public bool IsSouthAfricanCitizen { get; set; }

        public string CompanyName { get; set; }

        public string CompanyRegistrationNumber { get; set; }

        public string ProvinceName { get; set; }

        public string AreaName { get; set; }

        public string SuburbName { get; set; }

        public string PostalCode { get; set; }

        public int Amount { get; set; }

        public string DateCreated { get; set; }

        public string DataJson { get; set; }


        public bool IsTest { get; set; }

    }
}
