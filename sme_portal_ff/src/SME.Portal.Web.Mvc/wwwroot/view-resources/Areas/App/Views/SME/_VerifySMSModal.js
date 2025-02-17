if (app.modal == undefined) {
    app.modal = {};
}

app.modal.verifySms = null;

(function (modal) {
    let rootEl = null;
    let inputEl = null;

    let _id = '#VerifySmsModal';

    let _verifyCallback = null;
    let _staging = true;
    let _mobileNumber = null;

    let _shownCallback = null;
    let _hiddenCallback = null;

    function init() {
    }

    function show(cb = null) {

        function formValidation() {
            rootEl = KTUtil.getById('VerifySmsModal');
            inputEl = FormValidation.formValidation(
                rootEl,
                {
                    fields: {
                        'verifyotpsms': {
                            validators: {
                                callback: {
                                    callback: function (arg) {
                                        let regex = /^[0-9]{1,8}$/
                                        let res = regex.test(arg.value);
                                        return res;
                                    },
                                    message: 'SMS Code (OTP) Required'
                                }
                            }
                        }
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        bootstrap: new FormValidation.plugins.Bootstrap(
                            { defaultMessageContainer: false }
                        ),
                        messages: new FormValidation.plugins.Message({
                            clazz: 'text-danger',
                            container: function (field, element) {
                                switch (field) {
                                    case 'verifyotpsms':
                                        return document.getElementById('verify-sms-input-message');

                                    default:
                                        return element;
                                }
                            }
                        })
                    }
                }
            );
        }

        _shownCallback = cb;

        function initModal() {

            let _allowEscape = true;

            function validateOTP(cb) {
                inputEl.validate('verifyotpsms').then(function (status) {
                    if (status == 'Valid') {
                        cb();
                    } else {
                        _allowEscape = false;
                        Swal.fire({
                            text: "SMS Code (OTP) Required",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            }
                        }).then(function () {
                            _allowEscape = true;
                        });
                    }
                });
            }

            $(_id).keydown(function (args) {
                switch (args.key) {
                    case 'Enter':
                        validateOTP(function () {
                            let code = $('#VerifySmsInput').val();
                            hide(function () {
                                sendVerificationCode(code);
                            })
                        });
                        break;

                    case 'Escape':
                        if (_allowEscape == true) {
                            hide(function () {
                                let status = AddStatus();
                                status.result = Result.Cancel;
                                _verifyCallback(status);
                            });
                        }
                        break;
                }
            });

            $('#VerifySmsBtnCancel').click(function (args) {
                hide(function () {
                    let status = AddStatus();
                    status.result = Result.Cancel;
                    _verifyCallback(status);
                });
            });

            $('#VerifySmsBtnApply').click(function (args) {
                validateOTP(function () {
                    $('#VerifySmsBtnApply').prop('disabled', true);
                    $('#id-verify-mobile-resend-button').prop('disabled', true);
                    let code = $('#VerifySmsInput').val();
                    hide(function () {
                        sendVerificationCode(code);
                    });
                });
                return false;
            });

            $('#id-verify-mobile-resend-button').click(function (args) {
                hide(function () {
                    app.modal.verifySms.verify(_mobileNumber, _verifyCallback);
                });
            });

            $(_id).on('shown.bs.modal', function () {
                formValidation();
                if (_shownCallback != null) {
                    _shownCallback();
                    _shownCallback = null;
                }
            });

            $(_id).on('hidden.bs.modal', function () {
                if (_hiddenCallback != null) {
                    _hiddenCallback();
                    _hiddenCallback = null;
                }
                $('#VerifySmsModal').remove();
            });

            $(_id).modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            });

            $(_id).modal('show');

            let smsInput = app.common.input.numeric('VerifySmsInput', 8);
        }

        app.modal.common.renderPartialView('_VerifySMSModal', function () {
            initModal();
        });
    }

    function hide(cb) {
        _hiddenCallback = cb;
        $(_id).modal('hide');
    }

    function getVerificationCode(cb, mobileNumber) {
        if (_staging == true) {
            abp.services.app.profile.sendVerificationSms({ phoneNumber: mobileNumber })
                .done(function () {
                    cb();
                });
        } else {
            window.setTimeout(function () {
                cb();
            }, 1000);
        }
    }

    function verify(mobileNumber, cb) {
        // TODO: Validation for in progress verification?
        _mobileNumber = mobileNumber;
        _staging = mobileNumber != '0829999999';
        _verifyCallback = cb;
        if (_staging == true) {
            let regex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
            if (regex.test(mobileNumber) == false) {
                Swal.fire({
                    text: app.localize('InvalidMobile'),
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    allowEscapeKey: false,
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light"
                    }
                }).then(function () {
                });
                let status = AddStatus();
                status.result = Result.Fail;
                cb(status); 
                return;
            }
        }

        if (abp.services.app.profile != null) {
            //let busy = app.modal.busy();
            //busy.show('_BusyAnimModal', app.localize('VerifyMobile'), function () {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: app.localize('VerifyMobile')
            });
                getVerificationCode(function () {
                    //busy.hide(function () {
                    KTApp.unblockPage();
                        show();
                    //});
                }, mobileNumber);
            //});
        }
    }

    function sendVerificationCode(smsCode) {
        //let busy = app.modal.busy();
        //busy.show('_BusyAnimModal', app.localize('VerifyOTP'), function () {
        KTApp.blockPage({
            overlayColor: 'blue',
            opacity: 0.1,
            state: 'primary',
            message: app.localize('VerifyOTP')
        });
            function otpVerified() {
                //busy.hide(function () {
                KTApp.unblockPage();
                    _verifyCallback(AddStatus());
                //});
            }

            function otpNotVerified() {
                //busy.hide(function () {
                KTApp.unblockPage();
                    Swal.fire({
                        text: app.localize('VerifyOTPError'),
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        allowEscapeKey : false,
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    }).then(function () {
                        let status = AddStatus();
                        status.result = Result.Fail;
                        _verifyCallback(status);
                    });
                //});
            }

            if (_staging == true) {
                let input = {
                    phoneNumber: _mobileNumber,
                    code: smsCode
                };
                abp.services.app.profile.verifySmsCodeExt(input).done(function (result) {
                    if (result == true) {
                        otpVerified();
                    } else {
                        otpNotVerified();
                    }
                });
            } else {
                window.setTimeout(function () {
                    otpVerified();
                    //otpNotVerified();
                }, 1000);
            }
        //});
    }

    modal.verifySms = {
        init: init,
        show: show,
        hide: hide,
        verify : verify
    };

    app.modal.verifySms.init();

})(app.modal);
