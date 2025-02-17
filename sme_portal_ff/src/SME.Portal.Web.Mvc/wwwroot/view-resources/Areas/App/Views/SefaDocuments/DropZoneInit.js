var dropZoneControl = function () {

    const DZMaxFileSize = 14680064;
    const DZExceededMaxFileSize_li = "<p> - File size is to large</p>";
    const DZInvalidFileExtension_li = "<p> - Invalid or unsupported file type selected</p>";

    const DZExceededMaxFileSize = DZExceededMaxFileSize_li;
    const DZInvalidFileExtension = DZInvalidFileExtension_li;
    const DZExceededMaxFileSizeANDInvalidFileExtension = DZExceededMaxFileSize_li + DZInvalidFileExtension_li;

    function init(smeCompanyId, supportDocumentWizardPage) {
        return initUpload(smeCompanyId, supportDocumentWizardPage);
    }

    function myParamName() {
        return "Files";
    }

    function initUpload(smeCompanyId, supportDocumentWizardPage) {
        let fileTypes = ['.bmp', '.gif', '.jpeg', '.jpg', '.xls', '.xlsx', '.doc', '.docx', '.pdf', '.png', '.pptx', '.ppt'];

        return new Dropzone('#dropzone', {
            paramName: myParamName,
            autoProcessQueue: false,
            uploadMultiple: true,
            parallelUploads: 10,
            maxFiles: 40,
            url: "/SefaDocuments/UploadFiles", // url here to save file
            maxFilesize: 15,//max file size in MB,
            addRemoveLinks: true,
            dictResponseError: 'Server not Configured',
            acceptedFiles: fileTypes.join(',') + 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            createImageThumbnails : false,
            init: function () {
                var self = this;
                // config
                self.options.addRemoveLinks = true;
                self.options.dictRemoveFile = "Delete";
                //New file added
                self.on("addedfile", function (file) {
                    let arr = file.upload.filename.split('.');
                    let ext = '.' + arr[arr.length - 1];

                    let exceededMaxFileSize = file.size > DZMaxFileSize;
                    let validExtension = fileTypes.includes(ext);
                    let error = null;
                    if (exceededMaxFileSize == true && validExtension == false) {
                        error = DZExceededMaxFileSizeANDInvalidFileExtension;
                    } else if (exceededMaxFileSize == true) {
                        error = DZExceededMaxFileSize;
                    } else if (validExtension == false) {
                        error = DZInvalidFileExtension;
                    }

                    console.log('new file added ', file);

                    if(error != null) {
                    
                        Swal.fire({
                            html: error,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            },
                            width: 'auto'
                        })
                    
                        self.removeFile(file);
                    }
                    else {
                        supportDocumentWizardPage.dropZoneAction('file-added', file);
                    }
                    //$('.dz-success-mark').hide();
                    //$('.dz-error-mark').hide();
                });
                // Send file starts
                self.on("sending", function (file, response, formData) {
                    console.log('upload started', file);
                    //let documentTypeInput = self.element.querySelector("input[type=hidden]");
                    var cc = $('#select-document-upload');
                    formData.append('DocumentType', $('#select-document-upload').val());
                    formData.append('SmeCompanyId', smeCompanyId);
                    //$('.meter').show();
                });

                self.on("sendingmultiple", function (file, response, formData) {
                    console.log('upload started', file);
                    //$('.meter').show();
                });

                // File upload Progress
                self.on("totaluploadprogress", function (progress) {
                    console.log("progress ", progress);
                    //$('.roller').width(progress + '%');
                });

                self.on("queuecomplete", function (progress) {

                    //$('.meter').delay(999).slideUp(999);
                });

                self.on("successmultiple", function (files, response) {
                    // Gets triggered when the files have successfully been sent.
                    // Redirect user or notify of success.
                    supportDocumentWizardPage.getSefaDocumentTypesFor();
                    showAlert()
                });

                self.on("success", function (file, response) {
                    // Gets triggered when the files have successfully been sent.
                    // Redirect user or notify of success.
                    //supportDocumentWizardPage.getSefaDocumentTypesFor();
                    //showAlert()
                    self.removeFile(file);
                });

                // On removing file
                self.on("removedfile", function (file) {
                    console.log(file);
                });

                self.element.parentElement.parentElement.querySelector("button[type=submit]").addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Validate form here if needed

                    if (self.getQueuedFiles().length > 0) {
                        self.processQueue();
                    } else {
                        self.uploadFiles([]);
                    }
                })
            }

        });
    }

    function showAlert() {
        Swal.fire({
            'text': 'File(s) uploaded',
            icon: "info",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light"
            }
        }).then(function () {
        });
        //$('#id-alert').modal({
        //    backdrop: 'static',
        //    keyboard: false,
        //    show: true
        //});
    }
    function hideAlert() {
        $('#id-alert').modal('hide');
    }

    document.getElementById('id-alert-button-ok').onclick = function () {
        hideAlert()
        //location.href = '/App/SefaDocuments/Manage';
    };

    return {
        init: init
    };

}();