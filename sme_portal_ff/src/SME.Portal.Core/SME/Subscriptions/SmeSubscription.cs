using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;
using SME.Portal.Company;
using Abp.Application.Editions;

namespace SME.Portal.Sme.Subscriptions
{
    public enum SmeSubscriptionStatus
    {
        Default = 0,
        Active = 1,
        Cancelled = 2
    }


    [Table("SmeSubscriptions")]
    [Audited]
    public class SmeSubscription : Entity, IMustHaveTenant
    {
        public int TenantId { get; set; }

        public virtual DateTime StartDate { get; set; }

        public virtual DateTime? ExpiryDate { get; set; }

        public virtual DateTime? NextBillingDate { get; set; }

        [Required]
        public virtual string Status { get; set; }

        public virtual int EditionId { get; set; }

        [ForeignKey("EditionId")]
        public virtual Edition EditionFk { get; set; }

        public virtual int OwnerCompanyMapId { get; set; }

        [ForeignKey("OwnerCompanyMapId")]
        public virtual OwnerCompanyMap OwnerCompanyMapFk { get; set; }

    }
}