using DataManipulation.Old_Lender_Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace DataManipulation.Models
{
    public class FinanceProductMatchingCriteria
    {
        public string Name { get; set; }
        public MatchCriteria MatchCriteria { get; set; }
    }

    public class MatchCriteria
    {
        public string FundManager { get; set; }
        public string FundManagerEmail { get; set; }
        public string ContactNumber { get; set; }
        public string PhysicalAddressLine1 { get; set; }
        public string PhysicalAddressLine2 { get; set; }
        public string PostalAddressArea { get; set; }
        public string PostalAddressCity { get; set; }
        public string PostalAddressProvince { get; set; }
        public string PostalAddressCode { get; set; }

        public string LoanIndexListIds { get; set; }
        public string LoanTypeListIds { get; set; }
        public string LoanTypeSubListIds { get; set; }
        public string InnovationStageListIds { get; set; }
        public bool HideOnResultScreen { get; set; }
        public bool IsDisabled { get; set; }
        public bool IsDeleted { get; set; }
        public string StartupFundingListIds { get; set; }
        public decimal? MinLoanAmount { get; set; }
        public decimal? MaxLoanAmount { get; set; }
        public decimal? MinAverageAnnualTurnover { get; set; }
        public decimal? MaxAverageAnnualTurnover { get; set; }
        public string FinanceForSubListIds { get; set; }
        public bool SaCitizensOnly { get; set; }
        public bool? IncludePermanentResidents { get; set; }
        public string AgeListIds { get; set; }
        public string GenderListIds { get; set; }
        public string RaceListIds { get; set; }
        public string DisabilityListIds { get; set; }
        public string CompanyRegistrationTypeListIds { get; set; }
        public string IndustrySectorsLevel1ListIds { get; set; }
        public string IndustrySectorListIds { get; set; }
        public string RequiredDocumentTypeListIds { get; set; }
        public string NotRequiredDocumentTypeListIds { get; set; }
        public string ProvinceListIds { get; set; }
        public int? MinimumMonthsTrading { get; set; }
        public string CustomerTypeListIds { get; set; }
        public string CustomerProfileListIds { get; set; }
        public int? MinimumMonthlyIncome { get; set; }
        public int? MinimumMonthlyIncomeRetail { get; set; }
        public string IncomeReceivedListIds { get; set; }
        public bool RequiresProfitability { get; set; }
        public string CollateralListIds { get; set; }
        public bool RequiresCollateral { get; set; }
        public int? CashForAnInvoiceMinInvoiceValue { get; set; }
        public string CashForAnInvoiceCustomerProfileListIds { get; set; }
        public int? MoneyForContractMinContractValue { get; set; }
        public string MoneyForContractCustomerProfileListIds { get; set; }
        public bool MoneyForContractExperience { get; set; }
        public int? PurchaseOrderMinFundingValue { get; set; }
        public string PurchaseOrderFundingCustomerProfileListIds { get; set; }
        public bool PurchaseOrderFundingExperience { get; set; }
        public int? MoneyForTenderMinTenderValue { get; set; }
        public string MoneyForTenderCustomerProfileListIds { get; set; }
        public bool MoneyForTenderExperience { get; set; }
        public int? BuyingBusinessPropertyMinPropertyValue { get; set; }
        public string BuyingBusinessPropertyPropertyTypeListIds { get; set; }
        public int? ShopFittingRenovationsMinPropertyValue { get; set; }
        public string ShopFittingRenovationsPropertyTypeListIds { get; set; }
        public bool ShopFittingRenovationsRequireUnbonded { get; set; }
        public string PropertyDevelopmentDevelopmentTypeListIds { get; set; }
        public bool BusinessExpansionRequireEquity { get; set; }
        public int? BusinessExpansionMinimumEquityScore { get; set; }
        public bool BusinessExpansionRequireJobCreation { get; set; }
        public bool BusinessExpansionRequireIncreasedProfitability { get; set; }
        public bool BusinessExpansionRequireIncreasedExports { get; set; }
        public bool BusinessExpansionRequireEmpowerment { get; set; }
        public bool BusinessExpansionRequireRural { get; set; }
        public bool BusinessExpansionRequireSocial { get; set; }
        public string ProductServiceExpansionTypesOfExpansionListIds { get; set; }
        public bool BuyingAFranchiseRequireAccreditation { get; set; }
        public bool BuyingAFranchiseRequirePreapproval { get; set; }
        public bool PartnerManagementBuyOutMinimumBeeShareholding { get; set; }
        public string BuyingABusinessIndustrySectorsLevel1ListIds { get; set; }
        public string BuyingABusinessIndustrySectorsListIds { get; set; }
        public string BuyingABusinessBusinessTypeListIds { get; set; }
        public bool BuyingABusinessRuralTownship { get; set; }
        public bool BeePartnerMinimumBeeShareholding { get; set; }
        public string ExportProductSectionListIds { get; set; }
        public bool ExportInternationalResearch { get; set; }
        public string ExportCountryListId { get; set; }
        public bool ExportConfirmedOrder { get; set; }
        public int? ExportOrderValue { get; set; }
        public bool ImportSignedContract { get; set; }
        public string ImportCountryListId { get; set; }
        public string ImportProductSectionListIds { get; set; }
        public bool CommercialisingResearchRequireStudentStatus { get; set; }
        public bool CommercialisingResearchRequireIncreasedExports { get; set; }
        public bool CommercialisingResearchRequireJobCreation { get; set; }
        public bool CommercialisingResearchRequireInnovation { get; set; }
        public string CommercialisingResearchProductListIds { get; set; }
        public bool PovertyAlleviationRequireRural { get; set; }
        public bool PovertyAlleviationRequireJobCreation { get; set; }
        public bool PovertyAlleviationRequireDisabled { get; set; }
        public bool PovertyAlleviationRequireImprovedHealthcare { get; set; }
        public bool PovertyAlleviationRequireIncomeGeneration { get; set; }
        public bool PovertyAlleviationRequireIncreasedExports { get; set; }
        public bool ResearchAndDevelopmentRequireTertiary { get; set; }
        public string ResearchAndDevelopmentIndustrySectorListIds { get; set; }
        public bool BusinessProcessingServicesJobCreation { get; set; }
        public bool BusinessProcessingServicesSecureContracts { get; set; }
        public bool BusinessProcessingServicesYouthJobs { get; set; }
        public bool CashFlowAssistanceHasPosDevice { get; set; }
        public string BeeLevelListIds { get; set; }
        public string CountryListIds { get; set; }
        public bool HelpPrepareLoanApplication { get; set; }
        public bool MonitorProgressAfterFunding { get; set; }
        public bool ProvideMentorship { get; set; }
        public ICollection<OwnershipRuleMatchingCriteria> OwnershipRules { get; set; }
    }
}
