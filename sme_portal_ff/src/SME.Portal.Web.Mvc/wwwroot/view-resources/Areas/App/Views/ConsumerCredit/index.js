'use strict';

$(function () {
    if (app.consumerCredit == undefined) {
        app.consumerCredit = {};
    }

    (function (consumerCredit) {

        function Load() {

            let control = null;
            control = app.control.input('cc-identity-input-name', 'cc-identity-input-id');
            control.format(13);
            control = app.control.input('cc-mobile-sel-name', 'cc-mobile-sel-id');
            control.format(10);

            let ServerResult = {
                Success: 0,
                Warning: 1,
                Fail: 2,
                Exception: 3
            };

            let _scoreRatings = [
                { min: 0, max: 299, class: 'sme-score-unknown' },
                { min: 300, max: 449, class: 'sme-score-poor' },
                { min: 450, max: 549, class: 'sme-score-not-good' },
                { min: 550, max: 649, class: 'sme-score-good' },
                { min: 650, max: 10000, class: 'sme-score-excellent' }
            ];

            let onFieldValidate = null;

            let formEl = KTUtil.getById('myTabContent3');
            let page = FormValidation.formValidation(
                formEl,
                {
                    fields: {
                        'cc-identity-input-name': {
                            validators: {
                                notEmpty: {
                                    message: 'Identity number required'
                                },
                                callback: {
                                    message: 'Invalid Identity Number',
                                    callback: function (arg) {
                                        let regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))/
                                        let res = regex.test(arg.value);
                                        if (onFieldValidate != null) {
                                            onFieldValidate('cc-identity-input-name', res);
                                        }
                                        return res;
                                    }
                                }
                            }
                        },
                        'cc-mobile-sel-name': {
                            validators: {
                                notEmpty: {
                                    message: 'Mobile number required'
                                },
                                callback: {
                                    message: 'Invalid Mobile Number',
                                    callback: function (arg) {
                                        let regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
                                        let res = regex.test(arg.value);
                                        if (onFieldValidate != null) {
                                            onFieldValidate('cc-mobile-sel-name', res);
                                        }
                                        return res;
                                    }
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
                                    case 'cc-identity-input-name':
                                        return document.getElementById('cc-identity-input-error');

                                    case 'cc-mobile-sel-name':
                                        return document.getElementById('cc-mobile-sel-error');

                                    default:
                                        return element;
                                }
                            }
                        })
                    }
                }
            );
            const minInterval = 1500;

            let _mobileNumber = null;
            let _identityNumber = null;
            let _firstName = null;
            let _surname = null;
            let _dob = null;
            let _enquiryReason = null;
            let _enquiryDoneBy = null;

            $('#cc-retrieve-btn-id').prop('disabled', true);

            $('#cc-identity-btn-id').prop('disabled', true);
            $('#cc-identity-btn-id').removeClass('pulse');

            function getCreditInfo(identityNumber, creditInfoCB) {

                function getReport(getReportCB) {

                    let input = {
                        identityNumber: _identityNumber,
                        dob: _dob,
                        firstName: (_firstName == '' || _firstName == null) ? 'User' : _firstName,
                        surname: (_surname == '' || _surname == null) ? 'User' : _surname,
                        enquiryReason: (_enquiryReason == '' || _enquiryReason == null) ? 'User Enquiry' : _enquiryReason,
                        enquiryDoneBy: (_enquiryDoneBy == '' || _enquiryDoneBy == null) ? 'User' : _enquiryDoneBy,
                        updateIfAllowed: true
                    };
                    let result = {
                        waiting: true,
                        output: null
                    };
                    if (input.enquiryReason == '' || input.enquiryReason == null) {
                        input.enquiryReason = 'User Enquiry';
                    }
                    abp.services.app.cCR.getReportEx(input).done(function (output) {
                        result.waiting = false;
                        result.output = output;
                    });
                    function gotReport(output) {
                        let status = {
                            result: false,
                            message: 'Unknown error'
                        };
                        if (output != null) {
                            switch (output.result) {
                                case ServerResult.Success:
                                    if (output.data.creditReport.creditReportJson != null) {
                                        let obj = JSON.parse(output.data.creditReport.creditReportJson);
                                        if (obj.hasOwnProperty('Error') == true) {
                                            status.message = obj.Error;
                                        } else {
                                            status.result = true;
                                            status.message = "Ok";
                                            status.data = obj;
                                        }
                                    }
                                    break;

                                case ServerResult.Fail: case ServerResult.Exception:
                                    status.message = output.message;
                                    break;
                            }
                        }
                        getReportCB(status);
                    }
                    let intervalId = window.setInterval(function () {
                        if (result.waiting == false) {
                            window.clearInterval(intervalId);
                            gotReport(result.output);
                        }
                    }, minInterval);
                }
                if (identityNumber != null) {
                    _identityNumber = identityNumber;
                }
                _dob = smec.dobFromId(_identityNumber);

                let counter = 1;

                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: 'Retrieving credit info...'
                });

                function getDone() {
                    counter--;
                    if (counter == 0) {
                        KTApp.unblockPage();
                        creditInfoCB();
                    }
                }

                getReport(function (status) {
                    if (status.result == true) {
                        let byteChars = atob(status.data.EncodedPDF);
                        smec.downloadBinary(byteChars, 'credit-report.pdf');
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
                    getDone();
                });
            }

            function getScore(cb) {
                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: 'Retrieving credit score...'
                });
                _dob = smec.dobFromId(_identityNumber);
                let input = {
                    identityNumber: _identityNumber,
                    dob: _dob,
                    firstName: (_firstName == '' || _firstName == null) ? 'User' : _firstName,
                    surname: (_surname == '' || _surname == null) ? 'User' : _surname,
                    enquiryReason: (_enquiryReason == '' || _enquiryReason == null) ? 'User Enquiry' : _enquiryReason,
                    enquiryDoneBy: (_enquiryDoneBy == '' || _enquiryDoneBy == null) ? 'User' : _enquiryDoneBy,
                    updateIfAllowed: true
                };
                let result = {
                    waiting: true,
                    output: null
                };
                if (input.enquiryReason == '' || input.enquiryReason == null) {
                    input.enquiryReason = 'User Enquiry';
                }
                abp.services.app.cCR.getReportEx(input).done(function (output) {
                    let status = {
                        result: false,
                        message: 'Unknown error'
                    };
                    if (output != null) {
                        switch (output.result) {
                            case ServerResult.Success:
                                if (output.data.creditReport.creditReportJson != null) {
                                    let obj = JSON.parse(output.data.creditReport.creditReportJson);
                                    if (obj.hasOwnProperty('Error') == true) {
                                        status.message = obj.Error;
                                    } else {
                                        status.result = true;
                                        status.message = "Ok";
                                        status.data = obj;
                                    }
                                }
                                break;

                            case ServerResult.Fail: case ServerResult.Exception:
                                status.message = output.message;
                                break;
                        }
                    }
                    KTApp.unblockPage();
                    cb(status);
                });
            }

            function getScorePresentation(cb = null) {
                getScore(function (status) {
                    //let result = app.wizard.addResult();
                    let result = {
                        status: 0,
                        exception: false,
                        code: 0,
                        message: '',
                        data: null
                    };
                    if (status.result == true) {
                        let arr = status.data.CreditScore.CreditScoreList;
                        let creditScore = arr[arr.length - 1].CreditScore;

                        function getRating(score) {
                            for (let i = 0, max = _scoreRatings.length; i < max; i++) {
                                if (score >= _scoreRatings[i].min && score <= _scoreRatings[i].max) {
                                    return _scoreRatings[i];
                                }
                            }
                            return null;
                        }
                        let rating = getRating(creditScore);
                        if (rating != null) {
                            $('#cc-retrieve-div-id').show();
                            $('#cc-retrieve-span-id').addClass(rating.class);
                            $('#cc-retrieve-span-id').text('Your Credit Score: ' + creditScore);
                            $('#cc-retrieve-span-id').show();
                            result.data = creditScore;

                            $('#cc-retrieve-btn-id').prop('disabled', false);
                            $('#cc-retrieve-btn-id').addClass('pulse2');
                            if (cb != null) {
                                cb(result);
                            }
                        } else {
                            if (cb != null) {
                                cb(result);
                            }
                        }
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
                            if(cb != null) {
                                cb(result);
                            }
                        });
                    }
                });
            }

            onFieldValidate = function (field, valid) {
                if (field == 'cc-identity-input-name') {
                    if (valid == true) {
                        $('#cc-identity-btn-id').addClass('pulse');
                        $('#cc-identity-btn-id').prop('disabled', false);
                    } else {
                        $('#cc-identity-btn-id').removeClass('pulse');
                        $('#cc-identity-btn-id').prop('disabled', true);
                    }
                } else if (field == 'cc-mobile-sel-name') {
                    if (valid == true) {
                        $('#cc-mobile-btn-id').addClass('pulse');
                        $('#cc-mobile-btn-id').prop('disabled', false);
                    } else {
                        $('#cc-mobile-btn-id').removeClass('pulse');
                        $('#cc-mobile-btn-id').prop('disabled', true);
                    }
                }
            }

            $('#cc-identity-span-id').text(app.localize('OW_IdentityVerifiedButton'));

            let _isOnboarded = false;

            $('#cc-identity-btn-id').on('click', function () {

                $('#div-identity-validation-fail').hide('fast');
                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: 'Validating idendity number...'
                });

                $('#cc-identity-input-id').prop('disabled', true);
                $('#cc-identity-btn-id').prop('disabled', true);
                $('#cc-identity-btn-id').removeClass('pulse');
                $('#cc-identity-span-id').text('Verifying');

                let identityNumber = $('#cc-identity-input-id').val();
                function validateIdentity(identityNumber, cb) {
                    abp.services.app.cPB.personValidationBy(identityNumber).done(function (result) {


                        function validateIdResult(person) {

                            function getStatus() {
                                let result = app.wizard.addResult();
                                if (person.Country != 'South Africa') {
                                    result.status = app.wizard.Result.Fail;
                                    result.code = 1;
                                    result.message = 'Not a South African Citizen';
                                    return result;
                                }
                                if (person.IDExists == false) {
                                    result.status = app.wizard.Result.Fail;
                                    result.code = 0;
                                    result.message = app.localize('InvalidId');
                                    return result;
                                }
                                return result;
                            }
                            let result = getStatus(person);
                            result.data = person;
                            cb(result);
                        }
                        KTApp.unblockPage();
                        let person = JSON.parse(result).People[0];
                        validateIdResult(person);
                    });
                }

                validateIdentity(identityNumber, (result) => {
                    function success() {
                        $('#div-identity-validation-fail').hide('fast');
                        // Disable button, and mark as Validated.
                        $('#cc-identity-input-id').prop('disabled', true);
                        $('#cc-identity-btn-id').prop('disabled', true);
                        $('#cc-identity-btn-id').removeClass('pulse');
                        $('#cc-identity-span-id').text(app.localize('OW_IdentityVerifiedButton'));

                        $('#cc-mobile-sel-id').prop('disabled', false);
                        $('#cc-mobile-sel-id').attr('placeholder', 'Enter a valid phone number and click Verify')
                        $('#cc-mobile-btn-id').removeClass('pulse');
                        $('#cc-mobile-span-id').text(app.localize('OW_IdentityVerifyButton'));


                        _identityNumber = identityNumber;
                        _dob = smec.dobFromId(_identityNumber);
                        _firstName = result.data.FirstName;
                        _surname = result.data.Surname;
                        _enquiryReason = 'Finfind App';
                        _enquiryDoneBy = (_firstName + ' ' + _surname);
                    }

                    function fail() {
                        $('#div-identity-validation-fail').show('fast');
                        // Enable button, and start flashing again.
                        $('#cc-identity-input-id').prop('disabled', false);
                        $('#cc-identity-btn-id').prop('disabled', false);
                        $('#cc-identity-btn-id').addClass('pulse');
                        $('#cc-identity-span-id').text(app.localize('OW_IdentityVerifyButton'));
                    }
                    // Check the result code.
                    if (result.status == app.wizard.Result.Fail) {
                        fail();
                    } else {
                        success();
                    }
                });

            });

            $('#cc-mobile-btn-id').on('click', function () {
                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: 'Validating phone number...'
                });

                $('#cc-mobile-sel-id').prop('disabled', true);
                $('#cc-mobile-btn-id').prop('disabled', true);
                $('#cc-mobile-btn-id').removeClass('pulse');
                let mobileNumber = $('#cc-mobile-sel-id').val();
                let identityNumber = $('#cc-identity-input-id').val();
                app.wizard.service.verifyMobileAgainstId(identityNumber, mobileNumber, (result) => {

                    function success() {
                        let session = {
                            loggedIn: true,
                            tenantId: abp.session.tenantId,
                            userId: abp.session.userId
                        };
                        let args = {
                            id: 'mobile',
                            data: {
                                number: mobileNumber
                            }
                        };
                        app.wizard.service.verifyMobileNumber(session, args, (result) => {
                        //app.wizard.service.verifyMobileNumber(null, mobileNumber, (result) => {
                            KTApp.unblockPage();

                            function success() {
                                $('#cc-mobile-span-id').text('Verified');
                                // Get report.
                                getScorePresentation((result) => {
                                });
                            }

                            function cancel() {
                            }

                            function fail() {
                                $('#cc-identity-input-id').prop('disabled', false);
                                $('#cc-identity-btn-id').prop('disabled', false);
                                $('#cc-identity-btn-id').addClass('pulse');
                                $('#cc-identity-span-id').text(app.localize('OW_IdentityVerifyButton'));

                                $('#cc-mobile-sel-id').prop('disabled', true);
                                $('#cc-mobile-btn-id').removeClass('pulse');
                                $('#cc-mobile-span-id').text(app.localize('OW_IdentityVerifyButton'));
                            }

                            switch (result.status) {
                                case app.wizard.Result.Success:
                                    success();
                                    break;

                                case app.wizard.Result.Cancel:
                                    cancel();
                                    break;

                                case app.wizard.Result.Fail:
                                    fail();
                                    break;
                            }
                        });
                    }

                    function fail() {
                        KTApp.unblockPage();
                        Swal.fire({
                            html: 'Mobile Number could not be matched against numbers listed for this Identity Number<br/><br/>Please capture another Identity Number or Mobile Number and verify again',
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            }
                        }).then(function () {
                            $('#cc-identity-input-id').val('');
                            $('#cc-identity-input-id').prop('disabled', false);
                            $('#cc-identity-btn-id').prop('disabled', true);
                            //$('#cc-identity-btn-id').addClass('pulse');
                            $('#cc-identity-span-id').text(app.localize('OW_IdentityVerifyButton'));

                            $('#cc-mobile-sel-id').removeAttr('placeholder');
                            $('#cc-mobile-sel-id').val('');
                            $('#cc-mobile-sel-id').prop('disabled', true);
                            $('#cc-mobile-btn-id').removeClass('pulse');
                            $('#cc-mobile-span-id').text(app.localize('OW_IdentityVerifyButton'));
                        });
                    }

                    if (result.status == app.wizard.Result.Success) {
                        success();
                    } else {
                        fail();
                    }
                });
            })

            $('#cc-retrieve-btn-id').on('click', function () {
                $('#cc-retrieve-btn-id').removeClass('pulse2');
                $('#cc-retrieve-btn-id').prop('disabled', true);
                let identityNumber = $('#cc-identity-input-id').val();
                getCreditInfo(identityNumber, function () {
                    //$('#cc-retrieve-btn-id').hide();
                });
            });

            function InitEx(firstName, lastName, identityNumber) {
                _identityNumber = identityNumber;
                _firstName = firstName;
                _surname = lastName;
                _enquiryReason = 'Finfind App';
                _enquiryDoneBy = (_firstName + ' ' + _surname);
            }

            function Init(model) {
                let data = model;//JSON.parse(model);
                _identityNumber = data.identityNumber;
                _firstName = data.firstName;
                _surname = data.surname;
                _enquiryReason = 'Finfind App';
                _enquiryDoneBy = (_firstName + ' ' + _surname);
            }

            function AutoValidateId(cb = null) {
                $('#cc-mobile-div-id').hide();
                $('#cc-identity-input-id').prop('disabled', true);
                $('#cc-identity-btn-id').prop('disabled', true);
                $('#cc-identity-btn-id').removeClass('pulse');
                $('#cc-identity-input-id').val(_identityNumber);
                //validateIdClick(cb);
                getScorePresentation((result) => {
                    if (cb != null) {
                        //let result = app.wizard.addResult();
                        cb(result);
                    }
                });

            }

            function InitOwner(cb, isOnboarded) {
                _isOnboarded = isOnboarded == 'True';
                if (_isOnboarded == true) {
                    $('#cc-mobile-div-id').hide();
                    $('#cc-identity-input-id').prop('disabled', true);
                    $('#cc-identity-btn-id').prop('disabled', true);
                    $('#cc-identity-btn-id').removeClass('pulse');
                    abp.services.app.ownersAppServiceExt.getOwnerForViewByUser().done(function (dto) {
                        _mobileNumber = dto.owner.phoneNumber;
                        _identityNumber = dto.owner.identityOrPassport;
                        _firstName = dto.owner.name;
                        _surname = dto.owner.surname;
                        _enquiryDoneBy = (_firstName + ' ' + _surname);
                        $('#cc-identity-input-id').val(_identityNumber);
                        cb(true);
                    });
                } else {
                    $('#cc-mobile-div-id').show();
                    $('#cc-identity-input-id').prop('disabled', false);
                    $('#cc-identity-btn-id').prop('disabled', true);
                    //$('#cc-identity-btn-id').addClass('pulse');

                    $('#cc-identity-span-id').text(app.localize('OW_IdentityVerifyButton'));
                    cb(false);
                }
            }

            consumerCredit.init = Init;
            consumerCredit.initEx = InitEx;
            consumerCredit.initOwner = InitOwner;
            consumerCredit.autoValidateId = AutoValidateId;
        }


        function LoadDetail() {

            let ServerResult = {
                Success: 0,
                Warning: 1,
                Fail: 2,
                Exception: 3
            };

            function DownloadCreditReport(cb) {

                function gotReport(status) {
                    KTApp.unblockPage();
                    if (status.result == true) {
                        let byteChars = atob(status.data.EncodedPDF);
                        smec.downloadBinary(byteChars, 'credit-report.pdf');
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
                        cb(status);
                    }
                }

                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: 'Retrieving credit score...'
                });

                abp.services.app.cCR.downloadReport().done(function (output) {
                    let status = {
                        result: false,
                        message: 'Unknown error'
                    };
                    if (output.result == ServerResult.Success) {
                        if (output.data.creditReport.creditReportJson != null) {
                            let obj = JSON.parse(output.data.creditReport.creditReportJson);
                            if (obj.hasOwnProperty('Error') == true) {
                                status.message = obj.Error;
                            } else {
                                status.result = true;
                                status.message = "Ok";
                                status.data = obj;
                            }
                        } else {
                            //status.message = output.message;
                        }
                    } else {
                        status.message = output.message;
                    }
                    gotReport(status);
                });
            }

            consumerCredit.downloadCreditReport = DownloadCreditReport;
        }

        consumerCredit.load = Load;

        consumerCredit.loadDetail = LoadDetail;

    })(app.consumerCredit);
});
