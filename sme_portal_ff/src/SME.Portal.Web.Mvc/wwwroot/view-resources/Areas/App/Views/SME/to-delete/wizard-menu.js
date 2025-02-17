"use strict";

// --- TODO Clean this shit up!!!

// TODO: Rename this to something with onbaording in it instead if KTWizard2.
var KTWizard2 = function () {

    let PAGE = {
        //Welcome : 0,
        UserProfile: 0,
        OwnerProfile: 1,
        CompanyProfile: 2,
        Summary: 3
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
        map(companyProfileMap, 'startedtradingdate', null, 'id-message-started-trading-date-div');

        map(companyProfileMap, 'companyType', null, 'companyType-message');

        map(companyProfileMap, 'beeLevel', null, 'beeLevel-message');
        map(companyProfileMap, 'industrySector', null, 'industrySector-message');
        map(companyProfileMap, 'industrySubSector', null, 'industrySubSector-message');

        map(companyProfileMap, 'name-registered-address', null, 'autocomplete-message');
        map(companyProfileMap, 'regaddr1', null, 'regaddr1-message');
        map(companyProfileMap, 'citytown', null, 'citytown-message');
        map(companyProfileMap, 'postalcode', null, 'postalcode-message');
        map(companyProfileMap, 'companyProfileProvinceSelect', null, 'province-message');

        map(companyProfileMap, "name-input-total-number-of-owners", null, 'id-div-message-total-number-of-owners');
        map(companyProfileMap, "name-input-how-many-are-south-africans", null, 'id-div-message-how-many-are-south-africans');
        map(companyProfileMap, "name-input-how-many-are-not-south-africans", null, 'id-div-message-how-many-are-not-south-africans');
        map(companyProfileMap, "name-input-how-many-are-companies-organisations", null, 'id-div-message-how-many-are-companies-organisations');
        map(companyProfileMap, "name-input-black-coloured-indian-pdi", null, 'id-div-message-black-coloured-indian-pdi');
        map(companyProfileMap, "name-input-black-only", '#id-div-black-only', 'id-div-message-black-only');
        map(companyProfileMap, "name-input-women-any-race", null, 'id-div-message-women-any-race');
        //map(companyProfileMap, "name-input-women-pdi", '#id-div-women-pdi', 'id-div-message-women-pdi');
        map(companyProfileMap, "name-input-women-black-only", '#id-div-women-black-only', 'id-div-message-women-black-only');
        map(companyProfileMap, "name-input-disabled-any-race", null, 'id-div-message-disabled-any-race');
        map(companyProfileMap, "name-input-youth-under-35-any-race", null, 'id-div-message-youth-under-35-any-race');

        map(companyProfileMap, 'atleastoneormorename', null, 'atleastoneormoremessage');

        //map(companyProfileMap, 'numberofowners', null, 'number-of-owners-message');

        // Employees
        map(companyProfileMap, 'numberoffulltimeemployees', null, 'number-of-fulltime-employees-message');
        map(companyProfileMap, 'numberoffulltimewomenemployees', null, 'number-of-fulltime-women-employees-message');
        map(companyProfileMap, 'numberoffulltimeemployeesunder35', null, 'number-of-fulltime-employees-under35-message');
        map(companyProfileMap, 'numberofparttimeemployees', null, 'number-of-parttime-employees-message');
        map(companyProfileMap, 'numberofparttimewomenemployees', null, 'number-of-parttime-women-employees-message');
        map(companyProfileMap, 'numberofparttimeemployeesunder35', null, 'number-of-parttime-employees-under35-message');

        //_validations.push(FormValidation.formValidation(
        //    _formEl,
        //    {
        //        fields: {
        //
        //        },
        //        plugins: {
        //            trigger: new FormValidation.plugins.Trigger(),
        //            bootstrap: new FormValidation.plugins.Bootstrap()
        //        }
        //    }
        //));

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

					'name-input-user-profile-mobile-verify': {
						validators: {
                            callback: {
                                message: 'Invalid Mobile Number',
								callback : function(arg) {
									let regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
                                    let res = regex.test(arg.value);
                                    app.onboard.user.notify('field-valid', {
                                        field: 'name-input-user-profile-mobile-verify',
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
					'name-input-user-profile-identity-verify': {
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

					capacity1: {
                        validators: {
                            notEmpty: {
                                message: 'Please select owner capacity'
                            }
						}
                    },
                    other1: {
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
                            if (field == 'capacity1') {
                                let elem = document.getElementById('id-user-profile-owner');
                                if (elem.checked == true) {
                                    return true;
                                } else {
                                    return false;
                                }						
                            }
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
					'name-input-owner-profile-mobile-verify': {
						validators: {
                            callback: {
                                message: 'Invalid Mobile Number',
								callback : function(arg) {
									let regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
                                    let res = regex.test(arg.value);
                                    app.onboard.owner.notify('field-valid', {
                                        field: 'name-input-owner-profile-mobile-verify',
                                        valid: res
                                    });
									return res;
								}
							}
						}
                    },

                    'name-input-owner-profile-identity-verify': {
						validators: {
                            callback: {
                                message: 'Invalid Identity Number',
								callback : function(arg) {
									//let regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/;
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
                    'validate-owner-profile-age': {
                        validators: {
                            notEmpty: {
                                message: 'Identity validation required'
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
                                    let NOT_REGISTERED = app.localize('NotRegistered');
                                    let REGISTERED_NOT_LISTED = app.localize('Registered');
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

                    beeLevel: {
                        validators: {
                            notEmpty: {
                                message: 'BEE Level required'
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
					}		,
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

                    atleastoneormorename: {
                        validators: {
                            callback: {
                                callback: function (arg) {
                                    function validateOwnership(status) {
                                        function defaultTo(val, def) {
                                            if (isNaN(val) == true) {
                                                return def;
                                            } else {
                                                return val;
                                            }
                                        }
                                        let n = parseInt($('#id-input-total-number-of-owners').val());
                                        let a = parseInt($('#id-input-how-many-are-south-africans').val());
                                        let b = parseInt($('#id-input-how-many-are-not-south-africans').val());
                                        let c = parseInt($('#id-input-how-many-are-companies-organisations').val());
                                        a = defaultTo(a, 0);
                                        b = defaultTo(b, 0);
                                        c = defaultTo(c, 0);
                                        n = defaultTo(n, 0);
                                        return (n == (a + b + c)) && (n > 0);
                                    }
                                    let status = AddStatus();
                                    let result = validateOwnership(status);
                                    return result;
                                },
                                message: 'The above fields must equal the total number of owners'//app.localize('OW_AboveFourFieldsMustTotal100Percent')
                            }
                        }
                    },

                    "name-input-total-number-of-owners": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    _validations[PAGE.CompanyProfile].validateField('atleastoneormorename').then(function (status) {
                                    });
                                    return true;
                                }
                            }
                        }
                    },

                    "name-input-how-many-are-south-africans": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    _validations[PAGE.CompanyProfile].validateField('atleastoneormorename').then(function (status) {
                                    });
                                    return true;
                                }
                            }
                        }
                    },

                    "name-input-how-many-are-not-south-africans": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    _validations[PAGE.CompanyProfile].validateField('atleastoneormorename').then(function (status) {
                                    });
                                    return true;
                                }
                            }
                        }
                    },

                    "name-input-how-many-are-companies-organisations": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    _validations[PAGE.CompanyProfile].validateField('atleastoneormorename').then(function (status) {
                                    });
                                    return true;
                                }
                            }
                        }
                    },

                    "name-input-black-coloured-indian-pdi": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter percentage'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    if (isNaN(val) == true) {
                                        _validations[PAGE.CompanyProfile].resetField('name-input-black-only');
                                    } else {
                                        _validations[PAGE.CompanyProfile].validateField('name-input-black-only').then(function (status) {
                                        });
                                    }
                                    return true;
                                }
                            }
                        }
                    },

                    "name-input-black-only": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter percentage'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    if (isNaN(val) == true) {
                                        return true;
                                    } else {
                                        let max = parseInt($("#id-input-black-coloured-indian-pdi").val());
                                        if (isNaN(max) == true) {
                                            return true;
                                        } else {
                                            return val <= max;
                                        }
                                    }
                                },
                                message : 'Percentage cannot exceed the above field'
                            }
                        }
                    },


                    "name-input-women-any-race": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter percentage'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    if (isNaN(val) == true) {
                                        _validations[PAGE.CompanyProfile].resetField('name-input-women-black-only');
                                    } else {
                                        _validations[PAGE.CompanyProfile].validateField('name-input-women-black-only').then(function (status) {
                                        });
                                    }
                                    return true;
                                }
                            }
                        }
                    },

                    "name-input-women-black-only": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter percentage'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    if (isNaN(val) == true) {
                                        return true;
                                    } else {
                                        let max = parseInt($("#id-input-women-any-race").val());
                                        if (isNaN(max) == true) {
                                            return true;
                                        } else {
                                            return val <= max;
                                        }
                                    }
                                },
                                message: 'Percentage cannot exceed the above field'
                            }
                        }
                    }, 
                    "name-input-disabled-any-race": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter percentage'
                            },
                            callback: {
                                callback: function (arg) {
                                    return true;
                                }
                            }
                        }
                    },

                    "name-input-youth-under-35-any-race": {
                        validators: {
                            notEmpty: {
                                message: 'Please enter percentage'
                            },
                            callback: {
                                callback: function (arg) {
                                    return true;
                                }
                            }
                        }
                    },

                    // Emplyees...
                    numberoffulltimeemployees: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter number'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    let field1 = parseInt($('#NumberOfFullTimeWomenEmployees').val());
                                    let field2 = parseInt($('#NumberOfFullTimeEmployeesUnder35').val());
                                    if (isNaN(val) == false) {
                                        if (isNaN(field1) == false) {
                                            _validations[PAGE.CompanyProfile].validateField('numberoffulltimewomenemployees');
                                        }
                                        if (isNaN(field2) == false) {
                                            _validations[PAGE.CompanyProfile].validateField('numberoffulltimeemployeesunder35');
                                        }
                                    } else {
                                        if (isNaN(val) == true) {
                                            _validations[PAGE.CompanyProfile].resetField('numberoffulltimewomenemployees');
                                            _validations[PAGE.CompanyProfile].resetField('numberoffulltimeemployeesunder35');
                                        }
                                    }
                                    return true;
                                }
                            }
                        }
                    },
                    numberoffulltimewomenemployees: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter number'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    if (isNaN(val) == true) {
                                        return true;
                                    }
                                    let max = parseInt($('#NumberOfFullTimeEmployees').val());
                                    return val <= max;
                                },
                                message: 'Field cannot exceed number of full-time employees'
                            }
                        }
                    },
                    numberoffulltimeemployeesunder35: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter number'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    if (isNaN(val) == true) {
                                        return true;
                                    }
                                    let max = parseInt($('#NumberOfFullTimeEmployees').val());
                                    return val <= max;
                                },
                                message: 'Field cannot exceed number of full-time employees'
                            }
                        }
                    },
                    numberofparttimeemployees: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter number'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    let field1 = parseInt($('#NumberOfPartTimeWomenEmployees').val());
                                    let field2 = parseInt($('#NumberOfPartTimeEmployeesUnder35').val());
                                    if (isNaN(val) == false) {
                                        if (isNaN(field1) == false) {
                                            _validations[PAGE.CompanyProfile].validateField('numberofparttimewomenemployees');
                                        }
                                        if (isNaN(field2) == false) {
                                            _validations[PAGE.CompanyProfile].validateField('numberofparttimeemployeesunder35');
                                        }
                                    } else {
                                        if (isNaN(val) == true) {
                                            _validations[PAGE.CompanyProfile].resetField('numberofparttimewomenemployees');
                                            _validations[PAGE.CompanyProfile].resetField('numberofparttimeemployeesunder35');
                                        }
                                    }
                                    return true;
                                }
                            }
                        }
                    },
                    numberofparttimewomenemployees: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter number'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    if (isNaN(val) == true) {
                                        return true;
                                    }
                                    let max = parseInt($('#NumberOfPartTimeEmployees').val());
                                    return val <= max;
                                },
                                message: 'Field cannot exceed number of part-time employees'
                            }
                        }
                    },
                    numberofparttimeemployeesunder35: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter number'
                            },
                            callback: {
                                callback: function (arg) {
                                    let val = parseInt(arg.value);
                                    if (isNaN(val) == true) {
                                        return true;
                                    }
                                    let max = parseInt($('#NumberOfPartTimeEmployees').val());
                                    return val <= max;
                                },
                                message: 'Field cannot exceed number of part-time employees'
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

                                //case 'companyProfileProvinceSelect':
                                //    return true;

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
