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

    let guids = {
        SegaOriginOther: '6321dbc1eb41fff5d2cf4114',
        SegaOriginStrategicPartner: '6321db9f186caf8814235ebd'
    };

    class Summary {
        constructor() {
            this.dto = null;
            this.json = null;
            this.appId = null;
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

        sefaOrigin() {
            let text = '';
            let guid = helpers.getProp(this.json, 'how-did-you-hear-about-sefa');
            if (guid == guids.SegaOriginOther) {
                text = helpers.getProp(this.json, 'how-did-you-hear-about-sefa-other');
            } else {
                if (guid == guids.SegaOriginStrategicPartner) {
                    let guid = helpers.getPropEx(this.json, 'how-did-you-hear-about-sefa-strategic-partner');
                    let obj = app.listItems.obj.getSefaOriginStrategicPartner(guid);
                    $('#id-summary-user-profile-sefa-origin-strategic-partners-' + this.appId).text(obj == null ? '' : obj.text);
                    $('#tr-summary-user-profile-sefa-origin-strategic-partners-' + this.appId).show();
                } else {
                    $('#tr-summary-user-profile-sefa-origin-strategic-partners-' + this.appId).hide();
                }
                let origin = app.listItems.obj.getSefaOrigin(guid);
                text = origin != null ? origin.text : '';
            }
            $('#id-summary-user-profile-sefa-origin-' + this.appId).text(text);
        }

        isOwner() {
            let self = this;

            function capacity() {
                let guid = self.dto.representativeCapacity;
                let role = app.listItems.obj.getRoles(guid);
                let text = role != null ? role.text : '';
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
                this.json = JSON.parse(dto.propertiesJson);
            } else {
                this.json = dto.propertiesJson;
            }
            this.appId = appId;

            this.identityNumber();
            this.mobileNumber();
            this.emailAddress();
            this.name();
            this.sefaOrigin();
            this.isOwner();
            this.physicalAddress();
            this.capacityOther();
        }
    }

    function Render(dto, appId, dataArr) {
        let summary = new Summary();
        summary.apply(dto, appId);
    }

    user.render = function (dto, appId) {
        if (dto != null) {
            let dataArr = [];
            Render(dto, appId, dataArr);
        }
    };

}(app.fss.user));
