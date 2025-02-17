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
        UserProfile: 1,
        OwnerProfile: 2,
        CompanyProfile: 3,
        Summary: 4,
        Complete : 5
    };

    class AppController extends app.wizard.controller.Controller {
        constructor(wizardId, bodyId) {
            super(wizardId, bodyId);
            this.name = 'App Controller';
            this.userToOwner = null;
        }

        __onSubmit__(cb) {
            let self = this;
            this.pages[controller.Pages.Summary].basicScreeningResult((result) => {
                if (result.status == app.wizard.Result.Success) {
                    let dto = self.pages[controller.Pages.UserProfile].getDto();

                    dto.propertiesJson['user-journey']['onboarding']['stage'] = 'Complete';
                    dto.propertiesJson['user-journey']['onboarding']['page'] = controller.Pages.Complete;

                    dto.isOnboarded = true;
                    self.pages[controller.Pages.UserProfile].__save__(dto, (result) => {
                        result = app.wizard.addResult();
                        result.data = {
                            mode: self.model.mode,
                            companyId: self.pages[controller.Pages.CompanyProfile].companyId
                        };
                        self.cb('basic-screening-submit', result);
                        cb(app.wizard.addResult());
                    });
                } else {
                    cb(app.wizard.addResult());
                }
            });
        }

        onSubmit(cb) {
            let self = this;
            self.__onSubmit__(cb);
        }

        load(args, cb) {
            this.model = args;
            if (args.mySettings.isEmailConfirmed == false) {
                let result = app.wizard.addResult();
                result.status = app.wizard.Result.Fail;
                result.message = 'Email not confirmed';
                swal.fire({
                    icon: 'warning',
                    title: app.localize('EmailNotVerified'),
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonText: app.localize('TakeMeToEmailVerificationPage')
                }).then(() => {
                    cb(result);
                });
            } else {
                KTApp.blockPage({
                    overlayColor: 'blue',
                    opacity: 0.1,
                    state: 'primary',
                    message: app.localize('LoadOnboarding')
                });

                $('#' + this.getSubmitId()).text('NEXT STEP');

                super.load(args, (result) => {
                    if (args.mode == 2 || args.mode == 1) {
                        this.activePage = controller.Pages.CompanyProfile;
                    } else {
                        this.activePage = controller.Pages.Intro;
                    }
                    //this.activePage = controller.Pages.CompanyProfile;
                    this.goto(this.activePage, (result) => {
                        KTApp.unblockPage();
                        cb(app.wizard.addResult());
                    })
                });
            }
        }

        mustUpdateUserJourney() {
            return this.model.mode == 0;
        }

        updateUserJourneyProp(page, prop) {
            if (prop['onboarding']['page'] != null && prop['onboarding']['page'] >= page) {
                return;
            } else {
                prop['onboarding']['page'] = page;
                switch (page) {
                    case controller.Pages.Intro:
                    case controller.Pages.UserProfile:
                        prop['onboarding']['stage'] = 'UserProfile';
                        break;

                    case controller.Pages.OwnerProfile:
                        prop['onboarding']['stage'] = 'OwnerProfile';
                        break;

                    case controller.Pages.CompanyProfile:
                        prop['onboarding']['stage'] = 'BusinessProfile';
                        break;

                    case controller.Pages.Summary:
                        prop['onboarding']['stage'] = 'Summary';
                        break;

                    case controller.Pages.Complete:
                        prop['onboarding']['stage'] = 'Complete';
                        break;
                }
            }
        }

        getGotoData(page) {
            if (page == controller.Pages.CompanyProfile) {
                return this.pages[controller.Pages.OwnerProfile].model['identityOrPassport']
            }
        }

        __save__(partial, cb) {
            let self = this;

            cb(app.wizard.addResult());
        }

        save(args, cb) {
            cb(app.wizard.addResult());
        }

        addHandlers() {
            super.addHandlers();
        }

        programProductFit(cb) {
            let self = this;

        }

        validate(args, cb) {
            super.validate(args, (result) => {
                cb(result);
            });
        }

        // Note: If we ever invoke this method directly, then be very carefull about what we normally pass in to args
        //       ( if any ) from one page to the next.
        attentionHidden(args, cb) {
            let self = this;

            function ownerProfile(args, cb) {
                // TODO: Look at shifting some of this into the actual event handler for UserIsOwner switch.
                let value = self.helpers.getPropEx(self.pages[controller.Pages.UserProfile].model.propertiesJson, 'is-business-owner', 'No');
                if (value == 'Yes') {
                    self.userToOwner = true;
                }
                if (self.userToOwner == true) {
                    self.copyUserToOwner();
                } else if (self.userToOwner == false) {
                    self.pages[controller.Pages.OwnerProfile].reset();
                }
                self.userToOwner = null;
            }

            function companyProfile(args, cb) {
                args.user = {
                    identityNumber: self.pages[controller.Pages.OwnerProfile].model['identityOrPassport'],
                    ownerId: self.pages[controller.Pages.OwnerProfile].model['id']
                };
            }

            if (args.isNext == true) {
                if (args.curr == controller.Pages.OwnerProfile) {
                    ownerProfile(args, cb);
                } else if (args.curr == controller.Pages.Summary) {
                    let companyDto = self.pages[controller.Pages.CompanyProfile].getDto();
                    companyDto.id = self.pages[controller.Pages.CompanyProfile].companyId;
                    args.user = {
                        user: self.pages[controller.Pages.UserProfile].getDto(),
                        owner: self.pages[controller.Pages.OwnerProfile].getDto(),
                        company: companyDto
                    };
                }
            }
            if (args.curr == controller.Pages.CompanyProfile) {
                companyProfile(args, cb);
            }

            if (args.curr == controller.Pages.Intro) {
                $('#button-wizard-save').hide();
            } else {
                $('#button-wizard-save').show();
            }

            super.attentionHidden(args, cb);
        }

        attention(args, cb) {
            super.attention(args, (result) => {
                cb(app.wizard.addResult());
            });
        }

        neglect(data, cb) {
            if (data.curr < this.pages.length && this.pages[data.curr] != null) {
                super.neglect(data, (result) => {
                    cb(result);
                });
            } else {
                cb(app.wizard.addResult());
            }
        }

        addControls() {
            super.addControls();

            let control = null;
            control = this.addControl('input-user-profile-is-owner', 'radio');
        }

        copyUserToOwner() {
            let dtoOwner = this.pages[controller.Pages.OwnerProfile].model;

            let maritalStatus = null;
            if( dtoOwner.verificationRecordJson != null &&
                dtoOwner.verificationRecordJson != '' &&
                dtoOwner.verificationRecordJson.hasOwnProperty('MaritalStatus') == true &&
                dtoOwner.verificationRecordJson['MaritalStatus'] != '' &&
                dtoOwner.verificationRecordJson['MaritalStatus'] != null
            ) {
                maritalStatus = dtoOwner.verificationRecordJson['MaritalStatus'];
            }
            let dtoUser = this.pages[controller.Pages.UserProfile].pageToDto(null);

            let temp = JSON.stringify(dtoUser.verificationRecordJson);

            dtoOwner.propertiesJson['owner-title'] = dtoUser.propertiesJson['user-title']
            dtoOwner.verificationRecordJson = JSON.parse(temp);
            if (maritalStatus != null) {
                dtoOwner.verificationRecordJson['MaritalStatus'] = maritalStatus;
            }
            dtoOwner.isIdentityOrPassportConfirmed = dtoUser.isIdentityOrPassportConfirmed;
            dtoOwner.isPhoneNumberConfirmed = dtoUser.isPhoneNumberConfirmed;
            dtoOwner.identityOrPassport = dtoUser.identityOrPassport;
            dtoOwner.phoneNumber = dtoUser.phoneNumber;
            dtoOwner.emailAddress = dtoUser.emailAddress;
            dtoOwner.name = dtoUser.name;
            dtoOwner.surname = dtoUser.surname;
        }

        addHandlers() {
            let self = this;
            super.addHandlers();
            this.controls['input-user-profile-is-owner'].click((arg, name, value, checked) => {
                if (self.pages[controller.Pages.OwnerProfile].model.verificationRecordJson != null && self.pages[controller.Pages.OwnerProfile].model.verificationRecordJson.hasOwnProperty('MaritalStatus') == true) {
                    self.pages[controller.Pages.OwnerProfile].model.verificationRecordJson['MaritalStatus'] = '';
                }
                if (checked == 'Yes') {
                    self.userToOwner = true;
                } else {
                    self.userToOwner = false;
                }
                if ( self.pages[controller.Pages.CompanyProfile].canSave() == true &&
                     self.pages[controller.Pages.OwnerProfile].canSave() &&
                     self.pages[controller.Pages.CompanyProfile].company != null) {
                    self.pages[controller.Pages.CompanyProfile].ownerId = self.pages[controller.Pages.OwnerProfile].model.id;
                    let dto = self.pages[controller.Pages.CompanyProfile].reset();
                    self.pages[controller.Pages.CompanyProfile].__save__(dto, (result) => {
                        self.pages[controller.Pages.CompanyProfile].company = null;
                        self.pages[controller.Pages.CompanyProfile].identityNumber = null;
                        self.pages[controller.Pages.CompanyProfile].mustSave = null;
                        self.pages[controller.Pages.CompanyProfile].clear();
                        self.pages[controller.Pages.CompanyProfile].enable(false);
                    });
                }
            });
        }
    }

    controller.create = function (wizardId, bodyId) {
        return new AppController(wizardId, bodyId);
    }

    controller.AppController = AppController;

})(app.wizard.controller);
