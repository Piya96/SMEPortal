(function ($) {
    app.modals.ViewDocumentModal = function () {
        var docId = $('#documentId').val();
        var url = '/app/documents/DownloadFile/' + docId;
        $("#sme-documents-download-btn").prop("href", url);
    };
})(jQuery);
