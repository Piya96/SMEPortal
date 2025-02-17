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

    let failInfoShow = true;

    class Sefa extends app.wizard.summary.page.Baseline {

        constructor(id) {
            super(id);
            this.name = 'Sefa Summary Page';
        }

        // TODO: Need a link for this if and when we use it.
        basicScreeningCheckFailedMessage() {
            return "<p><b>Sefa</b> is currently unable to assist you with funding.</p>\
            <p>If you would like to be linked with other funders that may match your requirements, please click <a id = 'a-basic-screening-fail-redirect-popup' href = 'javascript:void(0)'><b>here</b></a>.</p >\
            <p>To understand <b>Sefa</b>'s qualification criteria, please click <a id = 'a-basic-screening-fail-info-popup' href = 'javascript:void(0)'><b>here</b></a>.</p>";
            //<p>To understand <b>Sefa</b>'s qualification criteria, please click <a target='_blank' href=''><b>here</b></a>.</p>";
        }

        //basicScreeningResult(cb) {
        //    let self = this;
        //    let result = app.wizard.addResult();
        //    cb(result);
        //}



        executeBackgroundChecksLogic(company, cb) {
            let companyId = company.id;

            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: 'Performing background checks...'
            });
            // TODO: Put this call in derived class!!!
            abp.services.app.smeCompaniesAppServiceExt.basicScreeningCheck(companyId).done(function (payload) {
                let result = app.wizard.addResult()
                result.data = JSON.parse(payload);
                if (result.data.Success != true) {
                    result.code = 1;
                }
                company.propertiesJson['basic-screening-checks'] = result.data.Checks;
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

        addHandlers() {
            super.addHandlers();

            $('#a-basic-screening-fail-info').on('click', (ev) => {
                if (failInfoShow == true) {
                    $('#div-basic-screening-fail-info').show('fast');
                } else {
                    $('#div-basic-screening-fail-info').hide('fast');
                }
                failInfoShow ^= true;
            });

            //$('#a-basic-screening-fail-redirect').on('click', (ev) => {
            //    app.onboard.wizard.cb('basic-scrceening-fail', null, null);
            //});
            //$('#a-user-verify-fail-redirect').on('click', (ev) => {
            //    app.onboard.wizard.cb('basic-scrceening-fail', null, null);
            //});
            //$('#a-owner-verify-fail-redirect').on('click', (ev) => {
            //    app.onboard.wizard.cb('basic-scrceening-fail', null, null);
            //});
        }

    }

    page.create = function (id) {
        return new Sefa(id);
    }

    page.Sefa = Sefa;

})(app.wizard.summary.page);
