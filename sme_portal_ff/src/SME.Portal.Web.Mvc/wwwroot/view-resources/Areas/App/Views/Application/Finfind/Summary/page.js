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

    class Baseline extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Summary Page';
        }

        validate(data, cb) {
            super.validate(data, cb);
        }

        serialize() {
            return [];
        }

        dtoToPage(dto) {
        }

        pageToDto(dto) {
        }

        reset() {
        }

        renderSummary() {
            //let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            app.fss.user.render(this.model.userProfile, this.model.application.application.id);
            app.fss.owner.render(this.model.ownerProfile.owner, this.model.application.application.id);
            app.fss.company.render(this.model.smeCompany.smeCompany, this.model.application.application.id);

            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            let dto = this.helpers.nvpArrayToObject(mc);
            app.wizard.fundingRequirements.summary.render(dto, this.model.application.application.id);
            app.wizard.companyInfo.summary.render(dto, this.model.application.application.id);
            app.wizard.lenderDocuments.summary.render(dto, this.model.application.application.id);
            app.wizard.keyThings.summary.render(dto, this.model.application.application.id);
            app.wizard.financialInfo.summary.render(dto, this.model.application.application.id);
            //app.fss.legalQuestions.render(mc, this.model.application.application.id);
        }

        load(args, cb) {
            this.model = args;
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            if (args.isNext == true) {
                this.renderSummary();
            }
            cb(app.wizard.addResult());
        }

        neglectHidden(args, cb) {
            //$('#a-view-summary-pdf').hide();
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            cb(app.wizard.addResult());
        }

        addControls() {
            $('#button-wizard-submit').prop('disabled', false);
            this.controls['summary-declaration'] = app.control.checkbox('input-summary-declaration');
            this.controls['summary-declaration'].click((arg, name, value, checked) => {
                //$('#button-wizard-submit').prop('disabled', false);
                $('#button-wizard-submit').prop('disabled', checked ^ true);
            });
        }

        addHandlers() {
            let self = this;
        }
    }

    page.create = function (id) {
        return new Baseline(id);
    }

    page.Baseline = Baseline;

})(app.wizard.summary.page);
