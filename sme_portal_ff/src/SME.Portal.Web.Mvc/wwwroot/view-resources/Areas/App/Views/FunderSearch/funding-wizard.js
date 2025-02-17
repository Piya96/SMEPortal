"use strict";

// ----------------------------------------------------------------------------------------------------- //
if (app.getFunding == undefined) {
    app.getFunding = {
        wizard : {}
    };
}

var KTWizardFunding = null;

function fundingWizardLoadWizard() {

    let _literalMapFinancialInfo = {
        annualturnover: app.localize("AnnualTurnover"),
        bank: app.localize("WhoDoYouBankWith"),
        bankaccservices: app.localize("WhatTypeOfBankAccountServices"),
        businessloans: app.localize("DoYouHaveOtherBusinessLoans"),
        whoistheloanfrom: app.localize("WhoIsLoanFrom"),
        businesstxpersonalacc: app.localize("DoAnyOfYourBusinessTxGoThroughYourPersonalAccounts"),
        personalbank: app.localize("WhoDoYouBankWithPersonally"),
        haselecaccsystems: app.localize("HaveAccSystem"),
        elecaccsystems: app.localize("WhichElectAccSystem"),
        elecaccsystemother: app.localize("WhichOtherAccSystem"),
        haspayroll: app.localize("HavePayrollSystem"),
        payrollsystems: app.localize("WhichElectPayrollSystem"),
        payrollsystemother: app.localize("WhichOtherPayrollSystem"),
        hasinvestedownmoney: app.localize("HaveYouInvestedYourOwnMoney"),
        businessisprofitable: app.localize("DidYourBusinessMakeAProfit"),
        businesshascolateral: app.localize("DoYouHaveColateral")
    };

    let _literalMapFundingRequirements = {
        financefor: app.localize("WhatTypeOfFinanceDoYouNeed"),
        loanamount: app.localize("AmountOfFundingNeeded"),
        assetfinancetype: 'Buy An Asset Option',
        buyingbusinesspropertyvalue: app.localize("WhatIsTheValueOrTheProperty"),
        buyingbusinesspropertytype: app.localize("SelectPropertyType"),
        propertydevelopmenttype: app.localize("SelectDevelopmentType"),
        shopfittingpropbonded: app.localize("IsThePropertyBonded"),
        shopfittingpropertyvalue: app.localize("WhatIsTheValueOrTheProperty"),
        shopfittingpropertytype: app.localize("SelectPropertyType"),

        growthfinancetype: 'Grow My Business Options',
        willingtosellshares: app.localize("AreYouWillingToSellShares"),
        largepotentialmarket: app.localize("DoesBusinessHaveLargePotentialMarket"),
        customersbuying: app.localize("DoYouCurrentlyHaveCustomerBuying"),
        businessexpansioncompetitiveadv: app.localize("SelectItemsDescribingCompetitiveAdv"),
        businessexpansionresultinincreasedemployees: app.localize("IncreasedEmployees"),
        businessexpansionresultinincreasedprofitability: app.localize("IncreaseProfitability"),
        businessexpansionresultinincreasedexports: app.localize("IncreaseExports"),
        businessexpansionresultineconomicempowerment: app.localize("EmpowermentEconomicDevelopment"),
        businessexpansionresultinsustainabledev: app.localize("SustainableRuralPeriDevelopment"),
        businessexpansionresultinsolveenvchallenges: app.localize("SolveSocialEnvChallenges"),
        productserviceexpansiontype: app.localize("SelectProductServiceExpansionType"),

        workingcapitaltype: 'For Working Capital Options',
        cashforaninvoiceamount: app.localize("CashForInvoiceAmount"),
        cashforinvoicecustomer: app.localize("WhoIsYourCustomer"),
        customeragreed: app.localize("HasTheCustomerAgreedWorkIsComplete"),
        hasposdevice: app.localize("DoYouHaveAPOSDevice"),
        regularmonthlyincome: app.localize("DoesYourCompanyHaveRegMonthIncome"),
        monthlyincomeincomevalue: app.localize("MonthlyIncome"),
        cardmachinepaymenttypes: app.localize("SelectPaymentTypes"),

        moneyforcontractvalue: app.localize("ValueOfContractRequiringFinance"),
        moneyforcontractcustomer: app.localize("WhoIsYourCustomer"),
        moneyforcontractcompanyexperience: app.localize("CompanyHaveExperienceContract"),
        moneyfortendervalue: app.localize("ValueOfTenderRequiringFinance"),
        moneyfortendercustomer: app.localize("WhoIsYourCustomer"),
        moneyfortendercompanyexperience: app.localize("CompanyHaveExperienceTender"),
        purchaseordervalue: app.localize("ValueOfPurchaseOrderRequiringFinance"),
        purchaseordercustomer: app.localize("WhoIsYourCustomer"),
        purchaseordercustomerexperience: app.localize("CompanyHaveExperiencePurchaseOrder"),

        franchiseacquisitiontype: 'Partner Buy-out or Franchise Funding Options',
        buyingafranchisefranchiseaccredited: app.localize("IsFranchiseAccreditedWithFranchiseAssoc"),
        preapprovedbyfranchisor: app.localize("HaveYouBeenPreapprovedByFranchisor"),
        beepartnerfranchiseaccredited: app.localize("WillCompanyHaveMinBEEShareholding"),
        'industry-sector': app.localize("OnboardingCompanyProfileIndustrySector"),
        'industry-sub-sector': app.localize("OnboardingCompanyProfileIndustrySubSector"),
        fundingtobuyanexistingbusinesstype: app.localize("WhatTypeOfBusinessIsIt"),
        businesslocatedinruralarea: app.localize("IsBusinessLocatedInRuralArea"),
        shareholdinggreaterthanperc: app.localize("WillCompanyHaveMinBEEShareholding"),

        researchinnovationfundingtype: app.localize("ResearchInnovationFundingOptions"),
        commresstudentstatus: app.localize("AreYouCurrentlyAMemberOfAUniversity"),
        commreswillincexports: app.localize("WillNewProductIncreaseExports"),
        commresresultinjobcreation: app.localize("WillThisResultInJobCreation"),
        commresintroinnov: app.localize("WillThisResultInIntroInnovativeProductService"),
        commresindustries: app.localize("SelectAnyItemsThatMatchNewProductService"),

        researchtakingplaceinuniversity: app.localize("IsTheResearchAndDevelopmentInUniOrScienceEng"),
        researchfieldofresearchtype: app.localize("WhichOfFollowingMatchFieldOfResearch"),

        otherfinancetype: app.localize("OtherBusinessFinanceOptions"),
        willworkgenerate50newjobs: app.localize("WillWorkGenerateAtLeast50NewJobs"),
        doyouhavecontractsforbps: app.localize("DoYouHaveContractsToProvideBPSIntClients"),
        will80percofjobsbeforyouth: app.localize("Will80percOfJobsBeForYouth"),
        otherfinanceexportindustry: app.localize("PleaseIndicateIndustryExportedProductRepresents"),

        exportcountry: app.localize("WhatCountriesAreYouExportingTo"),
        needingtoconductintmarketresearch: app.localize("AreYouNeedingToConductIntMarketResearch"),
        haveconfirmedorders: app.localize("DoYouHaveConfirmedOrders"),
        otherfinanceimportindustry: app.localize("PleaseIndicateIndustryImportedProductRepresents"),

        importcountry: app.localize("WhatCountriesAreYouImportingFrom"),
        havesignedcontracts: app.localize("DoYouHaveSignedContracts"),
        workinruralareas: app.localize("DoYouWorkInRuralAreas"),
        resultinemploymentsavejobs: app.localize("WillProjectResultInIncEmploymentOrSaveExistingJobs"),
        workwithpeoplewithdisabilities: app.localize("DoYouWorkWithPeopleWithDisabilities"),
        willprojectimprovehealthcare: app.localize("WillProjectImproveHealthCare"),
        willgenerateincomeinimpoverishedareas: app.localize("WillProjectGenerateIncomeInImpoverished"),
        willgenerateincreasedexportvalue: app.localize("WillGenerateIncExportValue")
    };

    let _literalMapFundingEssentials = {
        doyouknowyourpersonalcreditscore: 'Do you want your latest credit score?',
        wanttouploadbusbankstatements: 'Do you want your latest business bank statements?'
    };

    (function (getFunding) {

        const Pages = {
            FinancialInfo: 0,
            FundingRequirement: 1,
            FunderEssentials: 2,
            Summary: 3
        };

        let _fundingEss = {
            seeksFundingAdvice : null
        };

        let SetFundingEss = function (fundingEss) {
            _fundingEss.seeksFundingAdvice = fundingEss.seeksFundingAdvice;
        }

        let _appObj = null;

        let _userProfile = null;

        let _ownerProfile = null;

        let _companyProfile = null;

        let _industrySectorData = app.common.industrySector.industrySectorData;

        function init(appObj) {
            _appObj = appObj;
            _userProfile = appObj.userProfile;
            _ownerProfile = appObj.ownerProfile;
            _companyProfile = appObj.companyProfile;
        }


        function saveSummaryToPDF(id, companyName, fn, cb) {
            let html = $('#' + id).html();
            let data = {
                html: html,
                name: companyName,
                companyId: _appObj.companyId,
                applicationId: _appObj.id
            };
            let status = AddStatus();
            $.ajax({
                url: '/App/FunderSearch/' + fn,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (data) {
                    if (cb != null) {
                        cb(status, data.result);
                    }
                },
                error: function (data) {
                    status.result = Result.Fail;
                    if (cb != null) {
                        cb(status, null);
                    }
                },
                complete: function () {
                }
            });
        }

        function retrieveSummaryToPDF(cb) {
            let data = {
                companyId: _appObj.companyId,
                applicationId: _appObj.id
            };
            let status = AddStatus();
            $.ajax({
                url: '/App/FunderSearch/GetFunderSearchSummaryPdf',
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (data) {
                    if (cb != null) {
                        cb(status, data.result);
                    }
                },
                error: function (data) {
                    status.result = Result.Fail;
                    if (cb != null) {
                        cb(status, null);
                    }
                },
                complete: function () {
                }
            });
        }

        function submitCommon(page, partial, applicationId, propJson, controllerFn, cb) {

            let formArray = $('form').serializeArray();

            formArray.push({
                name: 'seeks-funding-advice', value : _funderEss.seeksFundingAdvice
            });

            let matchCriteria = formArray;
            let serializedForm = JSON.stringify(matchCriteria);

            function applyGuidConversions() {
                let temp = serializedForm;
                let obj = JSON.parse(temp);
                let key = null;
                for (let i = 0, max = obj.length; i < max; i++) {
                    if (obj[i].name == 'industry-sub-sector') {
                        let catIndex = parseInt($('#id-company-profile-category-select').val());
                        let subCatIndex = parseInt($('#id-company-profile-sub-category-select').val());
                        if (isNaN(catIndex) == true || isNaN(subCatIndex) == true) {
                            return '';
                        } else {
                            let subCatItem = _industrySectorData[catIndex].secondary[subCatIndex];
                            key = subCatItem.key;
                            obj[i].value = key;
                            temp = JSON.stringify(obj);
                        }
                        break;
                    }
                }
                return temp;
            }

            let data = {
                Id: applicationId,
                Partial: partial,
                JsonStr: applyGuidConversions(),
                MatchCriteriaJson: null,
                FunderSearchJson : null
            };
            data.MatchCriteriaJson = data.JsonStr;
            data.FunderSearchJson = propJson == null ? null : JSON.stringify(propJson);

            let status = AddStatus();
            //if (page != Pages.FunderEssentials) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/App/FunderSearch/" + controllerFn,
                    data: JSON.stringify(data),
                    success: function (data) {
                        if (cb != null) {
                            cb(status, data);
                        }
                    },
                    error: function (data) {
                        if (cb != null) {
                            status.result = Result.fail;
                            cb(status, data);
                        }
                    }
                });
            //}
        }

        let downloadPdf = function (cb) {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: app.localize('FA_SavingSummaryToPDF')
            });
            $('#id-funder-search-save-to-pdf-top').prop('disabled', true);
            $('#id-funder-search-save-to-pdf-bottom').prop('disabled', true);
            saveSummaryToPDF('pdf-id-summary-div', '.', 'FunderSearchSummaryPdfAJAX', function (status, result) {
                if (status.result == Result.Pass) {
                    let byteChars = atob(result.bytes);
                    smec.downloadBinary(byteChars, result.fileName);
                }
                $('#id-funder-search-save-to-pdf-top').prop('disabled', false);
                $('#id-funder-search-save-to-pdf-bottom').prop('disabled', false);
                KTApp.unblockPage();
                cb(status);
            });
        }

        let retrievePdf = function (cb) {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: app.localize('FA_SavingSummaryToPDF')
            });
            $('#id-funder-search-save-to-pdf-top').prop('disabled', true);
            $('#id-funder-search-save-to-pdf-bottom').prop('disabled', true);
            retrieveSummaryToPDF(function (status, result) {
                if (status.result == Result.Pass) {
                    let byteChars = atob(result.bytes);
                    smec.downloadBinary(byteChars, result.fileName);
                }
                $('#id-funder-search-save-to-pdf-top').prop('disabled', false);
                $('#id-funder-search-save-to-pdf-bottom').prop('disabled', false);
                KTApp.unblockPage();
                cb(status);
            });
        }

        let savePdf = function (cb) {
            saveSummaryToPDF('pdf-id-summary-div', '.', 'FunderSearchSummaryToPdfSave', function (status, result) {
                if (status.result == Result.Pass) {
                }
                cb(status);
            });
        }

        let submit = function (applicationId, propJson, cb) {
            submitCommon(Pages.Summary, false, applicationId, propJson, 'Submit', function (status, data) {
                cb(status, data);
            });
        }

        let submitPartial = function (page, applicationId, propJson, cb) {
            submitCommon(page, true, applicationId, propJson, 'Submit', function (status, data) {
                cb(status, data);
            });
        }

        let GetAppId = function () {
            return _appObj.id;
        }

        let GetUserProfile = function () {
            return _userProfile;
        }

        let GetOwnerProfile = function () {
            return _ownerProfile;
        }

        let GetCompanyProfile = function () {
            return _companyProfile;
        }

        getFunding.crud = {
            init: init,
            downloadPdf: downloadPdf,
            retrievePdf: retrievePdf,
            savePdf: savePdf,
            submit: submit,
            submitPartial: submitPartial,
            getAppId: GetAppId,
            getUserProfile: GetUserProfile,
            getOwnerProfile: GetOwnerProfile,
            getCompanyProfile: GetCompanyProfile,
            setFundingEss : SetFundingEss
        };

    })(app.getFunding);

    (function (getFunding) {

        let _application = {
            id: null,
            mc: null
        };

        let _propJson = null;

        function savePartialForm(page, cb) {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: app.localize('FA_SavingPartial')
            });
            app.getFunding.crud.submitPartial(page, _application.id, null, function (status, data) {
                KTApp.unblockPage();
                cb(AddStatus());
            });
        }

        const FadeSpeed = 500;

        const Pages = {
            FinancialInfo: 0,
            FundingRequirement: 1,
            FunderEssentials: 2,
            Summary: 3
        };

        function init(application, propJson, cb) {
            _application.id = application.id;
            _application.mc = JSON.parse(application.mc.substring(1, application.mc.length - 1));

            _propJson = JSON.parse(propJson.substring(1, propJson.length - 1));
            if (_propJson.hasOwnProperty('matchCriteriaJson') == false) {
                _propJson.matchCriteriaJson = [];
            }
            cb(AddStatus());
        }

        function attention(page, next, cb) {

            function onNext(page, cb) {
                switch (page) {
                    case Pages.FinancialInfo:
                        $('#funding-application-wizard').fadeIn(FadeSpeed, 'swing', function () {
                            cb();
                        });
                        break;

                    case Pages.FundingRequirement: case Pages.FunderEssentials: case Pages.Summary:
                        $('#funding-application-wizard').fadeIn(FadeSpeed, 'swing', function () {
                            cb();
                        });
                        break;

                    default:
                        cb();
                        break;
                }
            }

            switch (next) {
                case true:
                    onNext(page, cb);
                    break;

                default:
                    cb();
                    break;
            }
        }

        function neglect(page, next, cb) {

            function onSave(page, cb) {
                switch (page) {
                    case Pages.FinancialInfo:
                        savePartialForm(Pages.FinancialInfo, function (status) {
                        });
                        break;

                    case Pages.FundingRequirement:
                        savePartialForm(Pages.FundingRequirement, function (status) {
                        });
                        break;

                    case Pages.FunderEssentials:
                        savePartialForm(Pages.FunderEssentials, function (status) {
                        });
                        break;

                    default:
                        cb(AddStatus());
                        break;
                }
            }

            function onNext(page, cb) {
                switch (page) {
                    case Pages.FinancialInfo: case Pages.FundingRequirement: case Pages.FunderEssentials: case Pages.Summary:
                        onSave(page, function (status) {
                        });

                        $('#funding-application-wizard').fadeOut(FadeSpeed, 'swing', function () {
                            cb();
                        });
                        break;

                    default:
                        cb();
                        break;
                }
            }

            function onPrev(page, cb) {
                switch (page) {
                    case Pages.FinancialInfo: case Pages.FundingRequirement: case Pages.FunderEssentials: case Pages.Summary:
                        cb();
                        break;

                    default:
                        cb();
                        break;
                }
            }

            switch (next) {
                case true:
                    onNext(page, cb);
                    break;

                default:
                    onPrev(page, cb);
                    break;
            }
        }

        getFunding.wizard = {
            attention: attention,
            neglect: neglect,
            init: init,
            Pages: Pages
        };

    })(app.getFunding);

    // Class definition
    KTWizardFunding = function () {

        const MIN_LOAN_AMOUNT = 5000;
        // Base elements
        var wizardEl;
        var formEl;

        var wizard;
        var validations = [];

        var _pageChangeCallback = null;

        let _propJson = null;

        let _application = {
            id: null,
            mc: null
        };


        // Private functions
        var initWizard = function () {
            // Initialize form wizard
            wizard = new KTWizard(
                wizardEl, {
                startStep: 1,
                clickableSteps: false
            });

            // Change event
            wizard.on('change', function (_wizard) {
                let currStep = _wizard.getStep();
                let prev = _wizard.getStep();
                let next = _wizard.getNewStep();
                if (next < prev) {
                    if (_pageChangeCallback != null) {
                        _pageChangeCallback(prev - 1, next - 1);
                    }
                    wizard.goPrev();

                    app.getFunding.wizard.neglect(prev - 1, false, function () {
                        KTUtil.scrollTop();
                        app.getFunding.wizard.attention(next - 1, false, function () {
                        });
                    });
                    //KTUtil.scrollTop();
                } else {
                    validations[currStep - 1].validate().then(function (status) {

                        function doValidate() {
                            let prev = _wizard.getStep();
                            let next = _wizard.getNewStep();
                            if (_pageChangeCallback != null) {
                                _pageChangeCallback(prev - 1, next - 1);
                            }

                            let isNext = next > prev;
                            app.getFunding.wizard.neglect(prev - 1, true, function () {
                                isNext == true ? wizard.goNext() : wizard.goPrev();
                                KTUtil.scrollTop();
                                app.getFunding.wizard.attention(next - 1, true, function () {
                                });
                            });
                        }

                        if (status == 'Valid') {

                            if ((currStep - 1) == app.getFunding.wizard.Pages.FundingRequirement) {
                                validations[app.getFunding.wizard.Pages.FundingRequirement].enableValidator('loanamount');
                                validations[app.getFunding.wizard.Pages.FundingRequirement].revalidateField('loanamount').then(function (status) {
                                    if (status != 'Valid') {
                                        Swal.fire({
                                            text: "Sorry, looks like there are some errors detected, please try again.",
                                            icon: "error",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn font-weight-bold btn-light"
                                            }
                                        }).then(function () {
                                            KTUtil.scrollTop();
                                        });
                                        wizard.stop();
                                    } else {
                                        doValidate();
                                    }
                                });
                            } else {
                                doValidate();
                            }
                        } else {
                            Swal.fire({
                                text: "Sorry, looks like there are some errors detected, please try again.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light"
                                }
                            }).then(function () {
                                KTUtil.scrollTop();
                            });
                        }
                    });
                }
                wizard.stop();
            });
        }

        var initValidation = function () {

            function map(map, name, id, div) {
                let data = {
                    id: id,
                    div: div
                };
                map.set(name, data);
            }

            // FinancialInfo ( _StepIncomeProfitability.cshtml )
            let financialInfoMap = new Map();
            map(financialInfoMap, 'annualturnover', '#annual-turnover', null);
            map(financialInfoMap, 'bank', '#bank', null);
            map(financialInfoMap, 'bankaccservices', '#bank-account-services-type', null);
            map(financialInfoMap, 'businessloans', '#business-loans', null);
            map(financialInfoMap, 'whoistheloanfrom', '#whoistheloanfrom', null);
            map(financialInfoMap, 'businesstxpersonalacc', '#personal-bank-tx', null);
            map(financialInfoMap, 'personalbank', '#personalbankacc', null);
            map(financialInfoMap, 'haselecaccsystems', '#has-electronic-acc-systems', null);
            map(financialInfoMap, 'elecaccsystems', '#elec-acc-systems', null);
            map(financialInfoMap, 'elecaccsystemother', '#elec-acc-systems-other', null);
            map(financialInfoMap, 'haspayroll', '#has-payroll-systems', null);
            map(financialInfoMap, 'payrollsystems', '#payroll-systems', null);
            map(financialInfoMap, 'payrollsystemother', '#payroll-systems-other', null);
            map(financialInfoMap, 'hasinvestedownmoney', '#invested-own-money', null);
            map(financialInfoMap, 'businessisprofitable', '#business-is-profitable', null);
            map(financialInfoMap, 'businesshascolateral', '#business-has-colateral', null);

            let map1 = new Map();

            // FundingRequirement ( _FinanceForSelector.cshtml )
            //map(map1, 'financeforloanamount', '#loanamount', null);

            map(map1, 'financeforloanamount', '#loanamount', null);
            map(map1, 'assetfinancetype', '#asset-finance-type', null);
            map(map1, 'buyingbusinesspropertyvalue', '#asset-finance-buying-business-property', null);
            map(map1, 'buyingbusinesspropertytype', '#asset-finance-buying-business-property', null);
            map(map1, 'propertydevelopmenttype', '#asset-finance-property-development', null);
            map(map1, 'shopfittingpropbonded', '#asset-finance-shopfitting-renovations', null);
            map(map1, 'shopfittingpropertyvalue', '#asset-finance-shopfitting-renovations', null);
            map(map1, 'shopfittingpropertytype', '#asset-finance-shopfitting-renovations', null);


            // GrowthFinanceTypes.cshtml...
            map(map1, 'growthfinancetype', '#growth-finance-type', null);
            map(map1, 'willingtosellshares', '#growth-finance-business-expansion', null);
            map(map1, 'largepotentialmarket', '#business-expansion-willing-to-sell-shares', null);
            map(map1, 'customersbuying', '#business-expansion-willing-to-sell-shares', null);
            map(map1, 'businessexpansioncompetitiveadv', '#growth-finance-business-expansion', null);
            map(map1, 'businessexpansionresultinincreasedemployees', '#growth-finance-business-expansion', null);
            map(map1, 'businessexpansionresultinincreasedprofitability', '#growth-finance-business-expansion', null);
            map(map1, 'businessexpansionresultinincreasedexports', '#growth-finance-business-expansion', null);
            map(map1, 'businessexpansionresultineconomicempowerment', '#growth-finance-business-expansion', null);
            map(map1, 'businessexpansionresultinsustainabledev', '#growth-finance-business-expansion', null);
            map(map1, 'businessexpansionresultinsolveenvchallenges', '#growth-finance-business-expansion', null);
            map(map1, 'productserviceexpansiontype', '#growth-finance-product-service-expansion', null);

            // WorkingCapitalTypes.cshtml...
            map(map1, 'workingcapitaltype', '#working-capital-type', null);
            map(map1, 'cashforaninvoiceamount', '#working-capital-cash-for-invoice', null);
            map(map1, 'cashforinvoicecustomer', '#working-capital-cash-for-invoice', null);
            map(map1, 'customeragreed', '#working-capital-cash-for-invoice', null);
            map(map1, 'hasposdevice', '#working-capital-cash-flow-assistance', null);
            map(map1, 'regularmonthlyincome', '#working-capital-cash-for-retailers-with-card-machine', null);
            map(map1, 'monthlyincomeincomevalue', '#retailers-with-card-machine-monthly-income', null);
            map(map1, 'cardmachinepaymenttypes', '#working-capital-cash-for-retailers-with-card-machine', null);
            map(map1, 'moneyforcontractvalue', '#working-capital-money-for-contract', null);
            map(map1, 'moneyforcontractcustomer', '#working-capital-money-for-contract', null);
            map(map1, 'moneyforcontractcompanyexperience', '#working-capital-money-for-contract', null);
            map(map1, 'moneyfortendervalue', '#working-capital-money-for-tender', null);
            map(map1, 'moneyfortendercustomer', '#working-capital-money-for-tender', null);
            map(map1, 'moneyfortendercompanyexperience', '#working-capital-money-for-tender', null);
            map(map1, 'purchaseordervalue', '#working-capital-puchase-order-funding', null);
            map(map1, 'purchaseordercustomer', '#working-capital-puchase-order-funding', null);
            map(map1, 'purchaseordercustomerexperience', '#working-capital-puchase-order-funding', null);

            // FramchiseAcquisitionTypes.cshtml...
            map(map1, 'franchiseacquisitiontype', '#franchise-acquisition-partner-funding-type', null);
            map(map1, 'buyingafranchisefranchiseaccredited', '#franchise-acquisition-buying-a-franchise', null);
            map(map1, 'preapprovedbyfranchisor', '#franchise-acquisition-buying-a-franchise', null);
            map(map1, 'beepartnerfranchiseaccredited', '#franchise-acquisition-funding-to-bring-on-a-bee-partner', null);
            map(map1, 'industry-sector', '#franchise-acquisition-funding-to-buy-an-existing-business', null);
            map(map1, 'industry-sub-sector', '#franchise-acquisition-funding-to-buy-an-existing-business', null);
            map(map1, 'fundingtobuyanexistingbusinesstype', '#franchise-acquisition-funding-to-buy-an-existing-business', null);
            map(map1, 'businesslocatedinruralarea', '#franchise-acquisition-funding-to-buy-an-existing-business', null);
            map(map1, 'shareholdinggreaterthanperc', '#franchise-acquisition-funding-partner-or-management-buyout', null);

            // ResearchInnovationFundingTypes.cshtml...
            map(map1, 'researchinnovationfundingtype', '#research-innovation-funding-type', null);
            map(map1, 'commresstudentstatus', '#research-innovation-new-product-commercialisation', null);
            map(map1, 'commreswillincexports', '#research-innovation-new-product-commercialisation', null);
            map(map1, 'commresresultinjobcreation', '#research-innovation-new-product-commercialisation', null);
            map(map1, 'commresintroinnov', '#research-innovation-new-product-commercialisation', null);
            map(map1, 'commresindustries', '#research-innovation-new-product-commercialisation', null);
            map(map1, 'researchtakingplaceinuniversity', '#research-innovation-research-funding', null);
            map(map1, 'researchfieldofresearchtype', '#research-innovation-research-funding', null);

            // OtherFundingTypes.cshtml...
            map(map1, 'otherfinancetype', '#other-finance-for-type', null);
            map(map1, 'willworkgenerate50newjobs', '#other-finance-business-process-outsourcing', null);
            map(map1, 'doyouhavecontractsforbps', '#other-finance-business-process-outsourcing', null);
            map(map1, 'will80percofjobsbeforyouth', '#other-finance-business-process-outsourcing', null);
            map(map1, 'otherfinanceexportindustry', '#other-finance-export-funding-trade-finance', null);
            map(map1, 'exportcountry', '#other-finance-export-funding-trade-finance', null);
            map(map1, 'needingtoconductintmarketresearch', '#other-finance-export-funding-trade-finance', null);
            map(map1, 'haveconfirmedorders', '#other-finance-export-funding-trade-finance', null);
            map(map1, 'otherfinanceimportindustry', '#other-finance-import-funding-trade-finance', null);
            map(map1, 'importcountry', '#other-finance-import-funding-trade-finance', null);
            map(map1, 'havesignedcontracts', '#other-finance-import-funding-trade-finance', null);
            map(map1, 'workinruralareas', '#other-finance-poverty-alleviation-and-rural-development', null);
            map(map1, 'resultinemploymentsavejobs', '#other-finance-poverty-alleviation-and-rural-development', null);
            map(map1, 'workwithpeoplewithdisabilities', '#other-finance-poverty-alleviation-and-rural-development', null);
            map(map1, 'willprojectimprovehealthcare', '#other-finance-poverty-alleviation-and-rural-development', null);
            map(map1, 'willgenerateincomeinimpoverishedareas', '#other-finance-poverty-alleviation-and-rural-development', null);
            map(map1, 'willgenerateincreasedexportvalue', '#other-finance-poverty-alleviation-and-rural-development', null);

            // FinancialInfo ( _StepIncomeProfitability.cshtml )
            function addFinancialInfoValidation() {
                let validation = FormValidation.formValidation(
                    formEl,
                    {
                        fields: {
                            annualturnover: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            bank: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            bankaccservices: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select one or more options above'
                                    }
                                }
                            },
                            businessloans: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            whoistheloanfrom: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            businesstxpersonalacc: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            personalbank: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            haselecaccsystems: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            elecaccsystems: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            elecaccsystemother: {
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter electronic accounting system'
                                    }
                                }
                            },
                            haspayroll: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            payrollsystems: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            payrollsystemother: {
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter other payroll system'
                                    }
                                }
                            },
                            hasinvestedownmoney: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            businessisprofitable: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            businesshascolateral: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap(),
                            excluded: new FormValidation.plugins.Excluded({
                                excluded: function (field, elem, eles) {
                                    let data = financialInfoMap.get(field);
                                    if (data != null && data.id != null && data.id != 'undefined') {
                                        let visible = $(data.id).is(':visible');
                                        return visible == false;
                                    } else {
                                        return false;
                                    }
                                }
                            })
                        }
                    }
                );
                validations.push(validation);
            }

            // FundingRequirement ( _FinanceForSelector.cshtml )
            function addFundingRequirementValidation() {

                let validation = FormValidation.formValidation(
                    formEl,
                    {
                        fields: {
                            financefor: {
                                validators: {
                                    //notEmpty: {
                                    //    message: 'Finance For must be selected'
                                    //},
                                    callback: {
                                        callback: function (arg) {
                                            if (arg.value.length == 0) {
                                                $('#finance-for-dummy').val('0');
                                            } else {
                                                $('#finance-for-dummy').val('1');
                                                validations[1].resetField('financefordummy', true);
                                            }
                                            return true;
                                        }
                                    }
                                }
                            },

                            financefordummy: {
                                validators: {
                                    callback: {
                                        callback: function (arg) {
                                            return $('#finance-for-dummy').val() == '1';
                                        },
                                        message: 'Please select your funding type'
                                    }
                                }
                            },

                            // AssetFinanceTypes.cshtml...
                            loanamount: {
                                validators: {
                                    notEmpty: {
                                        message: 'Minimum loan amount of ' + MIN_LOAN_AMOUNT.toString() + ' Rands is required'
                                    },
                                    callback: {
                                        callback: function (arg) {
                                            validations[app.getFunding.wizard.Pages.FundingRequirement].disableValidator('loanamount');
                                            let value = $('#loanamount').val();
                                            value = value.toString().replace(/\s/g, '');
                                            value = parseFloat(value);
                                            return value >= MIN_LOAN_AMOUNT;
                                        },
                                        message: 'Minimum loan amount of ' + MIN_LOAN_AMOUNT.toString() + ' rands is required'
                                    }
                                }
                            },
                            assetfinancetype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Asset Finance Type must be selected'
                                    }
                                }
                            },
                            buyingbusinesspropertyvalue: {
                                validators: {
                                    notEmpty: {
                                        message: 'Value is required'
                                    }
                                }
                            },
                            buyingbusinesspropertytype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            propertydevelopmenttype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            shopfittingpropbonded: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            shopfittingpropertyvalue: {
                                validators: {
                                    notEmpty: {
                                        message: 'Value is required'
                                    }
                                }
                            },
                            shopfittingpropertytype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },

                            // GrowthFinanceTypes.cshtml...
                            growthfinancetype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Growth Finance Type must be selected'
                                    }
                                }
                            },
                            willingtosellshares: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            largepotentialmarket: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            customersbuying: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            businessexpansioncompetitiveadv: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            businessexpansionresultinincreasedemployees: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            businessexpansionresultinincreasedprofitability: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            businessexpansionresultinincreasedexports: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            businessexpansionresultineconomicempowerment: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            businessexpansionresultinsustainabledev: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            businessexpansionresultinsolveenvchallenges: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            productserviceexpansiontype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            // WorkingCapitalTypes.cshtml...
                            workingcapitaltype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Working Capital Type must be selected'
                                    }
                                }
                            },
                            cashforaninvoiceamount: {
                                validators: {
                                    callback: function (arg) {
                                        return {
                                            valid: $('#working-capital-cash-for-invoice').is(':visible'),
                                            message: 'Value is required'
                                        };
                                    }
                                }
                            },
                            cashforinvoicecustomer: {
                                validators: {
                                    notEmpty: {
                                        message: 'Customer Type must be selected'
                                    }
                                }
                            },
                            customeragreed: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            hasposdevice: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            regularmonthlyincome: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            monthlyincomeincomevalue: {
                                validators: {
                                    notEmpty: {
                                        message: 'Value is required'
                                    }
                                }
                            },

                            cardmachinepaymenttypes: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            moneyforcontractvalue: {
                                validators: {
                                    notEmpty: {
                                        message: 'Value is required'
                                    }
                                }
                            },
                            moneyforcontractcustomer: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            moneyforcontractcompanyexperience: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            moneyfortendervalue: {
                                validators: {
                                    notEmpty: {
                                        message: 'Value is required'
                                    }
                                }
                            },
                            moneyfortendercustomer: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            moneyfortendercompanyexperience: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            purchaseordervalue: {
                                validators: {
                                    notEmpty: {
                                        message: 'Value is required'
                                    }
                                }
                            },
                            purchaseordercustomer: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            purchaseordercustomerexperience: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },

                            // FramchiseAcquisitionTypes.cshtml...
                            franchiseacquisitiontype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Franchise Acquisition Type must be selected'
                                    }
                                }
                            },
                            buyingafranchisefranchiseaccredited: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            preapprovedbyfranchisor: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            beepartnerfranchiseaccredited: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },

                            'industry-sector': {
                                validators: {
                                    notEmpty: {
                                        message: 'Industry Sector required'
                                    }
                                }
                            },
                            'industry-sub-sector': {
                                validators: {
                                    notEmpty: {
                                        message: 'Industry Sub-Sector required'
                                    }
                                }
                            },


                            fundingtobuyanexistingbusinesstype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            businesslocatedinruralarea: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            shareholdinggreaterthanperc: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },

                            // ResearchInnovationFundingTypes.cshtml...
                            researchinnovationfundingtype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Research and Innovation Type must be selected'
                                    }
                                }
                            },
                            commresstudentstatus: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            commreswillincexports: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            commresresultinjobcreation: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            commresintroinnov: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            commresindustries: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            researchtakingplaceinuniversity: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            researchfieldofresearchtype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },

                            // OtherFundingTypes.cshtml...
                            otherfinancetype: {
                                validators: {
                                    notEmpty: {
                                        message: 'Other Business Finance Type must be selected'
                                    }
                                }
                            },
                            willworkgenerate50newjobs: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            doyouhavecontractsforbps: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            will80percofjobsbeforyouth: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            otherfinanceexportindustry: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            exportcountry: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            needingtoconductintmarketresearch: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            haveconfirmedorders: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            otherfinanceimportindustry: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            importcountry: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select an appropriate option'
                                    }
                                }
                            },
                            havesignedcontracts: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            workinruralareas: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            resultinemploymentsavejobs: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            workwithpeoplewithdisabilities: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            willprojectimprovehealthcare: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            willgenerateincomeinimpoverishedareas: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            willgenerateincreasedexportvalue: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            }
                        },

                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap(),
                            excluded: new FormValidation.plugins.Excluded({
                                excluded: function (field, elem, eles) {
                                    let data = map1.get(field);
                                    if (data != null && data.id != null && data.id != 'undefined') {
                                        let visible = $(data.id).is(':visible');
                                        return visible == false;
                                    } else {
                                        return false;
                                    }
                                }
                            })
                        }
                    }
                );
                validations.push(validation);
            }

            // Funder Essentials ( _StepFundingEssentials.cshtml )
            function addFunderEssentialsValidation() {
                let validation = FormValidation.formValidation(
                    formEl,
                    {
                        fields: {
                            doyouknowyourpersonalcreditscore: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            },
                            wanttouploadbusbankstatements: {
                                validators: {
                                    notEmpty: {
                                        message: 'Select either Yes or No'
                                    }
                                }
                            }
                            //'name-input-seeks-funding-advice': {
                            //    validators: {
                            //        notEmpty: {
                            //            message: 'Select either Yes or No'
                            //        }
                            //    }
                            //}
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap()
                        }
                    }
                );
                validations.push(validation);
            }

            // Summary ( _StepSummary.cshtml )
            function addSummaryValidation() {
                let validation = FormValidation.formValidation(
                    formEl,
                    {
                        fields: {
                            summarydeclaration: {
                                validators: {
                                    notEmpty: {
                                        message: 'Declaration is required'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap()
                        }
                    }
                );
                validations.push(validation);
            }

            addFinancialInfoValidation();
            addFundingRequirementValidation();
            addFunderEssentialsValidation();
            addSummaryValidation();

            validations[app.getFunding.wizard.Pages.FundingRequirement].disableValidator('loanamount');
        }

        let _funderSearchJson = null;

        var initSubmit = function (submitCompleteFn) {
            let _submitCompleteFn = submitCompleteFn;
            $('#id-funding-application-submit').on('click', function (e) {


                function savePdf(cb) {
                    app.getFunding.crud.savePdf(function (status) {
                        cb();
                    });
                }

                let submitData = null;

                function submitForm(cb) {
                    app.getFunding.crud.submit(_application.id, _funderSearchJson, function (status, data) {
                        submitData = data;
                        //_submitCompleteFn(true, data);
                        KTUtil.scrollTop();
                        cb();
                    });
                }

                e.preventDefault();
                let currStep = wizard.getStep();

                let declaration = app.control.checkbox('summarydeclaration');
                let checked = declaration.getAll(true);
                status = checked.length > 0 ? 'Valid' : 'Invalid';
                //validations[currStep - 1].validate().then(function (status) {
                    if (status == 'Valid') {
                        let count = 2;
                        function complete() {
                            count--;
                            if (count == 0) {
                                KTApp.unblockPage();
                                _submitCompleteFn(true, submitData);
                            }
                        }
                
                        KTApp.blockPage({
                            overlayColor: 'blue',
                            opacity: 0.1,
                            state: 'primary',
                            message: app.localize('FA_SavingForm')
                        });
                
                        submitForm(function () {
                            complete();
                        });
                
                        // TODO: Done one after the other for now!
                        savePdf(function () {
                            complete();
                        });
                    } else {
                        Swal.fire({
                            text: "Please check that you have completed all fields",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            }
                        }).then(function () {
                            KTUtil.scrollTop();
                        });
                    }
                //});
                wizard.stop();
            });
        }

        return {
            _ownerVerificationRecord: null,
            _customers: [],

            enableValidation: function (page, field, toggle) {
                if (toggle == true) {
                    validations[page].enableValidator(field);
                } else {
                    validations[page].disableValidator(field);
                }
            },

            init: function (submitCompleteFn) {
                wizardEl = KTUtil.getById('kt_wizard_funding');
                formEl = KTUtil.getById('kt_form_funding');
                initWizard();
                initValidation();
                initSubmit(submitCompleteFn);

                app.getFunding.wizard.attention(app.getFunding.wizard.Pages.FinancialInfo, true, function () {
                });
            },

            setPageChangeCallback: function (pageChangeCallback) {
                _pageChangeCallback = pageChangeCallback;
            },

            validate: function (page) {
                validations[page].validate();
            },

            resetField: function (page, name) {
                validations[page].resetField(name, false);
            },

            addModel: function (model, customers, propJson, application) {
                this._ownerVerificationRecord = JSON.parse(model.replace(/&quot;/g, '"'));
                this._customers = customers.split(',');
                _propJson = JSON.parse(propJson.substring(1, propJson.length - 1));
                if (_propJson.hasOwnProperty('matchCriteriaJson') == false) {
                    _propJson.matchCriteriaJson = [];
                }
                _application.companyId = application.companyId;
                _application.id = application.id;
                _application.mc = JSON.parse(application.mc.substring(1, application.mc.length - 1));
                app.getFunding.crud.init(application);
            },

            setFunderSearchJson: function (funderSearchJson) {
                _funderSearchJson = funderSearchJson;
            }
        };
    }();

    //jQuery(document).ready(function () {

        function allYes() {
            return (
                $("input[name='doyouknowyourpersonalcreditscore']:checked").val() != 'No' &&
                $("input[name='wanttouploadbusbankstatements']:checked").val() != 'No'
            )
        }

        function atLeastOneNo() {
            return (
                $("input[name='doyouknowyourpersonalcreditscore']:checked").val() == 'No' ||
                $("input[name='wanttouploadbusbankstatements']:checked").val() == 'No'
            )
        }

        function isWorkingCapital() {
            let value = $("input[name='financefor']:checked").val();
            return (
                value == '59c2c6b37c83b736d463c251'
            )
        }

        let _funderEss = {
            seeksFundingAdvice: null
        };

        const Pages = {
            FinancialInfo: 0,
            FundingRequirement: 1,
            FunderEssentials: 2,
            Summary: 3
        };



        // Invoked when moving between wizard tabs. prev and next are 0-based page index values, with prev
        // being the page index we are leaving, and next the page index we are going to.
        function pageChangeCallback(prev, next) {

            // TODO: PL clean up 
            function pageChangeFinancialInfo(foreward) {
            
            }
            
            function pageChangeFundingRequirement(foreward) {
            
            }
            
            function pageChangeFunderEssentials(foreward) {
                //if (atLeastOneNo() == true && isWorkingCapital() == true) {
                //    KTWizardFunding.enableValidation(Pages.FunderEssentials, 'name-input-seeks-funding-advice', true);
                //    $('#id-div-seeks-funding-advice').show("fast");
                //} else {
                //    KTWizardFunding.enableValidation(Pages.FunderEssentials, 'name-input-seeks-funding-advice', false);
                //    $('#id-div-seeks-funding-advice').hide("fast");
                //}
                //if (isWorkingCapital() == false) {
                //    $("input[name='name-input-seeks-funding-advice']").removeAttr('checked');
                //    _funderEss.seeksFundingAdvice = null;
                //    app.getFunding.crud.setFundingEss(_funderEss);
                //}
            }

            function pageChangeSummary(foreward) {

                let matchCriteria = $('form').serializeArray();

                function applyGuidConversions() {
                    let key = null;
                    for (let i = 0, max = matchCriteria.length; i < max; i++) {
                        if (matchCriteria[i].name == 'industry-sub-sector') {
                            let catIndex = parseInt($('#id-company-profile-category-select').val());
                            let subCatIndex = parseInt($('#id-company-profile-sub-category-select').val());
                            if (isNaN(catIndex) == true || isNaN(subCatIndex) == true) {
                                return '';
                            } else {
                                let subCatItem = app.common.industrySector.industrySectorData[catIndex].secondary[subCatIndex];
                                key = subCatItem.key;
                                matchCriteria[i].value = key;
                            }
                            break;
                        }
                    }
                }

                applyGuidConversions();

                let arr = app.fss.controller.renderFunderSearch(
                    app.getFunding.crud.getUserProfile(),
                    app.getFunding.crud.getOwnerProfile(),
                    app.getFunding.crud.getCompanyProfile(),
                    matchCriteria,
                    app.getFunding.crud.getAppId()
                );

                arr[0].forEach(function (obj, idx) {
                    let label = _literalMapFinancialInfo[obj.name];
                    obj.label = label;
                });
                arr[1].forEach(function (obj, idx) {
                    let label = _literalMapFundingRequirements[obj.name];
                    obj.label = label;
                });
                KTWizardFunding.setFunderSearchJson(arr[0].concat(arr[1].concat(arr[2])));
            }

            switch (next) {
                case app.getFunding.wizard.Pages.FinancialInfo:
                    pageChangeFinancialInfo(next > prev);
                    break;

                case app.getFunding.wizard.Pages.FundingRequirement:
                    pageChangeFundingRequirement(next > prev);
                    break;

                case app.getFunding.wizard.Pages.FunderEssentials:
                    pageChangeFunderEssentials(next > prev);
                    break;

                case app.getFunding.wizard.Pages.Summary:
                    pageChangeSummary(next > prev);
                    break;
            }
        }

        //KTWizardFunding.init();
        KTWizardFunding.setPageChangeCallback(pageChangeCallback);

        function onClickSaveToPDF() {
            app.getFunding.crud.downloadPdf(function (status) {
            });
        }
        // TODO: DO NOT DELETE THIS. WE WILL NEED IT LATER.
        $('#id-funder-search-save-to-pdf-top').click(onClickSaveToPDF);
        $('#id-funder-search-save-to-pdf-bottom').click(onClickSaveToPDF);

        // hide and show speed config
        var hideSpeed = "fast";
        var showSpeed = "slow";

        //hide finance for type divs
        hideFinanceForTypeSelectListsExcept();

        // hide show Ownership - black south africans only
        $('#black-south-africans-only').hide();
        // hide/show Ownership - woman black coloured and indian only
        $('#woman-black-coloured-and-indian-only').hide();
        // hide/show Ownership - permanent residency in SA
        $('#permanent-residency-in-sa').hide();

        function hideFinanceForTypeSelectListsExcept(exceptStr) {
            //KTWizardFunding.validate(0);

            $("#asset-finance-type").hide();
            $("#franchise-acquisition-partner-funding-type").hide();
            $("#growth-finance-type").hide();
            $("#research-innovation-funding-type").hide();
            $("#working-capital-type").hide();
            $("#other-finance-for-type").hide();
            $("#working-capital-cash-for-invoice").hide();
            $("#working-capital-cash-flow-assistance").hide();
            $("#working-capital-cash-for-retailers-with-card-machine").hide();
            $("#working-capital-money-for-contract").hide();
            $("#working-capital-money-for-tender").hide();
            $("#working-capital-puchase-order-funding").hide();
            $("#retailers-with-card-machine-monthly-income").hide();
            $("#asset-finance-buying-business-property").hide();
            $("#asset-finance-property-development").hide();
            $("#asset-finance-shopfitting-renovations").hide();
            $("#business-expansion-willing-to-sell-shares").hide();
            $("#growth-finance-product-service-expansion").hide();
            $("#growth-finance-business-expansion").hide();
            $("#franchise-acquisition-buying-a-franchise").hide();
            $("#franchise-acquisition-funding-to-bring-on-a-bee-partner").hide();
            $("#franchise-acquisition-funding-to-buy-an-existing-business").hide();
            $("#franchise-acquisition-funding-partner-or-management-buyout").hide();
            $("#research-innovation-new-product-commercialisation").hide();
            $("#research-innovation-research-funding").hide();
            $("#other-finance-business-process-outsourcing").hide();
            $("#other-finance-export-funding-trade-finance").hide();
            $("#other-finance-import-funding-trade-finance").hide();
            $("#other-finance-poverty-alleviation-and-rural-development").hide();

            $("#ownerswithadversecredit").hide();
            $("#ownersdeclaredinsolvent").hide();
            $("#directorswithadversecredit").hide();
            $("#directorsdeclaredinsolvent").hide();
            $("#personalbankacc").hide();
            $("#whoistheloanfrom").hide();
            $("#elec-acc-systems").hide();
            $("#elec-acc-systems-other").hide();
            $("#payroll-systems").hide();
            $("#payroll-systems-other").hide();
            $("#personal-credit-report-link").hide();
            $("#bank-account-services-type").hide();
            $("#upload-business-bank-statements").hide();

        };

        let _defaultFinanceForBackgroundColor = $('#financeForAssetFinanceLabel').css('background-color');
        let financeForRadioMap = new Map();
        let _fananceForBackgroundHighlight = "#BDE0FF";// Darker alice blue.

        financeForRadioMap.set('59c35d64463361150873b641', '#financeForAssetFinanceLabel');
        financeForRadioMap.set('59c2c6b37c83b736d463c251', '#financeForWorkingCapitalLabel');
        financeForRadioMap.set('59c5d92b5eac2311202772f5', '#financeForGrowthFinanceLabel');
        financeForRadioMap.set('59c2c6f77c83b736d463c254', '#financeForFranchiseAquisitionLabel');
        financeForRadioMap.set('59c5d96b5eac2311202772f7', '#financeForOtherBusinessLabel');
        financeForRadioMap.set('59c5d95c5eac2311202772f6', '#financeForResearchInnovationLabel');

        $("input[type='radio']").click(function () {

            function updateFinanceForCSS() {

                function toggleHighLights() {
                    $('#financeForAssetFinanceLabel').css('background-color', _defaultFinanceForBackgroundColor);
                    $('#financeForWorkingCapitalLabel').css('background-color', _defaultFinanceForBackgroundColor);
                    $('#financeForGrowthFinanceLabel').css('background-color', _defaultFinanceForBackgroundColor);
                    $('#financeForFranchiseAquisitionLabel').css('background-color', _defaultFinanceForBackgroundColor);
                    $('#financeForOtherBusinessLabel').css('background-color', _defaultFinanceForBackgroundColor);
                    $('#financeForResearchInnovationLabel').css('background-color', _defaultFinanceForBackgroundColor);
                }
                toggleHighLights();
                let financeForRadio = $("input[name='financefor']:checked").val();
                let id = financeForRadioMap.get(financeForRadio);
                if (id != null) {
                    $(id).css('background-color', _fananceForBackgroundHighlight);
                }
            }

            if (this.name == 'customeragreed') {
                let cfiRadioValue = $("input[name='customeragreed']:checked").val();

                if (cfiRadioValue === "No") {
                    $("#customernotagreed").show(showSpeed);
                } else {
                    $("#customernotagreed").hide(hideSpeed);
                }
                // radio - cash-for-retailers-with-card-machine
            } else if (this.name == 'regularmonthlyincome') {
                let cfrRadioValue = $("input[name='regularmonthlyincome']:checked").val();

                if (cfrRadioValue === "Yes") {
                    $("#retailers-with-card-machine-monthly-income").show("slow");
                } else {
                    $("#retailers-with-card-machine-monthly-income").hide(hideSpeed);
                }
                // radio - financefor
            } else if (this.name == 'financefor') {

                updateFinanceForCSS();
                let radioValue = $("input[name='financefor']:checked").attr('id');

                if (radioValue) {

                    var financeForSelectName = "#" + radioValue + "-type";
                    // hide all financefortype select lists
                    hideFinanceForTypeSelectListsExcept(financeForSelectName);

                    // default the selected index to default
                    //var selectElem = "select" + financeForSelectName;
                    //$(selectElem)[0].selectedIndex = 0;

                    // set select to required
                    $(financeForSelectName).prop('required', true);
                    // show select input
                    $(financeForSelectName).show(showSpeed);
                }
            } else if (this.name == 'willingtosellshares') {
                let sellSharesRadioValue = $("input[name='willingtosellshares']:checked").val();

                if (sellSharesRadioValue) {
                    if (sellSharesRadioValue === "Yes") {
                        $("#business-expansion-willing-to-sell-shares").show("slow");
                    } else {
                        $("#business-expansion-willing-to-sell-shares").hide(hideSpeed);
                    }
                }
            } else if (this.name == 'ownerssadversecreditlistings') {
                let ownersadvRadioValue = $("input[name='ownerssadversecreditlistings']:checked").val();

                if (ownersadvRadioValue) {
                    if (ownersadvRadioValue === "Yes") {
                        $("#ownerswithadversecredit").show("slow");
                    } else {
                        $("#ownerswithadversecredit").hide(hideSpeed);
                    }
                }
            } else if (this.name == 'ownersdeclaredinsolvent') {
                let ownersInsRadioValue = $("input[name='ownersdeclaredinsolvent']:checked").val();

                if (ownersInsRadioValue) {
                    if (ownersInsRadioValue === "Yes") {
                        $("#ownersdeclaredinsolvent").show("slow");
                    } else {
                        $("#ownersdeclaredinsolvent").hide(hideSpeed);
                    }
                }
            } else if (this.name == 'directorsadversecreditlistings') {
                let diradvRadioValue = $("input[name='directorsadversecreditlistings']:checked").val();

                if (diradvRadioValue) {
                    if (diradvRadioValue === "Yes") {
                        $("#directorswithadversecredit").show("slow");
                    } else {
                        $("#directorswithadversecredit").hide(hideSpeed);
                    }
                }
            } else if (this.name == 'directorsdeclaredinsolvent') {
                let dirsInsRadioValue = $("input[name='directorsdeclaredinsolvent']:checked").val();

                if (dirsInsRadioValue) {
                    if (dirsInsRadioValue === "Yes") {
                        $("#directorsdeclaredinsolvent").show("slow");
                    } else {
                        $("#directorsdeclaredinsolvent").hide(hideSpeed);
                    }
                }
            } else if (this.name == 'businesstxpersonalacc') {
                let perAccRadioValue = $("input[name='businesstxpersonalacc']:checked").val();

                if (perAccRadioValue) {
                    if (perAccRadioValue === "Yes") {
                        $("#personalbankacc").show("slow");
                    } else {
                        $("#personalbankacc").hide(hideSpeed);
                    }
                }
            } else if (this.name == 'businessloans') {
                let perAccRadioValue = $("input[name='businessloans']:checked").val();

                if (perAccRadioValue) {
                    if (perAccRadioValue === "Yes") {
                        $("#whoistheloanfrom").show("slow");
                    } else {
                        $("#whoistheloanfrom").hide(hideSpeed);
                    }
                }
            } else if (this.name == 'haselecaccsystems') {
                let perRadioValue = $("input[name='haselecaccsystems']:checked").val();

                if (perRadioValue) {
                    if (perRadioValue === "Yes") {
                        $("#elec-acc-systems").show("slow");
                    } else {
                        $("#elec-acc-systems").hide(hideSpeed);
                    }
                }
            } else if (this.name == 'haspayroll') {
                let perRadioValue = $("input[name='haspayroll']:checked").val();

                if (perRadioValue) {
                    if (perRadioValue === "Yes") {
                        $("#payroll-systems").show("slow");
                    } else {
                        $("#payroll-systems").hide(hideSpeed);
                    }
                }
            }
        });

        $("input[name='doyouknowyourpersonalcreditscore']").on('click', function (arg) {
            let value = $("input[name='doyouknowyourpersonalcreditscore']:checked").val();
            if (value == "Yes") {
                $('#whats-your-personal-credit-score').hide('slow');
                // Hide the radio yes / no. If retrieval fails, we will re-show the yes / no.
                $('#whats-your-personal-credit-score').hide("fast");
                // Show the credit score div.
                $("#personal-credit-report-link").show("slow");
                //if (allYes() == true) {
                    //KTWizardFunding.enableValidation(Pages.FunderEssentials, 'name-input-seeks-funding-advice', false);
                    //$('#id-div-seeks-funding-advice').hide("fast");
                //}
            } else {
                //if (isWorkingCapital() == true) {
                //    KTWizardFunding.enableValidation(Pages.FunderEssentials, 'name-input-seeks-funding-advice', true);
                //    $('#id-div-seeks-funding-advice').show("slow");
                //}
            }
        });

        $("input[name='wanttouploadbusbankstatements']").on('click', function (arg) {
            let value = $("input[name='wanttouploadbusbankstatements']:checked").val();
            if (value == "Yes") {
                $("#upload-business-bank-statements").show("slow");
                //if (allYes() == true) {
                    //KTWizardFunding.enableValidation(Pages.FunderEssentials, 'name-input-seeks-funding-advice', false);
                    //$('#id-div-seeks-funding-advice').hide("fast");
                //}
            } else {
                $("#upload-business-bank-statements").hide("slow");
                //if (isWorkingCapital() == true) {
                //    KTWizardFunding.enableValidation(Pages.FunderEssentials, 'name-input-seeks-funding-advice', true);
                //    $('#id-div-seeks-funding-advice').show("fast");
                //}
            }
        });

        $("input[name='name-input-seeks-funding-advice']").on('click', function (arg) {
            _funderEss.seeksFundingAdvice = $("input[name='name-input-seeks-funding-advice']:checked").val() == "Yes";
            app.getFunding.crud.setFundingEss(_funderEss);
        });

        // working capital and subtypes
        $('#working-capital-type').change(function (event) {
            //KTWizardFunding.validate(0);
            //console.log('working-capital-type val:' + event.target.value);

            if (event.target.value == '59cc9d26132f4c40c446a4f7') {
                $("#working-capital-cash-for-invoice").show(showSpeed);

                $("#working-capital-cash-flow-assistance").hide(hideSpeed);
                $("#working-capital-cash-for-retailers-with-card-machine").hide(hideSpeed);
                $("#working-capital-money-for-contract").hide(hideSpeed);
                $("#customernotagreed").hide(hideSpeed);
                $("#working-capital-money-for-tender").hide(hideSpeed);
                $("#working-capital-puchase-order-funding").hide(hideSpeed);
            } else if (event.target.value == '59cc9d36132f4c40c446a4f8') {
                $("#working-capital-cash-flow-assistance").show(showSpeed);

                $("#working-capital-cash-for-invoice").hide(hideSpeed);
                $("#working-capital-cash-for-retailers-with-card-machine").hide(hideSpeed);
                $("#working-capital-money-for-contract").hide(hideSpeed);
                $("#working-capital-money-for-tender").hide(hideSpeed);
                $("#working-capital-puchase-order-funding").hide(hideSpeed);
            } else if (event.target.value == '5acb467062ba593724e0a78a') {
                $("#working-capital-cash-for-retailers-with-card-machine").show(showSpeed);

                $("#working-capital-cash-flow-assistance").hide(hideSpeed);
                $("#working-capital-cash-for-invoice").hide(hideSpeed);
                $("#working-capital-money-for-contract").hide(hideSpeed);
                $("#working-capital-money-for-tender").hide(hideSpeed);
                $("#working-capital-puchase-order-funding").hide(hideSpeed);
            } else if (event.target.value == '59cca8a430e9df02c82d0795') {
                $("#working-capital-money-for-contract").show(showSpeed);

                $("#working-capital-cash-flow-assistance").hide(hideSpeed);
                $("#working-capital-cash-for-invoice").hide(hideSpeed);
                $("#working-capital-cash-for-retailers-with-card-machine").hide(hideSpeed);
                $("#working-capital-money-for-tender").hide(hideSpeed);
                $("#working-capital-puchase-order-funding").hide(hideSpeed);
            } else if (event.target.value == '59cca89030e9df02c82d0794') {
                $("#working-capital-money-for-tender").show(showSpeed);

                $("#working-capital-money-for-contract").hide(hideSpeed);
                $("#working-capital-cash-flow-assistance").hide(hideSpeed);
                $("#working-capital-cash-for-invoice").hide(hideSpeed);
                $("#working-capital-cash-for-retailers-with-card-machine").hide(hideSpeed);
                $("#working-capital-puchase-order-funding").hide(hideSpeed);
            } else if (event.target.value == '5b213996b958c008605883e8') {
                $("#working-capital-puchase-order-funding").show(showSpeed);

                $("#working-capital-money-for-tender").hide(hideSpeed);
                $("#working-capital-money-for-contract").hide(hideSpeed);
                $("#working-capital-cash-flow-assistance").hide(hideSpeed);
                $("#working-capital-cash-for-invoice").hide(hideSpeed);
                $("#working-capital-cash-for-retailers-with-card-machine").hide(hideSpeed);
            } else {
                $("#working-capital-puchase-order-funding").hide(hideSpeed);
                $("#working-capital-money-for-tender").hide(hideSpeed);
                $("#working-capital-money-for-contract").hide(hideSpeed);
                $("#working-capital-cash-flow-assistance").hide(hideSpeed);
                $("#working-capital-cash-for-invoice").hide(hideSpeed);
                $("#working-capital-cash-for-retailers-with-card-machine").hide(hideSpeed);
            }
        });
        // asset finance and subtypes
        $('#asset-finance-type').change(function (event) {
            if (event.target.value == '59d2695420070a604097b048') {
                $("#asset-finance-property-development").show(showSpeed);
                $("#asset-finance-buying-business-property").hide(hideSpeed);
                $("#asset-finance-shopfitting-renovations").hide(hideSpeed);
            } else if (event.target.value == '59d2694720070a604097b047') {
                $("#asset-finance-buying-business-property").show(showSpeed);
                $("#asset-finance-property-development").hide(hideSpeed);
                $("#asset-finance-shopfitting-renovations").hide(hideSpeed);
            }
            else if (event.target.value == '59d2693920070a604097b046') {
                $("#asset-finance-shopfitting-renovations").show(showSpeed);
                $("#asset-finance-buying-business-property").hide(hideSpeed);
                $("#asset-finance-property-development").hide(hideSpeed);
            } else {
                $("#asset-finance-buying-business-property").hide(hideSpeed);
                $("#asset-finance-property-development").hide(hideSpeed);
                $("#asset-finance-shopfitting-renovations").hide(hideSpeed);
            }
        });
        // asset finance and subtypes
        $('#growth-finance-type').change(function (event) {
            //KTWizardFunding.validate(0);
            //console.log('growth-finance-type val:' + event.target.value);

            if (event.target.value == '59d269bd20070a604097b04a') {
                $("#growth-finance-business-expansion").show(showSpeed);
                $("#growth-finance-product-service-expansion").hide(hideSpeed);
            } else if (event.target.value == '59d269c920070a604097b04b') {
                $("#growth-finance-product-service-expansion").show(showSpeed);
                $("#growth-finance-business-expansion").hide(hideSpeed);
            } else {
                $("#growth-finance-product-service-expansion").hide(hideSpeed);
                $("#growth-finance-business-expansion").hide(hideSpeed);
            }
        });
        // franchise-acquisition-partner-funding-type and subtypes
        $('#franchise-acquisition-partner-funding-type').change(function (event) {
            //KTWizardFunding.validate(0);
            //console.log('franchise-acquisition-partner-funding-type val:' + event.target.value);

            if (event.target.value == '59c2c7087c83b736d463c255') {
                $("#franchise-acquisition-buying-a-franchise").show(showSpeed);
                $("#franchise-acquisition-funding-to-bring-on-a-bee-partner").hide(hideSpeed);
                $("#franchise-acquisition-funding-to-buy-an-existing-business").hide(hideSpeed);
                $("#franchise-acquisition-funding-partner-or-management-buyout").hide(hideSpeed);
            } else if (event.target.value == '59d26a3120070a604097b04f') {
                $("#franchise-acquisition-buying-a-franchise").hide(hideSpeed);
                $("#franchise-acquisition-funding-to-bring-on-a-bee-partner").show(showSpeed);
                $("#franchise-acquisition-funding-to-buy-an-existing-business").hide(hideSpeed);
                $("#franchise-acquisition-funding-partner-or-management-buyout").hide(hideSpeed);
            } else if (event.target.value == '59d26a1620070a604097b04d') {
                $("#franchise-acquisition-buying-a-franchise").hide(hideSpeed);
                $("#franchise-acquisition-funding-to-bring-on-a-bee-partner").hide(hideSpeed);
                $("#franchise-acquisition-funding-to-buy-an-existing-business").show(showSpeed);
                $("#franchise-acquisition-funding-partner-or-management-buyout").hide(hideSpeed);
            } else if (event.target.value == '59d26a2620070a604097b04e') {
                $("#franchise-acquisition-buying-a-franchise").hide(hideSpeed);
                $("#franchise-acquisition-funding-to-bring-on-a-bee-partner").hide(hideSpeed);
                $("#franchise-acquisition-funding-to-buy-an-existing-business").hide(hideSpeed);
                $("#franchise-acquisition-funding-partner-or-management-buyout").show(showSpeed);
            } else {
                $("#franchise-acquisition-buying-a-franchise").hide(hideSpeed);
                $("#franchise-acquisition-funding-to-bring-on-a-bee-partner").hide(hideSpeed);
                $("#franchise-acquisition-funding-to-buy-an-existing-business").hide(hideSpeed);
                $("#franchise-acquisition-funding-partner-or-management-buyout").hide(hideSpeed);
            }
        });
        // asset finance and subtypes
        $('#research-innovation-funding-type').change(function (event) {
            //KTWizardFunding.validate(0);
            //console.log('research-innovation-funding-type val:' + event.target.value);

            if (event.target.value == '5acb25f862ba593724e0a788') {
                $("#research-innovation-new-product-commercialisation").show(showSpeed);
                $("#research-innovation-research-funding").hide(hideSpeed);
            } else if (event.target.value == '5acb260462ba593724e0a789') {
                $("#research-innovation-new-product-commercialisation").hide(hideSpeed);
                $("#research-innovation-research-funding").show(showSpeed);
            } else {
                $("#research-innovation-new-product-commercialisation").hide(hideSpeed);
                $("#research-innovation-research-funding").hide(hideSpeed);
            }
        });
        // other business and subtypes
        $('#other-finance-for-type').change(function (event) {
            //KTWizardFunding.validate(0);
            //console.log('other-finance-for-type val:' + event.target.value);

            if (event.target.value == '59d26d8720070a604097b059') {
                $("#other-finance-business-process-outsourcing").show(showSpeed);
                $("#other-finance-export-funding-trade-finance").hide(hideSpeed);
                $("#other-finance-import-funding-trade-finance").hide(hideSpeed);
                $("#other-finance-poverty-alleviation-and-rural-development").hide(hideSpeed);
            } else if (event.target.value == '59d26a6420070a604097b052') {
                $("#other-finance-business-process-outsourcing").hide(hideSpeed);
                $("#other-finance-export-funding-trade-finance").show(showSpeed);
                $("#other-finance-import-funding-trade-finance").hide(hideSpeed);
                $("#other-finance-poverty-alleviation-and-rural-development").hide(hideSpeed);
            } else if (event.target.value == '59d26d3120070a604097b053') {
                $("#other-finance-business-process-outsourcing").hide(hideSpeed);
                $("#other-finance-export-funding-trade-finance").hide(hideSpeed);
                $("#other-finance-import-funding-trade-finance").show(showSpeed);
                $("#other-finance-poverty-alleviation-and-rural-development").hide(hideSpeed);
            } else if (event.target.value == '59d26d6020070a604097b056') {
                $("#other-finance-business-process-outsourcing").hide(hideSpeed);
                $("#other-finance-export-funding-trade-finance").hide(hideSpeed);
                $("#other-finance-import-funding-trade-finance").hide(hideSpeed);
                $("#other-finance-poverty-alleviation-and-rural-development").show(showSpeed);
            } else {
                $("#other-finance-business-process-outsourcing").hide(hideSpeed);
                $("#other-finance-export-funding-trade-finance").hide(hideSpeed);
                $("#other-finance-import-funding-trade-finance").hide(hideSpeed);
                $("#other-finance-poverty-alleviation-and-rural-development").hide();
            }
        });
        // other elec accounting systems
        $('#elec-acc-systems').change(function (event) {
            if (event.target.value == '60d194ba05955b09d12f35e9') {
                $("#elec-acc-systems-other").show(showSpeed);
            } else {
                $("#elec-acc-systems-other").hide(hideSpeed);
            }
        });
        // other payroll system
        $('#payroll-systems').change(function (event) {
            if (event.target.value == '60d19618eac92464d407fb6c') {
                $("#payroll-systems-other").show(showSpeed);
            } else {
                $("#payroll-systems-other").hide(hideSpeed);
            }
        });
        // bank
        $('#bank').change(function (event) {
            if (event.target.value === "5c86148eb069b41688f61c8f") {
                $("#bank-account-services-type").hide(hideSpeed);
            } else {
                $("#bank-account-services-type").show(showSpeed);
            }
        });

        // finance-for-loan-amount - currency formatting
        $('#loanamount').on('input', function (event) {
            OnInputFormatCurrency(event);
        });
        // cashforaninvoiceamount - currency formatting
        $('#cashforaninvoiceamount').on('input', function (event) {
            OnInputFormatCurrency(event);
        });
        // purchase-order-value - currency formatting
        $('#purchase-order-value').on('input', function (event) {
            OnInputFormatCurrency(event);
        });
        // buying-business-property-value - currency formatting
        $('#buying-business-property-value').on('input', function (event) {
            OnInputFormatCurrency(event);
        });
        // cash-for-retailers-monthly-income - currency formatting
        $('#cash-for-retailers-monthly-income').on('input', function (event) {
            OnInputFormatCurrency(event);
        });
        //money-for-tender-value
        $('#money-for-tender-value').on('input', function (event) {
            OnInputFormatCurrency(event);
        });
        //moneyforcontractvalue
        $('#money-for-contract-value').on('input', function (event) {
            OnInputFormatCurrency(event);
        });
        // shopfitting-property-value
        $('#shopfitting-property-value').on('input', function (event) {
            OnInputFormatCurrency(event);
        });

        function RemoveSpaces(value) {
            return value.toString().replace(/\s/g, '');
        }

        function RemoveLastChar(value) {
            return value.substr(0, value.length - 1);
        }

        function IsANumber(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }

        function FormatNumberWithSpaces(value) {
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        }

        // input event handler: formats a number with spaces between every 3 digits, prepends currency symbol
        function OnInputFormatCurrency(event, symbol = '') {
            // remove spaces
            event.target.value = RemoveSpaces(event.target.value);

            // ensure value is a number
            if (IsANumber(event.target.value)) {
                // format to include symbol and value with number formatting
                event.target.value = FormatNumberWithSpaces(event.target.value);
            } else {
                // if not number remove last input and return
                event.target.value = RemoveLastChar(event.target.value);
                return;
            }
        }

        app.common.industrySector.populateIndustrySector('id-company-profile-category-select');

        $('#id-company-profile-industry-sub-sector-div').hide();

        $('#id-company-profile-category-select').val('');
        $('#id-company-profile-sub-category-select').val('');

        $('#id-company-profile-category-select').change(function (e) {
            let index = $('#id-company-profile-category-select').val();
            app.common.industrySector.populateIndustrySubSectorFromIndex('id-company-profile-sub-category-select', index);
            $('#id-company-profile-industry-sub-sector-div').show();
        });

    app.common.mobile.refresh(false);
}
