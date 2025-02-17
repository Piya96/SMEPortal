using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace SME.Portal.Lenders.Dtos
{
    public class MatchDto : EntityDto
    {
        public string Notes { get; set; }

        public int ApplicationId { get; set; }

        public string LeadDisplayName { get; set; }

        public bool MatchSuccessful { get; set; }

        public string FinanceProductIds { get; set; }
        public List<string> FinanceProductNames { get; set; }

        public string ExclusionIds { get; set; }

    }
}