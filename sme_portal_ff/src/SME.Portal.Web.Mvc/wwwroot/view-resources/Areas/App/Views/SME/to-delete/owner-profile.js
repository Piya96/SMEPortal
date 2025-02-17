if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.owner = null;

(function (onboard) {
    let _dto = null;

    let helpers = app.onboard.helpers.get();

    let btnId = helpers.buttonState(
        'id-input-button-owner-profile-identity-verify',
        'id-input-button-span-owner-profile-identity-verify'
    );
    let btnMobile = helpers.buttonState(
        'id-input-button-owner-profile-mobile-verify',
        'id-input-button-span-owner-profile-mobile-verify'
    );

    function mobileControl(enableInput, enableButton, flashButton, textButton) {
        $('#id-input-owner-profile-mobile-verify').prop('disabled', enableInput ^ true);
        btnMobile(enableButton, flashButton, textButton);
    }

    let names = {
        nameInputProfileIdentityVerify: 'name-input-owner-profile-identity-verify',
        nameInputButtonProfileIdentityVerify: 'name-input-button-owner-profile-identity-verify',
        nameInputButtonSpanProfileIdentityVerify: 'name-input-button-span-owner-profile-identity-verify',

        nameSelectProfileMobileVerify: 'name-select-owner-profile-mobile-verify',
        nameInputProfileMobileVerify: 'name-input-owner-profile-mobile-verify',
        nameInputButtonProfileMobileVerify: 'name-input-button-owner-profile-mobile-verify',
        nameSelectButtonProfileMobileVerify: 'name-select-button-owner-profile-mobile-verify',
        nameInputButtonSpanProfileMobileVerify: 'name-input-button-span-owner-profile-mobile-verify',
        nameSelectButtonSpanProfileMobileVerify: 'name-select-button-span-owner-profile-mobile-verify',
        nameDivInputProfileMobileVerify: 'name-div-input-owner-profile-mobile-verify',
        nameDivSelectProfileMobileVerify: 'name-div-select-owner-profile-mobile-verify'
    };

    let ids = {
        idInputProfileIdentityVerify: 'id-input-owner-profile-identity-verify',
        idInputButtonProfileIdentityVerify: 'id-input-button-owner-profile-identity-verify',
        idInputButtonSpanProfileIdentityVerify: 'id-input-button-span-owner-profile-identity-verify',

        idSelectProfileMobileVerify: 'id-select-owner-profile-mobile-verify',
        idInputProfileMobileVerify: 'id-input-owner-profile-mobile-verify',
        idInputButtonProfileMobileVerify: 'id-input-button-owner-profile-mobile-verify',
        idSelectButtonProfileMobileVerify: 'id-select-button-owner-profile-mobile-verify',
        idInputButtonSpanProfileMobileVerify: 'id-input-button-span-owner-profile-mobile-verify',
        idSelectButtonSpanProfileMobileVerify: 'id-select-button-span-owner-profile-mobile-verify',
        idDivInputProfileMobileVerify: 'id-div-input-owner-profile-mobile-verify',
        idDivSelectProfileMobileVerify: 'id-div-select-owner-profile-mobile-verify'
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

    function dtoToForm(dto) {
        $('#id-owner-profile-fname').val(dto.owner.name);
        $('#id-owner-profile-lname').val(dto.owner.surname);
        $('#id-owner-profile-email').val(dto.owner.emailAddress);
        $('#id-input-owner-profile-mobile-verify').val(dto.owner.phoneNumber);
        $('#id-input-owner-profile-identity-verify').val(dto.owner.identityOrPassport);
        $('#id-owner-profile-race').val(dto.owner.race);

        if (dto.owner.verificationRecordJson != null) {
            let verRec = JSON.parse(dto.owner.verificationRecordJson);
            $('#id-owner-profile-age').val(verRec.Age);
            $('#id-owner-profile-gender').val(verRec.Gender);
            $('#id-owner-profile-marital-status').val(verRec.MaritalStatus);
        }
        app.onboard.owner.mobile.disable(dto.owner.isPhoneNumberConfirmed);
        app.onboard.owner.mobile.text(dto.owner.isPhoneNumberConfirmed);
    }

    function formToDto(dto) {
        dto.owner.name = $('#id-owner-profile-fname').val();
        dto.owner.surname = $('#id-owner-profile-lname').val();
        dto.owner.emailAddress = $('#id-owner-profile-email').val();
        dto.owner.phoneNumber = $('#id-input-owner-profile-mobile-verify').val();
        dto.owner.identityOrPassport = $('#id-input-owner-profile-identity-verify').val();
        dto.owner.race = $('#id-owner-profile-race').val();
    }

    function identityDetailsToForm(json) {
        let obj = json == null
            ? { Gender: '', MaritalStatus: '', Age: '' }
            : JSON.parse(json);

        $('#id-owner-profile-fname').val(obj.FirstName);
        $('#id-owner-profile-lname').val(obj.Surname);
        $('#id-owner-profile-gender').val(obj.Gender);
        $('#id-owner-profile-marital-status').val(obj.MaritalStatus);
        $('#id-owner-profile-age').val(obj.Age);
    }

    function ownerDetailsToForm(dto) {
        identityDetailsToForm(dto.owner.verificationRecordJson);
        $('#id-owner-profile-email').val(dto.owner.emailAddress);
        $('#id-input-owner-profile-identity-verify').val(dto.owner.identityOrPassport);
        //$('#id-input-owner-profile-mobile-verify').val(dto.owner.phoneNumber);

        controls.mobileInput.val(dto.owner.phoneNumber);
        controls.mobileDivInput.showEx(true);
        controls.mobileDivSelect.showEx(false);
        controls.mobileSelect.flush();
    }

    function defaultDto() {
        _dto = {
            owner: {
                id: null,
                name: '',
                surname: '',
                emailAddress: '',
                phoneNumber: '',
                isPhoneNumberConfirmed: false,
                identityOrPassport: '',
                isIdentityOrPassportConfirmed: false,
                race: '',
                verificationRecordJson: null,
                userId: -1
            }
        };
        onboard.owner.dto = _dto;
    }

    function readDtoToWriteDto() {
        return {
            id: _dto.owner.id,
            name: _dto.owner.name,
            surname: _dto.owner.surname,
            emailAddress: _dto.owner.emailAddress,
            phoneNumber: _dto.owner.phoneNumber,
            isPhoneNumberConfirmed: _dto.owner.isPhoneNumberConfirmed,
            identityOrPassport: _dto.owner.identityOrPassport,
            isIdentityOrPassportConfirmed: _dto.owner.isIdentityOrPassportConfirmed,
            race: _dto.owner.race,
            verificationRecordJson: _dto.owner.verificationRecordJson,
            userId: _dto.owner.userId,
            propertiesJson : ''
        };
    }

    let _isDirty = true;

    function makeDirty(isDirty) {
        _isDirty = isDirty;
    }

    function userIsOwnerUpdate(dto) {
        _dto.owner.isPhoneNumberConfirmed = true;
        _dto.owner.isIdentityOrPassportConfirmed = true;
        _dto.owner.verificationRecordJson = dto.owner.verificationRecordJson;
        ownerDetailsToForm(dto);
        KTWizard2.validateFields(
            KTWizard2.PAGE.OwnerProfile,
            [
                'fname',
                'lname',
                'email',
                'name-input-owner-profile-mobile-verify',
                'name-input-owner-profile-identity-verify',
                'validate-owner-profile-gender',
                'validate-owner-profile-marital-status',
                'validate-owner-profile-age'
            ],
            function (result) {
            }
        );
        enable(false, false, false, false, false, true);
        if (_isDirty == true) {
            $('#id-owner-profile-race').val('');
            KTWizard2.resetFields(
                KTWizard2.PAGE.OwnerProfile,
                ['race']
            );
            makeDirty(false);
        }
    }

    function userIsNotOwnerUpdate() {
        if (_isDirty == true) {
            _dto.owner.isPhoneNumberConfirmed = false;
            _dto.owner.isIdentityOrPassportConfirmed = false;
            _dto.owner.verificationRecordJson = null;
            reset();
            enable(false, false, true, true, true, true);
            makeDirty(false);
        }
    }

    function reset() {
        $('#id-owner-profile-fname').val('');
        $('#id-owner-profile-lname').val('');
        $('#id-owner-profile-email').val('');
        $('#id-input-owner-profile-mobile-verify').val('');

        $('#id-input-owner-profile-identity-verify').val('');
        $('#id-input-button-span-owner-profile-identity-verify').removeClass('pulse');
        $('#id-input-button-span-owner-profile-identity-verify').text(app.localize('OW_IdentityVerifyButton'));
        $('#id-input-button-owner-profile-identity-verify').prop('disabled', true);

        $('#id-owner-profile-race').val('');
        $('#id-owner-profile-gender').val('');
        $('#id-owner-profile-marital-status').val('');
        $('#id-owner-profile-age').val('');
        KTWizard2.resetFields(
            KTWizard2.PAGE.OwnerProfile,
            [
                'fname',
                'lname',
                'email',
                'name-input-owner-profile-mobile-verify',
                'name-input-owner-profile-identity-verify',
                'validate-owner-profile-gender',
                'validate-owner-profile-marital-status',
                'validate-owner-profile-age', 'race'
            ]
        );

        controls.mobileInput.reset();
    }

    function enable(name, surname, email, mobile, id, race) {
        $('#id-owner-profile-fname').prop('disabled', true);
        $('#id-owner-profile-lname').prop('disabled', true);
        $('#id-owner-profile-email').prop('disabled', email ^ true);
        //$('#id-input-owner-profile-mobile-verify').prop('disabled', mobile ^ true);
        $('#id-input-owner-profile-identity-verify').prop('disabled', id ^ true);
        $('#id-owner-profile-race').prop('disabled', race ^ true);
    }

    function loadDto(cb, dto) {
        // owner.name
        // owner.surname
        // owner.emailAddress
        // owner.phoneNumber
        // owner.isPhoneNumberConfirmed
        // owner.identityOrPassport
        // owner.isIdentityOrPassportConfirmed
        // owner.race
        // owner.verificationRecordJson
        // owner.userId
        // userName
        abp.services.app.ownersAppServiceExt.getOwnerForEditByUser().done(function (dto) {
            let status = AddStatus();
            if (dto != null && dto.owner != null) {
                status.result = Result.Pass;
                _dto = dto;
                onboard.owner.dto = dto;
                if (onboard.owner.dto['isIdentityOrPassportConfirmed'] == false) {
                    onboard.owner.dto['isPhoneNumberConfirmed'] = false;
                }
            } else {
                defaultDto();
                status.result = Result.Fail;
            }
            cb(status, _dto);
        });
    }

    function submitDto(cb) {
        if (app.onboard.wizard.mode == app.onboard.wizard.MODE.Normal) {
            formToDto(_dto);
            let writeDto = readDtoToWriteDto();
            abp.services.app.ownersAppServiceExt.createOrEdit(writeDto).done(function (result) {
                cb(status, result);
            });
        } else {
            cb(AddStatus(), _dto.owner.id);
        }
    }

    function activateMobileSelect(data) {
        app.onboard.common.activateMobileSelect(data, controls);
    }

    function activateMobileInput() {
        app.onboard.common.activateMobileInput(controls, function () {
            KTWizard2.validateFields(
                KTWizard2.PAGE.OwnerProfile,
                ['name-input-owner-profile-mobile-verify'],
                function (result) {
                    let valid = result[0] == 'Valid';
                    app.onboard.owner.mobile.pulse(valid & (_dto.owner.isPhoneNumberConfirmed == false) & (_dto.owner.isIdentityOrPassportConfirmed == true));
                    app.onboard.owner.mobile.disable((valid == false) | (_dto.owner.isPhoneNumberConfirmed == true) | (_dto.owner.isIdentityOrPassportConfirmed == false));
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
            app.onboard.owner.mobile,
            app.onboard.owner.identity,
            function (status) {
                switch (status.result) {
                    case Result.Pass:
                        _dto.owner.isPhoneNumberConfirmed = true;
                        controls.mobileInput.enable(false);
                        let id = $('#id-input-owner-profile-identity-verify').val();
                        let mobile = $('#id-input-owner-profile-mobile-verify').val();
                        app.onboard.service.verifyMobileAgainstId(id, mobile, (status) => {
                            if (status.result == Result.Fail) {
                                smec.mobileIdMismatch((status) => {
                                    $('#id-input-owner-profile-identity-verify').prop('disabled', false);
                                    btnId(true, true, app.localize('OW_IdentityVerifyButton'));
                                    btnMobile(false, false, app.localize('OW_IdentityVerifyButton'));
                                    _dto.owner.isIdentityOrPassportConfirmed = false;
                                    _dto.owner.isPhoneNumberConfirmed = false;
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
                _dto.owner.isPhoneNumberConfirmed = true;
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
            'ids': ids
        });
        if (_dto != null) {
            dtoToForm(_dto);
        }
        cb(AddStatus());
    }

    function validate(foreward, cb) {
        let status = AddStatus();
        let mobile = $('#id-input-owner-profile-mobile-verify').val();
        status.result = (
            _dto.owner.isIdentityOrPassportConfirmed == true &&
            _dto.owner.isPhoneNumberConfirmed == true)

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
            //app.onboard.owner.mobile.disable(_dto.owner.isPhoneNumberConfirmed);
            app.onboard.owner.mobile.text(_dto.owner.isPhoneNumberConfirmed);

            //app.onboard.owner.identity.disable(_dto.owner.isIdentityOrPassportConfirmed);
            app.onboard.owner.identity.text(_dto.owner.isIdentityOrPassportConfirmed);
        }

        cb(AddStatus());
    }

    function neglect(from, to, foreward, cb) {
        formToDto(_dto);
        cb(AddStatus());
    }

    function notify(message, data) {
        if (message == 'field-valid') {
            switch (data.field) {
                case 'name-input-owner-profile-mobile-verify': {
                    app.onboard.owner.mobile.pulse(data.valid & (_dto.owner.isPhoneNumberConfirmed == false) & (_dto.owner.isIdentityOrPassportConfirmed == true));
                    app.onboard.owner.mobile.disable((data.valid == false) | (_dto.owner.isPhoneNumberConfirmed == true) | (_dto.owner.isIdentityOrPassportConfirmed == false));
                    break;
                }

                case 'identity': {
                    app.onboard.owner.identity.pulse(data.valid & (_dto.owner.isIdentityOrPassportConfirmed == false));
                    app.onboard.owner.identity.disable((data.valid == false) | (_dto.owner.isIdentityOrPassportConfirmed == true));
                    break;
                }
            }
        }
    }

    let _clickId = 'id-input-button-owner-profile-mobile-verify';
    let _textId = 'id-input-button-span-owner-profile-mobile-verify';
    onboard.owner = {
        dtoToForm: dtoToForm,
        formToDto: formToDto,
        reset: reset,
        enable: enable,
        loadDto: loadDto,
        submitDto: submitDto,
        init: init,
        attention: attention,
        neglect: neglect,
        validate: validate,
        notify: notify,
        makeDirty: makeDirty,
        userIsOwnerUpdate: userIsOwnerUpdate,
        userIsNotOwnerUpdate: userIsNotOwnerUpdate,
        mobile: app.onboard.common.button.pulse(_clickId, _textId, 'OW_MobileVerifyButton', 'OW_MobileVerifiedButton'),
        identity: app.onboard.common.button.pulse(
            'id-input-button-owner-profile-identity-verify',
            'id-input-button-span-owner-profile-identity-verify',
            'OW_IdentityVerifyButton',
            'OW_IdentityVerifiedButton'),
        dto: _dto,
        ownerDetailsToForm: ownerDetailsToForm
    };

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
    //        $('#id-input-owner-profile-identity-verify').prop('disabled', true);
    //    });
    //}

    $('#id-input-button-owner-profile-identity-verify').click(function () {

        let id = $('#id-input-owner-profile-identity-verify').val();
        if (app.onboard.company.validateId(id) == false) {
            _dto.owner.isIdentityOrPassportConfirmed = false;
        }
        if (_dto.owner.isIdentityOrPassportConfirmed == true ||
            app.onboard.wizard.mode == app.onboard.wizard.MODE.Add ||
            app.onboard.wizard.mode == app.onboard.wizard.MODE.Edit) {
            //cb(AddStatus(), _dto.owner.verificationRecordJson);
        } else {
            app.onboard.common.verify.identity(
                $('#id-input-owner-profile-identity-verify').val(),
                '#id-owner-profile-fname',
                '#id-owner-profile-lname',
                app.onboard.owner.mobile,
                app.onboard.owner.identity,
                function (status, jsonBlob) {

                    function resultPass() {
                        //$('#id-input-owner-profile-identity-verify').prop('disabled', true);
                        _dto.owner.isIdentityOrPassportConfirmed = true;
                        _dto.owner.verificationRecordJson = jsonBlob;
                        identityDetailsToForm(jsonBlob);
                        formToDto(_dto);
                        KTWizard2.validateFields(
                            KTWizard2.PAGE.OwnerProfile,
                            ['fname', 'lname', 'validate-owner-profile-gender', 'validate-owner-profile-marital-status', 'validate-owner-profile-age'],
                            function (result) {
                            }
                        );
                        //getMobileNumbers($('#id-input-owner-profile-identity-verify').val(), function (output) {
                        //
                        //});
                        $('#id-input-owner-profile-identity-verify').prop('disabled', true);
                        activateMobileInput();
                    }

                    switch (status.result) {
                        case Result.Pass:
                            resultPass();
                            break;

                        default:
                            break;
                    }
                }
            );
        }
    });

    app.common.input.numeric('id-input-owner-profile-mobile-verify', 10);
    app.common.input.numeric('id-input-owner-profile-identity-verify', 13);

})(app.onboard);
