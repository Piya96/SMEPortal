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

    class CompanyPartners extends app.wizard.owner.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Company Partners Owner Profile Page';
        }
    }

    page.create = function (id) {
        return new CompanyPartners(id);
    }

    page.CompanyPartners = CompanyPartners;

})(app.wizard.owner.page);
