'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.user = {};
(function (user) {

    let helpers = app.onboard.helpers.get();

    class Baseline {
        constructor() {
            this.dto = null;
            this.json = null;
            this.appId = null;
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
            $('#id-summary-user-profile-id-' + this.appId).text(this.dto.identityOrPassport);
        }

        mobileNumber() {
            $('#id-summary-user-profile-mobile-' + this.appId).text(this.dto.phoneNumber);
        }

        emailAddress() {
            $('#id-summary-user-profile-email-' + this.appId).text(this.dto.emailAddress);
        }

        name() {
            let guid = helpers.getProp(this.json, 'user-title');
            let arr = app.listItems.obj.getTitles();
            let title = arr.find(function (obj, idx) {
                if (obj.value == guid) {
                    return true;
                }
            });
            let text = title != null ? title.text : '';
            $('#id-summary-user-profile-name-' + this.appId).text(text + '' + this.dto.name + ' ' + this.dto.surname);
        }

        isOwner() {
            let self = this;

            function capacity() {
                let guid = self.dto.representativeCapacity;
                let role = app.listItems.obj.getRoles(guid);
                let text = role != null ? role.text : guid;
                $('#id-summary-user-profile-owner-capacity-' + self.appId).text(text);
            }

            $('#id-summary-user-profile-is-owner-' + this.appId).text(this.dto.isOwner == true ? 'Yes' : 'No');
            if (this.dto.isOwner == true) {
                $('#id-summary-user-profile-owner-capacity-div-show-' + this.appId).hide();
            } else {
                $('#id-summary-user-profile-owner-capacity-div-show-' + this.appId).show();
                capacity();
            }
        }

        capacityOther() {
            if (this.dto.isOwner == false && this.dto.representativeCapacity == '6226122fc3ac73094c399c4d') {
                let address = helpers.getProp(this.json, 'user-profile-capacity-other', '');
                $('#id-summary-user-profile-capacity-other-' + this.appId).text(address);
                $('#id-tr-summary-user-profile-capacity-other-' + this.appId).show('fast');
            } else {
                $('#id-tr-summary-user-profile-capacity-other-' + this.appId).hide('fast');
            }
        }

        physicalAddress() {
            if (this.dto.isOwner == false && this.dto.representativeCapacity == '6226122fc3ac73094c399c4a') {
                let address = helpers.getProp(this.json, 'user-profile-registered-address', '');
                $('#id-summary-user-profile-physical-address-' + this.appId).text(address);
                $('#id-tr-summary-user-profile-physical-address-' + this.appId).show('fast');
            } else {
                $('#id-tr-summary-user-profile-physical-address-' + this.appId).hide('fast');
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

            this.identityNumber();
            this.mobileNumber();
            this.emailAddress();
            this.name();
            //this.sefaOrigin();
            this.isOwner();
            this.physicalAddress();
            this.capacityOther();
        }
    }

    function Render(dto, appId, dataArr) {
        let summary = user.create();
        summary.apply(dto, appId);
    }

    user.create = function() {
        return new Baseline();
    }

    user.render = function (dto, appId) {
        if (dto != null) {
            let dataArr = [];
            Render(dto, appId, dataArr);
        }
    };

    user.Baseline = Baseline;

}(app.fss.user));
