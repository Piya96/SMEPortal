"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.common == undefined) {
    app.wizard.common = {};
}

if (app.wizard.common.page == undefined) {
    app.wizard.common.page = {};
}

(function (page) {

    const Titles = {
        Mr: '622605ca67e3cc13cf216096',
        Mrs: '622605ca67e3cc13cf216097',
        MS: '622605ca67e3cc13cf216098'
    };

    class AppCommon extends app.wizard.page.Common {
        constructor() {
            super();
            this.name = 'App Common';
        }

        populateTitle(vrec, control) {
            if (vrec.Gender == 'Male') {
                control.val(Titles.Mr);
            } else if (vrec.Gender == 'Female') {
                if (vrec.MaritalStatus == 'Married') {
                    control.val(Titles.Mrs);
                } else {
                    control.val(Titles.MS);
                }
            }
        }

        getIdentityButtonFunc(id1, id2, self) {
            let identityButtonFunc = this.helpers.buttonState(id1, id2);
            return function (validFormat) {
                let text = null;
                let enable = null;
                let flash = null;
                if (self.model.isIdentityOrPassportConfirmed == true) {
                    enable = false;
                    flash = false;
                    text = (' ' + app.localize('OW_MobileVerifiedButton'));
                } else {
                    enable = validFormat;
                    flash = validFormat;
                    text = (' ' + app.localize('OW_MobileVerifyButton'));
                }
                identityButtonFunc(enable, flash, text);
            }
        }

        getIdentityControlFunc(id1, id2, id3, self) {
            let identityButtonFunc = this.helpers.buttonState(id1, id2, self.controls);
            let identityButtonImpl = this.getIdentityButtonFunc(id1, id2, self);
            return function (validFormat, validating = false) {
                if (validating == true) {
                    identityButtonFunc(false, false, 'Verifying');
                    self.controls[id3].enable(false)
                } else {
                    identityButtonImpl(validFormat);
                    self.controls[id3].enable(self.model.isIdentityOrPassportConfirmed == false)
                }
            }
        }

        getMobileButtonFunc(id1, id2, self) {
            let mobileButtonFunc = this.helpers.buttonState(id1, id2);
            return function (validFormat) {
                let text = null;
                let enable = null;
                let flash = null;
                if (self.model.isPhoneNumberConfirmed == true) {
                    enable = false;
                    flash = false;
                    text = (' ' + app.localize('OW_MobileVerifiedButton'));
                } else {
                    enable = validFormat;
                    flash = validFormat;
                    text = (' ' + app.localize('OW_MobileVerifyButton'));
                }
                mobileButtonFunc(enable, flash, text);
            }
        }

        getMobileControlFunc(id1, id2, id3, self) {
            let mobileButtonFunc = this.helpers.buttonState(id1, id2, self.controls);
            let mobileButtonImpl = this.getMobileButtonFunc(id1, id2, self);
            return function (validFormat, verify = null) {
                if (verify == 'verifying') {
                    mobileButtonFunc(false, false, 'Verifying');
                    self.controls[id3].enable(false)
                } else if(verify == 'verify') {
                    mobileButtonFunc(false, false, 'Verify');
                    self.controls[id3].enable(false)
                } else {
                    mobileButtonImpl(validFormat);
                    self.controls[id3].enable(self.model.isPhoneNumberConfirmed == false)
                }
            }
        }

        validateIdentityNumber(id1, id2, id3, id4, id5, identityControl, mobileControl, self, cb) {
            $('#' + id1).on('click', (ev) => {
                identityControl(false, true);
                let identityNumber = self.controls[id4].val();
                let mobileNumber = self.controls[id5].val();
                app.wizard.service.getIdentityDetails(identityNumber, id2, id3, (result) => {

                    function resultSuccess() {
                        self.model.isIdentityOrPassportConfirmed = true;
                        self.model.verificationRecordJson = result.data;
                        identityControl(true);
                        mobileControl(self.helpers.validMobileFormat(mobileNumber));
                    }

                    function resultFail() {
                        self.model.verificationRecordJson = null;
                        identityControl(true);
                    }

                    switch (result.status) {
                        case app.wizard.Result.Success:
                            resultSuccess();
                            break;

                        case app.wizard.Result.Fail:
                            resultFail();
                            break;
                    }
                    cb(result);
                });
            });
        }

        validateMobileNumber(id1, id2, identityId, identityControl, mobileControl, self, cb) {

            function resultFail(result = null) {
                self.model.isIdentityOrPassportConfirmed = false;
                self.model.verificationRecordJson = null;
                identityControl(true);
                mobileControl(true, 'verify');
                if (result != null) {
                    cb(result);
                }
            }

            function verifyMobileNumber(mobileNumber, cb) {
                let session = {
                    loggedIn: true,
                    tenantId: abp.session.tenantId,
                    userId: abp.session.userId
                };
                let args = {
                    id : 'mobile',
                    data: {
                        number : mobileNumber
                    }
                };
                app.wizard.service.verifyMobileNumber(session, args, (result) => {
                //app.wizard.service.verifyMobileNumber(null, mobileNumber, (result) => {

                    function resultSuccess() {
                        self.model.isPhoneNumberConfirmed = true;
                        mobileControl(true);
                    }

                    function resultCancel() {
                        mobileControl(true);
                    }

                    switch (result.status) {
                        case app.wizard.Result.Success:
                            resultSuccess();
                            //resultFail();
                            break;

                        case app.wizard.Result.Cancel:
                            resultCancel();
                            break;

                        case app.wizard.Result.Fail:
                            resultFail();
                            break;
                    }
                    cb(result);
                });
            }


            $('#' + id1).on('click', (ev) => {
                mobileControl(false, 'verifying');
                let mobileNumber = self.controls[id2].val();
                let identityNumber = self.controls[identityId].val();
                app.wizard.service.verifyMobileAgainstId(identityNumber, mobileNumber, (result) => {

                    if (result.status == app.wizard.Result.Success) {
                        verifyMobileNumber(mobileNumber, (result) => {
                            cb(result);
                        });
                    } else {
                        Swal.fire({
                            html: 'Mobile Number could not be matched against numbers listed for this Identity Number<br/><br/>Please capture another Identity Number or Mobile Number and verify again',
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            }
                        }).then(function () {
                            resultFail(result);
                        });
                    }
                });

            });
        }
    }

    page.create = function () {
        return new AppCommon();
    }

    page.AppCommon = AppCommon;

})(app.wizard.common.page);
