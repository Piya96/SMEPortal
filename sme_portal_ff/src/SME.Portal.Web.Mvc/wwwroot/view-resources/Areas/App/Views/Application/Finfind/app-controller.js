// The wizard controller is responsible for facilitating flow between individual wizard
// pages by sending messages to the wizard pages via interface that is implemented by
// wizard pages.

"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.controller == undefined) {
    app.wizard.controller = {};
}

(function (controller) {

    controller.Pages = {
        Intro: 0,
        FundingRequrements: 1,
        CompanyInfo: 2,
        FinancialInfo : 3,
        LenderDocuments: 4,
        MinRequirements: 5,
        Summary: 6,
        Complete: 7
    };

    class AppController extends app.wizard.controller.Controller {
        constructor(wizardId, bodyId) {
            super(wizardId, bodyId);
            this.name = 'App Controller';
        }

        load(args, cb) {
            let self = this;

            this.model = args;
            let loadCounter = 1;
            function loadComplete() {
                if (--loadCounter == 0) {
                    cb(app.wizard.addResult());
                }
            }

            let mc = JSON.parse(args.application.application.matchCriteriaJson);
            let dto = this.helpers.nvpArrayToObject(mc);

            this.activePage = this.helpers.getNvpValue(dto, 'active-page', 0);
            this.activePage = controller.Pages.Intro;
            //this.activePage = controller.Pages.MinRequirements;
            //this.activePage = controller.Pages.CompanyInfo;
            //this.activePage = controller.Pages.FinancialInfo;
            //this.activePage = controller.Pages.LenderDocuments;
            //this.activePage = controller.Pages.Summary;
            if (this.activePage == '') {
                this.activePage = '0';
            }
            //this.activePage = parseInt(this.activePage);
            super.load(args, (result) => {

                this.goto(this.activePage, (result) => {

                    loadComplete();

                })
            });
        }

        updateUserJourneyProp(page, prop) {
            let self = this;
            function getApplicationProp() {
                for (let i = 0, max = prop.application.length; i < max; i++) {
                    if (prop.application[i].id == self.model.application.application.id) {
                        return prop.application[i];
                    }
                }
                prop.application.push({
                    id: self.model.application.application.id,
                    stage: 'FundingRequirements',
                    page: controller.Pages.FundingRequirements
                })
                return prop.application[prop.application.length - 1];
            }

            let app = getApplicationProp();

            if (app.page != null && app.page >= page) {
                return;
            } else {
                app.page = page;
                switch (page) {
                    case controller.Pages.Intro:
                    case controller.Pages.FundingRequrements:
                        app.stage = 'FundingRequirements';
                        break;

                    case controller.Pages.CompanyInfo:
                        app.stage = 'CompanyInfo';
                        break;

                    case controller.Pages.FinancialInfo:
                        app.stage = 'FinancialInfo';
                        break;

                    case controller.Pages.LenderDocuments:
                        app.stage = 'LenderDocuments';
                        break;

                    case controller.Pages.MinRequirements:
                        app.stage = 'MinRequirements';
                        break;

                    case controller.Pages.Summary:
                        app.stage = 'Summary';
                        break;

                    case controller.Pages.Complete:
                        app.stage = 'Complete';
                        break;
                }
            }
        }

        getController() {
            return 'FinfindFunderSearch';
        }

        __save__(partial, cb) {
            let self = this;

            let formData = $('form').serializeArray();

            let arr = self.remap(formData, null);
            let temp = formData.concat(arr);

            formData = JSON.stringify(temp);

            // TODO: This needs to be common base assignment.
            this.model.application.application.matchCriteriaJson = formData;

            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: partial == true ? 'Saving page data...' : 'Submitting Finance Application'
            });

            let data = {
                Id: this.model.application.application.id,
                Partial: partial,
                JsonStr: formData,
                MatchCriteriaJson: null,
                FunderSearchJson: null
            };
            data.MatchCriteriaJson = data.JsonStr;
            data.FunderSearchJson = null;
            let result = app.wizard.addResult();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/App/" + self.getController() + "/Submit",
                data: JSON.stringify(data),
                success: function (data) {
                    KTApp.unblockPage();
                    result.data = {
                        id : data.result.id
                    };
                    cb(result);
                },
                error: function (data) {
                    KTApp.unblockPage();
                    result.status = app.wizard.Result.Fail
                    cb(result);
                }
            });
        }

        save(args, cb) {
            this.__save__(true, cb);
        }

        addHandlers() {
            super.addHandlers();
            let self = this;

            $('#button-wizard-cancel').on('click', (ev) => {
                Swal.fire({
                    title: 'Are you sure you want to cancel this Application?',
                    text: "You won't be able to revert after this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, cancel it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        abp.services.app.applicationAppServiceExt.cancelApplication(this.model.application.application.id);
                        this.cb('application-cancel', null);
                    }
                })
            });

            $('#button-wizard-save').on('click', (ev) => {
                Swal.fire({
                    title: 'Are you sure you want to save and exit this Application?',
                    //text: "You won't be able to revert after this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, save and exit!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.__save__(true, (result) => {
                            this.cb('application-exit', null);
                        });
                    }
                })
            });

            $('#button-wizard-cancel').on('click', (ev) => {
                cb('application-cancel', result);
            });

            $('#button-wizard-submit').prop('disabled', true);
        }

        validate(args, cb) {
            let self = this;
            super.validate(args, (result) => {
                cb(result);
            });
        }

        // Note: If we ever invoke this method directly, then be very carefull about what we normally pass in to args
        //       ( if any ) from one page to the next.
        attentionHidden(args, cb) {
            super.attentionHidden(args, cb);
            if (args.curr == controller.Pages.Intro) {
                $('#button-wizard-save').hide();
            } else {
                $('#button-wizard-save').show();
            }
        }

        attention(args, cb) {
            super.attention(args, (result) => {
                cb(app.wizard.addResult());
            });
        }

        neglect(data, cb) {
            let self = this;
            if (data.curr < this.pages.length && this.pages[data.curr] != null) {
                super.neglect(data, (result) => {
                    cb(result);
                });
            } else {
                cb(app.wizard.addResult());
            }
        }

        getSummaryDocName() {
            return 'Finfind Summary.pdf';

        }

        getSummaryDocType() {
            return '0123456789A00000';

        }

        __onSubmit__(cb) {
            let self = this;
            let submitId = '#' + this.getSubmitId();
            $(submitId).prop('disabled', true);
            $(submitId).prop('disabled', false);


            function submitDone() {
                self.__save__(false, (result) => {
                    self.cb('application-submit', result);
                });
                cb(app.wizard.addResult());
            }

            getFunderSearchSummaryBase64(
                self.getController(),
                self.model.smeCompany.smeCompany.id,
                self.model.application.application.id,
                (result) => {
                    KTApp.blockPage({
                        overlayColor: 'blue',
                        opacity: 0.1,
                        state: 'primary',
                        message: 'Uploading Summary pdf'
                    });

                    let data = {
                        FileName: self.getSummaryDocName(),
                        CompanyId: self.model.smeCompany.smeCompany.id,
                        Bytes: result.data,
                        DocumentType: self.getSummaryDocType()
                    };
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/App/SefaDocuments/UploadSummaryPdf",
                        data: JSON.stringify(data),
                        success: function (data) {
                            KTApp.unblockPage();
                            let result = app.wizard.addResult();
                            submitDone();
                        },
                        error: function (data) {
                            KTApp.unblockPage();
                            let result = app.wizard.addResult();
                            result.status = app.wizard.Result.Fail
                            submitDone();
                        }
                    });
                }
            );
        }

        onSubmit(cb) {
            let self = this;
            this.updateUserJourney(controller.Pages.Complete, (result) => {
                self.__onSubmit__(cb);
            });
        }
    }

    controller.create = function (wizardId, bodyId) {
        return new AppController(wizardId, bodyId);
    }

    controller.AppController = AppController;

    controller.FinfindAppController = AppController;

    controller.Finfind = AppController;

})(app.wizard.controller);
