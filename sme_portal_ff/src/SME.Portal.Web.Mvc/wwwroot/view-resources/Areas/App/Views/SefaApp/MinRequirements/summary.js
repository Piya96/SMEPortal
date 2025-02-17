'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.minRequirements == undefined) {
    app.wizard.minRequirements = {};
}

if (app.wizard.minRequirements.summary == undefined) {
    app.wizard.minRequirements.summary = {};
}

(function (summary) {

    let helpers = app.onboard.helpers.get();

    class DtoSummary {// extends dto.DtoToHtml {
        constructor(self) {
            this.appId = null;
            this.root = null;
        }

        set(doc) {
            let self = this.self;
            let tr = document.createElement('tr');
            let left = document.createElement('td');
            left.setAttribute('style', 'width:55%;');
            this.root.appendChild(tr);
            tr.appendChild(left);
            let leftId = 'left-' + doc.docTypeGuid + '-' + this.appId;
            left.setAttribute('id', leftId);
            $('#' + leftId).text(doc.name);
        }

        show(div, name, show) {

        }

        apply(dto, companyId, appId, cb, getDocs = true) {
            let self = this;
            this.dto = dto;
            this.helpers = helpers;
            this.appId = appId;
            this.root = document.getElementById('tbody-key-things-summary-' + this.appId);
            this.helpers.clearTable('tbody-key-things-summary-' + this.appId);

            if (getDocs == false) {
                let docs = null;
                for (const name in dto) {
                    if (name == 'document') {
                        docs = dto[name];
                        break;
                    }
                }
                if (docs != null) {
                    docs.forEach((name, idx) => {
                        self.set({
                            docTypeGuid : idx,
                            'name' : name
                        });
                    });
                }
            } else {
                this.productGuid = this.helpers.getPropEx(dto, 'input-product-guid', '');
                abp.services.app.documentsAppServiceExt.getAllUploadedSefaDocuments(
                    this.productGuid[0], companyId).done((payload) => {
                        let result = app.wizard.addResult();
                        payload.sort(function (a, b) {
                            return a.name > b.name ? 1 : -1;
                        });
                        result.data = payload;
                        payload.forEach((doc, idx) => {
                            if (doc.hasBeenUploaded == true) {
                                self.set(doc);
                            }
                        });
                        cb(result);
                    });
            }
        }
    }

    function Render(dto, companyId, appId, cb, getDocs = true) {
        let summary = new DtoSummary(null);
        summary.apply(dto, companyId, appId, cb, getDocs);
    }

    summary.render = function (dto, companyId, appId, cb, getDocs = true) {
        if (dto != null) {
            Render(dto, companyId, appId, cb, getDocs);
        }
    };

}(app.wizard.minRequirements.summary));
