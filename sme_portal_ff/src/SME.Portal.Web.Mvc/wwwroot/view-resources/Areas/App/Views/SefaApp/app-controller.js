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
        Disclaimer: 0,
        MandateFit: 1,
        FundingRequirements: 2,
        LegalQuestions: 3,
        DocumentUpload: 4,
        Summary: 5
    };

    class AppController extends app.wizard.controller.Controller {
        constructor(wizardId, bodyId) {
            super(wizardId, bodyId);
            this.name = 'App Controller';
            this.productFit = null;
            this.productFitGuid = '';
            this.hasSefaLASAppId = false;
            this.appId = null;
        }

        showTimeToCompleteApp(args) {
            let date = this.helpers.formatDate(args.application.application.creationTime);
            $('#application-start-date').text(date);

        }

        getEnquiryNumber(application, cb) {
            let self = this;
            let dto = {
                propertiesJson: null
            };
            if (application.propertiesJson == null || application.propertiesJson.length == 0) {
                dto.propertiesJson = {};
            } else {
                dto.propertiesJson = JSON.parse(application.propertiesJson);
            }

            function requestEnquiryNumber(cb) {
                abp.services.app.sefaLAS.requestEnquiryNumber(self.model.application.application.id).done((payload) => {
                    let result = app.wizard.addResult();
                    result.data = {
                        enquiryNumber : payload.sefaLAS.EnquiryNumber
                    };
                    if (result.data.enquiryNumber == 'ENQ000000') {
                        result.status = app.wizard.Result.Fail;
                    }
                    cb(result);
                });
            }


            if (this.helpers.hasProp(dto, 'propertiesJson') == true &&
                this.helpers.hasProp(dto['propertiesJson'], 'sefaLAS') == true &&
                this.helpers.hasProp(dto['propertiesJson']['sefaLAS'], 'EnquiryNumber') == true) {
                let enquiryNumber = dto['propertiesJson']['sefaLAS']['EnquiryNumber'];
                if (enquiryNumber == 'ENQ000000') {
                    requestEnquiryNumber(cb);
                } else {
                    let result = app.wizard.addResult();
                    result.data = {
                        "enquiryNumber": enquiryNumber
                    };
                    cb(result);
                }
            } else {
                requestEnquiryNumber(cb);
            }
        }

        setEnquiryNumber(enquiryNumber) {
            $('#span-enquiry-no').text('Enquiry Number: ' + enquiryNumber);
        }

        load(args, cb) {
            let self = this;
            this.model = args;
            let loadCounter = 2;
            function loadComplete() {
                if (--loadCounter == 0) {
                    cb(app.wizard.addResult());
                }
            }

            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: 'Generating Unique Enquiry Number...'
            });
            this.getEnquiryNumber(args.application.application, (result) => {
                KTApp.unblockPage();
                if (result.status == app.wizard.Result.Fail) {
                    this.cb('invalid-enquiry-number', self.model.smeCompany.smeCompany.id);
                    return;
                } else {
                    this.setEnquiryNumber(result.data.enquiryNumber);
                    loadComplete();
                }
            });

            $('#' + this.getSubmitId()).prop('disabled', true);
            $('#' + this.getSubmitId()).text('Submit Application');

            this.showTimeToCompleteApp(args);
            this.appId = args.application.application.id;

            let mc = JSON.parse(args.application.application.matchCriteriaJson);
            let dto = this.helpers.nvpArrayToObject(mc);
            this.productFit = this.helpers.getNvpValue(dto, 'product-fit-guid', 0);
            this.productFitGuid = this.productFit;
            $('#product-fit-guid').val(this.productFitGuid);
            if (this.productFit != '' && this.productFit != null) {
                this.productFit = this.listItems.getProductFit(this.productFit);
            }

            this.activePage = this.helpers.getNvpValue(dto, 'active-page', 0);
            this.activePage = '0';

            //this.activePage = app.wizard.controller.Pages.Summary;
            //this.activePage = app.wizard.controller.Pages.DocumentUpload;

            app.wizard.isb.init(null, null, null);

            super.load(args, (result) => {

                this.goto(this.activePage, (result) => {

                    loadComplete();

                })
            });
        }

        __save__(partial, cb) {
            let self = this;

            function getSubmitData(arr, partial) {
                arr.push({
                    name: 'active-page',
                    value: self.activePage
                });
                if (self.helpers.hasNvp(arr, 'product-fit-guid') == false) {
                    arr.push({
                        name: 'product-fit-guid',
                        value: self.productFitGuid
                    });
                }
                arr.forEach((obj, idx) => {
                    switch (obj.name) {
                        case 'input-mandate-fit-loan-amount':
                        case 'input-credit-held-with-suppliers':
                        case 'input-owners-contribution':
                        case 'input-business-premises-property-value-of-directors':
                        case 'input-purchase-value':
                        case 'input-vat':
                        case 'input-total':
                        case 'input-contract-value':
                            obj.value = self.helpers.RemoveSpaces(obj.value);
                            break;
                    }
                });

                let totalOwners = $('#input-total-number-of-owners').val();
                arr.forEach((obj, idx) => {
                    switch (obj.name) {
                        case "input-percent-ownership-by-south-africans":
                        case "input-percent-black-coloured-indian-pdi":
                        case "input-percent-black-south-africans-only":
                        case "input-percent-white-only":
                        case "input-percent-asian-only":
                        case "input-percent-disabled-people":
                        case "input-percent-youth-under-35":
                        case "input-percent-women-women-any-race":
                        case "input-percent-women-black-only":
                        case "input-percent-non-south-african-citizens":
                        case "input-percent-companies-organisations":
                            let x = parseFloat(obj.value);
                            let y = parseFloat(totalOwners);
                            obj.value = x / y;
                            obj.value *= 100.0;
                            obj.value = obj.value.toString();
                            break;
                    }
                });

                arr.forEach((item, index) => {
                    if (item.value == 'NaN') {
                        item.value = '';
                    }
                });


                return arr;
            }

            let formPages = self.serialize();
            let arr = self.remap(formPages, null);

            formPages = formPages.concat(arr);

            formPages = getSubmitData(formPages, partial);
            formPages = JSON.stringify(formPages);

            let formData = $('form').serializeArray();
            formData = formData.concat(arr);

            formData = getSubmitData(formData, partial);
            formData = JSON.stringify(formData);

            this.model.application.application.matchCriteriaJson = formPages;

            //if (partial == false) {
            //    return;
            //}

            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: partial == true ? 'Saving page data...' : 'Submitting Finance Application'
            });

            let data = {
                Id: this.model.application.application.id,
                Partial: partial,
                JsonStr: null,//formPages,
                MatchCriteriaJson: formData,
                FunderSearchJson: null
            };
            let result = app.wizard.addResult();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/App/SefaApplication/Submit",
                'data': JSON.stringify(data),
                success: function (data) {
                    result.data = data.result;
                    KTApp.unblockPage();
                    cb(result);
                },
                error: function (data) {
                    result.status = app.wizard.Result.Fail;
                    KTApp.unblockPage();
                    cb(result);
                }
            });
        }

        save(args, cb) {
            this.__save__(true, cb);
        }

        addHandlers() {
            super.addHandlers();
            $('#a-mandatefit-fail-redirect').on('click', (ev) => {
                if (this.cb != null) {
                    let result = app.wizard.addResult();
                    result.data = { id: this.appId};
                    this.cb('mandatefit-fail', result);
                }
            });

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
                        this.cb('cancel-application', null);
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
                            this.cb('exit-application', null);
                        });
                    }
                })
            });

            $('#a-program-not-active-redirect').on('click', (ev) => {
                if (this.cb != null) {
                    let result = app.wizard.addResult();
                    result.data = { id: this.appId };
                    this.cb('program-not-active', result);
                }
            });
        }

        formValidationError(result, cb) {
            if (result.status == app.wizard.Result.Fail && result.code == 1) {
                $('#parent-mandatefit-fail-info').hide('fast');
                $('#parent-madate-fit-pass').hide('fast');
                $('#div-program-not-active').show('fast');
                cb();
            } else if (result.status == app.wizard.Result.Fail && result.code == 2) {
                $('#parent-mandatefit-fail-info').hide('fast');
                $('#parent-madate-fit-pass').hide('fast');
                $('#div-program-not-active').hide('fast');
                Swal.fire({
                    icon: 'info',
                    html: result.message,
                    focusConfirm: false,
                    confirmButtonText:
                        '<i class="fa fa-thumbs-up"></i> Great!',
                    confirmButtonAriaLabel: 'Thumbs up, great!'
                }).then(() => {
                    cb();
                });
            } else {
                super.formValidationError(result, cb);
            }
        }

        programProductFit(cb) {
            let self = this;
            abp.services.app.applicationAppServiceExt.programProductFit(this.model.application.application.id).done((payload) => {
                function success() {
                    self.productFit = JSON.parse(payload);


                    //self.productFit.ParentListId = '6266638ddd1a2cb2fc968f0c';
                    //self.productFit.ListId = '64db693d678b47343d72972f';

                    if (self.productFit.ParentListId == '6266638ddd1a2cb2fc968f0c' &&
                        self.productFit.ListId == '64db693d678b47343d72972f') {
                        result.status = app.wizard.Result.Fail;
                        result.code = 1;
                        $('#product-fit-guid').val(self.productFit.ListId);
                        self.productFitGuid = self.productFit.ListId;
                    } else {
                        self.productFit = self.listItems.getProductFit(self.productFit.ListId);
                        $('#product-fit-guid').val(self.productFit.listId);
                        self.productFitGuid = self.productFit.listId;
                    }
                    cb(result);
                }

                let result = app.wizard.addResult();
                function fail() {
                    result.status = app.wizard.Result.Fail;
                    result.code = 0;
                    result.message = 'Program Product Fit Failed';
                    self.productFit = null;
                }
                if (payload != null && payload.length > 0) {
                    success();
                } else {
                    fail();
                    cb(result);
                }
            });
        }

        validate(args, cb) {
            let self = this;
            function validatePropertiesJson(cb) {
                abp.services.app.applicationAppServiceExt.getApplicationForView(self.appId).done((payload) => {
                    let result = app.wizard.addResult();
                    result.data = payload;
                    let prop = JSON.parse(payload.application.propertiesJson);
                    //delete prop['mandate-fit-checks'];
                    if (prop.hasOwnProperty('mandate-fit-checks') == false ||
                        prop.hasOwnProperty('program-product-fit') == false) {
                        result.status = app.wizard.Result.Fail;
                        result.code = 2;
                        result.message =
                            'Dear client, we have detected a problem with your submission.\
                            Please contact 087-500-9950 for assistance. We apologise for the inconvenience.';
                    }
                    cb(result);
                });

            }

            if (args.curr == controller.Pages.MandateFit) {
                // Note: The save had to happen here to that the call to do the mandatee fit check can
                //       act on the latest data. So data must be saved even if we don't go to the next page.
                self.save(null, (result) => {
                    super.validate(args, (result) => {
                        if (result.status == app.wizard.Result.Success) {
                            // Find out what program to activate
                            self.programProductFit((result) => {
                                if (result.status == app.wizard.Result.Success) {
                                    validatePropertiesJson((result) => {
                                        cb(result);
                                    });
                                } else {
                                    cb(result);
                                }
                            });
                        } else {
                            cb(result);
                        }
                    });
                });
            } else {
                super.validate(args, (result) => {
                    cb(result);
                });
            }
        }

        // Note: If we ever invoke this method directly, then be very carefull about what we normally pass in to args
        //       ( if any ) from one page to the next.
        attentionHidden(args, cb) {
            // TODO: For v2: Also set args if we are going into Pages.FundingRequirements.
            if (args.curr == controller.Pages.DocumentUpload) {
                args.user = this.productFit;
            }
            super.attentionHidden(args, cb);
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

        submitToSefaLAS(cb) {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: 'Submitting Finance Application'
            });

            let data = {
                Id: this.model.application.application.id
            };
            let result = app.wizard.addResult();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/App/SefaApplication/SubmitToSefaLAS",
                'data': JSON.stringify(data),
                success: function (data) {
                    result.data = data.result;
                    KTApp.unblockPage();
                    if (result.data.sefaLASAppId == null || result.data.sefaLASAppId == '') {
                        result.status = app.wizard.Result.Fail;
                        result.message = 'Please try again later or contact our Support team on:<br/><b>012 748 9600</b><br/><a href="https://helpline@sefa.org.za" target="_blank">helpline@sefa.org.za</a>';
                    }
                    cb(result);
                },
                error: function (data) {
                    result.status = app.wizard.Result.Fail;
                    KTApp.unblockPage();
                    cb(result);
                }
            });
        }

        getSefaObject(cb) {
            let self = this;
            let sefa = app.listItems.getter;

            function translateGuid(obj, field, fn) {
                if (obj.hasOwnProperty(field) == true) {
                    obj[field] = {
                        listId: obj[field],
                        details: fn(obj[field])
                    };
                }
            }

            function getUserObject() {
                let userProfile = self.model.userProfile;
                let temp = {};
                temp['emailAddress'] = userProfile['emailAddress'];
                temp['isEmailConfirmed'] = userProfile['isEmailConfirmed'];
                temp['isPhoneNumberConfirmed'] = userProfile['isPhoneNumberConfirmed'];
                temp['name'] = userProfile['name'];
                temp['phoneNumber'] = userProfile['phoneNumber'];
                temp['surname'] = userProfile['surname'];
                temp['identityOrPassport'] = userProfile['identityOrPassport'];
                temp['isOwner'] = userProfile['isOwner'];
                temp['representativeCapacity'] = {
                    listId: userProfile['representativeCapacity'],
                    details: sefa.getRole(userProfile['representativeCapacity']),
                },
                temp['verificationRecordJson'] = JSON.parse(userProfile['verificationRecordJson']);
                temp['isIdentityOrPassportConfirmed'] = userProfile['isIdentityOrPassportConfirmed'];
                temp['isOnboarded'] = userProfile['isOnboarded'];
                temp['propertiesJson'] = JSON.parse(userProfile['propertiesJson']);

                temp['propertiesJson']['how-did-you-hear-about-sefa'] = {
                    listId: temp['propertiesJson']['how-did-you-hear-about-sefa'],
                    details: sefa.getOrigin(temp['propertiesJson']['how-did-you-hear-about-sefa'])
                };
                temp['propertiesJson']['user-title'] = {
                    listId: temp['propertiesJson']['user-title'],
                    details: sefa.getTitle(temp['propertiesJson']['user-title'])
                };

                return temp;
            }

            function getOwnerObject() {
                let ownerProfile = self.model.ownerProfile.owner;
                let temp = {};
                temp['emailAddress'] = ownerProfile['emailAddress'];
                temp['isPhoneNumberConfirmed'] = ownerProfile['isPhoneNumberConfirmed'];
                temp['name'] = ownerProfile['name'];
                temp['phoneNumber'] = ownerProfile['phoneNumber'];
                temp['surname'] = ownerProfile['surname'];
                temp['identityOrPassport'] = ownerProfile['identityOrPassport'];
                temp['verificationRecordJson'] = JSON.parse(ownerProfile.verificationRecordJson);
                temp['isIdentityOrPassportConfirmed'] = ownerProfile['isIdentityOrPassportConfirmed'];

                temp['race'] = {
                    listId: ownerProfile['race'],
                    details: sefa.getRace(ownerProfile['race'])
                };

                temp['propertiesJson'] = JSON.parse(ownerProfile.propertiesJson);

                temp['propertiesJson']['owner-title'] = {
                    listId: temp['propertiesJson']['owner-title'],
                    details: sefa.getTitle(temp['propertiesJson']['owner-title'])
                };
                return temp;
            }

            function getCompanyObject() {
                let companyProfile = self.model.smeCompany.smeCompany;
                let temp = {};
                temp['name'] = companyProfile['name'];
                temp['registrationNumber'] = companyProfile['registrationNumber'];

                temp['type'] = companyProfile['type'];
                translateGuid(temp, 'type', sefa.getCompanyType);


                temp['registrationDate'] = companyProfile['registrationDate'];
                temp['startedTradingDate'] = companyProfile['startedTradingDate'];
                temp['registeredAddress'] = companyProfile['registeredAddress'];
                temp['verificationRecordJson'] = JSON.parse(companyProfile['verificationRecordJson']);

                temp['propertiesJson'] = JSON.parse(companyProfile['propertiesJson']);

                temp['propertiesJson']['entityType'] = {
                    listId: temp['propertiesJson']['entityType'],
                    details: sefa.getEntityType(temp['propertiesJson']['entityType'])
                };

                return temp;
            }

            function getApplicationObject() {

                let application = self.model.application.application;
                let temp = {};
                temp['smeCompanyId'] = application['smeCompanyId'];
                temp['propertiesJson'] = JSON.parse(application['propertiesJson']);
                let mc = JSON.parse(application['matchCriteriaJson']);
                mc = self.helpers.nvpArrayToObject(mc);
                for(let field in mc) {
                    temp['propertiesJson']['match-criteria'][field] = mc[field][0];
                };

                translateGuid(temp['propertiesJson']['match-criteria'], 'product-fit-guid', sefa.getProgram);

                // Mandate fit.
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-mandate-fit-reason-for-finance', sefa.getReasonForFinance);

                // Program fit.
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-source-of-funds', sefa.getSourceOfFunds);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-asset-type', sefa.getAssetType);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-min-membership', sefa.getMinMembershipRequirement);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-max-funding-req', sefa.getMaxFundingRequirement);

                // Legal questions.
                translateGuid(temp['propertiesJson']['match-criteria'], "select-method-of-repayment", sefa.getPaymentType);
                translateGuid(temp['propertiesJson']['match-criteria'], "select-own-or-rent-business-premises", sefa.getRentType);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-type-of-collateral', sefa.getSefaCollateralBusiness);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-type-of-security', sefa.getSefaCollateralOwner);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-source-of-funds-company', sefa.getSourceOfFunds);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-annual-turnover', sefa.getAnnualTurnover);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-financial-year-end', sefa.getMonth);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-business-account-bank', sefa.getBank);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-which-accounting-system-do-you-have', sefa.getAccountingSystem);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-who-is-this-loan-from', sefa.getLoanFrom);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-who-do-you-bank-with-personally', sefa.getBank);
                translateGuid(temp['propertiesJson']['match-criteria'], 'select-which-electronic-payroll-system', sefa.getPayrollSystem);

                return temp;
            }

            function getDocumentsObject() {
                let documents = self.model.documents;
                let temp = {
                    doc : []
                };
                documents.forEach((doc, idx) => {
                    temp.doc.push(JSON.parse(JSON.stringify(doc)));
                });
                return temp;
            }

            let userObject = getUserObject();
            let ownerObject = getOwnerObject();
            let companyObject = getCompanyObject();
            let applicationObject = getApplicationObject();
            let documentObject = getDocumentsObject();
            let sefaObject = {
                userProfile: userObject,
                ownerProfile: ownerObject,
                companyProfile: companyObject,
                application: applicationObject,
                documents: documentObject
            };
            let sefaStr = JSON.stringify(sefaObject);
            return sefaStr;
        }

        onSubmit(cb) {
            let self = this;
            let submitId = '#' + this.getSubmitId();
            $(submitId).prop('disabled', true);
            this.submitToSefaLAS((result) => {
                if (result.status == app.wizard.Result.Success) {
                    this.hasSefaLASAppId = true;
                    this.__save__(false, (result) => {
                        if (result.status == app.wizard.Result.Success) {
                            $('#' + this.bodyId).fadeOut(this.fadeSpeed, 'swing', () => {
                                if (this.cb != null) {
                                    this.cb('submit-application', result);
                                }
                            });
                        } else {
                            cb(result);
                        }
                    });
                } else {
                    $(submitId).prop('disabled', false);
                    cb(result);
                }
            });

            //let result = app.wizard.addResult();
            //result.data = {
            //    id: this.model.application.application.id
            //}
            //self.cb('pdf-convert-test', result);
        }
    }

    controller.getAppController = function (wizardId, bodyId) {
        return new AppController(wizardId, bodyId);
    }

})(app.wizard.controller);
