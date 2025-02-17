// The wizard controller is responsible for facilitating flow between individual wizard
// pages by sending messages to the wizard pages via interface that is implemented by
// wizard pages.

"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.container == undefined) {
    app.wizard.container = {};
}

(function (container) {

    class FundingRequirementsContainer extends app.wizard.container.Container{

        constructor(wizardId, bodyId) {
            // TODO: May only need one of these id's.
            super(wizardId, bodyId);
            this.name = 'Funding Requirements Container';
        }

        __ValidateInitArgs__(args) {
            //if (args.hasOwnProperty('plugins') == false) {
            //    return false;
            //} else {
                return true;
            //}
        }

        //  args = {
        //      pages : array of wizard specific pages.
        //      validators : array of page specific validators.
        //  };
        //  cb...
        //    - Optional callback function taking a Result object.
        init(args, cb = null) {
            let self = this;
            if (this.__ValidateInitArgs__(args) == false) {
                return false;
            } else {
                if (args.hasOwnProperty('common') == true) {
                    this.common = args['common'];
                }
                this.cb = cb;
                args.pages.forEach(function (obj, idx) {
                    self.plugins.push({
                        page: obj.page,
                        validator: obj.validator,
                        dto: obj.dto,
                        summary: obj.summary
                    });
                });
                this.addControls();
                this.addHandlers();
            }
        }

        addControls() {

        }

        addHandlers() {
        }
    }

    container.getFundingRequirements = function (wizardId, bodyId) {
        return new Container(wizardId, bodyId);
    }

    container.Container = Container;

})(app.wizard.container);
