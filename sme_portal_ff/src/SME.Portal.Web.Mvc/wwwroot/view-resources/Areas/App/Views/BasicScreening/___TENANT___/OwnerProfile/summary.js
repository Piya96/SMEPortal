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

    class ___TENANT___ extends app.fss.owner.Finfind {
        constructor() {
            super();
        }
    }

    owner.create = function () {
        return new ___TENANT___();
    }

    owner.___TENANT___ = ___TENANT___;

}(app.fss.owner));
