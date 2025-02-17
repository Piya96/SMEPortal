if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.company = null;

(function (onboard) {

    const REGISTERED_LISTED = 'RegisteredListed';
    const REGISTERED_NOT_LISTED = 'RegisteredNotListed';
    const NOT_REGISTERED = 'NotRegistered';// Sole Proprietor, PArtnership.
    const NOT_YET_REGISTERED = 'NotYetRegistered';

    const SOLE_PROPRIETOR = '5a6ab7ce506ea818e04548ad';
    const PARTNERSHIP = '5a6ab7d3506ea818e04548b0';

    let helpers = app.onboard.helpers.get();

    let loaded = false;

    let companies = [];

    let currCIPC = null;

    let userCompanies =  new Map();

    const controlNames = {
        name1 : 'cipc-lookup',
        name2 : 'cname',
        companyType : 'companyType',
        registrationNumber : 'regno',
        registrationDate : 'registrationdate',
        startedTradingDate: 'startedtradingdate',
        vatRegNumber : 'name-input-company-profile-vat-reg-number',
        taxRefNumber : 'name-input-company-profile-tax-ref-number',
        registeredAddress : 'name-registered-address',
        registeredAddressLine1 : 'regaddr1',
        registeredAddressLine2 : 'regaddr2',
        cityTown : 'citytown',
        postalCode : 'postalcode',
        province: 'companyProfileProvinceSelect',
        industrySearch: 'name-input-industry-search',
        industrySectorsDiv: 'name-div-industry-sector',
        industrySectors: 'subsectors',
        entityType: 'name-company-profile-entity-type-select'
    };


    let _controls = {
        name1: app.control.select(controlNames.name1, 'id-company-profile-cipc'),
        name2: app.control.input(controlNames.name2, 'id-company-profile-cname'),
        companyType: app.control.select(controlNames.companyType, 'id-company-profile-type'),
        registrationNumber: app.control.input(controlNames.registrationNumber, 'id-company-profile-reg-no'),

        // TODO: dateinput???
        registrationDate: app.control.input(controlNames.registrationDate, 'reg-date'),
        startedTradingDate: app.control.input(controlNames.startedTradingDate, 'trading-date'),

        vatRegNumber: app.control.input(controlNames.vatRegNumber, 'id-input-company-profile-vat-reg-number'),
        taxRefNumber: app.control.input(controlNames.taxRefNumber, 'id-input-company-profile-tax-ref-number'),

        registeredForUIF: app.control.radio('input-registered-for-uif', 'input-registered-for-uif'),
        uifNumber: app.control.input('input-uif-number', 'input-uif-number'),

        registeredAddress: app.control.input(controlNames.registeredAddress),
        registeredAddressLine1: app.control.input(controlNames.registeredAddressLine1),
        registeredAddressLine2: app.control.input(controlNames.registeredAddressLine2),
        cityTown: app.control.input(controlNames.cityTown),
        postalCode: app.control.input(controlNames.postalCode),
        province: app.control.select(controlNames.province, 'id-company-profile-province-select'),
        industrySearch: app.control.input(controlNames.industrySearch, 'industry-search'),
        industrySectorsDiv: app.control.base(controlNames.industrySectorsDiv, 'id-div-industry-sector'),
        industrySectors : app.control.select(controlNames.industrySectors),
        entityType: app.control.select(controlNames.entityType, 'id-company-profile-entity-type-select')
    };

    function populateCompanyTypeSelect(regNo) {
        let name = regNo != NOT_REGISTERED ? REGISTERED_LISTED : NOT_REGISTERED;
        let exclude = [];
        let check = false;
        switch (name) {
            case REGISTERED_LISTED:
                break;

            case REGISTERED_NOT_LISTED:
                check = false;
                exclude = [SOLE_PROPRIETOR, PARTNERSHIP];
                break;

            case NOT_REGISTERED:
                check = true;
                exclude = [SOLE_PROPRIETOR, PARTNERSHIP];
                break;
        }


        let arr = [];
        smec.companyTypeMap.forEach((obj, key) => {
            if (exclude.includes(key) == check) {
                arr.push({
                    value: key,
                    text: obj['text']
                });
            }
        });
        _controls.companyType.flush();
        _controls.companyType.fill(arr);
    }

    class DtoBuilder {
        constructor() {

        }

        reset(dto = null) {
            let temp = dto;
            if (dto == null) {
                temp = {};
            }
            // Required.
            temp.name = '';
            temp.registrationNumber = '';
            temp.type = '';
            temp.registrationDate = '';
            temp.startedTradingDate = '';
            // Required.
            temp.registeredAddress = '';
            temp.verificationRecordJson = '';
            // Required.
            temp.beeLevel = 'null'
            // Required.
            temp.customers = 'null';
            // Required.
            temp.industries = '';
            temp.webSite = 'null';
            // Required.
            temp.propertiesJson = '';
    
            return temp;
        }

        buildAddress(details) {
            return (
                details.addressLine1 + ', ' +
                details.addressLine2 + ', ' +
                details.city + ', ' +
                details.areaCode + ', ' +
                details.province
            );
        }

        build(summary, details) {
            let self = this;
            let guid = smec.keyFromCompanyAlias(summary.companyType, details.companyTypeCode);
            //let guid = smec.keyFromCompanyAlias('', '25');
            let dto = {
                name: summary.companyName,
                registrationNumber: summary.registrationNumber,
                type: guid,
                registrationDate: details.registrationDate,
                startedTradingDate: details.registrationDate,
                registeredAddress: self.buildAddress(details),
                verificationRecordJson: JSON.stringify(details),
                beeLevel: 'null',
                customers: 'null',
                industries: '',
                website: 'null',
                propertiesJson: {
                    companyCipcStatus: 'RegisteredListed',
                    taxReferenceNumber: details['taxNumber']
                }
            };
            dto.verificationRecordJson = JSON.parse(dto.verificationRecordJson);
            return dto;
        }
    }

    _dtoBuilder = new DtoBuilder();

    class DtoToPage {
        constructor() {
            this.dto = null;
        }

        company() {
            let regNo = this.dto.propertiesJson.companyCipcStatus == REGISTERED_LISTED ? this.dto.registrationNumber : NOT_REGISTERED;
            _controls.name1.val(this.dto.registrationNumber);
        }

        name() {
            _controls.name2.placeholder('Business name');
            _controls.name2.enable(false);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.name2.val('');
                _controls.name2.placeholder('Business name');

            } else {
                _controls.name2.val(this.dto.name);
            }
        }

        type() {
            populateCompanyTypeSelect(REGISTERED_LISTED);

            _controls.companyType.placeholder('Business type');
            _controls.companyType.enable(false);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.companyType.val('');
            } else {
                _controls.companyType.val(this.dto.type);
            }
        }

        registrationNumber() {
            _controls.registrationNumber.enable(false);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.registrationNumber.val('');
                _controls.registrationNumber.placeholder('Registration number');
            } else {
                _controls.registrationNumber.val(this.dto.registrationNumber);
            }
        }

        registrationDate() {
            let date = helpers.formatDate(this.dto.registrationDate);
            $('#reg-date').datepicker('update', date);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.registrationDate.placeholder('Registration date');
            } else {
            }
            $('#reg-date').prop('disabled', true);
            $('#reg-date').attr('readonly');
        }

        startedTradingDate() {
            let date = helpers.formatDate(this.dto.startedTradingDate);
            $('#trading-date').datepicker('update', date);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.startedTradingDate.placeholder('Started trading date');
                $('#trading-date').prop('disabled', true);
                $('#trading-date').attr('readonly');
            } else {
                $('#trading-date').prop('disabled', false);
                $('#trading-date').attr('readonly', false);
            }
        }

        vatRegistrationNumber() {
            let value = '';
            if (helpers.isObject(this.json) == true && helpers.hasProp(this.json, 'vatRegistrationNumber') == true) {
                value = this.json['vatRegistrationNumber'];
            }
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.vatRegNumber.placeholder('VAT Registration Number');
                _controls.vatRegNumber.val('');
                _controls.vatRegNumber.enable(false);
            } else {
                _controls.vatRegNumber.placeholder('Enter VAT Registration Number');
                _controls.vatRegNumber.val(value);
                _controls.vatRegNumber.enable(true);
            }
        }

        taxReferenceNumber() {
            let value = '';
            if (helpers.isObject(this.json) == true && helpers.hasProp(this.json, 'taxReferenceNumber') == true) {
                value = this.json['taxReferenceNumber'];
            }
            _controls.taxRefNumber.placeholder('Tax Reference Number');
            _controls.taxRefNumber.enable(false);
            _controls.taxRefNumber.val(value);
        }

        registeredForUIF() {
            let value = '';
            if (helpers.isObject(this.json) == true && helpers.hasProp(this.json, 'registered-for-uif') == true) {
                value = this.json['registered-for-uif'];
            }
            _controls.registeredForUIF.val(value);
            helpers.setProp(this.json, 'registered-for-uif', value);
            this.uifNumber(value == 'Yes');
        }

        uifNumber(show) {
            let value = '';
            if (show == true) {
                $('#div-uif-number').show('fast');
                value = helpers.getPropEx(this.json, 'uif-number', '');
                value = value.toString().replace(/\//g, '');
            } else {
                $('#div-uif-number').hide('fast');
                helpers.setPropEx(this.json, 'uif-number', '');
            }
            _controls.uifNumber.val(value);
        }

        province(areaCode) {
            let province = app.common.gmap.areaCodeToProvince(areaCode);
            if (province != null) {
                $('#id-company-profile-province-select').val(province.key);
                $('#id-company-profile-province-select').prop('disabled', false);
            } else {
                $('#id-company-profile-province-select').val('');
                $('#id-company-profile-province-select').prop('disabled', false);
            }
        }

        registeredAddress() {
            // TODO: Check out build address.
            _controls.registeredAddress.val(this.dto.registeredAddress);

            if (this.dto.name == '' || this.dto.name == null) {
                _controls.registeredAddress.enable(false);
                _controls.registeredAddressLine1.enable(false);
                _controls.registeredAddressLine2.enable(false);
                _controls.cityTown.enable(false);
                _controls.postalCode.enable(false);

                _controls.registeredAddress.val('');
                _controls.registeredAddressLine1.val('');
                _controls.registeredAddressLine2.val('');
                _controls.cityTown.val('');
                _controls.postalCode.val('');

                _controls.cityTown.placeholder('City / Town');
                _controls.postalCode.placeholder('Postal code');

            } else {
                this.dto.registeredAddress = helpers.removeDuplicates(this.dto.registeredAddress);

                _controls.registeredAddress.enable(true);
                _controls.registeredAddressLine1.enable(true);
                _controls.registeredAddressLine2.enable(true);
                _controls.cityTown.enable(true);
                _controls.postalCode.enable(true);
                _controls.province.enable(true);

                _controls.registeredAddress.val(this.dto.registeredAddress);

                this.populateAddressParts(this.dto.registeredAddress);
            }
        }

        populateAddressParts(registeredAddress) {
            _controls.registeredAddressLine1.val('');
            _controls.registeredAddressLine2.val('');
            _controls.cityTown.val('');
            _controls.postalCode.val('');

            _controls.registeredAddressLine1.placeholder('Address line1');
            _controls.registeredAddressLine2.placeholder('Address line2');
            _controls.cityTown.placeholder('Enter City / Town');
            _controls.postalCode.placeholder('Enter Postal code');

            let arr = registeredAddress.split(',');

            for (let i = arr.length, max = 6; i < max; i++) {
                arr.push('');
            }
            if (arr[0] != '' || arr[1] != '') {
                $('#addr1').val(arr[0] + ' ' + arr[1]);
            }
            if (arr[2] != '' || arr[3] != '') {
                $('#addr2').val(arr[2] + ' ' + arr[3]);
            }
            let i = 0;
            while (i < arr.length) {
                if (isNaN(arr[i]) == false && i > 0) {
                    break;
                } else {
                    i++;
                }
            }
            if (i < arr.length) {
                $('#locality').val(arr[i - 1]);
                $('#postal_code').val(arr[i]);
                this.province(arr[i]);
            }
        }

        entityType() {
            let value = '';
            if (helpers.isObject(this.json) == true && helpers.hasProp(this.json, 'entityType') == true) {
                value = this.json['entityType'];
            }
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.entityType.placeholder('Entity type');
                _controls.entityType.enable(false);
            } else {
                _controls.entityType.placeholder('Select entity type');
                _controls.entityType.enable(true);
            }
            _controls.entityType.val(value);
        }

        industrySearch() {
            _controls.industrySearch.val('');
            //if (this.dto.name == '' || this.dto.name == null) {
            if (_controls.name1.val() == '' || _controls.name1.val() == null) {
                $('#industry-sector-info-tooltip').hide();
                _controls.industrySearch.enable(false);
                _controls.industrySearch.placeholder('Industry sub-sectors');
            } else {
                $('#industry-sector-info-tooltip').show();
                _controls.industrySearch.enable(true);
                _controls.industrySearch.placeholder('Search industry sub-sectors');
            }
        }

        industrySummary(args) {
            if (args == null) {
                $('#id-div-industry-info').hide('fast');
            } else {
                $('#id-li-label').text('Label: ' + args.Label);
                $('#id-li-sic-code').text('SIC Code: ' + args.Subclass);
                $('#id-li-section').text('Section: ' + args.Section);
                $('#id-li-division').text('Division: ' + args.Division);
                $('#id-li-description').text('Description: ' + args.Description);

                $('#id-div-industry-info').show('fast');
            }
        }

        industrySectors() {
            _controls.industrySectorsDiv.showEx(false);

            let enableValidation = null;
            if (this.json.hasOwnProperty('industry') == false || this.json['industry'] == null) {
                this.industrySummary(null);
                enableValidation = true;
            } else {
                this.industrySummary(this.json['industry']);
                enableValidation = false;
            }
            KTWizard2.enable(
                KTWizard2.PAGE.CompanyProfile,
                'name-select-company-profile-industry-dummy',
                enableValidation
            );
        }

        apply(dto) {
            let vrec = false;
            let json = false;
            this.dto = dto;
            if (helpers.isObject(dto.verificationRecordJson) == false && dto.verificationRecordJson != '') {
                this.vrec = JSON.parse(dto.verificationRecordJson);
                vrec = true;
            } else {
                this.vrec = dto.verificationRecordJson;
            }
            if (helpers.isObject(dto.propertiesJson) == false && dto.propertiesJson != '') {
                this.json = JSON.parse(dto.propertiesJson);
                json = true;
            } else {
                this.json = dto.propertiesJson;
            }

            this.company();
            this.name();
            this.type();
            this.registrationNumber();
            this.registrationDate();
            this.startedTradingDate();
            this.taxReferenceNumber();
            this.vatRegistrationNumber();
            this.registeredForUIF();
            this.registeredAddress();
            this.entityType();
            this.industrySearch();
            this.industrySectors();

            if (vrec == true) {
                dto.verificationRecordJson = JSON.stringify(this.vrec);
            }
            if (json == true) {
                dto.propertiesJson = JSON.stringify(this.json);
            }
        }
    }

    class DtoToPageNotRegistered extends DtoToPage {
        constructor() {
            super();
        }

        company() {
            _controls.name1.val(NOT_REGISTERED);
        }

        name() {
            _controls.name2.placeholder('Business name');
            _controls.name2.enable(true);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.name2.val('');
                _controls.name2.placeholder('Business name');

            } else {
                _controls.name2.val(this.dto.name);
            }
        }

        type() {
            populateCompanyTypeSelect(NOT_REGISTERED);

            _controls.companyType.placeholder('Business type');
            _controls.companyType.enable(true);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.companyType.val('');
            } else {
                _controls.companyType.val(this.dto.type);
            }
        }

        registrationNumber() {
            _controls.registrationNumber.enable(false);
            _controls.registrationNumber.placeholder('');
            _controls.registrationNumber.val('');
            KTWizard2.enable(
                KTWizard2.PAGE.CompanyProfile, 'regno', false
            );
        }

        registrationDate() {
            $('#reg-date').datepicker('update', '');
            _controls.registrationDate.placeholder('');
            $('#reg-date').prop('disabled', true);
            $('#reg-date').attr('readonly');
        }

        startedTradingDate() {
            let date = helpers.formatDate(this.dto.startedTradingDate);
            $('#trading-date').datepicker('update', date);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.startedTradingDate.placeholder('Started trading date');
            }
            $('#trading-date').prop('disabled', false);
            $('#trading-date').attr('readonly', false);
        }

        vatRegistrationNumber() {
            let value = '';
            if (helpers.isObject(this.json) == true && helpers.hasProp(this.json, 'vatRegistrationNumber') == true) {
                value = this.json['vatRegistrationNumber'];
            }
            if (value == '' || value == null) {
                _controls.vatRegNumber.placeholder('Enter VAT Registration Number');
            }
            _controls.vatRegNumber.val(value);
            _controls.vatRegNumber.enable(true);
        }

        taxReferenceNumber() {
            let value = '';
            if (helpers.isObject(this.json) == true && helpers.hasProp(this.json, 'taxReferenceNumber') == true) {
                value = this.json['taxReferenceNumber'];
            }
            if (value == '' || value == null) {
                _controls.taxRefNumber.placeholder('Tax Reference Number');
            }
            _controls.taxRefNumber.enable(true);
            _controls.taxRefNumber.val(value);
        }

        province(areaCode) {
            let province = app.common.gmap.areaCodeToProvince(areaCode);
            // --- Keep enabled for now.
            if (province != null) {
                $('#id-company-profile-province-select').val(province.key);
                $('#id-company-profile-province-select').prop('disabled', false);
            } else {
                $('#id-company-profile-province-select').val('');
                $('#id-company-profile-province-select').prop('disabled', false);
            }
        }

        registeredAddress() {
            this.dto.registeredAddress = helpers.removeDuplicates(this.dto.registeredAddress);

            _controls.registeredAddress.val(this.dto.registeredAddress);

            _controls.registeredAddress.enable(true);
            _controls.registeredAddressLine1.enable(true);
            _controls.registeredAddressLine2.enable(true);
            _controls.cityTown.enable(true);
            _controls.postalCode.enable(true);
            _controls.province.enable(true);

            if (this.dto.registeredAddress == null || this.dto.registeredAddress == '') {
                _controls.registeredAddress.placeholder('Registered Address');
            } else {
                _controls.registeredAddress.val(this.dto.registeredAddress);
            }
            this.populateAddressParts(this.dto.registeredAddress);
        }

        entityType() {
            super.entityType();
            _controls.entityType.enable(true);
        }

        industrySearch() {
            super.industrySearch();
            _controls.industrySearch.enable(true);
        }
    }

    class DtoToPageRegisteredNotListed extends DtoToPage {
        constructor() {
            super();
        }

        company() {
            _controls.name1.val(REGISTERED_NOT_LISTED);
        }

        name() {
            _controls.name2.placeholder('Business name');
            _controls.name2.enable(true);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.name2.val('');
                _controls.name2.placeholder('Business name');

            } else {
                _controls.name2.val(this.dto.name);
            }
        }

        type() {
            populateCompanyTypeSelect(REGISTERED_NOT_LISTED);

            _controls.companyType.placeholder('Business type');
            _controls.companyType.enable(true);
            if (this.dto.type == '' || this.dto.type == null) {
                _controls.companyType.val('');
            } else {
                _controls.companyType.val(this.dto.type);
            }
        }

        registrationNumber() {
            let guid = _controls.companyType.val();
            let mustEnable = (guid != SOLE_PROPRIETOR && guid != PARTNERSHIP && guid != null && guid != '');
            _controls.registrationNumber.enable(mustEnable);

            if (mustEnable == true) {
                if (this.dto.name == '' || this.dto.name == null) {
                    _controls.registrationNumber.val('');
                    _controls.registrationNumber.placeholder('Registration number');
                } else {
                    let key = $('#id-company-profile-type').val();
                    updateRegNumber(key);
                    _controls.registrationNumber.val(this.dto.registrationNumber);
                }
            } else {
                _controls.registrationNumber.placeholder('');
                _controls.registrationNumber.val('');
            }
        }
        
        registrationDate() {
            let date = helpers.formatDate(this.dto.registrationDate);
            $('#reg-date').datepicker('update', date);
            if (date == '' || date == null) {
                _controls.registrationDate.placeholder('Registration date');
            } else {
            }
            $('#reg-date').prop('disabled', false);
            $('#reg-date').attr('readonly', false);
            KTWizard2.enable(KTWizard2.PAGE.CompanyProfile, 'registrationdate', true);
        }

        startedTradingDate() {
            let date = helpers.formatDate(this.dto.startedTradingDate);
            $('#trading-date').datepicker('update', date);
            if (this.dto.name == '' || this.dto.name == null) {
                _controls.startedTradingDate.placeholder('Started trading date');
            }
            $('#trading-date').prop('disabled', false);
            $('#trading-date').attr('readonly', false);
        }

        vatRegistrationNumber() {
            let value = '';
            if (helpers.isObject(this.json) == true && helpers.hasProp(this.json, 'vatRegistrationNumber') == true) {
                value = this.json['vatRegistrationNumber'];
            }
            if (value == '' || value == null) {
                _controls.vatRegNumber.placeholder('Enter VAT Registration Number');
            }
            _controls.vatRegNumber.val(value);
            _controls.vatRegNumber.enable(true);
        }

        taxReferenceNumber() {
            let value = '';
            if (helpers.isObject(this.json) == true && helpers.hasProp(this.json, 'taxReferenceNumber') == true) {
                value = this.json['taxReferenceNumber'];
            }
            if (value == '' || value == null) {
                _controls.taxRefNumber.placeholder('Tax Reference Number');
            }
            _controls.taxRefNumber.enable(true);
            _controls.taxRefNumber.val(value);
        }

        province(areaCode) {
            let province = app.common.gmap.areaCodeToProvince(areaCode);
            if (province != null) {
                $('#id-company-profile-province-select').val(province.key);
                $('#id-company-profile-province-select').prop('disabled', true);
            } else {
                $('#id-company-profile-province-select').val('');
                $('#id-company-profile-province-select').prop('disabled', false);
            }
        }

        registeredAddress() {
            // TODO: Check out build address.
            _controls.registeredAddress.val(this.dto.registeredAddress);

            _controls.registeredAddress.enable(true);
            _controls.registeredAddressLine1.enable(true);
            _controls.registeredAddressLine2.enable(true);
            _controls.cityTown.enable(true);
            _controls.postalCode.enable(true);
            _controls.province.enable(true);

            _controls.registeredAddress.val(this.dto.registeredAddress);
            _controls.registeredAddressLine1.val('');
            _controls.registeredAddressLine2.val('');
            _controls.cityTown.val('');
            _controls.postalCode.val('');

            _controls.cityTown.placeholder('Enter City / Town');
            _controls.postalCode.placeholder('Enter Postal code');

            let arr = this.dto.registeredAddress.split(',');

            let ids = ['#addr1', '#addr2', '#locality', '#postal_code'];
            for (let i = 0, max = arr.length; i < max; i++) {
                if (arr[i] != null && arr[i] != 'undefined') {
                    $(ids[i]).val(arr[i]);
                }
            }
            let areaCode = arr[3];
            this.province(areaCode);
        }

        entityType() {
            super.entityType();
            _controls.entityType.enable(true);
        }

        industrySearch() {
            super.industrySearch();
            _controls.industrySearch.enable(true);
        }
    }

    let dtoToPage = new DtoToPage();
    let dtoToPageNotRegistered = new DtoToPageNotRegistered();
    let dtoToPageRegisteredNotListed = new DtoToPageRegisteredNotListed();

    class PageToDto {
        constructor() {
            this.dto = null;
            this.json = null;
            this.vrec = null;
        }

        company() {
            this.dto.name = _controls.name1.val();
        }

        name() {
            this.dto.name = _controls.name2.val();
        }

        type() {
            this.dto.type = _controls.companyType.val();
        }

        registrationNumber() {
            this.dto.registrationNumber = _controls.registrationNumber.val();
        }

        registrationDate() {
            this.dto.registrationDate = $('#reg-date').datepicker('getDate');
        }

        startedTradingDate() {
            this.dto.startedTradingDate = $('#trading-date').datepicker('getDate');
        }

        taxReferenceNumber() {
            let value = _controls.taxRefNumber.val();
            helpers.setProp(this.json, 'taxReferenceNumber', value);
        }

        vatRegistrationNumber() {
            let value = _controls.vatRegNumber.val();
            helpers.setProp(this.json, 'vatRegistrationNumber', value);
        }

        registeredForUIF() {
            let value = _controls.registeredForUIF.val();
            helpers.setProp(this.json, 'registered-for-uif', value);
            this.uifNumber();
        }

        uifNumber() {
            let value = _controls.uifNumber.val();
            value = value.toString().replace(/\//g, '');
            helpers.setPropEx(this.json, 'uif-number', value);
        }

        registeredAddress() {
            let a1 = _controls.registeredAddressLine1.val();
            let a2 = _controls.registeredAddressLine2.val();
            let a3 = _controls.cityTown.val();
            let a4 = _controls.postalCode.val();
            let a5 = _controls.province.val() == null ? '' : _controls.province.val();
            this.dto.registeredAddress = (
                a1 + ',' +
                a2 + ',' +
                a3 + ',' +
                a4 + ',' +
                a5
            );
            this.dto.registeredAddress = helpers.removeDuplicates(this.dto.registeredAddress);
        }

        entityType() {
            let value = _controls.entityType.val();
            helpers.setProp(this.json, 'entityType', value);
        }

        industry() {
            let value = null;
            if (helpers.hasObject(this.json, 'industry') == true) {
                value = this.json['industry']['Guid'];
            }
            this.dto.industries = value;
        }

        apply(dto, company) {
            this.dto = dto;

            this.vrec = company.dto.verificationRecordJson;

            if (helpers.hasProp(this.dto, 'propertiesJson') == false) {
                this.dto['propertiesJson'] = {};
            }
            if (helpers.isObject(this.dto['propertiesJson']) == false) {
                this.dto['propertiesJson'] = {};
            }

            this.json = this.dto['propertiesJson'];
            this.json['matchCriteriaJson'] = [];
            if (company.hasOwnProperty('status') == true) {
                this.json['companyCipcStatus'] = company['status'];
            } else {
                this.json['companyCipcStatus'] = 'RegisteredListed';
            }

            this.company();
            this.name();
            this.type();
            this.registrationNumber();
            this.registrationDate();
            this.startedTradingDate();
            this.taxReferenceNumber();
            this.vatRegistrationNumber();
            this.registeredForUIF();
            this.registeredAddress();
            this.entityType();
            this.industry();

            dto.verificationRecordJson = this.vrec;

            dto.beeLevel = 'SEFA';
            dto.customers = ',';
            dto.webSite = 'No';
            dto.userId = 1;
            dto.id = null;
        }
    }

    let pageToDto = new PageToDto();

    function updateProvince(key, areaCode) {
        dtoToPage.province(areaCode);
    }

    function AutoFillAddrComplete(addressComponents) {
        // TODO: Make sure this cell 5 is good and valid!
        updateProvince(addressComponents['province'], addressComponents['code']);

        KTWizard2.validateField(KTWizard2.PAGE.CompanyProfile, 'regaddr1');
        KTWizard2.validateField(KTWizard2.PAGE.CompanyProfile, 'citytown');
        KTWizard2.validateField(KTWizard2.PAGE.CompanyProfile, 'postalcode');
        KTWizard2.validateField(KTWizard2.PAGE.CompanyProfile, 'companyProfileProvinceSelect');

        $('#industry-search').val('');
    }

    function setCIPC(val) {
        $('#id-company-profile-cipc').val(val);
        currCIPC = val;
    }

    function getRegNo(regNo) {
        return regNo.replace(/\//g, '');
    }

    function getFromCIPC(regNo) {
        regNo = regNo.replace(/\//g, '');
        let arr = companies;
        for (let i = 0; i < arr.length; i++) {
            if (regNo == arr[i].cipc.registrationNumber.replace(/\//g, '')) {
                return arr[i];
            }
            // Da Fak???
            if (arr[i].hasOwnProperty('status') == true) {
                if (arr[i]['status'] == regNo) {
                    return arr[i];
                }
            }
        }
        return null;
    }

    function getCompany(dto, cb) {
        let temp = {
            cipc: null,
            dto: null
        };
        temp.cipc = {
            companyName: dto.name,
            registrationNumber: dto.registrationNumber,
            regType: dto.type,
            status : ''
        };
        let propJson = JSON.parse(dto.propertiesJson);
        switch (propJson.companyCipcStatus) {
            case NOT_REGISTERED:
                temp.status = NOT_REGISTERED;
                temp.cipc.companyName = NOT_REGISTERED;//dto.name;
                break;

            case REGISTERED_NOT_LISTED:
                temp.status = REGISTERED_NOT_LISTED;
                temp.cipc.companyName = REGISTERED_NOT_LISTED;//dto.name;
                break;

            case 'RegisteredListed':
                temp.status = 'RegisteredListed';
                temp.cipc.companyName = dto.name;
                break;
        }
        // ***
        //if (getFromCIPC(temp.cipc.companyName) == null) {
        if (getFromCIPC(temp.cipc.registrationNumber) == null) {
            companies.push(temp);
        }
        if (cb != null) {
            cb(AddStatus(), propJson.companyCipcStatus);
        }
    }

    function getCompanyDetailsFunc(builder, dtoToPage, company, cb) {
        // --- We have already retreived these details.
        if (company != null && company.dto != null) {
            dtoToPage.apply(company.dto);
            cb(AddStatus());
        } else {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: app.localize('LoadCompanyDetails')
            });
            app.onboard.service.getCompanyDetails(company.cipc.registrationNumber, function (status, obj) {
                KTApp.unblockPage();

                if (status.result == Result.Pass) {
                    company.dto = builder.build(company.cipc, obj);
                    dtoToPage.apply(company.dto);
                }
                cb(status);
            });
        }
    }

    function setCipcStatus(cipc) {
        //if (cipc.status != 'In Business') {
        if (cipc.status != '03') {
            return cipc.companyName; // + ' - (' + cipc.status + ')';
        } else {
            return cipc.companyName;
        }
    }

    function populateCompanyList() {
        let arr = [];
        companies.forEach(function (obj, idx) {
            if (obj.hasOwnProperty('status') == true && (obj.status == NOT_REGISTERED || obj.status == REGISTERED_NOT_LISTED)) {
            
            } else {
                let status = obj.cipc.status;
                arr.push({
                    value: obj.cipc.registrationNumber,
                    text: setCipcStatus(obj.cipc),
                    //disabled: status != 'In Business'
                    disabled: status != '03'
                });
            }
        });
        arr.sort(function (a, b) {
            return a.text > b.text ? 1 : -1;
        });
        if (app.onboard.wizard.mode != app.onboard.wizard.MODE.Edit) {
            arr.push({
                value: NOT_REGISTERED,
                text: 'Business not registered',
                disabled : false
            });
        }
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

        _controls.name1.flush();
        _controls.name1.fill(arr, (elem, item) => {
            if (item.disabled == true) {
                elem.setAttribute('disabled', 'true');
                elem.style.backgroundColor = '#F5F5F5';
            }
        });
    }

    function updateRegNumber(key, regNo = null) {
        function noRegNoRequired(type) {
            return type == SOLE_PROPRIETOR || type == PARTNERSHIP;
        }

        let cipc = $('#id-company-profile-cipc').val();
        let type = key;
        let mask = '';
        let placeholder = '';
        if (cipc == REGISTERED_NOT_LISTED && noRegNoRequired(type) == false) {
            let obj = smec.companyTypeFromKey(key);
            if (obj != null) {
                mask = obj.mask;
                placeholder = obj.placeholder;
                $('#id-company-profile-reg-no').attr('placeholder', placeholder);
            }
            if (regNo != null && regNo != '') {
                $('#id-company-profile-reg-no').val(regNo);
            }
        }
        // TODO: Registered, but not listed?
        $('#id-company-profile-reg-no').inputmask({
            mask: mask,
            placeholder: placeholder
        });
    }

    function enableDates(regDate, startDate, soleProp = false) {
        $('#reg-date').prop('disabled', soleProp == false ? regDate ^ true : true);
        if (regDate == true && soleProp == false) {
            $('#reg-date').attr('readonly', true);
        } else {
            $('#reg-date').removeAttr('readonly');
        }
        $('#trading-date').prop('disabled', startDate ^ true);
        if (startDate == true) {
            $('#trading-date').attr('readonly', true);
        } else {
            $('#trading-date').removeAttr('readonly');
        }
    }

    (function () {
        let arr = [];
        smec.provinceMap.forEach(function (obj, key) {
            arr.push({
                value: key,
                text: obj.text
            });
        });
        _controls.province.fill(arr);
    })();

    $('#id-company-profile-type').change(function (args) {

        if (currCIPC == NOT_REGISTERED) {

        } else {
            function noRegNoRequired(key) {
                return key == SOLE_PROPRIETOR || key == PARTNERSHIP;
            }

            let key = $('#id-company-profile-type').val();
            let regNo = $('#id-company-profile-reg-no').val();
            updateRegNumber(key, regNo);
            let disabled = noRegNoRequired(key);
            if (disabled == true) {
                $('#id-company-profile-reg-no').attr('placeholder', '');
                $('#id-company-profile-reg-no').val('');
            }
            $('#id-company-profile-reg-no').prop('disabled', disabled);

            KTWizard2.enable(
                KTWizard2.PAGE.CompanyProfile, 'regno', disabled ^ true
            );
        }
    });

    _controls.name1.change((key, value) => {
    
    });

    
    _controls.registeredForUIF.click((arg, name, value, checked) => {
        if (checked == 'Yes') {
            $('#div-uif-number').show('fast');
        } else {
            $('#div-uif-number').hide('fast');
        }
        //self.helpers.setPropEx(self.model.propertiesJson, 'is-business-owner', checked);
        //self.dto2Page.uifNumber(checked == 'Yes');
    });

    $('#id-company-profile-cipc').change(function (e) {

        let currName = currCIPC == null ? '' : currCIPC;

        function cipcChangeCompanyAvailable() {
            let regNo = $('#id-company-profile-cipc').val();
            let company = getFromCIPC(regNo);

            // Update associated dto to reflect the form data for current CIPC name.
            if (currCIPC != null && currCIPC != '') {
                let company = getFromCIPC(currCIPC);
                pageToDto.apply(company.dto, company);
            }
            // Save the new selected CIPC name.
            currCIPC = regNo;
            // The list of types will depend on company selected. TODO
            populateCompanyTypeSelect(regNo);

            function cipcChangeCompanyRegisteredListed() {
                let company = getFromCIPC(regNo);
                if (company != null) {
                    getCompanyDetailsFunc(_dtoBuilder, dtoToPage, company, function (status) {
                        if (status.result == Result.Fail) {
                            currCIPC = null;
                            $('#id-company-profile-cipc').val('');
                            swal.fire({
                                title: app.localize('CIPCDetailsNotFound'),
                                icon: 'info',
                                showConfirmButton: false
                            });
                        }
                    });
                }
            }

            function cipcNotRegisteredOrNotRegisteredNotListed() {
                let company = getFromCIPC(regNo);
                if (company != null && company.dto != null) {
                    if (regNo == NOT_REGISTERED) {
                        dtoToPageNotRegistered.apply(company.dto);
                    } else if (name == REGISTERED_NOT_LISTED) {
                        dtoToPageRegisteredNotListed.apply(company.dto);
                    } else {
                        dtoToPage.apply(company.dto);
                    }
                } else {
                    getFromCIPC(regNo);
                    company.dto = _dtoBuilder.reset();
                    company.dto.name = '';//name;
                    company.cipc.companyName = '';//name;
                    if (regNo == NOT_REGISTERED) {
                        dtoToPageNotRegistered.apply(company.dto);
                    //} else if (name == REGISTERED_NOT_LISTED) {
                        //dtoToPageRegisteredNotListed.apply(company.dto);
                    } else {
                        dtoToPage.apply(company.dto);
                    }
                }
            }

            switch (regNo) {
                case NOT_REGISTERED:
                    cipcNotRegisteredOrNotRegisteredNotListed();
                    break;

                //case REGISTERED_NOT_LISTED:
                    //cipcNotRegisteredOrNotRegisteredNotListed();
                    //break;

                default:
                    cipcChangeCompanyRegisteredListed();
                    break;
            }
        }

        function cipcChangeCompanyTaken() {
            Swal.fire({
                text: app.localize('OW_CompanyStatusAlreadyAdded'),
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function () {
                $('#id-company-profile-cipc').val(currName);
            });
        }

        function isCompanyAvailable(cb) {
            let regNo = $('#id-company-profile-cipc').val();
            if (regNo == NOT_REGISTERED/* || name == REGISTERED_NOT_LISTED*/) {
                KTApp.unblockPage();
                if (regNo == NOT_REGISTERED) {
                    Swal.fire({
                        icon: 'info',
                        html:
                            'Please note <b>sefa</b> requires a business to be registered (excluding sole proprietorships or partnerships).\
                             You can register on the CIPC website if you click <a href="http://www.cipc.co.za/" target="_blank" rel="noopener noreferrer">HERE</a>',
                        focusConfirm: false,
                        confirmButtonText:
                            '<i class="fa fa-thumbs-up"></i> Great!',
                        confirmButtonAriaLabel: 'Thumbs up, great!'
                    }).then(() => {
                        cb(true);
                    });
                } else {
                    cb(true);
                }
            } else {
                let company = getFromCIPC(regNo);
                app.onboard.service.doesCompanyExist(company.cipc.registrationNumber, function (status, result) {
                    KTApp.unblockPage();
                    if (result == null) {
                        cb(true);
                    } else {
                        cb(false);
                    }
                });
            }
        }
        KTApp.blockPage({
            overlayColor: 'blue',
            opacity: 0.1,
            state: 'primary',
            message: app.localize('OW_GetCompanyStatus')
        });
        isCompanyAvailable(function (isAvailable) {
            if (isAvailable == true) {
                cipcChangeCompanyAvailable();
            } else {
                cipcChangeCompanyTaken();
            }
        });
    });

    const START_DATE = '01/01/1950';
    const END_DATE = '01/01/2099';

    $('#reg-date').datepicker({
        format: 'dd/mm/yyyy',
        clearBtn: false,
        autoclose: true,
        startDate: START_DATE,
        endDate: END_DATE
    });

    $('#trading-date').datepicker({
        format: 'dd/mm/yyyy',
        clearBtn: false,
        autoclose: true,
        startDate: START_DATE,
        endDate: END_DATE
        //defaultDate : '01/01/2021'
    });

    $('#trading-date').datepicker().on('changeDate', function (e) {
        KTWizard2.resetField(KTWizard2.PAGE.CompanyProfile, 'startedtradingdate');
    });

    $('#id-company-profile-reg-no').inputmask({
        mask: '9999/999999/99',
        placeholder: ''
    });

    $('#input-uif-number').inputmask({
        mask: '999999999/9'
    });

        _controls.vatRegNumber.format(10);
        _controls.taxRefNumber.format(10);


        let _dto = null;

        let _identityNumber = null;

        let _companyRecordId = null;

        function enable(
            cipcSelect,
            companyName,
            registrationNumber,
            companyType,
            registrationDate,
            tradingDate,
            fullAddress,
            addrLine1,
            addrLine2,
            locality,
            postalCode
        ) {
            $('#id-company-profile-cipc').prop('disabled', cipcSelect ^ true);
            $('#id-company-profile-cname').prop('disabled', companyName ^ true);
            $('#id-company-profile-reg-no').prop('disabled', registrationNumber ^ true);
            $('#id-company-profile-type').prop('disabled', companyType ^ true);
            enableDates(registrationDate, tradingDate);
            $('#id-registered-address').prop('disabled', fullAddress ^ true);
            $('#addr1').prop('disabled', addrLine1 ^ true);
            $('#addr2').prop('disabled', addrLine2 ^ true);
            $('#locality').prop('disabled', locality ^ true);
            $('#postal_code').prop('disabled', postalCode ^ true);
        }

        function enableAll(isEnable) {
            enable(
                isEnable, isEnable, isEnable, isEnable, isEnable, isEnable,
                isEnable, isEnable, isEnable, isEnable, isEnable
            );
        }

        function dtoToForm(dto) {

        }

        function formToDto(dto) {

        }


        function getOwnerCompaniesFunc(cb) {
            app.onboard.service.getOwnerCompanies(_identityNumber, function (status, arr) {

                function addOwnerCompanies(arr) {
                    for (let i = 0, max = arr.length; i < max; i++) {
                        if (getFromCIPC(arr[i].registrationNumber) == null) {
                            companies.push({
                                cipc: arr[i],
                                dto: null,
                                // TODO: Dont forget to add more unique company types.
                                status: (arr[i].companyName != NOT_REGISTERED && arr[i].companyName != REGISTERED_NOT_LISTED)
                                    ? 'RegisteredListed'
                                    : arr[i].companyName
                            });
                        } else {
                            let company = getFromCIPC(arr[i].registrationNumber);
                            let cipc = arr.find((item, idx) => {
                                return getRegNo(company.cipc.registrationNumber) == getRegNo(item.registrationNumber);
                                //return company.cipc.companyName == item.companyName;
                            });
                            if (cipc != null) {
                                company.cipc.status = cipc.status;
                            }
                        }
                    }
                }
                if (status.result == Result.Pass) {
                    addOwnerCompanies(arr);
                    populateCompanyList();
                    let company = getFromCIPC(currCIPC);
                    // TODO: Dont forget to add more unique company types.
                    if (currCIPC == NOT_REGISTERED) {
                        dtoToPageNotRegistered.apply(company.dto);
                    } else if (currCIPC == REGISTERED_NOT_LISTED) {
                        dtoToPageRegisteredNotListed.apply(company.dto);
                    } else {
                        dtoToPage.apply(company.dto);
                    }

                    cb(status);
                } else {
                    cb(AddStatus());
                }
            });
        }


    // Used when editing company from a partial save, or from profile summary page.
    function loadDtoCommon(dto, status, cb) {
        if (status.result == Result.Pass) {
            app.onboard.wizard.companyId = dto.id;
            //companyProfile.initCompanies();
            loaded = false;
            _companyRecordId = dto.smeCompany.id;

            getCompany(dto.smeCompany, function (status, cipcStatus) {
                _identityNumber = app.onboard.owner.dto.owner.identityOrPassport;
                loaded = true;
                //populateCompanyList();
                let company = null;
                switch (cipcStatus) {
                    case 'RegisteredListed': {
                        app.onboard.service.getOwnerCompanies(_identityNumber, (status, payload) => {
                            let company = getFromCIPC(dto.smeCompany.registrationNumber);
                            let cipc = payload.find((item, idx) => {
                                return company.cipc.registrationNumber == item.registrationNumber;
                                //return company.cipc.companyName == item.companyName;
                            });
                            if (cipc != null) {
                                company.cipc.status = cipc.status;
                            }
                            populateCompanyList();
                            company = getFromCIPC(dto.smeCompany.registrationNumber);
                            company.dto = dto.smeCompany;
                            company.dto.propertiesJson = JSON.parse(dto.smeCompany.propertiesJson);
                            company.dto.verificationRecordJson = JSON.parse(dto.smeCompany.verificationRecordJson);
                            dtoToPage.apply(company.dto);
                            //setCIPC(dto.smeCompany.name);
                            // ***
                            setCIPC(dto.smeCompany.registrationNumber);
                            cb(dto, status);
                        });
                        break;
                    }
                    // TODO: Dont forget to add more unique company types.
                    case NOT_REGISTERED: case REGISTERED_NOT_LISTED: {
                        let arr = [{
                            value: companies[0].cipc.companyName,
                            text: companies[0].cipc.companyName == NOT_REGISTERED
                                ? 'Business not registered'
                                : 'Business registered with CIPC, not listed above'
                        }];
                        _controls.name1.flush();
                        _controls.name1.fill(arr);

                        company = getFromCIPC(cipcStatus);
                        company.dto = dto.smeCompany;
                        company.dto.propertiesJson = JSON.parse(dto.smeCompany.propertiesJson);
                        company.dto.verificationRecordJson = JSON.parse(dto.smeCompany.verificationRecordJson);

                        if (cipcStatus == NOT_REGISTERED) {
                            dtoToPageNotRegistered.apply(company.dto);
                        } else if (cipcStatus == REGISTERED_NOT_LISTED) {
                            dtoToPageRegisteredNotListed.apply(company.dto);
                        }
                        // ***
                        setCIPC(cipcStatus);
                        cb(dto, status);
                        break;
                    }
                }
            });
        } else {
            status.result = Result.Fail;
            status.code = 1;
            cb(dto, status);
        }
    }


    function tryGetUserCompanyForEdit(cb) {

        abp.services.app.smeCompaniesAppServiceExt.getSmeCompanyForEditByUser().done(function (dto) {
            let status = AddStatus();
            if (dto == null) {
                status.result = Result.Fail;
            }
            loadDtoCommon(dto, status, function (dto, status) {
                cb(dto, status);
            });
        });
    }

    function loadDtoEdit(cb) {

        loaded = true;
        app.onboard.service.getUserCompany(app.onboard.wizard.companyId, function (status, dto) {
            loadDtoCommon(dto, status, function (dto, status) {
                cb(status);
            });
        });
    }

    function loadDto(cb) {


        function onLoaded(status) {
            cb(status);
        }

        function loadDtoNormal(cb) {
            tryGetUserCompanyForEdit(function (dto, status) {
                if (dto != null) {
                    getOwnerCompaniesFunc(function (status) {
                        let json = dto.smeCompany.propertiesJson;
                        if (json['companyCipcStatus'] == 'RegisteredListed') {
                            //setCIPC(dto.smeCompany.name);
                            // ***
                            setCIPC(dto.smeCompany.registrationNumber);
                        } else {
                            // ***
                            setCIPC(json['companyCipcStatus']);
                        }
                        cb(AddStatus());
                    });
                } else {
                    cb(AddStatus());
                }
            });
        }

        function loadDtoAdd(cb) {
            app.onboard.service.getUserCompanies(function (status, arr) {

                function addUserCompanies(arr) {
                    for (let i = 0, max = arr.length; i < max; i++) {
                        let regNo = arr[i].smeCompany.registrationNumber.replace(/\//g, '');
                        userCompanies.set(regNo);
                    }
                }
                if (status.result == Result.Pass) {
                    addUserCompanies(arr);
                }
                cb(status);
            });
        }

        switch (app.onboard.wizard.mode) {
            case app.onboard.wizard.MODE.Normal:
                loadDtoNormal(onLoaded);
                break;

            case app.onboard.wizard.MODE.Edit:
                loadDtoEdit(onLoaded);
                break;

            case app.onboard.wizard.MODE.Add:
                loadDtoAdd(onLoaded);
                //app.onboard.service.getAvailableCompanies(app.onboard.owner.dto.owner.identityOrPassport, (result, payload) => {
                //    if (payload.length > 0) {
                //        loadDtoAdd(onLoaded);
                //    } else {
                //        let status = AddStatus();
                //        status.result = Result.Fail;
                //        status.message = 'Owner has no companies available';
                //        cb(status);
                //    }
                //});
                break;

            default:
                cb(AddStatus());
                break;
        }
    }

    function getDto(ownerId) {
        // Get current selected company to save to storage.
        let company = getFromCIPC(currCIPC);
        if (company != null) {
            let dto = {};
            dto.ownerId = ownerId;
            dto.propertiesJson = company.dto.propertiesJson;
            pageToDto.apply(dto, company);
            dto.verificationRecordJson = JSON.stringify(dto.verificationRecordJson);
            dto.id = _companyRecordId;
            dto.propertiesJson = JSON.stringify(dto.propertiesJson);
            return dto;
        } else {
            return null;
        }
    }

    function submitDto(cb, ownerId) {
        let status = AddStatus();
        let dto = getDto(ownerId);
        // PageToDto for company???
        if (dto != null) {
            if (dto.registrationDate == null) {
                dto.registrationDate = '';
            }
            if (currCIPC == NOT_REGISTERED || currCIPC == REGISTERED_NOT_LISTED) {
                dto.verificationRecordJson = null;
            }
            abp.services.app.smeCompaniesAppServiceExt.createOrEdit(dto).done(function (result) {
                let status = AddStatus();
                if (result != null) {
                    _companyRecordId = result;
                    let company = getFromCIPC(currCIPC);
                    company.dto.id = result;
                } else {
                    status.result = Result.Fail;
                    status.message = 'No company record written';
                }
                cb(status, result);
            });

        } else {
            status.result = Result.Error;
            status.message = 'Invalid dto ( null )';
            cb(status, -1);
        }
    }

    function init(cb) {

    }

    function validate(foreward, cb) {
        if (foreward == true) {
            let company = getFromCIPC(currCIPC);
            if (company != null) {
                let disable = (
                    helpers.hasObject(company.dto, 'propertiesJson') == true &&
                    helpers.hasObject(company.dto['propertiesJson'], 'industry') == true
                );
                KTWizard2.enable(
                    KTWizard2.PAGE.CompanyProfile,
                    'name-select-company-profile-industry-dummy',
                    disable ^ true
                );

            } else {
                KTWizard2.validateFields(KTWizard2.page.CompanyProfile, ['cipc-lookup'], function (result) {
                    let status = AddStatus();
                    status.result = Result.Fail;
                    status.message = 'Please select a company from the list above';
                    cb(status);
                });
                return;
            }
        }


        KTWizard2.enable(KTWizard2.page.CompanyProfile, 'duplicate-registration-number-name', false);
        let company = getFromCIPC(currCIPC);
        if (company.dto.id != null && company.dto.id > 0) {
            cb(AddStatus());
            return;
        }
        // Get selected company.
        let regno = _controls.registrationNumber.val();
        if (regno.length > 0) {
            app.onboard.service.doesCompanyExist(regno, function (status, result) {
                if (result != null) {
                    let alreadyExists = false;
                    if (app.onboard.wizard.mode != app.onboard.wizard.MODE.Edit) {
                        // Registration number already exists!!!
                        alreadyExists = true;
                    } else {
                        // Registration number collision with a record ( result.id ) different from record being edited ( _companyRecordId ) )
                        if (result.id != _companyRecordId) {
                            alreadyExists = true;
                        }
                    }
                    if (alreadyExists == true) {
                        KTWizard2.enable(KTWizard2.page.CompanyProfile, 'duplicate-registration-number-name', true);
                        // Display custom message in reg number input region!
                        KTWizard2.validateField(KTWizard2.page.CompanyProfile, 'duplicate-registration-number-name', function (page, name, status) {
                        });
                    }
                }
                cb(AddStatus());
            });
        } else {
            cb(AddStatus());
        }
    }

    function attention(from, to, foreward, cb) {

        initAutocomplete();
        if (foreward == false) {
            cb(AddStatus());
        }

        function updateIdentityNumber() {
            // TODO: Try do this another way, like maybe an optional data argument for attention!!!
            if (app.onboard.owner.dto.owner.identityOrPassport != _identityNumber || _identityNumber == null) {
                _identityNumber = app.onboard.owner.dto.owner.identityOrPassport;
                return true;
            } else {
                return false;
            }
        }
        if (updateIdentityNumber() == true) {
            //companyProfile.initCompanies();
            loaded = false;
        }
        // TODO: Replace this with alternate logic.
        if (loaded == true) {
            cb(AddStatus());
        } else {
            companies = [];
            currCIPC = null;
            userCompanies = new Map();

            function getOwnerCompaniesFunc(cb) {
                app.onboard.service.getOwnerCompanies(_identityNumber, function (status, arr) {

                    function addOwnerCompanies(arr) {
                        for (let i = 0, max = arr.length; i < max; i++) {
                            //if (getFromCIPC(arr[i].companyName) == null) {
                            if (getFromCIPC(arr[i].registrationNumber) == null) {
                                companies.push({
                                    cipc: arr[i],
                                    dto: null,
                                    // TODO: Dont forget to add more unique company types.
                                    status: (arr[i].companyName != NOT_REGISTERED && arr[i].companyName != REGISTERED_NOT_LISTED)
                                        ? 'RegisteredListed'
                                        : arr[i].companyName
                                });
                            }
                        }
                    }
                    function removeUserCompanies(arr) {
                        let i = 0;
                        while (i < arr.length) {
                            // Is this an existing company added by the user?
                            if (userCompanies.has(arr[i].registrationNumber) == true) {
                                arr.splice(i, 1);
                            } else {
                                i++;
                            }
                        }
                    }

                    if (status.result == Result.Pass) {
                        removeUserCompanies(arr);
                        addOwnerCompanies(arr);

                        populateCompanyList();
                        let dto = _dtoBuilder.reset();
                        dtoToPage.apply(dto);

                        loaded = true;
                        cb(status);
                    } else {
                        cb(AddStatus());
                    }
                });
            }

            if (app.onboard.wizard.mode == app.onboard.wizard.MODE.Normal) {
                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: app.localize('LoadCompanies')
                });
                getOwnerCompaniesFunc(function (status) {
                    KTApp.unblockPage();
                    cb(status);
                });
            } else {
                getOwnerCompaniesFunc(function (status) {
                    cb(status);
                });
            }
        }
    }

    function neglect(from, to, foreward, cb) {
        if (foreward == true) {
            submitDto(function (status) {
                cb(status);
            }, app.onboard.owner.dto.owner.id);
        } else {
            cb(AddStatus());
        }
    }

    function validateId(identityNumber) {
        return (_identityNumber != null && _identityNumber.length > 0 && identityNumber == _identityNumber);
    }

    function setId(identityNumber) {
        _identityNumber = identityNumber;
    }

    function setCompanyId(companyId) {
        app.onboard.wizard.companyId = companyId;
    }

    function getCurrentDto() {
        let company = getFromCIPC(currCIPC);
        if (company != null && company.dto != null) {
            return company.dto;
        } else {
            return null;
        }
    }

    onboard.company = {
        controls : _controls,
        dtoToForm: dtoToForm,
        formToDto: formToDto,
        loadDto: loadDto,
        loadDtoEdit: loadDtoEdit,
        submitDto: submitDto,
        init: init,
        attention: attention,
        neglect: neglect,
        validate: validate,
        validateId: validateId,
        setId: setId,
        setCompanyId: setCompanyId,
        enable: enable,
        enableAll: enableAll,
        getDto: getDto,
        //getCompanyDto: getCompanyDto,
        getCurrentDto : getCurrentDto,
        dto: _dto,
        autoFillAddrComplete: AutoFillAddrComplete
    };

    let entityTypes = app.listItems.obj.getEntityTypes();
    _controls.entityType.fill(entityTypes);

    app.onboard.industrySector.setSelectCallback(function (args) {

        KTWizard2.resetField(KTWizard2.PAGE.CompanyProfile, 'name-select-company-profile-industry-dummy');
        KTWizard2.enable(KTWizard2.PAGE.CompanyProfile, 'name-select-company-profile-industry-dummy', false);

        let company = getFromCIPC(currCIPC);
        if (helpers.hasProp(company.dto, 'propertiesJson') == false || helpers.isObject(company.dto['propertiesJson']) == false) {
            company.dto['propertiesJson'] = {};
        }
        company.dto.propertiesJson['industry'] = args;
        dtoToPage.industrySummary(args);
    });

    (function () {
        let arr = [];
        smec.companyTypeMap.forEach((obj, key) => {
            arr.push({
                value: key,
                text: obj['text']
            });
        });
        _controls.companyType.flush();
        _controls.companyType.fill(arr);
    })();

})(app.onboard);
