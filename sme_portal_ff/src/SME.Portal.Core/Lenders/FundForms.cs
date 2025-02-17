using Abp.Domain.Entities.Auditing;
using SME.Portal.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SME.Portal.Lenders
{
    public class FundForms : FullAuditedEntity
    {
        public virtual int FinanceProductId { get; set; }
        [ForeignKey("FinanceProductId")]
        public FinanceProduct FinanceProductFk { get; set; }
        [ForeignKey("CreatorUserId")]
        public User UserFk { get; set; }
        public bool BeenCompleted { get; set; }
        public DateTime TokenIssueDate { get; set; }
        public string EmailAddress { get; set; }
        public string MatchCriteriaJson { get; set; }
        public string FinanceProductName { get; set; }
        public Guid Token { get; set; }
        public int? TenantId { get; set; }
        public int LenderId { get; set; }
        public string LenderName { get; set; }
        public string LenderType { get; set; }
        public string PhysicalAddressLineOne { get; set; }
        public string PhysicalAddressLineTwo { get; set; }
        public string PhysicalAddressLineThree { get; set; }
        public string City { get; set; }
        public int? PostalCode { get; set; }
        public string Province { get; set; }
        public bool SentReminderEmail { get; set; }
        public bool SentExpireEmail { get; set; }
        public bool ReSendExpiredFundForm { get; set; }
        public string FundWebsiteAddress { get; set; }
    }
}
