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

    let ServerResult = {
        Success: 0,
        Warning: 1,
        Fail: 2,
        Exception: 3
    };

    function GetMobileNumbersById(identityNumber, cb) {

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
    function getOwnerCompanies(identityNumber, cb) {
        abp.services.app.cPB.cipcDirectorsBy(identityNumber).done(function (result) {
            let arr = JSON.parse(result);
            //arr = ownerCompaniesMock;
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

    onboard.service = {
        getMobileNumbersById: GetMobileNumbersById,
        getOwnerCompanies: getOwnerCompanies,
        getCompanyDetails: getCompanyDetails,
        getUserCompanies: getUserCompanies,
        getUserCompany: getUserCompany,
        doesCompanyExist: doesCompanyExist,
        updateFunderSearch: updateFunderSearch,
        verifyMobileAgainstId: VerifyMobileAgainstId
    };

})(app.onboard);
