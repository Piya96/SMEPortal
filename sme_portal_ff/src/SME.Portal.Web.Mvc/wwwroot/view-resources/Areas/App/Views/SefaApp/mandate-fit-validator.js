"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.validation == undefined) {
    app.wizard.validation = {};
}

(function (validation) {

    class MandateFitValidator extends app.wizard.validation.Validation {
        constructor(id) {
            super(id);
        }

        //input-mandate-fit-forecast-cash-flow-repayable

        addValidations() {
            super.addValidations();

            let self = this;
            let f = FormValidation.formValidation(
                document.getElementById(this.id), {
                fields: {
                    'input-mandate-fit-loan-amount': {
                        validators: {
                            notEmpty: {
                                message: 'Load amount required'
                            }
                        }
                    },
                    'select-mandate-fit-reason-for-finance': {
                        validators: {
                            notEmpty: {
                                message: 'Selection required'
                            }
                        }
                    },
                    'input-mandate-fit-forecast-cash-flow-repayable': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },
                    'input-mandate-fit-conflict-of-interest-at-sefa': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },
                    'input-mandate-fit-operations-within-boarders-sa': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },
                    'input-mandate-fit-controlling-interest-greater-than-50': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },
                    'input-mandate-fit-shareholder-involved': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },
                    'input-mandate-fit-management-team-has-xp-skills': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },
                    'input-mandate-fit-cipc-annual-fees-paid': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },
                    'input-mandate-fit-tax-in-good-standing-pin-not-expired': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    }
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
                    //            return document.getElementById(data.message);
                    //        } else {
                    //            return document.getElementById(self.id);
                    //        }
                    //    }
                    //})
                }
            }
            );
            return f;
        }
    }

    validation.getMandateFitValidator = function (id) {
        return new MandateFitValidator(id);
    };

})(app.wizard.validation);
