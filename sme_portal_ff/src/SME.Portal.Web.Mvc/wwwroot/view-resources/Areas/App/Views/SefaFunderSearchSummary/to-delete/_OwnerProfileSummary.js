'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.owner = {};
(function (owner) {

    let helpers = app.onboard.helpers.get();

    class Summary {
        constructor() {
            this.dto = null;
            this.json = null;
            this.appId = null;
            this.vrec = null;
        }

        identityNumber() {
            $('#id-summary-owner-profile-id-' + this.appId).text(this.dto.identityOrPassport);
        }

        mobileNumber() {
            $('#id-summary-owner-profile-mobile-' + this.appId).text(this.dto.phoneNumber);
        }

        emailAddress() {
            $('#id-summary-owner-profile-email-' + this.appId).text(this.dto.emailAddress);
        }

        name() {
            let guid = helpers.getProp(this.json, 'owner-title');
            let title = app.listItems.obj.getTitles(guid);
            let text = title != null ? title.text : '';
            $('#id-summary-owner-profile-name-' + this.appId).text(text + '' + this.dto.name + ' ' + this.dto.surname);
        }

        gender() {
            let gender = helpers.getProp(this.vrec, 'Gender');
            $('#id-summary-owner-profile-gender-' + this.appId).text(gender);
        }

        maritalStatus() {
            let self = this;

            function married() {

                function spouseIdentityNumber() {
                    let idNumber = helpers.getProp(self.json, 'owner-spouse-identiy-number');
                    $('#id-summary-owner-profile-spouse-id-' + self.appId).text(idNumber);
                }

                let cop = helpers.getProp(self.json, 'owner-is-married-in-cop');
                $('#id-summary-owner-profile-married-cop-' + self.appId).text(cop);
                if (cop == 'Yes') {
                    spouseIdentityNumber();
                    $('#id-tr-summary-owner-profile-spouse-id-' + self.appId).show();
                } else {
                    $('#id-tr-summary-owner-profile-spouse-id-' + self.appId).hide();
                }
            }
            let maritalStatus = helpers.getProp(this.vrec, 'MaritalStatus');
            $('#id-summary-owner-profile-marital-status-' + this.appId).text(maritalStatus);
            if (maritalStatus == 'Married') {
                $('#id-tr-summary-owner-profile-married-cop-' + this.appId).show();
                married();
            } else {
                $('#id-tr-summary-owner-profile-married-cop-' + this.appId).hide();
            }
        }

        disabled() {
            let value = helpers.getPropEx(this.json, 'owner-is-disabled', '');
            $('#id-summary-owner-profile-is-disabled-' + this.appId).text(value);
        }

        age() {
            let age = helpers.getProp(this.vrec, 'Age');
            $('#id-summary-owner-profile-age-' + this.appId).text(age);
        }

        race() {
            let text = null;
            if(this.dto.race == '62271c13567e92380c27c3c2') {
                text = helpers.getProp(this.json, 'owner-profile-race-other', '');
            } else {
                let guid = this.dto.race;
                let race = app.listItems.obj.getRace(guid);
                text = race != null ? race.text : '';
            }
            $('#id-summary-owner-profile-race-' + this.appId).text(text);
        }

        physicalAddress() {
            let address = helpers.getProp(this.json, 'owner-profile-registered-address', '');
            if (address.length > 0) {
                $('#id-summary-owner-profile-physical-address-' + this.appId).text(address);
                $('#id-tr-summary-owner-profile-physical-address-' + this.appId).show('fast');
            } else {
                $('#id-tr-summary-owner-profile-physical-address-' + this.appId).hide('fast');
            }
        }

        apply(dto, appId) {
            this.dto = dto;
            if (helpers.isObject(dto.propertiesJson) == false) {
                this.json = JSON.parse(dto.propertiesJson);
            } else {
                this.json = dto.propertiesJson;
            }
            this.appId = appId;
            this.vrec = JSON.parse(dto.verificationRecordJson);

            this.identityNumber();
            this.mobileNumber();
            this.emailAddress();
            this.name();
            this.gender();
            this.maritalStatus();
            this.age();
            this.race();
            this.disabled();
            this.physicalAddress();
        }
    }

    function Render(dto, appId, dataArr) {
        let summary = new Summary();
        summary.apply(dto.owner, appId);
    }

    owner.render = function (dto, appId) {
        if (dto != null) {
            let dataArr = [];
            Render(dto, appId, dataArr);
        }
    };

}(app.fss.owner));
