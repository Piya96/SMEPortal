'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

if (app.fss.owner == undefined) {
    app.fss.owner = {};
}

(function (owner) {

    let helpers = app.onboard.helpers.get();

    class Finfind extends app.fss.owner.Baseline {
        constructor() {
            super();
        }

        apply(dto, appId) {
            super.apply(dto, appId);
        }
    }

    owner.create = function () {
        return new Finfind();
    }

    owner.Finfind = Finfind;

}(app.fss.owner));
