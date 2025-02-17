if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.user = null;

(function (onboard) {

    let guids = {
        SegaOriginOther: '6321dbc1eb41fff5d2cf4114',
        SegaOriginStrategicPartner: '6321db9f186caf8814235ebd'
    };

    let helpers = app.onboard.helpers.get();

    let sefaOriginOtherSelect = app.control.select('how-did-you-hear-about-sefa', 'id-select-how-did-you-hear-about-sefa');

    let sefaOriginOtherInput = app.control.input('input-user-profile-sefa-origin-other', 'input-user-profile-sefa-origin-other');

    let isBusinessOwner = app.control.radio('input-is-business-owner', 'input-is-business-owner');

    let sefaOriginStrategicPartnerSelect = app.control.select('select-user-profile-sefa-origin-strategic-partner', 'select-user-profile-sefa-origin-strategic-partner');
    let _strategicPartner = app.listItems.obj.getSefaOriginStrategicPartner();
    sefaOriginStrategicPartnerSelect.fill(_strategicPartner);

    let btnId = helpers.buttonState('id-user-verify-identity-button', 'id-user-verify-identity-span');
    let btnMobile = helpers.buttonState('id-user-mobile-verify-input-button', 'id-user-profile-span');

    function mobileControl(enableInput, enableButton, flashButton, textButton) {
        $('#id-user-profile-mobile').prop('disabled', enableInput ^ true);
        btnMobile(enableButton, flashButton, textButton);
    }

    class DtoToPage {
        constructor() {
            this.dto = null;
            this.verificationJson = null;
        }

        setDto(dto) {
            this.dto = dto;
            if (dto.verificationRecordJson != null && dto.verificationRecordJson != '') {
                this.verificationJson = JSON.parse(dto.verificationRecordJson);
            } else {
                this.verificationJson = {
                };
            }
        }

        reset() {
            this.dto.identityOrPassport = '';
            this.dto.phoneNumber = '';
            this.dto.name = '';
            this.dto.surname = '';
            this.dto.emailAddress = '';
            this.dto.verificationRecordJson = '';
            this.dto.isIdentityOrPassportConfirmed = false;
            this.dto.isPhoneNumberConfirmed = false;

            function state(id, enable) {
                //$('#' + id).val('');
                $('#' + id).prop('disabled', enable ^ true);
            }

            state('id-user-profile-id', true);
            state('id-user-profile-mobile', true);
            state('id-select-user-profile-title', true);
            state('id-user-profile-fname', false);
            state('id-user-profile-lname', false);
            state('id-user-profile-email', true);

            $('#id-user-basic-screening-fail-alert').hide('fast');
            //$('#id-user-mobile-verify-input-div').hide();
            $('#id-user-mobile-verify-select-div').hide();

            KTWizard2.resetFields(
                KTWizard2.PAGE.OwnerProfile, [
                    'idno1',
                    'fname1',
                    'lname1',
                    'email1',
                    'phone1',
                    'name-select-user-profile-title',
                    'how-did-you-hear-about-sefa',
                    'capacity1'
                ]
            );
        }

        identityNumber() {
            $('#id-user-profile-id').val(this.dto.identityOrPassport);
            if (this.dto.isIdentityOrPassportConfirmed == true) {
                $('#id-user-profile-id').prop('disabled', true);
                btnId(false, false, 'OW_IdentityVerifiedButton');
            } else {
                $('#id-user-profile-id').prop('disabled', false);
                btnId(true, true, 'OW_IdentityVerifyButton');
            }
        }

        mobileNumber(cb) {
            $('#id-user-profile-mobile').val(this.dto.phoneNumber);
            if (this.dto.isPhoneNumberConfirmed == true) {
                $('#id-user-profile-mobile').prop('disabled', true);
                $('#id-user-mobile-verify-input-div').show();
                $('#id-user-mobile-verify-select-div').hide();
                btnMobile(false, false, 'OW_MobileVerifiedButton');
            } else {
                $('#id-user-profile-mobile').prop('disabled', true);
                $('#id-user-mobile-verify-select-div').hide();
                //$('#id-user-mobile-verify-input-div').hide();
                btnMobile(false, false, 'OW_MobileVerifyButton');
            }
        }

        firstName() {
            $('#id-user-profile-fname').val(this.dto.name);
            $('#id-user-profile-fname').prop('disabled', true);
        }

        lastName() {
            $('#id-user-profile-lname').val(this.dto.surname);
            $('#id-user-profile-lname').prop('disabled', true);
        }

        emailAddress() {
            $('#id-user-profile-email').val(this.dto.emailAddress);
            $('#id-user-profile-email').prop('disabled', true);
        }

        title() {
            $('#id-select-user-profile-title').prop('disabled', false);
            let guid = helpers.getProp(this.dto.propertiesJson, 'user-title', '');
            $('#id-select-user-profile-title').val(guid);
        }

        isOwner() {
            let value = helpers.getPropEx(this.dto.propertiesJson, 'is-business-owner', '');
            isBusinessOwner.val(value);
        }

        sefaOrigin() {
            // Set to default.
            if (this.dto.isIdentityOrPassportConfirmed == false) {
                helpers.setProp(this.dto.propertiesJson, 'how-did-you-hear-about-sefa', '');
            }
            let guid = helpers.getPropEx(this.dto.propertiesJson, 'how-did-you-hear-about-sefa', '');
            $('#id-select-how-did-you-hear-about-sefa').val(guid);

            this.sefaOriginOther(guid == guids.SegaOriginOther);
            this.sefaOriginStrategicPartner(guid == guids.SegaOriginStrategicPartner);
        }

        sefaOriginOther(enable) {
            helpers.show('div-user-profile-sefa-origin-other', enable);
            KTWizard2.enable(KTWizard2.PAGE.UserProfile, 'input-user-profile-sefa-origin-other', enable);
            if (enable == true) {
                let value = helpers.getProp(this.dto.propertiesJson, 'how-did-you-hear-about-sefa-other', '');
                sefaOriginOtherInput.val(value);
            } else {
                sefaOriginOtherInput.val('');
            }
        }

        sefaOriginStrategicPartner(enable) {
            helpers.show('div-user-profile-sefa-origin-strategic-partner', enable);
            KTWizard2.enable(KTWizard2.PAGE.UserProfile, 'select-user-profile-sefa-origin-strategic-partner', enable);
            if (enable == true) {
                let value = helpers.getProp(this.dto.propertiesJson, 'how-did-you-hear-about-sefa-strategic-partner', '');
                sefaOriginStrategicPartnerSelect.val(value);
            } else {
                sefaOriginStrategicPartnerSelect.val('');
            }
        }

        address() {
            let guid = $('#id-user-profile-capacity-select').val();
            let toggle = this.dto.isOwner == false && guid == '6226122fc3ac73094c399c4a';
            KTWizard2.enable(KTWizard2.PAGE.UserProfile, 'name-input-user-profile-registered-address', toggle);
            if (toggle == true) {
                $('#id-div-user-profile-registered-address').show('fast');
                let address = helpers.getProp(this.dto.propertiesJson, 'user-profile-registered-address', '');
                $('#id-input-user-profile-registered-address').val(address);
            } else {
                $('#id-div-user-profile-registered-address').hide('fast');
                helpers.setProp(this.dto.propertiesJson, 'user-profile-registered-address', '');
                $('#id-input-user-profile-registered-address').val('');
            }
        }

        capacity() {
            if (this.dto.isOwner == false) {
                let guid = this.dto.representativeCapacity;
                $('#id-user-profile-capacity-select').val(guid);
                $('#id-user-profile-capacity-div').show()
            } else {
                $('#id-user-profile-capacity-div').hide();
            }
        }

        capacityOther() {
            let guid = $('#id-user-profile-capacity-select').val();
            if (guid == '6226122fc3ac73094c399c4d') {
                let other = helpers.getProp(this.dto.propertiesJson, 'user-profile-capacity-other', '');
                $('#id-input-user-profile-capacity-other').val(other)
                $('#id-div-user-profile-capacity-other').show('fast');
                KTWizard2.enable(KTWizard2.PAGE.UserProfile, 'name-input-user-profile-capacity-other', true);
            } else {
                helpers.setProp(this.dto.propertiesJson, 'user-profile-capacity-other', '');
                $('#id-input-user-profile-capacity-other').val('')
                $('#id-div-user-profile-capacity-other').hide('fast');
                KTWizard2.enable(KTWizard2.PAGE.UserProfile, 'name-input-user-profile-capacity-other', false);
            }
        }

        apply() {
            this.identityNumber();
            this.mobileNumber();
            this.firstName();
            this.lastName();
            this.emailAddress();
            this.title();
            this.isOwner();
            this.sefaOrigin();
            this.capacity();
            this.capacityOther();
            this.address();
        }
    }

    class PageToDto {
        constructor() {
            this.dto = null;
        }

        setDto(dto) {
            this.dto = dto;
            this.propertiesJson = {};
        }

        identityNumber() {
            this.dto.identityOrPassport = $('#id-user-profile-id').val();
        }

        mobileNumber() {
            this.dto.phoneNumber = $('#id-user-profile-mobile').val();
        }

        firstName() {
            this.dto.name = $('#id-user-profile-fname').val();
        }

        lastName() {
            this.dto.surname = $('#id-user-profile-lname').val();
        }

        emailAddress() {
            this.dto.emailAddress = $('#id-user-profile-email').val();
        }

        title() {
            let guid = $('#id-select-user-profile-title').val();
            helpers.setProp(this.dto.propertiesJson, 'user-title', guid);
        }

        isOwner() {
            let value = isBusinessOwner.val();
            helpers.setPropEx(this.dto.propertiesJson, 'is-business-owner', value);
            this.dto.isOwner = value == 'Yes' ? true : false;
        }

        sefaOrigin() {
            let guid = $('#id-select-how-did-you-hear-about-sefa').val();
            helpers.setProp(this.dto.propertiesJson, 'how-did-you-hear-about-sefa', guid);
            this.sefaOriginOther(guid == guids.SegaOriginOther);
            this.sefaOriginStrategicPartner(guid == guids.SegaOriginStrategicPartner);
        }

        sefaOriginOther(enable) {
            helpers.setProp(this.dto.propertiesJson, 'how-did-you-hear-about-sefa-other', enable == true ? sefaOriginOtherInput.val() : '');
        }

        sefaOriginStrategicPartner(enable) {
            helpers.setProp(this.dto.propertiesJson, 'how-did-you-hear-about-sefa-strategic-partner', enable == true ? sefaOriginStrategicPartnerSelect.val() : '');
        }

        address() {
            let address = $('#id-input-user-profile-registered-address').val();
            helpers.setProp(this.dto.propertiesJson, 'user-profile-registered-address', address);
        }

        capacityOther() {
            let guid = $('#id-user-profile-capacity-select').val();
            if (guid == '6226122fc3ac73094c399c4d') {
                let other = $('#id-input-user-profile-capacity-other').val();
                helpers.setProp(this.dto.propertiesJson, 'user-profile-capacity-other', other);
            } else {
                helpers.setProp(this.dto.propertiesJson, 'user-profile-capacity-other', '');
            }
        }

        capacity() {
            if (this.dto.isOwner == false) {
                this.dto.representativeCapacity = $('#id-user-profile-capacity-select').val();
            } else {
                this.dto.representativeCapacity = '';
            }
        }

        apply() {
            this.identityNumber();
            this.mobileNumber();
            this.firstName();
            this.lastName();
            this.emailAddress();
            this.title();
            this.isOwner();
            this.sefaOrigin();
            this.capacity();
            this.capacityOther();
            this.address();
        }
    }

    let dtoToPage = new DtoToPage();
    let pageToDto = new PageToDto();

    let _dto = null;

    //let _sefaSource = app.control.select('how-did-you-hear-about-sefa', 'id-select-how-did-you-hear-about-sefa');
    let _roleControl = app.control.select('capacity1', 'id-user-profile-capacity-select');
    let _roles = app.listItems.obj.getRoles();
    _roleControl.fill(_roles)

    let _titleControl = app.control.select('name-select-user-profile-title', 'id-select-user-profile-title');
    let _titles = app.listItems.obj.getTitles();
    _titleControl.fill(_titles);

    let _sefaOriginControl = app.control.select('how-did-you-hear-about-sefa', 'id-select-how-did-you-hear-about-sefa');
    let _sefaOrigin = app.listItems.obj.getSefaOrigin();
    _sefaOriginControl.fill(_sefaOrigin);

    function dtoToForm(dto) {

        dtoToPage.setDto(dto);
        dtoToPage.apply();
    }

    function formToDto(dto) {
        pageToDto.setDto(dto);
        pageToDto.apply();
    }

    function init(cb) {
        if (_dto['propertiesJson'] != null && _dto['propertiesJson'] != '') {
            _dto['propertiesJson'] = JSON.parse(_dto['propertiesJson']);
        } else {
            _dto['propertiesJson'] = {};
        }
        KTWizard2.validateFields(
            KTWizard2.PAGE.UserProfile,
            ['idno1', 'phone1'],
            function (result) {
                if (result[0] != 'Valid') {
                    KTWizard2.resetField(KTWizard2.PAGE.UserProfile, 'idno1');
                }
                if (result[1] != 'Valid') {
                    KTWizard2.resetField(KTWizard2.PAGE.UserProfile, 'phone1');
                }
            }
        );
        dtoToForm(_dto);
        cb(AddStatus());
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
            init(function (status) {
                cb(status, dto);
            });
        });
    }

    function submitDto(cb, partial = true) {
        formToDto(_dto);
        _dto.isOnboarded = partial == true ? 0 : 1;
        _dto['propertiesJson'] = JSON.stringify(_dto['propertiesJson']);
        abp.services.app.profile.updateCurrentUserProfile(_dto).done(function (result) {
            _dto['propertiesJson'] = JSON.parse(_dto['propertiesJson']);
            cb(AddStatus());
        });
    }

    function validate(foreward, cb) {
        let status = AddStatus();
        //let mobile = $('#id-user-mobile-verify-select').val();
        let mobile = $('#id-user-profile-mobile').val();
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

        initAutocomplete_user();

        if (foreward == false) {
            cb(AddStatus());
        }

        KTWizard2.validateFields(
            KTWizard2.PAGE.UserProfile,
            ['fname1', 'lname1', 'email1'],
            function (result) {
        });
        cb(AddStatus());
    }

    function neglect(from, to, foreward, cb) {
        formToDto(_dto);

        if (foreward == true) {
            submitDto(function (status) {
                cb(status);
            });
        } else {
            cb(AddStatus());
        }
    }

    function notify(message, data) {
        if (message == 'field-valid') {
            switch (data.field) {
                case 'mobile': {
                    app.onboard.user.mobile.pulse(
                        data.valid & (_dto.isPhoneNumberConfirmed == false) & (_dto.isIdentityOrPassportConfirmed == true)
                    );
                    app.onboard.user.mobile.disable(
                        ((data.valid == false) | (_dto.isPhoneNumberConfirmed == true)) | (_dto.isIdentityOrPassportConfirmed == false)
                    );
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

    let _clickId = 'id-user-mobile-verify-input-button';
    let _textId = 'id-user-profile-span';
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
            'id-user-verify-identity-button',
            'id-user-verify-identity-span',
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
        let guid = $('#id-user-profile-capacity-select').val();
        // Authorized representative.
        dtoToPage.address();
        dtoToPage.capacityOther();
    });

    let self = this;

    isBusinessOwner.click((arg, name, value, checked) => {
        toggleCapacitySelect(checked == 'No');
        _dto.isOwner = checked == 'Yes';
        helpers.setPropEx(_dto.propertiesJson, 'is-business-owner', checked);
        dtoToPage.address();
        dtoToPage.capacityOther();
        $('#id-user-profile-capacity-select').val('');
        if (checked == 'No') {
            app.onboard.owner.makeDirty(true);
        } else {
            app.onboard.owner.makeDirty(true);
        }
    });

    function verifyMobileAgainstId(cb) {
        let id = $('#id-user-profile-id').val();
        let mobile = $('#id-user-profile-mobile').val();
        app.onboard.service.verifyMobileAgainstId(id, mobile, (status) => {
            if (status.result == Result.Fail) {
                smec.mobileIdMismatch((status) => {
                    $('#id-user-profile-id').prop('disabled', false);
                    btnId(true, true, app.localize('OW_IdentityVerifyButton'));
                    btnMobile(false, false, app.localize('OW_IdentityVerifyButton'));
                    _dto.isIdentityOrPassportConfirmed = false;
                    _dto.isPhoneNumberConfirmed = false;
                });
            }
        });
    }

    $('#id-user-mobile-verify-input-button').click(function () {

        app.onboard.common.verify.mobile('id-user-profile-mobile', app.onboard.user.mobile, app.onboard.user.identity, function (status) {
            switch (status.result) {
                case Result.Pass:
                    _dto.isPhoneNumberConfirmed = true;
                    $('#id-user-profile-mobile').prop('disabled', true);
                    verifyMobileAgainstId((status) => {
                    });
                    break;

                case Result.Cancel: case Result.Fail:
                    mobileControl(true, true, true, 'OW_MobileVerifyButton');
                    break;
            }
        });
    });

    $('#id-user-mobile-verify-select').on('change', function (arg) {
        if ($('#id-user-mobile-verify-select').val() == 'input') {
            $('#id-user-mobile-verify-select-div').hide();
            $('#id-user-mobile-verify-input-div').show();
        } else {
            $('#id-user-mobile-verify-button').prop('disabled', false);
            $('#id-user-mobile-verify-button').addClass('pulse');
            $('#id-user-mobile-verify-button-span').text(app.localize('OW_IdentityVerifyButton'));
        }
    });

    $('#id-user-mobile-verify-button').on('click', function () {
        $('#id-user-mobile-verify-button').prop('disabled', true);
        $('#id-user-mobile-verify-button').removeClass('pulse');
        let mobileNumber = $('#id-user-mobile-verify-select').val();
        //let mobileNumber = '0829999999';
        VerifyMobileNumber(mobileNumber, function (status) {
            app.onboard.wizard.toggleNext(true);

            function resultPass() {
                $('#id-user-mobile-verify-select-div').hide();
                $('#id-user-mobile-verify-input-div').show();
                $('#id-user-profile-mobile').val($('#id-user-mobile-verify-select').val());
                $('#id-user-profile-mobile').prop('disabled', true);

                $('#id-user-mobile-verify-input-button').removeClass('pulse');
                $('#id-user-mobile-verify-input-button').prop('disabled', true);
                $('#id-user-profile-span').text(app.localize('OW_IdentityVerifiedButton'));

                _dto.isPhoneNumberConfirmed = true;
            }

            function resultCancel() {
                $('#id-user-mobile-verify-button').prop('disabled', false);
                $('#id-user-mobile-verify-button').addClass('pulse');
            }

            function resultFail() {
            }

            switch (status.result) {
                case Result.Pass:
                    resultPass();
                    break;

                case Result.Cancel:
                    resultCancel();
                    break;

                case Result.Fail:
                    resultFail();
                    break;
            }
        });
    });

    $('#id-user-verify-identity-button').click(function () {
        if (_dto.isIdentityOrPassportConfirmed == true) {
            //cb(AddStatus(), _dto.verificationRecordJson);
        } else {
            $('#id-user-basic-screening-fail-alert').hide('fast');
            let id = $('#id-user-profile-id').val();
            let fail = id == '7608130019089';
            app.onboard.common.verify.identity(
                id,
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

                        let json = JSON.parse(jsonBlob);
                        let titleGuid = helpers.getTitleGuidFromVerificationRecord(json);
                        if (titleGuid != null) {
                            _titleControl.val(titleGuid);
                        }

                        if (_dto.isPhoneNumberConfirmed == false) {
                            //getMobileNumbers($('#id-user-profile-id').val(), function (output) {
                            //    app.onboard.wizard.toggleNext(true);
                            //});
                            btnMobile(true, true, app.localize('OW_IdentityVerifyButton'));
                            $('#id-user-profile-id').prop('disabled', true);
                            $('#id-user-profile-mobile').prop('disabled', false);
                        } else {
                            $('#id-user-profile-id').prop('disabled', true);
                            app.onboard.wizard.toggleNext(true);
                        }
                    }

                    function resultFail() {
                        if (status.code == 1) {
                            $('#id-user-basic-screening-fail-alert').show('fast');
                            app.onboard.wizard.toggleNext(false);
                        }
                    }

                    switch (status.result) {
                        case Result.Pass:
                            resultPass();
                            break;

                        case Result.Fail:
                            resultFail();
                            break;

                        default:
                            app.onboard.user.identity.freeze(false);
                            break;
                    }
                }, fail
            );
        }
    });

    app.common.input.numeric('id-user-profile-mobile', 10);
    app.common.input.numeric('id-user-profile-id', 13);

    sefaOriginOtherSelect.change((value, text) => {
        dtoToPage.sefaOriginOther(value == guids.SegaOriginOther);
        dtoToPage.sefaOriginStrategicPartner(value == guids.SegaOriginStrategicPartner);
    });

})(app.onboard);

