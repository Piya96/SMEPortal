"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.user == undefined) {
    app.wizard.user = {};
}

if (app.wizard.user.validator == undefined) {
    app.wizard.user.validator = {};
}

(function (validator) {

    class Baseline extends app.wizard.validator.Base {
        constructor(id) {
            super(id);
        }

        addValidations() {
            super.addValidations();
            let self = this;
            let fv = FormValidation.formValidation(
                document.getElementById(this.id), {
                fields: {
					'input-user-profile-identity': {
						validators: {
                            notEmpty: {
                                message: 'Identity number required'
                            },
                            callback: {
                                message: 'Invalid Identity Number',
								callback : function(arg) {
									let regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))/
                                    let result = regex.test(arg.value);
                                    setTimeout(() => {
                                        self.pageCallback.onValidateField('input-user-profile-identity', result, arg.value);
                                    }, 10);
									return result;
								}
							}
						}
					},
					'input-user-profile-mobile': {
						validators: {
                            notEmpty: {
                                message: 'Mobile number required'
                            },
                            callback: {
                                message: 'Invalid Mobile Number',
								callback : function(arg) {
                                    let regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
                                    let result = regex.test(arg.value);
                                    setTimeout(() => {
                                        self.pageCallback.onValidateField('input-user-profile-mobile', result, arg.value);
                                    }, 10);
									return result;
								}
							}
						}
					},
					'input-user-profile-email': {
						validators: {
                            notEmpty: {
                                message: 'Email address required'
                            },
                            callback: {
                                message: 'Invalid Email Address',
								callback : function(arg) {
                                    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                    let result = regex.test(arg.value);
									return result;
								}
							}
						}
					},
                    "input-user-profile-is-owner": {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },
                    "input-user-profile-first-name": {
                        validators: {
                            notEmpty: {
                                message: 'First name required'
                            }
                        }
                    },
                    "input-user-profile-last-name": {
                        validators: {
                            notEmpty: {
                                message: 'Last name required'
                            }
                        }
                    },
                    "select-user-profile-owner-capacity": {
                        validators: {
                            notEmpty: {
                                message: 'Selection Required'
                            }
                        }
                    },
                    "input-user-profile-owner-capacity-other": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter other capacity'
                            }
                        }
                    },
                    'input-user-profile-registered-address': {
                        validators: {
                            notEmpty: {
                                message: 'Address required'
                            }
                        }
                    }
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
                    //            return document.getElementById(data.message);
                    //        } else {
                    //            return document.getElementById(self.id);
                    //        }
                    //    }
                    //})
                }
            }
            );
            return fv;
        }
    }

    validator.create = function (id) {
        return new Baseline(id);
    };

    validator.Baseline = Baseline;

})(app.wizard.user.validator);
