"use strict";

// --- TODO Clean this shit up!!!

// TODO: Rename this to something with onbaording in it instead if KTWizard2.
var KTWizard2 = function () {

    let PAGE = {
        Welcome : 0,
        UserProfile: 1,
        OwnerProfile: 2,
        CompanyProfile: 3,
        //MandateFit: 4,
        Summary: 4
    };

	// Base elements
	var _wizardEl;
	var _formEl;
	var _wizard;
	var _validations = [];
	var _pageNextCallback;
    let businessOwnersMap = new Map();
    let employeesMap = new Map();
    let companyProfileMap = new Map();
    let userProfileMap = new Map();

	// Private functions
    var initWizard = function (
        pageNextCallback
    ) {
		_pageNextCallback = pageNextCallback;
		// Initialize form wizard
		_wizard = new KTWizard(_wizardEl, {
			startStep: 1,
            clickableSteps: false
		});

		// --- Change event.
        _wizard.on('change', function (wizard) {

            let currStep = wizard.getStep();
            let newStep = wizard.getNewStep();
            let next = newStep > currStep;

            if (next == false) {
                KTUtil.scrollTop();
                let curr = _wizard.getStep();
                app.onboard.wizard.neglect(curr, false, function (status) {
                    app.onboard.wizard.attention(curr - 1, false, function (status) {
                    });
                });
            } else {
                _validations[currStep - 1].validate().then(function (status) {
                    if (status == 'Valid') {
                        let curr = _wizard.getStep();
                        app.onboard.wizard.neglect(curr, true, function (status) {

                            if (status.result == Result.Pass) {
                                _wizard.goNext();
                                KTUtil.scrollTop();
                                app.onboard.wizard.attention(curr + 1, true, function (status) {
                                });
                            } else {
                                Swal.fire({
                                    text: status.message,
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn font-weight-bold btn-light"
                                    }
                                }).then(function () {
                                });
                            }
                        });
                    } else {
                        Swal.fire({
                            text: "Sorry, looks like there are some errors detected, please try again.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            }
                        }).then(function () {
                            KTUtil.scrollTop();
                        });
                    }
                });
                _wizard.stop();
            }
		});
	}

    var initValidation = function () {

        function map(map, name, id, div) {
            let data = {
                id: id,
                div: div
            };
            map.set(name, data);
        }

        // Company profile
        map(companyProfileMap, 'cipc-lookup', null, 'cipc-lookup-message');
        map(companyProfileMap, 'cname', null, 'cname-message');
        map(companyProfileMap, 'regno', null, 'regno-message');

        map(companyProfileMap, 'duplicate-registration-number-name', null, 'duplicate-registration-number-message');

        map(companyProfileMap, 'registrationdate', null, 'message-registration-date');
        map(companyProfileMap, 'startedtradingdate', null, 'id-message-started-trading-date-div');

        map(companyProfileMap, 'companyType', null, 'companyType-message');

        map(companyProfileMap, 'input-registered-for-uif', null, 'message-registered-for-uif');

        map(companyProfileMap, 'name-registered-address', null, 'autocomplete-message');
        map(companyProfileMap, 'regaddr1', null, 'regaddr1-message');
        map(companyProfileMap, 'citytown', null, 'citytown-message');
        map(companyProfileMap, 'postalcode', null, 'postalcode-message');
        map(companyProfileMap, 'companyProfileProvinceSelect', null, 'province-message');

        map(companyProfileMap, 'name-select-company-profile-industry-dummy', null, 'id-div-company-profile-industry-dummy-message');

        map(companyProfileMap, 'name-input-company-profile-vat-reg-number', null, 'id-div-message-company-profile-vat-reg-number');
        map(companyProfileMap, 'name-input-company-profile-tax-ref-number', null, 'id-div-message-company-profile-tax-ref-number');

        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        ));

		// User profile...
		let f1 = FormValidation.formValidation(
			_formEl,
			{
				fields: {
					fname1: {
						validators: {
							notEmpty: {
								message: 'First name required'
							}
						}
					},
					lname1: {
						validators: {
							notEmpty: {
								message: 'Last name required'
							}
						}
                    },
                    //'name-user-mobile-verify-select' : {
                    //    validators: {
                    //        notEmpty: {
                    //            message: 'Selection required'
                    //        }
                    //    }
                    //},
					phone1: {
						validators: {
                            callback: {
                                message: 'Invalid Mobile Number',
								callback : function(arg) {
									let regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
                                    let res = regex.test(arg.value);
                                    app.onboard.user.notify('field-valid', {
                                        field: 'mobile',
                                        valid : res
                                    });
									return res;
								}
							}
						}
					},
					email1: {
						validators: {
							callback : {
								callback : function(arg) {
									let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
									let res = regex.test(arg.value);
									return res;
								}
							}
						}
					},
					idno1: {
						validators: {
                            callback: {
                                message: 'Invalid Identity Number',
								callback : function(arg) {
									let regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))/
                                    let res = regex.test(arg.value);
                                    app.onboard.user.notify('field-valid', {
                                        field: 'identity',
                                        valid: res
                                    });
									return res;
								}
							}
						}
					},

					'input-is-business-owner': {
                        validators: {
                            notEmpty: {
                                message: 'Yes or No required'
                            }
						}
                    },
                    other1: {
                        validators: {
                            notEmpty: {
                                message: 'Capacity required'
                            }
                        }
                    },
                    "how-did-you-hear-about-sefa": {
                        validators: {
                            notEmpty: {
                                message: 'Selection required'
                            }
                        }
                    },
                    'input-user-profile-sefa-origin-other': {
                        validators: {
                            notEmpty: {
                                message: 'Text required'
                            }
                        }
                    },
                    "select-user-profile-sefa-origin-strategic-partner": {
                        validators: {
                            notEmpty: {
                                message: 'Selection required'
                            }
                        }
                    },
                    "name-select-user-profile-title": {
                        validators: {
                            notEmpty: {
                                message: 'Selection required'
                            }
                        }
                    },
                    'name-input-user-profile-registered-address': {
                        validators: {
                            notEmpty: {
                                message: 'Address required'
                            }
                        }
                    },

                    'name-input-user-profile-capacity-other': {
                        validators: {
                            notEmpty: {
                                message: 'Capacity required'
                            }
                        }
                    }

				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap(),
                    excluded: new FormValidation.plugins.Excluded({
                        excluded: function (field, elem, eles) {
                            //if (field == 'input-is-business-owner') {
                            //    let elem = document.getElementById('input-is-business-owner');
                            //    if (elem.checked == true) {
                            //        return true;
                            //    } else {
                            //        return false;
                            //    }						
                            //}
                            if (field == 'other1') {
                                let visible = $('#id-user-profile-capacity-other-div').is(':visible');
                                return visible == false;
                            } else {
                                return false;
                            }
                        }
                    })
				}
			}
		);
		_validations.push(f1);

		// Owner profile...
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					fname: {
						validators: {
							notEmpty: {
								message: 'First name required'
							}
						}
					},
					lname: {
						validators: {
							notEmpty: {
								message: 'Last name required'
							}
						}
					},
					email: {
						validators: {
							callback : {
								callback : function(arg) {
									let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                    let res = regex.test(arg.value);
                                    app.onboard.owner.notify('field-valid', {
                                        field: 'email',
                                        valid: res
                                    });
									return res;
								}
							}
						}
					},
					mobile: {
						validators: {
                            callback: {
                                message: 'Invalid Mobile Number',
								callback : function(arg) {
									let regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
                                    let res = regex.test(arg.value);
                                    app.onboard.owner.notify('field-valid', {
                                        field: 'mobile',
                                        valid: res
                                    });
									return res;
								}
							}
						}
                    },
                    ownerIdentity: {
						validators: {
                            callback: {
                                message: 'Invalid Identity Number',
								callback : function(arg) {
									let regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))/
                                    let res = regex.test(arg.value);
                                    app.onboard.owner.notify('field-valid', {
                                        field: 'identity',
                                        valid: res
                                    });
									return res;
								}
							}
						}
					},
					race: {
						validators: {
							notEmpty: {
								message: 'Race required'
                            }
						}
                    },

                    'name-input-owner-profile-race-other': {
                        validators: {
                            notEmpty: {
                                message: 'Race required'
                            }
                        }
                    },

                    'validate-owner-profile-gender': {
                        validators: {
                            notEmpty: {
                                message: 'Identity validation required'
                            }
                        }
                    },
                    'validate-owner-profile-marital-status': {
                        validators: {
                            notEmpty: {
                                message: 'Identity validation required'
                            }
                        }
                    },
                    'select-owner-profile-marital-status': {
                        validators: {
                            notEmpty: {
                                message: 'Selection required'
                            }
                        }
                    },
                    'validate-owner-profile-age': {
                        validators: {
                            notEmpty: {
                                message: 'Identity validation required'
                            }
                        }
                    },
                    "name-select-owner-profile-title": {
                        validators: {
                            notEmpty: {
                                message: 'Selection required'
                            }
                        }
                    },

                    'name-input-owner-married-in-cop': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },

                    'input-owner-is-disabled': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },

                    'name-input-owner-spouse-identity': {
                        validators: {
                            callback: {
                                message: 'Invalid Identity Number',
                                callback: function (arg) {
                                    let regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))/
                                    let res = regex.test(arg.value);
                                    return res;
                                }
                            }
                        }
                    },
                    'name-input-owner-profile-registered-address': {
                        validators: {
                            notEmpty: {
                                message: 'Address required'
                            }
                        }
                    }
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Company profile...
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					'cipc-lookup': {
						validators: {
							notEmpty: {
								message: 'CIPC selection required'
							}
						}
					},
					cname: {
						validators: {
							notEmpty: {
								message: 'Trading name required'
							}
						}
                    },

                    'duplicate-registration-number-name': {
                        validators: {
                            callback: {
                                message: 'Registration number already exists for another company',
                                callback: function (arg) {
                                    return false;
                                }
                            }
                        }
                    },

					regno: {
                        validators: {
                            callback: {
                                message: 'Invalid Format',
                                callback: function (arg) {
                                    let REGISTERED_NOT_LISTED = 'RegisteredNotListed';
                                    let NOT_REGISTERED = 'NotRegistered';
                                    let SOLE_PROPRIETOR = '5a6ab7ce506ea818e04548ad';
                                    let PARTNERSHIP = '5a6ab7d3506ea818e04548b0';
                                    let TRUST = '5a6ab7ea506ea818e04548b2';
                                    let GOV_ENTITY = '5a6ab813506ea818e04548b6';
                                    let PERSONAL_LIABILITY_COMP = '5c3cde39261c1e011c7b67c7';
                                    // --- TODO: Do this another way when you have time!!!
                                    let cipc = document.getElementById('id-company-profile-cipc');
                                    switch (cipc.value) {
                                        case NOT_REGISTERED:
                                            return true;
                                            break;

                                        case REGISTERED_NOT_LISTED:
                                            let type = $('#id-company-profile-type').val();
                                            switch (type) {
                                                case SOLE_PROPRIETOR: case PARTNERSHIP:
                                                    return true;

                                                case TRUST:
                                                    let regex1 = /^IT\/\d{3}\/\d{4}\/\d{3}$/
                                                    return regex1.test(arg.value);

                                                case GOV_ENTITY: case PERSONAL_LIABILITY_COMP:
                                                    return arg.value != "";

                                                default:
                                                    let regex3 = /^(19|20)[0-9][0-9]\/\d{6}\/\d{2}$/
                                                    return regex3.test(arg.value);
                                            }
                                            break;

                                        default:
                                            return true;
                                            break;
                                    }
                                }
                            }
						}
                    },

                    companyType: {
						validators: {
							notEmpty: {
								message: 'Registration type required'
							}
						}
                    },

                    registrationdate: {
                        validators: {
                            notEmpty: {
                                message: 'Started trading date required'
                            }
                        }
                    },

                    startedtradingdate : {
                        validators: {
                            notEmpty: {
                                message: 'Started trading date required'
                            }
                        }
                    },

                    'name-registered-address': {
                        validators: {
                            notEmpty: {
                                message: 'Address required'
                            }
                        }
                    },

                    'input-registered-for-uif': {
                        validators: {
                            notEmpty: {
                                message: 'Select Yes or No'
                            }
                        }
                    },

                    industrySector: {
                        validators: {
                            notEmpty: {
                                message: 'Industry Sector required'
                            }
                        }
                    },

                    industrySubSector: {
                        validators: {
                            notEmpty: {
                                message: 'Industry Sub-Sector required'
                            }
                        }
                    },

					regaddr1: {
						validators: {
							notEmpty: {
								message: 'Address 1 required'
							}
						}
					},
					regaddr2: {
						validators: {
							notEmpty: {
								message: 'Address 2 required'
							}
						}
					},
					citytown: {
						validators: {
							notEmpty: {
								message: 'City / town required'
							}
						}
                    },

					postalcode: {
						validators: {
							notEmpty: {
								message: 'Postal code required'
							}
						}
					},

                    companyProfileProvinceSelect: {
                        validators: {
                            notEmpty: {
                                message: 'Select a province'
                            }
                        }
                    },

                    'name-company-profile-entity-type-select': {
                        validators: {
                            notEmpty: {
                                message: 'Selection required'
                            }
                        }
                    },
                    //'name-input-company-profile-vat-reg-number': {
                    //    validators: {
                    //        callback: {
                    //            message: 'Valid 10 digit VAT registration number required',
                    //            callback: function (arg) {
                    //                if (arg.value != null && arg.value.length == 10) {
                    //                    return true;
                    //                } else {
                    //                    return false;
                    //                }
                    //            }
                    //        }
                    //    },
                    //},
                    'name-input-company-profile-tax-ref-number': {
                        validators: {
                            notEmpty: {
                                message: 'TAX reference number required'
                            },
                            callback: {
                                message: 'Valid 10 digit TAX reference number required',
                                callback: function (arg) {
                                    if (arg.value != null && arg.value.length == 10) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        },
                    },
                    'name-select-company-profile-industry-dummy': {
                        validators: {
                            notEmpty: {
                                message: 'Selection required'
                            }
                        }
                    }

				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap({
                        defaultMessageContainer: false
                    }),
                    excluded: new FormValidation.plugins.Excluded({
                        excluded: function (field, elem, eles) {
                            let data = companyProfileMap.get(field);
                            if (data != null && data.id != null && data.id != 'undefined') {
                                let visible = $(data.id).is(':visible');
                                return visible == false;
                            }

                            if (elem.disabled == true) {
                                return true;
                            }
                            switch (field) {

                                case 'regaddr2':
                                    return true;

                                default:
                                    return false;//$('#id-company-profile-province-div').is(':visible') == false;
                            }
                        }
                    }),
                    messages: new FormValidation.plugins.Message({
                        clazz: 'text-danger',
                        container: function (field, element) {
                            switch (field) {

                                default:
                                    {
                                        let data = companyProfileMap.get(field);
                                        if (data != null) {
                                            return document.getElementById(data.div);
                                        } else {
                                            return document.getElementById('step-2-messages');
                                        }
                                    }
                            }
                        }
                    })
				}
			}
        ));
    
        // Summary...
        _validations.push(FormValidation.formValidation(
            _formEl,
            {
                fields: {
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        ));

        $('#id-company-profile-reg-no').focus(function () {
            _validations[PAGE.CompanyProfile].resetField('regno');
        });
	}

    return {
        page: PAGE,

        goto: function (page, cb) {
            _wizard.goTo(page + 1);
            KTUtil.scrollTop();
            cb(AddStatus());
        },

		// public functions
        goTo: function (pageIndex, cb) {
            app.onboard.wizard.neglect(pageIndex - 1, true, function (status) {

                if (status.result == Result.Pass) {
                    _wizard.goTo(pageIndex);
                    KTUtil.scrollTop();
                }
                app.onboard.wizard.attention(pageIndex, true, function (status) {
                    cb(status);
                });

            });
        },

        getStep: function () {
            return _wizard.getStep();
        },
        // TODO: ???
        go: function (pageIndex) {
            alert('go');
            _pageNextCallback(2, 3, true, function (status) {
             });
            _wizard.goTo(pageIndex + 1);
        },

		init: function (pageNextCallback, pagePrevCallback) {
			_wizardEl = KTUtil.getById('kt_wizard_v2');
			_formEl = KTUtil.getById('kt_form');
            initWizard(pageNextCallback, pagePrevCallback);
            initValidation();
        },
        validate: function (step, name = null) {
            _validations[step].validate(name).then(function (status) {

            });
        },
        enable: function (page, name, toggle) {
            if (toggle == true) {
                _validations[page].enableValidator(name);
            } else {
                _validations[page].disableValidator(name);
            }
        },
        validateField: function (page, name, cb = null) {
            _validations[page].revalidateField(name).then(function (status) {
                if (cb != null) {
                    cb(page, name, status);
                }
            });
        },

        validateFields: function (page, arr, cb) {
            let result = [];
            for (let i = 0, max = arr.length; i < max; i++) {
                _validations[page].revalidateField(arr[i]).then(function (status) {
                    result.push(status);
                    if (result.length == arr.length) {
                        cb(result);
                    }
                });
            }
        },

        resetFields: function (page, arr) {
            for (let i = 0, max = arr.length; i < max; i++) {
                _validations[page].resetField(arr[i], false);
            }
        },

        resetField: function (page, name) {
            _validations[page].resetField(name, false);
        },

        resetAll: function (page) {
            let obj = _validations[page - 1].fields;
            for (let key in obj) {
                _validations[page - 1].resetField(key, false);
            }
        },

        getBusinessOwnersMap: function () {
            return businessOwnersMap;
        },

        getEmployeesMap: function () {
            return employeesMap;
        },
        PAGE : PAGE
	};
}();


jQuery(document).ready(function () {
    // --- TODO: This needs to change. wizard-common should pass in the callback functions.
    function onPageChange(prev, curr, foreward, cb) {
    };

    function onPageValidate(curr, foreward) {
        return app.onboard.wizard.validate(curr, foreward);
    };
    KTWizard2.init(onPageChange);
});
