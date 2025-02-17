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

    class AppController_AfricanBank extends app.wizard.controller.AppController {
        constructor(wizardId, bodyId) {
            super(wizardId, bodyId);
            this.name = 'African Bank App Controller';
        }

        getController() {
            return 'AfricanBankFunderSearch';
        }

        getQLanaPayload() {
            let allFields = true;

            let listItems = this.listItems;
            let self = this;

            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            let dto = this.helpers.nvpArrayToObject(mc);

            function getPropEx(question, dto, src, dst, arr, root = null, fn = null) {
                if (allFields == true) {
                    if (root == null) {
                        arr[dst] = question;
                    } else {
                        arr[dst] = {};
                        arr[dst]['ParentListId'] = root;
                        arr[dst]['ListId'] = question;
                    }
                    return;
                }

                let result = self.helpers.getPropEx(dto, src, '');
                if (result == '') {
                    return;
                } else {
                    let temp = '';
                    result.forEach((value, index) => {
                        if (root != null) {
                        } else {
                        }
                        if ((index + 1) == result.length) {
                            temp += value;
                        } else {
                            temp += (value + ',');
                        }
                    });
                    if (root == null) {
                        arr[dst] = temp;
                    } else {
                        arr[dst] = {};
                        arr[dst]['ParentListId'] = root;
                        arr[dst]['ListId'] = temp;
                    }
                }
            }

            function getProp2(question, dto, src, dst, arr, root = null, fn = null) {
                if (allFields == true) {
                    if (root == null) {
                        arr[dst] = question;
                    } else {
                        arr[dst] = {};
                        arr[dst]['ParentListId'] = root;
                        arr[dst]['ListId'] = question;
                    }
                    return;
                }

                let result = self.helpers.getPropEx(dto, src, '');
                if (result === '') {
                    return;
                } else {
                    if (root == null) {
                        arr[dst] = result;
                    } else {
                        arr[dst] = {};
                        arr[dst]['ParentListId'] = root;
                        arr[dst]['ListId'] = result;
                    }
                    if (root != null) {
                    } else {
                    }

                }
            }

            function getUserObject() {
                let userProfile = self.model.userProfile;
                let temp = {};
                let json = JSON.parse(userProfile['propertiesJson']);
                let vrec = JSON.parse(userProfile['verificationRecordJson']);
                temp['VerificationRecord'] = vrec;

                getProp2('true', userProfile, 'isOwner', 'is-business-owner', temp);
                getProp2('7012281111084', userProfile, 'identityOrPassport', 'identity-number', temp);
                getProp2('0825681111', userProfile, 'phoneNumber', 'mobile-number', temp);
                getProp2('xyz@gmail.com', userProfile, 'emailAddress', 'email-address', temp);
                getProp2('622605ca67e3cc13cf216096', json, 'user-title', 'title', temp, '622605ca67e3cc13cf216095', listItems.getTitles.bind(listItems));
                getProp2('Joe', userProfile, 'name', 'first-name', temp);
                getProp2('Soap', userProfile, 'surname', 'last-name', temp);
                getProp2('6226122fc3ac73094c399c47', userProfile, 'representativeCapacity', 'representative-capacity', temp, '6226122fc3ac73094c399c46', listItems.getRoles.bind(listItems));
                getProp2('Employee', json, 'user-profile-capacity-other', 'representative-capacity-other', temp);
                getProp2('No 123, Balito Drive', json, 'user-profile-registered-address', 'registered-address', temp);
                getProp2('false', userProfile, 'isOnboarded', 'is-onboarded', temp);

                return temp;
            }

            function getOwnerObject() {
                let ownerProfile = self.model.ownerProfile.owner;
                let temp = {};
                let json = JSON.parse(ownerProfile['propertiesJson']);
                let vrec = JSON.parse(ownerProfile['verificationRecordJson']);
                temp['VerificationRecord'] = vrec;

                getProp2('7012281111084', ownerProfile, 'identityOrPassport', 'identity-number', temp);
                getProp2('0825681111', ownerProfile, 'phoneNumber', 'mobile-number', temp);
                getProp2('xyz@gmail.com', ownerProfile, 'emailAddress', 'email-address', temp);
                getProp2('622605ca67e3cc13cf216096', json, 'owner-title', 'title', temp, '622605ca67e3cc13cf216095', listItems.getTitles.bind(listItems));
                getProp2('Joe', ownerProfile, 'name', 'first-name', temp);
                getProp2('Soap', ownerProfile, 'surname', 'last-name', temp);

                getProp2('Male', vrec, 'Gender', 'gender', temp);
                getProp2('51', vrec, 'Age', 'age', temp);
                getProp2('Married', vrec, 'MaritalStatus', 'marital-status', temp);
                getProp2('59e4647603a7c18ae497e759', ownerProfile, 'race', 'race', temp, '59e44c9bce32df0ebcdc27d4', listItems.getRace.bind(listItems));
                getProp2('Yes', json, 'owner-is-married-in-cop', 'married-in-cop', temp);
                getProp2('7012285285222', json, 'owner-spouse-identiy-number', 'spouse-identity-number', temp);

                return temp;
            }

            function getCompanyObject() {
                // TODO: Add uifNumber.

                let companyProfile = self.model.smeCompany.smeCompany;
                let temp = {};
                let json = JSON.parse(companyProfile['propertiesJson']);

                let checks = null;
                if (json.hasOwnProperty('basic-screening-checks') == true) {
                    checks = json['basic-screening-checks'];
                }
                temp['basic-screening-checks'] = checks;

                let vrec = null;
                if (companyProfile['verificationRecordJson'] != null) {
                    vrec = JSON.parse(companyProfile['verificationRecordJson']);
                }
                temp['VerificationRecord'] = vrec;

                getProp2('ABC Computing', companyProfile, 'name', 'name', temp);
                getProp2('5a6ab7cd506ea818e04548ac', companyProfile, 'type', 'type', temp, '59d26e1620070a604097b05a', listItems.getCompanyType.bind(listItems));
                getProp2('2018-06-28T00:00:00', companyProfile, 'registrationDate', 'registration-date', temp);
                getProp2('201836560607', companyProfile, 'registrationNumber', 'registration-number', temp);
                getProp2('2233445566', json, 'taxReferenceNumber', 'tax-reference-number', temp);
                getProp2('1234567890', json, 'vatRegistrationNumber', 'vat-registration-number', temp);
                getProp2('33,Nelson Mandela Bay Metropolitan Municipality,33,6018,EC', companyProfile, 'registeredAddress', 'business-address', temp);
                getProp2('Yes', json, 'registered-for-uif', 'registered-for-uif', temp);
                getProp2('1234567890', json, 'uif-number', 'uif-number', temp);

                let id = allFields == false ? self.helpers.getPropEx(json, 'select-sic-sub-class', '') : '62220b310cc322599e5b29f8';
                let result = app.wizard.isb.findFromId(id, 5);

                id = parseInt(result[4].id);
                temp['IndustrySector'] = {
                    SectionId: result[1].id,
                    Section: result[1].desc,
                    DivisionId: result[2].id,
                    Division: result[2].desc,
                    GroupId: result[3].id,
                    Group: result[3].desc,
                    Class: (id / 10),
                    Subclass: result[4].id,
                    Description: result[4].desc,
                    Label: result[5].desc,
                    Guid: result[5].id
                };

                let arr = companyProfile.registeredAddress.split(',');
                temp['address-line1'] = arr[0] + ' ' + arr[1] + ' ' + arr[2];
                temp['address-line2'] = arr[3] + ' ' + arr[4] + ' ' + arr[5];
                temp['city'] = arr[2];
                let province = app.common.gmap.areaCodeToProvince(arr[4]);
                temp['province'] = province != null ? province.value : '';
                temp['area-code'] = arr[4];

                return temp;
            }

            function getFundingRequirementsObject() {
                let temp = {};
                getPropEx('59c2c6f77c83b736d463c254', dto, 'financefor', 'finance-for', temp, '59c2c6a37c83b736d463c250', null);

                getPropEx('100000', dto, 'loanamount', 'loan-amount', temp);
                // Buy and asset.
                getPropEx('59c35d86463361150873b642', dto, 'assetfinancetype', 'asset-finance-type', temp, '59c35d64463361150873b641', null);
                getPropEx('100000', dto, 'buyingbusinesspropertyvalue', 'buying-business-property-value', temp);
                getPropEx('59ec82881b37792024771d3b', dto, 'buyingbusinesspropertytype', 'buying-business-property-type', temp, '5a6f0a36cb0d114734ecf1fe', null);
                getPropEx('5a8eb7eb22b5241bc0384672', dto, 'propertydevelopmenttype', 'property-development-type', temp, '5a6f0afacb0d114734ecf1ff', null);
                getPropEx('Yes', dto, 'shopfittingpropbonded', 'shopfitting-prop-bonded', temp);
                getPropEx('100000', dto, 'shopfittingpropertyvalue', 'shopfitting-property-value', temp);
                getPropEx('59ec82b71b37792024771d3e', dto, 'shopfittingpropertytype', 'shopfitting-property-type', temp, '5a6f0a36cb0d114734ecf1fe', null);

                // Grow my business.
                getPropEx('59d269c920070a604097b04b', dto, 'growthfinancetype', 'growth-finance-type', temp, '59c5d92b5eac2311202772f5', null);
                getPropEx('Yes', dto, 'willingtosellshares', 'willing-to-sell-shares', temp);
                getPropEx('Yes', dto, 'largepotentialmarket', 'large-potential-market', temp);
                getPropEx('Yes', dto, 'customersbuying', 'customers-buying', temp);
                getPropEx('59ec85771b37792024771d43', dto, 'businessexpansioncompetitiveadv', 'business-expansion-competitive-adv', temp, '59ec85401b37792024771d41', null);
                getPropEx('Yes', dto, 'businessexpansionresultinincreasedemployees', 'business-expansion-result-in-increased-employees', temp);
                getPropEx('Yes', dto, 'businessexpansionresultinincreasedprofitability', 'business-expansion-result-in-increased-profitability', temp);
                getPropEx('Yes', dto, 'businessexpansionresultinincreasedexports', 'business-expansion-result-in-increased-exports', temp);
                getPropEx('Yes', dto, 'businessexpansionresultineconomicempowerment', 'business-expansion-result-in-economic-empowerment', temp);
                getPropEx('Yes', dto, 'businessexpansionresultinsustainabledev', 'business-expansion-result-in-sustainable-dev', temp);
                getPropEx('Yes', dto, 'businessexpansionresultinsolveenvchallenges', 'business-expansion-result-in-solve-env-challenges', temp);
                getPropEx('5a7a7b9d646a451744bca3bc', dto, 'productserviceexpansiontype', 'product-service-expansion-type', temp, '5a7a7afe646a451744bca3b4', null);

                // Other.
                getPropEx('59d26d4720070a604097b054', dto, 'otherfinancetype', 'other-finance-type', temp, '59c5d96b5eac2311202772f7', null);
                getPropEx('Yes', dto, 'willworkgenerate50newjobs', 'will-work-generate-50-new-jobs', temp);
                getPropEx('Yes', dto, 'doyouhavecontractsforbps', 'do-you-have-contracts-for-bps', temp);
                getPropEx('Yes', dto, 'will80percofjobsbeforyouth', 'will-80-perc-of-jobs-be-for-youth', temp);
                getPropEx('5b1f9c58b958c008605883cb', dto, 'otherfinanceexportindustry', 'other-finance-export-industry', temp, '5a8288d5c053780e8c1eb731', null);///
                //getPropEx('TD', dto, 'exportcountry', 'export-country', temp);// Need list items
                getPropEx('Yes', dto, 'needingtoconductintmarketresearch', 'needing-to-conduct-int-marketresearch', temp);
                getPropEx('Yes', dto, 'haveconfirmedorders', 'have-confirmed-orders', temp);
                getPropEx('5b1f9cf7b958c008605883d2', dto, 'otherfinanceimportindustry', 'other-finance-import-industry', temp, '5a8288d5c053780e8c1eb731', null);///
                //getPropEx('BM', dto, 'importcountry', 'import-country', temp);// Need list items
                getPropEx('Yes', dto, 'havesignedcontracts', 'have-signed-contracts', temp);
                getPropEx('Yes', dto, 'workinruralareas', 'work-in-rural-areas', temp);
                getPropEx('Yes', dto, 'resultinemploymentsavejobs', 'result-in-employment-save-jobs', temp);
                getPropEx('Yes', dto, 'workwithpeoplewithdisabilities', 'work-with-people-with-disabilities', temp);
                getPropEx('Yes', dto, 'willprojectimprovehealthcare', 'will-project-improve-healthcare', temp);
                getPropEx('Yes', dto, 'willgenerateincomeinimpoverishedareas', 'will-generate-income-in-impoverished-areas', temp);
                getPropEx('Yes', dto, 'willgenerateincreasedexportvalue', 'will-generate-increased-export-value', temp);

                // Working Capital.
                getPropEx('59cca85e30e9df02c82d0793', dto, 'workingcapitaltype', 'working-capital-type', temp, '59c2c6b37c83b736d463c251', null);
                getPropEx('200000', dto, 'cashforaninvoiceamount', 'cash-for-an-invoice-amount', temp);
                getPropEx('59db188a8964a744e4ad0aaa', dto, 'cashforinvoicecustomer', 'cash-for-invoice-customer', temp, '59db18348964a744e4ad0aa7', null);
                getPropEx('Yes', dto, 'customeragreed', 'customer-agreed', temp);
                getPropEx('Yes', dto, 'hasposdevice', 'has-pos-device', temp);
                getPropEx('Yes', dto, 'regularmonthlyincome', 'regular-monthly-income', temp);
                getPropEx('50000', dto, 'monthlyincomeincomevalue', 'monthly-income-income-value', temp);
                getPropEx('59d3707c7112ea2ef072eec9', dto, 'cardmachinepaymenttypes', 'card-machine-payment-types', temp, '59d370517112ea2ef072eec7', null);
                getPropEx('30000', dto, 'moneyforcontractvalue', 'money-for-contract-value', temp);
                getPropEx('59db18698964a744e4ad0aa8', dto, 'moneyforcontractcustomer', 'money-for-contract-customer', temp, '59db18348964a744e4ad0aa7', null);
                getPropEx('Yes', dto, 'moneyforcontractcompanyexperience', 'money-for-contract-company-experience', temp);
                getPropEx('60000', dto, 'moneyfortendervalue', 'money-for-tender-value', temp);
                getPropEx('59db188a8964a744e4ad0aaa', dto, 'moneyfortendercustomer', 'money-for-tender-customer', temp, '59db18348964a744e4ad0aa7', null);
                getPropEx('Yes', dto, 'moneyfortendercompanyexperience', 'money-for-tender-company-experience', temp);
                getPropEx('120000', dto, 'purchaseordervalue', 'purchase-order-value', temp);
                getPropEx('59db18a08964a744e4ad0aac', dto, 'purchaseordercustomer', 'purchase-order-customer', temp, '59db18348964a744e4ad0aa7', null);
                getPropEx('Yes', dto, 'purchaseordercustomerexperience', 'purchase-order-customer-experience', temp);

                // Franchise Acquisition.
                getPropEx('59d26a1620070a604097b04d', dto, 'franchiseacquisitiontype', 'franchise-acquisition-type', temp, '59c2c6f77c83b736d463c254', null);
                getPropEx('Yes', dto, 'buyingafranchisefranchiseaccredited', 'buying-a-franchise-franchise-accredited', temp);
                getPropEx('Yes', dto, 'preapprovedbyfranchisor', 'preapproved-by-franchisor', temp);
                getPropEx('Yes', dto, 'beepartnerfranchiseaccredited', 'bee-partner-franchise-accredited', temp);


                let id = allFields == false ? self.helpers.getPropEx(dto, 'select-sic-sub-class', '') : '62220b310cc322599e5b29f8';
                if (id != null && id != '') {
                    let result = app.wizard.isb.findFromId(id, 5);

                    id = parseInt(result[4].id);
                    temp['IndustrySector'] = {
                        SectionId: result[1].id,
                        Section: result[1].desc,
                        DivisionId: result[2].id,
                        Division: result[2].desc,
                        GroupId: result[3].id,
                        Group: result[3].desc,
                        Class: (id / 10),
                        Subclass: result[4].id,
                        Description: result[4].desc,
                        Label: result[5].desc,
                        Guid: result[5].id
                    };
                }

                getPropEx('59d2edc139b41c2b749a03e0', dto, 'fundingtobuyanexistingbusinesstype', 'funding-to-buy-an-existing-business-type', temp, '59d2ed3839b41c2b749a03d9', null);
                getPropEx('Yes', dto, 'businesslocatedinruralarea', 'business-located-in-rural-area', temp);
                getPropEx('Yes', dto, 'shareholdinggreaterthanperc', 'shareholding-greater-than-perc', temp);

                // Research Innovation.
                getPropEx('5acb25dd62ba593724e0a787', dto, 'researchinnovationfundingtype', 'research-innovation-funding-type', temp, '59c5d95c5eac2311202772f6', null);
                getPropEx('Yes', dto, 'commresstudentstatus', 'comm-res-student-status', temp);
                getPropEx('Yes', dto, 'commreswillincexports', 'comm-res-will-inc-exports', temp);
                getPropEx('Yes', dto, 'commresresultinjobcreation', 'comm-res-result-in-job-creation', temp);
                getPropEx('Yes', dto, 'commresintroinnov', 'comm-res-intro-innov', temp);
                getPropEx('5b1f9cd8b958c008605883d0', dto, 'commresindustries', 'comm-res-industries', temp, '5a8288d5c053780e8c1eb731', null);
                getPropEx('Yes', dto, 'researchtakingplaceinuniversity', 'research-taking-place-in-university', temp);
                getPropEx('5b2a388cb958c008605883f9', dto, 'researchfieldofresearchtype', 'research-field-of-research-type', temp, '5b1fa3a5b958c008605883e1', null);

                return temp;
            }

            function getCompanyInfoObject() {
                let temp = {};
                // Company info common.
                getPropEx('6', dto, 'input-total-number-of-owners', 'total-number-of-owners', temp);
                getPropEx('6', dto, 'input-percent-ownership-by-south-africans', 'ownership-by-south-africans', temp);
                getPropEx('0', dto, 'input-percent-black-coloured-indian-pdi', 'black-coloured-indian-pdi', temp);
                getPropEx('0', dto, 'input-percent-black-south-africans-only', 'black-south-africans-only', temp);
                getPropEx('0', dto, 'input-percent-white-only', 'white-only', temp);
                getPropEx('5', dto, 'input-percent-asian-only', 'asian-only', temp);
                getPropEx('2', dto, 'input-percent-disabled-people', 'disabled-people', temp);
                getPropEx('2', dto, 'input-percent-youth-under-35', 'youth-under-35', temp);
                getPropEx('0', dto, 'input-percent-women-women-any-race', 'women-women-any-race', temp);
                getPropEx('0', dto, 'input-percent-women-black-only', 'women-black-only', temp);
                getPropEx('2', dto, 'input-military-veteran-owners', 'military-veteran-owners', temp);
                getPropEx('0', dto, 'input-percent-non-south-african-citizens', 'non-south-african-citizens', temp);
                getPropEx('0', dto, 'input-percent-companies-organisations', 'companies-organisations', temp);
                getPropEx('5af2807d7fbbb21e6817bc48', dto, 'select-company-profile-bee-level', 'bee-level', temp, '5af27ffb7fbbb21e6817bc41', listItems.getBeeLevel.bind(listItems));
                getPropEx('6', dto, 'input-total-number-of-employees', 'number-of-employees', temp);
                getPropEx('Yes', dto, 'input-registered-for-coida', 'registered-for-coida', temp);
                getPropEx('3', dto, 'input-number-of-permanent-employees', 'number-of-permanent-employees', temp);
                getPropEx('2', dto, 'input-number-of-permanent-youth-employees-under35', 'number-of-permanent-youth-employees-under35', temp);
                getPropEx('2', dto, 'input-number-of-permanent-female-employees', 'number-of-permanent-female-employees', temp);
                getPropEx('2', dto, 'input-number-of-permanent-black-employees', 'number-of-permanent-black-employees', temp);
                getPropEx('0', dto, 'input-number-of-permanent-non-sa-employees', 'number-of-permanent-non-sa-employees', temp);
                getPropEx('0', dto, 'input-number-of-permanent-disabled-employees', 'number-of-permanent-disabled-employees', temp);
                getPropEx('0', dto, 'input-number-of-new-jobs-created-through-loan', 'number-of-new-jobs-created-through-loan', temp);
                getPropEx('3', dto, 'input-number-of-existing-jobs-sustained', 'number-of-existing-jobs-sustained', temp);
                getPropEx('3', dto, 'input-number-of-part-time-employees', 'number-of-part-time-employees', temp);
                getPropEx('0', dto, 'input-number-of-part-time-youth-employees-under35', 'number-of-part-time-youth-employees-under35', temp);
                getPropEx('0', dto, 'input-number-of-part-time-female-employees', 'number-of-part-time-female-employees', temp);
                getPropEx('0', dto, 'input-number-of-part-time-black-employees', 'number-of-part-time-black-employees', temp);
                getPropEx('0', dto, 'input-number-of-part-time-non-sa-employees', 'number-of-part-time-non-sa-employees', temp);
                getPropEx('0', dto, 'input-number-of-part-time-disabled-employees', 'number-of-part-time-disabled-employees', temp);
                getPropEx('0', dto, 'input-number-of-new-part-time-jobs-created-through-loan', 'number-of-new-part-time-jobs-created-through-loan', temp);
                getPropEx('3', dto, 'input-number-of-existing-part-time-jobs-sustained', 'number-of-existing-part-time-jobs-sustained', temp);
                // Company info Finfind.
                getPropEx('2018-06-28T00:00:00', dto, 'date-started-trading-date', 'started-trading-date', temp);
                return temp;
            }

            function getFinancialInfoObject() {
                let temp = {};
                // Financial info common.
                getPropEx('634d5b436044adba621f2a9d', dto, 'select-method-of-repayment', 'method-of-repayment', temp, '62c4435273368b9d83842a13', listItems.getPaymentType.bind(listItems));
                getPropEx('634d5ba19602a7db2be90803', dto, 'select-own-or-rent-business-premises', 'own-or-rent-business-premises', temp, '62c44449f252aed95345af15', listItems.getRentType.bind(listItems));
                getPropEx('634d57af986702976914c00e', dto, 'select-type-of-collateral', 'type-of-business-collateral', temp, '62c6f7a038ffd81379804dfb', listItems.getSefaCollateralBusiness.bind(listItems));
                getPropEx('House', dto, 'input-type-of-collateral-other', 'type-of-business-collateral-other', temp);
                getPropEx('500000', dto, 'input-value-of-collateral', 'value-of-business-collateral', temp);
                getPropEx('634d59a84fdfb75bfc13c3ea', dto, 'select-type-of-security', 'type-of-owner-collateral', temp, '62c6f8906b9e3f9dd8e3d8c4', listItems.getSefaCollateralOwner.bind(listItems));
                getPropEx('Car', dto, 'input-type-of-security-other', 'type-of-owner-collateral-other', temp);
                getPropEx('400000', dto, 'input-value-of-security', 'value-of-owner-collateral', temp);
                // REMOVED FOR ECDC AND FINFIND AS PER REQUEST!!!
                //getPropEx('50000', dto, 'input-company-contribution', 'company-contribution', temp);
                //getPropEx('634d5a94e3211403815289cc', dto, 'select-source-of-funds-company', 'source-of-funds-company', temp, '6278d25ba5a926059e491691', listItems.getSourceOfFunds.bind(listItems));
                //getPropEx('Assets', dto, 'input-source-of-funds-company-other','source-of-funds-company-other', temp);
                getPropEx('5a8d626b22b5241bc0384671', dto, 'select-annual-turnover', 'annual-turnover', temp, '59d359ac7112ea2ef072eec4', listItems.getAnnualTurnover.bind(listItems));
                getPropEx('634d5c5b9a3d0030c6e844d7', dto, 'select-financial-year-end', 'financial-year-end', temp, '616d6e53668f1708a649134b', listItems.getMonth.bind(listItems));
                getPropEx('5c812408b069b41688f61c7d', dto, 'select-business-account-bank', 'business-account-bank', temp, '5c810d51b069b41688f61c78', listItems.getBank.bind(listItems));
                getPropEx('60a65f059d7ed8e9f7fce6df', dto, 'bankaccservices', 'bank-account-type', temp, '60a65b5b61d3627f442b31fb', listItems.getBankAccount.bind(listItems));
                getPropEx('Yes', dto, 'input-has-electronic-accounting-system', 'has-electronic-accounting-system', temp);
                getPropEx('60d194ba05955b09d12f35e5', dto, 'select-which-accounting-system-do-you-have', 'which-accounting-system-do-you-have', temp, '60d194ba05955b09d12f35e3', listItems.getAccountingSystem.bind(listItems));
                getPropEx('ABC Accounting', dto, 'input-acounting-system-other', 'acounting-system-other', temp);
                getPropEx('Yes', dto, 'input-permit-sefa-to-call-data-from-accounting-system-monthly', 'permit-to-call-data-from-accounting-system-monthly', temp);
                getPropEx('Yes', dto, 'input-any-other-business-loans', 'any-other-business-loans', temp);
                getPropEx('60d193dd3b54b27d872cdebb', dto, 'select-who-is-this-loan-from', 'who-is-this-loan-from', temp, '60d193354e4bf55f7b0b8ff8', listItems.getLoanFrom.bind(listItems));
                //getPropEx('Yes', dto, 'input-has-business-insurance', 'has-business-insurance', temp);
                getPropEx('Yes', dto, 'input-existing-insurance-policies-in-place', 'existing-insurance-policies-in-place', temp);
                getPropEx('64a52a908da0a9867c759b65', dto, 'check-business-insurance-type', 'business-insurance-type', temp, '64a52a3196d8da823f62da3a');
                getPropEx('Momentum', dto, 'input-business-insurance-other', 'business-insurance-other', temp);
                getPropEx('Yes', dto, 'input-any-business-transactions-through-personal-accounts', 'any-business-transactions-through-personal-accounts', temp);
                getPropEx('5c812441b069b41688f61c7f', dto, 'select-who-do-you-bank-with-personally', 'who-do-you-bank-with-personally', temp, '5c810d51b069b41688f61c78', listItems.getBank.bind(listItems));
                getPropEx('Yes', dto, 'input-use-payroll-system-for-staff-payslips', 'use-payroll-system-for-staff-payslips', temp);
                getPropEx('60d19618eac92464d407fb67', dto, 'select-which-electronic-payroll-system', 'which-electronic-payroll-system', temp, '60d19618eac92464d407fb62', listItems.getPayrollSystem.bind(listItems));
                getPropEx('XYZ Payroll', dto, 'input-payroll-system-other', 'payroll-system-other', temp);
                getPropEx('64a52d29c324eead32cfa2ad', dto, 'select-has-owners-loan-account', 'has-owners-loan-account', temp, '64a52ce558ab257c5beda2da', listItems.getOwnerLoanAccountStatus.bind(listItems));
                // Financial info Finfind.
                getPropEx('Yes', dto, 'input-made-profit-over-last-6-months', 'made-profit-over-last-6-months', temp);
                getPropEx('100000', dto, 'input-has-invested-own-money', 'has-invested-own-money', temp,);
                getPropEx('649acd7fb305b95fc5a965d5', dto, 'select-invested-own-money-value', 'invested-own-money-value', temp, '649acc419b59eb161cbc2bb6', listItems.getMoneyInvestedInBusiness.bind(listItems));

                return temp;
            }

            function getDocumentObject() {
                let temp = {};
                if (dto.hasOwnProperty('turn-over-doc') && Array.isArray(dto['turn-over-doc']) == true) {
                    let result = self.helpers.getPropEx(dto, 'turn-over-doc', '');
                    temp['turn-over-doc'] = {
                        'ParentListId': '5aaf6cfd3a022727ec3b5879',
                        'ListId': result[0]
                    };
                };
                if (dto.hasOwnProperty('bank-statements-doc') && Array.isArray(dto['bank-statements-doc']) == true) {
                    let result = self.helpers.getPropEx(dto, 'bank-statements-doc', '');
                    temp['bank-statements-doc'] = {
                        'ParentListId': '5aaf6cfd3a022727ec3b5879',
                        'ListId': result[0]
                    };
                };
                return temp;
            }

            function getLenderDocuments() {
                let temp = {};

                function addDocument(index, name, documentName) {
                    let value = self.helpers.getPropEx(dto, name, '');
                    temp['document' + index] = (documentName + ',' + value);
                }
                addDocument('1', "one1", "Business registration documents (CIPC) e.g. Cor14.3 or CK documents");
                addDocument('2', "one2", "Certified ID copy of owners and directors");
                addDocument('3', "one3", "Proof of business address (lease agreement, title deed or permit)");
                addDocument('4', "one4", "Bank statements for business account (last 6 months) electronically stamped and on bank letterhead");
                addDocument('5', "one5", "Proof of bank account electronically stamped and on bank letterhead");
                addDocument('6', "one6", "Signed contracts and/or purchase orders");
                addDocument('7', "one7", "List of outstanding debtors (unpaid invoices for more than 30 days)");
                addDocument('8', "one8", "Cashflow projections (income and expense budget for 12 months)");
                addDocument('9', "one9", "Business plan e.g. PDF of the final business plan");
                addDocument('10', "one10", "Statement of assets and liabilities (for all owners)");
                addDocument('11', "one11", "Tax clearance certificate / Tax PIN on official SARS letterhead");
                addDocument('12', "one12", "Management accounts (Income statement, Balance Sheet)");
                addDocument('13', "one13", "Annual financial statements (signed by Accountant)");
                addDocument('14', "one14", "Share register and/or share certificates e.g. PDF of the signed certificates and share register document");
                addDocument('15', "one15", "Shareholder agreement e.g. PDF of the final signed agreement");
                addDocument('16', "one16", "BEE certificate or affidavit");
                addDocument('17', "one17", "Business Organogram e.g. PDF of the final business structure showcasing the different positions and reporting structure");
                addDocument('18', "one18", "Beneficial ownership register/compliance - New laws");
                addDocument('19', "one19", "COIDA letter of good standing. Requires CF number and completed return of earnings at COIDA");
                addDocument('20', "one20", "Industry certifications if applicable (e.g. CIBD)");
                addDocument('21', "one21", "Certified copies of spouse ID (if married in Community of property)");
                addDocument('22', "one22", "Certified copies of marriage certificate (if married in Community of property)");

                return temp;
            }

            let json = {
                user: getUserObject(),
                owner: getOwnerObject(),
                company: getCompanyObject(),
                fundingRequirements: getFundingRequirementsObject(),
                companyInfo: getCompanyInfoObject(),
                financialInfo: getFinancialInfoObject(),
                lenderDocuments: getLenderDocuments(),
                documents: getDocumentObject()
            };
            return json;
        }


        getSummaryDocName() {
            return 'African Bank Summary.pdf';

        }

        getSummaryDocType() {
            return '0123456789A00001';
        }

        onSubmit(cb) {
            let self = this;
            super.onSubmit(cb);
        }
    }

    controller.create = function (wizardId, bodyId) {
        return new AppController_AfricanBank(wizardId, bodyId);
    }

})(app.wizard.controller);
