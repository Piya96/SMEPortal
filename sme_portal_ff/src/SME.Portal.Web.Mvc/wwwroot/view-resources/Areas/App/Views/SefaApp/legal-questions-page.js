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

    const BankAccountOther = '5c86148eb069b41688f61c8f';

    const CollateralOther = '62c6f856c50341864eb71970';
    const CollateralNone = '4586ac64fbd24de3ae3e231d87fb6d4e';

    const SecurityOther = '62c6f91ead740b088bee2947';
    const SecurityNone = '93ce8e429c1542bdbc63674035a8cb19';

    const SourceOfFundsOther = '6278d3714d04c757940db02e';

    const AccountingSystemOther = '60d194ba05955b09d12f35e9';

    const PayrollSystemOther = '60d19618eac92464d407fb6c';

    const BusinessInsuranceOther = '64a52c4d3fe521609555ef70';

    class LegalQuestionsPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Legal Questions Page';
            this.leaseAgreement = {
                has: false,
                need : false
            };
            this.insurancePolicy = {
                has: false,
                need: false
            };
        }

        validate(data, cb) {
            cb(app.wizard.addResult());
        }

        serialize() {
            return super.serialize();
        }

        hasBusinessInsurance(show) {
            if (show == true) {
                this.validation.toggleValidators(['check-business-insurance-type'], [true]);
                $('#div-business-insurance-type').show('fast');
            } else {
                this.validation.toggleValidators(['check-business-insurance-type'], [false]);
                $('#div-business-insurance-type').hide('fast');
            }
        }

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

        dtoToPage(dto) {
            // TODO: Call ECDC's DtoToPage apply method to replace this.
            let self = this;

            function getVal(name) {
                return self.helpers.getNvpValue(dto, name, 0);
            }

            function setVal(name) {
                let value = getVal(name);
                self.controls[name].val(value);
                return value;
            }

            function setCur(name) {
                let value = getVal(name);
                let result = self.helpers.RemoveSpaces(value);
                value = self.helpers.formatCurrency(value);
                self.controls[name].val(value);
                return result;
            }

            function setValues(name) {
                let valArr = [];
                if (dto != null && dto.hasOwnProperty(name) == true) {
                    dto[name].forEach((guid, idx) => {
                        self.controls[name].val(guid, true);
                        valArr.push(guid);
                    });
                }
                return valArr;
            }

            let val = null;
            setVal('select-method-of-repayment');

            val = setVal('select-own-or-rent-business-premises');
            if (val == 1 && self.leaseAgreement.has == false) {
                self.leaseAgreement.need = true;
            }

            val = setVal('input-existing-insurance-policies-in-place');
            // TODO: Look at taking insurancePolicy.has OUT.
            //if (val == 'Yes' && self.insurancePolicy.has == false) {
            //    self.insurancePolicy.need = true;
            //}
            //val = setVal('input-has-business-insurance');
            if (val == 'Yes') {
                self.controls['check-business-insurance-type'].valAll(false);
                let valArr = setValues('check-business-insurance-type');
                self.hasBusinessInsurance(true);

                let show = valArr.length > 0 && valArr[0] == self.getBusinessInsuranceOther();
                self.businessInsuranceOther(show);
                setVal('input-business-insurance-other', false);
            } else {
                self.hasBusinessInsurance(false);
                self.businessInsuranceOther(false);
            }

            val = setVal('select-type-of-collateral');
            if (val == self.collateralOther()) {
                $('#div-type-of-collateral-other').show('fast');
                $('#div-value-of-collateral').show('fast');
            } else if (val == self.collateralNone()) {
                self.validation.toggleValidators(['input-type-of-collateral-other'], [false]);
                self.validation.toggleValidators(['input-value-of-collateral'], [false]);
            } else {
                $('#div-value-of-collateral').show('fast');
                self.validation.toggleValidators(['input-type-of-collateral-other'], [false]);
            }
            setVal('input-type-of-collateral-other');
            setCur('input-value-of-collateral');

            val = setVal('select-type-of-security');
            if (val == self.securityOther()) {
                $('#div-type-of-security-other').show('fast');
                $('#div-value-of-security').show('fast');
            } else if (val == self.securityNone()) {
                self.validation.toggleValidators(['input-type-of-security-other'], [false]);
                self.validation.toggleValidators(['input-value-of-security'], [false]);
            } else {
                $('#div-value-of-security').show('fast');
                self.validation.toggleValidators(['input-type-of-security-other'], [false]);
            }
            setVal('input-type-of-security-other');
            setCur('input-value-of-security');

            let value = setCur("input-company-contribution");
            value = parseInt(value);
            if (isNaN(value) == true || value == 0) {
                $('#div-source-of-funds-company').hide('fast');
                self.validation.toggleValidators(['select-source-of-funds-company'], [false]);
            } else {
                $('#div-source-of-funds-company').show('fast');
                self.validation.toggleValidators(['select-source-of-funds-company'], [true]);
            }

            val = setVal('select-source-of-funds-company');
            if (val == self.sourceOfFundsOther()) {
                $('#div-source-of-funds-company-other').show('fast');
                self.validation.toggleValidators(['input-source-of-funds-company-other'], [true]);
                setVal('input-source-of-funds-company-other');

            } else {
                self.validation.toggleValidators(['input-source-of-funds-company-other'], [false]);
            }
            setVal('select-annual-turnover');
            setVal('select-financial-year-end');
            val = setVal('select-business-account-bank');

            if (val == self.bankAccountOther()) {
                $('#div-bank-account-services').hide();
                self.validation.toggleValidators(['bankaccservices'], [false]);
            } else {
                $('#div-bank-account-services').show();
                self.validation.toggleValidators(['bankaccservices'], [true]);
                setValues('bankaccservices');
            }

            val = setVal('input-has-electronic-accounting-system');
            if (val == 'Yes') {
                $('#div-has-electronic-accounting-system').show();
                self.validation.toggleValidators(['input-permit-sefa-to-call-data-from-accounting-system-monthly'], [true]);
                self.validation.toggleValidators(['select-which-accounting-system-do-you-have'], [true]);
                val = setVal('input-permit-sefa-to-call-data-from-accounting-system-monthly');
                val = setVal('select-which-accounting-system-do-you-have');

                if (val == self.accountingSystemOther()) {
                    $('#div-electronic-accounting-system-other').show();
                    self.validation.toggleValidators(['input-acounting-system-other'], [true]);
                    val = setVal('input-acounting-system-other');
                } else {
                    self.validation.toggleValidators(['input-acounting-system-other'], [false]);
                }
            } else {
                self.validation.toggleValidators(['input-permit-sefa-to-call-data-from-accounting-system-monthly'], [false]);
                self.validation.toggleValidators(['select-which-accounting-system-do-you-have'], [false]);
                self.validation.toggleValidators(['input-acounting-system-other'], [false]);
            }

            val = setVal('input-any-other-business-loans');
            if (val == 'Yes') {
                $('#div-any-other-business-loans').show();
                self.validation.toggleValidators(['control-who-is-this-loan-from'], [true]);
                let arr = self.helpers.getPropEx(dto, "control-who-is-this-loan-from", []);
                setValues('control-who-is-this-loan-from');

            } else {
                self.validation.toggleValidators(['control-who-is-this-loan-from'], [false]);
            }

            val = setVal('input-any-business-transactions-through-personal-accounts');
            if (val == 'Yes') {
                $('#div-any-business-transactions-through-personal-accounts').show();
                self.validation.toggleValidators(['select-who-do-you-bank-with-personally'], [true]);
                val = setVal('select-who-do-you-bank-with-personally');
            } else {
                self.validation.toggleValidators(['select-who-do-you-bank-with-personally'], [false]);
            }

            val = setVal('input-use-payroll-system-for-staff-payslips');
            if (val == 'Yes') {
                $('#div-use-payroll-system-for-staff-payslips').show();
                self.validation.toggleValidators(['select-which-electronic-payroll-system'], [true]);
                val = setVal('select-which-electronic-payroll-system');
                if (val == self.payrollSystemOther()) {
                    $('#div-payroll-system-other').show();
                    self.validation.toggleValidators(['input-payroll-system-other'], [true]);
                    val = setVal('input-payroll-system-other');
                } else {
                    self.validation.toggleValidators(['input-payroll-system-other'], [false]);
                }
            } else {
                self.validation.toggleValidators(['select-which-electronic-payroll-system'], [false]);
                self.validation.toggleValidators(['input-payroll-system-other'], [false]);
            }

            val = setVal('select-has-owners-loan-account');
        }

        pageToDto(dto) {
        }

        reset() {
        }

        setDocumentUploads(cb) {
            // Call some service api to check if documents have been uploaded.
            cb(app.wizard.addResult());
        }

        load(args, cb) {
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            let dto = this.helpers.nvpArrayToObject(mc);
            this.dtoToPage(dto);
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            super.attention(args, cb);
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
                if (value == 1 && self.leaseAgreement.has == false) {
                    self.leaseAgreement.need = true;
                } else {
                    self.leaseAgreement.need = false;
                    if (self.insurancePolicy.need == false) {
                    }
                }
            });

            this.controls['input-existing-insurance-policies-in-place'].click((arg, name, curr, next) => {
                if (next == 'Yes' && self.insurancePolicy.has == false) {
                    self.insurancePolicy.need = true;
                } else {
                    if (self.leaseAgreement.need == false) {
                    }
                }
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
            //this.controls['input-has-business-insurance'].click((arg, name, curr, checked) => {
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

        businessType_NoneOfTheAbove() {
            return BusinessType.NoneOfTheAbove;
        }

        bankAccountOther() {
            return BankAccountOther;
        }

        getBusinessInsuranceOther() {
            return BusinessInsuranceOther;
        }
    }

    page.create = function (id) {
        return new LegalQuestionsPage(id);
    }

    page.LegalQuestionsPage = LegalQuestionsPage;

})(app.wizard.financialInfo.page);
