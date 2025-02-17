using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Company.Dtos
{
    public class CreateOrEditSmeCompanyDto : EntityDto<int?>
    {

        [Required]
        public string Name { get; set; }

        public string RegistrationNumber { get; set; }

        public string Type { get; set; }

        public DateTime? RegistrationDate { get; set; }

        public DateTime? StartedTradingDate { get; set; }

        [Required]
        public string RegisteredAddress { get; set; }

        public string VerificationRecordJson { get; set; }

        [Required]
        public string Customers { get; set; }

        [Required]
        public string BeeLevel { get; set; }

        [Required]
        public string Industries { get; set; }

        [Required]
        public string PropertiesJson { get; set; }

        public string WebSite { get; set; }

        public long UserId { get; set; }

        public int? OwnerId { get; set; }

    }
}