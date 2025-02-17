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

if (app.wizard.intro.page == undefined) {
    app.wizard.intro.page = {};
}

(function (page) {

    class ___TENANT___ extends app.wizard.intro.page.Finfind {
        constructor(id) {
            super(id);
            this.name = '___TENANT___ Intro Page';
        }
    }

    page.create = function (id) {
        return new ___TENANT___(id);
    }

    page.___TENANT___ = ___TENANT___;

})(app.wizard.intro.page);
