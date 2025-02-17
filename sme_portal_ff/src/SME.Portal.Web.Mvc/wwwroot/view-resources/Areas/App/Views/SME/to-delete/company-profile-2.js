'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.onboard == undefined) {
    app.fss = {};
}

app.onboard.companyProfile2 = {};

(function (companyProfile2) {

    const _companyStatus = {
        registeredNotListed : "RegisteredNotListed",
        notRegisteredNotListed : "NotRegistered",
        registeredListed : "RegisteredListed"
    };

    const cipclookup = 'cipc-lookup';
    const cname = 'cname';
    const regno = 'regno';
    const companytype = 'companyType';
    const registrationdate = 'registrationdate';
    const startedtradingdate = 'startedtradingdate';
    const registeredAddress = 'name-registered-address';
    const regaddr1 = 'regaddr1';
    const regaddr2 = 'regaddr2';
    const citytown = 'citytown';
    const postalcode = 'postalcode';
    const province = 'companyProfileProvinceSelect';
    const industrysector = 'industrySector';
    const industrysubsector = 'industrySubSector';
    const beelevel = 'beeLevel';

    let _controls = null;


    companyProfile2.init = function (cb) {
        _controls = {
            cipclookup: app.control.select(cipclookup),
            cname: app.control.input(cname),
            regno: app.control.input(regno),
            companytype: app.control.select(companytype),
            // TODO: dateinput???
            registrationdate: app.control.input(registrationdate),
            startedtradingdate: app.control.input(startedtradingdate),
            registeredAddress: app.control.input(registeredAddress),
            regaddr1: app.control.input(regaddr1),
            regaddr2: app.control.input(regaddr2),
            citytown: app.control.input(citytown),
            postalcode: app.control.input(postalcode),
            province: app.control.select(province),
            industrysector: app.control.select(industrysector),
            industrysubsector: app.control.select(industrysubsector),
            beelevel: app.control.select(beelevel)
        };
    };

    companyProfile2.registeredNotListedInit = function () {

    };

    companyProfile2.notRegisteredInit = function () {

    };

    companyProfile2.registeredListedInit = function () {

    };

}(app.onboard.companyProfile2));
