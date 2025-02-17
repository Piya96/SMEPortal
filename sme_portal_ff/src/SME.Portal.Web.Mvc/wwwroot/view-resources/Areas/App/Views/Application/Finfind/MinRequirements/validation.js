"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.keyThings == undefined) {
    app.wizard.keyThings = {};
}

if (app.wizard.keyThings.validator == undefined) {
    app.wizard.keyThings.validator = {};
}

(function (validator) {

    class Finfind extends app.wizard.validator.Base {
        constructor(id) {
            super(id);
        }

        addValidations() {
            super.addValidations();

            this.validations.map.set("input-credit-score-declaration", 'message-credit-score-declaration');

            let self = this;

            let fv = FormValidation.formValidation(
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
                            if(self.validations.map.has(field) == true) {
                                let data = self.validations.map.get(field);
                                return document.getElementById(data);
                            } else {
                                return document.getElementById(self.id);
                            }
                        }
                    })
                }
            });
            fv.addField(
                'input-credit-score-declaration',
                {
                    validators: {
                        notEmpty: {
                            message: 'Lenders will require your personal credit report to assess an application. Please consent to credit checking to proceed to the next step'
                        }
                    }
                }
            );
            return fv;
        }
    }

    validator.create = function (id) {
        return new Finfind(id);
    };

    validator.Finfind = Finfind;

})(app.wizard.keyThings.validator);
