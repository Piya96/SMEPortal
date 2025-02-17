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

if (app.wizard.keyThings.page == undefined) {
    app.wizard.keyThings.page = {};
}

(function (page) {

    class ___TENANT___ extends app.wizard.keyThings.page.Finfind {
        constructor(id) {
            super(id);
            this.name = '___TENANT___ Minimum Requirements Page';
        }
    }

    page.create = function (id) {
        return new ___TENANT___(id);
    }

    page.___TENANT___ = ___TENANT___;

})(app.wizard.keyThings.page);
