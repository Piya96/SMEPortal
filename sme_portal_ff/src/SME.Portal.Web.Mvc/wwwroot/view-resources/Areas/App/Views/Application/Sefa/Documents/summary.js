'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.documents = {};
(function (documents) {

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    class Summary {
        constructor() {
            this.appId = null;
        }

        enumUploadedDocs(mc, company, cb) {
            let get = app.onboard.helpers.getter(mc);
            let productId = get.get('product-fit-guid');
            abp.services.app.documentsAppServiceExt.getAllUploadedSefaDocuments(productId, company.id).done((payload) => {
                payload.sort(function (a, b) {
                    return a.name > b.name ? 1 : -1;
                });
                let arr = [];
                for (let i = 0, max = payload.length; i < max; i++) {
                    let doc = payload[i];
                    arr.push(doc);
                }
                cb(arr);
            });
        }

        apply(matchCriteria, companyProfile, appId) {
            this.appId = appId;
            let root = document.getElementById('tbody-documents-' + this.appId);
            let mc = helpers.nvpArrayToObject(matchCriteria);
            this.enumUploadedDocs(mc, companyProfile, (result) => {
                let i = 1;
                helpers.clearTable('tbody-documents-' + this.appId);
                result.forEach((doc, idx) => {
                    if (doc.hasBeenUploaded == true) {
                        let tr = document.createElement('tr');
                        let td = document.createElement('td');

                        tr.appendChild(td);
                        root.appendChild(tr);
                        let id = 'td-document-' + i.toString();
                        td.setAttribute('id', id);
                        $('#' + id).text(doc.name);
                        i++;
                    }
                });

            });
        }
    }

    function Render(matchCriteria, companyProfile, appId) {
        let summary = new Summary();
        summary.apply(matchCriteria, companyProfile, appId);
    }

    documents.render = function (matchCriteria, companyProfile, appId) {
        Render(matchCriteria, companyProfile, appId);
    };
}(app.fss.documents));
