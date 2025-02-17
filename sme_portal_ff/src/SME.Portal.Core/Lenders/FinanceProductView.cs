using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using SME.Portal.Currency;

namespace SME.Portal.Lenders
{
    [Table("finance_products_match_criteria")]
    public class FinanceProductView : FullAuditedEntity
    {
        public int TenantId { get; set; }

        public int? AssignedTo { get; set; }

        public int LenderId { get; set; }

        [ForeignKey("LenderId")]
        public Lender LenderFk { get; set; }

        public int? CurrencyPairId { get; set; }

        [ForeignKey("CurrencyPairId")]
        public CurrencyPair CurrencyPairFk { get; set; }

        [Required]
        [StringLength(FinanceProductConsts.MaxNameLength, MinimumLength = FinanceProductConsts.MinNameLength)]
        public virtual string Name { get; set; }

        public virtual string SummaryHtml { get; set; }

        public virtual bool ShowMatchResults { get; set; }

        public virtual bool Enabled { get; set; }

        public string StatusClassificationId { get; set; }

        public virtual string Permalink { get; set; }

        public DateTime LastCheckedDate { get; set; }

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

        public virtual string OwnershipRulesFilter { get; set; }

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

        public virtual bool HideOnResultScreen { get; set; }

        public virtual bool? IncludePermanentResidents { get; set; }

        public virtual string FinanceForSubCategoryListIds { get; set; }

        public virtual string IndustrySectorSubCategoryListIds { get; set; }

        public virtual string LoanIndexListIds { get; set; }

        public virtual string LoanTypeSubListIds { get; set; }

        public virtual string Summary { get; set; }

        public virtual bool? RequireBusinessCollateral { get; set; }

        public virtual bool? RequireOwnerCollateral { get; set; }

        public virtual int? CheckedOutSubjectId { get; set; }

    }
}
