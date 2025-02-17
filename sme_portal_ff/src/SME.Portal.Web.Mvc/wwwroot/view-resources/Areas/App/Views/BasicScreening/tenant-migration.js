/*
if (typeof app === 'undefined') {
    var app = {};
}

if (app.tenantMigration == undefined) {
    app.tenantMigration = {};
}

(function (tenantMigration) {
    let helpers = app.onboard.helpers.get();

    let loadMock = null;//{mock:true};

    let userId = null;

    let ownerId = null;

    let fs = {
        user: {},
        owner: {},
        company: {},
        application: {}
    };

    function saveUser(cb) {
        if (fs.user.migrated == true) {
            cb();
        } else {
            let json = fs.user.data;
            let prop = json.propertiesJson;
            let vrec = json.verificationRecordJson;
            json.propertiesJson = JSON.stringify(prop);
            json.verificationRecordJson = JSON.stringify(vrec);
            app.wizard.service.saveUserProfile(json, (result) => {
                cb();
            }, loadMock);
        }
    }

    function saveOwner(cb) {
        if (fs.owner.migrated == true) {
            cb();
        } else {
            let json = fs.owner.data;
            let prop = json.propertiesJson;
            let vrec = json.verificationRecordJson;
            json.propertiesJson = JSON.stringify(prop);
            json.verificationRecordJson = JSON.stringify(vrec);
            app.wizard.service.saveOwnerProfile(json, (result) => {
                cb();
            }, loadMock);
        }
    }

    function saveCompanies(cb) {
        function save(counter) {
            let json = fs.companies[counter].company.data;
            let prop = json.propertiesJson;
            let vrec = json.verificationRecordJson;
            json.verificationRecordJson = vrec != null ? JSON.stringify(vrec) : null;
            json.propertiesJson = JSON.stringify(prop);
            json['ownerId'] = ownerId;
            if (fs.companies[counter].company.migrated == true) {
                if (++counter < fs.companies.length) {
                    save(counter);
                } else {
                    cb();
                }
            } else {
                app.wizard.service.saveCompanyProfile(json, (result) => {
                    if (++counter < fs.companies.length) {
                        save(counter);
                    } else {
                        cb();
                    }
                }, loadMock);
            }
        }
        save(0);
    }

    function saveApplications(cb) {
        let counter = fs.applications.length;
        fs.companies.forEach((company, index) => {
            company.applications.forEach((application, index) => {
                if (application.migrated == true) {
                    if (--counter == 0) {
                        cb();
                    }
                } else {
                    let json = application.data;
                    let prop = json.propertiesJson;
                    json.propertiesJson = JSON.stringify(prop);
                    json.matchCriteriaJson = JSON.stringify(json.matchCriteriaJson);

                    let payload = {
                        id: json.id,
                        matchCriteriaJson: json.matchCriteriaJson,
                        locked: json.locked,
                        status: json.status,
                        propertiesJson: json.propertiesJson,
                        userId: json.userId,
                        tenantId: json.tenantId,
                        smeCompanyId: json.smeCompanyId,
                        creationTime: json.created
                    };

                    app.wizard.service.saveApplication(payload, (result) => {
                        if (--counter == 0) {
                            cb();
                        }
                    }, loadMock);
                }
            });
        });
    }

    function translateUser(cb) {
        let json = fs.user.data;
        if (typeof json.propertiesJson !== 'object') {
            if (json.propertiesJson != '') {
                json.propertiesJson = JSON.parse(json.propertiesJson);
            } else {
                json.propertiesJson = {};
            }
        }
        if (typeof json.verificationRecordJson !== 'object') {
            if (json.verificationRecordJson != '') {
                json.verificationRecordJson = JSON.parse(json.verificationRecordJson);
            }
        }
        let prop = json.propertiesJson;
        let vrec = json.verificationRecordJson;
        fs.user.migrated = prop.hasOwnProperty('migrated-to-finfind');
        if (fs.user.migrated == false) {
            let value = '';
            let guid = '';
            prop['migrated-to-finfind'] = true;
            // Any finfind specific stuff???
        }
        cb();
    }

    function translateOwner(cb) {
        let json = fs.owner.data;
        if (typeof json.propertiesJson !== 'object') {
            if (json.propertiesJson != '') {
                json.propertiesJson = JSON.parse(json.propertiesJson);
            } else {
                json.propertiesJson = {};
            }
        }
        if (typeof json.verificationRecordJson !== 'object') {
            if (json.verificationRecordJson != '') {
                json.verificationRecordJson = JSON.parse(json.verificationRecordJson);
            }
        }
        let prop = json.propertiesJson;
        let vrec = json.verificationRecordJson;

        fs.owner.migrated = fs.user.migrated;//json.propertiesJson.hasOwnProperty('migrated-to-finfind');
        if (fs.owner.migrated == false) {
            let value = '';
            let guid = '';
            prop['migrated-to-finfind'] = true;
            // Any finfind specific stuff???
        }
        cb();
    }

    function translateCompany(cb) {
        let counter = fs.companies.length;
        fs.companies.forEach((company, index) => {
            let json = fs.companycompany.company.data;
            if (typeof json.propertiesJson !== 'object') {
                if (json.propertiesJson != '') {
                    json.propertiesJson = JSON.parse(json.propertiesJson);
                } else {
                    json.propertiesJson = {};
                }
            }
            let prop = json.propertiesJson;
            if (typeof json.verificationRecordJson !== 'object') {
                if (json.verificationRecordJson != '' && json.verificationRecordJson != null) {
                    json.verificationRecordJson = JSON.parse(json.verificationRecordJson);
                }
            }
            let vrec = json.verificationRecordJson;
            company.company.migrated = fs.user.migrated;//prop.hasOwnProperty('migrated-to-baseline');
            if (company.company.migrated == false) {
                prop['migrated-to-baseline'] = true;

                let address = json['registeredAddress'];
                let arr = address.split(',');
                address = '';
                if (arr.length < 6) {
                    address += ',';
                }
                arr.forEach((o, i) => {
                    address += (o + (i < (arr.length - 1) ? ',' : ''));
                });
                json['registeredAddress'] = address;
                if (json.verificationRecordJson != null && typeof json.verificationRecordJson === 'object') {
                    prop['taxReferenceNumber'] = vrec['taxNumber'];
                }
                prop['registered-for-uif'] = '';
                let o = getSicFromGuid(company.company.data.industries);
                if (o != null) {
                    o = app.common.sic.getSicData(
                        o.SectionId, o.DivisionId, o.GroupId, o.Subclass, "1234567890"
                    );
                    prop['select-sic-section'] = o.section.id;
                    prop['select-sic-division'] = o.division.id;
                    prop['select-sic-group'] = o.group.id;
                    prop['select-sic-class'] = o.subClass.sic;
                    prop['select-sic-sub-class'] = o.subClass.id;

                    prop['industry'] = {
                        'Guid': o.subClass.id,
                        'Subclass': o.subClass.sic
                    };
                    json.industries = o.subClass.id;
                }
            }
            if (--counter == 0) {
                cb();
            }
        });
    }

    function translateApplications(cb) {

        function translateFinancialInfo(mc) {
            let arr = [];
            for (const name in financialInfoMap) {

                let i = 0;
                for (i = 0, max = mc.length; i < max; i++) {
                    if (name == mc[i]['name']) {
                        break;
                    }
                }
                if (i < mc.length) {
                    let value = mc[i]['value'];
                    if (name == 'businesshascolateral') {
                        if (value == 'Yes') {
                            value = '634d590a4d550ff4a17bbeae';// Other for tenand id = 2.
                            arr.push({
                                'name': 'input-value-of-collateral',
                                'value': '0'
                            });
                            arr.push({
                                'name': 'input-type-of-collateral-other',
                                'value': 'Other'
                            });
                        } else {
                            value = '634d5744765726af72f9ab54';// No collateral for tenant id = 2.
                        }
                    } else if (name == 'payrollsystems') {
                        //value = '60d19618eac92464d407fb64';//TODO: DELETE WHEN DONE TESTING!!!
                        if (value == '60d19618eac92464d407fb63' ||
                            value == '60d19618eac92464d407fb64' ||
                            value == '60d19618eac92464d407fb65' ||
                            value == '60d19618eac92464d407fb66' ||
                            value == '60d19618eac92464d407fb67') {
                            value = '60d19618eac92464d407fb6c';
                            arr.push({
                                'name': 'input-payroll-system-other',
                                'value': 'Other'
                            });
                            value = '60d19618eac92464d407fb6c';
                        }
                    }
                    arr.push({
                        'name': financialInfoMap[name],
                        'value': value
                    });
                    mc.splice(i, 1);
                } else {

                }
            }
            return arr;
        }

        function translateOwnership(mc) {
            let arr = [];
            let totalOwners = 0;
            for (const name in ownersMap) {

                let i = 0;
                for (i = 0, max = mc.length; i < max; i++) {
                    if (name == mc[i]['name']) {
                        break;
                    }
                }
                if (i < mc.length) {
                    if (name == 'numberofowners') {
                        totalOwners = parseInt(mc[i]['value']);
                    }
                    arr.push({
                        'name': ownersMap[name],
                        'value': mc[i]['value']
                    });
                    //mc.splice(i, 1);
                } else {

                }
            }
            arr.forEach((o, i) => {
                let name = o['name'];
                let value = parseInt(o['value']);
                switch (name) {
                    case 'input-percent-black-coloured-indian-pdi':
                    case 'input-percent-black-south-africans-only':
                    case 'input-percent-women-women-any-race':
                    case 'input-percent-women-black-only':
                    case 'input-percent-disabled-people':
                    case 'input-percent-youth-under-35':
                        value = (value * totalOwners) / 100;
                        o['value'] = Math.round(value);
                        break;
                }
            });


            return arr;
        }

        function translateEmployees(mc) {
            let arr = [];
            let totalEmployees = 0;
            for (const name in employeesMap) {

                let i = 0;
                for (i = 0, max = mc.length; i < max; i++) {
                    if (name == mc[i]['name']) {
                        break;
                    }
                }
                if (i < mc.length) {
                    if (employeesMap[name] == 'input-number-of-permanent-employees' ||
                        employeesMap[name] == 'input-number-of-part-time-employees') {
                        let value = parseInt(mc[i]['value']);
                        totalEmployees += value;
                    }
                    arr.push({
                        'name': employeesMap[name],
                        'value': mc[i]['value']
                    });
                    //mc.splice(i, 1);
                } else {

                }
            }
            arr.push({
                'name': 'input-total-number-of-employees',
                'value': totalEmployees.toString()
            });
            return arr;
        }

        function translateCreditScore(mc) {
            for (let i = 0, max = mc.length; i < max; i++) {
                if (mc[i].name == 'doyouknowyourpersonalcreditscore') {
                    let value = mc[i].value;
                    mc.push({
                        'name': 'input-credit-score-declaration',
                        'value': value
                    });
                    mc.splice(i, 1);
                    break;
                }
            }
        }

        let counter = fs.applications.length;
        if (counter == 0) {
            cb();
        } else {
            fs.companies.forEach((company, index) => {
                company.applications.forEach((application, index) => {
                    let json = application.data;
                    if (typeof json.propertiesJson !== 'object' || json.propertiesJson == null) {
                        if (json.propertiesJson != '' && json.propertiesJson != null) {
                            json.propertiesJson = JSON.parse(json.propertiesJson);
                        } else {
                            json.propertiesJson = {};
                        }
                    }
                    let prop = json.propertiesJson;
                    application.migrated = fs.user.migrated;//prop.hasOwnProperty('migrated-to-baseline');
                    if (application.migrated == false) {
                        prop['migrated-to-baseline'] = true;
                        if (application.data.matchCriteriaJson != null && application.data.matchCriteriaJson != '') {
                            application.data.matchCriteriaJson = JSON.parse(application.data.matchCriteriaJson);

                            let arr = translateFinancialInfo(application.data.matchCriteriaJson);
                            application.data.matchCriteriaJson = application.data.matchCriteriaJson.concat(arr);

                            arr = translateOwnership(company.company.data.propertiesJson.matchCriteriaJson);
                            application.data.matchCriteriaJson = application.data.matchCriteriaJson.concat(arr);

                            arr = translateEmployees(company.company.data.propertiesJson.matchCriteriaJson);
                            application.data.matchCriteriaJson = application.data.matchCriteriaJson.concat(arr);

                            application.data.matchCriteriaJson.push({
                                name: 'select-company-profile-bee-level',
                                value: company.company.data.beeLevel
                            });

                            let date = helpers.formatDate(company.company.data.startedTradingDate);
                            application.data.matchCriteriaJson.push({
                                name: 'date-started-trading-date',
                                value: date
                            });

                            translateCreditScore(application.data.matchCriteriaJson);
                        }
                    }
                    // TODO:
                    if (--counter == 0) {
                        cb();
                    }
                });
            });
        }
    }

    function loadUser(cb) {
        app.wizard.service.loadUserProfile((result) => {
            fs.user = { data: result.data, migrated: false };
            cb();
        });
    }

    function loadOwner(cb) {
        app.wizard.service.loadOwnerProfile((result) => {
            fs.owner = { data: result.data, migrated: false };
            ownerId = result.data.id;
            userId = result.data.userId;
            cb();
        });
    }

    function loadCompany(companyId, cb) {
        app.wizard.service.loadCompanyProfile(companyId, (result) => {
            fs.company = { data: result.data, migrated: false };
            cb();
        });
    }

    function loadApplication(applicationId, cb) {
        app.wizard.service.loadApplication(applicationId, (result) => {
            fs.application = { data: result.data, migrated: false };
            cb();
        });
    }

    function doSaves(cb) {
        saveUser(() => {
            saveOwner(() => {
                saveCompanies(() => {
                    saveApplications(() => {
                        cb();
                    });
                });
            });
        });
    }

    function doTranslations(cb) {
        translateUser(() => {
            translateOwner(() => {
                translateCompanies(() => {
                    translateApplications(() => {
                        cb();
                    });
                });
            });
        });
    }

    function doLoads(cb) {
        loadUser(() => {
            loadOwner(() => {
                loadCompanies(() => {
                    loadApplications(() => {
                        cb();
                    });
                });
            });
        });
    }

    baselineMigration.doMigration = function (cb) {
        doLoads(() => {
            doTranslations(() => {
                doSaves(() => {
                    cb();
                });
            });
        });
    }

    //doMigration(() => {
    //    alert('Migration Complete');
    //});

})(app.baselineMigration);
*/
