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

    class Finfind extends app.wizard.user.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Finfind User Profile Page';
        }

        attention(args, cb) {
            super.attention(args, cb);
            initAutocomplete_user();
        }
    }

    page.create = function (id) {
        return new Finfind(id);
    }

    page.Finfind = Finfind;

})(app.wizard.user.page);
