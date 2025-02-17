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

    class ___TENANT___ extends app.fss.company.Finfind {
        constructor() {
            super();
        }
    }

    company.create = function () {
        return new ___TENANT___();
    }

    company.___TENANT___ = ___TENANT___;

}(app.fss.company));
