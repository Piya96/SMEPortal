"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.owner == undefined) {
    app.wizard.owner = {};
}

if (app.wizard.owner.validator == undefined) {
    app.wizard.owner.validator = {};
}

(function (validator) {

    class Finfind extends app.wizard.owner.validator.Baseline {
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

})(app.wizard.owner.validator);
