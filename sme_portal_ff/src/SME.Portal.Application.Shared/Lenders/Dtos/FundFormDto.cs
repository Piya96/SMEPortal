using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class FundFormDto
    {
        public int? Id { get; set; }
        public int FinanceProductId { get; set; }
        public bool BeenCompleted { get; set; }
        public DateTime TokenIssueDate { get; set; }
        public Guid Token { get; set; }
        public int? TenantId { get; set; }
        public int LenderId { get; set; }
        public string LenderName { get; set; }
        public string FinanceProductName { get; set; }
        public string CreatedByUserName { get; set; }
        public string EmailAddress { get; set; }
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
        public string MatchCriteriaJson { get; set; }
    }
}
