"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.minRequirements == undefined) {
    app.wizard.minRequirements = {};
}

if (app.wizard.minRequirements.page == undefined) {
    app.wizard.minRequirements.page = {};
}

(function (page) {

    class MinRequirementsPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Min Requirements Page';
            this.uploadDocs = null;
            this.activeGuid = null;
            this.productGuid = '';
            this.uploadedAll = false;
        }

        remap(nvp, cb) {
            let arr = [];
            if (this.uploadDocs != null) {
                this.uploadDocs.forEach((doc, idx) => {
                    if (doc.hasBeenUploaded == true) {
                        arr.push({
                            name: 'document',
                            value: doc.name
                        });
                    }
                });
            }
            return arr;
        }

        dtoToPage(dto) {
            super.dtoToPage(dto);
            let self = this;
            this.docCheck = null;
        }

        load(args, cb) {
            let self = this;
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            this.dto = this.helpers.nvpArrayToObject(mc);
            this.dropZone = dropZoneControl.initEx(args.smeCompany.smeCompany.id, this, 12, 12);

            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            this.dto = this.helpers.nvpArrayToObject(mc);
            this.productGuid = this.helpers.getPropEx(this.dto, 'product-fit-guid', '');
            let self = this;
            let count = 1;
            function complete() {
                if (--count == 0) {
                    cb(app.wizard.addResult());
                }
            }

            this.getDocuments((result) => {
                complete();
            });
        }

        neglectHidden(args, cb) {
            let self = this;
            self.helpers.clearTable('div-doc-uploads');
            cb(app.wizard.addResult());
        }

        neglect(args, cb) {
            let self = this;
            cb(app.wizard.addResult());
        }

        validate(data, cb) {
            let result = app.wizard.addResult();
            if (this.uploadedAll == false) {
                result.status = app.wizard.Result.Fail;
                result.message = 'Please upload outstanding documents in order to continue';
            }
            cb(result);
        }

        addControls() {
        }

        addHandlers() {
            let self = this;
        }

        deleteDoc(guid, cb) {
            let self = this;

            function enumDocs(cb) {
                abp.services.app.documentsAppServiceExt.enumDocs(guid, self.model.smeCompany.smeCompany.id).done((payload) => {
                    let result = app.wizard.addResult();
                    result.data = payload;
                    cb(result);
                });
            }

            function deleteDocs(docs, index, cb) {
                if (index < docs.length) {
                    abp.services.app.documentsAppServiceExt.deleteDocById(docs[index].id).done((payload) => {
                        deleteDocs(docs, index + 1, cb);
                    });
                } else {
                    self.getDocuments((result) => {
                        KTApp.unblockPage();
                        cb(result);
                    });
                }
            }

            KTApp.blockPage({
                overlayColor: 'blue',
                opacity: 0.1,
                state: 'primary',
                message: 'Deleting document...'
            });
            enumDocs((result) => {
                deleteDocs(result.data, 0, (result) => {
                    cb(result);
                });
            });

        }

        buildDocTable(uploadedDocs) {
            let self = this;

            function addItem(root, guid, text, uploaded, required, name, templateUrl) {

                root = document.getElementById('div-doc-uploads');
                let div = document.createElement('div');
                root.appendChild(div);
                div.setAttribute('class', "row");
                div.setAttribute('style', "margin-bottom:5px; margin-top;-5px;");

                let div1 = document.createElement('div');
                let div2 = document.createElement('div');
                let div3 = document.createElement('div');
                let div4 = document.createElement('div');
                let div5 = document.createElement('div');

                div.appendChild(div1);
                div.appendChild(div2);
                div.appendChild(div3);
                div.appendChild(div4);
                div.appendChild(div5);

                div1.setAttribute('class', "col-xl-7");
                div2.setAttribute('class', "col-xl-1");
                div3.setAttribute('class', "col-xl-1");
                div4.setAttribute('class', "col-xl-1");
                div5.setAttribute('class', "col-xl-2");

                div1.innerHTML = name;

                let col = required == true ? 'requiredIcon' : 'optionalIcon';
                let ptr = required == true ? div2 : div3;
                ptr.setAttribute('style', "text-align:center;");
                ptr.innerHTML = "<b class=" + col + ">&#x2689;</b>";

                div4.setAttribute('style', "text-align:center;");
                let icon = uploaded == true ? '&#x2714;' : '&#x2717;';
                col = uploaded == true ? 'optionalIcon' : 'requiredIcon';
                div4.innerHTML = "<b class=" + col + ">" + icon + "</b>";

                let buttonId = 'button-' + guid;
                div5.innerHTML =
                    //'<br>' + 
                    '<button ' +
                    'id=' + buttonId + ' ' +
                    'name=' + buttonId + ' ' +
                    'type="button" ' +
                    'style="width:150px;" ' +
                    'class="btn btn-sm btn-outline-primary"> ' +
                    '</button>';

                function deleteDoc(guid, cb) {
                    self.deleteDoc(guid, cb);
                }

                function clickDoc(doc, guid) {
                    if (doc.hasBeenUploaded == false) {
                        self.activeGuid = guid;
                        $('#drop-zone-box').show();
                    } else {
                        deleteDoc(guid, (result) => {
                            self.activeGuid = null;
                        });
                    }
                }

                $('#' + buttonId).on('click', (ev) => {
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    let doc = self.getUploadDoc(guid);
                    clickDoc(doc, guid);
                });
                if (uploaded == false) {
                    $('#' + buttonId).html(
                        '<b class="fa fa-upload"></b>' +
                        '&nbsp;&nbsp;&nbsp;' +
                        '<span>Choose a file</span>'
                    );
                } else {
                    $('#' + buttonId).html(
                        '<b class="fa fa-recycle"></b>' +
                        '&nbsp;&nbsp;&nbsp;' +
                        '<span>Delete</span>'
                    );
                }
                let hr = document.createElement('hr');
                root.appendChild(hr);
            }

            let root = document.getElementById('div-doc-uploads');

            uploadedDocs.forEach((doc, idx) => {
                addItem(root, doc.docTypeGuid, doc.name, doc.hasBeenUploaded, doc.isRequired, doc.name, doc.templateUrl);
            });
        }

        getUploadDoc(guid) {
            if (this.uploadDocs == null) {
                return null;
            }
            let i = 0;
            while (1) {
                if (guid == this.uploadDocs[i].docTypeGuid) {
                    return this.uploadDocs[i];
                } else {
                    i++;
                }
            }
            return null;
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

        getDocuments(cb) {
            let self = this;
            this.uploadedAll = false;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            mc = this.helpers.nvpArrayToObject(mc);
            let get = app.onboard.helpers.getter(mc);
            let productId = get.get('product-fit-guid');
            abp.services.app.documentsAppServiceExt.getAllUploadedSefaDocuments(
                productId, this.model.smeCompany.smeCompany.id).done((payload) => {
                    let uploadedDocs = self.filterDocs(mc, this.model.smeCompany.smeCompany, payload);
                    let result = app.wizard.addResult();
                    uploadedDocs.sort(function (a, b) {
                        return a.name > b.name ? 1 : -1;
                    });
                    let total = uploadedDocs.length;
                    uploadedDocs.forEach((doc, idx) => {
                        if (doc.hasBeenUploaded == true ||
                            doc.isRequired == false) {
                            total--;
                        }
                    });
                    if (total == 0) {
                        self.uploadedAll = true;
                    }

                    result.data = uploadedDocs;

                    self.uploadDocs = result.data;
                    self.helpers.clearTable('div-doc-uploads');
                    self.buildDocTable(result.data);

                    cb(result);
                });

        }

        verb(id, payload, cb) {
            let self = this;


            function fileError(payload) {

            }

            if (id == 'file-transfered' && this.activeGuid != null) {
                self.getDocuments((result) => {
                    this.activeGuid = null;
                });
                $('#drop-zone-box').hide();
            } else if (id == 'file-added') {
            } else if (id == 'file-send') {
            } else if (id == 'file-error') {
                fileError(payload);
            }
        }

        query(id) {
            if (id == 'query-guid' && this.activeGuid != null) {
                return {
                    guid: this.activeGuid
                };
            } else {
                return super.query(id);
            }
        }
    }

    page.create = function (id) {
        return new MinRequirementsPage(id);
    }
})(app.wizard.minRequirements.page);
