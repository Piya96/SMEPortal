/*
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

    class SupportDocumentsValidator extends app.wizard.validation.Validation {
        constructor(id) {
            super(id);
        }

        addValidations() {
            super.addValidations();

            let self = this;
            let f = FormValidation.formValidation(
                document.getElementById(this.id), {
                    fields: {
                        'input-document': {
                            validators: {
                                notEmpty: {
                                    message: 'Yes or no required'
                                }
                            }
                        }
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
                                    return document.getElementById(data.message);
                                } else {
                                    return document.getElementById(self.id);
                                }
                            }
                        })
                    }
                }
            );
            return f;
        }
    }

    validation.getSupportDocumentsValidator = function (id) {
        return new SupportDocumentsValidator(id);
    };

})(app.wizard.validation);
*/
