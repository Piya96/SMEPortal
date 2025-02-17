"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.fundingRequirements == undefined) {
    app.wizard.fundingRequirements = {};
}

if (app.wizard.fundingRequirements.dto == undefined) {
    app.wizard.fundingRequirements.dto = {};
}

(function (dto) {

    const FinanceType = {
        Asset: '59c35d64463361150873b641',
        WorkingCapital: '59c2c6b37c83b736d463c251',
        GrowBusiness: '59c5d92b5eac2311202772f5',
        PartnerBuyoutOrFranchise: '59c2c6f77c83b736d463c254',
        Other: '59c5d96b5eac2311202772f7',
        ResearchAndInnovation: '59c5d95c5eac2311202772f6'
    };

    const AssetFinance = {
        BuyingBusinessProperty: '59d2694720070a604097b047',
        BuyingEquipment: '59c35d86463361150873b642',
        BuyingMachinery: '59c3605c463361150873b643',
        BuyingVehicleOrFleetFinance: '59d2692520070a604097b045',
        PropertyDevelopment: '59d2695420070a604097b048',
        PropertyRefinancing: '59d2696020070a604097b049',
        ShopfittingRenovations: '59d2693920070a604097b046'
    };

    const GrowthFinance = {
        BusinessExpansion: "59d269bd20070a604097b04a",
        ProductServiceExpansion: "59d269c920070a604097b04b",
        RefinancingExistingDebt: "59d269d620070a604097b04c"
    };

    const OtherFinance = {
        BusinessProcessOutsourcing: "59d26d8720070a604097b059",
        ExportFundingTradeFinance: "59d26a6420070a604097b052",
        FundingForArtistsAndEvents: "59d26d4720070a604097b054",
        ImportFundingTradeFinance: "59d26d3120070a604097b053",
        PovertyAlleviationAndRuralDevelopment: "59d26d6020070a604097b056"
    };

    const WorkingCapital = {
        CashAdvanceForAnInvoice: "59cc9d26132f4c40c446a4f7",
        CashFlowAssistance: "59cc9d36132f4c40c446a4f8",
        CashForRetailersWithACardMachine: "5acb467062ba593724e0a78a",
        MoneyToBuyStock: "59cca85e30e9df02c82d0793",
        MoneyToHelpWithAContract: "59cca8a430e9df02c82d0795",
        MoneyToHelpWithATender: "59cca89030e9df02c82d0794",
        PurchaseOrderFunding: "5b213996b958c008605883e8"
    };

    const FranchiseAquisition = {
        BuyingAFranchise: "59c2c7087c83b736d463c255",
        FundingToBringOnABEEPartner: "59d26a3120070a604097b04f",
        FundingToBuyAnExistingBusiness: "59d26a1620070a604097b04d",
        PartnerOrManagementBuyout: "59d26a2620070a604097b04e",
        StartingYourOwnFranchise: "59c2c7197c83b736d463c256"
    };

    const ResearchInnovation = {
        DevelopingANewProductProcess: "5acb25ce62ba593724e0a786",
        FilingAPatent: "5acb25dd62ba593724e0a787",
        FundingForGreenInitiatives: "59d26a5320070a604097b051",
        NewProductCommercialisation: "5acb25f862ba593724e0a788",
        ResearchFunding: "5acb260462ba593724e0a789",
        TechInnovation: "59d26a4820070a604097b050"
    };

    app.localize = function (str) {
        return str;
    }

    let helpers = app.onboard.helpers.get();

    dto.controls = {
        'financefor': { type: 'radio', guid: '59c2c6a37c83b736d463c250', label: "What do you need the funding for?", filters : [] },

        'loanamount': { type: 'input', label: 'Amount of Funding Needed', filters: [helpers.formatCurrencyR] },
        //control.format(10, this.helpers.formatCurrency);
        // Buy and asset.
        'assetfinancetype': { type: 'select', guid: '59c35d64463361150873b641', label: "Buy An Asset Options", filters: [] },

        'buyingbusinesspropertyvalue': { type: 'input', label: 'What is the value of the property?', filters: [helpers.formatCurrencyR] },
        //control.format(10, this.helpers.formatCurrency);
        'buyingbusinesspropertytype': { type: 'select', guid: '5a6f0a36cb0d114734ecf1fe', label: 'Select your property type', filters: [] },
        'propertydevelopmenttype': { type: 'select', guid: '5a6f0afacb0d114734ecf1ff', label: 'Select your development type', filters: [] },
        'shopfittingpropbonded': { type: 'radio', label: "Is the property bonded?", filters: [] },
        'shopfittingpropertyvalue': { type: 'input', label: 'What is the value of the property?', filters: [helpers.formatCurrencyR] },
        //control.format(10, this.helpers.formatCurrency);
        'shopfittingpropertytype': { type: 'select', guid: '5a6f0a36cb0d114734ecf1fe', label: app.localize('SelectPropertyType'), filters: [] },

        // Grow my business.
        'growthfinancetype': { type: 'select', guid: '59c5d92b5eac2311202772f5', label: 'Grow My Business Options', filters: [] },
        'willingtosellshares': { type: 'radio', label: 'Would you be willing to sell shares in your business in exchange for funding?', filters: [] },
        'largepotentialmarket': { type: 'radio', label: 'Does your business have a large potential market that can generate significant profits within the next 3 to 5 years?', filters: [] },
        'customersbuying': { type: 'radio', label: 'Do you currently have customers buying your products/service?', filters: [] },
        'businessexpansioncompetitiveadv': { type: 'select', guid: '59ec85401b37792024771d41', label: 'What sets you apart from your competitors?', filters: [] },
        'businessexpansionresultinincreasedemployees': { type: 'radio', label: 'Will the business expansion result in any of the following?', filters: [] },
        'businessexpansionresultinincreasedprofitability': { type: 'radio', label: 'Increased profitability', filters: [] },
        'businessexpansionresultinincreasedexports': { type: 'radio', label: 'Increased exports', filters: [] },
        'businessexpansionresultineconomicempowerment': { type: 'radio', label: 'Empowerment and economic development of previously disadvantaged', filters: [] },
        'businessexpansionresultinsustainabledev': { type: 'radio', label: 'Sustainable rural or peri-urban development', filters: [] },
        'businessexpansionresultinsolveenvchallenges': { type: 'radio', label: 'Solve social and environmental challenges in a sustainable manner', filters: [] },
        'productserviceexpansiontype': { type: 'select', guid: '5a7a7afe646a451744bca3b4', label: 'Select the type of expansion your product/service applies to', filters: [] },

        // Other.
        'otherfinancetype': { type: 'select', guid: '59c5d96b5eac2311202772f7', label: 'Other Business Finance Options', filters: [] },
        'willworkgenerate50newjobs': { type: 'radio', label: 'Will the work generate at least 50 new jobs within 3 years?', filters: [] },
        'doyouhavecontractsforbps': { type: 'radio', label: 'Do you have secure contracts to provide the BPS to international clients?', filters: [] },
        'will80percofjobsbeforyouth': { type: 'radio', label: 'Will 80% of the jobs being created be for South African youth?', filters: [] },
        'otherfinanceexportindustry': { type: 'selectmulti', guid: '5a8288d5c053780e8c1eb731', label: 'Please indicate the industry that the exported product or service represents', filters: [] },
        'exportcountry': { type: 'select', guid: 'COUNTRY', label: 'What countries are you exporting to?', filters: [] },
        'needingtoconductintmarketresearch': { type: 'radio', label: 'Are you needing to conduct international market research?', filters: [] },
        'haveconfirmedorders': { type: 'radio', label: 'Do you have confirmed export orders?', filters: [] },
        'otherfinanceimportindustry': { type: 'selectmulti', guid: '5a8288d5c053780e8c1eb731', label: 'Please indicate the industry that the imported product or service represents', filters: [] },
        'importcountry': { type: 'select', guid: 'COUNTRY', label: 'What countries are you importing from?', filters: [] },
        'havesignedcontracts': { type: 'radio', label: 'Do you have signed contracts?', filters: [] },
        'workinruralareas': { type: 'radio', label: 'Do you work in rural areas?', filters: [] },
        'resultinemploymentsavejobs': { type: 'radio', label: 'Will your project result in increased employment or save existing jobs?', filters: [] },
        'workwithpeoplewithdisabilities': { type: 'radio', label: 'Do you work with people with disabilities?', filters: [] },
        'willprojectimprovehealthcare': { type: 'radio', label: 'Will the project improve healthcare?', filters: [] },
        'willgenerateincomeinimpoverishedareas': { type: 'radio', label: 'Will the project generate income in impoverished areas?', filters: [] },
        'willgenerateincreasedexportvalue': { type: 'radio', label: 'Will the project generate increased export value?', filters: [] },

        // Working Capital.
        'workingcapitaltype': { type: 'select', guid: '59c2c6b37c83b736d463c251', label: 'For Working Capital Options', filters: [] },
        'cashforaninvoiceamount': { type: 'input', label: 'What is the value of invoice/s you need money for?', filters: [helpers.formatCurrencyR] },
        //control.format(10, this.helpers.formatCurrency);
        'cashforinvoicecustomer': { type: 'select', guid: '59db18348964a744e4ad0aa7', label: 'Who is your customer?', filters: [] },
        'customeragreed': { type: 'radio', label: 'Has the customer agreed that the work for this invoice has been completed?', filters: [] },
        'hasposdevice': { type: 'radio', label: 'Do you have a card machine or point of sale device?', filters: [] },
        'regularmonthlyincome': { type: 'radio', label: 'Does your business have a regular monthly income?', filters: [] },
        'monthlyincomeincomevalue': { type: 'input', label: 'Monthly income', filters: [helpers.formatCurrencyR] },
        //control.format(10, this.helpers.formatCurrency);
        'cardmachinepaymenttypes': { type: 'checkbox', guid: '59d370517112ea2ef072eec7', label: 'Select the payment types you receive income from', filters: [] },
        'moneyforcontractvalue': { type: 'input', label: 'What is the value of the contract you require finance for?', filters: [helpers.formatCurrencyR] },
        //control.format(10, this.helpers.formatCurrency);
        'moneyforcontractcustomer': { type: 'select', guid: '59db18348964a744e4ad0aa7', label: 'Who is your customer?', filters: [] },
        'moneyforcontractcompanyexperience': { type: 'radio', label: 'Does your business have the relevant experience to deliver the required contract/work?', filters: [] },
        'moneyfortendervalue': { type: 'input', label: 'What is the tender value?', filters: [helpers.formatCurrencyR] },
        //control.format(10, this.helpers.formatCurrency);
        'moneyfortendercustomer': { type: 'select', guid: '59db18348964a744e4ad0aa7', label: 'Who is your customer?', filters: [] },
        'moneyfortendercompanyexperience': { type: 'radio', label: 'Does your business have the relevant experience to complete the tender?', filters: [] },
        'purchaseordervalue': { type: 'input', label: 'What is the value of the purchase order?', filters: [helpers.formatCurrencyR] },
        //control.format(10, this.helpers.formatCurrency);
        'purchaseordercustomer': { type: 'select', guid: '59db18348964a744e4ad0aa7', label: 'Who is your customer?', filters: [] },
        'purchaseordercustomerexperience': { type: 'radio', label: 'Does your business have the relevant experience to deliver the work required for the purchase order?', filters: [] },

        // Franchise Acquisition.
        'franchiseacquisitiontype': { type: 'select', guid: '59c2c6f77c83b736d463c254', label: 'Partner Buy-out or Franchise Funding Options', filters: [] },
        'buyingafranchisefranchiseaccredited': { type: 'radio', label: 'Is the franchise accredited with the Franchise Association of South Africa?', filters: [] },
        'preapprovedbyfranchisor': { type: 'radio', label: 'Have you been pre-approved by the franchisor?', filters: [] },
        'beepartnerfranchiseaccredited': { type: 'radio', label: 'Will the company have a minimum BEE shareholding of 25.1% after the buyout?', filters: [] },
        'select-sic-section': { type: 'select', label: 'Section', filters: [] },
        'select-sic-division': { type: 'select', label: 'Division', filters: [] },
        'select-sic-group': { type: 'select', label: 'Group', filters: [] },
        'select-sic-class': { type: 'select', label: 'Class', filters: [] },
        'select-sic-sub-class': { type: 'select', label: 'Subclass', filters: [] },

        'fundingtobuyanexistingbusinesstype': { type: 'select', guid: '59d2ed3839b41c2b749a03d9', label: 'What type of business is it?', filters: [] },
        'businesslocatedinruralarea': { type: 'radio', label: 'Is the business located in a rural or township area?', filters: [] },
        'shareholdinggreaterthanperc': { type: 'radio', label: 'Will the company have a minimum BEE shareholding of 25.1% after the buyout?', filters: [] },

        // Research Innovation.
        'researchinnovationfundingtype': { type: 'select', guid: '59c5d95c5eac2311202772f6', label: 'Research and Innovation Funding Options', filters: [] },
        'commresstudentstatus': { type: 'radio', label: 'Are you currently a student at a University?', filters: [] },
        'commreswillincexports': { type: 'radio', label: 'Will your new product increase exports or replace existing imports?', filters: [] },
        'commresresultinjobcreation': { type: 'radio', label: 'Will this result in job creation?', filters: [] },
        'commresintroinnov': { type: 'radio', label: 'Will this result in the introduction of an innovative product or service?', filters: [] },
        'commresindustries': { type: 'selectmulti', guid: '5a8288d5c053780e8c1eb731', label: 'Select any items that match your new product/service', filters: [] },
        'researchtakingplaceinuniversity': { type: 'radio', label: 'Is the research and development taking place at a University or Science Engineering and Technology Institution?', filters: [] },
        'researchfieldofresearchtype': { type: 'select', guid: '5b1fa3a5b958c008605883e1', label: 'Which of the following match your field of research?', filters: [] }
    };

    class DtoToHtml {
        constructor(self) {
            if (self != null) {
                this.self = self;
                this.helpers = self.helpers;
            }
        }

        set(name, enable) {
            let value = '';
            if (enable == true) {
                value = this.helpers.getPropEx(this.self.dto, name, '');
            } else {
                this.helpers.setPropEx(this.self.dto, name, '');
            }
            this.validation.toggleValidators([name], [enable]);
            if (enable == true) {
                let x = 0;
            }
            return value;
        }

        show(name, enable) {
            this.helpers.show(name, enable);
        }

        financeFor(enable = true) {
            let value = this.set('financefor', enable);
            //this.loanAmount();
            this.asset(value == FinanceType.Asset);
            this.growth(value == FinanceType.GrowBusiness);
            this.other(value == FinanceType.Other);
            this.workingCapital(value == FinanceType.WorkingCapital);
            this.franchiseAquisition(value == FinanceType.PartnerBuyoutOrFranchise);
            this.researchInnovation(value == FinanceType.ResearchAndInnovation);
        }

        loanAmount() {
            let value = this.set('loanamount', true);
        }

        // Asset Finance.
        asset(enable = true) {
            this.show('div-asset-finance-type', enable);
            let value = this.set('assetfinancetype', enable);

            this.asset_buyingBusinessProperty(value == AssetFinance.BuyingBusinessProperty);
            this.asset_buyingEquipment(value == AssetFinance.BuyingEquipment);
            this.asset_buyingMachinery(value == AssetFinance.BuyingMachinery);
            this.asset_buyingVehicleOrFleetFinance(value == AssetFinance.BuyingVehicleOrFleetFinance);
            this.asset_propertyDevelopment(value == AssetFinance.PropertyDevelopment);
            this.asset_propertyRefinancing(value == AssetFinance.PropertyRefinancing);
            this.asset_shopfittingRenovations(value == AssetFinance.ShopfittingRenovations);
        }

        asset_buyingBusinessProperty(enable) {
            this.show('asset-finance-buying-business-property', enable);

            this.set('buyingbusinesspropertyvalue', enable);
            this.set('buyingbusinesspropertytype', enable);
        }

        asset_buyingEquipment(enable) {

        }

        asset_buyingMachinery(enable) {

        }

        asset_buyingVehicleOrFleetFinance(enable) {
        }

        asset_propertyDevelopment(enable) {
            this.show('asset-finance-property-development', enable);
            this.set('propertydevelopmenttype', enable);
        }

        asset_propertyRefinancing(enable) {
        }

        asset_shopfittingRenovations(enable) {
            this.show('asset-finance-shopfitting-renovations', enable);
            this.set('shopfittingpropbonded', enable);
            this.set('shopfittingpropertyvalue', enable);
            this.set('shopfittingpropertytype', enable);
        }

        // Grow Business.
        growth(enable = true) {
            this.show('div-growth-finance-type', enable);
            let value = this.set('growthfinancetype', enable);

            this.growth_businessExpansion(value == GrowthFinance.BusinessExpansion);
            this.growth_productServiceExpansion(value == GrowthFinance.ProductServiceExpansion);
            this.growth_refinancingExistingDebt(value == GrowthFinance.RefinancingExistingDebt);
        }

        growth_businessExpansion(enable = true) {
            this.show('div-growth-finance-business-expansion', enable);

            //this.set('willingtosellshares', enable);
            this.growth_willingToSellShares(enable);

            this.set('businessexpansioncompetitiveadv', enable);
            this.set('businessexpansionresultinincreasedemployees', enable);
            this.set('businessexpansionresultinincreasedprofitability', enable);
            this.set('businessexpansionresultinincreasedexports', enable);
            this.set('businessexpansionresultineconomicempowerment', enable);
            this.set('businessexpansionresultinsustainabledev', enable);
            this.set('businessexpansionresultinsolveenvchallenges', enable);
        }

        growth_willingToSellShares(enable = true) {
            let value = this.set('willingtosellshares', enable);
            this.growth_willingToSellSharesYes(value == 'Yes');
        }

        growth_willingToSellSharesYes(enable = true) {
            this.show('div-business-expansion-willing-to-sell-shares', enable);
            this.set('largepotentialmarket', enable);
            this.set('customersbuying', enable);
        }

        growth_productServiceExpansion(enable) {
            this.show('div-growth-finance-product-service-expansion', enable);
            this.set('productserviceexpansiontype', enable);
        }

        growth_refinancingExistingDebt(enable) {
        }

        // Other Business Finance.
        other(enable = true) {
            this.show('div-other-finance-for-type', enable);
            let value = this.set('otherfinancetype', enable);
            this.other_businessProcessOutsourcing(value == OtherFinance.BusinessProcessOutsourcing);
            this.other_exportFundingTradeFinance(value == OtherFinance.ExportFundingTradeFinance);
            this.other_fundingForArtistsAndEvents(value == OtherFinance.FundingForArtistsAndEvents);
            this.other_importFundingTradeFinance(value == OtherFinance.ImportFundingTradeFinance);
            this.other_povertyAlleviationAndRuralDevelopment(value == OtherFinance.PovertyAlleviationAndRuralDevelopment);
        }

        other_businessProcessOutsourcing(enable = true) {
            this.show('div-other-finance-business-process-outsourcing', enable);
            this.set('willworkgenerate50newjobs', enable);
            this.set('doyouhavecontractsforbps', enable);
            this.set('will80percofjobsbeforyouth', enable);
        }

        other_exportFundingTradeFinance(enable = true) {
            this.show('div-other-finance-export-funding-trade-finance', enable);
            this.set('otherfinanceexportindustry', enable);
            this.set('exportcountry', enable);
            this.set('needingtoconductintmarketresearch', enable);
            this.set('haveconfirmedorders', enable);
        }

        other_fundingForArtistsAndEvents(enable = true) {
        }

        other_importFundingTradeFinance(enable = true) {
            this.show('div-other-finance-import-funding-trade-finance', enable);
            this.set('otherfinanceimportindustry', enable);
            this.set('importcountry', enable);
            this.set('havesignedcontracts', enable);
        }

        other_povertyAlleviationAndRuralDevelopment(enable = true) {
            this.show('div-other-finance-poverty-alleviation-and-rural-development', enable);
            this.set('workinruralareas', enable);
            this.set('resultinemploymentsavejobs', enable);
            this.set('workwithpeoplewithdisabilities', enable);
            this.set('willprojectimprovehealthcare', enable);
            this.set('willgenerateincomeinimpoverishedareas', enable);
            this.set('willgenerateincreasedexportvalue', enable);
        }

        // Working Capital.
        workingCapital(enable = true) {
            this.show('div-working-capital-type', enable);
            let value = this.set('workingcapitaltype', enable);

            this.workingCapital_cashAdvanceForAnInvoice(value == WorkingCapital.CashAdvanceForAnInvoice);
            this.workingCapital_cashFlowAssistance(value == WorkingCapital.CashFlowAssistance);
            this.workingCapital_cashForRetailersWithACardMachine(value == WorkingCapital.CashForRetailersWithACardMachine);
            this.workingCapital_moneyToBuyStock(value == WorkingCapital.MoneyToBuyStock);
            this.workingCapital_moneyToHelpWithAContract(value == WorkingCapital.MoneyToHelpWithAContract);
            this.workingCapital_moneyToHelpWithATender(value == WorkingCapital.MoneyToHelpWithATender);
            this.workingCapital_purchaseOrderFunding(value == WorkingCapital.PurchaseOrderFunding);
        }

        workingCapital_cashAdvanceForAnInvoice(enable = true) {
            this.show('div-working-capital-cash-for-invoice', enable);
            this.set('cashforaninvoiceamount', enable);
            this.set('cashforinvoicecustomer', enable);
            let value = this.set('customeragreed', enable);
            this.workingCapital_cashAdvanceForAnInvoice_customerAgreed(value == 'No');
        }

        workingCapital_cashAdvanceForAnInvoice_customerAgreed(enable = true) {
            this.helpers.show('customernotagreed', enable);
        }

        workingCapital_cashFlowAssistance(enable = true) {
            this.show('div-working-capital-cash-flow-assistance', enable);
            this.set('hasposdevice', enable);
        }

        workingCapital_cashForRetailersWithACardMachine(enable = true) {
            this.show('div-working-capital-cash-for-retailers-with-card-machine', enable);
            let value = this.set('regularmonthlyincome', enable);
            this.workingCapital_cashForRetailersWithACardMachine_monthlyIncomeIncomeValue(value == 'Yes');
            this.set('cardmachinepaymenttypes', enable);
        }

        workingCapital_cashForRetailersWithACardMachine_monthlyIncomeIncomeValue(enable = true) {
            this.show('div-retailers-with-card-machine-monthly-income', enable);
            this.set('monthlyincomeincomevalue', enable);
        }

        workingCapital_moneyToBuyStock(enable = true) {
        }

        workingCapital_moneyToHelpWithAContract(enable = true) {
            this.show('div-working-capital-money-for-contract', enable);
            this.set('moneyforcontractvalue', enable);
            this.set('moneyforcontractcustomer', enable);
            this.set('moneyforcontractcompanyexperience', enable);
        }

        workingCapital_moneyToHelpWithATender(enable = true) {
            this.show('div-working-capital-money-for-tender', enable);
            this.set('moneyfortendervalue', enable);
            this.set('moneyfortendercustomer', enable);
            this.set('moneyfortendercompanyexperience', enable);
        }

        workingCapital_purchaseOrderFunding(enable = true) {
            this.show('div-working-capital-puchase-order-funding', enable);
            this.set('purchaseordervalue', enable);
            this.set('purchaseordercustomer', enable);
            this.set('purchaseordercustomerexperience', enable);
        }

        franchiseAquisition(enable = true) {
            this.show('div-franchise-acquisition-partner-funding-type', enable);
            let value = this.set('franchiseacquisitiontype', enable);
            this.franchiseAquisition_buyingAFranchise(value == FranchiseAquisition.BuyingAFranchise);
            this.franchiseAquisition_fundingToBringOnABEEPartner(value == FranchiseAquisition.FundingToBringOnABEEPartner);
            this.franchiseAquisition_fundingToBuyAnExistingBusiness(value == FranchiseAquisition.FundingToBuyAnExistingBusiness);
            this.franchiseAquisition_partnerOrManagementBuyout(value == FranchiseAquisition.PartnerOrManagementBuyout);
            this.franchiseAquisition_startingYourOwnFranchise(value == FranchiseAquisition.StartingYourOwnFranchise);
        }

        franchiseAquisition_buyingAFranchise(enable = true) {
            this.show('div-franchise-acquisition-buying-a-franchise', enable);
            this.set('buyingafranchisefranchiseaccredited', enable);
            this.set('preapprovedbyfranchisor', enable);
        }

        franchiseAquisition_fundingToBringOnABEEPartner(enable = true) {
            this.show('div-franchise-acquisition-funding-to-bring-on-a-bee-partner', enable);
            this.set('beepartnerfranchiseaccredited', enable);
        }

        franchiseAquisition_fundingToBuyAnExistingBusiness(enable = true) {
            this.show('div-franchise-acquisition-funding-to-buy-an-existing-business', enable);
            this.franchiseAquisition_fundingToBuyAnExistingBusiness_industry(enable);
            this.set('fundingtobuyanexistingbusinesstype', enable);
            this.set('businesslocatedinruralarea', enable);
        }

        setSic() {
            let v = [];
            v.push(this.helpers.getPropEx(this.self.dto, 'select-sic-section', ''));
            v.push(this.helpers.getPropEx(this.self.dto, 'select-sic-division', ''));
            v.push(this.helpers.getPropEx(this.self.dto, 'select-sic-group', ''));
            v.push(this.helpers.getPropEx(this.self.dto, 'select-sic-class', ''));
            v.push(this.helpers.getPropEx(this.self.dto, 'select-sic-sub-class', ''));
            return v;
        }

        franchiseAquisition_fundingToBuyAnExistingBusiness_industry(enable = true) {
            if (enable == true) {
                let value = this.helpers.getPropEx(this.self.dto, 'select-sic-sub-class', '');
                let result = app.wizard.isb.findFromId(value, 5);
                if (result != null) {
                    app.wizard.isb.refresh(value);
                    $("#li-industry-section").text('Section: ' + result[1].desc);
                    $("#li-industry-division").text('Division: ' + result[2].desc);
                    $("#li-industry-group").text('Group: ' + result[3].desc);
                    $("#li-industry-class").text('Class: ' + result[4].desc);
                    $("#li-industry-sub-class").text('Subclass: ' + result[5].desc);
                    $('#div-industry-info').show('fast');
                } else {
                    $('#div-industry-info').hide('fast');
                }
            } else {
                $('#div-industry-info').hide('fast');
                this.helpers.setPropEx(this.self.dto, 'select-sic-section', '');
                this.helpers.setPropEx(this.self.dto, 'select-sic-division', '');
                this.helpers.setPropEx(this.self.dto, 'select-sic-group', '');
                this.helpers.setPropEx(this.self.dto, 'select-sic-class', '');
                this.helpers.setPropEx(this.self.dto, 'select-sic-sub-class', '');
            }
        }

        franchiseAquisition_partnerOrManagementBuyout(enable = true) {
            this.show('div-franchise-acquisition-funding-partner-or-management-buyout', enable);
            this.set('shareholdinggreaterthanperc', enable);
        }

        franchiseAquisition_startingYourOwnFranchise(enable = true) {

        }

        researchInnovation(enable = true) {
            this.show('div-research-innovation-funding-type', enable);
            let value = this.set('researchinnovationfundingtype', enable);
            this.researchInnovation_developingANewProductProcess(value == ResearchInnovation.DevelopingANewProductProcess);
            this.researchInnovation_filingAPatent(value == ResearchInnovation.FilingAPatent);
            this.researchInnovation_fundingForGreenInitiatives(value == ResearchInnovation.FundingForGreenInitiatives);
            this.researchInnovation_newProductCommercialisation(value == ResearchInnovation.NewProductCommercialisation);
            this.researchInnovation_researchFunding(value == ResearchInnovation.ResearchFunding);
            this.researchInnovation_techInnovation(value == ResearchInnovation.TechInnovation);
        }

        researchInnovation_developingANewProductProcess(enable = true) {

        }

        researchInnovation_filingAPatent(enable = true) {

        }

        researchInnovation_fundingForGreenInitiatives(enable = true) {

        }

        researchInnovation_newProductCommercialisation(enable = true) {
            this.show('div-research-innovation-new-product-commercialisation', enable);
            this.set('commresstudentstatus', enable);
            this.set('commreswillincexports', enable);
            this.set('commresresultinjobcreation', enable);
            this.set('commresintroinnov', enable);
            this.set('commresindustries', enable);

        }

        researchInnovation_researchFunding(enable = true) {
            this.show('div-research-innovation-research-funding', enable);
            this.set('researchtakingplaceinuniversity', enable);
            this.set('researchfieldofresearchtype', enable);
        }

        researchInnovation_techInnovation(enable = true) {

        }

        apply() {
            this.loanAmount();
            this.financeFor();
        }
    }

    dto.getDto = function (dto) {
        return new DtoToHtml(dto);
    }

    dto.DtoToHtml = DtoToHtml;

})(app.wizard.fundingRequirements.dto);
