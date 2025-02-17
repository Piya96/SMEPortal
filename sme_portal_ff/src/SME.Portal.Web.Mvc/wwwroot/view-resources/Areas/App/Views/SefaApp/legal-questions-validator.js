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

if (app.wizard.financialInfo.validation == undefined) {
    app.wizard.financialInfo.validation = {};
}

(function (validation) {

    class LegalQuestionsValidator extends app.wizard.validation.Validation {
        constructor(id) {
            super(id);
        }

        addValidations() {
            super.addValidations();

            this.validations.map.set('select-method-of-repayment', 'message-method-of-repayment');
            this.validations.map.set('select-own-or-rent-business-premises', 'message-own-or-rent-business-premises');

            this.validations.map.set('input-existing-insurance-policies-in-place', 'message-existing-insurance-policies-in-place');
            this.validations.map.set('check-business-insurance-type', 'message-business-insurance-type');
            this.validations.map.set('input-business-insurance-other', 'message-business-insurance-other');

            this.validations.map.set('select-type-of-collateral', 'message-type-of-collateral');
            this.validations.map.set('input-type-of-collateral-other', 'message-type-of-collateral-other');
            this.validations.map.set('input-value-of-collateral', 'message-value-of-collateral');

            this.validations.map.set('select-type-of-security', 'message-type-of-security');
            this.validations.map.set('input-type-of-security-other', 'message-type-of-security-other');
            this.validations.map.set('input-value-of-security', 'message-value-of-security');

            this.validations.map.set('input-company-contribution', 'message-company-contribution');
            this.validations.map.set('select-source-of-funds-company', 'message-source-of-funds-company');
            this.validations.map.set('input-source-of-funds-company-other', 'message-source-of-funds-company-other');
            this.validations.map.set('select-annual-turnover', 'message-annual-turnover');
            this.validations.map.set('select-financial-year-end', 'message-financial-year-end');
            this.validations.map.set('select-business-account-bank', 'message-business-account-bank');
            this.validations.map.set('bankaccservices', 'message-bankaccservices');
            this.validations.map.set('input-has-electronic-accounting-system', 'message-has-electronic-accounting-system');
            this.validations.map.set('select-which-accounting-system-do-you-have', 'message-which-accounting-system-do-you-have');
            this.validations.map.set('input-acounting-system-other', 'message-acounting-system-other');
            this.validations.map.set('input-permit-sefa-to-call-data-from-accounting-system-monthly', 'message-permit-sefa-to-call-data-from-accounting-system-monthly');
            this.validations.map.set('input-any-other-business-loans', 'message-any-other-business-loans');
            this.validations.map.set('control-who-is-this-loan-from', 'message-who-is-this-loan-from');
            this.validations.map.set('input-any-business-transactions-through-personal-accounts', 'message-any-business-transactions-through-personal-accounts');
            this.validations.map.set('select-who-do-you-bank-with-personally', 'message-who-do-you-bank-with-personally');
            this.validations.map.set('input-use-payroll-system-for-staff-payslips', 'message-use-payroll-system-for-staff-payslips');
            this.validations.map.set('select-which-electronic-payroll-system', 'message-which-electronic-payroll-system');
            this.validations.map.set('input-payroll-system-other', 'message-payroll-system-other');

            this.validations.map.set('select-has-owners-loan-account', 'message-has-owners-loan-account');

            let self = this;
            let f = FormValidation.formValidation(
                document.getElementById(this.id), {
                    fields: {
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        bootstrap: new FormValidation.plugins.Bootstrap({
                            defaultMessageContainer: false
                        }),
                        messages: new FormValidation.plugins.Message({
                            clazz: 'text-danger',
                            container: function (field, element) {
                                if (self.validations.map.has(field) == true) {
                                    let data = self.validations.map.get(field);
                                    return document.getElementById(data);
                                } else {
                                    return document.getElementById(self.id);
                                }
                            }
                        })
                    }
                }
            );

            function addGroup(fv) {
                fv.addField(
                    'select-method-of-repayment',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'select-own-or-rent-business-premises',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-existing-insurance-policies-in-place',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Yes or No Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'select-type-of-collateral',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-type-of-collateral-other',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-value-of-collateral',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            }
                        }
                    }
                );
                fv.addField(
                    'select-type-of-security',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-type-of-security-other',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-value-of-security',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-company-contribution',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    let value = self.helpers.RemoveSpaces(arg.value);
                                    value = parseInt(value);
                                    let valid = isNaN(value) == false;
                                    setTimeout(() => {
                                        self.pageCallback.onValidateField('input-company-contribution', valid, value);
                                    }, 10);
                                    return true;
                                }
                            }
                        }
                    }
                );
                fv.addField(
                    'select-source-of-funds-company',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-source-of-funds-company-other',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            }
                        }
                    }
                );
                fv.addField(
                    'select-annual-turnover',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'select-financial-year-end',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'select-business-account-bank',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'bankaccservices',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Select one or more options above'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-has-electronic-accounting-system',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Yes or No Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'select-which-accounting-system-do-you-have',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-acounting-system-other',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-permit-sefa-to-call-data-from-accounting-system-monthly',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Yes or No Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-any-other-business-loans',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Yes or No Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'control-who-is-this-loan-from',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Select one or more options above'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-any-business-transactions-through-personal-accounts',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Yes or No Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'select-who-do-you-bank-with-personally',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-use-payroll-system-for-staff-payslips',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Yes or No Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'select-which-electronic-payroll-system',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-payroll-system-other',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                //fv.addField(
                //    'input-has-business-insurance',
                //    {
                //        validators: {
                //            notEmpty: {
                //                message: 'Yes or No Required'
                //            }
                //        }
                //    }
                //);
                fv.addField(
                    'check-business-insurance-type',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Select one or more options above'
                            }
                        }
                    }
                );
                fv.addField(
                    'input-business-insurance-other',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'select-has-owners-loan-account',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    }
                );
            }

            addGroup(f);


            return f;
        }
    }

    validation.create = function (id) {
        return new LegalQuestionsValidator(id);
    };

    validation.LegalQuestionsValidator = LegalQuestionsValidator;

})(app.wizard.financialInfo.validation);
