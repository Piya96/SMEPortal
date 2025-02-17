using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos
{
    public class MatchingCriteriaDto
    {
        public string LoanAmountListId { get; set; }
        public string TurnoverListId { get; set; }
        public string FinanceForListId { get; set; }
        public string CompanyRegistrationTypeListId { get; set; }
        public string SACitizenListId { get; set; }
        public string IndustrySectorListId { get; set; }
        public string ProvinceListId { get; set; }
        public string YearsTradingListId { get; set; }
        public string IncomeReceivedListId { get; set; }
        public string CollateralListId { get; set; }
        public string MonthlyIncomeListId { get; set; }
        public string ProfitabilityListId { get; set; }
        public string OwnershipListId { get; set; }
        public string CashForAnInvoiceInvoiceValue { get; set; }
        public string CashForAnInvoiceCustomerProfile { get; set; }
        public string MoneyForContractContractValue { get; set; }
        public string MoneyForContractCustomerProfile { get; set; }
        public string MoneyForContractExperience { get; set; }
        public string MoneyForTenderTenderValue { get; set; }
        public string MoneyForTenderCustomerProfile { get; set; }
        public string MoneyForTenderExperience { get; set; }
        public string BuyingBusinessPropertyPropertyValue { get; set; }
        public string BuyingBusinessPropertyPropertyType { get; set; }
        public string ShopFittingRenovationsUnbonded { get; set; }
        public string ShopFittingRenovationsPropertyType { get; set; }
        public string PropertyDevelopmentDevelopmentTypes { get; set; }
        public string BusinessExpansionRequireEquity { get; set; }
        public string BusinessExpansionRequireJobCreation { get; set; }
        public string BusinessExpansionRequireIncreasedProfitability { get; set; }
        public string BusinessExpansionRequireIncreasedExports { get; set; }
        public string BusinessExpansionRequireEmpowerment { get; set; }
        public string BusinessExpansionRequireRural { get; set; }
        public string BusinessExpansionRequireSocial { get; set; }
        public string ProductServiceExpansionExpansionType { get; set; }
        public string BuyingAFranchiseAccredited { get; set; }
        public string BuyingAFranchisePreapproved { get; set; }
        public string PartnerManagementBuyOutMinimumBeeShareHolding { get; set; }
        public string BuyingABusinessIndustrySector { get; set; }
        public string BuyingABusinessBusinessType { get; set; }
        public string BuyingABusinessRural { get; set; }
        public string BeePartnerMinimumBeeShareholding { get; set; }
        public string ExportProductSection { get; set; }
        public string ExportConfirmedOrder { get; set; }
        public string ImportSignedContract { get; set; }
        public string PurchaseOrderFundingMinFundingValue { get; set; }
        public string PurchaseOrderFundingCustomerProfiles { get; set; }
        public string PurchaseOrderFundingExperience { get; set; }
        public string RetailIncomeReceived { get; set; }
        public string RetailMonthlyIncome { get; set; }
        public string BusinessProcessingServicesJobCreation { get; set; }
        public string BusinessProcessingServicesSecureContracts { get; set; }
        public string BusinessProcessingServicesYouthJobs { get; set; }
        public string CommercialisingResearchRequireStudentStatus { get; set; }
        public string CommercialisingResearchRequireIncreasedExports { get; set; }
        public string CommercialisingResearchRequireJobCreation { get; set; }
        public string CommercialisingResearchRequireInnovation { get; set; }
        public string CommercialisingResearchProducts { get; set; }
        public string BeeLevel {get;set;}


        public string CashForAnInvoiceSubListId { get; set; }
        public string MoneyForContractSubListId { get; set; }
        public string MoneyForTenderSubListId { get; set; }
        public string CommercialisingResearchSubListId { get; set; }
        public string BuyingBusinessPropertySubListId { get; set; }
        public string ShopFittingRenovationsSubListId { get; set; }
        public string PropertyDevelopmentSubListId { get; set; }
        public string BusinessExpansionSubListId { get; set; }
        public string ProductServiceExpansionSubListId { get; set; }
        public string BuyingAFranchiseSubListId { get; set; }
        public string PartnerManagementBuyOutSubListId { get; set; }
        public string BuyingABusinessSubListId { get; set; }
        public string BeePartnerSubListId { get; set; }
        public string ExportSubListId { get; set; }
        public string ImportSubListId { get; set; }
        public string PurchaseOrderFundingSubListId { get; set; }
        public string CashForRetailersSubListId { get; set; }
        public string BusinessProcessingServicesSubListId { get; set; }
        public string CashFlowAssistanceSubListId { get; set; }


        public MatchingCriteriaDto()
        {
            LoanAmountListId = "59e073c4dcc264342884d58f";
            TurnoverListId = "59ddc5a11b37792024771d32";
            FinanceForListId = "59ddc5ae1b37792024771d33";
            CompanyRegistrationTypeListId = "59e07468dcc264342884d590";
            SACitizenListId = "59ddc5f01b37792024771d34";
            IndustrySectorListId = "5a65e51d3eb15c2b78f58b6a";
            ProvinceListId = "5a661e7f3eb15c2b78f58b6c";
            YearsTradingListId = "5a661ce13eb15c2b78f58b6b";
            IncomeReceivedListId = "5a66e43b325ce3195c40799f";
            CollateralListId = "5a66e481325ce3195c4079a1";
            MonthlyIncomeListId = "5a66e41e325ce3195c40799e";
            ProfitabilityListId = "5a66e453325ce3195c4079a0";
            OwnershipListId = "5b17fbc78f95c634cc69ea6f";
            CashForAnInvoiceInvoiceValue = "5a6ec7538eb5b90fc49ba5eb";
            CashForAnInvoiceCustomerProfile = "5a6ec76f8eb5b90fc49ba5ec";
            MoneyForContractContractValue = "5a6ed7ba8eb5b90fc49ba5ed";
            MoneyForContractCustomerProfile = "5a6ed7db8eb5b90fc49ba5ee";
            MoneyForContractExperience = "5a6ed7ec8eb5b90fc49ba5ef";
            MoneyForTenderTenderValue = "5a6f28ffcb0d114734ecf204";
            MoneyForTenderCustomerProfile = "5a6f2929cb0d114734ecf205";
            MoneyForTenderExperience = "5a6f294fcb0d114734ecf206";
            BuyingBusinessPropertyPropertyValue = "5a6f319acb0d114734ecf207";
            BuyingBusinessPropertyPropertyType = "5a6f31b4cb0d114734ecf208";
            ShopFittingRenovationsUnbonded = "5a6f31e1cb0d114734ecf209";
            ShopFittingRenovationsPropertyType = "5a6f3227cb0d114734ecf20a";
            PropertyDevelopmentDevelopmentTypes = "5a6f3253cb0d114734ecf20b";
            BusinessExpansionRequireEquity = "5a7982eb7f5dbe5cbcb13ca0";
            BusinessExpansionRequireJobCreation = "5a79833b7f5dbe5cbcb13ca1";
            BusinessExpansionRequireIncreasedProfitability = "5a7983597f5dbe5cbcb13ca2";
            BusinessExpansionRequireIncreasedExports = "5a7983817f5dbe5cbcb13ca3";
            BusinessExpansionRequireEmpowerment = "5a79839a7f5dbe5cbcb13ca4";
            BusinessExpansionRequireRural = "5a7983ad7f5dbe5cbcb13ca5";
            BusinessExpansionRequireSocial = "5a7983c27f5dbe5cbcb13ca6";
            ProductServiceExpansionExpansionType = "5a7a9a31646a451744bca3c3";
            BuyingAFranchiseAccredited = "5a7d4d45e5f53f0850d597f3";
            BuyingAFranchisePreapproved = "5a7d4d5ce5f53f0850d597f4";
            PartnerManagementBuyOutMinimumBeeShareHolding = "5a812836c053780e8c1eb72c";
            BuyingABusinessIndustrySector = "5a812893c053780e8c1eb72d";
            BuyingABusinessBusinessType = "5a812a11c053780e8c1eb72e";
            BuyingABusinessRural = "5a812a39c053780e8c1eb72f";
            BeePartnerMinimumBeeShareholding = "5a812a67c053780e8c1eb730";
            ExportProductSection = "5a8289c4c053780e8c1eb734";
            ExportConfirmedOrder = "5a828a0dc053780e8c1eb735";
            ImportSignedContract = "5a828a49c053780e8c1eb736";
            PurchaseOrderFundingMinFundingValue = "5b626bcf3af82b18f0614e63";
            PurchaseOrderFundingCustomerProfiles = "5b626c1a3af82b18f0614e64";
            PurchaseOrderFundingExperience = "5b626c2e3af82b18f0614e65";
            RetailIncomeReceived = "5b605a66c947af2a605a05ad";
            RetailMonthlyIncome = "5b626f973af82b18f0614e66";
            BusinessProcessingServicesJobCreation = "5b616b843af82b18f0614e5b";
            BusinessProcessingServicesSecureContracts = "5b616baa3af82b18f0614e5c";
            BusinessProcessingServicesYouthJobs = "5b616bc43af82b18f0614e5d";
            CommercialisingResearchRequireStudentStatus = "5b6263fb3af82b18f0614e5e";
            CommercialisingResearchRequireIncreasedExports = "5b62641e3af82b18f0614e5f";
            CommercialisingResearchRequireJobCreation = "5b62643a3af82b18f0614e60";
            CommercialisingResearchRequireInnovation = "5b6264593af82b18f0614e61";
            CommercialisingResearchProducts = "5b6264833af82b18f0614e62";
            BeeLevel = "5b62e5fc3af82b18f0614e67";
            CashForAnInvoiceSubListId = "59cc9d26132f4c40c446a4f7";
            MoneyForContractSubListId = "59cca8a430e9df02c82d0795";
            PurchaseOrderFundingSubListId = "5b213996b958c008605883e8";
            MoneyForTenderSubListId = "59cca89030e9df02c82d0794";
            BuyingBusinessPropertySubListId = "59d2694720070a604097b047";
            ShopFittingRenovationsSubListId = "59d2693920070a604097b046";
            PropertyDevelopmentSubListId = "59d2695420070a604097b048";
            BusinessExpansionSubListId = "59d269bd20070a604097b04a";
            ProductServiceExpansionSubListId = "59d269c920070a604097b04b";
            BuyingAFranchiseSubListId = "59c2c7087c83b736d463c255";
            PartnerManagementBuyOutSubListId = "59d26a2620070a604097b04e";
            BuyingABusinessSubListId = "59d26a1620070a604097b04d";
            BeePartnerSubListId = "59d26a3120070a604097b04f";
            ExportSubListId = "59d26a6420070a604097b052";
            ImportSubListId = "59d26d3120070a604097b053";
            CashForRetailersSubListId = "5acb467062ba593724e0a78a";
            BusinessProcessingServicesSubListId = "59d26d8720070a604097b059";
            CommercialisingResearchSubListId = "5acb25f862ba593724e0a788";
            CashFlowAssistanceSubListId = "59cc9d36132f4c40c446a4f8";
        }
    }
}
