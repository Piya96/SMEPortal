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

    class Baseline {
        constructor() {
            this.dto = null;
            this.json = null;
            this.appId = null;
            this.vrec = null;
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
            let guid = helpers.getPropEx(this.json, 'owner-title', '');
            let title = guid == '' ? '' : app.listItems.obj.getTitles(guid);
            let text = (title != null && title != '') ? title.text : '';
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

                let cop = helpers.getPropEx(self.json, 'owner-is-married-in-cop', '');
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

        age() {
            let age = helpers.getProp(this.vrec, 'Age');
            $('#id-summary-owner-profile-age-' + this.appId).text(age);
        }

        race() {
            let text = null;
            //if(this.dto.race == '62271c13567e92380c27c3c2') {
                //text = helpers.getProp(this.json, 'owner-profile-race-other', '');
            //} else {
                let guid = this.dto.race;
                let race = app.listItems.obj.getRace(guid);
                text = race != null ? race.text : '';
            //}
            $('#id-summary-owner-profile-race-' + this.appId).text(text);
        }

        physicalAddress() {
            let address = helpers.getPropEx(this.json, 'owner-profile-registered-address', '');
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
                if (dto.propertiesJson == null || dto.propertiesJson == '') {
                    this.json = {};
                } else {
                    this.json = JSON.parse(dto.propertiesJson);
                }
            } else {
                this.json = dto.propertiesJson;
            }
            this.appId = appId;
            if (helpers.isObject(dto.verificationRecordJson) == false) {
                this.vrec = JSON.parse(dto.verificationRecordJson);
            } else {
                this.vrec = dto.verificationRecordJson;
            }

            this.identityNumber();
            this.mobileNumber();
            this.emailAddress();
            this.name();
            this.gender();
            this.maritalStatus();
            this.age();
            this.race();
            this.physicalAddress();
        }
    }

    function Render(dto, appId) {
        let summary = owner.create();
        summary.apply(dto, appId);
    }

    owner.create = function () {
        return new Baseline();
    }

    owner.render = function (dto, appId) {
        if (dto != null) {
            Render(dto, appId);
        }
    };

    owner.Baseline = Baseline;

}(app.fss.owner));
