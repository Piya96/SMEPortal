'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.controller = {};

(function (controller) {

    controller.renderOnboarding = function (
        userProfile,
        ownerProfile,
        companyProfile,
        appId
    ) {
        let idStr = appId.toString();
        app.fss.user.render(userProfile, idStr);
        app.fss.owner.render(ownerProfile, idStr);
        app.fss.company.render(companyProfile, idStr);
    };

    controller.renderFunderSearch = function (
        userProfile,
        ownerProfile,
        companyProfile,
        funderSearches,
        appId
    ) {
        let idStr = appId.toString();
        app.fss.user.render(userProfile, idStr);
        app.fss.owner.render(ownerProfile, idStr);
        app.fss.company.render(companyProfile, idStr);
        let arr1 = app.fss.financialInfo.render(funderSearches, idStr);
        let arr2 = app.fss.fundingRequirements.render(funderSearches, idStr);
        let arr3 = app.fss.fundingEssentials.render(funderSearches, idStr);
        return [arr1, arr2, arr3];
    };

    controller.renderFunderSearchForPdf = function (
        userProfile,
        ownerProfile,
        companyProfile,
        funderSearches,
        appId
    ) {
        let idStr = appId.toString();
        app.fss.user.render(userProfile, idStr);
        app.fss.owner.render(ownerProfile, idStr);
        app.fss.company.render(companyProfile, idStr);
        app.fss.fundingRequirements.render(funderSearches[idStr], idStr);
        app.fss.financialInfo.render(funderSearches[idStr], idStr);
        app.fss.fundingEssentials.render(funderSearches[idStr], idStr);
    };

    controller.renderMatches = function (
        userProfile,
        ownerProfile,
        companyProfile,
        funderSearches
    ) {
        for (const appId in funderSearches) {
            app.fss.user.render(userProfile, appId);
            app.fss.owner.render(ownerProfile[appId], appId);
            app.fss.company.render(companyProfile[appId].smeCompany, appId);
            app.fss.fundingRequirements.render(funderSearches[appId], appId);
            app.fss.financialInfo.render(funderSearches[appId], appId);
            app.fss.fundingEssentials.render(funderSearches[appId], appId);
        }
    };
}(app.fss.controller));
