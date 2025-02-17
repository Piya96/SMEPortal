"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.lenderDocuments == undefined) {
    app.wizard.lenderDocuments = {};
}

if (app.wizard.lenderDocuments.validator == undefined) {
    app.wizard.lenderDocuments.validator = {};
}

(function (validator) {

    class ___TENANT___ extends app.wizard.lenderDocuments.validator.Finfind {
        constructor(id) {
            super(id);
        }
    }

    validator.create = function (id) {
        return new ___TENANT___(id);
    };

    validator.___TENANT___ = ___TENANT___;

})(app.wizard.lenderDocuments.validator);
