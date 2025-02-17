"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.business == undefined) {
    app.wizard.business = {};
}

if (app.wizard.business.page == undefined) {
    app.wizard.business.page = {};
}

(function (page) {

    class ___TENANT___ extends app.wizard.business.page.Finfind {
        constructor(id) {
            super(id);
            this.name = '___TENANT___ Business Profile Page';
        }
    }

    page.create = function (id) {
        return new ___TENANT___(id);
    }

    page.___TENANT___ = ___TENANT___;

})(app.wizard.business.page);
