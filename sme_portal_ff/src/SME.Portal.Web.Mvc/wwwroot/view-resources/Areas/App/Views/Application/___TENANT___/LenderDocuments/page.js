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

if (app.wizard.lenderDocuments.page == undefined) {
    app.wizard.lenderDocuments.page = {};
}

(function (page) {

    class ___TENANT___ extends app.wizard.lenderDocuments.page.Finfind {
        constructor(id) {
            super(id);
            this.name = '___TENANT___ Lender Documents Page';
        }
    }

    page.create = function (id) {
        return new ___TENANT___(id);
    }

    page.___TENANT___ = ___TENANT___;

})(app.wizard.lenderDocuments.page);
