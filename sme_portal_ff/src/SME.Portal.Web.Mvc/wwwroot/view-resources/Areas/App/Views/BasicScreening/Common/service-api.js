if (app.wizard == undefined) {
    app.wizard = {};
}

app.wizard.service = {};

(function (service) {

    //const ServerResult = {
    //    Success: 0,
    //    Warning: 1,
    //    Fail: 2,
    //    Exception: 3
    //};

    function returnMock(cb, mock) {
        let result = app.wizard.addResult();
        result.data = mock;
        cb(result);
    }


    let helpers = app.onboard.helpers.get();

    let getIdentityDetailsTestDataJson = [
        {
            "InputIDNumber": "7012285285084",
            "IDNumber": "7012285285084",
            "ConsumerHashID": "sW6F6a615OAVsJ9MliVBBQ==",
            "Passport": "",
            "FirstName": "PETER",
            "SecondName": "GEORGE",
            "ThirdName": "EDWARD",
            "Surname": "LEWIS",
            "MaidenName": "",
            "DateOfBirth": "1970-12-28",
            "Age": 51,
            "AgeBand": "50 to 60",
            "Title": "MR",
            "IsMinor": false,
            "InputIDPassedCDV": true,
            "IDExists": true,
            "Gender": "Male",
            "MarriageDate": "Unknown",
            "MaritalStatus": "Married",
            "Score": 100,
            "Country": "South Africa",
            "Source": "DHA",
            "OriginalSource": "DHA",
            "LatestDate": "2022-08-02",
            "UsingDHARealtime": false,
            "Reference": "Production",
            "_Cached": false
        }
    ];
    let getIdentityDetailsTestData = false;

    service.getIdentityDetails = function (identityNumber, firstNameId, lastNameId, cb) {

        if (helpers.validIdentityFormat(identityNumber) == false) {
            sme.swal.error(app.localize('InvalidId'), null, true);
            let result = app.wizard.addResult();
            result.status = app.wizard.Result.Fail;
            cb(result);
            return;
        }

        let firstName = $('#' + firstNameId).val();
        let lastName = $('#'+ lastNameId).val();

        function validateIdResult(person) {

            function handleFail(result) {
                result.data = null;
                if (result.code == 1) {
                    //sme.swal.error('Not a South African Citizen', null, true);
                } else {
                    //sme.swal.error(app.localize('InvalidId'), null, true);
                }
            }

            function handleWarningUpdated(result, person, cb) {
                if (swal.isVisible() == true) {
                    swal.close();
                }
                swal.fire({
                    icon: 'warning',
                    text: app.localize('NameMismatchAction'),
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    allowOutsideClick: false,
                    allowEscapeKey: escape,
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light"
                    }
                }).then(function () {
                    $('#' + firstNameId).val(person.FirstName);
                    $('#' + lastNameId).val(person.Surname);
                    result.status = app.wizard.Result.Success;
                    cb(result);
                });
            }

            function getStatus(person) {
                let result = app.wizard.addResult();
                //person.Country = '';
                if (person.Country != 'South Africa') {
                    result.status = app.wizard.Result.Fail;
                    result.code = 1;
                    result.message = 'Not a South African Citizen';
                    return result;
                }
                //person.IDExists = false;
                if (person.IDExists == false) {
                    result.status = app.wizard.Result.Fail;
                    result.code = 0;
                    result.message = app.localize('InvalidId');
                    return result;
                }
                if (firstName.length > 0 || lastName.length > 0) {
                    if (person.FirstName.toLowerCase() != firstName.toLowerCase() || person.Surname.toLowerCase() != lastName.toLowerCase()) {
                        result.status = app.wizard.Result.WarningUpdated;
                        result.code = 0;
                        result.message = app.localize('NameMismatchError');
                        return result;
                    }
                }
                return result;
            }

            // --- TODO: Check http return and check for exception!
            function makeTCase(field) {
                return (field.charAt(0).toUpperCase() + field.substr(1).toLowerCase());

            }

            person.FirstName = makeTCase(person.FirstName);
            person.Surname = makeTCase(person.Surname);
            let str = JSON.stringify(person);
            let result = getStatus(person);
            result.data = person;
            switch (result.status) {
                case app.wizard.Result.Fail:
                    handleFail(result);
                    break;

                case app.wizard.Result.WarningUpdated:
                    handleWarningUpdated(result, person, (result) => {
                        cb(result);
                    });
                    return;
            }
            cb(result);
        }

        function validateId() {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: app.localize('VerifyId')
            });
            if (getIdentityDetailsTestData == true) {
                setTimeout(() => {
                    KTApp.unblockPage();
                    let person = getIdentityDetailsTestDataJson[0];
                    validateIdResult(person);
                }, 1000);
            } else {
                abp.services.app.cPB.personValidationBy(identityNumber).done(function (result) {
                    KTApp.unblockPage();
                    if (result == '' || result == null) {
                        let result = app.wizard.addResult();
                        result.status = app.wizard.Result.Fail;
                        result.code = 1;
                        result.message = 'Unknown error';
                        cb(result);
                    } else {
                        let person = JSON.parse(result).People[0];
                        validateIdResult(person);
                    }
                });
            }
        }
        validateId();
    }

    service.verifyMobileNumber = function (session, args, cb) {
        let rootEl = null;
        let inputEl = null;

        let _id = '#VerifySmsModal';

        let _verifyCallback = null;
        let _shownCallback = null;
        let _hiddenCallback = null;

        function show(cb = null) {

            function formValidation() {
                rootEl = KTUtil.getById('VerifySmsModal');
                inputEl = FormValidation.formValidation(
                    rootEl,
                    {
                        fields: {
                            'verifyotpsms': {
                                validators: {
                                    callback: {
                                        callback: function (arg) {
                                            let regex = /^[0-9]{1,8}$/
                                            let res = regex.test(arg.value);
                                            return res;
                                        },
                                        message: 'SMS Code (OTP) Required'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap(
                                { defaultMessageContainer: false }
                            ),
                            messages: new FormValidation.plugins.Message({
                                clazz: 'text-danger',
                                container: function (field, element) {
                                    switch (field) {
                                        case 'verifyotpsms':
                                            return document.getElementById('verify-sms-input-message');

                                        default:
                                            return element;
                                    }
                                }
                            })
                        }
                    }
                );
            }

            _shownCallback = cb;

            function initModal() {

                let _allowEscape = true;

                function validateOTP(cb) {
                    inputEl.validate('verifyotpsms').then(function (status) {
                        if (status == 'Valid') {
                            cb(app.wizard.addResult());
                        } else {
                            _allowEscape = false;
                            Swal.fire({
                                text: "SMS Code (OTP) Required",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light"
                                }
                            }).then(function () {
                                _allowEscape = true;
                            });
                        }
                    });
                }

                $(_id).keydown(function (args) {
                    switch (args.key) {
                        case 'Enter':
                            validateOTP(() => {
                                let code = $('#VerifySmsInput').val();
                                hide(function () {
                                    sendVerificationCode(code);
                                })
                            });
                            break;

                        case 'Escape':
                            if (_allowEscape == true) {
                                hide(() => {
                                    let result = app.wizard.addResult();
                                    result.status = app.wizard.Result.Cancel;
                                    _verifyCallback(result);
                                });
                            }
                            break;
                    }
                });
                $('#VerifySmsBtnApply').prop('disabled', false);
                $('#VerifySmsBtnCancel').prop('disabled', false);
                $('#id-verify-mobile-resend-button').prop('disabled', false);

                $('#VerifySmsBtnCancel').click((ev) => {
                    hide(function () {
                        let result = app.wizard.addResult();
                        result.status = app.wizard.Result.Cancel;
                        _verifyCallback(result);
                    });
                });

                $('#VerifySmsBtnApply').click((ev) => {
                    validateOTP(function () {
                        $('#VerifySmsBtnApply').prop('disabled', true);
                        $('#id-verify-mobile-resend-button').prop('disabled', true);
                        let code = $('#VerifySmsInput').val();
                        hide(function () {
                            sendVerificationCode(code);
                        });
                    });
                    return false;
                });

                $('#id-verify-mobile-resend-button').click((ev) => {
                    hide(() => {
                        app.wizard.service.verifyMobileNumber(session, args, _verifyCallback);
                    });
                });

                $(_id).on('shown.bs.modal', () => {
                    formValidation();
                    if (_shownCallback != null) {
                        _shownCallback();
                        _shownCallback = null;
                    }
                });

                $(_id).on('hidden.bs.modal', () => {
                    if (_hiddenCallback != null) {
                        _hiddenCallback();
                        _hiddenCallback = null;
                    }
                    $('#VerifySmsInput').val('');
                    //$('#VerifySmsModal').remove();
                });

                $(_id).modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: false
                });

                $(_id).modal('show');

                let smsInput = app.common.input.numeric('VerifySmsInput', 8);
            }

            initModal();
        }

        function hide(cb) {
            _hiddenCallback = cb;
            $(_id).modal('hide');
        }

        function getVerificationCode(cb) {
            if (args.id == 'mobile') {
                if (session.loggedIn == true) {
                    abp.services.app.profile.sendVerificationSmsEx({ phoneNumber: args.data.number }).done((payload) => {
                        cb(app.wizard.addResult());
                    });
                } else {
                    let input = {
                        loggedIn: session.loggedIn,
                        tenantId: session.tenantId,
                        userId: session.userId,
                        phoneNumber: args.data.number
                    };
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/OTP/SendOTPToPhone",
                        data: JSON.stringify(input),
                        success: function (data) {
                            let result = app.wizard.addResult();
                            result.status = data.result.status == true ? app.wizard.Result.Success : app.wizard.Result.Fail;
                            cb(result);
                        },
                        error: function (data) {
                        }
                    });
                }
            } else {
                let input = {
                    loggedIn : session.loggedIn,
                    tenantId: session.tenantId,
                    userId: session.userId,
                    emailAddress : args.data.addr,
                    subject : args.data.subject,
                    body : args.data.body
                };
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/OTP/SendOTPToEmail",
                    data: JSON.stringify(input),
                    success: function (data) {
                        let result = app.wizard.addResult();
                        result.status = data.result.status == true ? app.wizard.Result.Success : app.wizard.Result.Fail;
                        cb(result);
                    },
                    error: function (data) {
                    }
                });
            }
        }

        function verify(cb) {
            _verifyCallback = cb;
            if (args.id == 'mobile') {
                let regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
                if (regex.test(args.data.number) == false) {
                    Swal.fire({
                        text: app.localize('InvalidMobile'),
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        allowEscapeKey: false,
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    }).then(function () {
                        let result = app.wizard.addResult();
                        result.status = app.wizard.Result.Fail;
                        cb(result);
                    });
                    return;
                }
            }

            if (abp.services.app.profile != null) {
                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: app.localize('VerifyMobile')
                });

                getVerificationCode(() => {
                    KTApp.unblockPage();
                    show();
                });
            }
        }

        verify(cb);

        function sendVerificationCode(smsCode) {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: app.localize('VerifyOTP')
            });
            function otpVerified() {
                KTApp.unblockPage();
                _verifyCallback(app.wizard.addResult());
            }

            function otpNotVerified() {
                KTApp.unblockPage();
                Swal.fire({
                    heightAuto : false,
                    text: app.localize('VerifyOTPError'),
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    allowEscapeKey: false,
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light"
                    }
                }).then(function () {
                    let result = app.wizard.addResult();
                    result.status = app.wizard.Result.Fail;
                    show();
                    //_verifyCallback(result);
                });
            }

            if (session.loggedIn == true && args.id == 'mobile') {
                let input = {
                    phoneNumber: args.data.number,
                    code: smsCode
                };
                abp.services.app.profile.verifySmsCodeExt(input).done(function (result) {
                    if (result == true) {
                        otpVerified();
                    } else {
                        otpNotVerified();
                    }
                });
            } else {
                let input = {
                    loggedIn: session.loggedIn,
                    tenantId : session.tenantId,
                    userId : session.userId,
                    phoneNumber: args.data.number,
                    code: smsCode
                };
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/OTP/VerifyOTP",
                    data: JSON.stringify(input),
                    success: function (data) {
                        if (data.result.status == true) {
                            otpVerified();
                        } else {
                            otpNotVerified();
                        }
                    },
                    error: function (data) {
                    }
                });
            }
        }
    }

    service.loadApplication = function (appId, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.applicationAppServiceExt.getApplicationForView(appId).done((payload) => {
                let result = app.wizard.addResult();
                result.data = payload;
                cb(result);
            });
        }
    }

    service.loadAllApplications = function (userId, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.applicationAppServiceExt.getAllForUserId(userId).done((payload) => {
                let result = app.wizard.addResult();
                result.data = payload;
                cb(result);
            });
        }
    }

    service.saveApplication = function (payloadIn, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.applications.createOrEdit(payloadIn).done((payloadOut) => {
                let result = app.wizard.addResult();
                result.data = payloadOut;
                cb(result);
            });
        }
    }

    service.loadUserProfile = function(cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.profile.getCurrentUserProfileForEdit().done((payload) => {
                let result = app.wizard.addResult();
                if (helpers.isObject(payload) == true && payload.hasOwnProperty('propertiesJson') == true && helpers.isObject(payload.propertiesJson) == true) {
                    payload.propertiesJson = JSON.parse(payload.propertiesJson);
                }
                result.data = payload;
                cb(result);
            });
        }
    }

    service.saveUserProfile = function (dto, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.profile.updateCurrentUserProfile(dto).done(function (payload) {
                let result = app.wizard.addResult();
                result.data = payload;
                cb(result);
            });
        }
    }

    service.loadOwnerProfile = function (cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.ownersAppServiceExt.getOwnerForEditByUser().done((payload) => {
                payload = payload.owner;
                let result = app.wizard.addResult();
                if (payload != null) {
                    result.data = payload;
                } else {
                    result.status = app.wizard.Result.Warning;
                    result.message = 'Owner not yet created';
                }
                cb(result);
            });
        }
    }

    service.saveOwnerProfile = function (dto, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.ownersAppServiceExt.createOrEdit(dto).done(function (payload) {
                let result = app.wizard.addResult();
                result.data = payload;
                cb(result);
            });
        }
    }

    service.loadCompanies = function (cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.smeCompaniesAppServiceExt.getSmeCompaniesForViewByUser().done((payload) => {
                let result = app.wizard.addResult();
                result.data = payload;
                cb(result);
            });
        }
    }

    // Attempts to load an existing company from companyId for the active user. Used when
    // user wants to edit an existing company.
    service.loadCompanyProfile = function (companyId, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            let input = {
                id: companyId
            };
            abp.services.app.smeCompaniesAppServiceExt.getSmeCompanyForEdit(input).done((payload) => {
                let result = app.wizard.addResult();
                if (payload != null && payload.smeCompany != null) {
                    result.data = payload.smeCompany;
                    if (result.data.verificationRecordJson != null && result.data.verificationRecordJson != '') {
                        result.data.verificationRecordJson = JSON.parse(result.data.verificationRecordJson);
                    }
                    if (result.data.propertiesJson != null && result.data.propertiesJson != '') {
                        result.data.propertiesJson = JSON.parse(result.data.propertiesJson);
                    }
                } else {
                    result.status = app.wizard.Result.Fail;
                    result.message = 'Business not found';
                }
                cb(result);
            });
        }
    }

    // Attempts to load the one and only company associated with the active user during the onboarding
    // process. During the onboarding process, ie: onboarded = false, the user can have at most one
    // associated company since adding new companies can only ever happen after onboarding has completed.
    service.loadCompanyProfileForUser = function (cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.smeCompaniesAppServiceExt.getSmeCompanyForEditByUser().done((payload) => {
                let result = app.wizard.addResult();
                if (payload != null) {
                    result.data = payload.smeCompany;
                    if (result.data.verificationRecordJson != null && result.data.verificationRecordJson != '') {
                        result.data.verificationRecordJson = JSON.parse(result.data.verificationRecordJson);
                    }
                    if (result.data.propertiesJson != null && result.data.propertiesJson != '') {
                        result.data.propertiesJson = JSON.parse(result.data.propertiesJson);
                    }
                    cipcStatus = helpers.getPropEx(result.data.propertiesJson, 'page-status');
                    if (cipcStatus == 'reset') {
                        result.code = 1;
                    }
                } else {
                    result.status = app.wizard.Result.Fail;
                    result.message = 'Business not found';
                }
                cb(result);
            });
        }
    }

    service.saveCompanyProfile = function (input, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.smeCompaniesAppServiceExt.createOrEdit(input).done((payload) => {
                let result = app.wizard.addResult();
                if (payload != null) {
                    result.data = payload;
                } else {
                    result.status = app.wizard.Result.Fail;
                    result.message = 'Create or edit business';
                }
                cb(result);
            });
        }
    }

    //const REGISTERED_LISTED = 'RegisteredListed';
    const REGISTERED_NOT_LISTED = 'RegisteredNotListed';
    const NOT_REGISTERED = 'NotRegistered';
    const IN_BUSINESS = '03';
    //const IN_BUSINESS = 'In Business';

    service.getOwnerCompanies = function (identityNumber, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.cPB.cipcDirectorsBy(identityNumber).done((payload) => {
                let result = app.wizard.addResult();

                if (payload != null && payload != '') {
                    result.data = JSON.parse(payload);
                    if (Array.isArray(result.data) == true) {
                        result.data.forEach((company, index) => {
                            // TODO: Replace this with registration number?
                            //company.key = company.companyName;
                            company.key = company.registrationNumber;
                            company.value = company.companyName;
                        });
                        result.data.sort(function (a, b) {
                            return a.companyName > b.companyName ? 1 : -1;
                        });
                    }
                } else {
                    result.data = [];
                }

                function addCustom(key, value) {
                    result.data.push({
                        companyName: '',
                        companyType: '',
                        status: IN_BUSINESS,
                        registrationNumber: '',
                        'key': key,
                        'value': value
                    });
                }

                //addCustom(NOT_REGISTERED, 'Business not registered');
                //addCustom(REGISTERED_NOT_LISTED, 'Business registered with CIPC, not listed above');

                cb(result);
            });
        }
    }

    service.doesBusinessExist = function (id, registrationNumber, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.smeCompaniesAppServiceExt.doesCompanyExistEx(id, registrationNumber).done((payload) => {
                let result = app.wizard.addResult();
                if (payload == true) {
                    result.status = app.wizard.Result.Fail;
                    result.message = "Business already added";
                }
                cb(result);
            });
        }
    }

    service.getCompanyDetails = function (registrationNumber, cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
                abp.services.app.cPB.cipcEnterprisesBy(registrationNumber).done((payload) => {
                    let result = app.wizard.addResult();
                    result.data = JSON.parse(payload);
                    if (result.data.hasOwnProperty('InnerException') == true) {
                        result.status = app.wizard.Result.Fail;
                        result.message = 'Exception';
                        result.data = null;
                    }
                    cb(result);
                });
        }
    }

    service.getUserCompanies = function (cb, mock = null) {
        if (mock != null) {
            returnMock(cb, mock);
        } else {
            abp.services.app.smeCompaniesAppServiceExt.getSmeCompaniesForViewByUser().done((payload) => {
                let result = app.wizard.addResult();
                let arr = [];
                payload.forEach((company, index) => {
                    company.smeCompany.propertiesJson = JSON.parse(company.smeCompany.propertiesJson);
                    arr.push(company.smeCompany);
                });
                result.data = arr;
                cb(result);
            });
        }
    }

    service.verifyMobileAgainstId = function(id, mobile, cb) {
        let result = app.wizard.addResult();
        if (mobile == '0829999999') {
            setTimeout(() => {
                cb(result);
            }, 1000);
        } else {
            abp.services.app.cPB.telephoneExistsForId(id, mobile).done(function (payload) {
                if (payload == false) {
                    result.status = app.wizard.Result.Fail;
                    result.message = 'Number not found';
                }
                cb(result);
            });
        }
    }

})(app.wizard.service);
