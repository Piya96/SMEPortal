"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.business == undefined) {
    app.wizard.business = {};
}

if (app.wizard.business.validator == undefined) {
    app.wizard.business.validator = {};
}

(function (validator) {

    class Baseline extends app.wizard.validator.Base {
        constructor(id) {
            super(id);
        }

        addFields(fv) {
            let self = this;
            fv.addField(
                'input-company-profile-tax-reference-number',
                {
                    validators: {
                        callback: {
                            message: 'TAX reference number required',
                            callback: function (arg) {
                                if (arg.value != '' && arg.value != null && arg.value.length == 10) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                }
            );

            fv.addField(
                'input-registered-for-uif',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select Yes or No'
                        }
                    }
                }
            );

            fv.addField(
                'input-uif-number',
                {
                    validators: {
                        notEmpty: {
                            message: 'UIF number required'
                        }
                    }
                }
            );

            fv.addField(
                'input-company-profile-registered-address',
                {
                    validators: {
                        notEmpty: {
                            message: 'Registered address requried'
                        }
                    }
                }
            );

            fv.addField(
                'input-company-profile-address-line1',
                {
                    validators: {
                        notEmpty: {
                            message: 'Address requried'
                        }
                    }
                }
            );

            fv.addField(
                'input-company-profile-name',
                {
                    validators: {
                        notEmpty: {
                            message: 'Business name required'
                        }
                    }
                }
            );

            fv.addField(
                'select-company-profile-type',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection required'
                        }
                    }
                }
            );

            fv.addField(
                'input-company-profile-city',
                {
                    validators: {
                        notEmpty: {
                            message: 'City / town required'
                        }
                    }
                }
            );

            fv.addField(
                'input-company-profile-postal-code',
                {
                    validators: {
                        notEmpty: {
                            message: 'Postal code required'
                        },
                        callback: {
                            message: 'Postal code required',
                            callback: function (arg) {
                                if (arg.value == '') {
                                    return true;
                                } else {
                                    let result = self.pageCallback.onValidateField('input-company-profile-postal-code', true, arg.value);
                                    if (result == 0) {
                                        return true;
                                    } else if (result == 1) {
                                        return {
                                            valid : false,
                                            message: 'Postal Code must be within the selected province range.'
                                        };
                                    } else {
                                        return {
                                            valid: false,
                                            message: 'Postal Code must be within Eastern Cape Area Code range.'
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            );

            fv.addField(
                'select-company-profile-province',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection requried'
                        }
                    }
                }
            );

            fv.addField(
                'select-sic-section',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection requried'
                        }
                    }
                }
            );

            fv.addField(
                'select-sic-division',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection requried'
                        }
                    }
                }
            );

            fv.addField(
                'select-sic-group',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection requried'
                        }
                    }
                }
            );

            fv.addField(
                'select-sic-class',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection requried'
                        }
                    }
                }
            );

            fv.addField(
                'select-sic-sub-class',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection requried'
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
                    //            return document.getElementById(data.message);
                    //        } else {
                    //            return document.getElementById(self.id);
                    //        }
                    //    }
                    //})
                    }
                }
            );
            this.addFields(fv);
            return fv;
        }
    }

    validator.create = function (id) {
        return new Baseline(id);
    };

    validator.Baseline = Baseline;

})(app.wizard.business.validator);
