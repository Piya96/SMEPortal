using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class SearchAllFinanceProductsInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public int? LenderIdFilter { get; set; }

        public string NameFilter { get; set; }

        public string BeeLevelFilter { get; set; }

        public int? MaxVersionFilter { get; set; }

        public int? MinVersionFilter { get; set; }

        public string VersionLabelFilter { get; set; }

        public int? ShowMatchResultsFilter { get; set; }

        public string LenderNameFilter { get; set; }

        public string CurrencyPairNameFilter { get; set; }

        public decimal? MaxAverageAnnualTurnoverFilter { get; set; }

        public decimal? MinAverageAnnualTurnoverFilter { get; set; }

        public decimal? MaxLoanAmountFilter { get; set; }

        public decimal? MinLoanAmountFilter { get; set; }

        public bool? CollateralBusinessFilter { get; set; }

        public bool? CollateralOwnerFilter { get; set; }

        public bool? RequiresProfitabilityFilter { get; set; }

        public bool? SaCitizensOnlyFilter { get; set; }

        public int? MinMonthsTradingFilter { get; set; }

        public int? MinMonthlyIncomeFilter { get; set; }

        public string FinanceForIdFilter { get; set; }

        public string IndustrySectorIdFilter { get; set; }

        public string CountryIdFilter { get; set; }

        public string CompanyRegistrationTypeIdFilter { get; set; }

        public string StartupFundingIdFilter { get; set; }

        public string ProvinceTypeIdFilter { get; set; }

        public string OwnershipIdFilter { get; set; }

        public string TechInnovationStageTypeIdFilter { get; set; }

        public string LoanTypeIdFilter { get; set; }

        public string LoanIndexTypeIdFilter { get; set; }

        public string IncomeReceivedTypeIdFilter { get; set; }

        public string CustomerTypeIdFilter { get; set; }

        public string DocumentTypeIdFilter { get; set; }

        public string StatusClassificationIdFilter { get; set; }

        public string LastUpdatedStatusFilter { get; set; }

        public bool? IsDeleted { get; set; }
        
        public bool? IsEnabled{ get; set; }

    }
}
