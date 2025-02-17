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

    class Finfind extends app.wizard.summary.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Finfind Summary Page';
        }
    }

    page.create = function (id) {
        return new Finfind(id);
    }

    page.Finfind = Finfind;

})(app.wizard.summary.page);
