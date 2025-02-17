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

    class ___TENANT___ extends app.wizard.keyThings.validator.Finfind {
        constructor(id) {
            super(id);
        }
    }

    validator.create = function (id) {
        return new ___TENANT___(id);
    };

    validator.___TENANT___ = ___TENANT___;

})(app.wizard.keyThings.validator);
