'use strict';

if (typeof app === 'undefined') {
    var app = {};
}

if (app.fss == undefined) {
    app.fss = {};
}

if (app.fss.user == undefined) {
    app.fss.user = {};
}

(function (user) {

    let helpers = app.onboard.helpers.get();

    class ___TENANT___ extends app.fss.user.Finfind {
        constructor() {
            super();
        }
    }

    user.create = function () {
        return new ___TENANT___();
    }

    user.___TENANT___ = ___TENANT___;

}(app.fss.user));
