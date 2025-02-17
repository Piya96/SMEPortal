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
    let listItems = app.listItems.get();

    class Sefa extends app.fss.owner.Baseline {
        constructor() {
            super();
        }

        isOwnerDisabled() {
            let value = this.set('td-owner-is-disabled', 'owner-is-disabled', true, []);
        }

        apply(dto, appId) {
            super.apply(dto, appId);
            this.isOwnerDisabled();
        }
    }

    owner.create = function () {
        return new Sefa();
    }

    owner.Sefa = Sefa;

}(app.fss.owner));
