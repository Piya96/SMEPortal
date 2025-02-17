"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.financialInfo == undefined) {
    app.wizard.financialInfo = {};
}

if (app.wizard.financialInfo.dto == undefined) {
    app.wizard.financialInfo.dto = {};
}

(function (dto) {

    //let productGuids = app.wizard.common.page.productGuids;
    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    const BankAccountOther = '5c86148eb069b41688f61c8f';

    const CollateralOther = '634d590a4d550ff4a17bbeae';
    const CollateralNone = '634d5744765726af72f9ab54';

    const SecurityOther = '634d5a5e36eaafd97068571f';
    const SecurityNone = '634d595473b83b026832e4a7';

    const SourceOfFundsOther = '634d5b1ff097ff5b024ab0d4';

    const AccountingSystemOther = '60d194ba05955b09d12f35e9';

    const PayrollSystemOther = '60d19618eac92464d407fb6c';

    const BusinessInsuranceOther = '64a52c4d3fe521609555ef70';

    dto.controls = {
        // Base SEFA set start.
        'select-method-of-repayment': { type: 'select', label: 'What method will you use to do your loan repayments?', filters: [listItems.getPaymentType.bind(listItems)] },
        'select-own-or-rent-business-premises': { type: 'select', label: 'Do you own or rent your business premises?', filters: [listItems.getRentType.bind(listItems)] },
        'input-existing-insurance-policies-in-place': { type: 'radio', label: 'Do you have any existing business insurance policies in place?', filters: [] },
        'select-type-of-collateral': { type: 'select', label: 'Collateral in the name of the business (owned by the business)', filters: [listItems.getSefaCollateralBusiness.bind(listItems)] },
        'input-type-of-collateral-other': { type: 'input', label: 'Other', filters: [] },
        'input-value-of-collateral': { type: 'input', label: 'Value of Collateral you can offer', filters: [] },
        'select-type-of-security': { type: 'select', label: 'Collateral in the owner’s name (personally owned by the owner)', filters: [listItems.getSefaCollateralOwner.bind(listItems)] },
        'input-type-of-security-other': { type: 'input', label: 'Other', filters: [] },
        'input-value-of-security': { type: 'input', label: 'Value of Collateral you can offer', filters: [] },
        'input-company-contribution': { type: 'input', label: 'How much can the Company contribute towards loan amount requested?', filters: [] },//
        'select-source-of-funds-company': { type: 'select', label: 'What is the source of these company funds?', filters: [listItems.getSourceOfFunds.bind(listItems)] },//
        'input-source-of-funds-company-other': { type: 'input', label: 'Other fund source', filters: [] },//
        'select-annual-turnover': { type: 'select', label: 'What was your annual turnover for the past 12 months?', filters: [listItems.getAnnualTurnover.bind(listItems)] },
        'select-financial-year-end': { type: 'select', label: 'When is your financial year end?', filters: [listItems.getMonth.bind(listItems)] },
        'select-business-account-bank': { type: 'select', label: 'Which bank do you have your business account with?', filters: [listItems.getBank.bind(listItems)] },
        'bankaccservices': { type: 'checkbox', label: 'What type of business bank account/services do you use?', filters: [listItems.getBankAccount.bind(listItems)] },
        'input-has-electronic-accounting-system': { type: 'radio', label: 'Do you have an electronic accounting system?', filters: [] },
        'select-which-accounting-system-do-you-have': { type: 'select', label: 'Which electronic accounting system do you have?', filters: [listItems.getAccountingSystem.bind(listItems)] },
        'input-acounting-system-other': { type: 'input', label: 'Other accountinf system', filters: [] },
        'input-permit-sefa-to-call-data-from-accounting-system-monthly': { type: 'radio', label: 'Do you give us permission to retrieve data from your accounting system on a monthly basis?', filters: [] },
        'input-any-other-business-loans': { type: 'radio', label: 'Do you have any other business loans?', filters: [] },
        'control-who-is-this-loan-from': { type: 'checkbox', label: 'Who is this loan from?', filters: [listItems.getLoanFrom.bind(listItems)] },
        //'input-has-business-insurance': { type: 'input', label: "Do you have any business insurance?", filters: {} },//
        'check-business-insurance-type': { type: 'input', label: "Business insurance", filters: [listItems.getBusinessInsuranceTypes.bind(listItems)] },
        'input-business-insurance-other': { type: 'input', label: "Other business insurance", filters: {} },
        'input-any-business-transactions-through-personal-accounts': { type: 'radio', label: 'Do any of your business transactions go through your personal account (and vice versa)?', filters: [] },
        'select-who-do-you-bank-with-personally': { type: 'select', label: 'Who do you bank with personally?', filters: [listItems.getBank.bind(listItems)] },
        'input-use-payroll-system-for-staff-payslips': { type: 'radio', label: 'Do you use a payroll system to provide payslips to your staff?', filters: [] },
        'select-which-electronic-payroll-system': { type: 'select', label: 'Which electronic payroll system, do you have?', filters: [listItems.getPayrollSystem.bind(listItems)] },
        'input-payroll-system-other': { type: 'input', label: 'Other payroll system', filters: [] },
        'select-has-owners-loan-account': { type: 'input', label: "Owner's loan account", filters: [listItems.getOwnerLoanAccountStatus.bind(listItems)] }
        // Base SEFA set end.
    };

    class DtoToHtml {
        constructor(self) {
            if (self != null) {
                this.self = self;
            }
        }

        set(name, show, fn = []) {
            let value = '';
            value = helpers.getPropEx(this.dto, name, '');
            if (value == null || value == undefined) {
                value == '';
            }
            fn.forEach((f, idx) => {
                value = f(value);
            });
            return value;
        }

        setMult(name, show, fn = []) {
            let values = [];
            if (this.dto.hasOwnProperty(name) == false) {
                return values;
            }
            this.dto[name].forEach((key, idx) => {
                values.push(key);
            });
            return values;
        }

        show(div, name, show) {
            if (div != '') {
                if (show == true) {
                    $('#' + div).show('fast');
                } else {
                    $('#' + div).hide('fast');
                }
            }
            if (name != '') {
                this.self.validation.toggleValidators([name], [show]);
            }
        }

        methodOfPayment_Hide() {
            return false;
        }

        methodOfPayment() {
            if (this.methodOfPayment_Hide() == true) {
                this.show('div-method-of-repayment-ext', 'select-method-of-repayment', false);
            } else {
                this.set('select-method-of-repayment', true);
                this.show('div-method-of-repayment-ext', 'select-method-of-repayment', true);
            }
        }

        rentOrOwnBusinessPremises_Hide() {
            return false;
        }

        rentOrOwnBusinessPremises() {
            if (this.rentOrOwnBusinessPremises_Hide() == true) {
                this.show('div-own-or-rent-business-premises-ext', 'select-own-or-rent-business-premises', false);
            } else {
                this.set('select-own-or-rent-business-premises', true);
                this.show('div-own-or-rent-business-premises-ext', 'select-own-or-rent-business-premises', true);
            }
        }

        existingInsurancePoliciesInPlace_Hide() {
            return false;
        }

        existingInsurancePoliciesInPlace() {
            if (this.existingInsurancePoliciesInPlace_Hide() == true) {
                this.show('div-existing-insurance-policies-in-place-ext', 'input-existing-insurance-policies-in-place', false);
                this.businessInsuranceType(false);
            } else {
                let value = this.set('input-existing-insurance-policies-in-place', true);
                this.show('div-existing-insurance-policies-in-place-ext', 'input-existing-insurance-policies-in-place', true);
                this.businessInsuranceType(value == 'Yes');
            }
        }

        businessInsuranceType(show) {
            let self = this.self;
            this.show('div-business-insurance-type', 'check-business-insurance-type', show);
            let valArr = this.setMult('check-business-insurance-type', show);
            this.businessInsuranceOther(
                valArr.length > 0 ? valArr[0] == this.getBusinessInsuranceOther() : false
            );
        }

        businessInsuranceOther(show) {
            let self = this.self;
            this.show('div-business-insurance-other', 'input-business-insurance-other', show);
            this.set('input-business-insurance-other', show);
        }

        businessCollateral_Hide() {
            return false;
        }

        businessCollateral() {
            this.show('', 'input-type-of-collateral-other', false);
            this.show('', 'input-value-of-collateral', false);
            this.show('', 'select-type-of-collateral', false);

            helpers.show('h3-collateral', this.businessCollateral_Hide() == false);
            if (this.businessCollateral_Hide() == true) {
                this.show('div-type-of-collateral-ext', '', false);
            } else {
                this.show('div-type-of-collateral-ext', '', true);
                this.show('', 'select-type-of-collateral', true);

                let value = this.set('select-type-of-collateral', true);
                if (value == this.getCollateralOther()) {
                    this.show('div-type-of-collateral-other', 'input-type-of-collateral-other', true);
                    this.show('div-value-of-collateral', 'input-value-of-collateral', true);
                    this.set('input-type-of-collateral-other', true);
                    this.set('input-value-of-collateral', true, [helpers.formatCurrency]);
                } else if (value == this.getCollateralNone()) {
                    this.show('div-type-of-collateral-other', '', false);
                    this.show('div-value-of-collateral', '', false);
                } else {
                    this.show('div-value-of-collateral', 'input-value-of-collateral', true);
                    this.set('input-value-of-collateral', true, [helpers.formatCurrency]);
                }
            }
        }

        ownerCollateral_Hide() {
            return false;
        }

        ownerCollateral() {
            this.show('', 'input-type-of-security-other', false);
            this.show('', 'input-value-of-security', false);
            this.show('', 'select-type-of-security', false);

            if (this.ownerCollateral_Hide() == true) {
                this.show('div-type-of-security-ext', '', false);
            } else {
                this.show('div-type-of-security-ext', '', true);
                this.show('', 'select-type-of-security', true);

                let value = this.set('select-type-of-security', true);
                if (value == this.getSecurityOther()) {
                    this.show('div-type-of-security-other', 'input-type-of-security-other', true);
                    this.show('div-value-of-security', 'input-value-of-security', true);
                    this.set('input-type-of-security-other', true);
                    this.set('input-value-of-security', true, [helpers.formatCurrency]);
                } else if (value == this.getSecurityNone()) {
                    this.show('div-type-of-security-other', '', false);
                    this.show('div-value-of-security', '', false);
                } else {
                    this.show('div-value-of-security', 'input-value-of-security', true);
                    this.set('input-value-of-security', true, [helpers.formatCurrency]);
                }
            }
        }

        companyContribution_Hide() {
            return false;
        }

        companyContribution() {
            this.show('', 'input-company-contribution', false);
            this.show('', 'select-source-of-funds-company', false);
            this.show('', 'input-source-of-funds-company-other', false);

            if (this.companyContribution_Hide() == true) {
                this.show('div-company-contribution-ext', '', false);
            } else {
                this.show('div-company-contribution-ext', '', true);
                this.show('', 'input-company-contribution', true);

                let value = this.set('input-company-contribution', true, [helpers.formatCurrency]);
                value = parseInt(value);
                if (isNaN(value) == true || value == 0) {
                    this.show('div-source-of-funds-company', 'select-source-of-funds-company', false);
                } else {
                    this.show('div-source-of-funds-company', 'select-source-of-funds-company', true);
                    value = this.set('select-source-of-funds-company', true);
                    if (value == this.getSourceOfFundsOther()) {
                        this.show('div-source-of-funds-company-other', 'input-source-of-funds-company-other', true);
                        this.set('input-source-of-funds-company-other', true);

                    } else {
                        this.show('div-source-of-funds-company-other', 'input-source-of-funds-company-other', false);
                    }
                }
            }
        }

        anualTurnover() {
            this.set('select-annual-turnover', true);
        }

        financialYearEnd() {
            this.set('select-financial-year-end', true);
        }

        businessBankAccount() {
            let value = this.set('select-business-account-bank', true);
            if (value == this.getBankAccountOther()) {
                this.show('div-bank-account-services', 'bankaccservices', false);
            } else {
                this.show('div-bank-account-services', 'bankaccservices', true);
                this.setMult('bankaccservices', true);
            }
        }

        electronicAccouningSystem_Hide() {
            return false;
        }

        electronicAccouningSystem() {
            this.show('', 'input-permit-sefa-to-call-data-from-accounting-system-monthly', false);
            this.show('', 'select-which-accounting-system-do-you-have', false);
            this.show('', 'input-acounting-system-other', false);
            this.show('', 'input-has-electronic-accounting-system', false);

            if (this.electronicAccouningSystem_Hide() == true) {
                this.show('div-has-electronic-accounting-system-ext', '', false);
            } else {
                this.show('div-has-electronic-accounting-system-ext', '', true);
                this.show('', 'input-has-electronic-accounting-system', true);

                let value = this.set('input-has-electronic-accounting-system', true);
                if (value == 'Yes') {
                    this.show('div-has-electronic-accounting-system', '', true);

                    this.show('', 'input-permit-sefa-to-call-data-from-accounting-system-monthly', true);
                    this.show('', 'select-which-accounting-system-do-you-have', true);
                    value = this.set('input-permit-sefa-to-call-data-from-accounting-system-monthly', true);
                    value = this.set('select-which-accounting-system-do-you-have', true);

                    if (value == this.getAccountingSystemOther()) {
                        this.show('div-electronic-accounting-system-other', 'input-acounting-system-other', true);
                        value = this.set('input-acounting-system-other', true);
                    } else {
                        this.show('', 'input-acounting-system-other', false);
                    }
                } else {
                }
            }
        }

        otherBusinessLoans_Hide() {
            return false;
        }

        otherBusinessLoans() {
            this.show('', 'input-any-other-business-loans', false);
            this.show('', 'control-who-is-this-loan-from', false);

            if (this.otherBusinessLoans_Hide() == true) {
                this.show('div-any-other-business-loans-ext', '', false);
            } else {
                this.show('', 'input-any-other-business-loans', true);
                this.show('div-any-other-business-loans-ext', '', true);

                let value = this.set('input-any-other-business-loans', true);
                if (value == 'Yes') {
                    this.show('div-any-other-business-loans', '', true);
                    this.show('', 'control-who-is-this-loan-from', true);
                    value = this.setMult('control-who-is-this-loan-from', true);
                } else {
                    this.show('', 'control-who-is-this-loan-from', false);
                }
            }
        }

        transactionsThroughPersonalAccounts_Hide() {
            return false;
        }

        transactionsThroughPersonalAccounts() {
            this.show('', 'input-any-business-transactions-through-personal-accounts', false);
            this.show('', 'select-who-do-you-bank-with-personally', false);

            if (this.transactionsThroughPersonalAccounts_Hide() == true) {
                this.show('div-any-business-transactions-through-personal-accounts-ext', '', false);
            } else {
                this.show('div-any-business-transactions-through-personal-accounts-ext', '', true);
                this.show('', 'input-any-business-transactions-through-personal-accounts', true);

                let value = this.set('input-any-business-transactions-through-personal-accounts', true);
                if (value == 'Yes') {
                    this.show('div-any-business-transactions-through-personal-accounts', '', true);
                    this.show('', 'select-who-do-you-bank-with-personally', true);
                    value = this.set('select-who-do-you-bank-with-personally', true);
                } else {
                    this.show('', 'select-who-do-you-bank-with-personally', false);
                }
            }
        }

        payrollSystem_Hide() {
            return false;
        }

        payrollSystem() {
            this.show('', 'input-use-payroll-system-for-staff-payslips', false);
            this.show('', 'select-which-electronic-payroll-system', false);
            this.show('', 'input-payroll-system-other', false);

            if (this.payrollSystem_Hide() == true) {
                this.show('div-use-payroll-system-for-staff-payslips-ext', '', false);
            } else {
                this.show('div-use-payroll-system-for-staff-payslips-ext', '', true);

                this.show('', 'input-use-payroll-system-for-staff-payslips', true);
                let value = this.set('input-use-payroll-system-for-staff-payslips', true);

                if (value == 'Yes') {
                    this.show('div-use-payroll-system-for-staff-payslips', '', true);
                    this.show('', 'select-which-electronic-payroll-system', true);
                    value = this.set('select-which-electronic-payroll-system', true);
                    if (value == this.getPayrollSystemOther()) {
                        this.show('div-payroll-system-other', 'input-payroll-system-other', true);
                        value = this.set('input-payroll-system-other', true);
                    } else {
                    }
                } else {
                }
            }
        }

        hasOwnerLoanAccount() {
            let val = this.set('select-has-owners-loan-account', true);
            this.show('', 'select-has-owners-loan-account', true);
        }

        apply(dto) {
            this.dto = dto;

            this.methodOfPayment();
            this.rentOrOwnBusinessPremises();
            this.existingInsurancePoliciesInPlace();
            this.businessCollateral();
            this.ownerCollateral();
            this.companyContribution();
            this.anualTurnover();
            this.financialYearEnd();
            this.businessBankAccount();
            this.electronicAccouningSystem();
            this.otherBusinessLoans();
            this.hasOwnerLoanAccount();
            this.transactionsThroughPersonalAccounts();
            this.payrollSystem();
        }

        getBankAccountOther() {
            return '5c86148eb069b41688f61c8f';
        }

        getCollateralOther() {
            return '634d590a4d550ff4a17bbeae';
        }

        getCollateralNone() {
            return '634d5744765726af72f9ab54';
        }

        getSecurityOther() {
            return '634d5a5e36eaafd97068571f';
        }

        getSecurityNone() {
            return '634d595473b83b026832e4a7';
        }

        getSourceOfFundsOther() {
            return '634d5b1ff097ff5b024ab0d4';
        }

        getAccountingSystemOther() {
            return '60d194ba05955b09d12f35e9';
        }

        getPayrollSystemOther() {
            return '60d19618eac92464d407fb6c';
        }

        getBusinessInsuranceOther() {
            return '64a52c4d3fe521609555ef70';
        }
    }

    dto.getDto = function (dto) {
        return new DtoToHtml(dto);
    }

    dto.DtoToHtml = DtoToHtml;

})(app.wizard.financialInfo.dto);
