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

if (app.wizard.fundingRequirements.validator == undefined) {
    app.wizard.fundingRequirements.validator = {};
}

(function (validator) {

    const MIN_LOAN_AMOUNT = 1;

    class ECDC extends app.wizard.validator.Base {
        constructor(id) {
            super(id);
        }

        addFields(fv) {
            fv.addField(
                'input-loan-amount',
                {
                    validators: {
                        notEmpty: {
                            message: 'Minimum loan amount of ' + MIN_LOAN_AMOUNT.toString() + ' Rand is required'
                        },
                        callback: {
                            callback: function(args) {
                                let result = parseInt(args.value);
                                return result > 0;
                            },
                            message: 'Loan amount must be greater than 0'
                        }
                    }
                }
            );

            fv.addField(
                'select-town-type',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection required'
                        }
                    }
                }
            );

            fv.addField(
                'date-started-trading-date',
                {
                    validators: {
                        notEmpty: {
                            message: 'Date required'
                        }
                    }
                }
            );

            fv.addField(
                'select-funding-for',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection required'
                        }
                    }
                }
            );

            fv.addField(
                'input-has-contract-for-help-money',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or no required'
                        }
                    }
                }
            );

            fv.addField(
                'input-money-to-help-with-tender',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or no required'
                        }
                    }
                }
            );

            fv.addField(
                'input-purchase-order-funding',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or no required'
                        }
                    }
                }
            );
            fv.addField(
                'select-fund-application-capacity',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection required'
                        }
                    }
                }
            );
            fv.addField(
                'input-involved-in-daily-activities-of-coop',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or no required'
                        }
                    }
                }
            );
            fv.addField(
                'input-any-other-loan-with-ecdc',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or no required'
                        }
                    }
                }
            );
        }


        addValidations() {
            super.addValidations();

            let self = this;
            let fv = FormValidation.formValidation(
                document.getElementById(this.id), {
                fields: {
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap({
                        defaultMessageContainer: true
                    })
                    //messages: new FormValidation.plugins.Message({
                    //    clazz: 'text-danger',
                    //    container: function (field, element) {
                    //        if (self.validations.map.has(field) == true) {
                    //            let data = self.validations.map.get(field);
                    //            return document.getElementById(data);
                    //        } else {
                    //            return document.getElementById(self.id);
                    //        }
                    //    }
                    //})
                }
            });
            this.addFields(fv);
            return fv;
        }
    }

    validator.create = function (id) {
        return new ECDC(id);
    };

    validator.ECDC = ECDC;

})(app.wizard.fundingRequirements.validator);
