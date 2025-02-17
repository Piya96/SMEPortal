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

    function getCapacity(representativeCapacity) {
        let arr = representativeCapacity.split(',');
        if (arr.length == 2) {
            arr[0] = /*app.localize("OW_CapacitySelectOther")*/'Other';
        } else {
            let value = arr[0];
            switch (value) {
                case 'Director':
                    arr[0] = /*app.localize("OW_CapacitySelectDirector")*/'Director';
                    break;

                case 'EmployeeOfOwner':
                    arr[0] = /*app.localize("OW_CapacitySelectCompanyEmployee")*/'Employee of the company';
                    break;

                case 'Intermediary':
                    arr[0] = /*app.localize("OW_CapacitySelectIntermediary")*/'Intermediary (Business Adviser, Accountant)';
                    break;

                default:
                    arr[0] = 'Unknown';
                    break;
            }
        }
        return arr;
    }

    function Render(dto, appId, dataArr) {
        let user = dto;
        $('#id-summary-user-profile-name-' + appId).text(user.name + ' ' + user.surname);
        $('#id-summary-user-profile-email-' + appId).text(user.emailAddress);
        $('#id-summary-user-profile-mobile-' + appId).text(user.phoneNumber);
        $('#id-summary-user-profile-id-' + appId).text(user.identityOrPassport);
        $('#id-summary-user-profile-is-owner-' + appId).text(user.isOwner == true ? 'Yes' : 'No');
        if (user.isOwner == false) {
            $('#id-summary-user-profile-owner-capacity-div-show-' + appId).show();

            let arr = getCapacity(user.representativeCapacity);
            $('#id-summary-user-profile-owner-capacity-' + appId).text(arr[0]);
            if (arr.length == 2) {
                $('#id-summary-user-profile-capacity-other-div-show-' + appId).show();
                $('#id-summary-user-profile-capacity-other-' + appId).text(arr[1]);
            } else {
                $('#id-summary-user-profile-capacity-other-div-show-' + appId).hide();
            }
        } else {
            $('#id-summary-user-profile-owner-capacity-div-show-' + appId).hide();
        }
    }

    user.render = function (dto, appId) {
        if (dto != null) {
            let dataArr = [];
            //for (const name in ownerDict) {
            //    appArr.push(name);
            //}
            //let dataArr = [];
            //for (let i = 0, max = appArr.length; i < max; i++) {
                Render(dto, appId, dataArr);
        }
    };

}(app.fss.user));
