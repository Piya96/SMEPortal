using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Lenders.Dtos
{
    public class CreateOrEditFinanceProductDto : EntityDto<int?>
    {

        [StringLength(FinanceProductConsts.MaxNameLength, MinimumLength = FinanceProductConsts.MinNameLength)]
        public string Name { get; set; }

        public string SummaryHtml { get; set; }

        public int Version { get; set; }

        public string VersionLabel { get; set; }

        public string Permalink { get; set; }

        public string Summary { get; set; }

        public bool ShowMatchResults { get; set; }

        public bool Enabled { get; set; }

        public string MatchCriteriaJson { get; set; }

        public int LenderId { get; set; }

        public int? CurrencyPairId { get; set; }

        public int? AssignedTo { get; set; }

        public string LoanIndex { get; set; }
        
        public bool? LastCheckedUserStatus { get; set; }
    }
}