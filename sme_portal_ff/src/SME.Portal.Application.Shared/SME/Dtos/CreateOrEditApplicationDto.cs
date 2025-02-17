using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.SME.Dtos
{
    public class CreateOrEditApplicationDto : EntityDto<int?>
    {

        [Required]
        public string MatchCriteriaJson { get; set; }

        public DateTime? Locked { get; set; }

        [Required]
        public string Status { get; set; }

        public string PropertiesJson { get; set; }

        public long UserId { get; set; }

        public int TenantId { get; set; }

        public int SmeCompanyId { get; set; }

        public DateTime CreationTime { get;set; }

    }
}