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

if (app.wizard.controller == undefined) {
    app.wizard.controller = {};
}

(function (controller) {

    class Controller {

        constructor(wizardId, bodyId) {
            this.listItems = app.listItems.get();
            this.helpers = app.onboard.helpers.get();
            this.fadeSpeed = 500;
            this.name = 'Wizard Base Controller';
            this.wizard = null;
            this.wizardId = wizardId;
            this.bodyId = bodyId;
            this.pages = [];
            this.validators = [];
            this.model = null;
            this.activePage = 0;
            this.cb = null;
            this.common = null;
            this.controls = {};
            // Used to store a descriptive string value for where the user is in their finance application journey.
            this.userPage = "";
        }

        __OnChange__(wizard) {
            let self = this;
            let curr = wizard.getStep() - 1;
            let next = wizard.getNewStep() - 1;
            let isNext = curr < next;

            let attentionData = {
                'isNext': isNext,
                'curr': next,
                'prev': curr,
                'user': null
            };

            let neglectData = {
                'isNext': isNext,
                'curr': curr,
                'next': next,
                'user': null
            };

            let validateData = {
                'isNext': isNext,
                'curr': curr
            };

            let saveData = {
                'isNext': isNext,
                'curr': curr,
                'next': next,
                'user': null
            };

            if (isNext == false) {
                self.activePage = saveData.curr;
                self.save(saveData, function (result) {

                    self.neglect(neglectData, function () {

                        self.neglectHidden(neglectData, (result) => {

                            wizard.goPrev();
                            KTUtil.scrollTop();

                            self.attentionHidden(attentionData, function (result) {

                                self.attention(attentionData, function (result) {
                                });

                            });
                        });
                    });
                });
            } else {
                if (curr < this.pages.length) {

                    self.validatePage(validateData, function (result) {

                        if (result.status == app.wizard.Result.Success) {

                            self.validate(validateData, function (result) {

                                if (result.status == app.wizard.Result.Success) {
                                
                                    self.activePage = saveData.next;

                                        self.save(saveData, function (result) {

                                            self.neglect(neglectData, function (result) {

                                                self.neglectHidden(neglectData, (result) => {

                                                    self.updateUserJourney(self.activePage, (result) => {
                                                        wizard.goNext();
                                                        KTUtil.scrollTop();

                                                        self.attentionHidden(attentionData, (result) => {

                                                            self.attention(attentionData, function (result) {
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                } else {
                                    self.formValidationError(result, function () {
                                        KTUtil.scrollTop();
                                    });
                                }

                            });
                        } else {
                            self.formValidationError(result, function () {
                                KTUtil.scrollTop();
                            });
                        }
                    });


                } else {
                    self.neglect(attentionData, function (result) {

                        wizard.goNext();
                        KTUtil.scrollTop();

                        self.attention(attentionData, function (result) {
                        });
                    });
                }
            }
            wizard.stop();
        }

        __ValidateInitArgs__(args) {
            if (args.hasOwnProperty('pages') == false) {
                return false;
            } else {
                return true;
            }
        }

        goto(page, cb) {
            this.wizard.goTo(page + 1);
            let attentionData = {
                'isNext': true,
                'curr': page,
                'prev': page - 1,
                'user': this.getGotoData(page)
            };
            this.attentionHidden(attentionData, (result) => {
                this.attention(attentionData, function (result) {
                    cb(app.wizard.addResult());
                });

            });
        }

        getGotoData(page) {
            return null;
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
                this.wizard = new KTWizard(this.wizardId, {
                    startStep: 1,
                    clickableSteps: false
                });
                this.wizard.on('change', this.__OnChange__.bind(this));
                args.pages.forEach(function (obj, idx) {
                    self.pages.push(obj.page);
                    self.validators.push(obj.validator);
                });
                this.addControls();
                this.addHandlers();
            }
        }

        __load__(args, cb) {
            this.model = args;
            let loadCount = this.pages.length;
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

        //  args...
        //      optional initialization data used to populate page controls. If null
        //      then the controller and / or pages would be resposible for retrieving
        //      the data to populate controls themselves.
        load(args, cb) {
            let self = this;
            this.updateUserJourney(0, (result) => {
                self.__load__(args, cb);
            });
        }

        save(args, cb) {
            cb(app.wizard.addResult());
        }

        updateUserJourney(page, cb) {
            if (this.mustUpdateUserJourney() == false) {
                cb(app.wizard.addResult());
            } else {
                let self = this;
                app.wizard.service.loadUserProfile((result) => {
                    if (result.data.propertiesJson == null || result.data.propertiesJson == '') {
                        result.data.propertiesJson = JSON.stringify({});
                    }
                    let prop = JSON.parse(result.data.propertiesJson);
                    if (prop.hasOwnProperty('user-journey') == false) {
                        prop['user-journey'] = {
                            onboarding: {
                                stage: '',
                                page: null
                            },
                            application: [
                            ]
                        }
                    }
                    self.updateUserJourneyProp(page, prop['user-journey']);
                    result.data.propertiesJson = JSON.stringify(prop);

                    app.wizard.service.saveUserProfile(result.data, (result) => {
                        cb(result);
                    });
                });
            }
        }

        mustUpdateUserJourney() {
            return true;
        }

        updateUserJourneyProp(page, prop) {
        }

        serialize(cb) {
            let result = [];
            this.pages.forEach((page, idx) => {
                let arr = page.serialize();
                let temp = result.concat(arr);
                result = temp;
            });
            return result;
        }

        remap(nvp, cb) {
            let result = [];
            this.pages.forEach((page, idx) => {
                let arr = page.remap(nvp);
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
            if (args.curr < this.pages.length && this.pages[args.curr] != null) {
                this.pages[args.curr].attentionHidden(args, (result) => {
                    cb(result);
                });

            } else {
                cb(app.wizard.addResult());
            }
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we have moved to, ie: page getting attention.
        //      prev : 0-based page index we have just moved from.
        //      user : Optional user data.
        neglectHidden(args, cb) {
            if (args.curr < this.pages.length && this.pages[args.curr] != null) {
                this.pages[args.curr].neglectHidden(args, (result) => {
                    cb(result);
                });
            } else {
                cb(app.wizard.addResult());
            }
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we have moved to, ie: page getting attention.
        //      prev : 0-based page index we have just moved from.
        //      user : Optional user data.
        attention(args, cb) {
            if (args.curr < this.pages.length && this.pages[args.curr] != null) {
                $('#' + this.bodyId).fadeIn(this.fadeSpeed, 'swing', () => {

                    this.pages[args.curr].attention(args, (result) => {
                        cb(result);
                    });

                });
            } else {
                cb(app.wizard.addResult());
            }
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we are moving from.
        //      next : 0-based page index we are about to move to.
        //      user : Optional user data.
        neglect(args, cb) {
            if (args.curr < this.pages.length && this.pages[args.curr] != null) {

                this.pages[args.curr].neglect(args, (result) => {

                    $('#' + this.bodyId).fadeOut(this.fadeSpeed, 'swing', () => {
                        cb(result);
                    });

                });

            } else {
                cb(app.wizard.addResult());
            }
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we are about to move from.
        //  }
        validate(args, cb) {
            if (args.curr < this.pages.length && this.pages[args.curr] != null) {
                this.pages[args.curr].validate(args, function (result) {
                    cb(result);
                });
            } else {
                cb(app.wizard.addResult());
            }
        }

        //  args = {
        //      isNext : true if we are moving left to right, false for right to left.
        //      curr : 0-based page index we are about to move from.
        //  }
        validatePage(args, cb) {
            let self = this;
            if (args.curr < this.validators.length && this.validators[args.curr] != null) {
                self.validators[args.curr].validate(args, function (result) {
                    cb(result);
                });
            } else {
                cb(app.wizard.addResult());
            }
        }

        formValidationError(result, cb) {
            if (result.data != null && result.data.hasOwnProperty('plugin')) {
                if (result.data.plugin < this.pages.length && this.pages[result.data.plugin] != null) {
                    this.pages[result.data.plugin].formValidationError(result, function (result) {
                        cb();
                    });
                } else {
                    cb();
                }
            } else {
                let text = (result != null && result.message != null) ? result.message : 'Error';
                Swal.fire({
                    //'text': text,
                    html: text,
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light"
                    }
                }).then(function () {
                    cb();
                });
            }
        }

        onSubmit(cb) {

        }

        onSubmitResult(result) {
            if (result.status == app.wizard.Result.Fail) {
                Swal.fire({
                    html: result.message,
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light"
                    }
                }).then(function () {
                });
            }
        }

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
            $('#' + this.getSubmitId()).on('click', () => {
                this.onSubmit((result) => {
                    this.onSubmitResult(result);
                });
            });
        }

        getSubmitId() {
            return 'button-wizard-submit';
        }

        getNextId() {
            return 'button-wizard-next';
        }

        getPrevId() {
            return 'button-wizard-prev';
        }
    }

    controller.get = function (wizardId, bodyId) {
        return new Controller(wizardId, bodyId);
    }

    controller.Controller = Controller;

})(app.wizard.controller);
