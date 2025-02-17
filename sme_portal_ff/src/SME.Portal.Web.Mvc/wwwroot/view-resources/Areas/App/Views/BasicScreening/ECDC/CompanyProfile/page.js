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

    class FinfindDtoToPage extends app.wizard.business.page.DtoToPage {
        constructor(self) {
            super(self);
        }

        address() {
            super.address();
            let code = this.controls['input-company-profile-postal-code'].val();
            let prov = app.common.gmap.areaCodeToProvince(code);
            let key = this.controls['select-company-profile-province'].val();
            if (prov != null && prov.key == key) {
                this.controls['input-company-profile-postal-code'].enable(false);
            }
        }

        addressRegion() {
            let value = this.helpers.getPropEx(this.dto.propertiesJson, 'regional-office', '');
            this.controls['select-regional-office'].val(value);
            let key = this.controls['input-company-profile-postal-code'].val();
            let prov = app.common.gmap.areaCodeToProvince(key);
            if (prov != null && prov.key == 'EC') {
                $('#div-regional-office').show('fast');
                this.validation.toggleValidators(['select-regional-office'], [true]);
            } else {
                $('#div-regional-office').hide('fast');
                this.controls['select-regional-office'].val('');
                this.helpers.setPropEx(this.dto.propertiesJson, 'regional-office', '');
                this.validation.toggleValidators(['select-regional-office'], [false]);
            }
        }

        apply(dto) {
            super.apply(dto);
            this.addressRegion();
        }
    }

    class FinfindPageToDto extends app.wizard.business.page.PageToDto {
        constructor(self) {
            super(self);
        }

        addressRegion() {
            let value = this.controls['select-regional-office'].val();
            this.helpers.setPropEx(this.dto.propertiesJson, 'regional-office', value);
        }

        apply(dto) {
            super.apply(dto);
            this.addressRegion();
        }
    }

    class ECDC extends app.wizard.business.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'ECDC Business Profile Page';
        }

        enable(toggle) {
            super.enable(toggle);
        }

        clear() {
            super.clear();
        }

        validate(args, cb) {
            super.validate(args, (result) => {
                cb(result);
            })
        }

        toggleProvinceSelect(toggle) {
            this.controls['select-company-profile-province'].enable(false);
        }

        addControls() {
            super.addControls();
            this.controls['select-company-profile-province'].enable(false);

            let control = this.addControl('select-regional-office', 'select');
            let arr = this.listItems.getRegion();
            control.fill(arr);
        }

        addHandlers() {
            super.addHandlers();
        }

        notRegisteredHtml() {
            return 'Please note <b>ECDC</b> requires a business to be registered (excluding sole proprietorships or partnerships).\
                     You can register on the CIPC website if you click <a href="http://www.cipc.co.za/" target="_blank" rel="noopener noreferrer">HERE</a>';
        }

        validateProvinceCode(province) {
            return (
                province != null && (
                    province.key == 'EC'
                ));
        }

        // Case #01: Code and province come back as valid EC. Both are disabled.
        // Case #02: Code comes back as valid ( disable ), but province comes back empty. Fill in province as EC, ie: we have case #01.
        // Case #03: Code comes back empty and province comes back as valid EC. Grey province, and allow user to enter valid code.
        // Case #04: Code and /or province come back as invalid. Reset all address fields or allow user to exit to Finfind.
        // Case #05: Code and province come back as blank. ??? Not likely.
        onAddressChange(components) {
            let self = this;

            function validCodeValidProvince(code, province) {
                self.controls['select-company-profile-province'].val(province.key);
                self.controls['input-company-profile-postal-code'].val(code);
                self.controls['select-company-profile-province'].enable(false);
                self.controls['input-company-profile-postal-code'].enable(false);
            }

            function emptyCodeValidProvince(province) {
                self.controls['select-company-profile-province'].val(province);
                self.controls['input-company-profile-postal-code'].val('');
                self.controls['select-company-profile-province'].enable(false);
                self.controls['input-company-profile-postal-code'].enable(true);
            }

            function emptyCodeInvalidProvince(province) {
                self.controls['select-company-profile-province'].val(province);
                self.controls['input-company-profile-postal-code'].val('');
                self.controls['select-company-profile-province'].enable(false);
                self.controls['input-company-profile-postal-code'].enable(true);
            }

            function invalidCodeInvalidProvince(code, province) {
                self.controls['select-company-profile-province'].val(province.key);
                self.controls['input-company-profile-postal-code'].val(code);
                self.controls['select-company-profile-province'].enable(false);
                self.controls['input-company-profile-postal-code'].enable(false);
            }

            function blankCodeBlankProvince() {
            }

            self.controls['input-company-profile-postal-code'].enable(true);

            let areaCode = components['code'];
            let province = components['province'];

            if (areaCode == '' && province == '') {
                blankCodeBlankProvince();
            } else if (areaCode == '' && province != 'EC') {
                emptyCodeInvalidProvince(province);
            } else if (areaCode == '' && province == 'EC') {
                emptyCodeValidProvince('EC');
            } else if (areaCode != '' && province == '') {
                let prov = app.common.gmap.areaCodeToProvince(areaCode);
                if (prov == 'EC') {
                    validCodeValidProvince(areaCode, prov);
                } else {
                    invalidCodeInvalidProvince(areaCode, prov);
                }
            } else if (areaCode != '' && province != '') {
                let prov = app.common.gmap.areaCodeToProvince(areaCode);
                if (prov == 'EC') {
                    validCodeValidProvince(areaCode, prov);
                } else {
                    invalidCodeInvalidProvince(areaCode, prov);
                }
            }
            this.dto2Page.addressRegion();
        }

        formValidationError(result, cb) {
            let self = this;
            Swal.fire({
                html: result.message,
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                },
                didOpen: () => {
                    $('#a-basic-screening-ecdc-address-fail-redirect-popup').on('click', (ev) => {
                        if (self.cb != null) {
                            self.cb('basic-screening-fail-sign-out', null);
                        }
                    });
                }
            }).then(function () {
                cb(app.wizard.addResult());
            });
        }

        validate(data, cb) {
            let province = this.controls['select-company-profile-province'].val();
            let areaCode = this.controls['input-company-profile-postal-code'].val();
            let result = app.common.gmap.areaCodeToProvince(areaCode);
            if (province != 'EC' || result == null || result.key != 'EC') {
                let result = app.wizard.addResult();
                result.data = {
                    plugin: app.wizard.controller.Pages.CompanyProfile
                };
                result.status = app.wizard.Result.Fail;
                result.message = 
                    'ECDC provides services to Businesses in the Eastern Cape, \
                    If you would like to be linked with other funders that may match your requirements please click \
                    <a id="a-basic-screening-ecdc-address-fail-redirect-popup" href="javascript:void(0)">HERE</a>';
                cb(result);
            } else {
                super.validate(data, cb);
            }
        }

        onValidateFieldPostalCode(result, key) {
            if (result == 0 && key == 'EC') {
                $('#div-regional-office').show('fast');
                this.validation.toggleValidators(['select-regional-office'], [true]);
            } else {
                $('#div-regional-office').hide('fast');
                this.validation.toggleValidators(['select-regional-office'], [false]);
                this.controls['select-regional-office'].val('');
            }
        }
    }

    page.getDtoToPage = function (self) {
        return new FinfindDtoToPage(self);
    }

    page.getPageToDto = function (self) {
        return new FinfindPageToDto(self);
    }

    page.create = function (id) {
        return new ECDC(id);
    }

    page.ECDC = ECDC;

})(app.wizard.business.page);
