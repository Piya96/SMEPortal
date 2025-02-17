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

    class Container {

        constructor(wizardId, bodyId) {
            this.listItems = app.listItems.get();
            this.helpers = app.onboard.helpers.get();
            this.name = 'Wizard Base Container';
            this.wizardId = wizardId;
            this.bodyId = bodyId;
            this.model = null;
            this.cb = null;
            this.common = null;
            this.controls = {};

            this.plugins = [
                // { page, validator, dto, summary }
            ];
        }

        __ValidateInitArgs__(args) {
            if (args.hasOwnProperty('plugins') == false) {
                return false;
            } else {
                return true;
            }
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
                        page : obj.page,
                        validator : obj.validator,
                        dto : obj.dto,
                        summary : obj.summary
                    });
                });
                this.addControls();
                this.addHandlers();
            }
        }

        //  args...
        //      optional initialization data used to populate page controls. If null
        //      then the controller and / or pages would be resposible for retrieving
        //      the data to populate controls themselves.
        load(args, cb) {
            this.model = args;

            let loadCount = this.plugins.length;
            function loadDone() {
                cb(app.wizard.addResult());
            }

            this.pages.forEach(function (obj, idx) {
                obj.load(args, function (result) {
                    loadCount--;
                    if (loadCount == 0) {
                        loadDone();
                    }
                });
            });
        }

        save(args, cb) {
            cb(app.wizard.addResult());
        }

        serialize(cb) {
            let result = [];
            this.plugins.forEach((page, idx) => {
                let arr = page.serialize();
                let temp = result.concat(arr);
                result = temp;
            });
            return result;
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we have moved to, ie: page getting attention.
        //      prev : 0-based page index we have just moved from.
        //      user : Optional user data.
        attentionHidden(args, cb) {
            let counter = this.plugins.length;
            this.plugins.forEach((obj, idx) => {
                obj.page.attentionHidden(args, (result) => {
                    if (--counter == 0) {
                        cb(app.wizard.addResult());
                    }
                });
            });
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we have moved to, ie: page getting attention.
        //      prev : 0-based page index we have just moved from.
        //      user : Optional user data.
        neglectHidden(args, cb) {
            let counter = this.plugins.length;
            this.plugins.forEach((obj, idx) => {
                obj.page.neglectHidden(args, (result) => {
                    if (--counter == 0) {
                        cb(app.wizard.addResult());
                    }
                });
            });
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we have moved to, ie: page getting attention.
        //      prev : 0-based page index we have just moved from.
        //      user : Optional user data.
        attention(args, cb) {
            let counter = this.plugins.length;
            this.plugins.forEach((obj, idx) => {
                obj.page.attention(args, (result) => {
                    if (--counter == 0) {
                        cb(app.wizard.addResult());
                    }
                });
            });
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we are moving from.
        //      next : 0-based page index we are about to move to.
        //      user : Optional user data.
        neglect(args, cb) {
            let counter = this.plugins.length;
            this.plugins.forEach((obj, idx) => {
                obj.page.neglect(args, (result) => {
                    if (--counter == 0) {
                        cb(app.wizard.addResult());
                    }
                });
            });
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we are about to move from.
        //  }
        validate(args, cb) {
            let counter = this.plugins.length;
            this.plugins.forEach((obj, idx) => {
                obj.page.validate(args, (result) => {
                    // TODO: Do we return on the first fail?
                    if (--counter == 0) {
                        cb(app.wizard.addResult());
                    }
                });
            });
        }

        //formValidationError(result, cb) {
        //    let text = (result != null && result.message != null) ? result.message : 'Error';
        //    Swal.fire({
        //        //'text': text,
        //        html: text,
        //        icon: "error",
        //        buttonsStyling: false,
        //        confirmButtonText: "Ok, got it!",
        //        customClass: {
        //            confirmButton: "btn font-weight-bold btn-light"
        //        }
        //    }).then(function () {
        //        cb();
        //    });
        //}

        // TODO: This should go into wozard-common.js.
        addControl(name, type) {
            switch (type) {
                case 'input':
                    this.controls[name] = app.control.input(name, name);
                    break;

                case 'select':
                    this.controls[name] = app.control.select(name, name);
                    break;

                case 'radio':
                    this.controls[name] = app.control.radio(name, name);
                    break;

                case 'checkbox':
                    this.controls[name] = app.control.checkbox(name, name);
                    break;

                default:
                    return null;
            }
            return this.controls[name];
        }

        addControls() {

        }

        addHandlers() {
        }
    }

    container.get = function (wizardId, bodyId) {
        return new Container(wizardId, bodyId);
    }

    container.Container = Container;

})(app.wizard.container);
