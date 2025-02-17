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
            this.basicScreeningFailInfoShown = false;
            this.basicScreeningPass = true;
        }

        basicScreeningCheckFailedMessage() {

        }

        basicScreeningResult(cb) {
            let self = this;
            let result = app.wizard.addResult();
            if (this.basicScreeningPass == false) {
                swal.fire({
                    icon: 'warning',
                    //title: 'Basic screening check failed',
                    html: self.basicScreeningCheckFailedMessage(),
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    didOpen: () => {
                        $('#a-basic-screening-fail-redirect-popup').on('click', (ev) => {
                            if (self.cb != null) {
                                self.cb('basic-screening-fail-sign-out', null);
                            }
                        });
                        $('#a-basic-screening-fail-info-popup').on('click', (ev) => {
                            swal.close();
                            KTUtil.scrollTop();
                            self.showBasicScreeningFailInfo(true);
                        });
                    }
                }).then(() => {
                    result.status = app.wizard.Result.Fail;
                    cb(result);
                });
            } else {
                cb(result);
            }
        }

        showBasicScreeningFailInfo(show) {
            if (show == true) {
                $('#div-basic-screening-fail-info').show('fast');
            } else {
                $('#div-basic-screening-fail-info').hide('fast');
            }
            this.basicScreeningFailInfoShown = show;
        }

        toggleBasicScreeningFailInfo() {
            if (this.basicScreeningFailInfoShown == true) {
                $('#div-basic-screening-fail-info').hide('fast');
            } else {
                $('#div-basic-screening-fail-info').show('fast');
            }
            this.basicScreeningFailInfoShown ^= true;
        }

        showBasicScreeningPassMessage(show) {
            if (show == true) {
                $('#div-summary-basic-screening-pass').show('fast');
            } else {
                $('#div-summary-basic-screening-pass').hide('fast');
            }
        }

        showBasicScreeningFailMessage(show) {
            if (show == true) {
                $('#div-summary-basic-screening-fail').show('fast');
            } else {
                $('#div-summary-basic-screening-fail').hide('fast');
            }
        }

        executeBackgroundChecksPresentationPass(result, cb) {
            this.showBasicScreeningPassMessage(true);
            for (const key in result.data.Checks) {
                let value = result.data.Checks[key];
            }
            cb(app.wizard.addResult());
        }

        executeBackgroundChecksPresentationFail(result, cb) {
            this.showBasicScreeningFailMessage(true);
            cb(app.wizard.addResult());
        }

        executeBackgroundChecksPresentation(result, cb) {
            this.basicScreeningPass = result.code == 0;
            if (result.code == 0) {
                this.executeBackgroundChecksPresentationPass(result, (status) => {
                    cb(app.wizard.addResult());
                });
            } else {
                this.executeBackgroundChecksPresentationFail(result, (status) => {
                    cb(app.wizard.addResult());
                });
            }
        }

        executeBackgroundChecksLogic(company, cb) {
        }

        executeBackgroundChecks(company, cb) {
            cb(app.wizard.addResult());
        }

        validate(data, cb) {
            super.validate(data, cb);
        }

        dtoToPage(dto) {
        }

        pageToDto(dto) {
        }

        reset() {
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

                this.showBasicScreeningPassMessage(false);
                this.showBasicScreeningFailMessage(false);
                this.showBasicScreeningFailInfo(false);

                app.fss.user.render(args.user.user, "0");
                app.fss.owner.render(args.user.owner, "0");
                app.fss.company.render(args.user.company, "0");

                this.executeBackgroundChecks(args.user.company, function (status) {
                    cb(app.wizard.addResult());
                })

            } else {
                cb(app.wizard.addResult());
            }
            $('#button-wizard-prev').show();
        }

        neglectHidden(args, cb) {
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            cb(app.wizard.addResult());
        }

        addControls() {
        }

        addHandlers() {
            let self = this;
            $('#a-basic-screening-fail-redirect').on('click', (ev) => {
                if (self.cb != null) {
                    self.cb('basic-screening-fail-sign-out', null);
                }
            });
            //$('#a-basic-screening-fail-info').on('click', (ev) => {
            //    self.toggleBasicScreeningFailInfo();
            //});
        }
    }

    page.create = function (id) {
        return new Baseline(id);
    }

    page.Baseline = Baseline;

})(app.wizard.summary.page);
