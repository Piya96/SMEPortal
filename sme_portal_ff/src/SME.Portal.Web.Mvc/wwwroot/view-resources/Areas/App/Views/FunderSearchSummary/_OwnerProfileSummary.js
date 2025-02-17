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

    function Render(dto, appId, dataArr) {
        let owner = dto.owner;
        $('#id-summary-owner-profile-name-' + appId).text(owner.name + ' ' + owner.surname);
        $('#id-summary-owner-profile-email-' + appId).text(owner.emailAddress);
        $('#id-summary-owner-profile-mobile-' + appId).text(owner.phoneNumber);
        $('#id-summary-owner-profile-id-' + appId).text(owner.identityOrPassport);
        let json = JSON.parse(owner.verificationRecordJson);
        $('#id-summary-owner-profile-gender-' + appId).text(json.Gender);
        $('#id-summary-owner-profile-marital-status-' + appId).text(json.MaritalStatus);
        $('#id-summary-owner-profile-age-' + appId).text(json.Age);
        let race = app.listItems.obj.getLabel('59e44c9bce32df0ebcdc27d4', owner.race);
        $('#id-summary-owner-profile-race-' + appId).text(race == null ? 'Other' : race);
    }

    owner.render = function (dto, appId) {
        if (dto != null) {
            let dataArr = [];
            //for (const name in dto) {
                Render(dto, appId, dataArr);
            //}
        }
    };

}(app.fss.owner));
