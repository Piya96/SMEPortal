"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.productMatching == undefined) {
    app.wizard.productMatching = {};
}

if (app.wizard.productMatching.validator == undefined) {
    app.wizard.productMatching.validator = {};
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

})(app.wizard.productMatching.validator);
