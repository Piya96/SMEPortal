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

    function getObjectList(matchCriteria) {
        let result = {};
        matchCriteria.forEach(function (obj, idx) {
            result[obj.name] = obj.value;
        });
        return result;
    }

    function Render(dto, appId, dataArr) {
        $("#id-summary-company-profile-cname-" + appId).text(dto.name);
        $("#id-summary-company-profile-reg-no-" + appId).text(
            dto.registrationNumber == '' ? /*app.localize('NotRegistered')*/'Business not yet registered' : dto.registrationNumber
        );
        let typeText = app.listItems.obj.getLabel('59d26e1620070a604097b05a', dto.type);
        $("#id-summary-company-profile-company-type-" + appId).text(typeText == null ? dto.type : typeText);

        let date = getDateFromStr(dto.registrationDate);
        $("#id-summary-company-profile-registration-date-" + appId).text(
            date == null ? 'Business not yet registered' : date
        );
        date = getDateFromStr(dto.startedTradingDate);
        $("#id-summary-company-profile-started-trading-date-" + appId).text(date);

        let addrArr = dto.registeredAddress.split(',');
        for (let i = 0, max = addrArr.length; i < max; i++) {
            let id = ('#id-summary-company-profile-registered-address-' + (i + 1).toString() + '-' + appId);
            $(id).text(addrArr[i]);
            $(id).show();
        }
        let industrySectorKey = dto.industries;
        let labels = app.common.industrySector.getLabelsFromKey(industrySectorKey);
        let outerText = labels.industrySectorLabel;
        let innerText = labels.industrySubSectorLabel;
        $("#id-summary-company-profile-industry-sector-" + appId).text(outerText);
        $("#id-summary-company-profile-industry-sub-sector-" + appId).text(innerText);

        let beeText = app.listItems.obj.getLabel('5af27ffb7fbbb21e6817bc41', dto.beeLevel);
        $("#id-summary-company-profile-bee-level-" + appId).text(beeText);

        let prop = JSON.parse(dto.propertiesJson);
        let obj = prop.matchCriteriaJson;
        if (Array.isArray(obj) == true) {
            obj = getObjectList(obj);
        }

        $("#number-of-full-time-employees-summary-div-" + appId).text(obj['numberoffulltimeemployees']);
        $("#number-of-full-time-women-employees-summary-div-" + appId).text(obj['numberoffulltimewomenemployees']);
        $("#how-many-full-time-under35-summary-div-" + appId).text(obj['numberoffulltimeemployeesunder35']);

        $("#number-of-part-time-employees-summary-div-" + appId).text(obj['numberofparttimeemployees']);
        $("#number-of-part-time-women-employees-summary-div-" + appId).text(obj['numberofparttimewomenemployees']);
        $("#how-many-part-time-under35-summary-div-" + appId).text(obj['numberofparttimeemployeesunder35']);


        $('#id-div-total-number-of-owners-' + appId).text(obj['numberofowners']);

        if (obj.hasOwnProperty('southafricanownedpercentage') == true) {
            $('#id-div-how-many-are-south-africans-' + appId).text(obj['southafricanownedpercentage']);
        }
        $('#id-div-how-many-are-not-south-africans-' + appId).text(obj['nonsouthafricanownedpercentage']);
        $('#id-div-how-many-are-companies-organisations-' + appId).text(obj['companyownedpercentage']);

        $('#id-div-black-coloured-indian-pdi-' + appId).text(obj['blackallownedpercentage'] + '%');

        $('#id-tr-black-only-' + appId).show();
        $('#id-div-black-only-' + appId).text(obj['blackownedpercentage'] + '%');

        $('#id-div-women-any-race-' + appId).text(obj['womenownedpercentage'] + '%');

        if (obj.hasOwnProperty('womenblackonlypercentage') == true) {
            $('#id-tr-women-black-only-' + appId).show();
            $('#id-div-women-black-only-' + appId).text(obj['womenblackonlypercentage'] + '%');
        }
        $('#id-div-disabled-any-race-' + appId).text(obj['disabledownedpercentage'] + '%');
        $('#id-div-youth-under-35-any-race-' + appId).text(obj['youthownedpercentage'] + '%');
    }

    company.render = function (dto, appId) {
        if (dto != null) {
            let dataArr = [];
            //for (const name in dto) {
                Render(dto, appId, dataArr);
            //}
        }
    };

}(app.fss.company));
