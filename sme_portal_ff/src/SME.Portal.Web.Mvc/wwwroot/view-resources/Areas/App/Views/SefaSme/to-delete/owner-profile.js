if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.owner = null;

(function (onboard) {

    let helpers = app.onboard.helpers.get();
    let identityButton = helpers.buttonState('id-owner-verify-identity-button', 'id-owner-verify-identity-span');
    let mobileButtonInput = helpers.buttonState('id-owner-mobile-verify-input-button', 'id-owner-profile-span');

    let copRadio = app.control.radio('name-input-owner-married-in-cop');
    let isDisabled = app.control.radio('input-owner-is-disabled');

    function mobileControl(enableInput, enableButton, flashButton, textButton) {
        $('#id-owner-profile-mobile').prop('disabled', enableInput ^ true);
        mobileButtonInput(enableButton, flashButton, textButton);
    }

    function refreshMobileControl() {
        if (app.onboard.user.dto.isOwner == true) {
            mobileControl(false, false, false, app.localize('OW_IdentityVerifiedButton'));
        } else {
            if (_dto.owner.isIdentityOrPassportConfirmed == true) {
                if (_dto.owner.isPhoneNumberConfirmed == true) {
                    mobileControl(false, false, false, app.localize('OW_IdentityVerifiedButton'));
                } else {
                    mobileControl(true, true, true, app.localize('OW_IdentityVerifyButton'));
                }
            } else {
                mobileControl(false, false, false, app.localize('OW_IdentityVerifyButton'));
            }
        }
    }

    function isMarried() {
        if (_dto.owner.verificationRecordJson != null && _dto.owner.verificationRecordJson.length > 0) {
            let json = JSON.parse(_dto.owner.verificationRecordJson);
            return json.MaritalStatus == 'Married';
        } else {
            return false;
        }
    }

    function showCOPRadio(show) {
        if (show == true) {
            $('#id-div-owner-married-in-cop').show('fast');
        } else {
            $('#id-div-owner-married-in-cop').hide('fast');
            copRadio.val('');
        }
        KTWizard2.enable(KTWizard2.PAGE.OwnerProfile, 'name-input-owner-married-in-cop', show);
    }

    function showSpouseIdInput(show) {
        if (show == true) {
            $('#id-div-owner-spouse-identity').show('fast');
        } else {
            $('#id-div-owner-spouse-identity').hide('fast');
            $('#id-input-owner-spouse-identity').val('');

        }
        KTWizard2.enable(KTWizard2.PAGE.OwnerProfile, 'name-input-owner-spouse-identity', show);
    }

    class DtoToPage {
        constructor() {
            this.dto = null;
            this.verificationJson = null;
        }

        setDto(dto) {
            this.dto = dto;
            if (dto.owner.verificationRecordJson != null && dto.owner.verificationRecordJson != '') {
                this.verificationJson = JSON.parse(dto.owner.verificationRecordJson);
                if (this.verificationJson['MaritalStatus'] == '') {
                    $('#root-select-owner-profile-marital-status').show();
                    $('#root-input-owner-profile-marital-status').hide();
                    KTWizard2.enable(KTWizard2.PAGE.OwnerProfile, 'validate-owner-profile-marital-status', false);
                    KTWizard2.enable(KTWizard2.PAGE.OwnerProfile, 'select-owner-profile-marital-status', true);
                }
            } else {
                this.verificationJson = {
                    Age: '',
                    Gender: '',
                    MaritalStatus : ''
                };
            }
        }

        reset() {
            this.verificationJson = {
                Age: '',
                Gender: '',
                MaritalStatus: ''
            };
            this.dto.owner.identityOrPassport = '';
            this.dto.owner.phoneNumber = '';
            this.dto.owner.name = '';
            this.dto.owner.surname = '';
            this.dto.owner.emailAddress = '';
            this.dto.owner.verificationRecordJson = '';
            this.dto.owner.isIdentityOrPassportConfirmed = false;
            this.dto.owner.isPhoneNumberConfirmed = false;
            this.dto.owner.race = '';

            helpers.setProp(this.dto.owner.propertiesJson, 'owner-is-disabled', '');
            helpers.setProp(this.dto.owner.propertiesJson, 'owner-title', '');
            helpers.setProp(this.dto.owner.propertiesJson, 'owner-profile-registered-address', '');

            function state(id, enable) {
                //$('#' + id).val('');
                $('#' + id).prop('disabled', enable ^ true);
            }
            
            state('id-owner-profile-id', true);
            state('id-owner-profile-mobile', true);
            state('id-select-owner-profile-title', true);
            state('id-owner-profile-fname', false);
            state('id-owner-profile-lname', false);
            state('id-owner-profile-email', true);
            state('id-owner-profile-age', false);
            state('id-owner-profile-gender', false);
            state('id-owner-profile-marital-status', false);
            state('id-owner-profile-race', true);

            $('#parent-owner-has-no-companies-alert').hide('fast');
            $('#id-owner-basic-screening-fail-alert').hide('fast');
            $('#id-owner-advanced-screening-fail-alert').hide('fast');
            //$('#id-owner-mobile-verify-input-div').hide();
            $('#id-owner-mobile-verify-select-div').hide();

            KTWizard2.resetFields(
                KTWizard2.PAGE.OwnerProfile, [
                    'fname',
                    'lname',
                    'email',
                    'mobile',
                    'ownerIdentity',
                    'validate-owner-profile-gender',
                    'validate-owner-profile-marital-status',
                    'validate-owner-profile-age',
                    'race',
                    'name-select-owner-profile-title',
                    'name-input-owner-profile-registered-address',
                    'input-owner-is-disabled'
                ]
            );
        }

        resetAutoFill() {
            $('#id-owner-profile-fname').val('');
            $('#id-owner-profile-lname').val('');
            $('#id-owner-profile-age').val('');
            $('#id-owner-profile-gender').val('');
            $('#id-owner-profile-marital-status').val('');
            $('#input-owner-is-disabled').val('');
        }

        autoFill() {
            $('#id-owner-profile-fname').val(this.verificationJson.FirstName);
            $('#id-owner-profile-lname').val(this.verificationJson.Surname);
            this.age();
            this.gender();
            this.maritalStatus();
        }

        identityNumber() {
            $('#id-owner-profile-id').val(this.dto.owner.identityOrPassport);
            $('#id-owner-profile-id').prop('disabled', this.dto.extra.isUserOwner | this.dto.owner.isIdentityOrPassportConfirmed);
        }

        mobileNumber() {
            $('#id-owner-profile-mobile').val(this.dto.owner.phoneNumber);
            refreshMobileControl();
        }

        firstName() {
            $('#id-owner-profile-fname').val(this.dto.owner.name);
            $('#id-owner-profile-fname').prop('disabled', true);
        }

        lastName() {
            $('#id-owner-profile-lname').val(this.dto.owner.surname);
            $('#id-owner-profile-lname').prop('disabled', true);
        }

        emailAddress() {
            $('#id-owner-profile-email').val(this.dto.owner.emailAddress);
            $('#id-owner-profile-email').prop('disabled', this.dto.extra.isUserOwner);
        }

        title() {
            // TODO: Get this from json prop.
            $('#id-select-owner-profile-title').prop('disabled', this.dto.extra.isUserOwner);
            let guid = helpers.getProp(this.dto.owner.propertiesJson, 'owner-title');
            $('#id-select-owner-profile-title').val(guid);
        }

        disabled() {
            let disabled = helpers.getProp(this.dto.owner.propertiesJson, 'owner-is-disabled', '');
            isDisabled.val(disabled);
        }

        age() {
            $('#id-owner-profile-age').val(this.verificationJson.Age);
            $('#id-owner-profile-age').prop('disabled', true);
        }

        gender() {
            $('#id-owner-profile-gender').val(this.verificationJson.Gender);
            $('#id-owner-profile-gender').prop('disabled', true);
        }

        maritalStatus() {
            $('#id-owner-profile-marital-status').val(this.verificationJson.MaritalStatus);
            $('#id-owner-profile-marital-status').prop('disabled', true);
        }

        raceOther() {
            let guid = $('#id-owner-profile-race').val();
            if (guid == '62271c13567e92380c27c3c2') {
                let other = helpers.getProp(this.dto.owner.propertiesJson, 'owner-profile-race-other', '');
                $('#id-input-owner-profile-race-other').val(other)
                $('#id-div-owner-profile-race-other').show('fast');
                KTWizard2.enable(KTWizard2.PAGE.OwnerProfile, 'name-input-owner-profile-race-other', true);
            } else {
                helpers.setProp(this.dto.owner.propertiesJson, 'owner-profile-race-other', '');
                $('#id-input-owner-profile-race-other').val('')
                $('#id-div-owner-profile-race-other').hide('fast');
                KTWizard2.enable(KTWizard2.PAGE.OwnerProfile, 'name-input-owner-profile-race-other', false);
            }
        }

        race() {
            $('#id-owner-profile-race').val(this.dto.owner.race);
            $('#id-owner-profile-race').prop('disabled', false);
        }

        copQuestion() {
            if (this.dto.owner.isIdentityOrPassportConfirmed == true && isMarried() == true) {
                showCOPRadio(true);
                let value = helpers.getProp(this.dto.owner.propertiesJson, 'owner-is-married-in-cop');
                copRadio.val(value);
            } else {
                showCOPRadio(false);
                copRadio.val('');
            }
        }

        spouseIdentity() {
            if (this.dto.owner.isIdentityOrPassportConfirmed == true && isMarried() == true) {
                let value = helpers.getProp(this.dto.owner.propertiesJson, 'owner-is-married-in-cop');
                showSpouseIdInput(value == 'Yes');
                if (value == 'Yes') {
                    value = helpers.getProp(this.dto.owner.propertiesJson, 'owner-spouse-identiy-number');
                    $('#id-input-owner-spouse-identity').val(value);
                }
            } else {
                showSpouseIdInput(false);
                $('#id-input-owner-spouse-identity').val('');
            }
        }

        address() {
            //let guid = $('#id-user-profile-capacity-select').val();
            //let toggle = app.onboard.user.dto.isOwner == false && guid == '6226122fc3ac73094c399c4a';
            //KTWizard2.enable(KTWizard2.PAGE.OwnerProfile, 'name-input-owner-profile-registered-address', toggle);
            //if (toggle == true) {
                $('#id-div-owner-profile-registered-address').show('fast');
                let address = helpers.getProp(this.dto.owner.propertiesJson, 'owner-profile-registered-address', '');
                $('#id-input-owner-profile-registered-address').val(address);
            //} else {
            //    helpers.setProp(this.dto.owner.propertiesJson, 'owner-profile-registered-address', '');
            //    $('#id-input-owner-profile-registered-address').val('');
            //    $('#id-div-owner-profile-registered-address').hide('fast');
            //}
        }

        apply() {
            this.identityNumber();
            this.mobileNumber();
            this.firstName();
            this.lastName();
            this.emailAddress();
            this.title();
            this.disabled();
            this.age();
            this.gender();
            this.maritalStatus();
            this.race();
            this.raceOther();
            this.copQuestion();
            this.spouseIdentity();
            this.address();
        }
    }

    class PageToDto {
        constructor() {
            this.dto = null;
        }

        setDto(dto) {
            this.dto = dto;
        }

        identityNumber() {
            this.dto.owner.identityOrPassport = $('#id-owner-profile-id').val();
        }

        mobileNumber() {
            this.dto.owner.phoneNumber = $('#id-owner-profile-mobile').val();
        }

        firstName() {
            this.dto.owner.name = $('#id-owner-profile-fname').val();
        }

        lastName() {
            this.dto.owner.surname = $('#id-owner-profile-lname').val();
        }

        emailAddress() {
            this.dto.owner.emailAddress = $('#id-owner-profile-email').val();
        }

        title() {
            let guid = $('#id-select-owner-profile-title').val();
            helpers.setProp(this.dto.owner.propertiesJson, 'owner-title', guid);
        }

        raceOther() {
            let guid = $('#id-owner-profile-race').val();
            if (guid == '62271c13567e92380c27c3c2') {
                let other = $('#id-input-owner-profile-race-other').val();
                helpers.setProp(this.dto.owner.propertiesJson, 'owner-profile-race-other', other);
            } else {
                helpers.setProp(this.dto.owner.propertiesJson, 'owner-profile-race-other', '');
            }
        }

        disabled() {
            let value = isDisabled.val();
            helpers.setProp(this.dto.owner.propertiesJson, 'owner-is-disabled', value);
        }

        race() {
            this.dto.owner.race = $('#id-owner-profile-race').val();
        }

        copQuestion() {
            let value = copRadio.val();
            helpers.setProp(this.dto.owner.propertiesJson, 'owner-is-married-in-cop', value);
        }

        spouseIdentity() {
            let value = $('#id-input-owner-spouse-identity').val();
            helpers.setProp(this.dto.owner.propertiesJson, 'owner-spouse-identiy-number', value);
        }

        address() {
            let address = $('#id-input-owner-profile-registered-address').val();
            helpers.setProp(this.dto.owner.propertiesJson, 'owner-profile-registered-address', address);
        }

        apply() {
            this.identityNumber();
            this.mobileNumber();
            this.firstName();
            this.lastName();
            this.emailAddress();
            this.title();
            this.disabled();
            this.race();
            this.raceOther();
            this.copQuestion();
            this.spouseIdentity();
            this.address();
        }
    }

    let dtoToPage = new DtoToPage();
    let pageToDto = new PageToDto();

    let _dto = null;

    let _titleControl = app.control.select('name-select-owner-profile-title', 'id-select-owner-profile-title');
    let _titles = app.listItems.obj.getTitles();
    _titleControl.fill(_titles);

    let _raceControl = app.control.select('race', 'id-owner-profile-race');
    let _race = app.listItems.obj.getRace();
    _raceControl.fill(_race);

    let mobileButtonSelect = helpers.buttonState('id-owner-mobile-verify-button', 'id-owner-mobile-verify-button-span');

    function setIdButtonState(enable, pulse, text) {
        identityButton(enable, pulse, text);
    }

    function setMobileButtonState(enable, pulse, text) {
        mobileButtonInput(enable, pulse, text);
        mobileButtonSelect(enable, pulse, text);
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
                userId: -1,
                propertiesJson : ''
            },
            extra: {
                isUserOwner : false
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
            propertiesJson: JSON.stringify(_dto.owner.propertiesJson)
        };
    }

    let _isDirty = false;

    function makeDirty(isDirty) {
        _isDirty = isDirty;
    }

    function advancedScreeningPrologue() {
        setIdButtonState(false, false, null);
        $('#id-owner-profile-id').prop('disabled', true);
    }

    function advancedScreeningMain(creditreport, failOverride) {
        let status = AddStatus();
        if (failOverride == true) {
            _dto.owner.isIdentityOrPassportConfirmed = false;
            status.result = Result.Fail;
        } else {
            _dto.owner.isIdentityOrPassportConfirmed = true;
        }
        return status;
    }

    function advancedScreeningEpilogue(status) {
        if (status.result == Result.Fail) {
            setIdButtonState(true, true, 'OW_IdentityVerifyButton');
            $('#id-owner-profile-id').prop('disabled', false);
            $('#id-owner-advanced-screening-fail-alert').show('fast');
            app.onboard.wizard.toggleNext(false);
        } else {
            dtoToPage.setDto(_dto);
            dtoToPage.autoFill();

            KTWizard2.validateFields(
                KTWizard2.PAGE.OwnerProfile,
                ['fname', 'lname', 'validate-owner-profile-gender', 'validate-owner-profile-marital-status', 'validate-owner-profile-age'],
                function (result) {
                }
            );
            let payload = JSON.parse(_dto.owner.verificationRecordJson);
            let titleGuid = helpers.getTitleGuidFromVerificationRecord(payload);
            if (titleGuid != null) {
                _titleControl.val(titleGuid);
            }
        }
    }
    // 863
    function advancedScreening(creditreport, fail, cb) {
        advancedScreeningPrologue();
        let status = advancedScreeningMain(creditreport, fail);
        advancedScreeningEpilogue(status);
        cb(status);
    }
    // 489
    function advancedScreeningEx(creditreport, fail, cb) {
        let status = advancedScreeningMain(creditreport, fail);
        if (status.result == Result.Fail) {
            app.onboard.wizard.toggleNext(false);
            $('#id-owner-advanced-screening-fail-alert').show('fast');
        }
        cb(status);
    }

    function personVerified() {
        if (isMarried() == true) {
            showCOPRadio(true);
        } else {
            showCOPRadio(false);
        }
    }

    function userIsOwnerUpdate(dto) {
        _dto.extra.isUserOwner = true;
        dtoToPage.setDto(_dto);
        if (_isDirty == true) {
            dtoToPage.reset();
            $('#id-owner-mobile-verify-input-div').show();
            setMobileButtonState(false, false, 'OW_MobileVerifiedButton');
            KTWizard2.resetFields(
                KTWizard2.PAGE.OwnerProfile,
                ['race']
            );
        }
        helpers.userDtoToOwnerDto(app.onboard.user.dto, _dto);
        dtoToPage.setDto(_dto);
        dtoToPage.apply();
        // TODO: This it temp until we get propJson.
        $('#id-select-owner-profile-title').val($('#id-select-user-profile-title').val());

        if (_isDirty == true) {
            showCOPRadio(false);
            showSpouseIdInput(false);
            getCreditReport(function (status, payload) {
                let id = $('#id-owner-profile-id').val();
                let backgroundCheckFail = false;//id == '7012285285084';
                advancedScreeningEx(payload, backgroundCheckFail, function (status) {
                    if (status.result == Result.Pass) {
                        personVerified();
                    } else {
                        // Exit with last known result.
                    }
                });
            });
        }

        makeDirty(false);
    }

    function userIsNotOwnerUpdate() {
        _dto.extra.isUserOwner = false;
        $('#id-select-owner-profile-title').prop('disabled', false);
        if (_isDirty == true) {
            dtoToPage.setDto(_dto);
            dtoToPage.reset();
            dtoToPage.apply();
            makeDirty(false);
        }
    }


    function init(cb) {
        KTWizard2.enable(KTWizard2.PAGE.OwnerProfile, 'select-owner-profile-marital-status', false);


        if (_dto.owner['propertiesJson'] != null && _dto.owner['propertiesJson'] != '') {
            _dto.owner['propertiesJson'] = JSON.parse(_dto.owner['propertiesJson']);
        } else {
            _dto.owner['propertiesJson'] = {};
        }

        dtoToPage.setDto(_dto);
        dtoToPage.apply();
        cb(AddStatus());
    }

    function loadDto(args, cb) {
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

        let status = AddStatus();
        if( helpers.hasProp(args, 'dto') == true && helpers.hasProp(args.dto, 'owner') == true) {
            status.result = Result.Pass;
            _dto = dto;
            onboard.owner.dto = dto;
            init(function (status) {
                cb(status, _dto);
            });
        } else {
            abp.services.app.ownersAppServiceExt.getOwnerForEditByUser().done(function (dto) {
                if (dto != null && dto.owner != null) {
                    status.result = Result.Pass;
                    _dto = dto;
                    onboard.owner.dto = dto;
                    onboard.owner.dto.extra = {
                        isUserOwner: false
                    };
                    if (onboard.owner.dto['isIdentityOrPassportConfirmed'] == false) {
                        onboard.owner.dto['isPhoneNumberConfirmed'] = false;
                    }
                } else {
                    defaultDto();
                    status.result = Result.Fail;
                }
                onboard.owner.dto.extra.isUserOwner = args.extra.isUserOwner;
                init(function (status) {
                    cb(status, _dto);
                });
            });
        }
    }

    function submitDto(cb) {
        pageToDto.setDto(_dto);
        pageToDto.apply();
        let writeDto = readDtoToWriteDto();
        abp.services.app.ownersAppServiceExt.createOrEdit(writeDto).done(function (result) {
            onboard.owner.dto.owner.id = result;
            cb(AddStatus(), result);
        });
    }

    function validate(foreward, cb) {
        let status = AddStatus();
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
        initAutocomplete_owner();
        if (foreward == false) {
            cb(AddStatus());
        }
        // TODO: Get this into DtoToPage class sometime.
        if (foreward == true) {
            dtoToPage.address();

            refreshMobileControl();
        
            app.onboard.owner.identity.disable(_dto.owner.isIdentityOrPassportConfirmed);
            app.onboard.owner.identity.text(_dto.owner.isIdentityOrPassportConfirmed);
        }
        if (app.onboard.user.dto.isOwner == true || _dto.owner.isPhoneNumberConfirmed == true) {
            $('#id-owner-mobile-verify-input-div').show();
        } else {
            //$('#id-owner-mobile-verify-input-div').hide();
        }
        cb(AddStatus());
    }

    function neglect(from, to, foreward, cb) {
        pageToDto.setDto(_dto);
        pageToDto.apply();
        let v = copRadio.val();
        if (foreward == true) {
            submitDto(function (status, ownerId) {
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
                    app.onboard.owner.mobile.pulse(data.valid & (_dto.owner.isPhoneNumberConfirmed == false));
                    app.onboard.owner.mobile.disable((data.valid == false) | (_dto.owner.isPhoneNumberConfirmed == true));
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

        let _clickId = 'id-owner-mobile-verify-input-button';
        let _textId = 'id-owner-profile-span';
        onboard.owner = {
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
                'id-owner-verify-identity-button',
                'id-owner-verify-identity-span',
                'OW_IdentityVerifyButton',
                'OW_IdentityVerifiedButton'),
            dto: _dto
        };

    $('#id-owner-mobile-verify-select').on('change', function (arg) {
        if ($('#id-owner-mobile-verify-select').val() == 'input') {
            $('#id-owner-mobile-verify-select-div').hide();
            $('#id-owner-mobile-verify-input-div').show();
        } else {
            $('#id-owner-mobile-verify-button').prop('disabled', false);
            $('#id-owner-mobile-verify-button').addClass('pulse');
            $('#id-owner-mobile-verify-button-span').text(app.localize('OW_IdentityVerifyButton'));
        }
    });

    function verifyMobileAgainstId(cb) {
        let id = $('#id-owner-profile-id').val();
        let mobile = $('#id-owner-profile-mobile').val();
        app.onboard.service.verifyMobileAgainstId(id, mobile, (status) => {
            if (status.result == Result.Fail) {
                smec.mobileIdMismatch((status) => {
                    $('#id-owner-profile-id').prop('disabled', false);
                    btnId(true, true, app.localize('OW_IdentityVerifyButton'));
                    btnMobile(false, false, app.localize('OW_IdentityVerifyButton'));
                    _dto.owner.isIdentityOrPassportConfirmed = false;
                    _dto.owner.isPhoneNumberConfirmed = false;
                });
            }
        });
    }

    function verifyMobileNumber(mobileNumber, cb) {
        setMobileButtonState(false, false, 'OW_MobileVerifyButton');
        app.modal.verifySms.verify(mobileNumber, function (status) {
            switch (status.result) {
                case Result.Pass:
                    _dto.owner.isPhoneNumberConfirmed = true;
                    $('#id-owner-profile-mobile').val(mobileNumber);
                    $('#id-owner-profile-mobile').prop('disabled', true);
                    $('#id-owner-mobile-verify-select-div').hide();
                    $('#id-owner-mobile-verify-input-div').show();
                    setMobileButtonState(false, false, 'OW_MobileVerifiedButton');
                    verifyMobileAgainstId((status) => {
                    });
                    break;

                case Result.Cancel: case Result.Fail:
                    $('#id-owner-profile-mobile').val('');
                    mobileControl(true, true, true, 'OW_MobileVerifyButton');
                    break;
            }
            cb(status);
        });
    }



    // TODO: Share code with user profile!!!
    $('#id-owner-mobile-verify-input-button').click(function () {
        let mobileNumber = $('#id-owner-profile-mobile').val();
        verifyMobileNumber(mobileNumber, function (status) {
        });
    });

    $('#id-owner-mobile-verify-button').on('click', function () {
        let mobileNumber = $('#id-owner-mobile-verify-select').val();
        verifyMobileNumber(mobileNumber, function (status) {
        });
    });

        function getCreditReport(cb) {
            setIdButtonState(false, false, null);
            $('#id-owner-profile-id').prop('disabled', true);

            cb(AddStatus(), null);
        }

        function verifyPerson(creditReport, fail, cb) {
            let status = AddStatus();
            if (fail == true) {
                status.result = Result.Fail;
                status.code = 1;
                status.message = 'Not a South African Citizen';
            }
            let args = {
                identityNumber: $('#id-owner-profile-id').val(),
                'creditReport': creditReport,
                'status' : status
            };
            app.onboard.service.validatePerson(args, function (status, payload) {

                function onResultPass() {
                    let jsonStr = JSON.stringify(payload);
                    _dto.owner.isIdentityOrPassportConfirmed = true;
                    _dto.owner.verificationRecordJson = jsonStr;
                }

                function onResultFail() {
                    _dto.owner.isIdentityOrPassportConfirmed = false;
                    setIdButtonState(true, true, null);
                    $('#id-owner-profile-id').prop('disabled', false);
                    if (status.code == 1) {
                        $('#id-owner-basic-screening-fail-alert').show('fast');
                        app.onboard.wizard.toggleNext(false);
                    }
                }

                switch (status.result) {
                    case Result.Pass:
                        onResultPass();
                        break;

                    case Result.Fail:
                        onResultFail();
                        break;
                }
                cb(status);
            });
        }

    $('#id-owner-verify-identity-button').click(function () {

        $('#parent-owner-has-no-companies-alert').hide('fast');
        $('#id-owner-basic-screening-fail-alert').hide('fast');
        $('#id-owner-advanced-screening-fail-alert').hide('fast');

        showCOPRadio(false);
        showSpouseIdInput(false);

        if (_dto.owner.isIdentityOrPassportConfirmed == true) {// ||
            //app.onboard.wizard.mode == app.onboard.wizard.MODE.Add ||
            //app.onboard.wizard.mode == app.onboard.wizard.MODE.Edit) {
        } else {
            app.onboard.wizard.toggleNext(true);
            setIdButtonState(false, false, null);
            $('#id-owner-profile-id').prop('disabled', true);
            let payload = null;
            //getCreditReport(function (status, payload) {

            let verifyPersonFail = ($('#id-owner-profile-id').val() == '7608130019089');
            verifyPerson(payload, verifyPersonFail, function (status) {

                if (status.result == Result.Pass) {
                    let id = $('#id-owner-profile-id').val();
                    let backgroundCheckFail = false;//id == '7012285285084';
                    advancedScreening(payload, backgroundCheckFail, function (status) {
                        if (status.result == Result.Pass) {
                            personVerified();
                            setIdButtonState(false, false, 'OW_MobileVerifiedButton');
                            $('#id-owner-profile-id').prop('disabled', true);
                            $('#id-owner-profile-mobile').prop('disabled', false);
                            mobileControl(true, true, true, app.localize('OW_IdentityVerifyButton'));
                            //getMobileNumbers(id, null, function (output) {
                            //
                            //});

                        } else {
                            // Exit with last known result.
                        }
                    });
                } else {
                    // Exit with last known result.
                }
            });
            // - Exit with last known result.
            //});

        }
    });




    app.common.input.numeric('id-owner-profile-mobile', 10);
    app.common.input.numeric('id-owner-profile-id', 13);
    app.common.input.numeric('id-input-owner-spouse-identity', 13);

    copRadio.click(function (args, name, prev, next) {
        if (next == 'Yes') {
            showSpouseIdInput(true);
        } else {
            showSpouseIdInput(false);
        }
    });

    $('#id-owner-profile-race').on('change', function () {
        dtoToPage.raceOther();
    });

    $('#select-owner-profile-marital-status').on('change', () => {
        let val = $('#select-owner-profile-marital-status').val();
        $('#id-owner-profile-marital-status').val(val);
        let temp = JSON.parse(_dto.owner.verificationRecordJson);
        temp['MaritalStatus'] = val;
        _dto.owner.verificationRecordJson = JSON.stringify(temp);
    });

})(app.onboard);
