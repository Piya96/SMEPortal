"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.financialInfo == undefined) {
    app.wizard.financialInfo = {};
}

if (app.wizard.financialInfo.page == undefined) {
    app.wizard.financialInfo.page = {};
}

(function (page) {

    class ___TENANT___ extends app.wizard.financialInfo.page.Finfind {
        constructor(id) {
            super(id);
            this.name = '___TENANT___ Financial Info Page';
        }
    }

    page.create = function (id) {
        return new ___TENANT___(id);
    }

    page.___TENANT___ = ___TENANT___;

})(app.wizard.financialInfo.page);
