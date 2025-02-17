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

if (app.wizard.builder == undefined) {
    app.wizard.builder = {};
}

(function (builder) {

    builder.init = function (model, cb = null) {

        let pages = [];
        pages.push({
            page: app.wizard.page.getDisclaimerPage('id-div-disclaimer'),
            validator: app.wizard.intro.validator.create('id-div-disclaimer')
        });

        pages.push({
            page: app.wizard.page.getMandateFitPage('id-div-mandate-fit'),
            validator: app.wizard.mandateFit.validator.create('id-div-mandate-fit')
        });

        pages.push({
            page: app.wizard.page.getFundingRequirementsPage('id-div-funding-requirements'),
            validator: app.wizard.companyInfo.validator.create('id-div-funding-requirements')
        });

        pages.push({
            page: app.wizard.financialInfo.page.create('id-div-legal-questions'),
            validator: app.wizard.financialInfo.validator.create('id-div-legal-questions')
        });

        pages.push({
            page: app.wizard.minRequirements.page.create('div-key-things'),
            validator: app.wizard.minRequirements.validator.create('div-key-things')
        });

        pages.push({
            page: app.wizard.page.getSummaryPage('id-div-summary'),
            validator: app.wizard.summary.validator.create('id-div-summary')
        });

        let common = app.wizard.page.getCommon();

        pages.forEach(function (obj, idx) {
            obj.page.init({
                'validator': obj.validator,
                'common': common
            });
            obj.validator.init({
                'page': obj.page
            });
        });

        let appController = app.wizard.controller.create('kt_wizard_funding', 'funding-application-wizard');
        appController.init({
            'pages': pages,
            'common': common
        }, cb);

        appController.load(model, function (result) {
            $('#id-div-funder-search-wizard').fadeIn(500, 'swing');
        });
    }

})(app.wizard.builder);
