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
            page: app.wizard.intro.page.create('div-disclaimer'),
            validator: app.wizard.intro.validator.create('div-disclaimer')
        });

        pages.push({
            page: app.wizard.user.page.create('div-user-profile'),
            validator: app.wizard.user.validator.create('div-user-profile')
        });

        pages.push({
            page: app.wizard.owner.page.create('div-owner-profile'),
            validator: app.wizard.owner.validator.create('div-owner-profile')
        });

        pages.push({
            page: app.wizard.business.page.create('div-company-profile'),
            validator: app.wizard.business.validator.create('div-company-profile')
        });

        pages.push({
            page: app.wizard.summary.page.create('div-summary'),
            validator: app.wizard.summary.validator.create('div-summary')
        });

        let common = app.wizard.common.page.create();

        pages.forEach(function (obj, idx) {
            obj.page.init({
                'validator': obj.validator,
                'common' : common,
                'cb' : cb
            });
            obj.validator.init({
                'page' : obj.page
            });
        });

        let appController = app.wizard.controller.create('div_wizard', 'div-body');
        appController.init({
            'pages': pages,
            'common': common
        }, cb);

        appController.load(model, (result) => {
            if (result.status == app.wizard.Result.Fail) {
                cb('EmailNotConfirmed', result);
            } else {
                $('#div-basic-screening-wizard').fadeIn(500, 'swing');
            }
        });
    }

})(app.wizard.builder);
