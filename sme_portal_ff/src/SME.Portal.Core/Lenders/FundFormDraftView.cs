using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text;


namespace SME.Portal.Lenders
{
    [Table("fund_forms_draft")]
    public class FundFormDraftView : FullAuditedEntity
    {
        public virtual int FinanceProductId { get; set; }
        [ForeignKey("FinanceProductId")]
        public FinanceProduct FinanceProductFk { get; set; }
        public virtual decimal? MinLoanAmount { get; set; }
        public virtual decimal? MaxLoanAmount { get; set; }
        public virtual string FinanceForSubListIds { get; set; }
        public virtual bool? SaCitizensOnly { get; set; }
        public virtual string CompanyRegistrationTypeListIds { get; set; }
        public virtual string PostalAddressProvince { get; set; }
        public virtual int? MinimumMonthsTrading { get; set; }
        public virtual decimal? MinAverageAnnualTurnover { get; set; }
        public virtual decimal? MaxAverageAnnualTurnover { get; set; }
        public virtual string IndustrySectorListIds { get; set; }
        public virtual int? MinimumMonthlyIncome { get; set; }
        public virtual bool? RequiresProfitability { get; set; }
        public virtual bool? RequiresCollateral { get; set; }
        public virtual string OwnershipRules { get; set; }
        public virtual string BeeLevelListIds { get; set; }
        public virtual string CountryListIds { get; set; }
        public virtual string ProvinceListIds { get; set; }
        public virtual string RequiredDocumentTypeListIds { get; set; }
        public virtual string NotRequiredDocumentTypeListIds { get; set; }
        public virtual string LoanTypeListIds { get; set; }
        public virtual string FundManager { get; set; }
        public virtual string FundManagerEmail { get; set; }
        public virtual string ContactNumber { get; set; }
        public virtual string MonthlyOrSporadicIncome { get; set; }
        public virtual string CustomerTypeListIds { get; set; }
        public virtual string MatchCriteriaJson { get; set; }
        public virtual bool? IncludePermanentResidents { get; set; }
        public virtual string FinanceForSubCategoryListIds { get; set; }
        public virtual string IndustrySectorSubCategoryListIds { get; set; }
        public virtual string LoanIndexListIds { get; set; }
        public virtual string LoanTypeSubListIds { get; set; }
        public virtual bool? RequireBusinessCollateral { get; set; }
        public virtual bool? RequireOwnerCollateral { get; set; }
        public Guid Token { get; set; }
        public string FinanceProductName { get; set; }
        public int? TenantId { get; set; }
        public int LenderId { get; set; }
        public int? PostalCode { get; set; }
        public string City { get; set; }
        public string LenderName { get; set; }
        public string LenderType { get; set; }
        public string PhysicalAddressLineOne { get; set; }
        public string PhysicalAddressLineTwo { get; set; }
        public string PhysicalAddressLineThree { get; set; }
        public string Province { get; set; }
        public bool ReSendExpiredFundForm { get; set; }
        public bool SentExpireEmail { get; set; }
        public bool SentReminderEmail { get; set; }
        public DateTime TokenIssueDate { get; set; }
        public string FundWebsiteAddress { get; set; }
        public bool BeenCompleted { get; set; }
    }
}
