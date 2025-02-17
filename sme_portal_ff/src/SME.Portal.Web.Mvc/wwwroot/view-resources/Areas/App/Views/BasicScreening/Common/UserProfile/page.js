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

if (app.wizard.user.page == undefined) {
    app.wizard.user.page = {};
}

(function (page) {

    const guid = {
        CapacityAutorizedRepresentative: '6226122fc3ac73094c399c4a',
        CapacityOther: '6226122fc3ac73094c399c4d'
    };

    class DtoToPage {
        constructor(self) {
            this.dto = null;
            this.helpers = self.helpers;
            this.identityControl = self.identityControl;
            this.mobileControl = self.mobileControl;
            this.controls = self.controls;
            this.validation = self.validation;
        }

        set(name, prop, show) {
            if (show == false) {
                this.helpers.setPropEx(this.dto.propertiesJson, prop, '');
            }
            this.validation.toggleValidators([name], [show]);
            let value = this.helpers.getPropEx(this.dto.propertiesJson, prop, '');
            this.controls[name].val(value);
            return value;
        }

        identityNumber() {
            this.controls['input-user-profile-identity'].val(this.dto.identityOrPassport);
            this.identityControl(this.helpers.validIdentityFormat(this.dto.identityOrPassport));
        }

        mobileNumber() {
            this.controls['input-user-profile-mobile'].val(this.dto.phoneNumber);
            this.mobileControl(this.helpers.validMobileFormat(this.dto.phoneNumber), this.dto.isIdentityOrPassportConfirmed == false ? 'verify' : '');
        }

        emailAddress() {
            this.controls['input-user-profile-email'].val(this.dto.emailAddress);
            this.controls['input-user-profile-email'].enable(false);
        }

        firstName() {
            this.controls['input-user-profile-first-name'].val(this.dto.name);
            this.controls['input-user-profile-first-name'].enable(false);

            let value = this.helpers.getProp(this.dto.propertiesJson, 'user-title', '');
            this.controls['select-left-input-user-profile-first-name'].val(value);
        }

        lastName() {
            this.controls['input-user-profile-last-name'].val(this.dto.surname);
            this.controls['input-user-profile-last-name'].enable(false);
        }

        isBusinessOwner() {
            let value = this.helpers.getPropEx(this.dto.propertiesJson, 'is-business-owner', '');
            this.controls['input-user-profile-is-owner'].val(value);
            this.capacity(value == 'No' || value == '');
        }

        capacity(enable = false) {
            this.dto.representativeCapacity = enable == false ? '' : this.dto.representativeCapacity;
            this.helpers.show('div-user-profile-owner-capacity', enable);
            this.validation.toggleValidators(['select-user-profile-owner-capacity'], [enable]);
            this.controls['select-user-profile-owner-capacity'].val(this.dto.representativeCapacity);
            this.capacityRegisteredAddress(this.dto.representativeCapacity == guid.CapacityAutorizedRepresentative);
            this.capacityOther(this.dto.representativeCapacity == guid.CapacityOther);

        }

        capacityRegisteredAddress(enable = false) {
            if (enable == false) {
                this.helpers.setProp(this.dto.propertiesJson, 'user-profile-registered-address', '');
            }
            this.helpers.show('div-user-profile-registered-address', enable);
            this.validation.toggleValidators(['input-user-profile-registered-address'], [enable]);
            let address = this.helpers.getProp(this.dto.propertiesJson, 'user-profile-registered-address', '');
            this.controls['input-user-profile-registered-address'].val(address);
        }

        capacityOther(enable = false) {
            if (enable == false) {
                this.helpers.setProp(this.dto.propertiesJson, 'user-profile-capacity-other', '');
            }
            this.helpers.show('div-user-profile-owner-capacity-other', enable);
            this.validation.toggleValidators(['input-user-profile-owner-capacity-other'], [enable]);
            let other = this.helpers.getProp(this.dto.propertiesJson, 'user-profile-capacity-other', '');
            this.controls['input-user-profile-owner-capacity-other'].val(other);
        }

        apply(dto) {
            this.dto = dto;
            this.identityNumber();
            this.mobileNumber();
            this.emailAddress();
            this.firstName();
            this.lastName();
            this.isBusinessOwner();
        }
    }

    class PageToDto {
        constructor(self) {
            this.dto = null;
            this.helpers = self.helpers;
            this.controls = self.controls;
        }

        identityNumber() {
            this.dto.identityOrPassport = this.controls['input-user-profile-identity'].val();
        }

        mobileNumber() {
            this.dto.phoneNumber = this.controls['input-user-profile-mobile'].val();
        }

        emailAddress() {
            this.dto.emailAddress = this.controls['input-user-profile-email'].val();
        }

        firstName() {
            this.dto.name = this.controls['input-user-profile-first-name'].val();
            let value = this.controls['select-left-input-user-profile-first-name'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'user-title', value);
        }

        lastName() {
            this.dto.surname = this.controls['input-user-profile-last-name'].val();
        }

        isBusinessOwner() {
            //this.dto.isOwner = $('#checkbox-user-profile-is-owner').prop('checked');
            let value = this.controls['input-user-profile-is-owner'].val();
            this.helpers.setPropEx(this.dto.propertiesJson, 'is-business-owner', value);
            this.dto.isOwner = value == 'Yes' ? true : false;
        }

        capacity() {
            this.dto.representativeCapacity = this.controls['select-user-profile-owner-capacity'].val();
            this.dto.representativeCapacity = this.dto.representativeCapacity == null ? '' : this.dto.representativeCapacity;
        }

        registeredAddress() {
            let value = this.controls['input-user-profile-registered-address'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'user-profile-registered-address', value);
        }

        capacityOther() {
            let value = this.controls['input-user-profile-owner-capacity-other'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'user-profile-capacity-other', value);
        }

        apply(dto) {
            this.dto = dto;
            this.identityNumber();
            this.mobileNumber();
            this.emailAddress();
            this.firstName();
            this.lastName();
            this.isBusinessOwner();
            this.capacity();
            this.registeredAddress();
            this.capacityOther();
        }
    }

    class Baseline extends app.wizard.page.Base {


        constructor(id) {
            super(id);
            this.name = 'User Profile Page';
            this.dto2Page = null;
            this.page2Dto = null;
        }

        createDtoToPage() {
            return new DtoToPage(this);
        }

        createPageToDto() {
            return new PageToDto(this);
        }

        validate(data, cb) {
            super.validate(data, cb);
        }

        dtoToPage(dto) {
            this.dto2Page.apply(this.model);
        }

        pageToDto(dto) {
            let temp = JSON.stringify(this.model);
            temp = JSON.parse(temp);
            this.page2Dto.apply(temp);
            this.model = JSON.parse(JSON.stringify(temp));
            return temp;
        }

        reset() {
        }

        load(args, cb) {
            let self = this;
            this.model = args;
            app.wizard.service.loadUserProfile((result) => {
                self.model = result.data;
                // TODO: Sort this mess out!!!
                if (self.model['propertiesJson'] == null || self.model['propertiesJson'] == '') {
                    self.model['propertiesJson'] = {};
                } else {
                    self.model['propertiesJson'] = JSON.parse(self.model['propertiesJson']);
                }
                if (self.helpers.isObject(self.model['propertiesJson']) == false) {
                    self.model['propertiesJson'] = {};
                }
                if (self.model['verificationRecordJson'] != null && self.model['verificationRecordJson'] != '') {
                    self.model['verificationRecordJson'] = JSON.parse(self.model['verificationRecordJson']);
                }
                if (self.model['propertiesJson'].hasOwnProperty('migrated-to-baseline') == false) {
                    self.model['propertiesJson']['migrated-to-baseline'] = true;
                }
                self.dtoToPage(self.model);
                cb(result);
            });
        }

        getDto() {
            return this.pageToDto(null);
        }

        __save__(dto, cb) {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: 'Processing...'
            });
            dto.propertiesJson = JSON.stringify(dto.propertiesJson);
            dto.verificationRecordJson = JSON.stringify(dto.verificationRecordJson);
            app.wizard.service.saveUserProfile(dto, (result) => {
                KTApp.unblockPage();
                cb(app.wizard.addResult());
            });
        }

        save(cb) {
            let dto = this.getDto();
            this.__save__(dto, cb);
        }

        attentionHidden(args, cb) {
            //if (args.isNext == true) {
                this.dtoToPage(this.model);
            //}
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            cb(app.wizard.addResult());
        }

        neglect(args, cb) {
            if (args.isNext == true) {
                this.save(cb);
            } else {
                cb(app.wizard.addResult());
            }
        }

        validate(args, cb) {
            let result = app.wizard.addResult();
            if (this.model.isIdentityOrPassportConfirmed == false || this.model.isPhoneNumberConfirmed == false) {
                result.status = app.wizard.Result.Fail;
                result.message = app.localize('OW_MobileNumberAndOrIdentityNumberNotYetVerified');
            }
            cb(result);
        }

        // TODO : User and owner have same function logic. Parametise!!!
        addFirstName() {
            let control = this.addControl('input-user-profile-first-name', 'input');
            control = this.addControl('select-left-input-user-profile-first-name', 'select');
            let titles = this.listItems.getTitles();
            if (titles.length == 0) {
                titles = [
                    { value : '622605ca67e3cc13cf216096', text : 'Mr.'},
                    { value : '622605ca67e3cc13cf216097', text : 'Mrs.'},
                    { value : '622605ca67e3cc13cf216098', text : 'MS.'},
                    { value : '622605ca67e3cc13cf216099', text : 'Prof.'},
                    { value : '622605ca67e3cc13cf21609a', text : 'Dr.'},
                    { value : '622605ca67e3cc13cf21609b', text : 'Sir'},
                    { value : '622605ca67e3cc13cf21609c', text : 'Madam'},
                    { value : '622605ca67e3cc13cf21609d', text : 'Cllr'},
                    { value : '622605ca67e3cc13cf21609e', text : 'Lord'},
                    { value : '622605ca67e3cc13cf21609f', text : 'Lady'},
                    { value : '622609bd567e92380c27c3b3', text : 'General'},
                    { value : '622609bd567e92380c27c3b4', text : 'Captain'},
                    { value : '622609bd567e92380c27c3b5', text : 'Hon.'},
                    { value : '62260d59c3ac73094c399c45', text : 'Rev.'}
                ];
            }
            control.fill(titles);
        }

        addControls() {
            let self = this;
            self.identityButton = this.common.getIdentityButtonFunc('button-user-profile-identity', 'span-user-profile-identity', this);
            self.identityControl = this.common.getIdentityControlFunc('button-user-profile-identity', 'span-user-profile-identity', 'input-user-profile-identity', this);

            self.mobileButton = this.common.getMobileButtonFunc('button-user-profile-mobile', 'span-user-profile-mobile', this);
            self.mobileControl = this.common.getMobileControlFunc('button-user-profile-mobile', 'span-user-profile-mobile', 'input-user-profile-mobile', this);

            this.dto2Page = this.createDtoToPage();//new DtoToPage(this);
            this.page2Dto = this.createPageToDto();//new PageToDto(this);

            let control = null;
            control = this.addControl('input-user-profile-identity', 'input');
            control.format(13);

            control = this.addControl('input-user-profile-mobile', 'input');
            control.format(10);

            control = this.addControl('input-user-profile-email', 'input');

            this.addFirstName();

            control = this.addControl('input-user-profile-last-name', 'input');
            //control = this.addControl('checkbox-user-profile-is-owner', 'checkbox');
            control = this.addControl('input-user-profile-is-owner', 'radio');

            control = this.addControl('select-user-profile-owner-capacity', 'select');

            let arr = this.listItems.getRoles();

            //arr.sort((lhs, rhs) => {
            //    return lhs.text > rhs.text ? 1 : -1;
            //});
            control.fill(arr);

            control = this.addControl('input-user-profile-owner-capacity-other', 'input');

            control = this.addControl('input-user-profile-registered-address', 'input');
        }

        onValidateIdentityNumberSuccess(result) {
            this.common.populateTitle(result.data, this.controls['select-left-input-user-profile-first-name']);
        }

        showIdentityNumberFailMessage(show) {
            if (show == true) {
                $('#id-user-basic-screening-fail-alert').show('fast');
            } else {
                $('#id-user-basic-screening-fail-alert').hide('fast');
            }
        }

        onValidateIdentityNumberFail(result) {
            if (result.code == 2) {
                Swal.fire({
                    icon: 'error',
                    html: result.message,
                    focusConfirm: false,
                    confirmButtonText:
                        'Got it',
                    confirmButtonAriaLabel: 'Got it'
                }).then(() => {
                });
            } else {
                this.showIdentityNumberFailMessage(true);
            }
        }

        onValidateIdentityNumber(result) {
            if (result.status == app.wizard.Result.Success) {
                this.onValidateIdentityNumberSuccess(result);
            } else {
                this.onValidateIdentityNumberFail(result);
            }
        }

        onValidateMobileNumber(result) {

        }

        addHandlers() {
            let self = this;

            $('#button-user-profile-identity').on('click', (ev) => {
                self.showIdentityNumberFailMessage(false);
            });

            $('#a-user-verify-fail-redirect').on('click', (ev) => {
                self.cb('basic-screening-fail-sign-out', null);
            });

            this.controls['input-user-profile-is-owner'].click((arg, name, value, checked) => {
                //self.model.isOwner = checked;
                self.helpers.setProp(this.model.propertiesJson, 'is-business-owner', checked);
                self.dto2Page.isBusinessOwner();
            });

            this.controls['select-user-profile-owner-capacity'].change((value, text) => {
                self.model.representativeCapacity = value;
                let isBusinessOwner = self.helpers.getProp(this.model.propertiesJson, 'is-business-owner', 'No');
                self.dto2Page.capacity(isBusinessOwner == 'No');
            });

            this.common.validateIdentityNumber(
                'button-user-profile-identity',
                'input-user-profile-first-name',
                'input-user-profile-last-name',
                'input-user-profile-identity',
                'input-user-profile-mobile',
                self.identityControl,
                self.mobileControl,
                self,
                (result) => {
                    self.onValidateIdentityNumber(result);
                }
            );

            this.common.validateMobileNumber(
                'button-user-profile-mobile',
                'input-user-profile-mobile',
                'input-user-profile-identity',
                self.identityControl,
                self.mobileControl,
                self,
                (result) => {
                    self.onValidateMobileNumber(result);
                }
            );
        }

        onValidateFieldIdentity(isValid, value) {
            if (isValid == true) {
                this.identityButton(isValid);
            } else {
                this.identityButton(isValid);
            }
        }

        onValidateFieldMobile(isValid, value) {
            if (isValid == true) {
                this.mobileButton(isValid && this.model.isIdentityOrPassportConfirmed == true);
            } else {
                this.mobileButton(isValid);
            }
        }

        onValidateField(field, isValid, args = null) {
            if (field == 'input-user-profile-identity') {
                this.onValidateFieldIdentity(isValid, args);
            } else if (field == 'input-user-profile-mobile') {
                this.onValidateFieldMobile(isValid, args);
            }
        }
    }

    page.DtoToPage = DtoToPage;

    page.PageToDto = PageToDto;

    page.create = function (id) {
        return new Baseline(id);
    }

    page.Baseline = Baseline;

})(app.wizard.user.page);
