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

    controller.renderProfileSummary = function (
        userProfile,
        ownerProfile,
        companyProfileArr
    ) {
        app.fss.user.render(userProfile, 0);
        app.fss.owner.render(ownerProfile, 0);
        companyProfileArr.forEach(function (obj, idx) {
            app.fss.company.render(obj.smeCompany, obj.smeCompany.id);
        });
    };

    controller.renderSefaApplicationSummary = function (
        userProfile,
        ownerProfile,
        companyProfile,
        matchCriteria,
        appId
    ) {
        let idStr = appId.toString();
        //app.fss.user.render(userProfile, idStr);
        //app.fss.owner.render(ownerProfile, idStr);
        //app.fss.company.render(companyProfile, idStr);
        app.fss.mandateFit.render(matchCriteria, idStr);
        app.fss.fundingRequirements.render(matchCriteria, idStr);
        app.fss.legalQuestions.render(matchCriteria, idStr);
        app.fss.documents.render(matchCriteria, companyProfile, idStr);
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
        let arr4 = app.fss.documentation.render(funderSearches, idStr);
        return [arr1, arr2, arr3, arr4];
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
        app.fss.mandateFit.render(funderSearches[idStr], idStr);
        app.fss.fundingRequirements.render(funderSearches[idStr], idStr);
        //app.fss.financialInfo.render(funderSearches[idStr], idStr);
        app.fss.legalQuestions.render(funderSearches[idStr], idStr);
        app.fss.documents.render(funderSearches[idStr], companyProfile, idStr);
        //app.fss.fundingEssentials.render(funderSearches[idStr], idStr);
    };

    controller.renderMatches = function (
        userProfile,
        ownerProfile,
        companyProfile,
        funderSearches
    ) {
        for (const appId in funderSearches) {
            app.fss.user.render(userProfile, appId);
            app.fss.owner.render(ownerProfile[appId].owner, appId);
            app.fss.company.render(companyProfile[appId].smeCompany, appId);
            app.fss.mandateFit.render(funderSearches[appId], appId);
            app.fss.fundingRequirements.render(funderSearches[appId], appId);
            app.fss.legalQuestions.render(funderSearches[appId], appId);
            app.fss.documents.render(funderSearches[appId], companyProfile[appId].smeCompany, appId);
        }
    };
}(app.fss.controller));
