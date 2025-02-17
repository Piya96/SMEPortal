"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.summary == undefined) {
    app.wizard.summary = {};
}

if (app.wizard.summary.page == undefined) {
    app.wizard.summary.page = {};
}

(function (page) {

    class ECDC extends app.wizard.summary.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'ECDC Summary Page';
        }

        basicScreeningCheckFailedMessage() {
            return "<p><b>ECDC</b> is currently unable to assist you with funding.</p>\
            <p>If you would like to be linked with other funders that may match your requirements, please click <a id = 'a-basic-screening-fail-redirect-popup' href = 'javascript:void(0)'><b>here</b></a>.</p >\
            <p>To understand <b>ECDC</b>'s qualification criteria, please click <a target='_blank' href='https://www.ecdc.co.za/development-finance'><b>here</b></a>.</p>";
        }

        executeBackgroundChecksLogic(company, cb) {
            let companyId = company.id;

            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: 'Performing background checks...'
            });
            // TODO: Put this call in derived class!!!
            abp.services.app.smeCompaniesAppServiceExt.basicScreeningCheckECDC(companyId).done(function (payload) {
                let result = app.wizard.addResult()
                result.data = JSON.parse(payload);
                if (result.data.Success != true) {
                    result.code = 1;
                }
                company.propertiesJson['basic-screening-checks'] = result.data.Checks;
                // TODO: TEMP hack!!!
                let code = $('#select-company-profile-province').val();
                result.code = (code == 'EC' && result.code == 0) ? 0 : 1;
                KTApp.unblockPage();
                cb(result);
            });
        }

        executeBackgroundChecks(company, cb) {
            this.executeBackgroundChecksLogic(company, (result) => {
                this.executeBackgroundChecksPresentation(result, (result) => {
                    cb(app.wizard.addResult());
                });
            });
        }
    }

    page.create = function (id) {
        return new ECDC(id);
    }

    page.ECDC = ECDC;

})(app.wizard.summary.page);
