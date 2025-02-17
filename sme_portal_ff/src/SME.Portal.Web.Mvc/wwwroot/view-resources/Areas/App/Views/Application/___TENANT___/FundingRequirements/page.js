"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.fundingRequirements == undefined) {
    app.wizard.fundingRequirements = {};
}

if (app.wizard.fundingRequirements.page == undefined) {
    app.wizard.fundingRequirements.page = {};
}

(function (page) {

    class ___TENANT___ extends app.wizard.fundingRequirements.page.Finfind {
        constructor(wizardId, bodyId) {
            super(wizardId, bodyId);
            this.name = '___TENANT___ Funding Requirements';
        }
    }

    page.create = function (id) {
        return new ___TENANT___(id);
    }

    page.___TENANT___ = ___TENANT___;

})(app.wizard.fundingRequirements.page);
