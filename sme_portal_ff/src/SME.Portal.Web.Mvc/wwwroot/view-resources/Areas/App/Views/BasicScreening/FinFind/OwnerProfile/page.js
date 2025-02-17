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

    class Finfind extends app.wizard.owner.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Finfind Owner Profile Page';
        }
    }

    page.create = function (id) {
        return new Finfind(id);
    }

    page.Finfind = Finfind;

})(app.wizard.owner.page);
