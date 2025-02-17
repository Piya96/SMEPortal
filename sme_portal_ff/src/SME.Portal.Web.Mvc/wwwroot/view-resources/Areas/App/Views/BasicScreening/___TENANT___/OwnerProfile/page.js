"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.owner == undefined) {
    app.wizard.owner = {};
}

if (app.wizard.owner.page == undefined) {
    app.wizard.owner.page = {};
}

(function (page) {

    class ___TENANT___ extends app.wizard.owner.page.Finfind {

        constructor(id) {
            super(id);
            this.name = '___TENANT___ Owner Profile Page';
        }
    }

    page.create = function (id) {
        return new ___TENANT___(id);
    }

    page.___TENANT___ = ___TENANT___;

})(app.wizard.owner.page);
