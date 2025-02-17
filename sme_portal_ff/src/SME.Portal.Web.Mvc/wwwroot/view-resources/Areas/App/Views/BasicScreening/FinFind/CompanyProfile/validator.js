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

    class Finfind extends app.wizard.business.validator.Baseline {
        constructor(id) {
            super(id);
        }

        addFields(fv) {
            super.addFields(fv);
        }
    }

    validator.create = function (id) {
        return new Finfind(id);
    };

    validator.Finfind = Finfind;

})(app.wizard.business.validator);
