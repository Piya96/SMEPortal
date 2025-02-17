if (typeof sme == 'undefined') {
    var sme = {};
}

if (typeof sme.validate == 'undefined') {
    sme.validate = {};
}

sme.validate.id = {
    verify: function (id, firstNameId, lastNameId, creditReport, fail, cb) {

        let testFail = fail;

        let regex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))/
        if (regex.test(id) == false) {
            sme.swal.error(app.localize('InvalidId'), null, true);
            let status = AddStatus();
            status.result = Result.Fail;
            cb(true, status, null);
            return;
        }

        let firstName = $(firstNameId).val();
        let lastName = $(lastNameId).val();

        function validateIdResult(person) {
            function handleFail(status) {
                if (status.code == 1) {
                    //sme.swal.error('Not a South African Citizen', null, true);
                } else {
                    sme.swal.error(app.localize('InvalidId'), null, true);
                }
            }

            function handleWarningUpdated(status, person, cb, jsonBlob) {
                if (swal.isVisible() == true) {
                    swal.close();
                }
                swal.fire({
                    icon: 'warning',
                    text: app.localize('NameMismatchAction'),
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    allowOutsideClick: false,
                    allowEscapeKey: escape,
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light"
                    }
                }).then(function () {
                    $(firstNameId).val(person.FirstName);
                    $(lastNameId).val(person.Surname);
                    cb(true, status, jsonBlob);
                });
                status.result = Result.Pass;
            }

            function getStatus(person) {
                let status = AddStatus();
                if (testFail == true) {
                    person.Country = 'Angolan';
                }
                if (person.Country != 'South Africa') {
                    status.result = Result.Fail;
                    status.code = 1;
                    status.message = 'Not a South African Citizen';
                    return status;
                }

                if (person.IDExists == false) {
                    status.result = Result.Fail;
                    status.code = 0;
                    status.message = app.localize('InvalidId');
                    return status;
                }
                if (firstName.length > 0 || lastName.length > 0) {
                    if (person.FirstName.toLowerCase() != firstName.toLowerCase() || person.Surname.toLowerCase() != lastName.toLowerCase()) {
                        status.result = Result.WarningUpdated;
                        status.code = 0;
                        status.message = app.localize('NameMismatchError');
                        return status;
                    }
                }
                return status;
            }

            // --- TODO: Check http return and check for exception!
            function makeTCase(field) {
                return (field.charAt(0).toUpperCase() + field.substr(1).toLowerCase());

            }

            //let data = JSON.parse(result);
            let http = true;//data.http_code == '200';

            person.FirstName = makeTCase(person.FirstName);
            person.Surname = makeTCase(person.Surname);
            let str = JSON.stringify(person);
            let status = getStatus(person);

            switch (status.result) {
                case Result.Fail:
                    handleFail(status);
                    break;

                case Result.WarningUpdated:
                    handleWarningUpdated(status, person, cb, str);
                    return;
            }
            cb(http, status, str);
        }

        function validateId_Production() {
            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: app.localize('VerifyId')
            });
            if (creditReport == null) {
                abp.services.app.cPB.personValidationBy(id).done(function (result) {
                    KTApp.unblockPage();
                    let person = JSON.parse(result).People[0];
                    validateIdResult(person);
                });
            } else {
                KTApp.unblockPage();
                let person = creditReport.Person.People[0];
                validateIdResult(person);
            }
        }

        function validateId_Development() {
            let obj = {
                People: [
                    {
                        InputIDNumber: "7608315123086",
                        IDNumber: "7608315123086",
                        ConsumerHashID: "Av6ZnpBQFCUPyl+aPJtp/A==",
                        Passport: "483919916",
                        FirstName: "JOE",
                        SecondName: "WEDNESDAY",
                        ThirdName: "THOR",
                        Surname: "SOAP",
                        MaidenName: "",
                        DateOfBirth: "2000-01-01",
                        Age: 40,
                        AgeBand: "40 to 50",
                        Title: "MR",
                        IsMinor: false,
                        InputIDPassedCDV: true,
                        IDExists: true,
                        Gender: "Male",
                        MarriageDate: "Unknown",
                        MaritalStatus: "Married",
                        Score: 200,
                        Country: "South Africa",
                        Source: "DHA",
                        OriginalSource: "DHA",
                        LatestDate: "2020-02-03",
                        UsingDHARealtime: false,
                        Reference: "TEST",
                        _Cached: false
                    }
                ],
                TotalRecords: 1,
                TotalReturnedRecords: 1,
                status_message: "OK",
                bh_response_code: "000",
                http_code: "200",
                request_reference: "11111111-2222-3333-4444-555555555555"
            };

            validateIdResult(JSON.stringify(obj));
        }

        if (id == '1111112222080') {
            validateId_Development(); 
        } else {
            validateId_Production()
        }
    }
};

