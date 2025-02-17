//(function () {
    function downloadFunderSearchSummary(companyId, applicationId, controller = 'FinfindFunderSearch') {
        function downloadPDF(cb) {
            let data = {
                html: "",
                name: "",
                companyId: companyId,
                applicationId: applicationId
            };
            let status = AddStatus();
            $.ajax({
                url: '/App/' + controller + '/FunderSearchSummaryPdfAJAX',
                //url: '/App/FunderSearch/FunderSearchSummaryPdfAJAX',
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (data) {
                    if (cb != null && data != null) {
                        cb(status, data.result);
                    } else {

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

        KTApp.blockPage({
            overlayColor: 'blue',
            opacity: 0.1,
            state: 'primary',
            message: app.localize('FA_SavingSummaryToPDF')
        });

        let topId = '#id-funder-search-save-to-pdf-top-' + applicationId;
        let bottomId = '#id-funder-search-save-to-pdf-bottom-' + applicationId;

        $(topId).hide();
        $(bottomId).hide();
        $(topId).prop('disabled', true);
        $(bottomId).prop('disabled', true);
        downloadPDF(function (status, result) {
            if (status.result == Result.Pass) {
                let byteChars = atob(result.bytes);
                smec.downloadBinary(byteChars, result.fileName);
            }
            $(topId).prop('disabled', false);
            $(bottomId).prop('disabled', false);
            $(topId).show();
            $(bottomId).show();
            KTApp.unblockPage();
        });
    }

function downloadFunderSearchSummaryHtml(companyId, applicationId, html, cb, local = true) {
    function downloadPDF(cb) {
        let data = {
            html: html,
            name: "",
            companyId: companyId,
            applicationId: applicationId
        };
        let status = AddStatus();
        $.ajax({
            //url: '/App/FunderSearch/FunderSearchSummaryPdfAJAXHtml',
            url: '/App/ECDCFunderSearch/FunderSearchSummaryPdfAJAX',
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

    KTApp.blockPage({
        overlayColor: 'blue',
        opacity: 0.1,
        state: 'primary',
        message: app.localize('FA_SavingSummaryToPDF')
    });

    let topId = '#id-funder-search-save-to-pdf-top-' + applicationId;
    let bottomId = '#id-funder-search-save-to-pdf-bottom-' + applicationId;

    $(topId).hide();
    $(bottomId).hide();
    $(topId).prop('disabled', true);
    $(bottomId).prop('disabled', true);
    downloadPDF(function (status, result) {
        let res = app.wizard.addResult();
        if (status.result == Result.Pass) {
            let byteChars = atob(result.bytes);
            if (local == true) {
                let byteArray = smec.downloadBinary(byteChars, result.fileName);
            }
            res.data = result.bytes;
        }
        $(topId).prop('disabled', false);
        $(bottomId).prop('disabled', false);
        $(topId).show();
        $(bottomId).show();
        KTApp.unblockPage();

        cb(res);
    });
}

function getFunderSearchSummaryBase64(
    controller,
    companyId,
    applicationId,
    cb
) {
    function downloadPDF(cb) {
        let data = {
            html: "",
            name: "",
            companyId: companyId,
            applicationId: applicationId
        };
        $.ajax({
            url: '/App/' + controller + '/FunderSearchSummaryPdfAJAX',
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                let result = app.wizard.addResult();
                if (cb != null && data != null) {
                    result.data = data.result.bytes;
                } else {
                    result.status = app.wizard.Result.Fail;
                }
                cb(result);
            },
            error: function (data) {
                let result = app.wizard.addResult();
                result.status = app.wizard.Result.Fail;
                if (cb != null) {
                    cb(result);
                }
            },
            complete: function () {
            }
        });
    }

    KTApp.blockPage({
        overlayColor: 'blue',
        opacity: 0.1,
        state: 'primary',
        message: app.localize('FA_SavingSummaryToPDF')
    });

    downloadPDF((result) => {
        KTApp.unblockPage();
        cb(result);
    });
}

//})();
