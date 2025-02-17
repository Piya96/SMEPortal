// ----------------------------------------------------------------------------------------------------- //
function VerifyMobileNumber(mobileNo, cb) {
    app.modal.verifySms.verify(mobileNo, cb);
}

let wizardCommon = {
};

//function onboardingLoadWizard() {
    // ----------------------------------------------------------------------------------------------------- //
    if (app.onboard == undefined) {
        app.onboard = {};
    }

    app.onboard.wizard = null;

    (function (onboard) {

        let FadeSpeed = 500;

        let MODE = {
            Normal: 0,
            Add: 1,
            Edit: 2
        };

        let PAGE = {
            Welcome : 1,
            UserProfile: 2,
            OwnerProfile: 3,
            CompanyProfile: 4,
            //MandateFit: 5,
            Summary: 5
        };

        let _mode = MODE.Normal;
        let _companyId = -1;
        let _cb = null;

        function init(mode, companyId, isEmailConfirmed, cb, model) {

            function initEmailConfirmed() {
                if (_mode == MODE.Add || _mode == MODE.Edit) {
                    $('#Id-Form-Prev').prop('disabled', true);
                }

                $('#Id-Form-Submit').click(function () {
                    submitDto(function (status) {
                    });
                });

                function AddressComplete(addressComponents) {
                    //companyProfile.autoFillAddrComplete(addressComponents);
                    app.onboard.company.autoFillAddrComplete(addressComponents);
                }
                setFillInAddrComplete(AddressComplete);

                //companyProfile.initCompanies();

                const minloadPageMillis = 1000;
                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: app.localize('LoadOnboarding')
                });

                function loadPages(cb) {

                    function loadUser(cb) {
                        app.onboard.user.loadDto(function (status, dto) {
                            cb(status);
                        });
                    }

                    function loadOwner(cb) {
                        let ownerArgs = {
                            dto: null,
                            extra: {
                                isUserOwner: app.onboard.user.dto.isOwner
                            }
                        };
                        app.onboard.owner.loadDto(ownerArgs, function (status, dto) {
                            cb(status);
                        });
                    }

                    function loadCompany(cb) {
                        app.onboard.company.loadDto(function (status, dto) {
                            cb(status);
                        });
                    }

                    function loadSummary(cb) {
                        app.onboard.summary.loadDto(function (status, dto) {
                            cb(status);
                        });
                    }

                    function onLoadComplete() {
                        window.setTimeout(function () {
                            KTApp.unblockPage();
                            $('#onboarding-wizard').show();
                            cb();
                        }, minloadPageMillis);
                        app.common.mobile.refresh(_mode == MODE.Normal);
                    }

                    function loadComplete() {
                        if (_mode == MODE.Add || _mode == MODE.Edit) {
                            //KTWizard2.goTo(PAGE.UserProfile, onLoadComplete);
                            KTWizard2.goTo(PAGE.CompanyProfile, onLoadComplete);
                        } else {
                            KTWizard2.goTo(PAGE.Welcome, onLoadComplete);
                        }
                    }

                    loadUser(function (status) {
                        loadOwner(function (status) {
                            loadCompany(function (status) {

                                if(status.result == Result.Pass) {
                                    loadSummary(function (status) {
                                        loadComplete();
                                    });
                                } else {
                                    KTApp.unblockPage();
                                    Swal.fire({
                                        text: 'Owner has no additional companies available',
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn font-weight-bold btn-light"
                                        }
                                    }).then(function () {
                                        app.onboard.wizard.cb('no-available-companies', null, null);
                                    });
                                }

                            });
                        });
                    });
                }
                loadPages(function () {
                });
            }

            function initEmailNotConfirmed() {
                swal.fire({
                    icon: 'warning',
                    title: app.localize('EmailNotVerified'),
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonText: app.localize('TakeMeToEmailVerificationPage')
                }).then(function () {
                    window.location = '/Account/EmailActivation';
                });
            }

            _mode = parseInt(mode);
            onboard.wizard.mode = _mode;
            _companyId = parseInt(companyId);
            onboard.wizard.companyId = _companyId;
            _cb = cb;
            onboard.wizard.cb = cb;

            let emailConfirmed = isEmailConfirmed.toLowerCase();
            switch (emailConfirmed) {
                case 'true':
                    initEmailConfirmed();
                    break;

                default:
                    initEmailNotConfirmed();
                    cb(AddStatus());
                    break;
            }
        }

        function toggleNext(enable) {
            $('#Id-Form-Next').prop('disabled', enable ^ true);
        }

        function togglePrev(enable) {
            $('#Id-Form-Prev').prop('disabled', enable ^ true);
        }

        function userDtoToOwnerDto(userDto, ownerDto) {
            ownerDto.owner.name = userDto.name;
            ownerDto.owner.surname = userDto.surname;
            ownerDto.owner.emailAddress = userDto.emailAddress;
            ownerDto.owner.phoneNumber = userDto.phoneNumber;
            ownerDto.owner.identityOrPassport = userDto.identityOrPassport;
            ownerDto.owner.verificationRecordJson = userDto.verificationRecordJson;
        }

        function submitDto(cb) {
            const MinSubmitTime = 3000;

            $('#Id-Form-Submit').prop('disabled', true);
            $('#Id-Form-Prev').prop('disabled', true);

            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: app.localize('OnboardingSubmit')
            });

            let _companyId = null;
            let count = 0;
            function submitDone(status) {
                count++;
                if (count == 5) {
                    KTApp.unblockPage();
                    cb(AddStatus());
                    if (app.onboard.wizard.cb != null) {
                        app.onboard.wizard.cb('SubmitDone', app.onboard.wizard.mode, _companyId);
                    }
                }
            }
            app.onboard.user.submitDto(function (status) {
                submitDone(status);
            }, false);

            app.onboard.owner.submitDto(function (status, ownerId) {
                submitDone(status);

                app.onboard.company.submitDto(function (status, companyId) {
                    _companyId = companyId;
                    submitDone(status);

                }, ownerId);
            });

            window.setTimeout(function () {
                submitDone(AddStatus());
            }, MinSubmitTime);

            $('#id-onboarding-div').fadeOut(FadeSpeed, 'swing', function () {
                submitDone(AddStatus());
            });
        }

        function validate(from, foreward, cb) {

            function validateNext(cb) {
                switch (from) {
                    case PAGE.Welcome:
                        cb(AddStatus());
                        break;

                    case PAGE.UserProfile:
                        app.onboard.user.validate(foreward, cb);
                        break;

                    case PAGE.OwnerProfile:
                        app.onboard.owner.validate(foreward, cb);
                        break;

                    case PAGE.CompanyProfile:
                        app.onboard.company.validate(foreward, cb);
                        break;

                    case PAGE.Summary:
                        break;

                    default:
                        cb(AddStatus());
                        break;
                }
            }

            function validatePrev(cb) {
                cb(AddStatus());
            }

            if (foreward == true) {
                return validateNext(cb);
            } else {
                return validatePrev(cb);
            }
        }

        function attention(page, foreward, cb) {

            function attentionNext() {
                switch (page) {
                    case PAGE.Welcome:
                        //$('#id-onboarding-div').fadeIn(FadeSpeed, 'swing', function () {
                        //    $('#Id-Form-Next').hide();
                        //    app.common.landing.attention('#id-landing-info-message-div', '#id-landing-info-message-button', 'landing');
                        //    cb(AddStatus());
                        //});
                        cb(AddStatus());
                        break;

                    case PAGE.UserProfile:
                        app.onboard.user.attention(PAGE.Welcome, PAGE.UserProfile, true, function (status) {
                            app.common.landing.attention('#id-user-info-message-div', '#id-user-info-message-button', 'user');
                            $('#id-onboarding-div').fadeIn(FadeSpeed, 'swing', function () {
                                togglePrev(true);
                                toggleNext(true);
                                cb(status);
                            });
                        });
                        break;

                    case PAGE.OwnerProfile:
                        app.onboard.owner.attention(PAGE.UserProfile, PAGE.OwnerProfile, true, function (status) {
                            app.common.landing.attention('#id-owner-info-message-div', '#id-owner-info-message-button', 'owner');
                            $('#id-onboarding-div').fadeIn(FadeSpeed, 'swing', function () {
                                togglePrev(true);
                                toggleNext(true);
                                cb(status);
                            });
                        });
                        break;

                    case PAGE.CompanyProfile:
                        app.onboard.company.attention(PAGE.OwnerProfile, PAGE.CompanyProfile, true, function (status) {
                            app.common.landing.attention('#id-company-info-message-div', '#id-company-info-message-button', 'company');
                            $('#id-onboarding-div').fadeIn(FadeSpeed, 'swing', function () {
                                togglePrev(_mode == MODE.Normal);
                                toggleNext(true);

                                if (_mode == MODE.Normal && app.onboard.user.dto.isOwner == true) {
                                    let temp = app.onboard.owner.dto.owner.verificationRecordJson;
                                    app.onboard.user.dto.verificationRecordJson = temp;
                                    app.onboard.user.submitDto(function (status) {
                                        cb(status);
                                    }, true);
                                } else {
                                    cb(status);
                                }
                            });
                        });
                        break;

                    case PAGE.Summary:
                        app.onboard.summary.attention(PAGE.CompanyProfile, PAGE.Summary, true, function (status) {
                            $('#Id-Form-Next').hide();
                            $('#id-onboarding-div').fadeIn(FadeSpeed, 'swing', function () {
                                togglePrev(true);
                                cb(status);
                            });
                        });
                        break;

                    default:
                        cb(AddStatus());
                        break;
                }
            }

            function attentionPrev() {
                switch (page) {
                    case PAGE.Welcome:
                        break;

                    case PAGE.UserProfile:
                        //$('#Id-Form-Prev').hide();
                        app.onboard.user.attention(PAGE.OwnerProfile, PAGE.UserProfile, false, function (status) {
                        });
                        break;

                    case PAGE.OwnerProfile:
                        app.onboard.owner.attention(PAGE.CompanyProfile, PAGE.OwnerProfile, false, function (status) {
                        });
                        break;

                    case PAGE.CompanyProfile:
                        toggleNext(true);
                        togglePrev(_mode == MODE.Normal);
                        app.onboard.company.attention(PAGE.Summary, PAGE.CompanyProfile, false, function (status) {
                        });
                        break;

                    case PAGE.Summary:
                        break;
                }
                cb(AddStatus());
            }

            if (foreward == true) {
                attentionNext();
            } else {
                attentionPrev();
            }
        }

        function neglect(page, foreward, cb) {

            function neglectNext() {
                switch (page) {
                    case PAGE.Welcome:
                        cb(AddStatus());
                        break;

                    case PAGE.UserProfile:
                        toggleNext(false);
                        togglePrev(false);
                        app.onboard.user.neglect(PAGE.UserProfile, PAGE.OwnerProfile, true, function (status) {
                            if (status.result == Result.Pass) {
                                $('#id-onboarding-div').fadeOut(FadeSpeed, 'swing', function () {
                                    app.common.landing.neglect('#id-user-info-message-div', '#id-user-info-message-button', 'user');
                                    if (app.onboard.user.dto.isOwner == true) {
                                        let ownerDto = { owner: {} };
                                        userDtoToOwnerDto(app.onboard.user.dto, ownerDto);
                                        app.onboard.owner.userIsOwnerUpdate(ownerDto);
                                    } else {
                                        app.onboard.owner.userIsNotOwnerUpdate();
                                    }
                                    cb(status);
                                });
                            } else {
                                toggleNext(true);
                                cb(status);
                            }
                        });
                        break;

                    case PAGE.OwnerProfile:
                        toggleNext(false);
                        togglePrev(false);
                        app.onboard.owner.neglect(PAGE.OwnerProfile, PAGE.CompanyProfile, true, function (status) {
                            if (status.result == Result.Pass) {
                                $('#id-onboarding-div').fadeOut(FadeSpeed, 'swing', function () {
                                    app.common.landing.neglect('#id-owner-info-message-div', '#id-owner-info-message-button', 'user');
                                    cb(status);
                                });
                            } else {
                                toggleNext(true);
                                togglePrev(true);
                                cb(status);
                            }
                        });
                        break;

                    case PAGE.CompanyProfile:
                        toggleNext(false);
                        app.onboard.company.neglect(PAGE.CompanyProfile, PAGE.Summary, true, function (status) {
                            $('#id-onboarding-div').fadeOut(FadeSpeed, 'swing', function () {
                                app.common.landing.neglect('#id-company-info-message-div', '#id-company-info-message-button', 'user');
                                cb(status);
                            });
                        });
                        break;

                    //case PAGE.MandateFit:
                    //    app.onboard.mandateFit.neglect(PAGE.MandateFit, PAGE.Summary, true, function (status) {
                    //        $('#id-onboarding-div').fadeOut(FadeSpeed, 'swing', function () {
                    //            cb(AddStatus());
                    //        });
                    //    });
                    //    break;

                    case PAGE.Summary:
                        break;

                    default:
                        cb(AddStatus());
                        break;
                }
            }

            function neglectPrev() {
                switch (page) {
                    case PAGE.Welcome:
                        break;

                    case PAGE.UserProfile:
                        //app.onboard.company.neglect(PAGE.UserProfile, PAGE.Welcome, false, function (status) {
                        //});
                        break;

                    case PAGE.OwnerProfile:
                        app.onboard.owner.neglect(PAGE.OwnerProfile, PAGE.UserProfile, false, function (status) {
                        });
                        break;

                    case PAGE.CompanyProfile:
                        app.onboard.company.neglect(PAGE.CompanyProfile, PAGE.OwnerProfile, false, function (status) {
                        });
                        break;

                    //case PAGE.MandateFit:
                    //    app.onboard.mandateFit.neglect(PAGE.MandateFit, PAGE.CompanyProfile, false, function (status) {
                    //    });
                    //    break;

                    case PAGE.Summary:
                        break;
                }
                cb(AddStatus());
            }

            if (foreward == true) {
                neglectNext();
            } else {
                neglectPrev();
            }
        }

        onboard.wizard = {
            init: init,
            validate: validate,
            toggleNext: toggleNext,
            validate: validate,
            attention: attention,
            neglect: neglect,
            mode: _mode,
            cb: _cb,
            companyId: _companyId,
            MODE: MODE,
            PAGE: PAGE
        };

        $('#Id-Form-Next').on('click', function () {
            let curr = KTWizard2.getStep();
            app.onboard.wizard.validate(curr, true, function (status) {
                if (status.result != Result.Pass) {
                    return;
                } else {
                    let nextBtn = document.getElementById('onboarding-next');
                    nextBtn.click();
                }
            });
        });

        $('#Id-Form-Prev').on('click', function () {
            $('#Id-Form-Next').show();
        });

        $('#a-owner-has-no-companies-redirect').on('click', (ev) => {
            app.onboard.wizard.cb('basic-scrceening-fail', null, null);
        });
        $('#a-basic-screening-fail-redirect').on('click', (ev) => {
            app.onboard.wizard.cb('basic-scrceening-fail', null, null);
        });
        $('#a-user-verify-fail-redirect').on('click', (ev) => {
            app.onboard.wizard.cb('basic-scrceening-fail', null, null);
        });
        $('#a-owner-verify-fail-redirect').on('click', (ev) => {
            app.onboard.wizard.cb('basic-scrceening-fail', null, null);
        });

    })(app.onboard);
//}
