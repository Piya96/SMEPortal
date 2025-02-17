using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using SME.Portal.SME.Dtos.Applications;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace SME.Portal.SME.Dtos
{
    public partial class FinanceProductCriteriaDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int LenderId { get; set; }
        public string LenderName { get; set; }

        public int? CurrencyPairId { get; set; }

    }

    public partial class FinanceProductCriteriaDto
    {
        [JsonProperty("FundManager")]
        public string FundManager { get; set; }

        [JsonProperty("FundManagerEmail")]
        public string FundManagerEmail { get; set; }

        [JsonProperty("ContactNumber")]
        public string ContactNumber { get; set; }

        [JsonProperty("PhysicalAddressLine1")]
        public string PhysicalAddressLine1 { get; set; }

        [JsonProperty("PhysicalAddressLine2")]
        public string PhysicalAddressLine2 { get; set; }

        [JsonProperty("PostalAddressArea")]
        public string PostalAddressArea { get; set; }

        [JsonProperty("PostalAddressCity")]
        public string PostalAddressCity { get; set; }

        [JsonProperty("PostalAddressProvince")]
        public string PostalAddressProvince { get; set; }

        [JsonProperty("PostalAddressCode")]
        public string PostalAddressCode { get; set; }



        [JsonProperty("LoanIndexListIds")]
        public string LoanIndexListIds { get; set; }

        [JsonProperty("LoanTypeListIds")]
        public string LoanTypeListIds { get; set; }

        [JsonProperty("LoanTypeSubListIds")]
        public string LoanTypeSubListIds { get; set; }

        [JsonProperty("InnovationStageListIds")]
        public string InnovationStageListIds { get; set; }

        [JsonProperty("HideOnResultScreen")]
        public bool HideOnResultScreen { get; set; }

        [JsonProperty("IsDisabled")]
        public bool IsDisabled { get; set; }

        [JsonProperty("IsDeleted")]
        public bool IsDeleted { get; set; }

        [JsonProperty("StartupFundingListIds")]
        public string StartupFundingListIds { get; set; }

        [JsonProperty("MinLoanAmount")]
        public long? MinLoanAmount { get; set; }

        [JsonProperty("MaxLoanAmount")]
        public long? MaxLoanAmount { get; set; }

        [JsonProperty("MinAverageAnnualTurnover")]
        public long? MinAverageAnnualTurnover { get; set; }

        [JsonProperty("MaxAverageAnnualTurnover")]
        public long? MaxAverageAnnualTurnover { get; set; }

        [JsonProperty("FinanceForSubListIds")]
        public string FinanceForSubListIds { get; set; }

        [JsonProperty("SaCitizensOnly")]
        public bool SaCitizensOnly { get; set; }

        [JsonProperty("IncludePermanentResidents")]
        public bool? IncludePermanentResidents { get; set; }

        [JsonProperty("AgeListIds")]
        public string AgeListIds { get; set; }

        [JsonProperty("GenderListIds")]
        public string GenderListIds { get; set; }

        [JsonProperty("RaceListIds")]
        public string RaceListIds { get; set; }

        [JsonProperty("DisabilityListIds")]
        public string DisabilityListIds { get; set; }

        [JsonProperty("CompanyRegistrationTypeListIds")]
        public string CompanyRegistrationTypeListIds { get; set; }

        [JsonProperty("IndustrySectorsLevel1ListIds")]
        public string IndustrySectorsLevel1ListIds { get; set; }

        [JsonProperty("IndustrySectorListIds")]
        public string IndustrySectorListIds { get; set; }

        [JsonProperty("RequiredDocumentTypeListIds")]
        public string RequiredDocumentTypeListIds { get; set; }

        [JsonProperty("NotRequiredDocumentTypeListIds")]
        public string NotRequiredDocumentTypeListIds { get; set; }

        [JsonProperty("ProvinceListIds")]
        public string ProvinceListIds { get; set; }

        [JsonProperty("MinimumMonthsTrading")]
        public long? MinimumMonthsTrading { get; set; }

        [JsonProperty("CustomerTypeListIds")]
        public string CustomerTypeListIds { get; set; }

        [JsonProperty("CustomerProfileListIds")]
        public string CustomerProfileListIds { get; set; }

        [JsonProperty("MinimumMonthlyIncome")]
        public int? MinimumMonthlyIncome { get; set; }

        [JsonProperty("MinimumMonthlyIncomeRetail")]
        public int? MinimumMonthlyIncomeRetail { get; set; }

        [JsonProperty("IncomeReceivedListIds")]
        public string IncomeReceivedListIds { get; set; }

        [JsonProperty("RequiresProfitability")]
        public bool RequiresProfitability { get; set; }

        [JsonProperty("CollateralListIds")]
        public string CollateralListIds { get; set; }

        [JsonProperty("RequiresCollateral")]
        public bool RequiresCollateral { get; set; }

        [JsonProperty("CashForAnInvoiceMinInvoiceValue")]
        public int? CashForAnInvoiceMinInvoiceValue { get; set; }

        [JsonProperty("CashForAnInvoiceCustomerProfileListIds")]
        public string CashForAnInvoiceCustomerProfileListIds { get; set; }

        [JsonProperty("MoneyForContractMinContractValue")]
        public int? MoneyForContractMinContractValue { get; set; }

        [JsonProperty("MoneyForContractCustomerProfileListIds")]
        public string MoneyForContractCustomerProfileListIds { get; set; }

        [JsonProperty("MoneyForContractExperience")]
        public bool MoneyForContractExperience { get; set; }

        [JsonProperty("PurchaseOrderMinFundingValue")]
        public int? PurchaseOrderMinFundingValue { get; set; }

        [JsonProperty("PurchaseOrderFundingCustomerProfileListIds")]
        public string PurchaseOrderFundingCustomerProfileListIds { get; set; }

        [JsonProperty("PurchaseOrderFundingExperience")]
        public bool PurchaseOrderFundingExperience { get; set; }

        [JsonProperty("MoneyForTenderMinTenderValue")]
        public int? MoneyForTenderMinTenderValue { get; set; }

        [JsonProperty("MoneyForTenderCustomerProfileListIds")]
        public string MoneyForTenderCustomerProfileListIds { get; set; }

        [JsonProperty("MoneyForTenderExperience")]
        public bool MoneyForTenderExperience { get; set; }

        [JsonProperty("BuyingBusinessPropertyMinPropertyValue")]
        public int? BuyingBusinessPropertyMinPropertyValue { get; set; }

        [JsonProperty("BuyingBusinessPropertyPropertyTypeListIds")]
        public string BuyingBusinessPropertyPropertyTypeListIds { get; set; }

        [JsonProperty("ShopFittingRenovationsMinPropertyValue")]
        public long? ShopFittingRenovationsMinPropertyValue { get; set; }

        [JsonProperty("ShopFittingRenovationsPropertyTypeListIds")]
        public string ShopFittingRenovationsPropertyTypeListIds { get; set; }

        [JsonProperty("ShopFittingRenovationsRequireUnbonded")]
        public bool ShopFittingRenovationsRequireUnbonded { get; set; }

        [JsonProperty("PropertyDevelopmentDevelopmentTypeListIds")]
        public string PropertyDevelopmentDevelopmentTypeListIds { get; set; }

        [JsonProperty("BusinessExpansionRequireEquity")]
        public bool BusinessExpansionRequireEquity { get; set; }

        [JsonProperty("BusinessExpansionMinimumEquityScore")]
        public string BusinessExpansionMinimumEquityScore { get; set; }

        [JsonProperty("BusinessExpansionRequireJobCreation")]
        public bool BusinessExpansionRequireJobCreation { get; set; }

        [JsonProperty("BusinessExpansionRequireIncreasedProfitability")]
        public bool BusinessExpansionRequireIncreasedProfitability { get; set; }

        [JsonProperty("BusinessExpansionRequireIncreasedExports")]
        public bool BusinessExpansionRequireIncreasedExports { get; set; }

        [JsonProperty("BusinessExpansionRequireEmpowerment")]
        public bool BusinessExpansionRequireEmpowerment { get; set; }

        [JsonProperty("BusinessExpansionRequireRural")]
        public bool BusinessExpansionRequireRural { get; set; }

        [JsonProperty("BusinessExpansionRequireSocial")]
        public bool BusinessExpansionRequireSocial { get; set; }

        [JsonProperty("ProductServiceExpansionTypesOfExpansionListIds")]
        public string ProductServiceExpansionTypesOfExpansionListIds { get; set; }

        [JsonProperty("BuyingAFranchiseRequireAccreditation")]
        public bool BuyingAFranchiseRequireAccreditation { get; set; }

        [JsonProperty("BuyingAFranchiseRequirePreapproval")]
        public bool BuyingAFranchiseRequirePreapproval { get; set; }

        [JsonProperty("PartnerManagementBuyOutMinimumBeeShareholding")]
        public bool PartnerManagementBuyOutMinimumBeeShareholding { get; set; }

        [JsonProperty("BuyingABusinessIndustrySectorsLevel1ListIds")]
        public string BuyingABusinessIndustrySectorsLevel1ListIds { get; set; }

        [JsonProperty("BuyingABusinessIndustrySectorsListIds")]
        public string BuyingABusinessIndustrySectorsListIds { get; set; }

        [JsonProperty("BuyingABusinessBusinessTypeListIds")]
        public string BuyingABusinessBusinessTypeListIds { get; set; }

        [JsonProperty("BuyingABusinessRuralTownship")]
        public bool BuyingABusinessRuralTownship { get; set; }

        [JsonProperty("BeePartnerMinimumBeeShareholding")]
        public bool BeePartnerMinimumBeeShareholding { get; set; }

        [JsonProperty("ExportProductSectionListIds")]
        public string ExportProductSectionListIds { get; set; }

        [JsonProperty("ExportInternationalResearch")]
        public bool ExportInternationalResearch { get; set; }

        [JsonProperty("ExportCountryListId")]
        public string ExportCountryListId { get; set; }

        [JsonProperty("ExportConfirmedOrder")]
        public bool ExportConfirmedOrder { get; set; }

        [JsonProperty("ExportOrderValue")]
        public object ExportOrderValue { get; set; }

        [JsonProperty("ImportSignedContract")]
        public bool ImportSignedContract { get; set; }

        [JsonProperty("ImportCountryListId")]
        public string ImportCountryListId { get; set; }

        [JsonProperty("ImportProductSectionListIds")]
        public string ImportProductSectionListIds { get; set; }

        [JsonProperty("CommercialisingResearchRequireStudentStatus")]
        public bool CommercialisingResearchRequireStudentStatus { get; set; }

        [JsonProperty("CommercialisingResearchRequireIncreasedExports")]
        public bool CommercialisingResearchRequireIncreasedExports { get; set; }

        [JsonProperty("CommercialisingResearchRequireJobCreation")]
        public bool CommercialisingResearchRequireJobCreation { get; set; }

        [JsonProperty("CommercialisingResearchRequireInnovation")]
        public bool CommercialisingResearchRequireInnovation { get; set; }

        [JsonProperty("CommercialisingResearchProductListIds")]
        public string CommercialisingResearchProductListIds { get; set; }

        [JsonProperty("PovertyAlleviationRequireRural")]
        public bool PovertyAlleviationRequireRural { get; set; }

        [JsonProperty("PovertyAlleviationRequireJobCreation")]
        public bool PovertyAlleviationRequireJobCreation { get; set; }

        [JsonProperty("PovertyAlleviationRequireDisabled")]
        public bool PovertyAlleviationRequireDisabled { get; set; }

        [JsonProperty("PovertyAlleviationRequireImprovedHealthcare")]
        public bool PovertyAlleviationRequireImprovedHealthcare { get; set; }

        [JsonProperty("PovertyAlleviationRequireIncomeGeneration")]
        public bool PovertyAlleviationRequireIncomeGeneration { get; set; }

        [JsonProperty("PovertyAlleviationRequireIncreasedExports")]
        public bool PovertyAlleviationRequireIncreasedExports { get; set; }

        [JsonProperty("ResearchAndDevelopmentRequireTertiary")]
        public bool ResearchAndDevelopmentRequireTertiary { get; set; }

        [JsonProperty("ResearchAndDevelopmentIndustrySectorListIds")]
        public string ResearchAndDevelopmentIndustrySectorListIds { get; set; }

        [JsonProperty("BusinessProcessingServicesJobCreation")]
        public bool BusinessProcessingServicesJobCreation { get; set; }

        [JsonProperty("BusinessProcessingServicesSecureContracts")]
        public bool BusinessProcessingServicesSecureContracts { get; set; }

        [JsonProperty("BusinessProcessingServicesYouthJobs")]
        public bool BusinessProcessingServicesYouthJobs { get; set; }

        [JsonProperty("CashFlowAssistanceHasPosDevice")]
        public bool CashFlowAssistanceHasPosDevice { get; set; }

        [JsonProperty("BeeLevelListIds")]
        public string BeeLevelListIds { get; set; }

        [JsonProperty("CountryListIds")]
        public string CountryListIds { get; set; }

        [JsonProperty("HelpPrepareLoanApplication")]
        public bool HelpPrepareLoanApplication { get; set; }

        [JsonProperty("MonitorProgressAfterFunding")]
        public bool MonitorProgressAfterFunding { get; set; }

        [JsonProperty("ProvideMentorship")]
        public bool ProvideMentorship { get; set; }

        [JsonProperty("OwnershipRules")]
        public List<OwnershipRuleDto> OwnershipRules { get; set; }


    }

    public partial class FinanceProductCriteriaDto
    {
        public static FinanceProductCriteriaDto FromJson(string json) => JsonConvert.DeserializeObject<FinanceProductCriteriaDto>(json, Converter.Settings);
    }

    public static class SerializeFinanceProductCriteriaDto
    {
        public static string ToJson(this FinanceProductCriteriaDto self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }


}
