"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.page == undefined) {
    app.wizard.page = {};
}

(function (page) {

    class DisclaimerPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Disclaimer Page';
            this.backgroundCheck = null;
        }

        serialize() {
            return [];
        }

        validate(data, cb) {
            cb(app.wizard.addResult());
        }

        dtoToPage(dto) {
        }

        pageToDto(dto) {
        }

        reset() {
        }

        load(args, cb) {
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            super.attention(args, cb);
        }

        addControls() {
        }

        addHandlers() {
        }
    }

    page.getDisclaimerPage = function (id) {
        return new DisclaimerPage(id);
    }
})(app.wizard.page);
