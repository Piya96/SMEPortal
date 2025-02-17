"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.summary == undefined) {
    app.wizard.summary = {};
}

if (app.wizard.summary.validator == undefined) {
    app.wizard.summary.validator = {};
}

(function (validator) {

    class ECDC extends app.wizard.validator.Base {
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
                        defaultMessageContainer: true
                    })
                }
            }
            );
            return f;
        }
    }

    validator.create = function (id) {
        return new ECDC(id);
    };

    validator.ECDC = ECDC;

})(app.wizard.summary.validator);
