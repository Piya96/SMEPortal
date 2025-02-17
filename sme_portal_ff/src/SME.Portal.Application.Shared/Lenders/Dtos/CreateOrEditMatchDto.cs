using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Lenders.Dtos
{
    public class CreateOrEditMatchDto : EntityDto<int?>
    {

        public string Notes { get; set; }

        public int ApplicationId { get; set; }

        [Required]
        public string LeadDisplayName { get; set; }

        public bool MatchSuccessful { get; set; }

        public string FinanceProductIds { get; set; }

        public string ExclusionIds { get; set; }

    }
}