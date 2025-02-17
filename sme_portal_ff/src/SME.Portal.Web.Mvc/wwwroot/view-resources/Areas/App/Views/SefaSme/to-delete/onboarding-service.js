if (app.onboard == undefined) {
    app.onboard = {};
}

app.onboard.service = null;

(function (onboard) {

    /*let ownerCompaniesMock = [
        {
            "companyName": "RSN TRADING",
            "companyType": "Close Corporation",
            "status": "Conversion CO/CC or CC/CO",
            "registrationNumber": "201102309623"
        },
        {
            "companyName": "FINFIND",
            "companyType": "Private Company",
            "status": "In Business",
            "registrationNumber": "201505905207"
        },
        {
            "companyName": "MENZIES DEVELOPMENT SOLUTIONS",
            "companyType": "Close Corporation",
            "status": "Voluntary Liquidation",
            "registrationNumber": "200915683723"
        },
        {
            "companyName": "EBENEZER DESIGNS",
            "companyType": "Close Corporation",
            "status": "Conversion CO/CC or CC/CO",
            "registrationNumber": "199702947623"
        },
        {
            "companyName": "AUTHENTIC LIFE",
            "companyType": "Non Profit Company",
            "status": "Deregistration Process",
            "registrationNumber": "200800251308"
        },
        {
            "companyName": "TOUCH THE LAND",
            "companyType": "Close Corporation",
            "status": "AR Final Deregistration",
            "registrationNumber": "200805878223"
        },
        {
            "companyName": "KESWA AND TEDDER",
            "companyType": "Close Corporation",
            "status": "Deregistration Final",
            "registrationNumber": "200406723923"
        }

    ];*/

    const ServerResult = {
        Success: 0,
        Warning: 1,
        Fail: 2,
        Exception: 3
    };

    // args...
    // - identityNumber : 13 digit string.
    // - creditReport : either null or pointer to credit report json object.
    // - status : for testing purposes when we want to force a fail, else null.
    // cb...
    // - Callback taking the following parameters...
    //   - result
    //   - person
    function ValidatePerson(args, cb) {
        KTApp.blockPage({
            overlayColor: 'blue',
            opacity: 0.1,
            state: 'primary',
            message: app.localize('VerifyId')
        });
        let status = AddStatus();
        let regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))/
        if (regex.test(args.identityNumber) == false) {
            status.result = Result.Fail;
            status.code = 5;
            status.message = app.localize('InvalidId');
            cb(status, null);
        } else {
            function validatePayload(status, person) {
                if (person.IDExists == false || person.Country != 'South Africa') {
                    status.result = Result.Fail;
                    status.code = 1;
                    status.message = app.localize('InvalidId');
                    return false;
                }
                return true;
            }

            if (args.creditReport == null) {
                abp.services.app.cPB.personValidationBy(args.identityNumber).done(function (result) {
                    KTApp.unblockPage();
                    let person = JSON.parse(result).People[0];
                    validatePayload(status, person);
                    cb(status, person);
                });
            } else {
                KTApp.unblockPage();
                let person = args.creditReport.Person.People[0];
                validatePayload(status, person);
                cb(status, person);
            }
        }
    }

    function GetMobileNumbersById(identityNumber, creditReport, cb) {

        if (creditReport == null) {
            abp.services.app.cCR.getTelephoneById(identityNumber).done(function (output) {

                let status = {
                    result: false,
                    message: 'Unknown error',
                    data: null
                };

                function success(output) {
                    let data = JSON.parse(output.data);
                    let temp = data.Telephones.filter(function (arg) {
                        return (
                            arg.TelType == 'Cell'
                        );
                    });
                    function compare(a, b) {
                        let _a = parseInt(a.Score);
                        let _b = parseInt(b.Score);
                        return _a < _b ? 1 : -1;
                    }
                    temp.sort(compare);

                    let arr = [];
                    for (let i = 0, max = temp.length; i < max; i++) {
                        arr.push({ key: temp[i].TelNumber, text: temp[i].TelNumber });
                    }

                    function foundAtLeastOnMobileNumber(arr) {
                        status.result = true;
                        status.message = "Ok";
                        status.data = arr;
                    }

                    function foundNoMobileNumbers() {
                        status.message = "Identity number entered not linked to any mobile numbers";
                    }

                    if (arr.length > 0) {
                        foundAtLeastOnMobileNumber(arr);
                    } else {
                        foundNoMobileNumbers();
                    }
                }

                switch (output.result) {
                    case ServerResult.Success:
                        success(output);
                        break;

                    case ServerResult.Fail: case ServerResult.Exception:
                        status.message = output.message;
                        break;
                }
                cb(status);
            });
        } else {
            let status = {
                result: false,
                message: 'Unknown error',
                data: null
            };

            function success(creditReport) {
               
                let temp = creditReport.Telephones.Telephones.filter(function (arg) {
                    return (
                        arg.TelType == 'Cell'
                    );
                });
                function compare(a, b) {
                    let _a = parseInt(a.Score);
                    let _b = parseInt(b.Score);
                    return _a < _b ? 1 : -1;
                }
                temp.sort(compare);

                let arr = [];
                for (let i = 0, max = temp.length; i < max; i++) {
                    arr.push({ key: temp[i].TelNumber, text: temp[i].TelNumber });
                }

                function foundAtLeastOnMobileNumber(arr) {
                    status.result = true;
                    status.message = "Ok";
                    status.data = arr;
                }

                function foundNoMobileNumbers() {
                    status.message = "Identity number entered not linked to any mobile numbers";
                }

                if (arr.length > 0) {
                    foundAtLeastOnMobileNumber(arr);
                } else {
                    foundNoMobileNumbers();
                }
            }
            success(creditReport);
            //switch (output.result) {
            //    case ServerResult.Success:
            //        success(output);
            //        break;
            //
            //    case ServerResult.Fail: case ServerResult.Exception:
            //        status.message = output.message;
            //        break;
            //}
            cb(status);
        }


    }
    // Description...
    //   - Given an identity number, returns an array of companies owned by the associated owner.
    // Return...
    //   - Array of company objects.
    //     {
    //       companyName: '',
    //       companyType : '',
    //       registrationNumber : '',
    //       status : ''
    //     }

    const REGISTERED_NOT_LISTED = 'RegisteredNotListed';
    const NOT_REGISTERED = 'NotRegistered';

    function getOwnerCompanies(identityNumber, cb) {
        abp.services.app.cPB.cipcDirectorsBy(identityNumber).done(function (result) {
            let arr = JSON.parse(result);
            //arr = ownerCompaniesMock;
            // TODO: Dont forget to add more unique company types.
            arr.push({
                companyName: NOT_REGISTERED,
                companyType: '',
                status: '',
                registrationNumber: ''
            });

            let status = AddStatus();
            status.code = arr.length > 0 ? 0 : 1;
            if (cb != null) {
                cb(status, arr);
            }
        });
    }

    // Description...
    //   - Given a company registration number, returns object with associated company details.
    // Return...
    //   - Company details json object.
    //     {
    //       addressLine1 : '',
    //       addressLine2 : '',
    //       areaCode : '',
    //       city : '',
    //       companyRegistrationType : '',
    //       companyTypeCode : '',
    //       directors : [
    //           age : 0,
    //           dateOfBirth : '',
    //           firstNames : '',
    //           gender : '',
    //           idNumber : '',
    //           surname : ''
    //       ],
    //       enterpriseName : '',
    //       province : '',
    //       registrationDate : '',
    //       sicCode : '',
    //       sicCodeDescription : '',
    //     }
    function getCompanyDetails(registrationNumber, cb) {
        abp.services.app.cPB.cipcEnterprisesBy(registrationNumber).done(function (result) {
            let obj = null;
            let temp = JSON.parse(result);
            let status = AddStatus();
            if (temp.hasOwnProperty('InnerException') == true) {
                status.result = Result.Fail;
            } else {
                obj = temp;
            }
            if (cb != null) {
                cb(status, obj);
            }
        });
    };

    // Description...
    //   - Given a user, returns an array of companies that have been added by the user.
    function getUserCompanies(cb) {
        abp.services.app.smeCompaniesAppServiceExt.getSmeCompaniesForViewByUser().done(function (result) {
            cb(AddStatus(), result);
        });
    };

    function getAvailableCompanies(id, cb) {
        let getCount = 2;

        let userCompanies = null;
        let ownerCompanies = null;

        function generateAvailableCompanies() {
            let availableCompanies = [];
            ownerCompanies.forEach((obj, idx) => {
                let ownerRegistrationNumber = obj.registrationNumber;
                let found = false;
                userCompanies.find((obj, idx) => {
                    let userRegistrationNumber = obj.smeCompany.registrationNumber.replace(/\//g, '');
                    if (userRegistrationNumber == ownerRegistrationNumber) {
                        found = true;
                        return true;
                    }
                });
                if (found == false) {
                    availableCompanies.push(obj);
                }
            });
            return availableCompanies;
        }

        function getDone() {
            if (--getCount == 0) {
                let availableCompanies = generateAvailableCompanies();
                let status = AddStatus();
                cb(status, availableCompanies);
            }
        }

        getUserCompanies((result, payload) => {
            userCompanies = payload;
            getDone();
        });

        getOwnerCompanies(id, (result, payload) => {
            ownerCompanies = payload;
            getDone();
        });
    }

    // Description...
    //   - Given a company id, returns an associated company json object.
    function getUserCompany(companyId, cb) {
        let input = {
            id: companyId
        };
        abp.services.app.smeCompaniesAppServiceExt.getSmeCompanyForEdit(input).done(function (result) {
            let status = AddStatus();
            let dto = result;
            if (dto != null && dto.smeCompany != null) {

            } else {
                status.result = Result.Fail;
            }
            cb(status, dto);
        });
    };

    // Description...
    //   - Given a company id, returns an associated company json object.
    function doesCompanyExist(registrationNumber, cb) {
        let input = {
            registrationNumber: registrationNumber
        };
        abp.services.app.smeCompaniesAppServiceExt.doesCompanyExist(input).done(function (result) {
            let status = AddStatus();
            let dto = result;
            cb(status, dto);
        });
    };

    // Description...
    //   - Updates the funder-search part of onboarding.
    function updateFunderSearch(cb, ownerId) {
        let companyDto = app.onboard.company.getDto(ownerId);
        if (companyDto != null) {
            let propObj = JSON.parse(companyDto.propertiesJson);
            let businessOwners = [];
            app.onboard.businessOwners.formToDto(businessOwners);
            let employees = [];
            app.onboard.employees.formToDto(employees);
            propObj.matchCriteriaJson = [];
            propObj.matchCriteriaJson = businessOwners.concat(employees);
            companyDto.propertiesJson = JSON.stringify(propObj);
            let status = AddStatus();
            abp.services.app.smeCompaniesAppServiceExt.createOrEdit(companyDto).done(function (result) {
                cb(status);
            });
        } else {
            status.result = Result.Fail;
            status.message = 'Invalid Company Dto ( null )';
            cb(status);
        }
    };

    // ------------------------------------------------------------------------------------------------- //
    // args...
    //   - idNumber
    //   - firstName
    //   - lastName

    // cb ( function callback passed in by caller )...
    //   - status
    //   - payload
    // eg: cb(status, payload)
    function GetCreditReport(args, cb) {
        KTApp.blockPage({
            overlayColor: 'blue',
            opacity: 0.1,
            state: 'primary',
            message: 'Performing background tasks...'
        });
        let input = {
            identityNumber: args.idNumber,
            dob: smec.dobFromId(args.idNumber),
            firstName: args.firstName,
            surname: args.lastName,
            enquiryReason: 'User Enquiry',
            enquiryDoneBy: 'User',
            updateIfAllowed: true
        };
        abp.services.app.cCR.getReportById(input).done(function (output) {
            let status = AddStatus();
            let payload = null;
            if (output != null) {
                switch (output.result) {
                    case ServerResult.Success:
                        payload = JSON.parse(output.data.creditReport.creditReportJson);
                        break;

                    case ServerResult.Fail:
                        status.result = Result.Fail;
                        status.code = 2;
                        status.message = output.message;
                        break;

                    case ServerResult.Exception:
                        status.result = Result.Fail;
                        status.code = 3;
                        status.message = output.message;
                        break;
                }
            } else {
                status.result = Result.Fail;
                status.code = 1;
                status.message = 'GetReportEx returned null payload';
            }
            KTApp.unblockPage();
            cb(status, payload);
        });
    }

    function VerifyMobileAgainstId(id, mobile, cb) {
        //if (mobile == '0829999999') {
        //    setTimeout( () => {
        //        cb(AddStatus());
        //    }, 1000);
        //} else {
            abp.services.app.cPB.telephoneExistsForId(id, mobile).done(function (output) {
                let status = AddStatus();
                if (output == false) {
                    status.result = Result.Fail;
                }
                cb(status);
            });
        //}
    }

    onboard.service = {
        getMobileNumbersById: GetMobileNumbersById,
        getAvailableCompanies: getAvailableCompanies,
        getOwnerCompanies: getOwnerCompanies,
        getCompanyDetails: getCompanyDetails,
        getUserCompanies: getUserCompanies,
        getUserCompany: getUserCompany,
        doesCompanyExist: doesCompanyExist,
        updateFunderSearch: updateFunderSearch,
        getCreditReport: GetCreditReport,
        validatePerson: ValidatePerson,
        verifyMobileAgainstId: VerifyMobileAgainstId
    };

})(app.onboard);
