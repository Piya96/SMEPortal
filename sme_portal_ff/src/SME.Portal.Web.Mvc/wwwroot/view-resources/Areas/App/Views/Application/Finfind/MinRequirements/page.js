"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.keyThings == undefined) {
    app.wizard.keyThings = {};
}

if (app.wizard.keyThings.page == undefined) {
    app.wizard.keyThings.page = {};
}

(function (page) {

    class KeyThingsPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Key Things Page';
            this.productId = 'e9bb0c141f824cd684cabb10824bf91f';
            this.uploadDocs = null;
            this.activeDoc = {
                name : null,
                guid : null
            };
            this.docs = null;
            this.turnOver = {
                uploaded: false,
                guid: null,
                text: null
            };
            this.bankStatements = {
                uploaded : false,
                guid : null,
                text : null
            };
            this.creditScore = '';
        }

        saveCreditScore(nvp, arr) {
            if (this.creditScore != '') {
                for (let i = 0, max = nvp.length; i < max; i++) {
                    if (nvp[i].name == 'credit-score') {
                        nvp[i].value = this.creditScore;
                        return;
                    }
                }
                arr.push({
                    name: 'credit-score',
                    value: this.creditScore
                });
            }
        }

        remap(nvp, cb) {
            let arr = [];
            arr.push({
                name: 'turn-over-doc',
                value : this.turnOver.guid
            });
            arr.push({
                name: 'turn-over-doc-name',
                value: this.turnOver.text
            });
            // Not referenced.
            arr.push({
                name: 'bank-statements-doc',
                value: this.bankStatements.guid
            });
            arr.push({
                name: 'bank-statements-doc-name',
                value: this.bankStatements.text
            });
            //this.saveCreditScore(nvp, arr);
            if (this.creditScore != '') {
                arr.push({
                    name : 'credit-score',
                    value: this.creditScore
                });
            }
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

        validate(data, cb) {
            cb(app.wizard.addResult());
        }

        serialize() {
            return super.serialize();
        }

        dtoToPage(dto) {
            let self = this;
            let doc = null;
            function getDoc(guid) {
                doc = self.getDoc(guid);
                return doc.hasBeenUploaded == true ? doc : null;
            }
            while (1) {
                // Letter from accountant.
                doc = getDoc('636ceee492132bfc0d1be4fd');
                if (doc != null) {
                    break;
                }
                // CIPC annual return.
                doc = getDoc('60549c63a2b3b4fb7c24bb34');
                if (doc != null) {
                    break;
                }
                // Income statement.
                doc = getDoc('6493f45eee8e7c3bf8296f72');
                if (doc != null) {
                    break;
                }
                // Current management accounts.
                doc = getDoc('5ab0cdfc3efed814143695a0');
                if (doc != null) {
                    break;
                }
                // Latest annual financial statements.
                doc = getDoc('5ab0cded3efed8141436959f');
                if (doc != null) {
                    break;
                }
                // VAT return.
                doc = getDoc('636cef454f884efe0064204c');
                if (doc != null) {
                    break;
                }
                // Trial balance.
                doc = getDoc('646dbef73b827468047280b5');
                if (doc != null) {
                    break;
                } else {
                    break;
                }
            }
            if (doc != null) {
                this.turnOver.uploaded = true;
                this.turnOver.guid = doc.docTypeGuid;
                this.turnOver.text = doc.name;
                this.controls['input-turnover-doc'].val(doc.docTypeGuid);
            } else {
                this.controls['input-turnover-doc'].val('');
            }
            $('#span-doc-a').text(doc != null ? 'Delete' : 'Click here to upload your doc');
            this.controls['button-doc-a'].enable(doc != null);
            this.controls['input-turnover-doc'].enable(doc == null);
            // 3 months bank statements.
            doc = getDoc('636cef617a5499b12c0193c2');
            if (doc != null) {
                this.bankStatements.uploaded = true;
                this.bankStatements.guid = doc.docTypeGuid;
                this.bankStatements.text = doc.name;
                this.controls['input-bank-statement-doc'].val(doc.docTypeGuid);
            } else {
                this.controls['input-bank-statement-doc'].val('');
            }
            $('#span-doc-b').text(doc != null ? 'Delete' : 'Click here to upload your doc');
            this.controls['button-doc-b'].enable(doc != null);
            this.controls['input-bank-statement-doc'].enable(doc == null);

            let value = this.helpers.getPropEx(this.dto, 'input-credit-score-declaration', '');
            this.controls['input-credit-score-declaration'].val('Yes', value == 'Yes');

            this.creditScore = this.helpers.getPropEx(this.dto, 'credit-score', this.creditScore);
            if (this.creditScore != '' && Array.isArray(this.creditScore) == true) {
                this.creditScore = this.creditScore[0];
            }
        }

        pageToDto(dto) {
        }

        reset() {
        }

        load(args, cb) {
            let self = this;

            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            this.dto = this.helpers.nvpArrayToObject(mc);
            this.dropZone = dropZoneControl.initEx(args.smeCompany.smeCompany.id, this, 12, 12);

            let count = 1;
            function complete() {
                if (--count == 0) {
                    cb(app.wizard.addResult());
                }
            }

            this.getDocuments((result) => {
                self.docs = result.data;
                self.dtoToPage(self.dto);
                complete();
            });

            app.consumerCredit.load();
            app.consumerCredit.initEx(
                this.model.ownerProfile.owner.name,
                this.model.ownerProfile.owner.surname,
                this.model.ownerProfile.owner.identityOrPassport
            );
            app.consumerCredit.initOwner(function (dto) {
            }, this.model.isOnboarded);
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            super.attention(args, cb);
        }

        attentionHidden(args, cb) {
            let self = this;

            let count = 2;
            function complete() {
                if (--count == 0) {
                    cb(app.wizard.addResult());
                }
            }

            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            this.dto = this.helpers.nvpArrayToObject(mc);

            function getDocs() {
                complete();
                self.getDocuments((result) => {
                    self.docs = result.data;
                    self.dtoToPage(self.dto);
                    complete();
                });
            }

            let value = this.helpers.getPropEx(this.dto, 'input-credit-score-declaration', '');
            if (value == 'Yes') {
                this.showCreditScore((result) => {
                    getDocs();
                    //complete();
                });
            } else {
                getDocs();
            }
        }

        onValidateField(field, isValid, args) {
        }

        validate(args, cb) {
            //this.bankStatements.uploaded = true;
            //this.turnOver.uploaded = true;
            let result = app.wizard.addResult();
            if (this.turnOver.uploaded == false || this.bankStatements.uploaded == false) {
                result.status = app.wizard.Result.Fail;
                result.message = 'Please upload the neccessary documents';
            }
            cb(result);
        }

        addControls() {
            let control = null;
            control = this.addControl('button-doc-a', 'button');
            control = this.addControl('button-doc-b', 'button');
            control = this.addControl('input-credit-score-declaration', 'checkbox');

            $('#div-cc-identity-input-id').hide();

            control = this.addControl('input-turnover-doc', 'radio');
            control = this.addControl('input-bank-statement-doc', 'radio');
        }

        buttonsEnable(docA, docB) {
            this.controls['button-doc-a'].enable(docA);
            this.controls['button-doc-b'].enable(docB);
        }

        getDoc(guid) {
            let i = 0;
            while (1) {
                if (guid == this.docs[i].docTypeGuid) {
                    return this.docs[i];
                } else {
                    i++;
                }
            }
            return null;
        }

        setDocName(doc) {
            if (doc != null) {
                $('#document-upload-heading').text(doc.name);
            }
        }

        showCreditScore(cb = null) {
            let self = this;
            app.consumerCredit.autoValidateId(function (result) {
                if (result.status == app.wizard.Result.Fail) {
                    $('#personal-credit-report-link').hide('fast');
                } else {
                    $('#personal-credit-report-link').show('fast');
                    if (result.data != '') {
                        self.creditScore = result.data;
                    }
                }
                if (cb != null) {
                    cb(app.wizard.addResult());
                }
            });
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
                        self.docs = result.data;
                        self.dtoToPage(self.dto);
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

        addHandlers() {
            let self = this;

            function deleteDoc(guid, cb) {
                self.deleteDoc(guid, cb);
            }

            function clickDoc(docObj = null) {
                let guid = self.activeDoc.guid;
                let doc = self.getDoc(guid);
                self.setDocName(doc);
                if (doc.hasBeenUploaded == false) {
                    $('#drop-zone-box').show();
                    window.scrollTo(0, 0);
                } else {
                    deleteDoc(guid, (result) => {
                        self.controls[self.activeDoc.name].enable(true);
                        self.activeDoc.guid = null;
                        self.activeDoc.name = null;
                        docObj.uploaded = false;
                        docObj.guid = null;
                    });
                }
            }

            this.controls['input-credit-score-declaration'].click((arg, name, value, checked) => {
                if (checked == true) {
                    app.consumerCredit.autoValidateId(function (result) {
                        if (result.status == app.wizard.Result.Fail) {
                            $('#personal-credit-report-link').hide('fast');
                        } else {
                            $('#personal-credit-report-link').show('fast');
                            if (result.data != '') {
                                self.creditScore = result.data;
                            }
                        }
                    });
                } else {
                    $('#personal-credit-report-link').hide('fast');
                }
            });

            $('#button-doc-a').on('click', (ev) => {
                self.activeDoc.guid = self.turnOver.guid;
                self.activeDoc.name = 'input-turnover-doc';
                clickDoc(self.turnOver);
                self.controls['input-turnover-doc'].enable(false);
            });

            $('#button-doc-b').on('click', (ev) => {
                self.activeDoc.guid = self.bankStatements.guid;
                self.activeDoc.name = 'input-bank-statement-doc';
                clickDoc(self.bankStatements);
                self.controls['input-bank-statement-doc'].enable(false);
            });

            this.controls['input-turnover-doc'].click((arg, name, prev, next) => {
                self.turnOver.guid = next;
                this.controls['button-doc-a'].enable(true);
            });

            this.controls['input-bank-statement-doc'].click((arg, name, prev, next) => {
                self.bankStatements.guid = next;
                this.controls['button-doc-b'].enable(true);
            });
        }

        getDocuments(cb) {
            let self = this;
            abp.services.app.documentsAppServiceExt.getAllUploadedSefaDocuments(
                this.productId, this.model.smeCompany.smeCompany.id).done((payload) => {
                    let result = app.wizard.addResult();
                    payload.sort(function (a, b) {
                        return a.name > b.name ? 1 : -1;
                    });
                    result.data = payload;
                    self.uploadDocs = result.data;
                    cb(result);
                });
        }

        verb(id, payload, cb) {
            function fileError(payload) {

            }

            let self = this;
            if (id == 'file-transfered') {
                this.getDocuments((result) => {
                    self.docs = result.data;
                    self.dtoToPage(self.dto);
                    $('#drop-zone-button').removeClass('pulse');
                });
                $('#drop-zone-box').hide();
            } else if (id == 'file-added') {
                $('#drop-zone-button').addClass('pulse');
            } else if (id == 'file-send') {
            } else if (id == 'file-error') {
                fileError(payload);
            }
        }

        query(id) {
            if (id == 'query-guid' && this.activeDoc.guid != null) {
                return {
                    guid : this.activeDoc.guid
                };
            } else {
                return null;
            }
        }
    }

    page.create = function (id) {
        return new KeyThingsPage(id);
    }

    page.KeyThingsPage = KeyThingsPage;

    page.FinfindMinRequirements = KeyThingsPage;

    page.Finfind = KeyThingsPage;

})(app.wizard.keyThings.page);
