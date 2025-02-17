using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.Company.Dtos
{
    public class SmeCompanyDto : EntityDto
    {
        public string Name { get; set; }

        public string RegistrationNumber { get; set; }

        public string Type { get; set; }

        public DateTime? RegistrationDate { get; set; }

        public DateTime? StartedTradingDate { get; set; }

        public string RegisteredAddress { get; set; }

        public string VerificationRecordJson { get; set; }

        public string Customers { get; set; }

        public string BeeLevel { get; set; }

        public string Industries { get; set; }
        
        public string IndustrySubSector { get; set; }

        public string PropertiesJson { get; set; }

        public string WebSite { get; set; }

        public long UserId { get; set; }

        public DateTime? CreationTime { get; set; }

    }
}