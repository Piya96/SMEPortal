using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;
using SME.Portal.SME;

namespace SME.Portal.Lenders
{
    [Table("Matches")]
    [Audited]
    public class Match : FullAuditedEntity, IMustHaveTenant
    {
        public int TenantId { get; set; }

        public virtual string Notes { get; set; }

		public virtual Application Application { get; set; }

		public virtual int ApplicationId { get; set; }

        [Required]
        public virtual string LeadDisplayName { get; set; }

        public virtual bool MatchSuccessful { get; set; }

        public virtual string FinanceProductIds { get; set; }

        public virtual string ExclusionIds { get; set; }

    }
}