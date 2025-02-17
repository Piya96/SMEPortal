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
    let listItems = app.listItems.get();

    class Sefa extends app.fss.company.Baseline {
        constructor() {
            super();
        }

        entityType() {
            let value = this.set('td-entity-type', 'entityType', true, [listItems.getEntityTypes.bind(listItems)]);
        }

        apply(dto, appId) {
            super.apply(dto, appId);
            this.entityType();
        }
    }

    company.create = function () {
        return new Sefa();
    }

    company.Sefa = Sefa;

}(app.fss.company));
