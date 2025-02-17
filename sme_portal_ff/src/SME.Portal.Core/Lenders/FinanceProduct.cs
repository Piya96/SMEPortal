using SME.Portal.Lenders;
using SME.Portal.Currency;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace SME.Portal.Lenders
{
    [Table("FinanceProducts")]
    [Audited]
    public class FinanceProduct : FullAuditedEntity, IMustHaveTenant
    {
        public int TenantId { get; set; }

        [Required]
        [StringLength(FinanceProductConsts.MaxNameLength, MinimumLength = FinanceProductConsts.MinNameLength)]
        public virtual string Name { get; set; }

        public virtual string SummaryHtml { get; set; }

        public virtual int Version { get; set; }

        public virtual string VersionLabel { get; set; }

        public virtual string Permalink { get; set; }

        public virtual string Summary { get; set; }

        public virtual bool ShowMatchResults { get; set; }

        public virtual bool Enabled { get; set; }

        [Required]
        public virtual string MatchCriteriaJson { get; set; }

        public virtual int LenderId { get; set; }

        [ForeignKey("LenderId")]
        public Lender LenderFk { get; set; }

        public virtual int? AssignedTo { get; set; }

        public virtual int? CurrencyPairId { get; set; }

        [ForeignKey("CurrencyPairId")]
        public CurrencyPair CurrencyPairFk { get; set; }

        public DateTime LastCheckedDate { get; set; }

        public virtual long? LastCheckedUserId { get; set; }

        public string StatusClassificationId { get; set; }
        
        public virtual int? CheckedOutSubjectId { get; set; }

    }
}