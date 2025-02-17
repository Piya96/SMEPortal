"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.validator == undefined) {
    app.wizard.validator = {};
}

if (app.wizard.owner.validator == undefined) {
    app.wizard.owner.validator = {};
}

(function (validator) {

    class ___TENANT___ extends app.wizard.owner.validator.Finfind {
        constructor(id) {
            super(id);
        }
    }

    validator.create = function (id) {
        return new ___TENANT___(id);
    };

    validator.___TENANT___ = ___TENANT___;

})(app.wizard.owner.validator);
