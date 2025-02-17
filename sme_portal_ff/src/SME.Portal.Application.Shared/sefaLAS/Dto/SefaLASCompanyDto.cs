using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.sefaLAS.Dto
{
    public class SefaLASCompanyDto
    {
        public string Name { get; set; }

        public string RegistrationNumber { get; set; }

        public string Type { get; set; }

        public DateTime? RegistrationDate { get; set; }

        public DateTime? StartedTradingDate { get; set; }

        public string RegisteredAddress { get; set; }

        public string IndustrySector { get; set; }

        public string VerificationRecord { get; set; }

        public string Properties { get; set; }

        public DateTime? CreationTime { get; set; }

    }
}
