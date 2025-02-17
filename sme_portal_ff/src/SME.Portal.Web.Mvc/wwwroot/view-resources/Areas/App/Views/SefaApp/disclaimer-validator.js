"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.validation == undefined) {
    app.wizard.validation = {};
}

(function (validation) {

    class DisclaimerValidator extends app.wizard.validation.Validation {
        constructor(id) {
            super(id);
        }

        addValidations() {
            super.addValidations();

            this.validations.map.set("input-disclaimer", 'message-disclaimer');

            let self = this;
            let f = FormValidation.formValidation(
                document.getElementById(this.id), {
                    fields: {
                        /*"a": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "b": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "c": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },

                        "d": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "e": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "f": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "g": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "h": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "i": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "j": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "k": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "l": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "m": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        },
                        "n": {
                            validators: {
                                notEmpty: {
                                    message: 'Please enter value'
                                }
                            }
                        }*/
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        bootstrap: new FormValidation.plugins.Bootstrap({
                            defaultMessageContainer: true
                        })
                        //messages: new FormValidation.plugins.Message({
                        //    clazz: 'text-danger',
                        //    container: function (field, element) {
                        //        if (self.validations.map.has(field) == true) {
                        //            let data = self.validations.map.get(field);
                        //            return document.getElementById(data);
                        //        } else {
                        //            return document.getElementById(self.id);
                        //        }
                        //    }
                        //})
                    }
                }
            );
            return f;
        }
    }

    validation.getDisclaimerValidator = function (id) {
        return new DisclaimerValidator(id);
    };

})(app.wizard.validation);
