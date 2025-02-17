(function () {
    $(function () {

        "use strict";

        function myParamName() {
            return "Files";
        }

        function init(dropZoneDiv, docType, submitBtn, smeCompanySelect) {

            $('#' + dropZoneDiv).dropzone({
                paramName: myParamName,
                autoProcessQueue: false,
                uploadMultiple: true,
                parallelUploads: 10,
                maxFiles: 3,
                url: "/UploadFiles", // url here to save file
                maxFilesize: 5,//max file size in MB,
                addRemoveLinks: true,
                dictResponseError: 'Server not Configured',
                acceptedFiles: ".pdf",// use this to restrict file type
                init: function () {
                    var self = this;
                    // config
                    self.options.addRemoveLinks = true;
                    self.options.dictRemoveFile = "Delete";
                    //New file added
                    self.on("addedfile", function (file) {
                        console.log('new file added ', file);
                        //$('.dz-success-mark').hide();
                        //$('.dz-error-mark').hide();



                    });
                    // Send file starts
                    self.on("sending", function (file, response, formData) {
                        console.log('upload started', file);
                        formData.append('DocumentType', $('#' + docType).val());
                        formData.append('SmeCompanyId', $('#' + smeCompanySelect).val());
                        //$('.meter').show();
                    });

                    this.on("sendingmultiple", function (file, response, formData) {
                        console.log('upload started', file);
                        //$('.meter').show();
                    });

                    // File upload Progress
                    self.on("totaluploadprogress", function (progress) {
                        console.log("progress ", progress);
                        //$('.roller').width(progress + '%');
                    });

                    self.on("queuecomplete", function (progress) {
                        showAlert()

                        setTimeout(hideAlert, 2000);

                        //$('.meter').delay(999).slideUp(999);
                    });

                    self.on("successmultiple", function (files, response) {
                        // Gets triggered when the files have successfully been sent.
                        // Redirect user or notify of success.

                    });

                    // On removing file
                    self.on("removedfile", function (file) {
                        console.log(file);
                    });

                    $('#' + submitBtn).on("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        // Validate form here if needed

                        if (self.getQueuedFiles().length > 0) {
                            self.processQueue();
                        } else {
                            self.uploadFiles([]);
                        }

                    });
                }

            });
        }

        init('StatementOfAssetsAndLiabilities-dropzone', 'DocumentTypeStatementOfAssetsAndLiabilities', 'StatementOfAssetsAndLiabilities-submit','StatementOfAssetsAndLiabilities-smecompanyselector')

        function showAlert() {
            $('#id-alert').modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        }
        function hideAlert() {
            $('#id-alert').modal('hide');
        }
    })
})();