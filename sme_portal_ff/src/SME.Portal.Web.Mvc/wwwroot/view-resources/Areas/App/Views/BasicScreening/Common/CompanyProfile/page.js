"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.business == undefined) {
    app.wizard.business = {};
}

if (app.wizard.business.page == undefined) {
    app.wizard.business.page = {};
}

(function (page) {

    const IN_BUSINESS = '03';
    //const IN_BUSINESS = 'In Business';

    const REGISTERED_LISTED = 'RegisteredListed';
    // Sole Proprietor, Partnership.
    const NOT_REGISTERED = 'NotRegistered';
    const REGISTERED_NOT_LISTED = 'RegisteredNotListed';

    const NOT_REGISTERED_TEXT = 'Business not registered';
    const REGISTERED_NOT_LISTED_TEXT = 'Business registered with CIPC, not listed above';

    const SOLE_PROPRITETOR = '5a6ab7ce506ea818e04548ad';
    const PARTNERSHIP = '5a6ab7d3506ea818e04548b0';

    const companyTypes = {
        REGISTERED_LISTED : [],
        NOT_REGISTERED : [],
        REGISTERED_NOT_LISTED : []
    };

    class DtoToPage {
        constructor(self) {
            this.self = self;
            this.dto = null;
            this.helpers = self.helpers;
            this.controls = self.controls;
            this.validation = self.validation;
            this.company = null;
        }

        set(name, prop, show, fn = []) {
            if (show == false) {
                this.helpers.setPropEx(this.dto.propertiesJson, prop, '');
            }
            this.validation.toggleValidators([name], [show]);
            let value = this.helpers.getPropEx(this.dto.propertiesJson, prop, '');
            fn.forEach((f, i) => {
                value = f(value);
            });
            this.controls[name].val(value);
            return value;
        }

        franchiseAquisition_fundingToBuyAnExistingBusiness_industry(enable = true) {
            if (enable == true) {

                setTimeout(() => {
                    let value = this.helpers.getPropEx(this.dto.propertiesJson, 'select-sic-sub-class', '');
                    if (value == '') {
                        value = this.helpers.getPropEx(this.dto.propertiesJson['industry'], 'Guid', '');
                    }
                    let result = app.wizard.isb.findFromId(value, 5);
                    if (result != null) {
                        app.wizard.isb.refresh(value);

                        $('#p-industry-sector-summary').text(result[4].id);
                        $("#li-industry-section").text('Section: ' + result[1].desc);
                        $("#li-industry-division").text('Division: ' + result[2].desc);
                        $("#li-industry-group").text('Group: ' + result[3].desc);
                        $("#li-industry-class").text('Class: ' + result[4].desc);
                        $("#li-industry-sub-class").text('Subclass: ' + result[5].desc);

                        $('#div-industry-info').show('fast');
                    } else {
                        //app.wizard.isb.reset();
                        $('#div-industry-info').hide('fast');
                    }
                }, 1);

            } else {
                this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-section', '');
                this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-division', '');
                this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-group', '');
                this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-class', '');
                this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-sub-class', '');
            }
        }

        registration() {
            //this.controls['input-company-profile-name'].val(this.dto.name);
            //this.controls['input-company-profile-name'].enable(true);
        }

        name() {
            this.controls['input-company-profile-name'].val(this.dto.name);
            if (this.self.company != null) {
                if (this.self.company.summary.key == NOT_REGISTERED ||
                    this.self.company.summary.key == REGISTERED_NOT_LISTED) {
                    this.controls['input-company-profile-name'].enable(true);
                } else {
                    this.controls['input-company-profile-name'].enable(false);
                }
            }
        }

        type() {
            let type = 
                (this.dto.type != SOLE_PROPRITETOR &&
                 this.dto.type != PARTNERSHIP &&
                 this.self.company != null &&
                 this.self.company.summary.key == NOT_REGISTERED)
                    ? '' :
                    this.dto.type;

            this.controls['select-company-profile-type'].val(type);

            if (this.self.company != null) {
                if (this.self.company.summary.key == NOT_REGISTERED ||
                    this.self.company.summary.key == REGISTERED_NOT_LISTED) {
                    this.controls['select-company-profile-type'].enable(true);
                } else {
                    this.controls['select-company-profile-type'].enable(false);
                }
            }
        }

        registrationNumber() {
            this.controls['input-company-profile-registration-number'].val(this.dto.registrationNumber);
            if (this.self.company != null) {
                if (this.self.company.summary.key == REGISTERED_NOT_LISTED) {
                    this.controls['input-company-profile-registration-number'].enable(true);
                } else {
                    this.controls['input-company-profile-registration-number'].enable(false);
                }
            }
        }

        registrationDate() {
            this.controls['date-company-profile-registration-date'].set(this.dto.registrationDate, [this.helpers.formatDate]);
            if (this.self.company != null) {
                if (this.self.company.summary.key == REGISTERED_NOT_LISTED) {
                    this.controls['date-company-profile-registration-date'].enable(true);
                } else {
                    this.controls['date-company-profile-registration-date'].enable(false);
                }
            }
        }

        vatRegistrationNumber() {
            let value = this.helpers.getProp(this.dto.propertiesJson, 'vatRegistrationNumber', '');
            this.controls['input-company-profile-vat-registration-number'].val(value);
            this.controls['input-company-profile-vat-registration-number'].enable(true);
        }

        taxReferenceNumber() {
            let value = this.helpers.getProp(this.dto.propertiesJson, 'taxReferenceNumber', '');
            this.controls['input-company-profile-tax-reference-number'].val(value);
            this.controls['input-company-profile-tax-reference-number'].enable(true);
        }

        registeredForUIF() {
            let value = this.helpers.getPropEx(this.dto.propertiesJson, 'registered-for-uif', '');
            this.controls['input-registered-for-uif'].val(value);
            this.controls['input-registered-for-uif'].enable(true);
            this.uifNumber(value == 'Yes');
        }

        uifNumber(show) {
            let value = this.helpers.getPropEx(this.dto.propertiesJson, 'uif-number', '');

            this.set('input-uif-number', 'uif-number', show, [(value) => { return value.toString().replace(/\//g, ''); }]);
            this.controls['input-uif-number'].enable(true);
            this.helpers.show('div-uif-number', show);
        }

        address() {
            let self = this;

            function removeUndefined(arr) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (arr[i] == 'undefined') {
                        arr.splice(i, 1);
                    }
                }
            }

            function getLine1(arr) {
                let line1 = '';
                let max = Math.floor(arr.length / 2);
                for (let i = 0; i < max; i++) {
                    if (arr[i] != 'undefined') {
                        line1 += arr[i];
                        if (i < (max - 1)) {
                            line1 += ',';
                        }
                    }
                }
                return line1;
            }

            function getLine2(arr) {
                let line2 = '';
                let min = Math.floor(arr.length / 2);
                for (let i = min; i < arr.length; i++) {
                    if (arr[i] != 'undefined') {
                        line2 += arr[i];
                        if (i < (arr.length - 1)) {
                            line2 += ',';
                        }
                    }
                }
                return line2;
            }

            function getAddr(line1, line2) {
                let addr = line1;
                if (line2 != '') {
                    addr += (',' + line2);
                }
                return addr;
            }

            function getCity(arr1, arr2) {
                return arr2.length > 0 ? arr2[0] : arr1[arr1.length - 1];
            }

            function getPostalCode(arr) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    let code = parseInt(arr[i]);
                    if (isNaN(code) == false) {
                        return code;
                    }
                }
                return null;
            }

            function getAddr6(arr) {
                $('#input-company-profile-registered-address').val(self.dto.registeredAddress);
                $('#input-company-profile-address-line2').val(arr[3] + ',' + arr[4] + ',' + arr[5]);
                $('#input-company-profile-address-line1').val(arr[0] + ',' + arr[1] + ',' + arr[2]);
                $('#input-company-profile-city').val(arr[2]);
                $('#input-company-profile-postal-code').val(arr[4]);
                let province = app.common.gmap.areaCodeToProvince(arr[4]);
                if (province != null) {
                    $('#select-company-profile-province').val(province.key);
                }
            }

            function getAddrN(arr) {
                removeUndefined(arr);
                let m = Math.floor(arr.length / 2);
                let line1 = getLine1(arr);
                let line2 = getLine2(arr);
                let addr = getAddr(line1, line2);
                $('#input-company-profile-registered-address').val(addr);
                $('#input-company-profile-address-line1').val(line1);
                $('#input-company-profile-address-line2').val(line2);
                let city = getCity(line1.split(','), line2.split(','));
                $('#input-company-profile-city').val(city);
                let code = getPostalCode(arr);
                $('#input-company-profile-postal-code').val(code == null ? '' : code);
                if (code != null) {
                    let province = app.common.gmap.areaCodeToProvince(code);
                    if (province != null) {
                        $('#select-company-profile-province').val(province.key);
                    }
                }
            }

            if (this.dto.registeredAddress == null || this.dto.registeredAddress == '' || this.dto.registeredAddress == 'null') {
                this.dto.registeredAddress = '';
            } else {
                let arr = this.dto.registeredAddress.split(',');
                if (arr.length == 6) {
                    getAddr6(arr);
                } else {
                    getAddrN(arr);
                }
            }

            this.controls['input-company-profile-registered-address'].enable(true);
            this.controls['input-company-profile-address-line1'].enable(true);
            this.controls['input-company-profile-address-line2'].enable(true);
            this.controls['input-company-profile-city'].enable(true);
            this.controls['input-company-profile-postal-code'].enable(true);

            this.self.toggleProvinceSelect(true);
        }

        apply(dto) {
            this.dto = dto;
            this.registration();
            this.name();
            this.type();
            this.registrationNumber();
            this.registrationDate();
            this.vatRegistrationNumber();
            this.taxReferenceNumber();
            this.registeredForUIF();
            this.address();
            this.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
        }
    }

    class PageToDto {
        constructor(self) {
            //this.sic = self.sic;
            this.self = self;
            this.dto = null;
            this.helpers = self.helpers;
            this.controls = self.controls;
            this.company = null;
        }

        franchiseAquisition_fundingToBuyAnExistingBusiness_industry(enable = true) {
            this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-section', this.controls['select-sic-section'].val());
            this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-division', this.controls['select-sic-division'].val());
            this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-group', this.controls['select-sic-group'].val());
            this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-class', this.controls['select-sic-class'].val());
            this.helpers.setPropEx(this.dto.propertiesJson, 'select-sic-sub-class', this.controls['select-sic-sub-class'].val());
        }

        name() {
            this.dto.name = this.controls['input-company-profile-name'].val();
        }

        type() {
            this.dto.type = this.controls['select-company-profile-type'].val();
        }

        registrationNumber() {
            this.dto.registrationNumber = this.controls['input-company-profile-registration-number'].val();
        }

        registrationDate() {
            this.dto.registrationDate = this.controls['date-company-profile-registration-date'].get([]);
        }

        startedTradingDate() {
            this.dto.startedTradingDate = '01/01/2000';
        }

        vatRegistrationNumber() {
            let value = this.controls['input-company-profile-vat-registration-number'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'vatRegistrationNumber', value);
        }

        taxReferenceNumber() {
            let value = this.controls['input-company-profile-tax-reference-number'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'taxReferenceNumber', value);
        }

        registeredForUIF() {
            let value = this.controls['input-registered-for-uif'].val();
            this.helpers.setProp(this.dto.propertiesJson, 'registered-for-uif', value);
        }

        uifNumber() {
            let value = this.controls['input-uif-number'].val();
            value = value.toString().replace(/\//g, '');
            this.helpers.setPropEx(this.dto.propertiesJson, 'uif-number', value);
        }

        address() {
            let self = this;

            function getLine2(arr) {
                let line2 = '';
                for (let i = 0, max = arr.length; i < max; i++) {
                    line2 += arr[i];
                    if (i < (max - 1)) {
                        line2 += ',';
                    }
                }
                return line2;
            }

            function appendItem(address, name, separator) {
                let value = self.controls[name].val();
                return value == null ? address : address + (value + separator);
            }
            this.dto.registeredAddress = '';
            let arr = $('#input-company-profile-address-line2').val().split(',');
            arr[1] = $('#input-company-profile-postal-code').val();
            let line2 = arr.length < 3 ? getLine2(arr) : (arr[0] + ',' + arr[1] + ',' + arr[2]);
            $('#input-company-profile-address-line2').val(line2);
            this.dto.registeredAddress = 
                $('#input-company-profile-address-line1').val() +
                ',' +
                $('#input-company-profile-address-line2').val();
        }

        industry() {
            let self = this;
            function push(name, value) {
                self.helpers.setPropEx(self.dto.propertiesJson, name, value);
            }

            self.dto.propertiesJson['industry'] = {};

            let value = '';
            value = this.controls['select-sic-section'].val();
            push('select-sic-section', value);

            value = this.controls['select-sic-division'].val();
            push('select-sic-division', value);

            value = this.controls['select-sic-group'].val();
            push('select-sic-group', value);

            value = this.controls['select-sic-class'].val();
            push('select-sic-class', value);

            value = this.controls['select-sic-sub-class'].val();
            push('select-sic-sub-class', value);

            let result = app.wizard.isb.findFromId(value, 5);
            if (result != null) {
                let id = parseInt(result[4].id);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'SectionId', result[1].id);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'Section', result[1].desc);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'DivisionId', result[2].id);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'Division', result[2].desc);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'GroupId', result[3].id);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'Group', result[3].desc);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'Class', (id / 10));
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'Subclass', result[4].id);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'Description', result[4].desc);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'Label', result[5].desc);
                self.helpers.setPropEx(self.dto.propertiesJson['industry'], 'Guid', result[5].id);
            }

            this.dto.industries = value;
        }

        apply(dto) {
            this.dto = dto;
            this.name();
            this.type();
            this.registrationNumber();
            this.registrationDate();
            this.startedTradingDate();
            this.vatRegistrationNumber();
            this.taxReferenceNumber();
            this.registeredForUIF();
            this.uifNumber();
            this.address();
            this.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            this.industry();
        }
    }

    class Baseline extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Business Profile Page';
            this.identityNumber = null;
            this.companies = [];
            this.dto2Page = null;
            this.page2Dto = null;
            this.company = null;
            this.mustSave = false;
            this.ownerId = null;
            this.companyId = null;
            this.industryHelp = false;
        }

        enable(toggle) {
            this.controls['input-company-profile-name'].enable(toggle);
            this.controls['select-company-profile-type'].enable(toggle);
            this.controls['input-company-profile-registration-number'].enable(toggle);
            this.controls['date-company-profile-registration-date'].enable(toggle);

            this.controls['input-company-profile-vat-registration-number'].enable(toggle);
            this.controls['input-company-profile-tax-reference-number'].enable(toggle);

            this.controls['input-registered-for-uif'].enable(toggle);

            this.controls['input-company-profile-registered-address'].enable(toggle);
            this.controls['input-company-profile-address-line1'].enable(toggle);
            this.controls['input-company-profile-address-line2'].enable(toggle);
            this.controls['input-company-profile-city'].enable(toggle);
            this.controls['input-company-profile-postal-code'].enable(toggle);

            this.toggleProvinceSelect(toggle);
        }

        clear() {
            this.controls['input-company-profile-name'].val('');
            this.controls['select-company-profile-type'].val('');
            this.controls['input-company-profile-registration-number'].val('');
            this.controls['date-company-profile-registration-date'].clear();

            this.controls['input-company-profile-vat-registration-number'].val('');
            this.controls['input-company-profile-tax-reference-number'].val('');

            this.controls['input-registered-for-uif'].val('');

            this.controls['input-company-profile-registered-address'].val('');
            this.controls['input-company-profile-address-line1'].val('');
            this.controls['input-company-profile-address-line2'].val('');
            this.controls['input-company-profile-city'].val('');
            this.controls['input-company-profile-postal-code'].val('');
            this.controls['select-company-profile-province'].val('');
        }

        validate(data, cb) {
            let self = this;
            super.validate(data, (result) => {
                let companyType = self.controls['select-company-profile-registered'].val();
                if (companyType == REGISTERED_NOT_LISTED) {
                    let registrationNumber = self.controls['input-company-profile-registration-number'].val();
                    let id = self.company.dto.id;
                    app.wizard.service.doesBusinessExist(id, registrationNumber, (result) => {
                        for (let i = 0, max = self.ownerCompanies.length; i < max; i++) {
                            if (self.ownerCompanies[i].registrationNumber == registrationNumber) {
                                result.status = app.wizard.Result.Fail;
                                break;
                            }
                        }
                        if (result.status == app.wizard.Result.Fail) {
                            result.data = {
                                'plugin': app.wizard.controller.Pages.CompanyProfile
                            };
                            result.message = 'Please contact our support team regarding the business registration number you have entered <br/><b>087-500-9950</b>.';
                            cb(result);
                        } else {
                            cb(result);
                        }
                        KTApp.unblockPage();
                    });
                } else {
                    cb(result);
                }
            });
        }

        formValidationError(result, cb) {
            this.duplicateBusinessMessage(result, (result) => {
                cb(result);
            });
        }

        dtoToPage(dto) {
            this.enable(false);
            this.clear();
            this.dto2Page.apply(dto);
        }

        pageToDto(dto) {
            this.page2Dto.apply(dto);
        }

        buildDto(company) {
            let dto = {};
            if (company.dto != null) {
                return company.dto;
            }
            if (company.summary.key == NOT_REGISTERED ||
                company.summary.key == REGISTERED_NOT_LISTED) {
                dto = this.reset();
                dto.name = company.summary.companyName;
                dto.propertiesJson = {
                    companyCipcStatus: company.summary.key
                };
            } else {
                dto = this.reset();
                dto.name = company.summary.companyName;
                dto.registrationNumber = company.summary.registrationNumber;
                dto.registrationDate = company.verificationRecord.registrationDate;
                dto.startedTradingDate = dto.registrationDate;
                let guid = smec.keyFromCompanyAlias(company.summary.companyType, company.verificationRecord.companyTypeCode);
                dto.type = guid;
                dto.verificationRecordJson = company.verificationRecord;
                dto.propertiesJson = {
                    companyCipcStatus: 'RegisteredListed',
                    taxReferenceNumber: company.verificationRecord.taxNumber,
                    vatRegistrationNumber: ''
                };

                let components = {
                    number: company.verificationRecord.addressLine1,
                    street: company.verificationRecord.addressLine2,
                    town: company.verificationRecord.city,
                    province: company.verificationRecord.province,
                    code: company.verificationRecord.areaCode,
                    country: 'South Africa'
                };
                let province = app.common.gmap.areaCodeToProvince(components.code);
                if (province != null) {
                    components.province = province.key;
                } else if (components.province == 'KZN') {
                    components.province = 'KZ';
                }
                $('#input-company-profile-address-line1').val(components.number + ',' + components.street + ',' + components.town);
                $('#input-company-profile-address-line2').val(components.country + ',' + components.code + ',' + components.province);
                $('#input-company-profile-city').val(components.town);
                $('#input-company-profile-postal-code').val(components.code);
                dto.registeredAddress =
                    $('#input-company-profile-address-line1').val() +
                    ',' +
                    $('#input-company-profile-address-line2').val();

            }
            return dto;
        }

        reset() {
            let temp = {};
            // Required.
            temp.name = 'null';
            temp.registrationNumber = '';
            temp.type = '';
            temp.registrationDate = '';
            temp.startedTradingDate = '';
            // Required.
            temp.registeredAddress = 'null';
            temp.verificationRecordJson = '';
            // Required.
            temp.beeLevel = 'null'
            // Required.
            temp.customers = 'null';
            // Required.
            temp.industries = 'null';
            temp.webSite = 'null';
            // Required.
            temp.propertiesJson = {
                'page-status' : 'reset'
            };
            return temp;
        }

        onAddressChange(components) {
            let self = this;
            let province = app.common.gmap.areaCodeToProvince(components['code']);
            if (province != null && province != '') {
                self.controls['select-company-profile-province'].val(province.key);
            } else if (components['province'] != '') {
                self.controls['select-company-profile-province'].val(components['province']);
            } else {
                self.controls['select-company-profile-province'].val('');
            }
        }

        load(args, cb) {
            let self = this;
            this.model = args;

            function addressComplete(addressComponents) {
                if (addressComponents['province'] == 'GP') {
                    addressComponents['province'] = 'GT';
                }

                self.validation.resetFields([
                    'input-company-profile-registered-address',
                    'input-company-profile-address-line1',
                    'input-company-profile-city',
                    'input-company-profile-postal-code',
                    'select-company-profile-province'
                ]);

                self.onAddressChange(addressComponents);
            }

            setFillInAddrComplete(addressComplete);

            this.enable(false);

            function onLoadResult(result) {
                if (result.status == app.wizard.Result.Success) {
                    self.companyId = result.data.id;
                    if (result.code == 0) {
                        let cipcType = result.data.propertiesJson['companyCipcStatus'];
                        let key = null;
                        let value = null;
                        if (cipcType == REGISTERED_LISTED) {
                            key = result.data.registrationNumber;
                            //key = result.data.name;
                            value = result.data.name;
                        } else if (cipcType == NOT_REGISTERED) {
                            key = NOT_REGISTERED;

                            value = NOT_REGISTERED_TEXT;

                            value = 'Business not registered';

                        } else if (cipcType == REGISTERED_NOT_LISTED) {
                            key = REGISTERED_NOT_LISTED;

                            value = REGISTERED_NOT_LISTED_TEXT;

                            value = 'Business registered with CIPC, not listed above';

                        }
                        self.company = {
                            summary: {
                                companyName: '',
                                companyType: '',
                                status: result.data.verificationRecordJson != null ? result.data.verificationRecordJson.status : '',
                                registrationNumber: result.data.registrationNumber,
                                'key': key,
                                'value': value
                            },
                            dto: result.data
                        };
                    }
                }
            }

            // Normal mode only. ie: Onboarding has not been completed.
            if (self.model.mode == 0) {
                app.wizard.service.loadCompanyProfileForUser((result) => {
                    onLoadResult(result);
                    cb(result);
                });
            } else if (self.model.mode == 1) {
                cb(app.wizard.addResult());
            } else if (self.model.mode == 2) {
                self.companyId = self.model.companyId;
                app.wizard.service.loadCompanyProfile(self.model.companyId, (result) => {
                    onLoadResult(result);
                    cb(result);
                });
            }
        }

        getDto() {
            let self = this;
            this.pageToDto(this.company.dto);
            let dto = JSON.stringify(this.company.dto);
            return JSON.parse(dto);
        }

        canSave() {
            return (this.companyId != null);
        }

        __save__(dto, cb) {
            let self = this;
            dto.ownerId = this.ownerId;
            if (dto.verificationRecordJson == '' || dto.verificationRecordJson == null) {
                dto.verificationRecordJson = null;
            } else {
                dto.verificationRecordJson = JSON.stringify(dto.verificationRecordJson);
            }
            if (this.companyId != null) {
                dto.id = this.companyId;
            }
            if (dto.propertiesJson == '' || dto.propertiesJson == null) {
                dto.propertiesJson = null;
            } else {
                if (this.company.summary.key == NOT_REGISTERED) {
                    dto.propertiesJson['companyCipcStatus'] = this.company.summary.key;
                } else if (this.company.summary.key == REGISTERED_NOT_LISTED) {
                    dto.propertiesJson['companyCipcStatus'] = this.company.summary.key;
                } else {
                    dto.propertiesJson['companyCipcStatus'] = REGISTERED_LISTED;
                }
                dto.propertiesJson['matchCriteriaJson'] = [];
                dto.propertiesJson['province-code'] = self.controls['select-company-profile-province'].val();

                dto.propertiesJson = JSON.stringify(dto.propertiesJson);
            }

            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: 'Processing...'
            });
            app.wizard.service.saveCompanyProfile(dto, (result) => {
                KTApp.unblockPage();
                if (result.status == app.wizard.Result.Success) {
                    self.companyId = result.data;
                }
                cb(result);
            });
        }

        save(cb) {
            let dto = this.getDto();
            dto.propertiesJson['page-status'] = 'saved';
            this.__save__(dto, cb);
        }

        addCustomCompanies(data) {
            function addCustom(key, value) {
                data.push({
                    companyName: '',
                    companyType: '',
                    status: IN_BUSINESS,
                    registrationNumber: '',
                    'key': key,
                    'value': value
                });
            }
            addCustom(NOT_REGISTERED, NOT_REGISTERED_TEXT);
            addCustom(REGISTERED_NOT_LISTED, REGISTERED_NOT_LISTED_TEXT);
        }

        attentionHidden(args, cb) {
            let self = this;

            function next(args, cb) {

                function filterAddCompany(companies, cb) {
                    let temp = [];
                    app.wizard.service.getUserCompanies((result) => {
                        companies.forEach((company, index) => {
                            if (company.key != NOT_REGISTERED &&
                                company.key != REGISTERED_NOT_LISTED) {
                                let found = null;
                                found = result.data.find((item) => {
                                    return item.name == company.key;
                                });
                                if (found == null) {
                                    temp.push(company);
                                }
                            } else {
                                temp.push(company);
                            }
                        });
                        result.data = temp;
                        cb(result)
                    });
                }

                function validateEditCompany(cb) {
                    // TODO: What about REGISTERED_NOT_LISTED???
                    //if (self.company.summary.key == NOT_REGISTERED &&
                    //    self.company.dto.type != '5a6ab7ce506ea818e04548ad' &&
                    //    self.company.dto.type != '5a6ab7d3506ea818e04548b0') {
                    //    Swal.fire({
                    //        icon: 'info',
                    //        html: 'Not registered must have company type of Sole Proprietor or Partnership',
                    //        focusConfirm: false,
                    //        confirmButtonText:
                    //            '<i class="fa fa-thumbs-up"></i> Great!',
                    //        confirmButtonAriaLabel: 'Thumbs up, great!'
                    //    }).then(() => {
                    //    });
                    //    cb(app.wizard.addResult());
                    //} else {
                        cb(app.wizard.addResult());
                    //}
                }

                function filterEditCompany() {
                    return [self.company.summary];
                }

                function addCompanies(data, cb) {
                    let arr = [];
                    data.forEach((item, index) => {
                        function setCipcStatus(item) {
                            if (item.status != IN_BUSINESS &&
                                item.key != NOT_REGISTERED &&
                                item.key != REGISTERED_NOT_LISTED) {
                                return item.value + ' - (' + item.status + ')';
                            } else {
                                return item.value;
                            }
                        }
                        arr.push({
                            value: item.key,
                            text: setCipcStatus(item),
                            status : item.status,
                            disabled:
                                item.status != IN_BUSINESS &&
                                item.key != NOT_REGISTERED &&
                                item.key != REGISTERED_NOT_LISTED
                        });
                        let company = {
                            summary: item,
                            dto: null,
                            verificationRecord: null
                        };
                        if (self.company != null && self.company.summary.key == item.key) {
                            company.dto = self.company.dto;
                        }
                        self.companies.push(company);
                    });

                    let arr1 = [];
                    let arr2 = [];
                    arr.forEach((o, i) => {
                        if (o.disabled == false) {
                            arr1.push(o);
                        } else {
                            arr2.push(o);
                        }
                    });
                    arr = arr1.concat(arr2);

                    self.controls['select-company-profile-registered'].flush();
                    self.controls['select-company-profile-registered'].fill(arr, (elem, item) => {
                        if (item.disabled == true) {
                            elem.setAttribute('disabled', 'true');
                            elem.style.backgroundColor = '#F5F5F5';
                        } else {
                            elem.style.color = 'blue';
                        }
                    });
                    if (self.company != null) {
                        self.controls['select-company-profile-registered'].val(self.company.summary.key);
                        self.onCompanySelect(self.company.summary.key);
                    } else {
                        self.controls['select-company-profile-registered'].val('');
                    }

                    cb(app.wizard.addResult());
                }

                let result = app.wizard.addResult();
                let identityUpdate = self.identityNumber != args.user.identityNumber;
                if (identityUpdate == true && self.helpers.validIdentityFormat(args.user.identityNumber) == true) {
                    self.companies = [];
                    self.identityNumber = args.user.identityNumber;

                    KTApp.blockPage({
                        overlayColor: 'blue',
                        opacity: 0.1,
                        state: 'primary',
                        message: 'Finding owner companies'
                    });

                    self.ownerCompanies = null;
                    app.wizard.service.getOwnerCompanies(self.identityNumber, (result) => {
                        self.ownerCompanies = result.data;
                        self.addCustomCompanies(result.data);

                        KTApp.unblockPage();
                        let data = result.data;
                        if (self.model.mode == 1) {
                            filterAddCompany(data, (result) => {
                                addCompanies(result.data, cb);
                            });
                        } else if (self.model.mode == 2) {
                            data = filterEditCompany();
                            addCompanies(data, (result) => {
                                validateEditCompany(cb);
                            });
                        } else {
                            addCompanies(data, cb);
                        }
                    });
                } else {
                    cb(result);
                }
            }
            this.ownerId = args.user.ownerId;

            if (args.isNext == true) {
                next(args, (result) => {
                    cb(app.wizard.addResult());
                });
            } else {
                cb(app.wizard.addResult());
            }

            if (self.model.mode != 0) {
                $('#button-wizard-prev').hide();
            }
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

        //validate(args, cb) {
            //cb(app.wizard.addResult());
        //}

        toggleProvinceSelect(toggle) {
            //this.controls['select-company-profile-province'].enable(toggle);
            this.controls['select-company-profile-province'].enable(false);
        }

        addControls() {
            let control = null;
            control = this.addControl('select-company-profile-registered', 'select');
            //$('#select-company-profile-registered:selected').css('color', 'blue');

            control = this.addControl('input-company-profile-name', 'input');
            control = this.addControl('select-company-profile-type', 'select');
            control = this.addControl('input-company-profile-registration-number', 'input');
            control = this.addControl('date-company-profile-registration-date', 'date');

            control = this.addControl('input-company-profile-vat-registration-number', 'input');
            control.format(10);

            control = this.addControl('input-company-profile-tax-reference-number', 'input');
            control.format(10);

            control = this.addControl('input-registered-for-uif', 'radio');
            control = this.addControl('input-uif-number', 'input');

            $('#input-uif-number').inputmask({
                mask: '9999999/9'
            });

            control = this.addControl('input-company-profile-registered-address', 'input');
            control = this.addControl('input-company-profile-address-line1', 'input');
            control = this.addControl('input-company-profile-address-line2', 'input');
            control = this.addControl('input-company-profile-city', 'input');
            control = this.addControl('input-company-profile-postal-code', 'input');
            control.format(4);

            control = this.addControl('select-company-profile-province', 'select');
            let arr = [];
            smec.provinceMap.forEach(function (obj, key) {
                arr.push({
                    value: key,
                    text: obj.text
                });
            });
            control.fill(arr);

            $('#input-company-profile-registered-address').tooltip({
                html: true,
                title: 'Please start typing your address and then select the correct option from the list of addresses that returns',
                placement: 'top'
            });
            $('#input-company-profile-registered-address').tooltip('enable');

            let divNames = [
                'div-sic-section',
                'div-sic-division',
                'div-sic-group',
                'div-sic-class',
                'div-sic-sub-class'
            ];
            divNames.forEach((name, index) => {
                $('#' + name).show();
            });

            control = this.addControl('select-sic-section', 'select');
            control.enable(false);
            control = this.addControl('select-sic-division', 'select');
            control = this.addControl('select-sic-group', 'select');
            control = this.addControl('select-sic-class', 'select');
            control = this.addControl('select-sic-sub-class', 'select');

            let names = [
                'select-sic-section',
                'select-sic-division',
                'select-sic-group',
                'select-sic-class',
                'select-sic-sub-class'
            ];

            app.wizard.isb.init(this.controls, names, divNames);
            app.wizard.isb.reset();

            this.page2Dto = page.getPageToDto(this);
            this.dto2Page = page.getDtoToPage(this);
        }

        onCompanySelect(key) {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: 'Finding company details'
            });
            let self = this;
            if (this.mustSave == true) {
                self.pageToDto(self.company.dto);
            } else {
                this.mustSave = true;
            }
            let company = self.tryGetCompany(key);
            self.company = company;

            this.validation.resetFields([
                'input-company-profile-tax-reference-number',
                'input-company-profile-registered-address',
                'input-company-profile-address-line1',
                'input-company-profile-name',
                'select-company-profile-type',
                'input-company-profile-city',
                'input-company-profile-postal-code',
                'select-company-profile-province'
            ]);
            this.controls['select-sic-section'].enable(true);

            if (self.isCustomCompany(key) == true) {
                self.populateCompanyTypes(company.summary);
                company.dto = self.buildDto(company);
                self.dtoToPage(company.dto);
                KTApp.unblockPage();
            } else {
                if (company.dto != null) {
                    self.populateCompanyTypes(company.summary);
                    self.dtoToPage(company.dto);
                    KTApp.unblockPage();
                } else {
                    app.wizard.service.getCompanyDetails(company.summary.registrationNumber, (result) => {
                        if (result.status == app.wizard.Result.Success) {
                            company.verificationRecord = result.data;
                            self.populateCompanyTypes(company.summary);
                            company.dto = self.buildDto(company);
                            self.dtoToPage(company.dto);
                        }
                        KTApp.unblockPage();
                    });
                }
            }
        }

        onCompanySelectClick(value) {
            this.onCompanySelect(value);
        }

        duplicateBusinessMessage(result, cb) {
            let self = this;
            Swal.fire({
                icon: 'warning',
                html: result.message,//'You can only add a business once.',
                focusConfirm: false,
                confirmButtonText:
                    '<i class="fa fa-thumbs-up"></i> Got it!'
            }).then(() => {
                if (self.model.mode != 2) {
                    self.controls['select-company-profile-registered'].val(self.company == null ? '' : self.company.summary.registrationNumber);
                }
                cb(app.wizard.addResult());
            });
        }

        addHandlers() {
            let self = this;
            self.controls['select-company-profile-registered'].change((value, text) => {
                if (value != NOT_REGISTERED && value != REGISTERED_NOT_LISTED) {
                    app.wizard.service.doesBusinessExist(null, value, (result) => {
                        if (result.status == app.wizard.Result.Success) {
                            self.onCompanySelectClick(value);
                        } else {
                            result.message = 'Please contact our support team regarding the business you selected. <br/><b>087-500-9950</b>.';
                            self.duplicateBusinessMessage(result, (result) => {
                            });
                        }
                        KTApp.unblockPage();
                    });
                } else {
                    self.onCompanySelectClick(value);
                }
            });

            self.controls['select-company-profile-type'].change((value, text) => {
            });

            function setIndustryGuid(guid) {
                if (self.company.dto.propertiesJson.hasOwnProperty('industry') == false) {
                    self.company.dto.propertiesJson['industry'] = {};
                }
                self.helpers.setPropEx(self.company.dto.propertiesJson['industry'], 'Guid', guid);
            }

            function sectionHook(level, result) {
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-section', result[1].id);
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-division', '');
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-group', '');
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-class', '');
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-sub-class', '');
                setIndustryGuid('');
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            function divisionHook(level, result) {
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-division', result[2].id);
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-group', '');
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-class', '');
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-sub-class', '');
                setIndustryGuid('');
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            function groupHook(level, result) {
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-group', result[3].id);
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-class', '');
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-sub-class', '');
                setIndustryGuid('');
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            function classHook(level, result) {
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-class', result[4].id);
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-sub-class', '');
                setIndustryGuid('');
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            function subClassHook(level, result) {
                self.helpers.setPropEx(self.company.dto.propertiesJson, 'select-sic-sub-class', result[5].id);
                setIndustryGuid(result[5].id);
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            app.wizard.isb.addCallbacks([
                sectionHook, divisionHook, groupHook, classHook, subClassHook
            ]);

            $('#industry-sector-info-tooltip').on('click', (ev) => {
                this.industryHelp ^= true;
                self.helpers.show('div-industry-sector-info', this.industryHelp);
            });

            this.controls['input-registered-for-uif'].click((arg, name, value, checked) => {
                self.helpers.setPropEx(self.model.propertiesJson, 'is-business-owner', checked);
                self.dto2Page.uifNumber(checked == 'Yes');
            });
        }

        notRegisteredHtml() {
        }

        isCustomCompany(key) {
            return (
                key == NOT_REGISTERED || key == REGISTERED_NOT_LISTED || key == REGISTERED_LISTED
            );
        }

        tryGetCompany(key) {
            for (let i = 0, max = this.companies.length; i < max; i++) {
                if (this.companies[i].summary.key == key) {
                    return this.companies[i];
                }
            }
            return null;
        }

        populateCompanyType_NotRegistered(obj, type, arr) {
            if (type == SOLE_PROPRITETOR || type == PARTNERSHIP) {
                arr.push({
                    value: type,
                    text: obj['text']
                });
            }
            //arr.push({
            //    value: type,
            //    text: obj['text']
            //});
        }

        populateCompanyType_RegisteredNotListed(obj, type, arr) {
            arr.push({
                value: type,
                text: obj['text']
            });
        }

        populateCompanyType_RegisteredListed(obj, type, arr) {
            arr.push({
                value: type,
                text: obj['text']
            });
        }

        populateCompanyTypes(summary) {
            let self = this;
            this.controls['select-company-profile-type'].flush();
            let arr = [];
            smec.companyTypeMap.forEach((obj, type) => {
                if (summary.key == NOT_REGISTERED) {
                    self.populateCompanyType_NotRegistered(obj, type, arr);
                } else if (summary.key == REGISTERED_NOT_LISTED) {
                    self.populateCompanyType_RegisteredNotListed(obj, type, arr);
                } else {
                    self.populateCompanyType_RegisteredListed(obj, type, arr);
                }
            });
            arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
            this.controls['select-company-profile-type'].fill(arr);
        }

        setProvinceFromCode(code) {
            let province = app.common.gmap.areaCodeToProvince(code);
            // Invalid code (1)
            if (province == null || province == '') {
                this.controls['select-company-profile-province'].val('');
                return 1;
            // Valid code (0)
            } else if (this.validateProvinceCode(province) == true) {
                this.controls['select-company-profile-province'].val(province.key);
                return 0;
            // Code not allowed (2)
            } else {
                this.controls['select-company-profile-province'].val('');
                return 2;
            }
        }

        validateProvinceCode(province) {
            return (
                province != null && (
                province.key == 'GT' ||
                province.key == 'NW' ||
                province.key == 'LP' ||
                province.key == 'MP' ||
                province.key == 'KZ' ||
                province.key == 'EC' ||
                province.key == 'WC' ||
                province.key == 'NC' ||
                province.key == 'FS'
            ));
        }

        onValidateField(field, isValid, args = null) {
            if (field == 'input-company-profile-postal-code') {
                let code = args;
                let province = app.common.gmap.areaCodeToProvince(code);
                let key = this.controls['select-company-profile-province'].val();
                //if (this.validateProvinceCode(province) == false) {
                if(province == null || province.key != key) {
                    this.onValidateFieldPostalCode(1, key);
                    //this.controls['select-company-profile-province'].val('')
                    return 1;
                } else {
                    this.onValidateFieldPostalCode(0, key);
                    //this.setProvinceFromCode(args);
                    return 0;
                }
            }
        }

        onValidateFieldPostalCode(result, code) {

        }
    }

    page.create = function (id) {
        return new Business(id);
    }

    page.getDtoToPage = function (self) {
        return new DtoToPage(self);
    }

    page.getPageToDto = function (self) {
        return new PageToDto(self);
    }

    page.Baseline = Baseline;

    page.DtoToPage = DtoToPage;

    page.PageToDto = PageToDto;

})(app.wizard.business.page);
