"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.intro == undefined) {
    app.wizard.intro = {};
}

if (app.wizard.intro.validator == undefined) {
    app.wizard.intro.validator = {};
}

(function (validator) {

    class ___TENANT___ extends app.wizard.intro.validator.Finfind {
        constructor(id) {
            super(id);
        }
    }

    validator.create = function (id) {
        return new ___TENANT___(id);
    };

    validator.___TENANT___ = ___TENANT___;

})(app.wizard.intro.validator);
