"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.summary == undefined) {
    app.wizard.summary = {};
}

if (app.wizard.summary.page == undefined) {
    app.wizard.summary.page = {};
}

(function (page) {

    class CompanyPartners extends app.wizard.summary.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Company Partners Summary Page';
        }
    }

    page.create = function (id) {
        return new CompanyPartners(id);
    }

    page.CompanyPartners = CompanyPartners;

})(app.wizard.summary.page);
