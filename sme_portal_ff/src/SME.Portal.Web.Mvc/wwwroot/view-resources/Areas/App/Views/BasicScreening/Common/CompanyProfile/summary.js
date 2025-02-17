'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

if (app.fss.company == undefined) {
    app.fss.company = {};
}

(function (company) {

    const NOT_REGISTERED = 'NotRegistered';
    const SOLE_PROPRITETOR = '5a6ab7ce506ea818e04548ad';
    const PARTNERSHIP = '5a6ab7d3506ea818e04548b0';

    let helpers = app.onboard.helpers.get();

    class Baseline {
        constructor() {
            this.dto = null;
            this.json = null;
            this.vrec = null;
            this.appId = null;
            this.sic = app.common.sic;
        }

        set(name, prop, show, fn) {
            let value = '';
            let text = '';
            if (show == true) {
                value = helpers.getPropEx(this.json, prop, '');
                text = value;
                fn.forEach((f, i) => {
                    text = f(text);
                    text = text.text;
                });
            } else {
                helpers.setPropEx(this.json, name, '');
            }
            $('#' + name + '-' + this.appId).text(text);
            return value;
        }

        name() {
            $("#id-summary-company-profile-cname-" + this.appId).text(this.dto.name);
        }

        registrationNumber() {
            $("#id-summary-company-profile-reg-no-" + this.appId).text(
                this.dto.registrationNumber == '' ? 'Business not yet registered' : this.dto.registrationNumber
            );
        }

        type() {
            let status = helpers.getPropEx(this.json, 'companyCipcStatus', NOT_REGISTERED);
            let typeText =
                (this.dto.type != SOLE_PROPRITETOR &&
                 this.dto.type != PARTNERSHIP &&
                 status == NOT_REGISTERED)
                    ? '' :
                    app.listItems.obj.getLabel('59d26e1620070a604097b05a', this.dto.type);
            //let typeText = app.listItems.obj.getLabel('59d26e1620070a604097b05a', this.dto.type);
            $("#id-summary-company-profile-company-type-" + this.appId).text(typeText == null ? this.dto.type : typeText);
        }

        registrationDate() {
            let date = this.dto.registrationDate;
            if (date == null) {
                date = '';
            } else {
                date = helpers.formatDate(date);
            }
            $("#id-summary-company-profile-registration-date-" + this.appId).html(
                date + ' <span data-toggle="tooltip" data-placement="right" title="[DD/MM/YYYY]"><i class="fa fa-info-circle"></i></span>'
            );
        }

        vatRegistrationNumber() {
            let value = helpers.getProp(this.json, 'vatRegistrationNumber');
            $('#id-div-summary-company-profile-vat-reg-number-' + this.appId).text(value);
        }

        taxReferenceNumber() {
            let value = helpers.getPropEx(this.json, 'taxReferenceNumber', '');
            if (value == '' && helpers.isObject(this.vrec) == true) {
                value = helpers.getPropEx(this.vrec, 'taxNumber', '');
            }
            $('#id-div-summary-company-profile-vat-ref-number-' + this.appId).text(value);
        }

        registeredForUIF() {
            let value = helpers.getProp(this.json, 'registered-for-uif');
            $('#td-registered-for-uif-' + this.appId).text(value);
            this.uifNumber(value == 'Yes');
        }

        uifNumber(show) {
            let value = helpers.getPropEx(this.json, 'uif-number', '');
            if (show == true) {
                if (value != '') {
                    value = value.slice(0, 7) + '\/' + value.slice(7);
                }
                $('#td-uif-number-' + this.appId).text(value);
                $('#tr-uif-number-' + this.appId).show('fast');
            } else {
                $('#tr-uif-number-' + this.appId).hide('fast');
            }
        }

        address() {
            let addrArr = this.dto.registeredAddress.split(',');
            for (let i = 0, max = addrArr.length; i < max; i++) {
                if (addrArr[i] == undefined || addrArr[i] == 'undefined') {
                    continue;
                } else {
                    let id = ('#id-summary-company-profile-registered-address-' + (i + 1).toString() + '-' + this.appId);
                    $(id).text(addrArr[i]);
                    $(id).show();
                }
            }
        }

        industry() {
            let value = helpers.getPropEx(this.json['industry'], 'Guid', '');
            let result = app.wizard.isb.findFromId(value, 5);
            if (result != null) {
                $('#tr-sic-section-' + this.appId).text(result[1].desc);
                $('#tr-sic-division-' + this.appId).text(result[2].desc);
                $('#tr-sic-group-' + this.appId).text(result[3].desc);
                $('#tr-sic-class-' + this.appId).text(result[4].desc);
                $('#tr-sic-sub-class-' + this.appId).text(result[5].desc);
                $('#tr-sic-code-' + this.appId).text('SIC code: ' + result[4].id);
            }
        }

        apply(dto, appId) {
            this.dto = dto;

            if (helpers.isObject(dto.propertiesJson) == false) {
                if (dto.propertiesJson == null || dto.propertiesJson == '') {
                    this.json = {};
                } else {
                    this.json = JSON.parse(dto.propertiesJson);
                }
            } else {
                this.json = dto.propertiesJson;
            }
            if (dto.verificationRecordJson != '' && dto.verificationRecordJson != null && helpers.isObject(dto.verificationRecordJson) == false) {
                this.vrec = JSON.parse(dto.verificationRecordJson);
            }


            this.appId = appId;

            this.name();
            this.registrationNumber();
            this.type();
            this.registrationDate();
            this.vatRegistrationNumber();
            this.taxReferenceNumber();
            this.registeredForUIF();
            this.address();
            this.industry();
        }
    }


    function getDateFromStr(dateStr) {
        if (dateStr == null || dateStr == '') {
            return null;
        } else {
            let date = new Date(dateStr);
            let year = date.getFullYear().toString();
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
            return day + '/' + month + '/' + year;
        }
    }

    function Render(dto, appId) {
        let summary = company.create();
        summary.apply(dto, appId);
    }

    company.render = function (dto, appId) {
        if (dto != null) {
            Render(dto, appId);
        }
    };

    company.create = function () {
        return new Baseline();
    }

    company.Baseline = Baseline;

}(app.fss.company));
