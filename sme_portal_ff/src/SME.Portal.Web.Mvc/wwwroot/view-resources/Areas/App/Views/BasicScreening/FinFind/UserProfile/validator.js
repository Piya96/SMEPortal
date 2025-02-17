"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.user == undefined) {
    app.wizard.user = {};
}

if (app.wizard.user.validator == undefined) {
    app.wizard.user.validator = {};
}

(function (validator) {

    class Finfind extends app.wizard.user.validator.Baseline {
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

})(app.wizard.user.validator);
