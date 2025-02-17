//const SMECreditReportTestId = null;//"7608315123086";
//
//function SMECreditReport(
//    identityNumber,
//    firstName,
//    surname,
//    serviceCallback
//) {
//    let spinner = new smec.spinner(
//        'id-credit-report-loading-div',
//        'id-credit-report-loading-anim-div',
//        'id-credit-report-loading-header'
//    );
//
//    function toggleAnchor(anchorId, enable) {
//        let elem = document.getElementById(anchorId);
//        if (elem != null) {
//            elem.style['pointer-events'] = enable == false ? 'none' : 'initial';
//        }
//    }
//
//    function getInputArgs(updateIfAllowed) {
//        let input = {
//            identityNumber: identityNumber,
//            dob: '',
//            firstName: firstName,
//            surname: surname,
//            enquiryReason: 'Finfind App',
//            enquiryDoneBy: (firstName + ' ' + surname)
//        };
//        input.firstName = firstName;
//        input.surname = surname;
//        input.identityNumber = SMECreditReportTestId == null ? identityNumber : SMECreditReportTestId;
//        input.dob = smec.dobFromId(input.identityNumber);
//        input.updateIfAllowed = updateIfAllowed;
//        return input;
//    }
//
//    let downloadReport = false;
//    $('#id-credit-report-get-a').on('click', function (arg) {
//
//        function updateCreditReport() {
//            let input = getInputArgs(true);
//
//            toggleAnchor('id-credit-report-get-a', false);
//            spinner.show(app.localize('CCRBusyRetrievingSpinner'));
//            abp.services.app.cCR.getCreditReportByUser(input).done(function (output) {
//                function dataCB(output) {
//                    spinner.hide();
//                    toggleAnchor('id-credit-report-get-a', true);
//                    if (output != null) {
//                        $('#id-credit-report-get-a').html(
//                            '<i class="flaticon-list"></i>' +
//                            app.localize('CCRActionDownloadPDF')
//                        );
//                        if (serviceCallback != null) {
//                            serviceCallback(true, 'GetCreditReportByUser', output);
//                        }
//                    }
//                }
//                window.setTimeout(function () {
//                    dataCB(output);
//                }, 1500);
//            });
//        }
//
//        function downloadCreditReport() {
//            toggleAnchor('id-credit-report-get-a', false);
//            spinner.show(app.localize('CCRBusyDownloadingSpinner'));
//            let input = getInputArgs(true);
//            abp.services.app.cCR.getReport(input).done(function (output) {
//                function dataCB(output) {
//                    spinner.hide();
//                    if (output != null) {
//                        if (serviceCallback != null) {
//                            let obj = JSON.parse(output.data.creditReport.creditReportJson);
//                            let byteChars = atob(obj.EncodedPDF);
//                            smec.downloadBinary(byteChars, 'credit-report.pdf');
//                            serviceCallback(true, 'GetReport', output);
//                        }
//                        downloadReport = true;
//                        $('#id-credit-report-get-a').html(
//                            '<i class="flaticon-list"></i>' +
//                            app.localize('CCRActionDownloadPDF')
//                        );
//                    }
//                    toggleAnchor('id-credit-report-get-a', false);
//                }
//                window.setTimeout(function () {
//                    dataCB(output);
//                }, 1500);
//            });
//        }
//
//            downloadCreditReport();
//    });
//}
