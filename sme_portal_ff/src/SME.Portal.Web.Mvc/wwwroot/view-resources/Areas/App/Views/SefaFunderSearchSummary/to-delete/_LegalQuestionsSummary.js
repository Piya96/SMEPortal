'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

if (app.fss.legalQuestions == undefined) {
    app.fss.legalQuestions = {};
}

(function (legalQuestions) {

    const BankAccountOther = '5c86148eb069b41688f61c8f';

    const CollateralOther = '62c6f856c50341864eb71970';
    const CollateralNone = '4586ac64fbd24de3ae3e231d87fb6d4e';

    const SecurityOther = '62c6f91ead740b088bee2947';
    const SecurityNone = '93ce8e429c1542bdbc63674035a8cb19';

    const SourceOfFundsOther = '6278d3714d04c757940db02e';

    const AccountingSystemOther = '60d194ba05955b09d12f35e9';

    const PayrollSystemOther = '60d19618eac92464d407fb6c';

    const BusinessInsuranceOther = '64a52c4d3fe521609555ef70';

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.getter;

    class Summary {
        constructor() {
            this.json = null;
            this.appId = null;
        }

        getVal(name) {
            return helpers.getNvpValue(this.json, name, 0);
        }

        setVal(name, id, filters = []) {
            let value = this.getVal(name);
            let result = value;
            if (value !== '' && value != null) {
                if (Array.isArray(filters) == true) {
                    filters.forEach((func, idx) => {
                        let obj = func(value);
                        value = (obj instanceof Object) == true ? obj.text : obj;
                    });
                }
            }
            $('#' + id + '-' + this.appId).text(value == null ? '' : value);
            return result;
        }

        setValEx(name, id, filters = []) {
            let arr = helpers.getPropEx(this.json, name, []);

            let text = '';
            arr.forEach((o, i) => {
                let value = o;
                if (Array.isArray(filters) == true) {
                    filters.forEach((func, idx) => {
                        let obj = func(value);
                        value = (obj instanceof Object) == true ? obj.text : obj;
                    });
                }
                text += (value + '<br/>');
            });
            text = text.slice(0, text.length - ('<br/>').length);
            $('#' + id + '-' + this.appId).html(text);
            return arr;
        }

        show(id, toggle) {
            if (toggle == true) {
                $('#' + id + '-' + this.appId).show();
            } else {
                $('#' + id + '-' + this.appId).hide();
            }
        }

        methodOfRepayment() {
            this.setVal("select-method-of-repayment", 'method-of-repayment', [listItems.getPaymentType]);
        }

        ownOrRentBusinessPremises() {
            this.setVal("select-own-or-rent-business-premises", 'own-or-rent-business-premises', [listItems.getRentType]);
        }

        existingInsurncePoliciesInPlace() {
            let value = this.setVal("input-existing-insurance-policies-in-place", 'existing-insurance-policies-in-place');
            this.businessInsuranceType(value == 'Yes');
        }

        //hasBusinessInsurance() {
        //    let self = this.self;
        //    let value = this.setVal('input-has-business-insurance', 'td-has-business-insurance');
        //    this.businessInsuranceType(value == 'Yes');
        //}

        businessInsuranceType(show) {
            let self = this.self;
            this.show('tr-business-insurance-type', show);

            let li = app.listItems.get();
            let valArr = this.setValEx('check-business-insurance-type', 'td-business-insurance-type', [li.getBusinessInsuranceTypes.bind(li)]);
            this.businessInsuranceOther(
                valArr.length > 0 ? valArr[0] == BusinessInsuranceOther : false
            );
        }

        businessInsuranceOther(show) {
            let self = this.self;
            this.show('tr-business-insurance-other', show);
            this.setVal('input-business-insurance-other', 'td-business-insurance-other');
        }

        typeOfCollateral() {
            let self = this;
            this.show('tr-type-of-collateral-other', true);
            this.show('tr-value-of-collateral', true);
            let val = this.setVal('select-type-of-collateral', 'type-of-collateral', [listItems.getSefaCollateralBusiness]);
            if (val == self.collateralOther()) {
                this.setVal('input-type-of-collateral-other', 'type-of-collateral-other');
            } else if (val == self.collateralNone()) {
                this.show('tr-type-of-collateral-other', false);
                this.show('tr-value-of-collateral', false);
            } else {
                this.show('tr-type-of-collateral-other', false);
            }
        }

        valueOfCollateral() {
            // format
            this.setVal('input-value-of-collateral', 'value-of-collateral', [helpers.formatCurrencyR]);
        }

        typeOfSecurity() {
            let self = this;
            this.show('tr-type-of-security-other', true);
            this.show('tr-value-of-security', true);
            let val = this.setVal('select-type-of-security', 'type-of-security', [listItems.getSefaCollateralOwner]);
            if (val == self.securityOther()) {
                this.setVal('input-type-of-security-other', 'type-of-security-other');
            } else if (val == self.securityNone()) {
                this.show('tr-type-of-security-other', false);
                this.show('tr-value-of-security', false);
            } else {
                this.show('tr-type-of-security-other', false);
            }
        }

        valueOfSecurity() {
            // format
            this.setVal('input-value-of-security', 'value-of-security', [helpers.formatCurrencyR]);
        }

        companyContribution() {
            // format
            this.setVal('input-company-contribution', 'company-contribution', [helpers.formatCurrencyR]);
        }

        sourceOfFunds() {
            let self = this;
            // Hide select by default.
            this.show('tr-source-of-funds-company', false);
            // Hide input by default.
            this.show('tr-source-of-funds-company-other', false);
            let value = this.getVal('input-company-contribution');
            value = parseInt(value);
            if (value > 0 && isNaN(value) == false) {
                this.show('tr-source-of-funds-company', true);
            } else {
            }

            function otherSourceOfFunds() {
                self.setVal('input-source-of-funds-company-other', 'source-of-funds-company-other');
            }
            value = this.setVal('select-source-of-funds-company', 'source-of-funds-company', [listItems.getSourceOfFunds]);
            if (value == self.sourceOfFundsOther()) {
                this.show('tr-source-of-funds-company-other', true);
                otherSourceOfFunds();
            } else {
            }
        }

        annualTurnover() {
            this.setVal('select-annual-turnover', 'annual-turnover', [listItems.getAnnualTurnover]);
        }

        financialYearEnd() {
            this.setVal('select-financial-year-end', 'financial-year-end', [listItems.getMonth]);
        }

        businessAccountBank() {
            this.setVal('select-business-account-bank', 'business-account-bank', [listItems.getBank]);
        }

        bankAccounts() {
            let self = this;
            let val = this.getVal('select-business-account-bank');
            if (val == self.bankAccountOther()) {
                this.show('tr-bank-account-types', false);
            } else {
                this.show('tr-bank-account-types', true);
                if (this.json.hasOwnProperty('bankaccservices') == true) {
                    let html = '';
                    this.json['bankaccservices'].forEach((guid, idx) => {
                        let obj = listItems.getBankAccount(guid);
                        html += (obj + '<br/>');
                    });
                    html = html.substring(0, html.length - 5);
                    $('#bank-account-types-' + this.appId).html(html);
                }
            }
        }

        permitSefaToGetDataFromSystem() {
            this.setVal('input-permit-sefa-to-call-data-from-accounting-system-monthly', 'permit-sefa-to-call-data-from-accounting-system-monthly');
        }

        hasElectronicAccountingSystem() {
            let self = this;
            this.show('tr-which-accounting-system-do-you-have', false);
            this.show('tr-permit-sefa-to-call-data-from-accounting-system-monthly', false);
            self.show('tr-acounting-system-other', false);
            function whichAccountingSystem() {
                function otherAccountingSystem() {
                    self.setVal('input-acounting-system-other', 'acounting-system-other');
                }
                let value = self.setVal('select-which-accounting-system-do-you-have', 'which-accounting-system-do-you-have', [listItems.getAccountingSystem]);
                if (value == self.accountingSystemOther()) {
                    self.show('tr-acounting-system-other', true);
                    otherAccountingSystem();
                } else {
                }
            }

            let value = this.setVal('input-has-electronic-accounting-system', 'has-electronic-accounting-system');
            if (value == 'Yes') {
                this.show('tr-which-accounting-system-do-you-have', true);
                this.show('tr-permit-sefa-to-call-data-from-accounting-system-monthly', true);
                whichAccountingSystem();
                self.permitSefaToGetDataFromSystem();
            } else {
            }
        }

        hasOtherBusinessLoans() {
            let self = this;
            this.show('tr-who-is-this-loan-from', false);
            function whoIsLoanFrom() {
                if (self.json.hasOwnProperty('control-who-is-this-loan-from') == true) {
                    let html = '';
                    self.json['control-who-is-this-loan-from'].forEach((guid, idx) => {
                        let obj = listItems.getLoanFrom(guid);
                        html += (obj + '<br/>');
                    });
                    html = html.substring(0, html.length - 5);
                    $('#who-is-this-loan-from-' + self.appId).html(html);
                }
            }
            let value = this.setVal('input-any-other-business-loans', 'any-other-business-loans');
            if (value == 'Yes') {
                this.show('tr-who-is-this-loan-from', true);
                whoIsLoanFrom();
            } else {
            }
        }

        hasBusinessTransationsThroughPersonalAccount() {
            let self = this;
            this.show('tr-who-do-you-bank-with-personally', false);
            function personalBank() {
                self.setVal('select-who-do-you-bank-with-personally', 'who-do-you-bank-with-personally', [listItems.getBank]);
            }
            let value = this.setVal('input-any-business-transactions-through-personal-accounts', 'any-business-transactions-through-personal-accounts');
            if (value == 'Yes') {
                this.show('tr-who-do-you-bank-with-personally', true);
                personalBank();
            } else {
            }
        }

        usePayrollForStaffPayslips() {
            let self = this;
            this.show('tr-which-electronic-payroll-system', false);
            self.show('tr-payroll-system-other', false);
            function whichPayrollSystem() {
                function otherPayrollSystem() {
                    self.setVal('input-payroll-system-other', 'payroll-system-other');
                }
                let value = self.setVal('select-which-electronic-payroll-system', 'which-electronic-payroll-system', [listItems.getPayrollSystem]);
                if (value == self.payrollSystemOther()) {
                    self.show('tr-payroll-system-other', true);
                    otherPayrollSystem();
                } else {

                }
            }
            let value = this.setVal('input-use-payroll-system-for-staff-payslips', 'use-payroll-system-for-staff-payslips');
            if (value == 'Yes') {
                this.show('tr-which-electronic-payroll-system', true);
                whichPayrollSystem();
            } else {

            }
        }

        hasOwnersLoanAccount() {
            let li = app.listItems.get();
            this.setVal('select-has-owners-loan-account', 'td-has-owners-loan-account', [li.getOwnerLoanAccountStatus.bind(li)]);
        }

        apply(jsonStr, appId) {
            this.appId = appId;
            let nvp = jsonStr;
            this.json = helpers.nvpArrayToObject(nvp);
            this.appId = appId.toString();

            this.methodOfRepayment();
            this.ownOrRentBusinessPremises();
            this.existingInsurncePoliciesInPlace();
            this.typeOfCollateral();
            this.valueOfCollateral();
            this.typeOfSecurity();
            this.valueOfSecurity();
            this.companyContribution();
            this.sourceOfFunds();
            this.annualTurnover();
            this.financialYearEnd();
            this.businessAccountBank();
            this.bankAccounts();
            this.hasElectronicAccountingSystem();
            this.hasOtherBusinessLoans();
            this.hasBusinessTransationsThroughPersonalAccount();
            this.usePayrollForStaffPayslips();
            //this.hasBusinessInsurance();
            this.hasOwnersLoanAccount();
        }

        collateralOther() {
            return CollateralOther;
        }

        collateralNone() {
            return CollateralNone;
        }

        securityOther() {
            return SecurityOther;
        }

        securityNone() {
            return SecurityNone;
        }

        sourceOfFundsOther() {
            return SourceOfFundsOther;
        }

        bankAccountOther() {
            return BankAccountOther;
        }

        accountingSystemOther() {
            return AccountingSystemOther;
        }

        payrollSystemOther() {
            return PayrollSystemOther;
        }

        bankAccountOther() {
            return BankAccountOther;
        }
    }

    function Render(jsonStr, appId) {
        let summary = legalQuestions.getSummary();
        summary.apply(jsonStr, appId);
    }

    legalQuestions.Summary = Summary;

    legalQuestions.getSummary = function() {
        return new Summary();
    }

    legalQuestions.render = function (jsonStr, appId) {
        if (jsonStr != null) {
            Render(jsonStr, appId);
        } else {
        }
    };
}(app.fss.legalQuestions));
