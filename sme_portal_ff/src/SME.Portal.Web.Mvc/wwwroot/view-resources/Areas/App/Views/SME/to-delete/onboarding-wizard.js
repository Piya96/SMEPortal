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
            //Welcome : 1,
            UserProfile: 1,
            OwnerProfile: 2,
            CompanyProfile: 3,
            Summary: 4
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
                    companyProfile.autoFillAddrComplete(addressComponents);
                }
                setFillInAddrComplete(AddressComplete);

                companyProfile.initCompanies();

                const minloadPageMillis = 1000;
                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: app.localize('LoadOnboarding')
                });

                function loadPages(cb) {
                    app.onboard.user.loadDto(function (status, dto) {
                        app.onboard.user.init(
                            function (status) {

                                function goToComplete() {
                                    window.setTimeout(function () {
                                        KTApp.unblockPage();
                                        $('#onboarding-wizard').show();
                                        cb();
                                    }, minloadPageMillis);
                                    app.common.mobile.refresh(_mode == MODE.Normal);
                                }

                                let menu = abp.nav.menus.MainMenu;

                                app.onboard.owner.loadDto(function (status, dto) {

                                    app.onboard.owner.init(function (status) {

                                        app.onboard.company.loadDto(function (status) {

                                            app.onboard.businessOwners.init(function (status) {

                                                app.onboard.employees.init(function (status) {

                                                    app.onboard.summary.loadDto(function (status) {

                                                        if (_mode == MODE.Add || _mode == MODE.Edit) {
                                                            KTWizard2.goTo(PAGE.CompanyProfile, goToComplete);
                                                        } else {
                                                            KTWizard2.goTo(PAGE.UserProfile, goToComplete);
                                                        }
                                                    });
                                                });
                                            });
                                        })
                                    });
                                });
                            }
                        );
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
            });

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
                        $('#id-onboarding-div').fadeIn(FadeSpeed, 'swing', function () {
                            $('#Id-Form-Next').hide();
                            app.common.landing.attention('#id-landing-info-message-div', '#id-landing-info-message-button', 'landing');
                            cb(AddStatus());
                        });
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
                            $('#Id-Form-Prev').show();
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
                                cb(status);
                            });
                        });
                        break;

                    case PAGE.Summary:
                        app.onboard.summary.attention(PAGE.Employees, PAGE.Summary, true, function (status) {
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
                        $('#Id-Form-Prev').hide();
                        break;

                    case PAGE.OwnerProfile:
                        break;

                    case PAGE.CompanyProfile:
                        toggleNext(true);
                        togglePrev(_mode == MODE.Normal);
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
                        toggleNext(false);
                        togglePrev(false);
                        $('#id-onboarding-div').fadeOut(_mode == MODE.Normal ? FadeSpeed : 1, 'swing', function () {
                            cb(AddStatus());
                        });
                        break;

                    case PAGE.UserProfile:
                        toggleNext(false);
                        togglePrev(false);
                        app.onboard.user.neglect(PAGE.UserProfile, PAGE.OwnerProfile, true, function (status) {
                            if (status.result == Result.Pass) {
                                $('#id-onboarding-div').fadeOut(_mode == MODE.Normal ? FadeSpeed : 1, 'swing', function () {
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
                                $('#id-onboarding-div').fadeOut(_mode == MODE.Normal ? FadeSpeed : 1, 'swing', function () {
                                    app.common.landing.neglect('#id-owner-info-message-div', '#id-owner-info-message-button', 'user');
                                    cb(status);
                                });
                            } else {
                                toggleNext(true);
                                cb(status);
                            }
                        });
                        break;

                    case PAGE.CompanyProfile:
                        toggleNext(false);
                        app.onboard.company.neglect(PAGE.CompanyProfile, PAGE.Summary, true, function (status) {
                            $('#id-onboarding-div').fadeOut(_mode == MODE.Normal ? FadeSpeed : 1, 'swing', function () {
                                app.common.landing.neglect('#id-company-info-message-div', '#id-company-info-message-button', 'user');
                                cb(status);
                            });
                        });
                        break;

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
                        break;

                    case PAGE.OwnerProfile:
                        break;

                    case PAGE.CompanyProfile:
                        break;

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

    })(app.onboard);
//}
