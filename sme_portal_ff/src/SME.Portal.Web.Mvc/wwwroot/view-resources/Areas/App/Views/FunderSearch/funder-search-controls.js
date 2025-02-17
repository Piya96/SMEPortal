"use strict";

// Industry sector data.
// ----------------------------------------------------------------------------------------------------- //
if (app.getFunding == undefined) {
    app.getFunding = {};
}
app.getFunding.controls = {};

function fundingWizardLoadControls() {

    (function (controls) {
        // FinancialInfo ( _StepIncomeProfitability.cshtml )
        const annualturnover = 'annualturnover';
        const bank = 'bank';
        const bankaccservices = 'bankaccservices';
        const businessloans = 'businessloans';
        const whoistheloanfrom = 'whoistheloanfrom';
        const businesstxpersonalacc = 'businesstxpersonalacc';
        const personalbank = 'personalbank';
        const haselecaccsystems = 'haselecaccsystems';
        const elecaccsystems = 'elecaccsystems';
        const elecaccsystemother = 'elecaccsystemother';
        const haspayroll = 'haspayroll';
        const payrollsystems = 'payrollsystems';
        const payrollsystemother = 'payrollsystemother';
        const hasinvestedownmoney = 'hasinvestedownmoney';
        const businessisprofitable = 'businessisprofitable';
        const businesshascolateral = 'businesshascolateral';

        // FundingRequirement ( _FinanceForSelector.cshtml )
        const financefor = 'financefor';
        const loanamount = 'loanamount';
        const assetfinancetype = 'assetfinancetype';
        const buyingbusinesspropertyvalue = 'buyingbusinesspropertyvalue';
        const buyingbusinesspropertytype = 'buyingbusinesspropertytype';
        const propertydevelopmenttype = 'propertydevelopmenttype';
        const shopfittingpropbonded = 'shopfittingpropbonded';
        const shopfittingpropertyvalue = 'shopfittingpropertyvalue';
        const shopfittingpropertytype = 'shopfittingpropertytype';
        // Growth finance types
        const growthfinancetype = 'growthfinancetype';
        const willingtosellshares = 'willingtosellshares';
        const largepotentialmarket = 'largepotentialmarket';
        const customersbuying = 'customersbuying';
        const businessexpansioncompetitiveadv = 'businessexpansioncompetitiveadv';
        const businessexpansionresultinincreasedemployees = 'businessexpansionresultinincreasedemployees';
        const businessexpansionresultinincreasedprofitability = 'businessexpansionresultinincreasedprofitability';
        const businessexpansionresultinincreasedexports = 'businessexpansionresultinincreasedexports';
        const businessexpansionresultineconomicempowerment = 'businessexpansionresultineconomicempowerment';
        const businessexpansionresultinsustainabledev = 'businessexpansionresultinsustainabledev';
        const businessexpansionresultinsolveenvchallenges = 'businessexpansionresultinsolveenvchallenges';
        const productserviceexpansiontype = 'productserviceexpansiontype';
        // Working capital types
        const workingcapitaltype = 'workingcapitaltype';
        const cashforaninvoiceamount = 'cashforaninvoiceamount';
        const cashforinvoicecustomer = 'cashforinvoicecustomer';
        const customeragreed = 'customeragreed';
        const hasposdevice = 'hasposdevice';
        const regularmonthlyincome = 'regularmonthlyincome';
        const monthlyincomeincomevalue = 'monthlyincomeincomevalue';
        const cardmachinepaymenttypes = 'cardmachinepaymenttypes';
        const moneyforcontractvalue = 'moneyforcontractvalue';
        const moneyforcontractcustomer = 'moneyforcontractcustomer';
        const moneyforcontractcompanyexperience = 'moneyforcontractcompanyexperience';
        const moneyfortendervalue = 'moneyfortendervalue';
        const moneyfortendercustomer = 'moneyfortendercustomer';
        const moneyfortendercompanyexperience = 'moneyfortendercompanyexperience';
        const purchaseordervalue = 'purchaseordervalue';
        const purchaseordercustomer = 'purchaseordercustomer';
        const purchaseordercustomerexperience = 'purchaseordercustomerexperience';
        // Framchise acquisition types
        const franchiseacquisitiontype = 'franchiseacquisitiontype';
        const buyingafranchisefranchiseaccredited = 'buyingafranchisefranchiseaccredited';
        const preapprovedbyfranchisor = 'preapprovedbyfranchisor';
        const beepartnerfranchiseaccredited = 'beepartnerfranchiseaccredited';

        const industrySector = 'industry-sector';
        const industrySubSector = 'industry-sub-sector';

        const fundingtobuyanexistingbusinesstype = 'fundingtobuyanexistingbusinesstype';
        const businesslocatedinruralarea = 'businesslocatedinruralarea';
        const shareholdinggreaterthanperc = 'shareholdinggreaterthanperc';
        // Research innovation funding types
        const researchinnovationfundingtype = 'researchinnovationfundingtype';
        const commresstudentstatus = 'commresstudentstatus';
        const commreswillincexports = 'commreswillincexports';
        const commresresultinjobcreation = 'commresresultinjobcreation';
        const commresintroinnov = 'commresintroinnov';
        const commresindustries = 'commresindustries';
        const researchtakingplaceinuniversity = 'researchtakingplaceinuniversity';
        const researchfieldofresearchtype = 'researchfieldofresearchtype';
        // Other funding types
        const otherfinancetype = 'otherfinancetype';
        const willworkgenerate50newjobs = 'willworkgenerate50newjobs';
        const doyouhavecontractsforbps = 'doyouhavecontractsforbps';
        const will80percofjobsbeforyouth = 'will80percofjobsbeforyouth';
        const otherfinanceexportindustry = 'otherfinanceexportindustry';
        const exportcountry = 'exportcountry';
        const needingtoconductintmarketresearch = 'needingtoconductintmarketresearch';
        const haveconfirmedorders = 'haveconfirmedorders';
        const otherfinanceimportindustry = 'otherfinanceimportindustry';
        const importcountry = 'importcountry';
        const havesignedcontracts = 'havesignedcontracts';
        const workinruralareas = 'workinruralareas';
        const resultinemploymentsavejobs = 'resultinemploymentsavejobs';
        const workwithpeoplewithdisabilities = 'workwithpeoplewithdisabilities';
        const willprojectimprovehealthcare = 'willprojectimprovehealthcare';
        const willgenerateincomeinimpoverishedareas = 'willgenerateincomeinimpoverishedareas';
        const willgenerateincreasedexportvalue = 'willgenerateincreasedexportvalue';

        // Funder Essentials ( _StepFundingEssentials.cshtml )
        const doyouknowyourpersonalcreditscore = 'doyouknowyourpersonalcreditscore';
        const wanttouploadbusbankstatements = 'wanttouploadbusbankstatements';

        const BusinessAccountBank = {
            NoBankAccount: '5c86148eb069b41688f61c8f'
        };

        const BusinessType = {
            Loan: '60a65f60b71eded66202ef4c',
            CreditCard: '60a65f059d7ed8e9f7fce6df',
            CurrentAccount: '60a65eb4c8406fdf0f77612e',
            Investment: '60a65edcec1e15cb3033d4c2',
            Overdraft: '60a65f2f3469b5545d896913',
            RevolvingCredit: '60a65f3c58408ebc1778fd36',
            SavingsAccount: '60a65ec322522ac7002797cd',
            VehicleFinance: '60a65ef11bf07739f9de8a54',
            NoneOfTheAbove: '5c86148eb069b41688f61c8f'
        };

        const PersonalAccountBank = {
            NoBankAccount: '5c86148eb069b41688f61c8f'
        };

        let _application = {
            id: null,
            mc: null
        };

        let _industrySectorData = null;
        let _industrySectorKey = null;
        let _controls = {};

        let _controlMap = new Map();

        function initControls() {

            // FinancialInfo ( _StepIncomeProfitability.cshtml )
            _controlMap.set(annualturnover, { control: app.control.select(annualturnover), parentId:'' });
            _controlMap.set(bank, { control: app.control.select(bank), parentId: '' });
            _controlMap.set(bankaccservices, { control: app.control.checkbox(bankaccservices), parentId: '' });
            _controlMap.set(businessloans, { control: app.control.radio(businessloans), parentId: '' });
            _controlMap.set(whoistheloanfrom, { control: app.control.select(whoistheloanfrom), parentId: '' });
            _controlMap.set(businesstxpersonalacc, { control: app.control.radio(businesstxpersonalacc), parentId: '' });
            _controlMap.set(personalbank, { control: app.control.select(personalbank), parentId: '' });
            _controlMap.set(haselecaccsystems, { control: app.control.radio(haselecaccsystems), parentId: '' });
            _controlMap.set(elecaccsystems, { control: app.control.select(elecaccsystems), parentId: '' });
            _controlMap.set(elecaccsystemother, { control: app.control.input(elecaccsystemother), parentId: '' });
            _controlMap.set(haspayroll, { control: app.control.radio(haspayroll), parentId: '' });
            _controlMap.set(payrollsystems, { control: app.control.select(payrollsystems), parentId: '' });
            _controlMap.set(payrollsystemother, { control: app.control.input(payrollsystemother), parentId: '' });
            _controlMap.set(hasinvestedownmoney, { control: app.control.radio(hasinvestedownmoney), parentId: '' });
            _controlMap.set(businessisprofitable, { control: app.control.radio(businessisprofitable), parentId: '' });
            _controlMap.set(businesshascolateral, { control: app.control.radio(businesshascolateral), parentId: '' });

            // FundingRequirement ( _FinanceForSelector.cshtml )
            _controlMap.set(financefor, { control: app.control.radio(financefor), parentId: '59c2c6a37c83b736d463c250' });
            _controlMap.set(loanamount, { control: app.control.input(loanamount, 'loanamount'), parentId: '' });
            _controlMap.set(assetfinancetype, { control: app.control.select(assetfinancetype), parentId: '59c35d64463361150873b641' });
            _controlMap.set(buyingbusinesspropertyvalue, { control: app.control.input(buyingbusinesspropertyvalue), parentId: '' });
            _controlMap.set(buyingbusinesspropertytype, { control: app.control.select(buyingbusinesspropertytype), parentId: '5a6f0a36cb0d114734ecf1fe' });
            _controlMap.set(propertydevelopmenttype, { control: app.control.select(propertydevelopmenttype), parentId: '5a6f0afacb0d114734ecf1ff' });
            _controlMap.set(shopfittingpropbonded, { control: app.control.radio(shopfittingpropbonded), parentId: '' });
            _controlMap.set(shopfittingpropertyvalue, { control: app.control.input(shopfittingpropertyvalue), parentId: '' });
            _controlMap.set(shopfittingpropertytype, { control: app.control.select(shopfittingpropertytype), parentId: '5a6f0a36cb0d114734ecf1fe' });
            // Growth finance types
            _controlMap.set(growthfinancetype, { control: app.control.select(growthfinancetype), parentId: '59c5d92b5eac2311202772f5' });
            _controlMap.set(willingtosellshares, { control: app.control.radio(willingtosellshares), parentId: '' });
            _controlMap.set(largepotentialmarket, { control: app.control.radio(largepotentialmarket), parentId: '' });
            _controlMap.set(customersbuying, { control: app.control.radio(customersbuying), parentId: '' });
            _controlMap.set(businessexpansioncompetitiveadv, { control: app.control.select(businessexpansioncompetitiveadv), parentId: '59ec85401b37792024771d41' });
            _controlMap.set(businessexpansionresultinincreasedemployees, { control: app.control.radio(businessexpansionresultinincreasedemployees), parentId: '' });
            _controlMap.set(businessexpansionresultinincreasedprofitability, { control: app.control.radio(businessexpansionresultinincreasedprofitability), parentId: '' });
            _controlMap.set(businessexpansionresultinincreasedexports, { control: app.control.radio(businessexpansionresultinincreasedexports), parentId: '' });
            _controlMap.set(businessexpansionresultineconomicempowerment, { control: app.control.radio(businessexpansionresultineconomicempowerment), parentId: '' });
            _controlMap.set(businessexpansionresultinsustainabledev, { control: app.control.radio(businessexpansionresultinsustainabledev), parentId: '' });
            _controlMap.set(businessexpansionresultinsolveenvchallenges, { control: app.control.radio(businessexpansionresultinsolveenvchallenges), parentId: '' });
            _controlMap.set(productserviceexpansiontype, { control: app.control.select(productserviceexpansiontype), parentId: '5a7a7afe646a451744bca3b4' });
            // Working capital types
            _controlMap.set(workingcapitaltype, { control: app.control.select(workingcapitaltype), parentId: '59c2c6b37c83b736d463c251' });
            _controlMap.set(cashforaninvoiceamount, { control: app.control.input(cashforaninvoiceamount), parentId: '' });
            _controlMap.set(cashforinvoicecustomer, { control: app.control.select(cashforinvoicecustomer), parentId: '59db18348964a744e4ad0aa7' });
            _controlMap.set(customeragreed, { control: app.control.radio(customeragreed), parentId: '' });
            _controlMap.set(hasposdevice, { control: app.control.radio(hasposdevice), parentId: '' });
            _controlMap.set(regularmonthlyincome, { control: app.control.radio(regularmonthlyincome), parentId: '' });
            _controlMap.set(monthlyincomeincomevalue, { control: app.control.input(monthlyincomeincomevalue), parentId: '' });
            _controlMap.set(cardmachinepaymenttypes, { control: app.control.checkbox(cardmachinepaymenttypes), parentId: '59d370517112ea2ef072eec7' });
            _controlMap.set(moneyforcontractvalue, { control: app.control.input(moneyforcontractvalue), parentId: '' });
            _controlMap.set(moneyforcontractcustomer, { control: app.control.select(moneyforcontractcustomer), parentId: '59db18348964a744e4ad0aa7' });
            _controlMap.set(moneyforcontractcompanyexperience, { control: app.control.radio(moneyforcontractcompanyexperience), parentId: '' });
            _controlMap.set(moneyfortendervalue, { control: app.control.input(moneyfortendervalue), parentId: '' });
            _controlMap.set(moneyfortendercustomer, { control: app.control.select(moneyfortendercustomer), parentId: '59db18348964a744e4ad0aa7' });
            _controlMap.set(moneyfortendercompanyexperience, { control: app.control.radio(moneyfortendercompanyexperience), parentId: '' });
            _controlMap.set(purchaseordervalue, { control: app.control.input(purchaseordervalue), parentId: '' });
            _controlMap.set(purchaseordercustomer, { control: app.control.select(purchaseordercustomer), parentId: '59db18348964a744e4ad0aa7' });
            _controlMap.set(purchaseordercustomerexperience, { control: app.control.radio(purchaseordercustomerexperience), parentId: '' });
            // Framchise acquisition types
            _controlMap.set(franchiseacquisitiontype, { control: app.control.select(franchiseacquisitiontype), parentId: '59c2c6f77c83b736d463c254' });
            _controlMap.set(buyingafranchisefranchiseaccredited, { control: app.control.radio(buyingafranchisefranchiseaccredited), parentId: '' });
            _controlMap.set(preapprovedbyfranchisor, { control: app.control.radio(preapprovedbyfranchisor), parentId: '' });
            _controlMap.set(beepartnerfranchiseaccredited, { control: app.control.radio(beepartnerfranchiseaccredited), parentId: '' });
            _controlMap.set(industrySector, { control: app.control.select(industrySector), parentId: '' });
            _controlMap.set(industrySubSector, { control: app.control.select(industrySubSector), parentId: '' });
            _controlMap.set(fundingtobuyanexistingbusinesstype, { control: app.control.select(fundingtobuyanexistingbusinesstype), parentId: '59d2ed3839b41c2b749a03d9' });
            _controlMap.set(businesslocatedinruralarea, { control: app.control.radio(businesslocatedinruralarea), parentId: '' });
            _controlMap.set(shareholdinggreaterthanperc, { control: app.control.radio(shareholdinggreaterthanperc), parentId: '' });
            // Research innovation funding types
            _controlMap.set(researchinnovationfundingtype, { control: app.control.select(researchinnovationfundingtype), parentId: '59c5d95c5eac2311202772f6' });
            _controlMap.set(commresstudentstatus, { control: app.control.radio(commresstudentstatus), parentId: '' });
            _controlMap.set(commreswillincexports, { control: app.control.radio(commreswillincexports), parentId: '' });
            _controlMap.set(commresresultinjobcreation, { control: app.control.radio(commresresultinjobcreation), parentId: '' });
            _controlMap.set(commresintroinnov, { control: app.control.radio(commresintroinnov), parentId: '' });
            _controlMap.set(commresindustries, { control: app.control.selectmulti(commresindustries), parentId: '5a8288d5c053780e8c1eb731' });
            _controlMap.set(researchtakingplaceinuniversity, { control: app.control.radio(researchtakingplaceinuniversity), parentId: '' });
            _controlMap.set(researchfieldofresearchtype, { control: app.control.select(researchfieldofresearchtype), parentId: '5b1fa3a5b958c008605883e1' });
            // Other funding types
            _controlMap.set(otherfinancetype, { control: app.control.select(otherfinancetype), parentId: '59c5d96b5eac2311202772f7' });
            _controlMap.set(willworkgenerate50newjobs, { control: app.control.radio(willworkgenerate50newjobs), parentId: '' });
            _controlMap.set(doyouhavecontractsforbps, { control: app.control.radio(doyouhavecontractsforbps), parentId: '' });
            _controlMap.set(will80percofjobsbeforyouth, { control: app.control.radio(will80percofjobsbeforyouth), parentId: '' });
            _controlMap.set(otherfinanceexportindustry, { control: app.control.selectmulti(otherfinanceexportindustry), parentId: '5a8288d5c053780e8c1eb731' });
            _controlMap.set(exportcountry, { control: app.control.select(exportcountry), parentId: '' });
            _controlMap.set(needingtoconductintmarketresearch, { control: app.control.radio(needingtoconductintmarketresearch), parentId: '' });
            _controlMap.set(haveconfirmedorders, { control: app.control.radio(haveconfirmedorders), parentId: '' });
            _controlMap.set(otherfinanceimportindustry, { control: app.control.selectmulti(otherfinanceimportindustry), parentId: '5a8288d5c053780e8c1eb731' });
            _controlMap.set(importcountry, { control: app.control.select(importcountry), parentId: '' });
            _controlMap.set(havesignedcontracts, { control: app.control.radio(havesignedcontracts), parentId: '' });
            _controlMap.set(workinruralareas, { control: app.control.radio(workinruralareas), parentId: '' });
            _controlMap.set(resultinemploymentsavejobs, { control: app.control.radio(resultinemploymentsavejobs), parentId: '' });
            _controlMap.set(workwithpeoplewithdisabilities, { control: app.control.radio(workwithpeoplewithdisabilities), parentId: '' });
            _controlMap.set(willprojectimprovehealthcare, { control: app.control.radio(willprojectimprovehealthcare), parentId: '' });
            _controlMap.set(willgenerateincomeinimpoverishedareas, { control: app.control.radio(willgenerateincomeinimpoverishedareas), parentId: '' });
            _controlMap.set(willgenerateincreasedexportvalue, { control: app.control.radio(willgenerateincreasedexportvalue), parentId: '' });

            // Funder Essentials ( _StepFundingEssentials.cshtml )
            _controlMap.set(doyouknowyourpersonalcreditscore, { control: app.control.radio(doyouknowyourpersonalcreditscore), parentId: '' });
            _controlMap.set(wanttouploadbusbankstatements, { control: app.control.radio(wanttouploadbusbankstatements), parentId: '' });

            // TODO: Move this logic to main js file.
            let obj1 = _controlMap.get(bankaccservices);
            obj1.control.click(function (arg, name, value, checked) {
                if (value == BusinessType.NoneOfTheAbove) {
                    if (checked == true) {
                        obj1.control.valAll(false);
                        obj1.control.val(BusinessType.NoneOfTheAbove, true);
                    } else {
                    }
                } else {
                    obj1.control.val(BusinessType.NoneOfTheAbove, false);
                }
            });

            let obj2 = _controlMap.get(doyouknowyourpersonalcreditscore);
            obj2.control.click(function (arg, name, prev, next) {
                if (next == 'Yes') {
                    app.consumerCredit.autoValidateId(function (result) {
                        if (result.result == false) {
                            $('#personal-credit-report-link').hide('fast');
                            $('#whats-your-personal-credit-score').show("fast");
                        }
                    });
                }
            });

            _controlMap.forEach(function (val, key) {
                _controls[key] = val.control;
            });

            _controls.loanamount.val('');
            _controls.loanamount.format(20);
        }

        function populate(matchCriteria) {

            matchCriteria.forEach(function (obj, idx) {
                let name = obj.name;
                let o = _controlMap.get(name);
                if (o != null) {
                    let control = o.control;
                    let value = obj.value;

                    if (control.type == 'selectmulti') {
                        let x = 0;
                    }

                    if (control.type == 'checkbox') {
                        control.val(value, true);
                    } else {
                        control.val(value);
                    }
                    // TODO: Do this better!!!
                    if (name == industrySubSector) {
                        _industrySectorKey = obj.value;
                        control.user(_industrySectorKey);
                    }
                }
            });
        }

        // Key things funders need ( _StepFundingEssentials.cshtml )
        function showFundingEssentialsControls(cb) {

            function showCreditScoreControl() {
                _controls.doyouknowyourpersonalcreditscore.show(true);
                cb(_controls.doyouknowyourpersonalcreditscore);
            }

            function showBankStatementsControl() {
                _controls.wanttouploadbusbankstatements.show(true);
                cb(_controls.wanttouploadbusbankstatements);
            }

            function showSeeksFundingControl() {

            }

            showCreditScoreControl();
            showBankStatementsControl();
        }

        // FinancialInfo ( _StepIncomeProfitability.cshtml )
        function showFinancialInfoControls(cb) {

            function showAnualTurnoverControl() {
                _controls.annualturnover.show(true);
                cb(_controls.annualturnover);
            }

            function showBusinessBankAccountControl() {
                _controls.bank.show(true);
                cb(_controls.bank);

                let businessBankAccount = _controls.bank.val();
                if (businessBankAccount != BusinessAccountBank.NoBankAccount && businessBankAccount != null) {
                    // Show the div for check boxes.
                    $('#bank-account-services-type').show();
                    // bankaccservices
                    cb(_controls.bankaccservices);
                }
            }

            function showHasBusinessLoansControl() {
                _controls.businessloans.show(true);
                cb(_controls.businessloans);

                let haveBusinessLoans = _controls.businessloans.val();
                if (haveBusinessLoans == 'Yes') {
                    $('#whoistheloanfrom').show();
                    // whoistheloanfrom
                    _controls.whoistheloanfrom.show(true);
                    cb(_controls.whoistheloanfrom);
                }
            }

            function showAnyBusinessTransactionsThroughPersonalAccountControl() {
                _controls.businesstxpersonalacc.show(true);
                cb(_controls.businesstxpersonalacc);

                let anyBusinessTransactionsThroughPersonalAccount = _controls.businesstxpersonalacc.val();
                if (anyBusinessTransactionsThroughPersonalAccount == 'Yes') {
                    $('#personalbankacc').show();
                    // personalbank
                    _controls.personalbank.show(true);
                    cb(_controls.personalbank);
                }
            }

            function showHasElectonicAccountingSystemControl() {
                _controls.haselecaccsystems.show(true);
                cb(_controls.haselecaccsystems);
                let hasElectonicAccountingSystem = _controls.haselecaccsystems.val();

                if (hasElectonicAccountingSystem == 'Yes') {

                    function showWhichElectonicAccountingSystemControl() {
                        _controls.elecaccsystems.show(true);
                        cb(_controls.elecaccsystems);

                        let whichElectonicAccountingSystem = _controls.elecaccsystems.val();
                        // TODO: Try and find a way to NOT hard-code 'other'!!!
                        if (whichElectonicAccountingSystem == 'other') {
                            $('#elec-acc-systems-other').show();
                            // elecaccsystemother
                            _controls.elecaccsystemother.show(true);
                            cb(_controls.elecaccsystemother);
                        }
                    }
                    $('#elec-acc-systems').show();
                    // elecaccsystems
                    showWhichElectonicAccountingSystemControl();
                }
            }

            function showHasAPayrollSystemForStaffControl() {
                _controls.haspayroll.show(true);
                cb(_controls.haspayroll);

                let hasAPayrollSystemForStaff = _controls.haspayroll.val();
                if (hasAPayrollSystemForStaff == 'Yes') {

                    function showWhichPayrollSystemForStaffControl() {
                        _controls.payrollsystems.show(true);
                        cb(_controls.payrollsystems);

                        let whichPayrollSystemForStaff = _controls.payrollsystems.val();
                        if (whichPayrollSystemForStaff == 'other') {
                            $('#payroll-systems-other').show();
                            // payrollsystemother
                            _controls.payrollsystemother.show(true);
                            cb(_controls.payrollsystemother);

                        }
                    }
                    $('#payroll-systems').show();
                    // payrollsystems
                    showWhichPayrollSystemForStaffControl();
                }
            }

            function showInvestedMoneyInOwnBusinessControl() {
                _controls.hasinvestedownmoney.show(true);
                cb(_controls.hasinvestedownmoney);
            }

            function showBusinessMakeProfitOverLast6MonthsControl() {
                _controls.businessisprofitable.show(true);
                cb(_controls.businessisprofitable);
            }

            function showDoYouHaveCollateralControl() {
                _controls.businesshascolateral.show(true);
                cb(_controls.businesshascolateral);
            }

            showAnualTurnoverControl();
            showBusinessBankAccountControl();
            showHasBusinessLoansControl();
            showAnyBusinessTransactionsThroughPersonalAccountControl();
            showHasElectonicAccountingSystemControl();
            showHasAPayrollSystemForStaffControl();
            showInvestedMoneyInOwnBusinessControl();
            showBusinessMakeProfitOverLast6MonthsControl();
            showDoYouHaveCollateralControl();
        }

        // FundingRequirement ( _FinanceForSelector.cshtml )
        function showFundingRequirementControls(cb) {

            function showAssetFinanceControls() {

                function showBuyingBusinessPropertyControls() {
                    // div: asset-finance-buying-business-property
                    $('#asset-finance-buying-business-property').show();
                    // input: buyingbusinesspropertyvalue
                    _controls.buyingbusinesspropertyvalue.show(true);
                    cb(_controls.buyingbusinesspropertyvalue);

                    // select: buyingbusinesspropertytype
                    _controls.buyingbusinesspropertytype.show(true);
                    cb(_controls.buyingbusinesspropertytype);
                }

                function showBuyingEquipmentControls() {
                    // Leaf
                }

                function showBuyingMachineryControls() {
                    // Leaf
                }

                function showBuyingVehecleOrFleetFinanceControls() {
                    // Leaf
                }

                function showPropertyDevelopementControls() {
                    // div: asset-finance-property-development
                    $('#asset-finance-property-development').show();
                    // select: propertydevelopmenttype
                    _controls.propertydevelopmenttype.show(true);
                    cb(_controls.propertydevelopmenttype);
                }

                function showPropertyRefinancingControls() {
                    // Leaf
                }

                function showShopfittingRennovationsControls() {
                    // div: asset-finance-shopfitting-renovations
                    $('#asset-finance-shopfitting-renovations').show();
                    // radio: shopfittingpropbonded
                    _controls.shopfittingpropbonded.show(true);
                    cb(_controls.shopfittingpropbonded);
                    // input: shopfittingpropertyvalue
                    _controls.shopfittingpropertyvalue.show(true);
                    cb(_controls.shopfittingpropertyvalue);
                    // select: shopfittingpropertytype
                    _controls.shopfittingpropertytype.show(true);
                    cb(_controls.shopfittingpropertytype);
                }

                const buyingBusinessProperty_Value = '59d2694720070a604097b047';
                const buyingEquipment_Value = '59c35d86463361150873b642';
                const buyingMachinery_Value = '59c3605c463361150873b643';
                const buyingVehecleOrFleetFinance_Value = '59d2692520070a604097b045';
                const propertyDevelopment_Value = '59d2695420070a604097b048';
                const propertyRefinancing_Value = '59d2696020070a604097b049';
                const shopfittingRenovations_Value = '59d2693920070a604097b046';

                // assetfinancetype
                switch (_controls.assetfinancetype.val()) {
                    // Buying business property
                    case buyingBusinessProperty_Value:
                        showBuyingBusinessPropertyControls();
                        break;
                    // Buying equipment
                    case buyingEquipment_Value:
                        showBuyingEquipmentControls();
                        break;
                    // Buying machinery
                    case buyingMachinery_Value:
                        showBuyingMachineryControls();
                        break;
                    // Buying vehecle or fleet finance
                    case buyingVehecleOrFleetFinance_Value:
                        showBuyingVehecleOrFleetFinanceControls();
                        break;
                    // Property development
                    case propertyDevelopment_Value:
                        showPropertyDevelopementControls();
                        break;
                    // Property refinancing
                    case propertyRefinancing_Value:
                        showPropertyRefinancingControls();
                        break;
                    // Shopfitting/renovations
                    case shopfittingRenovations_Value:
                        showShopfittingRennovationsControls();
                        break;
                }
                // div: asset-finance-type
                $('#asset-finance-type').show();
                // select: assetfinancetype
                _controls.assetfinancetype.show(true);
                cb(_controls.assetfinancetype);
            }

            function showWorkingCapitalControls() {

                function showCashAdvanceForAnInvoiceControls() {

                    function showCustomerAgreedWorkIsComplete() {
                        // div: customernotagreed
                        $('#customernotagreed').show();// LABEL?
                    }
                    // div: working-capital-cash-for-invoice
                    $('#working-capital-cash-for-invoice').show();

                    // input: cashforaninvoiceamount
                    _controls.cashforaninvoiceamount.show(true);
                    cb(_controls.cashforaninvoiceamount);

                    // select: cashforinvoicecustomer
                    _controls.cashforinvoicecustomer.show(true);
                    cb(_controls.cashforinvoicecustomer);

                    // radio: customeragreed
                    _controls.customeragreed.show(true);
                    cb(_controls.customeragreed);

                    switch (_controls.customeragreed.val()) {
                        case 'No':
                            showCustomerAgreedWorkIsComplete();
                            break;
                    }
                }

                function showCashFlowAssistanceControls() {
                    // div: working-capital-cash-flow-assistance
                    $('#working-capital-cash-flow-assistance').show();
                    // radio: hasposdevice
                    _controls.hasposdevice.show(true);
                    cb(_controls.hasposdevice);
                }

                function showCashForRetailersWithCardMachineControls() {

                    function showMonthlyIncomeValue() {
                        // div: retailers-with-card-machine-monthly-income
                        $('#retailers-with-card-machine-monthly-income').show();
                        // input: monthlyincomeincomevalue
                        _controls.monthlyincomeincomevalue.show(true);
                        cb(_controls.monthlyincomeincomevalue);
                    }

                    // div: working-capital-cash-for-retailers-with-card-machine
                    $('#working-capital-cash-for-retailers-with-card-machine').show();

                    // radio: regularmonthlyincome ( switch )
                    _controls.regularmonthlyincome.show(true);
                    cb(_controls.regularmonthlyincome);

                    switch (_controls.regularmonthlyincome.val()) {
                        case 'Yes':
                            showMonthlyIncomeValue();
                            break;
                    }

                    // checkbox: cardmachinepaymenttypes
                    _controls.cardmachinepaymenttypes.show(true);
                    cb(_controls.cardmachinepaymenttypes);
                }

                function showMoneyToBuyStockControls() {
                    // Leaf
                }

                function showMoneyToHelpWithContractControls() {
                    // div: working-capital-money-for-contract
                    $('#working-capital-money-for-contract').show();
                    // input: moneyforcontractvalue
                    _controls.moneyforcontractvalue.show(true);
                    cb(_controls.moneyforcontractvalue);
                    // select: moneyforcontractcustomer
                    _controls.moneyforcontractcustomer.show(true);
                    cb(_controls.moneyforcontractcustomer);
                    // radio: moneyforcontractcompanyexperience
                    _controls.moneyforcontractcompanyexperience.show(true);
                    cb(_controls.moneyforcontractcompanyexperience);
                }

                function showMoneyToHelpWithTenderControls() {
                    // div: working-capital-money-for-tender
                    $('#working-capital-money-for-tender').show();
                    // input: moneyfortendervalue
                    _controls.moneyfortendervalue.show(true);
                    cb(_controls.moneyfortendervalue);
                    // select: moneyfortendercustomer
                    _controls.moneyfortendercustomer.show(true);
                    cb(_controls.moneyfortendercustomer);
                    // radio: moneyfortendercompanyexperience
                    _controls.moneyfortendercompanyexperience.show(true);//??????????????????
                    cb(_controls.moneyfortendercompanyexperience);
                }

                function showPurchaseOrderFundingControls() {
                    // div: working-capital-puchase-order-funding
                    $('#working-capital-puchase-order-funding').show();
                    // input: purchaseordervalue
                    _controls.purchaseordervalue.show(true);
                    cb(_controls.purchaseordervalue);
                    // select: purchaseordercustomer
                    _controls.purchaseordercustomer.show(true);
                    cb(_controls.purchaseordercustomer);
                    // radio: purchaseordercustomerexperience
                    _controls.purchaseordercustomerexperience.show(true);
                    cb(_controls.purchaseordercustomerexperience);
                }

                const cashAdvanceForAnInvoice_Value = '59cc9d26132f4c40c446a4f7';
                const cashFlowAssistance_Value = '59cc9d36132f4c40c446a4f8';
                const cashForRetailersWithACardMachine_Value = '5acb467062ba593724e0a78a';
                const moneyToBuyStock_Value = '59cca85e30e9df02c82d0793';
                const moneyToHelpWithAContract_Value = '59cca8a430e9df02c82d0795';
                const moneyToHelpWithATender_Value = '59cca89030e9df02c82d0794';
                const purchaseOrderFunding_Value = '5b213996b958c008605883e8';

                switch (_controls.workingcapitaltype.val()) {
                    // Cash advance for an invoice
                    case cashAdvanceForAnInvoice_Value:
                        showCashAdvanceForAnInvoiceControls();
                        break;
                    // Cash flow assistance
                    case cashFlowAssistance_Value:
                        showCashFlowAssistanceControls();
                        break;
                    // Cash for retailers with a card machine
                    case cashForRetailersWithACardMachine_Value:
                        showCashForRetailersWithCardMachineControls();
                        break;
                    // Money to buy stock
                    case moneyToBuyStock_Value:
                        showMoneyToBuyStockControls();
                        break;
                    // Money to help with a contract
                    case moneyToHelpWithAContract_Value:
                        showMoneyToHelpWithContractControls();
                        break;
                    // Money to help with a tender
                    case moneyToHelpWithATender_Value:
                        showMoneyToHelpWithTenderControls();
                        break;
                    // Purchase order funding
                    case purchaseOrderFunding_Value:
                        showPurchaseOrderFundingControls();
                        break;
                }
                // div: working-capital-type
                $('#working-capital-type').show();
                // select: workingcapitaltype
                _controls.workingcapitaltype.show(true);
                cb(_controls.workingcapitaltype);
            }

            function showGrowthFinanceControls() {

                function showBusinessExpansionControls() {

                    function showWillingToSellSharesControls() {
                        // div: business-expansion-willing-to-sell-shares
                        $('#business-expansion-willing-to-sell-shares').show();
                        // radio: largepotentialmarket
                        _controls.largepotentialmarket.show(true);
                        cb(_controls.largepotentialmarket);
                        // radio: customersbuying
                        _controls.customersbuying.show(true);
                        cb(_controls.customersbuying);
                    }

                    // div: growth-finance-business-expansion
                    $('#growth-finance-business-expansion').show();
                    // radio: willingtosellshares ( drill down )
                    _controls.willingtosellshares.show(true);
                    cb(_controls.willingtosellshares);
                    switch (_controls.willingtosellshares.val()) {
                        case 'Yes':
                            showWillingToSellSharesControls();
                            break;
                    }

                    // select: businessexpansioncompetitiveadv
                    _controls.businessexpansioncompetitiveadv.show(true);
                    cb(_controls.businessexpansioncompetitiveadv);

                    // radio: businessexpansionresultinincreasedemployees
                    _controls.businessexpansionresultinincreasedemployees.show(true);
                    cb(_controls.businessexpansionresultinincreasedemployees);
                    // radio: businessexpansionresultinincreasedprofitability
                    _controls.businessexpansionresultinincreasedprofitability.show(true);
                    cb(_controls.businessexpansionresultinincreasedprofitability);
                    // radio: businessexpansionresultinincreasedexports
                    _controls.businessexpansionresultinincreasedexports.show(true);
                    cb(_controls.businessexpansionresultinincreasedexports);
                    // radio: businessexpansionresultineconomicempowerment
                    _controls.businessexpansionresultineconomicempowerment.show(true);
                    cb(_controls.businessexpansionresultineconomicempowerment);
                    // radio: businessexpansionresultinsustainabledev
                    _controls.businessexpansionresultinsustainabledev.show(true);
                    cb(_controls.businessexpansionresultinsustainabledev);
                    // radio: businessexpansionresultinsolveenvchallenges
                    _controls.businessexpansionresultinsolveenvchallenges.show(true);
                    cb(_controls.businessexpansionresultinsolveenvchallenges);
                }

                function showProductServiceExpansionControls() {
                    // div: growth-finance-product-service-expansion
                    $('#growth-finance-product-service-expansion').show();
                    // select: productserviceexpansiontype
                    _controls.productserviceexpansiontype.show(true);
                    cb(_controls.productserviceexpansiontype);
                }

                function showRefinancingExistingDebtControls() {
                    // End of the line. Leaf node.
                }

                const businessExpansion_Value = '59d269bd20070a604097b04a';
                const productServiceExpansion_Value = '59d269c920070a604097b04b';
                const refinancingExistingDebt_Value = '59d269d620070a604097b04c';

                switch (_controls.growthfinancetype.val()) {
                    // Business expansion
                    case businessExpansion_Value:
                        showBusinessExpansionControls();
                        break;
                    // Product/service expansion
                    case productServiceExpansion_Value:
                        showProductServiceExpansionControls();
                        break;
                    // Refinancing existing debt
                    case refinancingExistingDebt_Value:
                        showRefinancingExistingDebtControls();
                        break;
                }
                // div: growth-finance-type
                $('#growth-finance-type').show(true);
                // select: growthfinancetype
                _controls.growthfinancetype.show(true);
                cb(_controls.growthfinancetype);
            }

            function showFranchiseAquisitionControls() {

                function showBuyingFranchiseControls() {
                    // div: franchise-acquisition-buying-a-franchise
                    $('#franchise-acquisition-buying-a-franchise').show();
                    // radio: buyingafranchisefranchiseaccredited
                    _controls.buyingafranchisefranchiseaccredited.show(true);
                    cb(_controls.buyingafranchisefranchiseaccredited);
                    // radio: preapprovedbyfranchisor
                    _controls.buyingafranchisefranchiseaccredited.show(true);
                    cb(_controls.buyingafranchisefranchiseaccredited);
                }

                function showFundingToBeingOnBEEPartenerControls() {
                    // div: franchise-acquisition-funding-to-bring-on-a-bee-partner
                    $('#franchise-acquisition-funding-to-bring-on-a-bee-partner').show();
                    // radio: beepartnerfranchiseaccredited
                    _controls.beepartnerfranchiseaccredited.show(true);
                    cb(_controls.beepartnerfranchiseaccredited);
                }

                function showFundingToBuyExistingBusinessControls() {
                    $('#franchise-acquisition-funding-to-buy-an-existing-business').show();

                    let indexes = app.common.industrySector.getIndexesFromKey(_industrySectorKey);
                    $('#id-company-profile-category-select').val(indexes.industrySectorIndex);
                    app.common.industrySector.populateIndustrySubSectorFromIndex('id-company-profile-sub-category-select', indexes.industrySectorIndex);
                    $('#id-company-profile-industry-sub-sector-div').show();
                    $('#id-company-profile-sub-category-select').val(indexes.industrySubSectorIndex);

                    _controls['industry-sector'].show(true);
                    _controls['industry-sub-sector'].show(true);
                    cb(_controls['industry-sub-sector']);

                    // select: fundingtobuyanexistingbusinesstype
                    _controls.fundingtobuyanexistingbusinesstype.show(true);
                    cb(_controls.fundingtobuyanexistingbusinesstype);
                    // radio: businesslocatedinruralarea
                    _controls.businesslocatedinruralarea.show(true);
                    cb(_controls.businesslocatedinruralarea);
                }

                function showPartenerOrManagementBuyoutControls() {
                    // div: franchise-acquisition-funding-partner-or-management-buyout
                    $('#franchise-acquisition-funding-partner-or-management-buyout').show();
                    // radio: shareholdinggreaterthanperc
                    _controls.shareholdinggreaterthanperc.show(true);
                    cb(_controls.shareholdinggreaterthanperc);
                }

                function showStartingYourOwnFranchiseControls() {
                    // Leaf node.
                }

                const buyingAFranchise_Value = '59c2c7087c83b736d463c255';
                const fundingToBringOnABEEPartner_Value = '59d26a3120070a604097b04f';
                const fundingToBuyAnExistingBusiness_Value = '59d26a1620070a604097b04d';
                const partnerOrManagementBuyout_Value = '59d26a2620070a604097b04e';
                const startingYourOwnFranchise_Value = '59c2c7197c83b736d463c256';

                //let o = _controlMap.get(franchiseacquisitiontype);
                switch (_controls.franchiseacquisitiontype.val()) {
                    // Buying a franchise
                    case buyingAFranchise_Value:
                        showBuyingFranchiseControls();
                        break;
                    // Funding to bring on a BEE Partner
                    case fundingToBringOnABEEPartner_Value:
                        showFundingToBeingOnBEEPartenerControls();
                        break;
                    // Funding to buy an existing business
                    case fundingToBuyAnExistingBusiness_Value:
                        showFundingToBuyExistingBusinessControls();
                        break;
                    // Partner or management buyout
                    case partnerOrManagementBuyout_Value:
                        showPartenerOrManagementBuyoutControls();
                        break;
                    // Starting your own franchise
                    case startingYourOwnFranchise_Value:
                        showStartingYourOwnFranchiseControls()
                        break;
                }
                // div: franchise-acquisition-partner-funding-type
                $('#franchise-acquisition-partner-funding-type').show();
                // select: franchiseacquisitiontype
                _controls.franchiseacquisitiontype.show(true);
                cb(_controls.franchiseacquisitiontype);
            }

            function showOtherBusinessControls() {

                function showBusinessProcessOutsourcingControls() {
                    // div: other-finance-business-process-outsourcing
                    $('#other-finance-business-process-outsourcing').show();
                    // radio: willworkgenerate50newjobs
                    _controls.willworkgenerate50newjobs.show(true);
                    cb(_controls.willworkgenerate50newjobs);
                    // radio: doyouhavecontractsforbps
                    _controls.doyouhavecontractsforbps.show(true);
                    cb(_controls.doyouhavecontractsforbps);
                    // radio: will80percofjobsbeforyouth
                    _controls.will80percofjobsbeforyouth.show(true);
                    cb(_controls.will80percofjobsbeforyouth);
                }

                function showExportFundingTradeFinanceControls() {
                    // div: other-finance-export-funding-trade-finance
                    $('#other-finance-export-funding-trade-finance').show();
                    // selectmulti: otherfinanceexportindustry
                    _controls.otherfinanceexportindustry.show(true);
                    cb(_controls.otherfinanceexportindustry);
                    // select: exportcountry
                    _controls.exportcountry.show(true);
                    cb(_controls.exportcountry);
                    // radio: needingtoconductintmarketresearch
                    _controls.needingtoconductintmarketresearch.show(true);
                    cb(_controls.needingtoconductintmarketresearch);
                    // radio: haveconfirmedorders
                    _controls.haveconfirmedorders.show(true);
                    cb(_controls.haveconfirmedorders);
                }

                function showFundingForArtistsAndEventsControls() {
                }

                function showImportFundingTradeFinanceControls() {
                    // div: other-finance-import-funding-trade-finance
                    $('#other-finance-import-funding-trade-finance').show();
                    // selectmulti: otherfinanceimportindustry
                    _controls.otherfinanceimportindustry.show(true);
                    cb(_controls.otherfinanceimportindustry);
                    // select: importcountry
                    _controls.importcountry.show(true);
                    cb(_controls.importcountry);
                    // radio: havesignedcontracts
                    _controls.havesignedcontracts.show(true);
                    cb(_controls.havesignedcontracts);
                }

                function showPropertyAlleviationAndRuralDevelopementControls() {
                    // div: other-finance-poverty-alleviation-and-rural-development
                    $('#other-finance-poverty-alleviation-and-rural-development').show();
                    // radio: workinruralareas
                    _controls.workinruralareas.show(true);
                    cb(_controls.workinruralareas);
                    // radio: resultinemploymentsavejobs
                    _controls.resultinemploymentsavejobs.show(true);
                    cb(_controls.resultinemploymentsavejobs);
                    // radio: workwithpeoplewithdisabilities
                    _controls.workwithpeoplewithdisabilities.show(true);
                    cb(_controls.workwithpeoplewithdisabilities);
                    // radio: willprojectimprovehealthcare
                    _controls.willprojectimprovehealthcare.show(true);
                    cb(_controls.willprojectimprovehealthcare);
                    // radio: willgenerateincomeinimpoverishedareas
                    _controls.willgenerateincomeinimpoverishedareas.show(true);
                    cb(_controls.willgenerateincomeinimpoverishedareas);
                    // radio: willgenerateincreasedexportvalue
                    _controls.willgenerateincreasedexportvalue.show(true);
                    cb(_controls.willgenerateincreasedexportvalue);
                }

                const businessProcessOutsourcing_Value = '59d26d8720070a604097b059';
                const exportFundingTradeFinance_Value = '59d26a6420070a604097b052';
                const fundingForArtistsAndEvents_Value = '59d26d4720070a604097b054';
                const importFundingTradeFinance_Value = '59d26d3120070a604097b053';
                const povertyAlleviationAndRuralDevelopment_Value = '59d26d6020070a604097b056';

                switch (_controls.otherfinancetype.val()) {
                    // Business Process Outsourcing (BPO)
                    case businessProcessOutsourcing_Value:
                        showBusinessProcessOutsourcingControls;
                        break;

                    // Export funding - trade finance
                    case exportFundingTradeFinance_Value:
                        showExportFundingTradeFinanceControls();
                        break;

                    // Funding for artists and events
                    case fundingForArtistsAndEvents_Value:
                        showFundingForArtistsAndEventsControls();
                        break;

                    // Import funding - trade finance
                    case importFundingTradeFinance_Value:
                        showImportFundingTradeFinanceControls();
                        break;

                    // Poverty alleviation and rural development
                    case povertyAlleviationAndRuralDevelopment_Value:
                        showPropertyAlleviationAndRuralDevelopementControls();
                        break;
                }
                // div: other-finance-for-type
                $('#other-finance-for-type').show();
                // select: otherfinancetype
                _controls.otherfinancetype.show(true);
                cb(_controls.otherfinancetype);
            }

            function showResearchInnovationControls() {

                function showDevelopingNewProductProcessControls() {
                    // Leaf
                }

                function showFilingPatentControls() {
                    // Leaf
                }

                function showFundingForGreenInitiativesControls() {
                    // Leaf
                }

                function showNewProductCommercialisationControls() {
                    // div: research-innovation-new-product-commercialisation
                    $('#research-innovation-new-product-commercialisation').show();
                    // radio: commresstudentstatus
                    _controls.commresstudentstatus.show(true);
                    cb(_controls.commresstudentstatus);
                    // radio: commreswillincexports
                    _controls.commreswillincexports.show(true);
                    cb(_controls.commreswillincexports);
                    // radio: commresresultinjobcreation
                    _controls.commresresultinjobcreation.show(true);
                    cb(_controls.commresresultinjobcreation);
                    // radio: commresintroinnov
                    _controls.commresintroinnov.show(true);
                    cb(_controls.commresintroinnov);
                    // selectmulti: commresindustries
                    _controls.commresindustries.show(true);
                    cb(_controls.commresindustries);
                }

                function showResearchFundingControls() {
                    // div: research-innovation-research-funding
                    $('#research-innovation-research-funding').show();
                    // radio: researchtakingplaceinuniversity
                    _controls.researchtakingplaceinuniversity.show(true);
                    cb(_controls.researchtakingplaceinuniversity);
                    // select: researchfieldofresearchtype
                    _controls.researchfieldofresearchtype.show(true);
                    cb(_controls.researchfieldofresearchtype);
                }

                function showTechInnovationControls() {
                    // Leaf
                }

                const developingANewProductProcess_Value = '5acb25ce62ba593724e0a786';
                const filingAPatent_Value = '5acb25dd62ba593724e0a787';
                const fundingForGreenInitiatives_Value = '59d26a5320070a604097b051';
                const newProductCommercialisation_Value = '5acb25f862ba593724e0a788';
                const researchFunding_Value = '5acb260462ba593724e0a789';
                const techInnovation_Value = '59d26a4820070a604097b050';

                switch (_controls.researchinnovationfundingtype.val()) {
                    // Developing a new product/process
                    case developingANewProductProcess_Value:
                        showDevelopingNewProductProcessControls();
                        break;
                    // Filing a patent
                    case filingAPatent_Value:
                        showFilingPatentControls();
                        break;
                    // Funding for green initiatives
                    case fundingForGreenInitiatives_Value:
                        showFundingForGreenInitiativesControls();
                        break;
                    // New product commercialisation
                    case newProductCommercialisation_Value:
                        showNewProductCommercialisationControls();
                        break;
                    // Research funding
                    case researchFunding_Value:
                        showResearchFundingControls();
                        break;
                    // Tech innovation
                    case techInnovation_Value:
                        showTechInnovationControls();
                        break;
                }

                // div: research-innovation-funding-type
                $('#research-innovation-funding-type').show();
                // select: researchinnovationfundingtype
                _controls.researchinnovationfundingtype.show(true);
                cb(_controls.researchinnovationfundingtype);
            }

            function amountOfFundingNeededControls() {
                // input: loanamount
                _controls.loanamount.show(true);
                cb(_controls.loanamount);
            }

            const assetFinance_Value = '59c35d64463361150873b641';
            const workingCapital_Value = '59c2c6b37c83b736d463c251';
            const growthFinance_Value = '59c5d92b5eac2311202772f5';
            const franchiseAcqusition_Value = '59c2c6f77c83b736d463c254';
            const otherBusiness_Value = '59c5d96b5eac2311202772f7';
            const researchInnovation_Value = '59c5d95c5eac2311202772f6';

            _controls.financefor.show(true);
            cb(_controls.financefor);
            switch (_controls.financefor.val()) {
                // Asset finance
                case assetFinance_Value:
                    showAssetFinanceControls();
                    break;
                // Working capital
                case workingCapital_Value:
                    showWorkingCapitalControls();
                    break;
                // Growth finance
                case growthFinance_Value:
                    showGrowthFinanceControls();
                    break;
                // Franchise acqusition
                case franchiseAcqusition_Value:
                    showFranchiseAquisitionControls();
                    break;
                // Other business
                case otherBusiness_Value:
                    showOtherBusinessControls();
                    break;
                // ResearchInnovation
                case researchInnovation_Value:
                    showResearchInnovationControls();
                    break;
            }

            amountOfFundingNeededControls();
        }

        let init = function (application, cb) {
            initControls();

            _application.id = application.id;
            _application.mc = JSON.parse(application.mc.substring(1, application.mc.length - 1));
            _industrySectorData = app.common.industrySector.industrySectorData;
            populate(_application.mc);

            function addControl(control) {
            }

            showFinancialInfoControls(addControl);
            showFundingRequirementControls(addControl);
            showFundingEssentialsControls(addControl);
            cb(AddStatus());
        }

        function enumFinancialInfo(cb) {
            showFinancialInfoControls(function (control) {
                cb(control);
            });
        }

        function enumFundingRequirements(cb) {
            showFundingRequirementControls(function (control) {
                let obj = _controlMap.get(control.name);
                cb(control, obj == null ? '' : obj.parentId);
            });
        }

        controls.init = init;
        controls.map = _controlMap;
        controls.enumFinancialInfo = enumFinancialInfo;
        controls.enumFundingRequirements = enumFundingRequirements;

    })(app.getFunding.controls);

}
