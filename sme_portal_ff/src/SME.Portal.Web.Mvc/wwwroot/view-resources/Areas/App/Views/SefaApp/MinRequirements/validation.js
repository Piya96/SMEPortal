"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.minRequirements == undefined) {
    app.wizard.minRequirements = {};
}

if (app.wizard.minRequirements.validation == undefined) {
    app.wizard.minRequirements.validation = {};
}

(function (validation) {

    class MinRequirementsValidator extends app.wizard.validation.Validation {
        constructor(id) {
            super(id);
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
            return fv;
        }
    }

    validation.create = function (id) {
        return new MinRequirementsValidator(id);
    };

})(app.wizard.minRequirements.validation);
