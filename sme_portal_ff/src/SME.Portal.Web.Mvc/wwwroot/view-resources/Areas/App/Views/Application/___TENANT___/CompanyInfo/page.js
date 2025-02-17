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

if (app.wizard.companyInfo.page == undefined) {
    app.wizard.companyInfo.page = {};
}

(function (page) {

    class ___TENANT___ extends app.wizard.companyInfo.page.Finfind {

        constructor(id) {
            super(id);
            this.name = '___TENANT__ Company Info Page';
        }
    }

    page.create = function (id) {
        return new ___TENANT___(id);
    }

    page.___TENANT___ = ___TENANT___;

})(app.wizard.companyInfo.page);
