'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.profileSummary == undefined) {
    app.profileSummary = {};
}

(function (profileSummary) {

    let helpers = app.onboard.helpers.get();

    profileSummary.init = function (companyDictionary) {

        function createCompanyEvents(companyInfo) {
            let idEdit = '#id-a-profile-summary-edit-' + companyInfo.company.smeCompany.id.toString();
            let idApplication = '#id-a-profile-summary-application-' + companyInfo.company.smeCompany.id.toString();

            function getTooltipTextForEditButton() {
                if (companyInfo.canEdit == false) {
                    return '<p><b>Company currently not editable. Please complete your existing finance application first</b></p>';
                } else {
                    return '<p><b>Edit company</b></p>';
                }
            }

            function getTooltipTextForApplicationButton() {
                if (companyInfo.backgroundCheck.pass == false) {
                    return '<p><b>One or more background checks for your business failed. Please edit your business details to move foreward</b></p>';
                    //return '<p><b>Finance application</b></p>';
                } else {
                    return '<p><b>Finance application</b></p>';
                }
            }

            $(idEdit).tooltip({
                title: getTooltipTextForEditButton(),
                html: true,
                placement: "top"
            });

            $(idApplication).tooltip({
                title: getTooltipTextForApplicationButton(),
                html: true,
                placement: "top"
            });
        }

        for (const key in companyDictionary) {
            let companyInfo = companyDictionary[key];
            createCompanyEvents(companyInfo);
        }
    };

}(app.profileSummary));
