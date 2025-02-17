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

if (app.wizard.business.validator == undefined) {
    app.wizard.business.validator = {};
}

(function (validator) {

    class ___TENANT___ extends app.wizard.business.validator.Finfind {
        constructor(id) {
            super(id);
        }
    }

    validator.create = function (id) {
        return new ___TENANT___(id);
    };

    validator.___TENANT___ = ___TENANT___;

})(app.wizard.business.validator);
