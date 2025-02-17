let userProfile = {
};

if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.user = null;

(function (onboard) {

    let helpers = app.onboard.helpers.get();

    let btnId = helpers.buttonState(
        'id-input-button-user-profile-identity-verify',
        'id-input-button-span-user-profile-identity-verify'
    );
    let btnMobile = helpers.buttonState(
        'id-input-button-user-profile-mobile-verify',
        'id-input-button-span-user-profile-mobile-verify'
    );

    function mobileControl(enableInput, enableButton, flashButton, textButton) {
        $('#id-input-user-profile-mobile-verify').prop('disabled', enableInput ^ true);
        btnMobile(enableButton, flashButton, textButton);
    }

    let names = {
        nameInputProfileIdentityVerify: 'name-input-user-profile-identity-verify',
        nameInputButtonProfileIdentityVerify: 'name-input-button-user-profile-identity-verify',
        nameInputButtonSpanProfileIdentityVerify: 'name-input-button-span-user-profile-identity-verify',

        nameSelectProfileMobileVerify : 'name-select-user-profile-mobile-verify',
        nameInputProfileMobileVerify : 'name-input-user-profile-mobile-verify',
        nameInputButtonProfileMobileVerify : 'name-input-button-user-profile-mobile-verify',
        nameSelectButtonProfileMobileVerify : 'name-select-button-user-profile-mobile-verify',
        nameInputButtonSpanProfileMobileVerify : 'name-input-button-span-user-profile-mobile-verify',
        nameSelectButtonSpanProfileMobileVerify : 'name-select-button-span-user-profile-mobile-verify',
        nameDivInputProfileMobileVerify : 'name-div-input-user-profile-mobile-verify',
        nameDivSelectProfileMobileVerify : 'name-div-select-user-profile-mobile-verify'
    };

    let ids = {
        idInputProfileIdentityVerify: 'id-input-user-profile-identity-verify',
        idInputButtonProfileIdentityVerify: 'id-input-button-user-profile-identity-verify',
        idInputButtonSpanProfileIdentityVerify: 'id-input-button-span-user-profile-identity-verify',

        idSelectProfileMobileVerify: 'id-select-user-profile-mobile-verify',
        idInputProfileMobileVerify: 'id-input-user-profile-mobile-verify',
        idInputButtonProfileMobileVerify: 'id-input-button-user-profile-mobile-verify',
        idSelectButtonProfileMobileVerify: 'id-select-button-user-profile-mobile-verify',
        idInputButtonSpanProfileMobileVerify: 'id-input-button-span-user-profile-mobile-verify',
        idSelectButtonSpanProfileMobileVerify: 'id-select-button-span-user-profile-mobile-verify',
        idDivInputProfileMobileVerify: 'id-div-input-user-profile-mobile-verify',
        idDivSelectProfileMobileVerify: 'id-div-select-user-profile-mobile-verify'
    };

    let controls = {
        identityInput: null,
        identityButton: null,
        identityButtonSpan: null,

        mobileDivSelect: null,
        mobileDivInput: null,
        mobileSelect: null,
        mobileInput: null,
        mobileInputButton: null,
        mobileSelectButton: null,
        mobileInputButtonSpan: null,
        mobileSelectButtonSpan: null,
    };

    let _dto = null;

    function dtoToForm(dto) {
        $('#id-user-profile-fname').val(dto.name);
        $('#id-user-profile-lname').val(dto.surname);
        $('#id-user-profile-email').val(dto.emailAddress);

        controls.mobileInput.val(dto.phoneNumber);
        //$('#id-input-user-profile-mobile-verify').val(dto.phoneNumber);

        $('#id-input-user-profile-identity-verify').val(dto.identityOrPassport);
        $('#id-user-profile-owner').prop('checked', dto.isOwner);
        if (dto.isOwner == false && dto.representativeCapacity != null) {
            let arr = dto.representativeCapacity.split(',');
            $('#id-user-profile-capacity-select').val(arr[0]);
            if (arr[0] == 'Other') {
                $('#id-user-profile-capacity-input').val(arr.length > 1 ? arr[1] : '');
            }
        }
    }

    function formToDto(dto) {

        function ownerCapacity(isOwner) {
            if (isOwner == true) {
                return null;
            } else {
                function selectCapacity(select) {
                    return select == 'Other'
                        ? select + ',' + ($('#id-user-profile-capacity-input').val())
                        : select;
                }
                return selectCapacity($('#id-user-profile-capacity-select').val());
            }
        }

        dto.name = $('#id-user-profile-fname').val();
        dto.surname = $('#id-user-profile-lname').val();
        dto.emailAddress = $('#id-user-profile-email').val();

        dto.phoneNumber = controls.mobileInput.val();
        //dto.phoneNumber = $('#id-input-user-profile-mobile-verify').val();

        dto.identityOrPassport = $('#id-input-user-profile-identity-verify').val();
        dto.isOwner = $('#id-user-profile-owner').prop('checked');
        dto.representativeCapacity = ownerCapacity(_dto.isOwner);
    }

    function loadDto(cb) {
        // name
        // surname
        // userName
        // emailAddress
        // phoneNumber
        // isPhoneNumberConfirmed
        // timezone
        // qrCodeSetupImageUrl
        // isGoogleAuthenticatorEnabled
        // identityOrPassport
        // isIdentityOrPassportConfirmed
        // verificationRecordJson
        // race
        // isOwner
        // representativeCapacity
        // isOnboarded
        // subscriptionStartDate
        // subscriptionEndDate
        // subscriptionPaymentType
        abp.services.app.profile.getCurrentUserProfileForEdit().done(function (dto) {
            let status = AddStatus();
            if (dto != null) {
                status.result = Result.Pass;
                _dto = dto;
                onboard.user.dto = dto;
                if (onboard.user.dto['isIdentityOrPassportConfirmed'] == false) {
                    onboard.user.dto['isPhoneNumberConfirmed'] = false;
                }
            } else {
                status.result = Result.Fail;
            }
            cb(status, dto);
        });
    }

    function submitDto(cb, partial = false) {
        if (app.onboard.wizard.mode == app.onboard.wizard.MODE.Normal) {
            formToDto(_dto);
            _dto.isOnboarded = partial == false;//true;
            _dto.propertiesJson = '';
            abp.services.app.profile.updateCurrentUserProfile(_dto).done(function (result) {
                cb(status);
            });
        } else {
            cb(AddStatus());
        }
    }

    function activateMobileSelect(data) {
        app.onboard.common.activateMobileSelect(data, controls);
    }

    function activateMobileInput() {
        app.onboard.common.activateMobileInput(controls, function () {
            KTWizard2.validateFields(
                KTWizard2.PAGE.UserProfile,
                [names.nameInputProfileMobileVerify],
                function (result) {
                    let valid = result[0] == 'Valid';
                    app.onboard.user.mobile.pulse(valid & (_dto.isPhoneNumberConfirmed == false) & (_dto.isIdentityOrPassportConfirmed == true));
                    app.onboard.user.mobile.disable((valid == false) | (_dto.isPhoneNumberConfirmed == true) | (_dto.isIdentityOrPassportConfirmed == false));
                }
            );
        });
    }

    function mobileSelectChange(key, value, data, arg) {
        if (key == 'input') {
            activateMobileInput();
        } else {
            controls.mobileSelectButton.enable(true);
            controls.mobileSelectButton.addClass('pulse');
            controls.mobileSelectButtonSpan.text(app.localize('OW_IdentityVerifyButton'));
        }
    }

    function mobileInputButtonClick(e, arg) {
        app.onboard.common.verify.mobile(
            ids.idInputProfileMobileVerify,
            app.onboard.user.mobile,
            app.onboard.user.identity,
            function (status) {
                switch (status.result) {
                    case Result.Pass:
                        _dto.isPhoneNumberConfirmed = true;
                        controls.mobileInput.enable(false);
                        let id = $('#id-input-user-profile-identity-verify').val();
                        let mobile = $('#id-input-user-profile-mobile-verify').val();
                        app.onboard.service.verifyMobileAgainstId(id, mobile, (status) => {
                            if (status.result == Result.Fail) {
                                smec.mobileIdMismatch((status) => {
                                    $('#id-input-user-profile-identity-verify').prop('disabled', false);
                                    btnId(true, true, app.localize('OW_IdentityVerifyButton'));
                                    btnMobile(false, false, app.localize('OW_IdentityVerifyButton'));
                                    _dto.isIdentityOrPassportConfirmed = false;
                                    _dto.isPhoneNumberConfirmed = false;
                                });
                            }
                        });

                        break;

                    case Result.Cancel: case Result.Fail:
                        //controls.mobileInput.val('');
                        mobileControl(true, true, true, app.localize('OW_IdentityVerifyButton'));
                        break;
                }
            }
        );
    }

    function mobileSelectButtonClick(e, arg) {
        app.onboard.common.mobileSelectButtonClick(controls, function (status) {
            if (status.result == Result.Pass) {
                _dto.isPhoneNumberConfirmed = true;
            }
        });
    }

    function initMobileControls(arg) {
        app.onboard.common.initMobileControls(arg);

        arg.controls.mobileSelect.change(mobileSelectChange, arg);

        arg.controls.mobileInputButton.click(mobileInputButtonClick, arg);

        arg.controls.mobileSelectButton.click(mobileSelectButtonClick, arg);
    }

    function init(cb) {
        initMobileControls({
            'controls': controls,
            'names': names,
            'ids' : ids
        });

        toggleCapacitySelect(_dto.isOwner == false);

        let arr = _dto.representativeCapacity == null
            ? ''
            : _dto.representativeCapacity.split(',');

        toggleCapacityInput(arr[0] == 'Other');

        $('#id-user-profile-fname').prop('disabled', true);
        $('#id-user-profile-lname').prop('disabled', true);
        $('#id-user-profile-email').prop('disabled', true);

        //app.onboard.user.mobile.disable(_dto.isPhoneNumberConfirmed);
        app.onboard.user.mobile.text(_dto.isPhoneNumberConfirmed);

        app.onboard.user.identity.disable(_dto.isIdentityOrPassportConfirmed);
        app.onboard.user.identity.text(_dto.isIdentityOrPassportConfirmed);

        KTWizard2.validateFields(
            KTWizard2.PAGE.UserProfile,
            [
                'name-input-user-profile-identity-verify',
                names.nameInputProfileMobileVerify
            ],
            function (result) {
                if (result[0] != 'Valid') {
                    KTWizard2.resetField(KTWizard2.PAGE.UserProfile, 'name-input-user-profile-identity-verify');
                }
                if (result[1] != 'Valid') {
                    KTWizard2.resetField(KTWizard2.PAGE.UserProfile, names.nameInputProfileMobileVerify);
                }
            }
        );


        dtoToForm(_dto);

        cb(AddStatus());
    }

    function validate(foreward, cb) { 
        let status = AddStatus();
        let mobile = controls.mobileInput.val();
        //let mobile = $('#id-select-user-profile-mobile-verify').val();
        status.result = (
            _dto.isIdentityOrPassportConfirmed == true &&
            _dto.isPhoneNumberConfirmed == true &&
            mobile != null &&
            mobile != '')
            ? Result.Pass
            : Result.Fail;

        if (status.result == Result.Fail) {
            sme.swal.error(app.localize('OW_MobileNumberAndOrIdentityNumberNotYetVerified'), null, true, function () {
                cb(status);
            });
        } else {
            cb(status);
        }
    }

    function attention(from, to, foreward, cb) {

        if (foreward == true) {

        }

        KTWizard2.validateFields(
            KTWizard2.PAGE.UserProfile,
            [
                'fname1',
                'lname1',
                'email1'
            ],
            function (result) {
        });
        cb(AddStatus());
    }

    function neglect(from, to, foreward, cb) {
        formToDto(_dto);
        cb(AddStatus());
    }

    function notify(message, data) {
        if (message == 'field-valid') {
            switch (data.field) {
                case names.nameInputProfileMobileVerify : {
                    app.onboard.user.mobile.pulse(data.valid & (_dto.isPhoneNumberConfirmed == false) & (_dto.isIdentityOrPassportConfirmed == true));
                    app.onboard.user.mobile.disable((data.valid == false) | (_dto.isPhoneNumberConfirmed == true) | (_dto.isIdentityOrPassportConfirmed == false));
                    break;
                }

                case 'identity': {
                    app.onboard.user.identity.pulse(data.valid & (_dto.isIdentityOrPassportConfirmed == false));
                    app.onboard.user.identity.disable((data.valid == false) | (_dto.isIdentityOrPassportConfirmed == true));
                    break;
                }
            }
        }
    }

    let _clickId = ids.idInputButtonProfileMobileVerify;
    let _textId = ids.idInputButtonSpanProfileMobileVerify;
    onboard.user = {
        dtoToForm: dtoToForm,
        formToDto: formToDto,
        loadDto: loadDto,
        submitDto: submitDto,
        init: init,
        attention: attention,
        neglect: neglect,
        validate: validate,
        notify: notify,
        toggleCapacitySelect: toggleCapacitySelect,
        mobile: app.onboard.common.button.pulse(_clickId, _textId, 'OW_MobileVerifyButton', 'OW_MobileVerifiedButton'),
        identity: app.onboard.common.button.pulse(
            'id-input-button-user-profile-identity-verify',
            'id-input-button-span-user-profile-identity-verify',
            'OW_IdentityVerifyButton',
            'OW_IdentityVerifiedButton'),
        dto: _dto
    };

    function toggleCapacitySelect(show) {
        show == true
            ? $('#id-user-profile-capacity-div').show()
            : $('#id-user-profile-capacity-div').hide();
    }

    function toggleCapacityInput(show) {
        show == true
            ? $('#id-user-profile-capacity-other-div').show()
            : $('#id-user-profile-capacity-other-div').hide();
    }

    $('#id-user-profile-capacity-select').change(function (e) {
        let capacity = $('#id-user-profile-capacity-select').val();
        toggleCapacityInput(capacity == 'Other');
    });

    $('#id-user-profile-owner').click(function () {
        let elem = document.getElementById('id-user-profile-owner');
        toggleCapacitySelect(elem.checked == false);
        _dto.isOwner = elem.checked;

        if (elem.checked == false) {
            app.onboard.owner.makeDirty(true);
        } else {
            app.onboard.owner.makeDirty(true);
        }
    });

    //function getMobileNumbers(identityNumber, cb) {
    //    KTApp.blockPage({
    //        overlayColor: 'blue',
    //        opacity: 0.1,
    //        state: 'primary',
    //        message: 'Retrieving mobile numbers...'
    //    });
    //    app.onboard.service.getMobileNumbersById(identityNumber, function (output) {
    //        KTApp.unblockPage();
    //        if (output.data == null) {
    //            output.data = [];
    //            activateMobileInput();
    //        } else {
    //            activateMobileSelect(output.data);
    //        }
    //        $('#id-input-user-profile-identity-verify').prop('disabled', true);
    //    });
    //}

    $('#id-input-button-user-profile-identity-verify').click(function () {
        if (_dto.isIdentityOrPassportConfirmed == true) {
            //cb(AddStatus(), _dto.verificationRecordJson);
        } else {
            app.onboard.common.verify.identity(
                $('#id-input-user-profile-identity-verify').val(),
                '#id-user-profile-fname',
                '#id-user-profile-lname',
                app.onboard.user.mobile,
                app.onboard.user.identity,
                function (status, jsonBlob) {

                    function resultPass() {
                        _dto.isIdentityOrPassportConfirmed = true;
                        _dto.verificationRecordJson = jsonBlob;
                        if (_dto.isOwner == true) {
                            app.onboard.owner.dto.owner.isIdentityOrPassportConfirmed = true;
                            app.onboard.owner.dto.owner.verificationRecordJson = _dto.verificationRecordJson;
                        } else {
                            //app.onboard.owner.dto.owner.isIdentityOrPassportConfirmed = false;
                        }
                        //$('#id-input-user-profile-identity-verify').prop('disabled', true);
                        //getMobileNumbers($('#id-input-user-profile-identity-verify').val(), function (output) {
                        //
                        //});
                        $('#id-input-user-profile-identity-verify').prop('disabled', true);
                        activateMobileInput();
                    }

                    switch (status.result) {
                        case Result.Pass:
                            resultPass();
                            break;

                        default:
                            app.onboard.user.identity.freeze(false);
                            break;
                    }
                }
            );
        }
    });

    app.common.input.numeric(ids.idInputProfileMobileVerify, 10);
    app.common.input.numeric('id-input-user-profile-identity-verify', 13);

})(app.onboard);
