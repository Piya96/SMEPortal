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

if (app.wizard.financialInfo.page == undefined) {
    app.wizard.financialInfo.page = {};
}

(function (page) {
    // TODO: Perhaps all tenants can share some common guid here???

    class FinancialInfoPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Financial Info Page';
        }

        // TODO: Move this logic to the dto.
        hasBusinessInsurance(show) {
            if (show == true) {
                this.validation.toggleValidators(['check-business-insurance-type'], [true]);
                $('#div-business-insurance-type').show('fast');
            } else {
                this.validation.toggleValidators(['check-business-insurance-type'], [false]);
                $('#div-business-insurance-type').hide('fast');
            }
        }
        // TODO: Move this logic to the dto.
        businessInsuranceOther(show) {
            if (show == true) {
                this.validation.toggleValidators(['input-business-insurance-other'], [true]);
                $('#div-business-insurance-other').show('fast');
                this.controls['check-business-insurance-type'].valAll(false);
                this.controls['check-business-insurance-type'].val(this.getBusinessInsuranceOther(), true);
            } else {
                this.validation.toggleValidators(['input-business-insurance-other'], [false]);
                this.controls['check-business-insurance-type'].val(this.getBusinessInsuranceOther(), false);
                $('#div-business-insurance-other').hide('fast');
            }
        }

        validate(data, cb) {
            cb(app.wizard.addResult());
        }

        serialize() {
            return super.serialize();
        }

        dtoToPage(dto) {
        }

        onValidateField(field, isValid, args) {
            if (field == 'input-company-contribution') {
                if (isValid == true && args > 0) {
                    $('#div-source-of-funds-company').show();
                    this.validation.toggleValidators(['select-source-of-funds-company'], [true]);
                } else {
                    $('#div-source-of-funds-company').hide();
                    $('#div-source-of-funds-company-other').hide();
                    this.validation.toggleValidators(['select-source-of-funds-company'], [false]);
                    this.validation.toggleValidators(['input-source-of-funds-company-other'], [false]);
                    this.controls['select-source-of-funds-company'].val('');
                    this.controls['input-source-of-funds-company-other'].val('');
                }
            }
        }

        addControls() {
            let self = this;
            function formatCurrency(val) {
                return self.helpers.formatCurrency(val);
            };
            let arr = [];
            let control = null;

            control = this.addControl('select-method-of-repayment', 'select');
            control.fill(this.listItems.getPaymentType());

            control = this.addControl('select-own-or-rent-business-premises', 'select');
            control.fill(this.listItems.getRentType());

            control = this.addControl('input-existing-insurance-policies-in-place', 'radio');
            control = this.addControl('check-business-insurance-type', 'checkbox');
            arr = this.listItems.getBusinessInsuranceTypes();
            control = this.addControl('input-business-insurance-other', 'input');

            control = this.addControl('select-type-of-collateral', 'select');

            arr = this.listItems.getSefaCollateralBusiness();

            control.fill(arr);
            control = this.addControl('input-type-of-collateral-other', 'input');

            control = this.addControl('input-value-of-collateral', 'input');
            control.format(8, formatCurrency);

            control = this.addControl('select-type-of-security', 'select');

            arr = this.listItems.getSefaCollateralOwner();

            control.fill(arr);

            control = this.addControl('input-type-of-security-other', 'input');

            control = this.addControl('input-value-of-security', 'input');
            control.format(8, formatCurrency);

            control = this.addControl('input-company-contribution', 'input');
            control.format(8, formatCurrency);

            control = this.addControl('select-source-of-funds-company', 'select');
            control.fill(this.listItems.getSourceOfFunds());
            control = this.addControl('input-source-of-funds-company-other', 'input');

            control = this.addControl('select-annual-turnover', 'select');
            control.fill(this.listItems.getAnnualTurnover());

            control = this.addControl('select-financial-year-end', 'select');
            control.fill(this.listItems.getMonth());

            control = this.addControl('select-business-account-bank', 'select');
            control.fill(this.listItems.getBank());

            control = this.addControl('bankaccservices', 'checkbox');

            control = this.addControl('input-has-electronic-accounting-system', 'radio');
            // "div-has-electronic-accounting-system"
            control = this.addControl('select-which-accounting-system-do-you-have', 'select');
            control.fill(this.listItems.getAccountingSystem());
            // div-electronic-accounting-system-other
            control = this.addControl('input-acounting-system-other', 'input');

            control = this.addControl('input-permit-sefa-to-call-data-from-accounting-system-monthly', 'radio');

            control = this.addControl('input-any-other-business-loans', 'radio');
            // "div-any-other-business-loans"
            // TODO: Populate from list items js.
            control = this.addControl('control-who-is-this-loan-from', 'checkbox');
            //control.fill(this.listItems.getLoanFrom());

            //control = this.addControl('input-has-business-insurance', 'radio');

            control = this.addControl('input-any-business-transactions-through-personal-accounts', 'radio');
            // "div-any-business-transactions-through-personal-accounts"
            control = this.addControl('select-who-do-you-bank-with-personally', 'select');
            control.fill(this.listItems.getBank());

            control = this.addControl('input-use-payroll-system-for-staff-payslips', 'radio');
            // "div-use-payroll-system-for-staff-payslips"
            control = this.addControl('select-which-electronic-payroll-system', 'select');
            control.fill(this.listItems.getPayrollSystem());
            // div-payroll-system-other
            control = this.addControl('input-payroll-system-other', 'input');

            control = this.addControl('select-has-owners-loan-account', 'select');
            control.fill(this.listItems.getOwnerLoanAccountStatus());
        }

        addHandlers() {
            let self = this;

            this.controls['select-annual-turnover'].change((value, text) => {
                Swal.fire({
                    icon: 'info',
                    html: 'Please note that the funder will require you to verify your annual turnover',
                    focusConfirm: false,
                    confirmButtonText:
                        '<i class="fa fa-thumbs-up"></i> Great!',
                    confirmButtonAriaLabel: 'Thumbs up, great!'
                }).then(() => {
                });
            });

            this.controls['select-type-of-collateral'].change((value, text) => {
                self.validation.toggleValidators(['input-type-of-collateral-other'], [false]);
                self.validation.toggleValidators(['input-value-of-collateral'], [false]);

                if (value == self.collateralOther()) {
                    self.validation.toggleValidators(['input-type-of-collateral-other'], [true]);
                    self.validation.toggleValidators(['input-value-of-collateral'], [true]);
                    self.controls['input-type-of-collateral-other'].val('');
                    $('#div-type-of-collateral-other').show('fast');
                    $('#div-value-of-collateral').show('fast');
                } else if (value == self.collateralNone()) {
                    self.controls['input-value-of-collateral'].val('');
                    $('#div-value-of-collateral').hide('fast');
                    $('#div-type-of-collateral-other').hide('fast');
                } else {
                    self.validation.toggleValidators(['input-value-of-collateral'], [true]);
                    $('#div-type-of-collateral-other').hide('fast');
                    $('#div-value-of-collateral').show('fast');
                }
            });

            this.controls['select-type-of-security'].change((value, text) => {
                self.validation.toggleValidators(['input-type-of-security-other'], [false]);
                self.validation.toggleValidators(['input-value-of-security'], [false]);
                if (value == self.securityOther()) {
                    self.validation.toggleValidators(['input-type-of-security-other'], [true]);
                    self.validation.toggleValidators(['input-value-of-security'], [true]);
                    self.controls['input-type-of-security-other'].val('');
                    $('#div-type-of-security-other').show('fast');
                    $('#div-value-of-security').show('fast');
                } else if (value == self.securityNone()) {
                    self.controls['input-value-of-security'].val('');
                    $('#div-type-of-security-other').hide('fast');
                    $('#div-value-of-security').hide('fast');
                } else {
                    self.validation.toggleValidators(['input-value-of-security'], [true]);
                    $('#div-type-of-security-other').hide('fast');
                    $('#div-value-of-security').show('fast');
                }
            });

            this.controls['select-own-or-rent-business-premises'].change((value, text) => {
                //if (value == 1 && self.leaseAgreement.has == false) {
                //    self.leaseAgreement.need = true;
                //} else {
                //    self.leaseAgreement.need = false;
                //    if (self.insurancePolicy.need == false) {
                //    }
                //}
            });

            this.controls['select-source-of-funds-company'].change((value, text) => {
                // TODO: Make a const for this guid.
                if (value == self.sourceOfFundsOther()) {
                    self.validation.toggleValidators(['input-source-of-funds-company-other'], [true]);
                    self.controls['input-source-of-funds-company-other'].val('');
                    $('#div-source-of-funds-company-other').show('fast');
                } else {
                    self.validation.toggleValidators(['input-source-of-funds-company-other'], [false]);
                    $('#div-source-of-funds-company-other').hide('fast');
                }
            });

            // 
            this.controls['input-has-electronic-accounting-system'].click((arg, name, curr, next) => {
                if (next == 'Yes') {
                    self.validation.toggleValidators(['select-which-accounting-system-do-you-have'], [true]);
                    self.validation.toggleValidators(['input-permit-sefa-to-call-data-from-accounting-system-monthly'], [true]);
                    $('#div-has-electronic-accounting-system').show('fast');
                } else {
                    self.validation.toggleValidators(['select-which-accounting-system-do-you-have'], [false]);
                    self.validation.toggleValidators(['input-acounting-system-other'], [false]);
                    self.validation.toggleValidators(['input-permit-sefa-to-call-data-from-accounting-system-monthly'], [false]);

                    $('#div-electronic-accounting-system-other').hide('fast');
                    $('#div-has-electronic-accounting-system').hide('fast');
                }
            });

            ////
            this.controls['select-which-accounting-system-do-you-have'].change((value, text) => {
                // TODO: Make a const for this guid.
                if (value == self.accountingSystemOther()) {
                    self.validation.toggleValidators(['input-acounting-system-other'], [true]);
                    self.controls['input-acounting-system-other'].val('');
                    $('#div-electronic-accounting-system-other').show('fast');
                } else {
                    self.validation.toggleValidators(['input-acounting-system-other'], [false]);
                    $('#div-electronic-accounting-system-other').hide('fast');
                }
            });

            //
            this.controls['input-any-other-business-loans'].click((arg, name, curr, next) => {
                if (next == 'Yes') {
                    self.validation.toggleValidators(['control-who-is-this-loan-from'], [true]);
                    $('#div-any-other-business-loans').show('fast');
                } else {
                    self.validation.toggleValidators(['control-who-is-this-loan-from'], [false]);
                    $('#div-any-other-business-loans').hide('fast');
                }
            });

            //
            this.controls['input-any-business-transactions-through-personal-accounts'].click((arg, name, curr, next) => {
                if (next == 'Yes') {
                    self.validation.toggleValidators(['select-who-do-you-bank-with-personally'], [true]);
                    $('#div-any-business-transactions-through-personal-accounts').show('fast');
                } else {
                    self.validation.toggleValidators(['select-who-do-you-bank-with-personally'], [false]);
                    $('#div-any-business-transactions-through-personal-accounts').hide('fast');
                }
            });

            //
            this.controls['input-use-payroll-system-for-staff-payslips'].click((arg, name, curr, next) => {
                if (next == 'Yes') {
                    self.validation.toggleValidators(['select-which-electronic-payroll-system'], [true]);
                    $('#div-use-payroll-system-for-staff-payslips').show('fast');
                } else {
                    self.validation.toggleValidators(['select-which-electronic-payroll-system'], [false]);
                    self.validation.toggleValidators(['input-payroll-system-other'], [false]);
                    $('#div-payroll-system-other').hide('fast');
                    $('#div-use-payroll-system-for-staff-payslips').hide('fast');
                }
            });

            ////
            this.controls['select-which-electronic-payroll-system'].change((value, text) => {
                // TODO: Make a const for this guid.
                if (value == self.payrollSystemOther()) {
                    self.validation.toggleValidators(['input-payroll-system-other'], [true]);
                    self.controls['input-payroll-system-other'].val('');
                    $('#div-payroll-system-other').show('fast');
                } else {
                    self.validation.toggleValidators(['input-payroll-system-other'], [false]);
                    $('#div-payroll-system-other').hide('fast');
                }
            });

            this.controls['bankaccservices'].click(function (arg, name, value, checked) {
                if (value == self.businessType_NoneOfTheAbove()) {
                    if (checked == true) {
                        self.controls['bankaccservices'].valAll(false);
                        self.controls['bankaccservices'].val(self.businessType_NoneOfTheAbove(), true);
                    } else {
                    }
                } else {
                    self.controls['bankaccservices'].val(self.businessType_NoneOfTheAbove(), false);
                }
            });

            this.controls['select-business-account-bank'].change((value, text) => {
                if (value == self.bankAccountOther()) {
                    $('#div-bank-account-services').hide();
                    self.validation.toggleValidators(['bankaccservices'], [false]);
                } else {
                    $('#div-bank-account-services').show();
                    self.validation.toggleValidators(['bankaccservices'], [true]);
                }
            });

            this.controls['input-existing-insurance-policies-in-place'].click((arg, name, curr, checked) => {
                self.controls['check-business-insurance-type'].valAll(false);
                self.hasBusinessInsurance(checked == 'Yes');
                self.businessInsuranceOther(false);
            });

            this.controls['check-business-insurance-type'].click((arg, name, curr, value) => {
                self.businessInsuranceOther(curr == self.getBusinessInsuranceOther() && value == true);
                self.controls['input-business-insurance-other'].val('');
            });
        }

        collateralOther() {
            return null;
        }

        collateralNone() {
            return null;
        }

        securityOther() {
            return null;
        }

        securityNone() {
            return null;
        }

        sourceOfFundsOther() {
            return null;
        }

        bankAccountOther() {
            return null;
        }

        accountingSystemOther() {
            return null;
        }

        payrollSystemOther() {
            return null;
        }

        businessType_NoneOfTheAbove() {
            return null;
        }

        bankAccountOther() {
            return null;
        }

        getBusinessInsuranceOther() {
            return null;
        }

    }

    page.create = function (id) {
        return new FinancialInfoPage(id);
    }

    page.FinancialInfoPage = FinancialInfoPage;

})(app.wizard.financialInfo.page);
