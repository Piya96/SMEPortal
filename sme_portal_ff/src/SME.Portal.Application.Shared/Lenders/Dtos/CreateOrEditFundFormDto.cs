using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class CreateOrEditFundFormDto
    {
        public string FinanceProductName { get; set; }
        public string FundWebsiteAddress { get; set; }
        public string MatchCriteriaJson { get; set; }
        public Guid Token { get; set; }
        public bool BeenCompleted { get; set; }
    }
}
