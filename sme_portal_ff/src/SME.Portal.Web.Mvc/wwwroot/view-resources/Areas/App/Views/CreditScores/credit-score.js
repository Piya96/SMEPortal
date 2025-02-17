//const SMECreditScoreTestId = null;//"7608315123086";
//function SMECreditScore(
//    identityNumber,
//    serviceCallback
//) {
//    let spinner = new smec.spinner(
//        'id-credit-score-loading-div',
//        'id-credit-score-loading-anim-div',
//        'id-credit-score-loading-header'
//    );
//
//    function toggleAnchor(anchorId, enable) {
//        let elem = document.getElementById(anchorId);
//        if (elem != null) {
//            elem.style['pointer-events'] = enable == false ? 'none' : 'initial';
//        }
//    }
//
//    $('#id-credit-score-get-a').on('click', function (arg) {
//
//        let input = {
//            identityNumber: identityNumber
//        };
//        input.identityNumber = SMECreditScoreTestId == null ? identityNumber : SMECreditScoreTestId;
//        input.updateIfAllowed = true;
//        toggleAnchor('id-credit-score-get-a', false);
//
//        spinner.show(app.localize('CCSBusyRetrievingSpinnerText'));
//        abp.services.app.cCS.getScore(input).done(function (output) {
//
//            function dataCB(output) {
//                spinner.hide();
//                if (output != null) {
//                    if (swal.isVisible() == true) {
//                        swal.close();
//                    }
//                    swal.fire({
//                        icon: "success",
//                        title: app.localize('CCSInfoScorePopupText'),
//                        text: output.data.creditScore.score,
//                        confirmButtonText: "Ok, got it!",
//                        allowOutsideClick: false,
//                        allowEscapeKey: false,
//                        showConfirmButton: true
//                    }).then(function () {
//                        toggleAnchor('id-credit-score-get-a', false);
//                        $('#id-credit-score-get-a').html(
//                            "<i class='flaticon-list'></i>" +
//                            app.localize('CCSInfoScoreButtonText') +
//                            output.data.creditScore.score
//                        );
//                        if (serviceCallback != null) {
//                            serviceCallback(true, 'GetScore', output);
//                        }
//                    });
//                }
//            }
//            window.setTimeout(function () {
//                dataCB(output);
//            }, 2500);
//        });
//    });
//    let userId = app.common.input.numeric('consumer-credit-input-id', 13);
//}
