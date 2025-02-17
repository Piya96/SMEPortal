"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.companyInfo == undefined) {
    app.wizard.companyInfo = {};
}

if (app.wizard.companyInfo.validator == undefined) {
    app.wizard.companyInfo.validator = {};
}

(function (validator) {

    class Finfind extends app.wizard.companyInfo.validator.Baseline {
        constructor(id) {
            super(id);
        }

        pemranentEmployeeCheck() {
            return null;
        }

        addValidations() {
            let fv = super.addValidations();

            let self = this;

            return fv;
        }
    }

    validator.create = function (id) {
        return new Finfind(id);
    };

    validator.Finfind = Finfind;

})(app.wizard.companyInfo.validator);
