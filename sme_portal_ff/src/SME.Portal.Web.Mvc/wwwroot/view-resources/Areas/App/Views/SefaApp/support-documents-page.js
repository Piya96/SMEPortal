/*
"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.page == undefined) {
    app.wizard.page = {};
}

(function (page) {

    class SupportDocumentsPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Support Documents Page';
            this.programProductListId = null;
            this.allDocumentsUploaded = false;
            this.dropZone = null;
        }

        serialize() {
            return [];
        }

        validate(data, cb) {
            let result = app.wizard.addResult();
            if (this.allDocumentsUploaded == false) {
                result.status = app.wizard.Result.Fail;
                result.message = 'Please upload outstanding documents in order to continue';
            }
            cb(result);
        }

        dtoToPage(dto) {
        }

        pageToDto(dto) {
        }

        reset() {
        }

        load(args, cb) {
            this.model = args;
            this.dropZone = dropZoneControl.init(args.smeCompany.smeCompany.id, this);

            let mc = JSON.parse(args.application.application.matchCriteriaJson);
            let dto = this.helpers.nvpArrayToObject(mc);
            this.programProductListId = this.helpers.getNvpValue(dto, 'product-fit-guid', 0);
            if (this.programProductListId != '' && this.programProductListId != null) {
                this.getSefaDocumentTypesFor((result) => {
                    cb(app.wizard.addResult());
                });
            } else {
                cb(app.wizard.addResult());
            }
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            if (args.isNext == true) {
                let guid = null;
                //let guid = $('#select-funding-requirements').val();
                this.programProductListId = (guid != null && guid != '') ? guid : args.user.listId;
                this.getSefaDocumentTypesFor((result) => {
                    cb(app.wizard.addResult());
                });
            } else {
                cb(app.wizard.addResult());
            }
        }

        attention(args, cb) {
            cb(app.wizard.addResult());
        }

        toggleValidations() {
        }

        addControls() {
            $('#drop-zone-info-modal').modal({
                keyboard: true,
                show : false
            });
            $('#drop-zone-info-tooltip').on('click', (ev) => {
                $('#drop-zone-info-modal').modal('show');
            });

            this.controls['select-document-upload'] = app.control.select('select-document-upload', 'select-document-upload');

            $('#drop-zone-area').hide();
            $('#drop-zone-button').hide();
        }

        addHandlers() {
            this.controls['select-document-upload'].change((value, text) => {
                this.dropZone.enable();
                //$('#dropzone').tooltip('disable');
                $('#document-upload-heading').text(text);
                $('#drop-zone-area').show('fast');
            });
        }

        filterDocuments(arr, company) {
            let value1 = $('#select-own-or-rent-business-premises').val();
            // TODO: Make this control a class variable!!!
            let control = app.control.radio('input-existing-insurance-policies-in-place', 'radio');
            let value2 = control.val();
        }

        filterDocs(mc, company, docArr) {
            let get = app.onboard.helpers.getter(mc);
            let arr = [];
            let value1 = get.get('select-own-or-rent-business-premises');
            let value2 = get.get('input-existing-insurance-policies-in-place');
            let value3 = get.get('select-mandate-fit-reason-for-finance');
            for (let i = 0, max = docArr.length; i < max; i++) {
                let doc = docArr[i];
                if (doc.docTypeGuid == 'b968e252ef314a57ad27855fdb0a8374' && value1 != '62c444a6f6de2b13ed96bc42') {
                    continue;
                }
                if (doc.docTypeGuid == 'b0f00fe78c094351b9948054c96e3975' && value2 != 'Yes') {
                    continue;
                }
                // Trust
                if (doc.docTypeGuid == '6270ec3e0df6cb1fea9a8d2a' && company.type != '5a6ab7ea506ea818e04548b2') {
                    continue;
                }
                // Partnership.
                if (doc.docTypeGuid == '6270ec464339d62ddaac7cfb' && company.type != '5a6ab7d3506ea818e04548b0') {
                    continue;
                }
                // Buying a franchise.
                if (doc.docTypeGuid == 'c9f9684757c94cd684e2ebc603b48d3d' && value3 != '6169375bf2e88328fa1cf6c6') {
                    continue;
                }
                // Funding of Government / private sector contracts.(Optional) OR Funding for purchase orders.(Optional).
                if (doc.docTypeGuid == '2e4f9d1595834c159c14dc685fbcef14' && (value3 != '6169375bf2e88328fa1cf6cd' && value3 != '6169375bf2e88328fa1cf6cc')) {
                    continue;
                }
                if (doc.docTypeGuid == '2e4f9d1595834c159c14dc685fbcef14') {
                    doc.isRequired = false;
                }
                // Joint venture agreement if company type is Partnerships.
                if (doc.docTypeGuid == '025c94c930f645de8512751f09f05b1c') {
                    // Join venture.
                    if (company.type == '5a6ab7d3506ea818e04548b0') {
                        // Make optional.
                        doc.isRequired = false;
                    } else {
                        continue;
                    }
                }
                arr.push(doc);
            }
            return arr;
        }

        // Arguments...
        //   productFitGuid...
        //     Unique global identifier string associated with the current program product fit for which we want
        //     to retrieve a list of documents types for.
        //   companyId...
        //     Unique identifier associated with the company for which we are doing a funder application for.
        //   cb...
        //     Callback function that takes a result object, to be invoked on function completion.
        //     See wizard-common.js for details on result object.
        getUploadedDocs(mc, company, cb) {
            let self = this;
            let get = app.onboard.helpers.getter(mc);
            let productId = get.get('product-fit-guid');
            abp.services.app.documentsAppServiceExt.getAllUploadedSefaDocuments(productId, company.id).done((payload) => {
                let result = app.wizard.addResult();
                payload.sort(function (a, b) {
                    return a.name > b.name ? 1 : -1;
                });
                result.data = payload;
                cb(result);
            });
        }

        // Arguments...
        //   productFitGuid...
        //     Unique global identifier string associated with the current program product fit for which we want
        //     to retrieve a list of documents types for.
        //   cb...
        //     Callback function that takes a result object, to be invoked on function completion.
        //     See wizard-common.js for details on result object.
        getDocTypes(productFitGuid, cb) {
            abp.services.app.documentsAppServiceExt.getSefaLoanTypes(productFitGuid).done((payload) => {
                let result = app.wizard.addResult();
                result.data = payload;
                cb(result);
            });
        }

        // Arguments...
        //   uploadedDocs...
        //     Array of objects associated with the current program product fit guid, each object having the following fields...
        //       - docTypeGuid : Unique global Identifier for the associated document.
        //       - name : String describing the associated document.
        //       - hasBeenUploaded : Boolean value, true if document has been uploaded, else false.
        buildDocList(uploadedDocs) {
            let arr = [];
            let total = uploadedDocs.length;
            //this.allDocumentsUploaded = true;
            uploadedDocs.forEach((obj, idx) => {
                if (obj.hasBeenUploaded == false) {
                    arr.push({
                        value: obj.docTypeGuid,
                        text: obj.name
                    });
                } else {
                    // NOTE: This is for demo purposes only!!!
                    //this.allDocumentsUploaded = true;
                }
                if (obj.hasBeenUploaded == true || obj.isRequired == false) {
                    total--;
                }
            });
            if (total == 0) {
                this.allDocumentsUploaded = true;
            }
            this.controls['select-document-upload'].fill(arr);
            this.controls['select-document-upload'].val('');
            $('#document-upload-heading').text('');
            this.dropZone.disable();
            //$('#dropzone').tooltip('enable');
            //$("#select-document-upload").selectpicker("refresh");
        }

        clearDocList() {
            this.controls['select-document-upload'].flush();
        }

        clearDocTable(id) {
            function removeNode(root) {
                while (root.firstChild) {
                    removeNode(root.firstChild);
                    root.removeChild(root.firstChild);
                }
            }
            let root = document.getElementById(id);
            removeNode(root);
        }

        // Arguments...
        //   docArray...
        //     Array of objects associated with the current program product fit guid, each object having the following fields...
        //       - docTypeGuid : Unique global Identifier for the associated document.
        //       - name : String describing the associated document.
        //       - hasBeenUploaded : Boolean value, true if document has been uploaded, else false.
        buildDocTable(uploadedDocs) {
            let self = this;

            function addItem(root, guid, text, uploaded, required, name, templateUrl) {
                let tr = document.createElement('tr');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                let td4 = document.createElement('td');
                let td5 = document.createElement('td');

                root.appendChild(tr);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);

                let id1 = 'td-doc-' + guid;
                let id2 = 'td-required-' + guid;
                let id3 = 'td-optional-' + guid;
                let id4 = 'td-uploaded-' + guid;
                let id5 = 'td-template-' + guid;

                td1.setAttribute('id', id1);
                td2.setAttribute('id', id2);
                td3.setAttribute('id', id3);
                td4.setAttribute('id', id4);
                td5.setAttribute('id', id5);

                let icon = '&#x2689;';
                $('#' + id1).attr('style', 'border-left:1px thin green;');
                $('#' + id2).attr('style', 'border-left:1px thin green;text-align:center;');
                $('#' + id3).attr('style', 'border-left:1px thin green;text-align:center;');
                $('#' + id4).attr('style', 'border-left:1px thin green;text-align:center;');
                $('#' + id5).attr('style', 'border-left:1px thin green;border-right:1px thin green;text-align:center;');
                $('#' + id5).attr('data-guid', guid);

                if (required == true) {
                    td2.classList.add('td-fail');
                    $('#' + id2).html(icon);
                } else {
                    td3.classList.add('td-pass');
                    $('#' + id3).html(icon);
                }
                $('#' + id1).text(text);
                if (uploaded == true) {
                    td4.classList.add('td-pass');
                    $('#' + id4).html('<b>&#x2714;</b>');
                } else {
                    //$('#' + id4).html('<button type="button" class="btn btn-primary btn-sm">Upload</button>');
                }

                if (templateUrl != null && templateUrl != '') {
                    $('#' + id5).html('<a href="' + templateUrl + '"target="_blank"><i class="fa fa-download"></i></a>');
                    $('#' + id5 + ' > a > i').tooltip({
                        html: true,
                        title: name,
                        placement: 'right'
                    });
                    $('#' + id5 + ' > i').tooltip('enable');
                }

            }
            let root = document.getElementById('tbody-document-uploads');
            uploadedDocs.forEach((doc, idx) => {
                addItem(root, doc.docTypeGuid, doc.name, doc.hasBeenUploaded, doc.isRequired, doc.name, doc.templateUrl);
            });
        }

        getSefaDocumentTypesFor(cb = null) {
            self = this;
            this.model.smeCompany.smeCompany;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            mc = this.helpers.nvpArrayToObject(mc);
            this.getUploadedDocs(mc, this.model.smeCompany.smeCompany, (result) => {
                let uploadedDocs = self.filterDocs(mc, this.model.smeCompany.smeCompany, result.data);

                let docTypes = result.data;

                self.clearDocTable('tbody-document-uploads');
                self.buildDocTable(uploadedDocs);

                self.clearDocList();
                self.buildDocList(uploadedDocs);

                if (cb != null) {
                    cb(app.wizard.addResult());
                }
                self.resetDropZone();

                $('#drop-zone-area').hide('fast');
                $('#drop-zone-button').hide('fast');
            });
        }

        resetDropZone() {
            //self.dropZone.destroy();
            //self.dropZone = null;
            //self.dropZone = dropZoneControl.init(self.model.smeCompany.smeCompany.id, this);
            this.dropZone.disable();
        }

        dropZoneAction(action, args) {

            function fileAdded(file) {
                $('#drop-zone-button').show('fast');
                //$('#drop-zone-step').html('Step #3... <br/><br/> <b>Please click the button to the right to upload your select document(s)</b>');
            }

            switch (action) {
                case 'file-added':
                    fileAdded(args);
                    break;
            }
        }
    }

    page.getSupportDocumentsPage = function (id) {
        return new SupportDocumentsPage(id);
    }
})(app.wizard.page);
*/
