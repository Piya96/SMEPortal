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

    class ECDC extends app.wizard.user.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'ECDC User Profile Page';
        }
    }

    page.create = function (id) {
        return new ECDC(id);
    }

    page.ECDC = ECDC;

})(app.wizard.user.page);
