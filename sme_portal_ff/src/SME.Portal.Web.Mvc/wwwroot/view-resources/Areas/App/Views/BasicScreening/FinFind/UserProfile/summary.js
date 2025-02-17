'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

if (app.fss.user == undefined) {
    app.fss.user = {};
}

(function (user) {

    let helpers = app.onboard.helpers.get();

    class Finfind extends app.fss.user.Baseline {
        constructor() {
            super();
        }

        apply(dto, appId) {
            super.apply(dto, appId);
        }
    }

    user.create = function () {
        return new Finfind();
    }

    user.Finfind = Finfind;

}(app.fss.user));
