(function ($) {
    app.modals.ViewDocumentModal = function () {
        var docId = $('#documentId').val();
        var url = '/app/smedocuments/DownloadFile/' + docId;
        $("#sme-documents-download-btn").prop("href", url);
    };
})(jQuery);
