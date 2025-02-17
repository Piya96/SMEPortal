"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.common == undefined) {
    app.wizard.common = {};
}

if (app.wizard.common.page == undefined) {
    app.wizard.common.page = {};
}

(function (page) {

    class AppCommon extends app.wizard.page.Common {
        constructor() {
            super();
            this.name = 'Sefa App Common';
        }

        // Called from DocumentUpload page after getAllUploadedSefaDocuments returns to filter out documents based on
        // selections from previous pages.
        static filterDocs(mc, company, docArr, value1, value2, value3) {
            let arr = [];
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
    }

    page.create = function () {
        return new AppCommon();
    }

    page.AppCommon = AppCommon;

})(app.wizard.common.page);
