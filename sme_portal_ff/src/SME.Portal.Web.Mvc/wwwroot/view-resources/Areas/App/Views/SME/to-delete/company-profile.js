//function onboardingLoadOwnerProfile() {

    let companyProfile = {

        SOLE_PROPRIETOR: '5a6ab7ce506ea818e04548ad',
        PARTNERSHIP: '5a6ab7d3506ea818e04548b0',

        noRegNoRequired: function (type) {
            return type == companyProfile.SOLE_PROPRIETOR || type == companyProfile.PARTNERSHIP;
        }
        ,
        industrySectorData: [],

        loaded: false,

        companies: [],

        currentId: '',

        ownerId: null,

        id: null,

        loadedDto: null,

        currCIPC: null,

        showProvinceSelect: function (show) {
            if (show == true) {
                $('#id-company-profile-province-div').show();
            } else {
                $('#id-company-profile-province-div').hide();
            }
        },

        setCIPC: function (val) {
            $('#id-company-profile-cipc').val(val);
            companyProfile.currCIPC = val;
        },

        enable: {
            cipc: function (val) {

            },

            type: function (key) {
                let cipc = $('#id-company-profile-cipc').val();
                switch (cipc) {
                    case companyProfile.swalStr.registeredStr:
                        if (companyProfile.noRegNoRequired(key) == true) {
                            $('#id-company-profile-reg-no').prop('disabled', true);
                        } else {
                            $('#id-company-profile-reg-no').prop('disabled', false);
                        }
                        break;

                    case companyProfile.swalStr.notRegisteredStr:
                        $('#id-company-profile-reg-no').prop('disabled', true);
                        break;

                    default:
                        $('#id-company-profile-reg-no').prop('disabled', false);
                        break;
                }
                $('#id-company-profile-type').val(key);
            }
        },

        getDateFromStr: function (dateStr) {
            if (dateStr == '' || dateStr == null) {
                return null;
            } else {
                let date = new Date(dateStr);
                let year = date.getFullYear().toString();
                let month = (date.getMonth() + 1).toString().padStart(2, '0');
                let day = date.getDate().toString().padStart(2, '0');
                return day + '/' + month + '/' + year;
            }
        },

        getAll: function () {
            let catIndex = parseInt($('#id-company-profile-category-select').val());
            let subCatIndex = parseInt($('#id-company-profile-sub-category-select').val());
            let subCatItem = companyProfile.industrySectorData[catIndex].secondary[subCatIndex];
            return {
                cipc: $('#id-company-profile-cipc').val(),
                name: $('#id-company-profile-cname').val(),
                regNo: $('#id-company-profile-reg-no').val(),
                type: $('#id-company-profile-type').val(),
                regDate: $('#id-company-profile-reg-date').val(),
                startDate: $('#id-company-profile-start-date').val(),
                addr: {
                    line1: $('#addr1').val(),
                    line2: $('#addr2').val(),
                    city: $('#locality').val(),
                    code: $('#postal_code').val(),
                    province: $('#id-company-profile-province-select').val()
                },
                beeLevel: $('#id-company-profile-bee-level-select').val(),
                industrySectorKey: subCatItem.key
            }
        },

        getAddress: function () {
            let line1 = $('#addr1').val();
            let line2 = $('#addr2').val();
            let city = $('#locality').val();
            let code = $('#postal_code').val();
            let province = $('#id-company-profile-province-select').val();
            if (province == null) {
                province = '';
            }
            return (
                line1.replace(',', ' ') + ',' +
                line2.replace(',', ' ') + ',' +
                city.replace(',', ' ') + ',' +
                code.replace(',', ' ') + ',' +
                province
            );
        },

        getIndustryKey: function () {
            let catIndex = parseInt($('#id-company-profile-category-select').val());
            let subCatIndex = parseInt($('#id-company-profile-sub-category-select').val());
            if (isNaN(catIndex) == true || isNaN(subCatIndex) == true) {
                return '';
            } else {
                let subCatItem = app.common.industrySector.industrySectorData[catIndex].secondary[subCatIndex];
                return subCatItem.key;
            }
        },

        setIndustrySelect: function (industryKey, resetSubSector) {
            if (industryKey == '') {
                $('#id-company-profile-category-select').val('');
                $('#id-company-profile-sub-category-select').val('');
                $('#id-company-profile-industry-sub-sector-div').hide();
            } else {
                app.common.industrySector.populateFromKey('id-company-profile-category-select', 'id-company-profile-sub-category-select', industryKey);
                $('#id-company-profile-industry-sub-sector-div').show();
                if (resetSubSector == true) {
                    $('#id-company-profile-sub-category-select').val('');
                }
            }
        },

        updateProvince: function (key, areaCode) {
            province = app.common.gmap.areaCodeToProvince(areaCode);
            if (province != null) {
                $('#id-company-profile-province-select').val(province.key);
                $('#id-company-profile-province-select').prop('disabled', true);
            } else {
                $('#id-company-profile-province-select').val('');
                $('#id-company-profile-province-select').prop('disabled', false);
            }
        },

        updateRegNumber: function (key, regNo = null) {
            let REGISTERED_NOT_LISTED = companyProfile.swalStr.registeredStr;

            let cipc = $('#id-company-profile-cipc').val();
            let type = key;
            let mask = '';
            let placeholder = '';
            if (cipc == REGISTERED_NOT_LISTED && companyProfile.noRegNoRequired(type) == false) {
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
        },

        emptyToDto: function (dto) {
            dto.registrationNumber = '';
            dto.name = '';
            dto.type = '';
            dto.registrationDate = companyProfile.getDateNowStr();
            // This field does not exist in the record returned by cipcEnterprisesByCompany.
            dto.startedTradingDate = '';//companyProfile.getDateNowStr();
            dto.registeredAddress = '';
            // All check box's default to unchecked.
            dto.customers = ",,,,,";
            // Set default key for Don't know.
            dto.beeLevel = '';
            dto.industries = '';
            dto.verificationRecordJson = '...';
            dto.userId = 1;
            dto.id = null;
        },

        notRegisteredToDto: function (dto) {
            dto.registrationNumber = '';
            dto.name = '';
            dto.type = '';
            dto.registrationDate = companyProfile.getDateNowStr();
            // This field does not exist in the record returned by cipcEnterprisesByCompany.
            dto.startedTradingDate = '';
            dto.registeredAddress = '';
            // All check box's default to unchecked.
            dto.customers = ",,,,,";
            // Set default key for Don't know.
            dto.beeLevel = '';
            dto.industries = '';
            dto.verificationRecordJson = companyProfile.swalStr.notRegisteredStr;
            dto.userId = 1;
            dto.id = null;
        },

        registeredNotListedToDto: function (dto) {
            dto.registrationNumber = '';
            dto.name = '';
            dto.type = '';
            dto.registrationDate = companyProfile.getDateNowStr();
            // This field does not exist in the record returned by cipcEnterprisesByCompany.
            dto.startedTradingDate = '';
            dto.registeredAddress = '';
            // All check box's default to unchecked.
            dto.customers = ",,,,,";
            // Set default key for Don't know.
            dto.beeLevel = '';
            dto.industries = '';
            dto.verificationRecordJson = companyProfile.swalStr.registeredStr;
            dto.userId = 1;
            dto.id = null;
        },

        companyToDto: function (company, data, verificationRecordJson, userId, recordId) {
            company.dto.registrationNumber = company.cipc.registrationNumber;
            company.dto.name = data.enterpriseName;
            company.dto.type = data.companyRegistrationType;
            company.dto.registrationDate = data.registrationDate;
            // This field does not exist in the record returned by cipcEnterprisesByCompany.
            company.dto.startedTradingDate = companyProfile.getDateNowStr();

            company.dto.registeredAddress =
                data.addressLine1 + ', ' +
                data.addressLine2 + ', ' +
                data.city + ', ' +
                data.areaCode + ', ' +
                data.province;
            // All check box's default to unchecked.
            company.dto.customers = ",,,,,";
            // Set default key for Don't know.
            company.dto.beeLevel = '';
            company.dto.industries = '';
            company.dto.verificationRecordJson = verificationRecordJson;
            company.dto.userId = userId;
            company.dto.id = recordId;
        },

        formToDto: function (dto) {
            dto.name = $('#id-company-profile-cname').val();
            dto.registrationNumber = $('#id-company-profile-reg-no').val();
            dto.type = $('#id-company-profile-type').val();
            dto.registrationDate = $('#reg-date').datepicker('getDate');
            dto.startedTradingDate = $('#trading-date').datepicker('getDate');

            dto.registeredAddress = companyProfile.getAddress();

            dto.beeLevel = $('#id-company-profile-bee-level-select').val();
            if (dto.beeLevel == null) {
                dto.beeLevel = '';
            }
            dto.industries = companyProfile.getIndustryKey();

            dto.customers = ',';

            dto.webSite = 'No';

            dto.userId = 1;
            dto.id = null;
        },

        dtoToForm: function (dto) {
            function dtoAddrToFormAddr(registeredAddress) {

                companyProfile.resetAddress();
                // TODO: Rename and move to another place.
                if (registeredAddress == null || registeredAddress == 'undefined') {
                    return false;
                } else {
                    $('#id-registered-address').val(registeredAddress);
                    let arr = registeredAddress.split(',');

                    let ids = ['#addr1', '#addr2', '#locality', '#postal_code'];
                    for (let i = 0, max = arr.length; i < max; i++) {
                        if (arr[i] != null && arr[i] != 'undefined') {
                            $(ids[i]).val(arr[i]);
                        }
                    }

                    $('#addr1').val(arr[0]);
                    $('#addr2').val(arr[1]);
                    $('#locality').val(arr[2]);
                    $('#postal_code').val(arr[3]);

                    // TODO: Make sure this is a valid array cell!!!
                    companyProfile.updateProvince(arr.length > 4 ? arr[4] : '', arr[3]);
                }
            }

            let cipc = $('#id-company-profile-cipc').val();

            if (cipc != companyProfile.swalStr.notRegisteredStr && cipc != companyProfile.swalStr.registeredStr && cipc != '' && cipc != null) {
                $('#id-company-profile-reg-no').inputmask({
                    mask: '9999/999999/99'
                });
                $('#id-company-profile-cname').val(dto.name);
                $('#id-company-profile-reg-no').val(dto.registrationNumber);
                $('#id-company-profile-cname').prop('disabled', true);
                $('#id-company-profile-reg-no').prop('disabled', true);
            } else {
                if (dto.name == '') {
                    $('#id-company-profile-cname').attr('placeholder', app.localize('CompanyNamePlaceholderRequired'));
                }
                $('#id-company-profile-cname').val(dto.name);

                if (dto.type == '' || dto.type == null) {
                    companyProfile.setTypePlaceholder(app.localize('CompanyTypeSelectPlaceholderWithCIPC'));
                }
                $('#id-company-profile-type').val(dto.type);

                companyProfile.updateRegNumber(dto.type, dto.registrationNumber);

                let disabled =
                    cipc == null ||
                    dto.type == '' ||
                    dto.type == null ||
                    cipc == companyProfile.swalStr.notRegisteredStr ||
                    (cipc == companyProfile.swalStr.registeredStr && companyProfile.noRegNoRequired(dto.type) == true);
                $('#id-company-profile-reg-no').prop('disabled', disabled);

                if (dto.registrationNumber == '' && (dto.type == '' || dto.type == null)) {
                    $('#id-company-profile-reg-no').attr('placeholder', app.localize('CompanyRegNoPlaceholderWithoutCompanyType'));
                }

                if (cipc == companyProfile.swalStr.notRegisteredStr ||
                    (cipc == companyProfile.swalStr.registeredStr && companyProfile.noRegNoRequired(dto.type) == true)) {
                    $('#id-company-profile-reg-no').attr('placeholder', app.localize('CompanyRegNumberPlaceholderNoRegNumberRequired'));
                    $('#id-company-profile-reg-no').val('');
                    $('#id-company-profile-reg-no').prop('disabled', true);
                }
            }
            $('#id-company-profile-reg-no').val(dto.registrationNumber);

            dtoAddrToFormAddr(dto.registeredAddress);

            let beeLevel = dto.beeLevel.length != 24 ? "" : dto.beeLevel;
            $('#id-company-profile-bee-level-select').val(beeLevel);

            let industryKey = dto.industries.length != 24 ? "" : dto.industries;
            companyProfile.setIndustrySelect(industryKey, false);

            let dateStr1 = companyProfile.getDateFromStr(dto.registrationDate);
            let dateStr2 = companyProfile.getDateFromStr(dto.startedTradingDate);
            companyProfile.setDates(dateStr1, dateStr2);
            companyProfile.enableDates(false, true);

            if (cipc == companyProfile.swalStr.notRegisteredStr) {
                dto.registrationDate = '';
                $('#reg-date').datepicker('update', '');
            }
        },
        // TODO: Delete this function soon!

        dtoToCompany: function (dto, company) {
            let src = dto;
            let dst = company;

            dst.cipc.registrationNumber = src.registrationNumber;
            dst.details = {};
            dst.details.enterpriseName = src.name;
            dst.details.companyRegistrationType = src.type;
            dst.details.registeredAddress = src.registeredAddress;
            dst.details.registrationDate = src.registrationDate;
            dst.details.startedTradingDate = src.startedTradingDate;

            let addrArr = src.registeredAddress.split(',');
            dst.details.addressLine1 = addrArr[0];
            dst.details.addressLine2 = addrArr[1];
            dst.details.city = addrArr[2];
            dst.details.areaCode = parseInt(addrArr[3]);
            dst.details.province = addrArr[4];
        },

        swalStr: {
            registeredStr: 'Business registered with CIPC, not listed above',
            notRegisteredStr: 'Business not yet registered'
        },

        getFromCIPC: function (name) {
            let arr = companyProfile.companies;
            for (let i = 0; i < arr.length; i++) {
                if (name == arr[i].cipc.companyName) {
                    return arr[i];
                }
            }
            return null;
        },

        getCompany: function (dto, cb) {
            let temp = {
                cipc: null,
                dto: null
            };
            temp.cipc = {
                companyName: dto.name,
                regNo: dto.registrationNumber,
                regType: dto.type
            };
            let propJson = JSON.parse(dto.propertiesJson);
            switch (propJson.companyCipcStatus) {
                case 'RegisteredNotListed':
                    temp.cipc.companyName = companyProfile.swalStr.registeredStr;
                    break;

                case 'NotRegistered':
                    temp.cipc.companyName = companyProfile.swalStr.notRegisteredStr;
                    break;

                case 'RegisteredListed':
                    temp.cipc.companyName = dto.name;
                    break;
            }
            if (companyProfile.getFromCIPC(temp.cipc.companyName) == null) {
                companyProfile.companies.push(temp);
            }
            if (cb != null) {
                cb(AddStatus());
            }
        },

        getCompanyDetailsFunc: function (company, cb) {
            // --- We have already retreived these details.
            if (company != null && company.dto != null) {
                companyProfile.populateCompanyDetails(company);
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
                        company.dto = {};
                        company.dto.verificationRecordJson = obj;
                        companyProfile.companyToDto(company, obj, obj, 1, null);
                        if (app.onboard.wizard.mode != app.onboard.wizard.MODE.Edit) {
                            company.dto.startedTradingDate = company.dto.registrationDate;
                        }
                        companyProfile.populateCompanyDetails(company);
                    }
                    cb(status);
                });
            }
        },

        setDates: function (regDate, startDate) {
            if (regDate != null) {
                let key = $('#id-company-profile-type').val();
                if (key == companyProfile.SOLE_PROPRIETOR) {
                    $('#reg-date').datepicker('value', '');
                } else {
                    $('#reg-date').datepicker('update', regDate);
                }
            }
            if (startDate != null) {
                $('#trading-date').datepicker('update', startDate);
            }
        },

        getDateNowStr: function () {
            let today = new Date();
            return today.toString();
        },

        setDateToday: function () {
            let today = new Date();
            companyProfile.setDates(today.toString(), today.toString());
        },

        enableDates: function (regDate, startDate, soleProp = false) {
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
        },

        resetAddress: function () {
            $('#addr1').val('');
            $('#addr2').val('');
            $('#locality').val('');
            $('#postal_code').val('');
            $('#administrative_area_level_1').val('');
            $('#id-registered-address').val('');
        },

        setCompanyNameHeaderAndFooter(headerStr, footerStr) {
            // --- TODO: Cache these element references somewhere!
            let header = document.getElementById('id-company-profile-cname-header-label');
            let footer = document.getElementById('id-company-profile-cname-footer-span');
            header.innerText = headerStr;
            footer.innerText = footerStr;
        },

        populateCompanyDetails: function (company) {
            companyProfile.dtoToForm(company.dto);
            $('id-company-profile-cipc').val(company.dto.name);

            smec.flushSelect('id-company-profile-type');

            let arr = [];
            let name = smec.getNameFromCpbAlias(company.dto.type);
            name = name == null ? company.dto.type : name
            arr.push(name);

            // TODO: Replace this from something from sme-common!!!
            smec.fillSelectArr('id-company-profile-type', arr);
            $('#id-company-profile-type').val(name);

            companyProfile.setCompanyNameHeaderAndFooter('Business Name', 'As was registered with CIPC');

            $('#id-company-profile-cname').prop('disabled', true);
            $('#id-company-profile-reg-no').prop('disabled', true);
            $('#id-company-profile-type').prop('disabled', true);
            companyProfile.enableDates(false, true);
        },

        setTypePlaceholder: function (placeHolder) {
            let elem = document.getElementById('id-company-profile-type');
            elem[0].textContent = placeHolder;
        },

        populateEmptyDetails: function (company = null) {
            companyProfile.setCIPC('');

            if (company.dto == null) {
                company.dto = {};
                companyProfile.emptyToDto(company.dto);
            }

            companyProfile.dtoToForm(company.dto);

            let cipc = $('#id-company-profile-cipc').val();
            $('#id-company-profile-cname').prop('disabled', cipc == null);
            $('#id-company-profile-cname').attr('placeholder', app.localize('CompanyNamePlaceholderWithoutCIPC'));

            companyProfile.setTypePlaceholder(app.localize('CompanyTypeSelectPlaceholderWithoutCIPC'));
            $('#id-company-profile-type').prop('disabled', cipc == null);

            companyProfile.enableDates(false, false);
        },

        populateRegisteredDetails: function (company = null) {
            companyProfile.setCIPC(companyProfile.swalStr.registeredStr);
            companyProfile.populateCompanyTypeList();

            if (company.dto == null) {
                company.dto = {};
                companyProfile.registeredNotListedToDto(company.dto);
            }

            companyProfile.dtoToForm(company.dto);

            let cipc = $('#id-company-profile-cipc').val();
            $('#id-company-profile-cname').prop('disabled', false);
            let type = $('#id-company-profile-type').val();
            $('#id-company-profile-type').prop('disabled', false);

            $('#id-company-profile-reg-no').prop('disabled', false);

            companyProfile.enableDates(true, true, type == companyProfile.SOLE_PROPRIETOR);

            if (company && company.dto.startedTradingDate != '') {
                let dateStr1 = companyProfile.getDateFromStr(company.dto.registrationDate);
                let dateStr2 = companyProfile.getDateFromStr(company.dto.startedTradingDate);
                companyProfile.setDates(dateStr1, dateStr2);
            }
            companyProfile.setCompanyNameHeaderAndFooter('Business Name', 'As was registered with CIPC');

            if (company.dto.startedTradingDate == '' || company.dto.startedTradingDate == null) {
                company.dto.startedTradingDate = '';
                $('#trading-date').datepicker('update', '');
            }
        },

        populateNotRegisteredDetails: function (company = null) {
            companyProfile.setCIPC(companyProfile.swalStr.notRegisteredStr);
            companyProfile.populateCompanyTypeList();

            if (company.dto == null) {
                company.dto = {};
                companyProfile.notRegisteredToDto(company.dto);
            }

            companyProfile.dtoToForm(company.dto);


            let cipc = $('#id-company-profile-cipc').val();
            $('#id-company-profile-cname').prop('disabled', false);

            $('#id-company-profile-reg-no').prop('disabled', true);
            $('#id-company-profile-type').prop('disabled', false);

            companyProfile.setDateToday();

            companyProfile.enableDates(false, true);

            if (company && company.dto.startedTradingDate != '') {
                let dateStr = companyProfile.getDateFromStr(company.dto.startedTradingDate);
                companyProfile.setDates(null, dateStr);
            }

            companyProfile.setCompanyNameHeaderAndFooter('Trading Name', '');

            if (company.dto.startedTradingDate == '' || company.dto.startedTradingDate == null) {
                company.dto.startedTradingDate = '';
                $('#trading-date').datepicker('update', '');
            }

            $('#reg-date').datepicker('update', '');
        },

        populateCompanyTypeList: function () {
            smec.flushSelect('id-company-profile-type');
            smec.fillSelect('id-company-profile-type', smec.companyTypeMap);
        },

        setCipcStatus: function (cipc) {
            //if (cipc.status != 'In Business') {
            if (cipc.status != '03') {
                return cipc.companyName;// + ' - (' + cipc.status + ')';
            } else {
                return cipc.companyName;
            }
        },

        populateCompanyList: function () {
            let arr1 = [];
            let arr2 = [];
            for (let i = 0; i < companyProfile.companies.length; i++) {
                if (companyProfile.companies[i].cipc.companyName == '...') {
                    continue;
                } else
                    if (companyProfile.companies[i].cipc.companyName == companyProfile.swalStr.notRegisteredStr) {
                        arr2.push({
                            value : companyProfile.companies[i].cipc.companyName,
                            text : companyProfile.companies[i].cipc.companyName
                        });
                    } else
                        if (companyProfile.companies[i].cipc.companyName == companyProfile.swalStr.registeredStr) {
                            arr2.push({
                                value: companyProfile.companies[i].cipc.companyName,
                                text: companyProfile.companies[i].cipc.companyName
                            });
                            //arr2.push(companyProfile.companies[i].cipc.companyName);
                        } else {
                            let value = companyProfile.companies[i].cipc.companyName;
                            let text = companyProfile.setCipcStatus(companyProfile.companies[i].cipc)
                            let status = companyProfile.companies[i].cipc.status;
                            arr1.push({
                                value : value,
                                text : text,
                                //disabled: status != 'In Business'
                                disabled: status != '03'
                            });
                            //arr1.push(name);
                        }
            }
            arr1.sort((a, b) => {
                return a.text > b.text ? 1 : -1;
            });
            arr2.sort((a, b) => {
                return a.text > b.text ? 1 : -1;
            });
            let arr = [];
            arr1.forEach(function (item, idx) {
                arr.push(item);
            });
            arr2.forEach(function (item, idx) {
                arr.push(item);
            });

            let select = app.control.select('cipc-lookup', 'id-company-profile-cipc');
            select.flush();
            select.fill(arr, (elem, item) => {
                if (item.disabled == true) {
                    elem.setAttribute('disabled', 'true');
                    elem.style.backgroundColor = '#F5F5F5';
                }
            });
        },

        initCompanies: function () {
            companyProfile.loaded = false;
            companyProfile.companies = [];

            let temp0 = {
                cipc: {},
                dto: null
            };
            temp0.cipc.companyName = '...';
            companyProfile.companies.push(temp0);

            if (app.onboard.wizard.mode == app.onboard.wizard.MODE.Add || app.onboard.wizard.mode == app.onboard.wizard.MODE.Normal) {
                let temp1 = {
                    cipc: {},
                    dto: null
                };
                temp1.cipc.companyName = companyProfile.swalStr.registeredStr;
                companyProfile.companies.push(temp1);
                let temp2 = {
                    cipc: {},
                    dto: null
                };
                temp2.cipc.companyName = companyProfile.swalStr.notRegisteredStr;
                companyProfile.companies.push(temp2);
            }
            let beeLevel = '';
            $('#id-company-profile-bee-level-select').val(beeLevel);

            companyProfile.setIndustrySelect('', true);
        },

        _userCompanies: new Map(),

        loadFromDto: function (ownerId, cb) {
            if (app.onboard.wizard.mode == app.onboard.wizard.MODE.Add) {
            }
            else
                if (app.onboard.wizard.mode == app.onboard.wizard.MODE.Edit) {
                } else {
                    cb(AddStatus());
                }
        },

        autoFillAddrComplete: function (addressComponents) {
            // TODO: Make sure this cell 5 is good and valid!
            companyProfile.updateProvince(addressComponents['province'], addressComponents['code']);

            KTWizard2.validateField(KTWizard2.PAGE.CompanyProfile, 'regaddr1');
            KTWizard2.validateField(KTWizard2.PAGE.CompanyProfile, 'citytown');
            KTWizard2.validateField(KTWizard2.PAGE.CompanyProfile, 'postalcode');
            KTWizard2.validateField(KTWizard2.PAGE.CompanyProfile, 'companyProfileProvinceSelect');
        },

        addCompany: function (name) {
            let company = {
                cipc: {
                    companyName: name
                },
                dto: null
            };
            companyProfile.companies.push(company);
            return company;
        },

        mode: 0
    };

    (function CompanyProfile() {

        smec.fillSelect('id-company-profile-province-select', smec.provinceMap);

        $('#id-company-profile-type').change(function (args) {
            let key = $('#id-company-profile-type').val();
            companyProfile.enable.type(key);

            let regNo = $('#id-company-profile-reg-no').val();
            companyProfile.updateRegNumber(key, regNo);

            let type = $('#id-company-profile-type').val();
            let cipc = $('#id-company-profile-cipc').val();
            let disabled =
                cipc == null ||
                type == '' ||
                cipc == companyProfile.swalStr.notRegisteredStr ||
                (cipc == companyProfile.swalStr.registeredStr && companyProfile.noRegNoRequired(type) == true);
            $('#id-company-profile-reg-no').prop('disabled', disabled);

            if (cipc == companyProfile.swalStr.notRegisteredStr ||
                (cipc == companyProfile.swalStr.registeredStr && companyProfile.noRegNoRequired(type) == true)) {
                $('#id-company-profile-reg-no').attr('placeholder', app.localize('CompanyRegNumberPlaceholderNoRegNumberRequired'));
                $('#id-company-profile-reg-no').val('');
                $('#id-company-profile-reg-no').prop('disabled', true);
            }
            // TODO: Refactor!!!
            let name = $('#id-company-profile-cipc').val();
            if (key == companyProfile.SOLE_PROPRIETOR) {
                $('#reg-date').datepicker('update', '');
                if (name == companyProfile.swalStr.registeredStr) {
                    companyProfile.enableDates(false, true);
                }
            } else {
                let today = new Date();
                $('#reg-date').datepicker('update', today.toString());
                if (name == companyProfile.swalStr.registeredStr) {
                    companyProfile.enableDates(true, true);
                }
            }
            if (cipc == companyProfile.swalStr.notRegisteredStr) {
                $('#reg-date').datepicker('update', '');
            }
        });

        $('#id-company-profile-cipc').change(function (e) {

            let currName = companyProfile.currCIPC == null ? '' : companyProfile.currCIPC;

            function cipcChangeCompanyAvailable() {
                let name = $('#id-company-profile-cipc').val();
                let company = companyProfile.getFromCIPC(name);

                $('#id-company-profile-type').prop('disabled', false);

                // Update associated dto to reflect the form data for current CIPC name.
                if (companyProfile.currCIPC != null && companyProfile.currCIPC != '') {
                    let company = companyProfile.getFromCIPC(companyProfile.currCIPC);
                    companyProfile.formToDto(company.dto);
                }
                // Save the new selected CIPC name.
                companyProfile.currCIPC = name;

                function cipcChangeCompanyNotRegistered() {
                    app.onboard.company.enableAll(true);
                    let company = companyProfile.getFromCIPC(name);
                    company.alreadyExists = false;
                    companyProfile.populateNotRegisteredDetails(company);
                }

                function cipcChangeCompanyRegisteredNotListed() {
                    app.onboard.company.enableAll(true);
                    let company = companyProfile.getFromCIPC(name);
                    company.alreadyExists = false;
                    companyProfile.populateRegisteredDetails(company);
                }

                function cipcChangeCompanyRegisteredListed() {
                    let company = companyProfile.getFromCIPC(name);
                    if (company != null) {
                        app.onboard.company.enableAll(true);
                        companyProfile.getCompanyDetailsFunc(company, function (status) {
                            if (status.result == Result.Fail) {
                                companyProfile.currCIPC = null;
                                $('#id-company-profile-cipc').val('');
                                swal.fire({
                                    title: app.localize('CIPCDetailsNotFound'),
                                    icon: 'info',
                                    showConfirmButton: false
                                });
                            } else {
                                company.alreadyExists = false;
                                company.existingDto = null;
                            }
                        });
                    }
                }

                switch (name) {
                    case companyProfile.swalStr.notRegisteredStr:
                        cipcChangeCompanyNotRegistered();
                        break;

                    case companyProfile.swalStr.registeredStr:
                        cipcChangeCompanyRegisteredNotListed();
                        break;

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
                let name = $('#id-company-profile-cipc').val();
                if (name == companyProfile.swalStr.notRegisteredStr || name == companyProfile.swalStr.registeredStr) {
                    cb(true);
                } else {
                    let company = companyProfile.getFromCIPC(name);
                    app.onboard.service.doesCompanyExist(company.cipc.registrationNumber, function (status, result) {
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
                KTApp.unblockPage();
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
            KTWizard2.resetField(KTWizard2.PAGE.CompanyProfile,'startedtradingdate');
        });

        $('#id-company-profile-reg-no').inputmask({
            mask: '9999/999999/99',
            placeholder: ''
        });

        // Only needs to be done once on page load.
        app.common.industrySector.populateIndustrySector('id-company-profile-category-select');

        $('#id-company-profile-category-select').change(function (e) {
            let index = $('#id-company-profile-category-select').val();
            app.common.industrySector.populateIndustrySubSectorFromIndex('id-company-profile-sub-category-select', index);
            $('#id-company-profile-industry-sub-sector-div').show();
        });
    })();

    if (app.onboard == undefined) {
        app.onboard = {};
    }

    app.onboard.company = null;

    (function (onboard) {

        const cipclookup = 'cipc-lookup';
        const cname = 'cname';
        const regno = 'regno';
        const companytype = 'companyType';
        const registrationdate = 'registrationdate';
        const startedtradingdate = 'startedtradingdate';
        const registeredAddress = 'name-registered-address';
        const regaddr1 = 'regaddr1';
        const regaddr2 = 'regaddr2';
        const citytown = 'citytown';
        const postalcode = 'postalcode';
        const province = 'companyProfileProvinceSelect';
        const industrysector = 'industrySector';
        const industrysubsector = 'industrySubSector';
        const beelevel = 'beeLevel';

        let _controls = {
            cipclookup: app.control.select(cipclookup),
            cname: app.control.input(cname),
            regno: app.control.input(regno),
            companytype: app.control.select(companytype),
            // TODO: dateinput???
            registrationdate: app.control.input(registrationdate),
            startedtradingdate: app.control.input(startedtradingdate),
            registeredAddress: app.control.input(registeredAddress),
            regaddr1: app.control.input(regaddr1),
            regaddr2: app.control.input(regaddr2),
            citytown: app.control.input(citytown),
            postalcode: app.control.input(postalcode),
            province: app.control.select(province),
            industrysector: app.control.select(industrysector),
            industrysubsector: app.control.select(industrysubsector),
            beelevel: app.control.select(beelevel)
        };

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
            custIndividuals,
            custInformalBusiness,
            custSMMEs,
            custLargeBusiness,
            custGovernment,
            custOther,
            custOtherInput,
            doesHaveWebsiteYes,
            doesHaveWebsiteNo,
            websiteInput,
            beeSelect,
            categorySelect,
            subCategorySelect,
            fullAddress,
            addrLine1,
            addrLine2,
            locality,
            postalCode,
            provinceSelect
        ) {
            $('#id-company-profile-cipc').prop('disabled', cipcSelect ^ true);
            $('#id-company-profile-cname').prop('disabled', companyName ^ true);
            $('#id-company-profile-reg-no').prop('disabled', registrationNumber ^ true);
            $('#id-company-profile-type').prop('disabled', companyType ^ true);
            companyProfile.enableDates(registrationDate, tradingDate);

            $('#id-company-profile-bee-level-select').prop('disabled', beeSelect ^ true);
            $('#id-company-profile-category-select').prop('disabled', categorySelect ^ true);
            $('#id-company-profile-sub-category-select').prop('disabled', subCategorySelect ^ true);
            $('#id-registered-address').prop('disabled', fullAddress ^ true);
            $('#addr1').prop('disabled', addrLine1 ^ true);
            $('#addr2').prop('disabled', addrLine2 ^ true);
            $('#locality').prop('disabled', locality ^ true);
            $('#postal_code').prop('disabled', postalCode ^ true);
            //$('#id-company-profile-province-select').prop('disabled', provinceSelect ^ true);
        }

        function enableAll(isEnable) {
            enable(
                isEnable, isEnable, isEnable, isEnable, isEnable,
                isEnable, isEnable, isEnable, isEnable, isEnable,
                isEnable, isEnable, isEnable, isEnable, isEnable,
                isEnable, isEnable, isEnable, isEnable, isEnable,
                isEnable, isEnable, isEnable, isEnable, isEnable
            );
        }

        function dtoToForm(dto) {

        }

        function formToDto(dto) {

        }

        function loadDtoEdit(cb) {

            companyProfile.loaded = true;

            app.onboard.service.getUserCompany(app.onboard.wizard.companyId, function (status, dto) {
                if (status.result == Result.Pass) {
                    companyProfile.initCompanies();

                    _companyRecordId = dto.smeCompany.id;
                    companyProfile.getCompany(dto.smeCompany, function (status) {

                        _identityNumber = app.onboard.owner.dto.owner.identityOrPassport;

                        let propJson = JSON.parse(dto.smeCompany.propertiesJson);

                        function translateMatchCriteria(matchCriteria) {
                            let temp = {};
                            matchCriteria.forEach(function (obj, idx) {
                                temp[obj.name] = obj.value;
                            });
                            return temp;
                        }
                        //delete propJson.matchCriteriaJson;
                        if (propJson.hasOwnProperty('matchCriteriaJson') == true) {
                            propJson.matchCriteriaJson = translateMatchCriteria(propJson.matchCriteriaJson);
                        }

                        dto.smeCompany.propertiesJson = JSON.stringify(propJson);


                        //_identityNumber = app.onboard.owner.dto.owner.identityOrPassport;
                        companyProfile.loaded = true;

                        switch (propJson.companyCipcStatus) {
                            case 'RegisteredNotListed': {
                                companyProfile.populateCompanyList();
                                let company = companyProfile.getFromCIPC(companyProfile.swalStr.registeredStr);
                                company.alreadyExists = false;
                                company.dto = dto.smeCompany;
                                companyProfile.populateRegisteredDetails(company);
                                companyProfile.setCIPC(companyProfile.swalStr.registeredStr);
                                cb(AddStatus());
                                break;
                            }

                            case 'NotRegistered': {
                                companyProfile.populateCompanyList();
                                let company = companyProfile.getFromCIPC(companyProfile.swalStr.notRegisteredStr);
                                company.alreadyExists = false;
                                company.dto = dto.smeCompany;
                                companyProfile.populateNotRegisteredDetails(company);
                                companyProfile.setCIPC(companyProfile.swalStr.notRegisteredStr);
                                cb(AddStatus());
                                break;
                            }

                            case 'RegisteredListed': {
                                app.onboard.service.getOwnerCompanies(_identityNumber, (status, payload) => {
                                    let company = companyProfile.getFromCIPC(dto.smeCompany.name);
                                    let cipc = payload.find((item, idx) => {
                                        return company.cipc.companyName == item.companyName;
                                    });
                                    if (cipc != null) {
                                        company.cipc.status = cipc.status;
                                    }
                                    companyProfile.populateCompanyList();
                                    company.alreadyExists = false;
                                    company.dto = dto.smeCompany;
                                    let obj = smec.companyTypeFromKey(company.dto.type);
                                    company.dto.type = obj.text;
                                    company.dto.verificationRecordJson = JSON.parse(dto.smeCompany.verificationRecordJson);
                                    companyProfile.populateCompanyDetails(company);
                                    companyProfile.setCIPC(dto.smeCompany.name);
                                    cb(AddStatus());
                                });
                                break;
                            }
                        }
                    });
                } else {
                    cb(status);
                }
            });
        }

        function loadDto(cb) {

            function loadDtoNormal(cb) {
                cb(AddStatus());
            }

            function loadDtoAdd(cb) {
                app.onboard.service.getUserCompanies(function (status, arr) {

                    function addUserCompanies(arr) {
                        for (let i = 0, max = arr.length; i < max; i++) {
                            let regNo = arr[i].smeCompany.registrationNumber.replace(/\//g, '');
                            companyProfile._userCompanies.set(regNo);
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
                    loadDtoNormal(cb);
                    break;

                case app.onboard.wizard.MODE.Edit:
                    loadDtoEdit(cb);
                    break;

                case app.onboard.wizard.MODE.Add:
                    loadDtoAdd(cb);
                    break;

                default:
                    cb(AddStatus());
                    break;
            }
        }

        function updateMatchCriteriaJson(controlMap, cb = null) {
            let company = companyProfile.getFromCIPC(companyProfile.currCIPC);
            if (company != null) {
                let propertiesJson = null;
                if (company.dto.propertiesJson == undefined) {
                    propertiesJson = {
                        companyCipcStatus: null,
                        matchCriteriaJson: {}
                    };
                } else {
                    propertiesJson = JSON.parse(company.dto.propertiesJson);
                }
                if (propertiesJson.hasOwnProperty('matchCriteriaJson') == false) {
                    propertiesJson.matchCriteriaJson = {};
                }
                controlMap.forEach(function (obj, key) {
                    let name = key;
                    if (cb != null) {
                        name = cb(key);
                    }
                    if (propertiesJson.matchCriteriaJson.hasOwnProperty(name) == true) {
                        propertiesJson.matchCriteriaJson[name] = obj.control.val();
                    } else {
                        propertiesJson.matchCriteriaJson[name] = obj.control.val();
                    }
                });
                company.dto.propertiesJson = JSON.stringify(propertiesJson);
                return true;
            } else {
                return false;
            }
        }


        function getDto(ownerId) {
            // Get current selected company to save to storage.
            let company = companyProfile.getFromCIPC(companyProfile.currCIPC);
            if (company != null) {
                let dto = {};
                dto.ownerId = ownerId;
                if (company.alreadyExists == true) {
                    dto = company.existingDto;
                } else {
                    companyProfile.formToDto(dto);
                    dto.verificationRecordJson = JSON.stringify(company.dto.verificationRecordJson);
                    dto.id = _companyRecordId;

                    let propertiesJson = {
                        companyCipcStatus: null,
                        matchCriteriaJson: null
                    };
                    if (company.dto.hasOwnProperty('propertiesJson') == true) {
                        propertiesJson = JSON.parse(company.dto.propertiesJson);
                    }
                    propertiesJson.companyCipcStatus = null;

                    switch (company.cipc.companyName) {
                        case companyProfile.swalStr.registeredStr:
                            propertiesJson.companyCipcStatus = "RegisteredNotListed";
                            dto.verificationRecordJson = null;
                            break;

                        case companyProfile.swalStr.notRegisteredStr:
                            dto.registrationDate = '';
                            propertiesJson.companyCipcStatus = "NotRegistered";
                            dto.verificationRecordJson = null;
                            break;

                        default:
                            propertiesJson.companyCipcStatus = "RegisteredListed";
                            let key = smec.keyFromCompanyAlias(dto.type);
                            if (key == null) {
                                key = smec.keyFromCompanyType(dto.type);
                            }
                            if (key == null) {
                                key = 'baadf00d';
                            }
                            dto.type = key;
                            break;
                    }
                    dto.propertiesJson = JSON.stringify(propertiesJson);
                }
                return dto;
            } else {
                return null;
            }
        }

        function getCompanyDto() {
            let company = companyProfile.getFromCIPC(companyProfile.currCIPC);
            let dto = getDto(0);
            return {
                dto: dto,
                primaryOwner: company == null ? true : company.alreadyExists == false
            };
        }

        function submitDto(cb, ownerId) {
            let status = AddStatus();
            let dto = getDto(ownerId);
            if (dto != null) {
                if (dto.registrationDate == null) {
                    dto.registrationDate = '';
                }
                function translateMatchCriteria(matchCriteria) {
                    let temp = [];
                    for (let obj in matchCriteria) {
                        let val = matchCriteria[obj];
                        temp.push({
                            name: obj,
                            value: val == undefined ? '0' : val
                        });
                    }
                    return temp;
                }
                let propObj = JSON.parse(dto.propertiesJson);
                propObj.matchCriteriaJson = translateMatchCriteria(propObj.matchCriteriaJson);
                dto.propertiesJson = JSON.stringify(propObj);

                abp.services.app.smeCompaniesAppServiceExt.createOrEdit(dto).done(function (result) {
                    _companyRecordId = result;
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
            KTWizard2.enable(KTWizard2.page.CompanyProfile, 'duplicate-registration-number-name', false);
            // Get selected company.
            let regno = _controls.regno.val();
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

            app.onboard.businessOwners.attention(from, 0, foreward, function (status) {

            });
            app.onboard.employees.attention(from, 0, foreward, function (status) {

            });

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
                companyProfile.initCompanies();
            }
            if (companyProfile.loaded == true) {
                cb(AddStatus());
            } else {

                function getOwnerCompaniesFunc(cb) {
                    app.onboard.service.getOwnerCompanies(_identityNumber, function (status, arr) {

                        function addOwnerCompanies(arr) {
                            for (let i = 0, max = arr.length; i < max; i++) {
                                if (companyProfile.getFromCIPC(arr[i].companyName) == null) {
                                    companyProfile.companies.push({
                                        existingDto: null,
                                        alreadyExists: false,
                                        cipc: arr[i],
                                        dto: null
                                    });
                                }
                            }
                        }
                        function removeUserCompanies(arr) {
                            let i = 0;
                            while (i < arr.length) {
                                // Is this an existing company added by the user?
                                if (companyProfile._userCompanies.has(arr[i].registrationNumber) == true) {
                                    arr.splice(i, 1);
                                } else {
                                    i++;
                                }
                            }
                        }
                        if (status.result == Result.Pass) {
                            removeUserCompanies(arr);

                            addOwnerCompanies(arr);

                            companyProfile.populateCompanyList();
                            company = companyProfile.getFromCIPC('...');
                            companyProfile.populateEmptyDetails(company);
                            companyProfile.loaded = true;
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
            app.onboard.businessOwners.neglect(KTWizard2.PAGE.CompanyProfile, to, foreward, function (status) {

            });
            app.onboard.employees.neglect(KTWizard2.PAGE.CompanyProfile, to, foreward, function (status) {

            });
            cb(AddStatus());
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

        onboard.company = {
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
            getCompanyDto: getCompanyDto,
            updateMatchCriteriaJson: updateMatchCriteriaJson,
            dto: _dto
        };

    })(app.onboard);
//}
