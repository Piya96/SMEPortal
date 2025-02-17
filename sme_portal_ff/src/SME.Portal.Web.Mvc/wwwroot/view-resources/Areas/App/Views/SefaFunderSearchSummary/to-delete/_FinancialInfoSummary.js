'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.financialInfo = {};
(function (financialInfo) {
    // FinancialInfo ( _StepIncomeProfitability.cshtml )
    const annualturnover = 'annualturnover';
    const financialyearend = 'financialyearend';
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

    let _financialInfo = {};
    // FinancialInfo ( _StepIncomeProfitability.cshtml )
    _financialInfo[annualturnover] = { control: app.json.select(annualturnover), parentId: '59d359ac7112ea2ef072eec4' };

    _financialInfo[financialyearend] = { control: app.json.select(financialyearend), parentId: '616d6e53668f1708a649134b' };

    _financialInfo[bank] = { control: app.json.select(bank), parentId: '5c810d51b069b41688f61c78' };
    _financialInfo[bankaccservices] = { control: app.json.checkbox(bankaccservices), parentId: '60a65b5b61d3627f442b31fb' };
    _financialInfo[businessloans] = { control: app.json.radio(businessloans), parentId: '' };
    _financialInfo[whoistheloanfrom] = { control: app.json.select(whoistheloanfrom), parentId: '60d193354e4bf55f7b0b8ff8' };
    _financialInfo[businesstxpersonalacc] = { control: app.json.radio(businesstxpersonalacc), parentId: '' };
    _financialInfo[personalbank] = { control: app.json.select(personalbank), parentId: '5c810d51b069b41688f61c78' };
    _financialInfo[haselecaccsystems] = { control: app.json.radio(haselecaccsystems), parentId: '' };
    _financialInfo[elecaccsystems] = { control: app.json.select(elecaccsystems), parentId: '60d194ba05955b09d12f35e3' };
    _financialInfo[elecaccsystemother] = { control: app.json.input(elecaccsystemother), parentId: '' };
    _financialInfo[haspayroll] = { control: app.json.radio(haspayroll), parentId: '' };
    _financialInfo[payrollsystems] = { control: app.json.select(payrollsystems), parentId: '60d19618eac92464d407fb62' };
    _financialInfo[payrollsystemother] = { control: app.json.input(payrollsystemother), parentId: '' };
    _financialInfo[hasinvestedownmoney] = { control: app.json.radio(hasinvestedownmoney), parentId: '' };
    _financialInfo[businessisprofitable] = { control: app.json.radio(businessisprofitable), parentId: '' };
    _financialInfo[businesshascolateral] = { control: app.json.radio(businesshascolateral), parentId: '' };

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

    function _init_(matchCriteria) {
        for (const name in _financialInfo) {
            let json = _financialInfo[name].control;
            json.clear();
        }

        matchCriteria.forEach(function (obj, idx) {
            function setValue(json, value) {
                if (json.type == 'selectmulti') {
                    let x = 0;
                }
                if (json.type == 'checkbox') {
                    json.val(value, true);
                } else {
                    json.val(value);
                }
            }
            let name = obj.name;
            if (_financialInfo.hasOwnProperty(name) == true) {
                setValue(_financialInfo[name].control, obj.value);
            }
        });
    }

    function Render(matchCriteria, appId, dataArr) {
        appId = '-' + appId;

        function pushTripple(name, value, label, literal) {
            dataArr.push(
                { 'name': name, 'value': value, 'label': label, 'literal' : literal }
            );
        }

        function enumFinancialInfoControls(cb) {
            function showAnualTurnoverControl() {
                cb(_financialInfo.annualturnover);
            }

            function showFinancialYearEndControl() {
                cb(_financialInfo.financialyearend);
            }

            function showBusinessBankAccountControl() {
                cb(_financialInfo.bank);

                let businessBankAccount = _financialInfo.bank.control.val();
                if (businessBankAccount != BusinessAccountBank.NoBankAccount && businessBankAccount != null) {
                    cb(_financialInfo.bankaccservices);
                }
            }

            function showHasBusinessLoansControl() {
                cb(_financialInfo.businessloans);

                let haveBusinessLoans = _financialInfo.businessloans.control.val();
                if (haveBusinessLoans == 'Yes') {
                    cb(_financialInfo.whoistheloanfrom);
                }
            }

            function showAnyBusinessTransactionsThroughPersonalAccountControl() {
                cb(_financialInfo.businesstxpersonalacc);
                let anyBusinessTransactionsThroughPersonalAccount = _financialInfo.businesstxpersonalacc.control.val();
                if (anyBusinessTransactionsThroughPersonalAccount == 'Yes') {
                    cb(_financialInfo.personalbank);
                }
            }

            function showHasElectonicAccountingSystemControl() {
                cb(_financialInfo.haselecaccsystems);
                let hasElectonicAccountingSystem = _financialInfo.haselecaccsystems.control.val();
                if (hasElectonicAccountingSystem == 'Yes') {

                    function showWhichElectonicAccountingSystemControl() {
                        cb(_financialInfo.elecaccsystems);
                        let whichElectonicAccountingSystem = _financialInfo.elecaccsystems.control.val();
                        // TODO: Try and find a way to NOT hard-code 'other'!!!
                        if (whichElectonicAccountingSystem == 'other') {
                            cb(_financialInfo.elecaccsystemother);
                        }
                    }
                    // elecaccsystems
                    showWhichElectonicAccountingSystemControl();
                }
            }

            function showHasAPayrollSystemForStaffControl() {
                cb(_financialInfo.haspayroll);

                let hasAPayrollSystemForStaff = _financialInfo.haspayroll.control.val();
                if (hasAPayrollSystemForStaff == 'Yes') {

                    function showWhichPayrollSystemForStaffControl() {
                        cb(_financialInfo.payrollsystems);

                        let whichPayrollSystemForStaff = _financialInfo.payrollsystems.control.val();
                        if (whichPayrollSystemForStaff == 'other') {
                            cb(_financialInfo.payrollsystemother);

                        }
                    }
                    // payrollsystems
                    showWhichPayrollSystemForStaffControl();
                }
            }

            function showInvestedMoneyInOwnBusinessControl() {
                cb(_financialInfo.hasinvestedownmoney);
            }

            function showBusinessMakeProfitOverLast6MonthsControl() {
                cb(_financialInfo.businessisprofitable);
            }

            function showDoYouHaveCollateralControl() {
                cb(_financialInfo.businesshascolateral);
            }

            showAnualTurnoverControl();
            showFinancialYearEndControl();
            showBusinessBankAccountControl();
            showHasBusinessLoansControl();
            showAnyBusinessTransactionsThroughPersonalAccountControl();
            showHasElectonicAccountingSystemControl();
            showHasAPayrollSystemForStaffControl();
            showInvestedMoneyInOwnBusinessControl();
            showBusinessMakeProfitOverLast6MonthsControl();
            showDoYouHaveCollateralControl();
        }

        function resetRowDivs() {

            for (const name in _financialInfo) {
                let id = '#id-div-' + name + appId;
                $(id).hide();
            }
        }

        function resetBankAccServices() {
            for (let i = 0; i < 10; i++) {
                let idDst = ('#id-bankaccservices-' + (i + 1).toString() + appId);
                $(idDst).hide();
            }
        }

        _init_(matchCriteria);

        resetBankAccServices();
        resetRowDivs();

        enumFinancialInfoControls(function (_control) {
            let control = _control.control;
            let parentId = _control.parentId;

            function renderCheckboxSummary() {

                function renderGUIDSummary() {
                    let valArr = control.getAll(true);
                    for (let i = 0, max = valArr.length; i < max; i++) {
                        let dstId = ('#id-' + control.name + '-' + (i + 1).toString() + appId);
                        let srcVal = null;
                        if (valArr[i] == '5c86148eb069b41688f61c8f') {
                            srcVal = 'None of the above';
                        } else {
                            srcVal = app.listItems.obj.getLabel(parentId, valArr[i]);
                        }
                        $(dstId).text(srcVal);
                        $(dstId).show();

                        pushTripple(control.name, valArr[i], '', srcVal);
                    }
                }

                switch (control.name) {
                    case 'bankaccservices':
                        renderGUIDSummary();
                        break;

                    default:
                        break;
                }
            }

            function renderSelectSummary() {

                function renderGUIDSummary() {
                    let val = control.val();
                    let dstId = ('#id-' + control.name + appId);
                    let srcVal = app.listItems.obj.getLabel(parentId, val);
                    $(dstId).text(srcVal);

                    pushTripple(control.name, val, '', srcVal);
                }

                switch (control.name) {
                    default:
                        renderGUIDSummary();
                        break;
                }
            }

            function renderDefaultSummary() {
                let dstId = ('#id-' + control.name + appId);
                let dstVal = control.val();
                $(dstId).text(dstVal);

                pushTripple(control.name, dstVal, '', dstVal);
            }

            let div = ('#id-div-' + control.name + appId);
            $(div).show();
            switch (control.type) {
                case 'checkbox':
                    renderCheckboxSummary();
                    break;

                case 'select':
                    renderSelectSummary();
                    break;


                default:
                    renderDefaultSummary();
                    break;
            }
        });

    }

    financialInfo.render = function (funderSearches, appId) {
        if (funderSearches != null) {
            let dataArr = [];
            Render(funderSearches, appId, dataArr);
            return dataArr;
        } else {
            return null;
        }
    };

}(app.fss.financialInfo));
