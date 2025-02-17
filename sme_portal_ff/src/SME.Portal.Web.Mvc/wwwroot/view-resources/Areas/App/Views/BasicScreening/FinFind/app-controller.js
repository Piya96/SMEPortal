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

    class FinfindAppController extends app.wizard.controller.AppController {
        constructor(wizardId, bodyId) {
            super(wizardId, bodyId);
            this.name = 'Finfind App Controller';
        }
    }

    controller.create = function (wizardId, bodyId) {
        return new FinfindAppController(wizardId, bodyId);
    }

    controller.FinfindAppController = FinfindAppController;

    // TODO: Change class nameto Finfind.
    controller.Finfind = FinfindAppController;

})(app.wizard.controller);
