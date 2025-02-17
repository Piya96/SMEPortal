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

    class ___TENANT___ extends app.wizard.companyInfo.validator.Finfind {
        constructor(id) {
            super(id);
        }
    }

    validator.create = function (id) {
        return new ___TENANT___(id);
    };

    validator.___TENANT___ = ___TENANT___;

})(app.wizard.companyInfo.validator);
