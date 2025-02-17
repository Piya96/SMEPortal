"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.userJourney == undefined) {
    app.userJourney = {};
}

(function (userJourney) {

    let user = null;
    let owner = null;
    let companies = [];
    let applications = [];
    let documents = [];

    function loadUser(mustLoadUser, cb) {
        if (mustLoadUser == true) {
            app.wizard.service.loadUserProfile((result) => {
                if (result.data.propertiesJson == null || result.data.propertiesJson == '') {
                    result.data.propertiesJson = JSON.stringify({});
                }
                user = result.data;
                result = app.wizard.addResult();
                cb(result);
            });
        } else {
            let result = app.wizard.addResult();
            cb(result);
        }
    }

    function loadApplications(cb) {
        app.wizard.service.loadAllApplications(app.session.user.id, (result) => {
            applications = result.data.items;
            result = app.wizard.addResult();
            cb(result);
        });
    }

    userJourney.sync = function (mustLoadUser, cb) {

        function doesApplicationExist(applicationId) {
            for (let i = 0, max = applications.length; i < max; i++) {
                if (applicationId == applications[i].application.id) {
                    return true;
                }
            }
            return false;
        }

        function load(cb) {
            loadUser(mustLoadUser, (result) => {
                loadApplications((result) => {
                    cb(result);
                });
            });
        }

        function sync() {
            let prop = JSON.parse(user.propertiesJson);
            if (prop.hasOwnProperty('user-journey') == true) {
                let apps = prop['user-journey']['application'];
                let dirty = false;
                apps.forEach((o, i) => {
                    if (doesApplicationExist(apps[i].id) == false) {
                        apps.splice(i, 1);
                        dirty = true;
                    }
                });
                if (dirty == true) {
                    user.propertiesJson = JSON.stringify(prop);
                    return true;
                } else {
                    return false;
                }

            } else {
                return false;
            }
        }

        function save(cb) {
            app.wizard.service.saveUserProfile(user, (result) => {
                cb(result);
            });
        }

        load((result) => {
            if (sync() == true && mustLoadUser == true) {
                save((result) => {
                    cb(result);
                });
            } else {
                cb(app.wizard.addResult());
            }
        });
    }

    userJourney.run = function (cb) {

        function findField(field, mc) {
            return mc.find((o, i) => {
                return (field == o.name && o.value != '' && o.value != null);
            });
        }

        function findFields(fields, mc) {
            for (let i = 0, max = fields.length; i < max; i++) {
                if (findField(fields[i], mc) == undefined) {
                    return undefined;
                }
            }
            return true;
        }

        function getCompany(id) {
            for (let i = 0, max = companies.length; i < max; i++) {
                if (id == companies[i].smeCompany.id) {
                    return companies[i].smeCompany;
                }
            }
            return null;
        }

        function __loadDocuments__(appCount, productGuid, cb) {
            if (appCount == applications.length || productGuid == null) {
                cb(app.wizard.addResult());
            } else {
                let application = applications[appCount].application;
                let mc = JSON.parse(application.matchCriteriaJson);
                let result = findField(productGuid, mc);
                result = mc.find((o, i) => {
                    return (productGuid == o.name);
                });
                if (result == undefined) {
                    __loadDocuments__(appCount + 1, productGuid, cb);
                } else {
                    abp.services.app.documentsAppServiceExt.getAllUploadedSefaDocuments(result.value, application.smeCompanyId).done((payload) => {
                        let uploadedDocs = payload;
                        if (app.session.tenant.id == 3) {
                            let v1 = findField('select-own-or-rent-business-premises', mc);
                            let v2 = findField('input-existing-insurance-policies-in-place', mc);
                            let v3 = findField('select-mandate-fit-reason-for-finance', mc);
                            let company = getCompany(application.smeCompanyId);
                            if (company != null && v1 != undefined && v2 != undefined && v3 != undefined) {
                                uploadedDocs = app.wizard.common.page.AppCommon.filterDocs(mc, company, payload, v1.value, v2.value, v3.value);
                            }
                        }
                        uploadedDocs.sort(function (a, b) {
                            return a.name > b.name ? 1 : -1;
                        });
                        let total = uploadedDocs.length;
                        uploadedDocs.forEach((doc, idx) => {
                            if (doc.hasBeenUploaded == true ||
                                doc.isRequired == false) {
                                total--;
                            }
                        });
                        if (total == 0) {
                            documents.push({
                                companyId: app.smeCompanyId,
                                uploadedAll: true
                            });
                        } else {
                            documents.push({
                                companyId: app.smeCompanyId,
                                uploadedAll: false
                            });
                        }
                        __loadDocuments__(appCount + 1, productGuid, cb);
                    });
                }
            }
        }

        function loadDocuments(cb) {
            let productGuid = null;
            productGuid = app.session.tenant.id == 3 ? 'product-fit-guid' : 'input-product-guid';
            __loadDocuments__(0, productGuid, (result) => {
                cb(app.wizard.addResult());
            });
        }

        function loadCompanies(cb) {
            app.wizard.service.loadCompanies((result) => {
                companies = result.data;
                result = app.wizard.addResult();
                cb(result);
            });
        }

        function loadOwner(cb) {
            app.wizard.service.loadOwnerProfile((result) => {
                owner = result.data;
                result = app.wizard.addResult();
                cb(result);
            });
        }


        function load(cb) {
            function journeyExists() {
                let prop = JSON.parse(user.propertiesJson);
                return prop.hasOwnProperty('user-journey') == true;
            }

            loadUser(true, (result) => {
                if (journeyExists() == true) {
                    result.message = 'sync';
                    cb(result);
                } else {
                    loadOwner((result) => {
                        loadCompanies((result) => {
                            loadApplications((result) => {
                                loadDocuments((result) => {
                                    result.message = 'insert';
                                    cb(result);
                                });
                            });
                        });
                    });
                }
            });
        }

        function insert() {

            function updateApplications(prop) {

                function updateApplicationFromDbStatus(prop, app, page) {
                    if (app.status == 'QueuedForMatching' ||
                        app.status == 'Matched' ||
                        app.status == 'MatchedNoResults' ||
                        app.status == 'Locked') {
                        prop['page'] = page;
                        prop['stage'] = 'Complete';
                        return true;
                    }
                    if (app.status == 'Abandoned') {
                        prop['page'] = page;
                        prop['stage'] = 'Abandoned';
                        return true;
                    }
                    if (app.status == 'ExitedToFinfind') {
                        prop['page'] = page;
                        prop['stage'] = 'ExitedToFinfind';
                        return true;
                    }
                    if (app.status == 'Cancelled') {
                        prop['page'] = page;
                        prop['stage'] = 'Cancelled';
                        return true;
                    }
                    return false;
                }

                function updateApplicationSefa(prop, app) {
                    if (updateApplicationFromDbStatus(prop, app, 6) == true) {
                        return;
                    }
                    let mc = JSON.parse(app.matchCriteriaJson);
                    let result = null;

                    result = documents.find((o, i) => {
                        return (app.smeCompanyId == o.companyId);
                    });
                    if (result != undefined && result.uploadedAll == true) {
                        prop['page'] = 5;
                        prop['stage'] = 'Summary';
                        return;
                    }
                    result = findField('select-method-of-repayment', mc);
                    if (result != undefined) {
                        prop['page'] = 4;
                        prop['stage'] = 'DocumentUpload';
                        return;
                    }
                    result = findField('input-total-number-of-owners', mc);
                    if (result != undefined) {
                        prop['page'] = 3;
                        prop['stage'] = 'FinancialInfo';
                        return;
                    }
                    result = findField('input-mandate-fit-loan-amount', mc);
                    if (result != undefined) {
                        prop['page'] = 2;
                        prop['stage'] = 'CompanyInfo';
                        return;
                    }
                    prop['page'] = 1;
                    prop['stage'] = 'FundingRequirements';
                }

                function updateApplicationECDC(prop, app) {
                    if (updateApplicationFromDbStatus(prop, app, 7) == true) {
                        return;
                    }
                    let mc = JSON.parse(app.matchCriteriaJson);
                    let result = null;

                    result = documents.find((o, i) => {
                        return (app.smeCompanyId == o.companyId);
                    });
                    if (result != undefined && result.uploadedAll == true) {
                        prop['page'] = 6;
                        prop['stage'] = 'Summary';
                        return;
                    }
                    result = findField('select-method-of-repayment', mc);
                    if (result != undefined) {
                        prop['page'] = 5;
                        prop['stage'] = 'DocumentUpload';
                        return;
                    }
                    result = findField('input-total-number-of-owners', mc);
                    if (result != undefined) {
                        prop['page'] = 4;
                        prop['stage'] = 'FinancialInfo';
                        return;
                    }
                    result = findField('input-product-guid', mc);
                    if (result != undefined) {
                        prop['page'] = 3;
                        prop['stage'] = 'CompanyInfo';
                        return;
                    }
                    result = findField('input-loan-amount', mc);
                    if (result != undefined) {
                        prop['page'] = 2;
                        prop['stage'] = 'ProductMatching';
                        return;
                    }
                    prop['page'] = 1;
                    prop['stage'] = 'FundingRequirements';
                }

                function updateApplicationWhiteLabel(prop, app) {
                    if (updateApplicationFromDbStatus(prop, app, 7) == true) {
                        return;
                    }
                    let mc = JSON.parse(app.matchCriteriaJson);
                    let result = null;

                    result = findFields(['bank-statements-doc', 'turn-over-doc', 'credit-score'], mc);
                    if (result != undefined) {
                        prop['page'] = 6;
                        prop['stage'] = 'Summary';
                        return;
                    }
                    let arr = []
                    for (let i = 0; i < 22; i++) {
                        arr.push('one' + (i + 1).toString());
                    }
                    result = findFields(arr, mc);
                    if (result != undefined) {
                        prop['page'] = 5;
                        prop['stage'] = 'DocumentUploads';
                        return;
                    }
                    result = findField('select-method-of-repayment', mc);
                    if (result != undefined) {
                        prop['page'] = 4;
                        prop['stage'] = 'LenderDocuments';
                        return;
                    }
                    result = findField('input-total-number-of-owners', mc);
                    if (result != undefined) {
                        prop['page'] = 3;
                        prop['stage'] = 'FinancialInfo';
                        return;
                    }
                    result = findField('loanamount', mc);
                    if (result != undefined) {
                        prop['page'] = 2;
                        prop['stage'] = 'CompanyInfo';
                        return;
                    }
                    prop['page'] = 1;
                    prop['stage'] = 'FundingRequirements';
                }

                for (let i = 0, max = applications.length; i < max; i++) {
                    prop['application'].push({
                        id: applications[i].application.id,
                        stage: 'FundingRequirements',
                        page: 0
                    });
                    switch (app.session.tenant.id) {
                        case 3:
                            updateApplicationSefa(prop['application'][i], applications[i].application);
                            break;
                    
                        case 5 :
                            updateApplicationECDC(prop['application'][i], applications[i].application);
                            break;
                    
                        default :
                            updateApplicationWhiteLabel(prop['application'][i], applications[i].application);
                            break;
                    }
                }
            }

            let json = JSON.parse(user.propertiesJson);
            json['user-journey'] = {
                onboarding: {
                    stage: '',
                    page: null
                },
                application: [
                ]
            };
            let prop = json['user-journey'];
            updateApplications(prop);
            if (user.isOnboarded == true) {
                prop['onboarding']['stage'] = 'Complete';
                prop['onboarding']['page'] = 5;
            } else if (companies.length > 0) {
                prop['onboarding']['stage'] = 'Summary';
                prop['onboarding']['page'] = 4;
            } else if (owner != null) {
                prop['onboarding']['stage'] = 'BusinessProfile';
                prop['onboarding']['page'] = 3;
            } else if (user.isIdentityOrPassportConfirmed == true) {
                prop['onboarding']['stage'] = 'OwnerProfile';
                prop['onboarding']['page'] = 2;
            } else {
                prop['onboarding']['stage'] = 'UserProfile';
                prop['onboarding']['page'] = 1;
            }
            user.propertiesJson = JSON.stringify(json);
        }

        function save(cb) {
            app.wizard.service.saveUserProfile(user, (result) => {
                cb(result);
            });
        }

        load((result) => {

            if (result.message == 'insert') {
                insert();
                save((result) => {
                    cb(result);
                });
            } else {
                userJourney.sync(false, (result) => {
                    save((result) => {
                        cb(result);
                    });
                });
            }
        });
    }

})(app.userJourney);
