"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.page == undefined) {
    app.wizard.page = {};
}

(function (page) {

    class SummaryPage extends app.wizard.page.Base {
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
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            app.fss.controller.renderSefaApplicationSummary(
                this.model.userProfile,
                this.model.ownerProfile,
                this.model.smeCompany.smeCompany,
                mc,
                this.model.application.application.id
            );
            app.fss.user.render(this.model.userProfile, this.model.application.application.id);
            app.fss.owner.render(this.model.ownerProfile.owner, this.model.application.application.id);
            app.fss.company.render(this.model.smeCompany.smeCompany, this.model.application.application.id);
        }

        load(args, cb) {
            this.model = args;
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            //$('#a-view-summary-pdf').show();
            this.renderSummary();
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
            this.controls['summary-declaration'] = app.control.checkbox('input-summary-declaration');
            this.controls['summary-declaration'].click((arg, name, value, checked) => {
                $('#button-wizard-submit').prop('disabled', checked ^ true);
            });
        }

        addHandlers() {
            let self = this;
        }
    }

    page.getSummaryPage = function (id) {
        return new SummaryPage(id);
    }
})(app.wizard.page);
