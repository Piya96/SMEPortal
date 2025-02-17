using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DataManipulation.Entities
{
    [Table("FinanceProducts")]
    public class FinanceProduct
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 5)]
        public virtual string Name { get; set; }

        public virtual string SummaryHtml { get; set; }

        public virtual int Version { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 5)]
        public virtual string VersionLabel { get; set; }

        public virtual string Permalink { get; set; }

        public virtual bool ShowMatchResults { get; set; }

        public virtual bool Enabled { get; set; }

        [Required]
        public virtual string MatchCriteriaJson { get; set; }

        public virtual int LenderId { get; set; }

        public virtual int TenantId { get; set; }

        //[ForeignKey("LenderId")]
        //public Lender LenderFk { get; set; }

        public virtual int? CurrencyPairId { get; set; }

        //[ForeignKey("CurrencyPairId")]
        //public CurrencyPair CurrencyPairFk { get; set; }

        //ABP FIELDS
        public virtual bool IsDeleted { get; set; }
        public virtual long? DeleterUserId { get; set; }
        public virtual DateTime? DeletionTime { get; set; }
        public virtual DateTime? LastModificationTime { get; set; }
        public virtual long? LastModifierUserId { get; set; }
        public virtual DateTime CreationTime { get; set; }
        public virtual long? CreatorUserId { get; set; }
    }
}
