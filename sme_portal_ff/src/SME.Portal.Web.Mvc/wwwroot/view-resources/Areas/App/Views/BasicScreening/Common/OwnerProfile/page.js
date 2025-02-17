"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.owner == undefined) {
    app.wizard.owner = {};
}

if (app.wizard.owner.page == undefined) {
    app.wizard.owner.page = {};
}

(function (page) {

    const MaritalStatus = {
        Married: 'Married',
        Single: 'Single',
        Divorced: 'Divorced',
        Widowed: 'Widowed'
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
            this.controls['input-owner-profile-identity'].val(this.dto.identityOrPassport);
            this.identityControl(this.helpers.validIdentityFormat(this.dto.identityOrPassport));
        }

        mobileNumber() {
            this.controls['input-owner-profile-mobile'].val(this.dto.phoneNumber);
            this.mobileControl(this.helpers.validMobileFormat(this.dto.phoneNumber), this.dto.isIdentityOrPassportConfirmed == false ? 'verify' : '');
        }

        emailAddress() {
            this.controls['input-owner-profile-email'].val(this.dto.emailAddress);
        }

        firstName() {
            this.controls['input-owner-profile-first-name'].val(this.dto.name);
            this.controls['input-owner-profile-first-name'].enable(false);

            let value = this.helpers.getPropEx(this.dto.propertiesJson, 'owner-title', '');
            this.controls['select-left-input-owner-profile-first-name'].val(value);
        }

        lastName() {
            this.controls['input-owner-profile-last-name'].val(this.dto.surname);
            this.controls['input-owner-profile-last-name'].enable(false);
        }

        race() {
            this.controls['select-owner-profile-race'].val(this.dto.race);
        }

        gender() {
            if (this.helpers.isObject(this.dto.verificationRecordJson) == true) {
                let value = this.helpers.getProp(this.dto.verificationRecordJson, 'Gender', '');
                this.controls['input-owner-profile-gender'].val(value);
            } else {
                this.controls['input-owner-profile-gender'].val('');
            }
            this.controls['input-owner-profile-gender'].enable(false);
        }

        maritalStatus() {
            let value = '';
            if (this.helpers.isObject(this.dto.verificationRecordJson) == true) {
                value = this.helpers.getProp(this.dto.verificationRecordJson, 'MaritalStatus', '');
                this.helpers.show('div-owner-profile-marital-status2', value == '' || value == null);
                this.helpers.show('div-owner-profile-marital-status', value != '' && value != null);
                this.controls['input-owner-profile-marital-status'].val(value);
            } else {
                this.controls['input-owner-profile-marital-status'].val('');
            }
            this.controls['input-owner-profile-marital-status'].enable(false);

            this.validation.toggleValidators(['select-owner-profile-marital-status2'], [value == '' || value == null]);
            //this.validation.toggleValidators(['input-owner-profile-marital-status'], [value != '' && value != null]);

            this.marriedInCop(value == MaritalStatus.Married);
        }

        age() {
            if (this.helpers.isObject(this.dto.verificationRecordJson) == true) {
                let value = this.helpers.getProp(this.dto.verificationRecordJson, 'Age', '');
                this.controls['input-owner-profile-age'].val(value);
            } else {
                this.controls['input-owner-profile-age'].val('');
            }
            this.controls['input-owner-profile-age'].enable(false);
        }

        marriedInCop(enable = false) {
            if (enable == false) {
                this.helpers.setProp(this.dto.propertiesJson, 'owner-is-married-in-cop', '');
            }
            this.helpers.show('div-owner-profile-married-in-cop', enable);
            this.validation.toggleValidators(['input-owner-profile-married-in-cop'], [enable]);
            let value = this.helpers.getProp(this.dto.propertiesJson, 'owner-is-married-in-cop', '');
            this.controls['input-owner-profile-married-in-cop'].val(value);

            this.spouseIdentity(value == 'Yes');
        }

        spouseIdentity(enable = false) {
            if (enable == false) {
                this.helpers.setProp(this.dto.propertiesJson, 'owner-spouse-identiy-number', '');
            }
            this.helpers.show('div-owner-profile-spouse-identity', enable);
            this.validation.toggleValidators(['input-owner-profile-spouse-identity'], [enable]);
            let value = this.helpers.getProp(this.dto.propertiesJson, 'owner-spouse-identiy-number', '');
            this.controls['input-owner-profile-spouse-identity'].val(value);
        }

        registeredAddress() {
            let value = this.helpers.getPropEx(this.dto.propertiesJson, 'owner-profile-registered-address', '');
            this.controls['input-owner-profile-registered-address'].val(value);
        }

        apply(dto) {
            this.dto = dto;
            this.identityNumber();
            this.mobileNumber();
            this.emailAddress();
            this.firstName();
            this.lastName();
            this.race();
            this.gender();
            this.maritalStatus();
            this.age();
            this.registeredAddress();
        }
    }

    class PageToDto {
        constructor(self) {
            this.dto = null;
            this.helpers = self.helpers;
            this.controls = self.controls;
        }

        identityNumber() {
            this.dto.identityOrPassport = this.controls['input-owner-profile-identity'].val();
        }

        mobileNumber() {
            this.dto.phoneNumber = this.controls['input-owner-profile-mobile'].val();
        }

        emailAddress() {
            this.dto.emailAddress = this.controls['input-owner-profile-email'].val();
        }

        firstName() {
            this.dto.name = this.controls['input-owner-profile-first-name'].val();
            let value = this.controls['select-left-input-owner-profile-first-name'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'owner-title', value);
        }

        lastName() {
            this.dto.surname = this.controls['input-owner-profile-last-name'].val();
        }

        race() {
            this.dto.race = this.controls['select-owner-profile-race'].val();
        }

        marriedInCop() {
            let value = this.controls['input-owner-profile-married-in-cop'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'owner-is-married-in-cop', value);
        }

        spouseIdentity() {
            let value = this.controls['input-owner-profile-spouse-identity'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'owner-spouse-identiy-number', value);
        }

        registeredAddress() {
            let value = this.controls['input-owner-profile-registered-address'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'owner-profile-registered-address', value);
        }

        maritalStatus() {
            if (this.dto.verificationRecordJson['MaritalStatus'] == '' || this.dto.verificationRecordJson['MaritalStatus'] == null) {
                let value = this.controls['select-owner-profile-marital-status2'].val();
                this.dto.verificationRecordJson['MaritalStatus'] = (value == '' || value == null) ? '' : this.controls['select-owner-profile-marital-status2'].text();
            }
        }

        apply(dto) {
            this.dto = dto;
            this.identityNumber();
            this.mobileNumber();
            this.emailAddress();
            this.firstName();
            this.lastName();
            this.race();
            this.marriedInCop();
            this.spouseIdentity();
            this.registeredAddress();
            this.maritalStatus();
        }
    }


    class Baseline extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Owner Profile Page';
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

        defaultDto() {
            this.reset();
            this.model.userId = -1;
            this.model.id = null;
        }

        reset() {
            this.model['name'] = '';
            this.model['surname'] = '';
            this.model['emailAddress'] = '';
            this.model['phoneNumber'] = '';
            this.model['isPhoneNumberConfirmed'] = false;
            this.model['identityOrPassport'] = '';
            this.model['isIdentityOrPassportConfirmed'] = false;
            this.model['race'] = '';
            this.model['verificationRecordJson'] = null;
            this.model['propertiesJson'] =  {};
        }

        load(args, cb) {
            let self = this;
            this.model = args;
            app.wizard.service.loadOwnerProfile((result) => {
                if (result.status != app.wizard.Result.Success) {
                    self.defaultDto();
                } else {
                    self.model = result.data;
                }
                // TODO: Sort this mess out!!!
                if (self.helpers.isObject(self.model['propertiesJson']) == true) {

                } else if (self.model['propertiesJson'] == null || self.model['propertiesJson'] == '') {
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
                if (result.status == app.wizard.Result.Success) {
                    self.dtoToPage(self.model);
                }

                cb(result);
            });
        }

        getDto() {
            return this.pageToDto(null);
        }

        canSave() {
            return (this.model.id != null);
        }

        save(cb) {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: 'Processing...'
            });
            let self = this;
            let dto = this.getDto();
            dto.propertiesJson = JSON.stringify(dto.propertiesJson);
            dto.verificationRecordJson = JSON.stringify(dto.verificationRecordJson);
            app.wizard.service.saveOwnerProfile(dto, (result) => {
                KTApp.unblockPage();
                self.model.id = result.data;
                cb(app.wizard.addResult());
            });
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
            cb(app.wizard.addResult());
        }

        // TODO : User and owner have same function logic. Parametise!!!
        addFirstName() {
            let control = this.addControl('input-owner-profile-first-name', 'input');
            control = this.addControl('select-left-input-owner-profile-first-name', 'select');
            let titles = this.listItems.getTitles();
            if (titles.length == 0) {
                titles = [
                    { value: '622605ca67e3cc13cf216096', text: 'Mr.' },
                    { value: '622605ca67e3cc13cf216097', text: 'Mrs.' },
                    { value: '622605ca67e3cc13cf216098', text: 'MS.' },
                    { value: '622605ca67e3cc13cf216099', text: 'Prof.' },
                    { value: '622605ca67e3cc13cf21609a', text: 'Dr.' },
                    { value: '622605ca67e3cc13cf21609b', text: 'Sir' },
                    { value: '622605ca67e3cc13cf21609c', text: 'Madam' },
                    { value: '622605ca67e3cc13cf21609d', text: 'Cllr' },
                    { value: '622605ca67e3cc13cf21609e', text: 'Lord' },
                    { value: '622605ca67e3cc13cf21609f', text: 'Lady' },
                    { value: '622609bd567e92380c27c3b3', text: 'General' },
                    { value: '622609bd567e92380c27c3b4', text: 'Captain' },
                    { value: '622609bd567e92380c27c3b5', text: 'Hon.' },
                    { value: '62260d59c3ac73094c399c45', text: 'Rev.' }
                ];
            }
            control.fill(titles);
        }

        addControls() {
            let self = this;
            self.identityButton = this.common.getIdentityButtonFunc('button-owner-profile-identity', 'span-owner-profile-identity', this);
            self.identityControl = this.common.getIdentityControlFunc('button-owner-profile-identity', 'span-owner-profile-identity', 'input-owner-profile-identity', this);

            self.mobileButton = this.common.getMobileButtonFunc('button-owner-profile-mobile', 'span-owner-profile-mobile', this);
            self.mobileControl = this.common.getMobileControlFunc('button-owner-profile-mobile', 'span-owner-profile-mobile', 'input-owner-profile-mobile', this);

            this.dto2Page = this.createDtoToPage();// new DtoToPage(this);
            this.page2Dto = this.createPageToDto();// new PageToDto(this);

            let control = null;
            control = this.addControl('input-owner-profile-identity', 'input');
            control.format(13);

            control = this.addControl('input-owner-profile-mobile', 'input');
            control.format(10);

            control = this.addControl('input-owner-profile-email', 'input');

            this.addFirstName();

            control = this.addControl('input-owner-profile-last-name', 'input');

            control = this.addControl('input-owner-profile-gender', 'input');
            control = this.addControl('input-owner-profile-marital-status', 'input');
            control = this.addControl('select-owner-profile-marital-status2', 'select');
            control.fill([
                {value:0, text:'Married'},
                {value:1, text:'Single'},
                {value:2, text:'Divorced'},
                {value:3, text:'Widowed'}
            ]);

            control = this.addControl('input-owner-profile-age', 'input');

            control = this.addControl('select-owner-profile-race', 'select');
            control.fill(this.listItems.getRace());

            control = this.addControl('input-owner-profile-married-in-cop', 'radio');

            control = this.addControl('input-owner-profile-spouse-identity', 'input');

            control = this.addControl('input-owner-profile-registered-address', 'input');

        }

        onValidateIdentityNumberSuccess() {

        }

        showIdentityNumberFailMessage(show) {
            if (show == true) {
                $('#id-owner-basic-screening-fail-alert').show('fast');
            } else {
                $('#id-owner-basic-screening-fail-alert').hide('fast');
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
                this.onValidateIdentityNumberSuccess();
            } else {
                this.onValidateIdentityNumberFail(result);
            }
        }

        onValidateMobileNumber(result) {
            if (result.status == app.wizard.Result.Success) {
                if (this.model.verificationRecordJson['MaritalStatus'] == '' || this.model.verificationRecordJson['MaritalStatus'] == null) {
                    this.controls['select-owner-profile-marital-status2'].val('');
                }
                this.model = this.pageToDto(null);
                this.model.name = this.helpers.getProp(this.model.verificationRecordJson, 'FirstName', '');
                this.model.surname = this.helpers.getProp(this.model.verificationRecordJson, 'Surname', '');
                this.dtoToPage(this.model);
                this.common.populateTitle(this.model.verificationRecordJson, this.controls['select-left-input-owner-profile-first-name']);
            }
        }

        addHandlers() {
            let self = this;

            $('#button-owner-profile-identity').on('click', (ev) => {
                self.showIdentityNumberFailMessage(false);
            });

            $('#a-owner-verify-fail-redirect').on('click', (ev) => {
                self.cb('basic-screening-fail-sign-out', null);
            });



            this.common.validateIdentityNumber(
                'button-owner-profile-identity',
                'input-owner-profile-first-name',
                'input-owner-profile-last-name',
                'input-owner-profile-identity',
                'input-owner-profile-mobile',
                self.identityControl,
                self.mobileControl,
                self,
                (result) => {
                    self.onValidateIdentityNumber(result);
                }
            );

            this.common.validateMobileNumber(
                'button-owner-profile-mobile',
                'input-owner-profile-mobile',
                'input-owner-profile-identity',
                self.identityControl,
                self.mobileControl,
                self,
                (result) => {
                    self.onValidateMobileNumber(result);
                }
            );

            this.controls['input-owner-profile-married-in-cop'].click((arg, name, value, checked) => {
                self.helpers.setProp(this.model.propertiesJson, 'owner-is-married-in-cop', checked);
                let status = self.helpers.getProp(self.model.verificationRecordJson, 'MaritalStatus', '');
                self.dto2Page.marriedInCop(status == MaritalStatus.Married);
            });

            this.controls['select-owner-profile-marital-status2'].change((value, text) => {
                self.model.verificationRecordJson['MaritalStatus'] = text;
                self.dto2Page.marriedInCop(value == '0');
            });
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
            if (field == 'input-owner-profile-identity') {
                this.onValidateFieldIdentity(isValid, args);
            } else if (field == 'input-owner-profile-mobile') {
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

})(app.wizard.owner.page);
