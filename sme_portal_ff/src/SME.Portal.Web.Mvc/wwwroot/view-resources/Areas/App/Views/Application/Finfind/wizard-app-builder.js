// A wizard page should have a minimum set of methods that will be implemented
// by page specific object which is derived from a base wizard page object.

// The base wizard page will implement an interface defined by base wizard controller
// so it can be sent notification from the controller key to the wizard flow process.

"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.builder2 == undefined) {
    app.wizard.builder2 = {};
}

(function (builder2) {

    builder2.init = function (model, cb = null) {

        let pages = [];

        pages.push({
            page: app.wizard.intro.page.create('div-disclaimer'),
            validator: app.wizard.intro.validator.create('div-disclaimer')
        });

        pages.push({
            page: app.wizard.fundingRequirements.page.create('div-funding-requirements'),
            validator: app.wizard.fundingRequirements.validator.create('div-funding-requirements')
        });

        pages.push({
            page: app.wizard.companyInfo.page.create('div-company-info'),
            validator: app.wizard.companyInfo.validator.create('div-company-info')
        });

        // NEW
        pages.push({
            page: app.wizard.financialInfo.page.create('div-financial-info'),
            validator: app.wizard.financialInfo.validator.create('div-financial-info')
        });

        pages.push({
            page: app.wizard.lenderDocuments.page.create('div-lender-documents'),
            validator: app.wizard.lenderDocuments.validator.create('div-lender-documents')
        });

        pages.push({
            page: app.wizard.keyThings.page.create('div-key-things'),
            validator: app.wizard.keyThings.validator.create('div-key-things')
        });

        pages.push({
            page: app.wizard.summary.page.create('div-summary'),
            validator: app.wizard.summary.validator.create('div-summary')
        });

        let common = app.wizard.page.getCommon();

        pages.forEach(function (obj, idx) {
            obj.page.init({
                'validator': obj.validator,
                'common' : common
            });
            obj.validator.init({
                'page' : obj.page
            });
        });

        let appController = app.wizard.controller.create('div-wizard', 'div-body');
        appController.init({
            'pages': pages,
            'common': common
        }, cb);

        appController.load(model, function (result) {
            $('#div-funder-search-wizard').fadeIn(500, 'swing');
            cb('loaded', null);
        });
    }

})(app.wizard.builder2);
