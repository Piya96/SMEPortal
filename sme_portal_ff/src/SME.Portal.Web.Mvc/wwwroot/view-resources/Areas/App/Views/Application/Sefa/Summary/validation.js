"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard.summary == undefined) {
    app.wizard.summary = {};
}

if (app.wizard.summary.validator == undefined) {
    app.wizard.summary.validator = {};
}

(function (validator) {

    class Sefa extends app.wizard.validator.Base {
        constructor(id) {
            super(id);
        }

        addValidations() {
            super.addValidations();

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

    validator.create = function (id) {
        return new Sefa(id);
    };

    validator.Sefa = Sefa;

})(app.wizard.summary.validator);
