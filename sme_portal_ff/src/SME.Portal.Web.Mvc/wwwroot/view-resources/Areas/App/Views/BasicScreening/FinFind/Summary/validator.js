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

    class Finfind extends app.wizard.summary.validator.Baseline {
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

})(app.wizard.summary.validator);
