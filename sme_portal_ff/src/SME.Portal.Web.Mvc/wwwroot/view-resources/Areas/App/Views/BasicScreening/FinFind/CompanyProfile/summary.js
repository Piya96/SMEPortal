'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

if (app.fss.company == undefined) {
    app.fss.company = {};
}

(function (company) {

    let helpers = app.onboard.helpers.get();

    class Finfind extends app.fss.company.Baseline {
        constructor() {
            super();
        }

        apply(dto, appId) {
            super.apply(dto, appId);
        }
    }

    company.create = function () {
        return new Finfind();
    }

    company.Finfind = Finfind;

}(app.fss.company));
