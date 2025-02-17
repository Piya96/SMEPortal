"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.controller == undefined) {
    app.wizard.controller = {};
}

(function (controller) {

    class ___TENANT___ extends app.wizard.controller.Finfind {
        constructor(wizardId, bodyId) {
            super(wizardId, bodyId);
            this.name = '___TENANT___ App Controller';
        }
    }

    controller.create = function (wizardId, bodyId) {
        return new ___TENANT___(wizardId, bodyId);
    }

    controller.___TENANT___ = ___TENANT___;

})(app.wizard.controller);
