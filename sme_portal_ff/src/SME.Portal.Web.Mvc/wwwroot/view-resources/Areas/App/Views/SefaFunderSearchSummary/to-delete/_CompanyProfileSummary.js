'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.company = {};
(function (company) {

    let helpers = app.onboard.helpers.get();

    class Summary {
        constructor() {
            this.dto = null;
            this.json = null;
            this.appId = null;
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
            let typeText = app.listItems.obj.getLabel('59d26e1620070a604097b05a', this.dto.type);
            $("#id-summary-company-profile-company-type-" + this.appId).text(typeText == null ? this.dto.type : typeText);
        }

        registrationDate() {
            let date = getDateFromStr(this.dto.registrationDate);
            if (date == null) {
                date = '';
            }
            $("#id-summary-company-profile-registration-date-" + this.appId).html(
                date + ' <span data-toggle="tooltip" data-placement="right" title="[DD/MM/YYYY]"><i class="fa fa-info-circle"></i></span>'
            );
        }

        startedTradingDate() {
            let date = getDateFromStr(this.dto.startedTradingDate);
            if (date == null) {
                date = '';
            }
            $("#id-summary-company-profile-started-trading-date-" + this.appId).html(
                date + ' <span data-toggle="tooltip" data-placement="right" title="[DD/MM/YYYY]"><i class="fa fa-info-circle"></i></span>'
            );
        }

        vatRegistrationNumber() {
            let value = helpers.getProp(this.json, 'vatRegistrationNumber');
            $('#id-div-summary-company-profile-vat-reg-number-' + this.appId).text(value);
        }

        taxReferenceNumber() {
            let value = helpers.getProp(this.json, 'taxReferenceNumber');
            $('#id-div-summary-company-profile-vat-ref-number-' + this.appId).text(value);
        }

        registeredForUIF() {
            let value = helpers.getProp(this.json, 'registered-for-uif');
            $('#td-registered-for-uif-' + this.appId).text(value);
            this.uifNumber(value == 'Yes');
        }

        uifNumber(show) {
            if (show == true) {
                let value = helpers.getPropEx(this.json, 'uif-number');
                if (value != '') {
                    value = value.slice(0, 9) + '\/' + value.slice(9);
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
                let id = ('#id-summary-company-profile-registered-address-' + (i + 1).toString() + '-' + this.appId);
                $(id).text(addrArr[i]);
                $(id).show();
            }
        }

        industry() {
            let obj = helpers.getProp(this.json, 'industry');
            let guid = obj['Guid'];
            let industry = app.listItems.obj.getIndustrySector(guid);
            $("#id-summary-company-profile-industry-sub-sector-" + this.appId).text(industry.label);
            $("#id-summary-company-profile-industry-sic-code-" + this.appId).text(industry.sicCode);
        }

        entityType() {
            let guid = helpers.getProp(this.json, 'entityType');
            let type = app.listItems.obj.getEntityTypes(guid);
            if (type != null) {
                $('#id-div-summary-company-profile-entity-type-' + this.appId).text(type.text);
            }
        }

        apply(dto, appId) {
            this.dto = dto;
            this.json = JSON.parse(dto.propertiesJson);
            this.appId = appId;

            this.name();
            this.registrationNumber();
            this.type();
            this.registrationDate();
            this.startedTradingDate();
            this.vatRegistrationNumber();
            this.taxReferenceNumber();
            this.registeredForUIF();
            this.address();
            this.industry();
            this.entityType();
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

    function Render(dto, appId, dataArr) {
        let summary = new Summary();
        summary.apply(dto, appId);
    }

    company.render = function (dto, appId) {
        if (dto != null) {
            let dataArr = [];
            Render(dto, appId, dataArr);
        }
    };

}(app.fss.company));
