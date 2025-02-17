"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.validator == undefined) {
    app.wizard.validator = {};
}


(function (validator) {

    class Base {
        constructor(id) {
            this.id = id;
            this.pageCallback = null;
            this.validations = {
                validator : null,
                map : new Map()
            };
            this.helpers = app.onboard.helpers.get();
            this.validating = false;
            this.fields = {};
        }

        isFieldEnabled(field) {
            if (this.fields.hasOwnProperty(field) == true) {
                if (this.fields[field] == 'enabled') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }

        // Invoked after class is instantiated.
        init(args) {
            this.pageCallback = args['page'];
            this.validations.validator = this.addValidations();
            //this.pageCallback.toggleValidations();
        }

        // Override to add page specific validation rules. Make sure the base method is called first.
        addValidations() {
        }

        // Invoked by WizardController::OnChange method to perform form validation.
        validate (data, cb) {
            let self = this;
            if(data.isNext == false || this.validations.validator == null) {
                cb(app.wizard.addResult());
            } else {
                this.validating = true;
                this.validations.validator.validate().then(function (status) {
                    self.validating = false;
                    let result = app.wizard.addResult();
                    if(status == 'Valid') {
                    } else {
                        result.status = app.wizard.Result.Fail;
                        result.message = 'Page validation error';
                    }
                    cb(result);
                });
            }
        }

        toggleValidators (names, toggles) {
            for(let i = 0, max = names.length; i < max; i++) {
                if(toggles[i] == true) {
                    this.validations.validator.enableValidator(names[i]);
                } else {
                    this.validations.validator.disableValidator(names[i])
                }
                this.fields[names[i]] = toggles[i] == true ? 'enabled' : 'disabled';
            }
        }
    
        validateField (name, cb) {
            this.validations.validator.revalidateField(name).then(function (status) {
                if (cb != null) {
                    cb(name, status);
                }
            });
        }

        validateFields(arr, cb) {
            arr.forEach((name, idx) => {
                this.validations.validator.revalidateField(name).then(function (status) {
                });
            });
        }

        resetFields (names) {
            for(let i = 0, max = names.length; i < max; i++) {
                this.validations.validator.resetField(names[i], false);
            }
        }

        updateFieldStatus(fields, status, validators) {
            for (let i = 0, max = fields.length; i < max; i++) {
                this.validations.validator.updateFieldStatus(fields[i], status[i], validators[i]);
            }
        }

        addField(fv, empty, cb = null) {
            fv.addField(
                empty[0],
                {
                    validators: {
                        notEmpty: {
                            message: empty[1]
                        },
                        callback: {
                            callback: cb == null
                                ?   (arg) => {return true;}
                                :   function (arg) {
                                        return cb[0](arg);
                                },
                            message : cb != null && cb.length == 2 ? cb[1] : null
                        }
                    }
                }
            );
        }

    }

    validator.Base = Base;

})(app.wizard.validator);
