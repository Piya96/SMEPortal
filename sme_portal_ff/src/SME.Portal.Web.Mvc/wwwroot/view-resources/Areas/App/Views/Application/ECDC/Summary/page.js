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

    class Summary extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Summary Page';
        }

        remap(nvp, cb) {
            return [];
        }

        serialize() {
            return [];
        }

        validate(data, cb) {
            cb(app.wizard.addResult());
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

            app.wizard.productMatching.summary.render(dto, this.model.application.application.id);
            app.wizard.fundingRequirements.summary.render(dto, this.model.application.application.id);
            app.wizard.companyInfo.summary.render(dto, this.model.application.application.id);

            app.wizard.financialInfo.summary.render(dto, this.model.application.application.id);

            app.wizard.keyThings.summary.render(dto, this.model.smeCompany.smeCompany.id, this.model.application.application.id, null, false);

            //let productGuid = this.helpers.getPropEx(dto, 'input-product-guid', '');
            //abp.services.app.documentsAppServiceExt.getAllUploadedSefaDocuments(
            //    productGuid[0], this.model.smeCompany.smeCompany.id).done((payload) => {
            //        let docs = [];
            //        payload.sort(function (a, b) {
            //            return a.name > b.name ? 1 : -1;
            //        });
            //        payload.forEach((doc, idx) => {
            //            if (doc.hasBeenUploaded == true) {
            //                docs.push(doc);
            //            }
            //        });
            //        app.wizard.keyThings.summary.render(
            //            docs, this.model.smeCompany.smeCompany.id, this.model.application.application.id, null, false
            //        );
            //    });
        }

        attentionHidden(args, cb) {
            if (args.isNext == true) {
                this.renderSummary();
            }
            cb(app.wizard.addResult());
        }

        load(args, cb) {
            this.model = args;
            //app.common.sic.create(null);
            //this.sic = app.common.sic;
            app.wizard.isb.init(null, null, null);
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            super.attention(args, cb);
        }

        addControls() {
            let control = this.addControl('input-summary-declaration', 'checkbox');
        }

        addHandlers() {
            this.controls['input-summary-declaration'].click((arg, name, value, checked) => {
                $('#button-wizard-submit').prop('disabled', checked ^ true);

                //$.ajax({
                //    type: "POST",
                //    contentType: "application/json; charset=utf-8",
                //    url: "/App/FunderSearch/Submit",
                //    data: JSON.stringify(data),
                //    success: function (data) {
                //        KTApp.unblockPage();
                //        result.data = {
                //            id: data.result.id
                //        };
                //        cb(result);
                //    },
                //    error: function (data) {
                //        KTApp.unblockPage();
                //        result.status = app.wizard.Result.Fail
                //        cb(result);
                //    }
                //});
            });
        }
    }

    page.create = function (id) {
        return new Summary(id);
    }
})(app.wizard.summary.page);
