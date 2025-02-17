"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.user == undefined) {
    app.wizard.user = {};
}

if (app.wizard.user.page == undefined) {
    app.wizard.user.page = {};
}

(function (page) {

    class ___TENANT___ extends app.wizard.user.page.Finfind {

        constructor(id) {
            super(id);
            this.name = '___TENANT___ User Profile Page';
        }
    }

    page.create = function (id) {
        return new ___TENANT___(id);
    }

    page.___TENANT___ = ___TENANT___;

})(app.wizard.user.page);
