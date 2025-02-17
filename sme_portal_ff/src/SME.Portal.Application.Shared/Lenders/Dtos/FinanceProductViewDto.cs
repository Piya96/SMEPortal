using System;
using System.Collections.Generic;
using System.Text;
using Abp.Application.Services.Dto;
using SME.Portal.List.Dtos;
using SME.Portal.List;
using SME.Portal.SME.Dtos;
using System.ComponentModel.DataAnnotations;
using SME.Portal.Lenders;


namespace SME.Portal.Lenders.Dtos
{
	public class FinanceProductViewDto : EntityDto
	{
		[Required]
		public string Name { get; set; }

		public int Version { get; set; }

		public int? TenantId { get; set; }

		public string VersionLabel { get; set; }

		public bool ShowMatchResults { get; set; }

		public bool Enabled { get; set; }

		public bool IsDeleted { get; set; }

		public int LenderId { get; set; }

		public int? AssignedTo { get; set; }

		public string LenderName { get; set; }

		public string LenderType { get; set; }

		public string PhysicalAddressLineOne { get; set; }

		public string PhysicalAddressLineTwo { get; set; }

		public string PhysicalAddressLineThree { get; set; }

		public string City { get; set; }

		public int? PostalCode { get; set; }

		public string Province { get; set; }

        public bool? HasContract { get; set; }

		public string SummaryHtml { get; set; }

		public int? CurrencyPairId { get; set; }

		public string LoanIndexIds { get; set; }

		public DateTime LastCheckedDate { get; set; }

		public string StatusClassificationId { get; set; }

		public virtual string Permalink { get; set; }

		public virtual decimal? MinLoanAmount { get; set; }

		public virtual int? MinLoanAmountFormatted => MinLoanAmount.HasValue ? (int)MinLoanAmount : (int?)null;

		public virtual decimal? MaxLoanAmount { get; set; }

		public virtual int? MaxLoanAmountFormatted => MaxLoanAmount.HasValue ? (int)MaxLoanAmount : (int?)null;

        public virtual string FinanceForSubListIds { get; set; }

		public virtual bool? SaCitizensOnly { get; set; }

		public virtual bool HideOnResultScreen { get; set; }

		public virtual string CompanyRegistrationTypeListIds { get; set; }

		public virtual string PostalAddressProvince { get; set; }

		public virtual int? MinimumMonthsTrading { get; set; }
		
		public virtual decimal? MinAverageAnnualTurnover { get; set; }

        public virtual int? MinAverageAnnualTurnoverFormatted => MinAverageAnnualTurnover.HasValue ? (int)MinAverageAnnualTurnover : (int?)null;

        public virtual decimal? MaxAverageAnnualTurnover { get; set; }

        public virtual int? MaxAverageAnnualTurnoverFormatted => MaxAverageAnnualTurnover.HasValue ? (int)MaxAverageAnnualTurnover : (int?)null;

        public virtual string IndustrySectorListIds { get; set; }

        public virtual string ProvinceListIds { get; set; }

        public virtual int? MinimumMonthlyIncome { get; set; }

		public virtual bool? RequiresProfitability { get; set; }

		public virtual bool? RequiresCollateral { get; set; }

        public virtual List<OwnershipDto> OwnershipRules { get; set; }

        public virtual string OwnershipRulesFilter { get; set; }

        public virtual string BeeLevelListIds { get; set; }

		public virtual string CountryListIds { get; set; }

		public virtual string FundManager { get; set; }

		public virtual string FundManagerEmail { get; set; }

		public virtual string ContactNumber { get; set; }

		public virtual string MonthlyOrSporadicIncome { get; set; }

		public virtual string CustomerTypeListIds { get; set; }

		public virtual string RequiredDocumentTypeListIds { get; set; }

		public virtual string NotRequiredDocumentTypeListIds { get; set; }

		public virtual string MatchCriteriaJson { get; set; }

		public virtual bool? IncludePermanentResidents { get; set; }

		public virtual string FinanceForSubCategoryListIds { get; set; }

        public virtual string IndustrySectorSubCategoryListIds { get; set; }

        public virtual string LoanIndexListIds { get; set; }

		public virtual string LoanTypeListIds { get; set; }

		public virtual string LoanTypeSubListIds { get; set; }

		public virtual string Summary { get; set; }

		public virtual bool? RequireBusinessCollateral { get; set; }

		public virtual bool? RequireOwnerCollateral { get; set; }

        public virtual int? CheckedOutSubjectId { get; set; }

		public DateTime TokenIssueDate { get; set; }

		public string FundWebsiteAddress { get; set; }

		public bool BeenCompleted { get; set; }
    }
}