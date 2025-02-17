// The wizard controller is responsible for facilitating flow between individual wizard
// pages by sending messages to the wizard pages via interface that is implemented by
// wizard pages.

"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.controller == undefined) {
    app.wizard.controller = {};
}

(function (controller) {

    class AppController_CompanyPartners extends app.wizard.controller.AppController {
        constructor(wizardId, bodyId) {
            super(wizardId, bodyId);
            this.name = 'Company Partners App Controller';
        }

        getController() {
            return 'CompanyPartnersFunderSearch';
        }

        getCompanyPartnersPayload() {
            let allFields = true;

            let listItems = this.listItems;
            let self = this;

            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            let dto = this.helpers.nvpArrayToObject(mc);

            function getProp2(question, dto, src, dst, arr, root = null, fn = null) {
                if (allFields == true) {
                    if (root == null) {
                        arr[dst] = question;
                    } else {
                        arr[dst] = {};
                        arr[dst]['ParentListId'] = root;
                        arr[dst]['ListId'] = question;
                    }
                    return;
                }

                let result = self.helpers.getPropEx(dto, src, '');
                if (result === '') {
                    return;
                } else {
                    if (root == null) {
                        arr[dst] = result;
                    } else {
                        arr[dst] = {};
                        arr[dst]['ParentListId'] = root;
                        arr[dst]['ListId'] = result;
                    }
                    if (root != null) {
                    } else {
                    }

                }
            }

            function getCompanyPartnersObject() {
                let userProfile = self.model.userProfile;
                let temp = {};

                getProp2('7012281111084', userProfile, 'identityOrPassport', 'identity-number', temp);
                getProp2('0825681111', userProfile, 'phoneNumber', 'mobile-number', temp);
                getProp2('xyz@gmail.com', userProfile, 'emailAddress', 'email-address', temp);
                getProp2('Joe', userProfile, 'name', 'first-name', temp);
                getProp2('Soap', userProfile, 'surname', 'last-name', temp);

                let companyProfile = self.model.smeCompany.smeCompany;

                getProp2('ABC Computing', companyProfile, 'name', 'company-name', temp);

                // Source tenant id.
                temp['source'] = 9;

                function addDocument(index, name, documentName) {
                    let value = self.helpers.getPropEx(dto, name, '');
                    temp['documents'].push({
                        name: documentName,
                        status: value[0]
                    });
                }
                temp['documents'] = [];
                addDocument('1', "one1", "Business registration documents (CIPC) e.g. Cor14.3 or CK documents");
                addDocument('2', "one2", "Certified ID copy of owners and directors");
                addDocument('3', "one3", "Proof of business address (lease agreement, title deed or permit)");
                addDocument('4', "one4", "Bank statements for business account (last 6 months) electronically stamped and on bank letterhead");
                addDocument('5', "one5", "Proof of bank account electronically stamped and on bank letterhead");
                addDocument('6', "one6", "Signed contracts and/or purchase orders");
                addDocument('7', "one7", "List of outstanding debtors (unpaid invoices for more than 30 days)");
                addDocument('8', "one8", "Cashflow projections (income and expense budget for 12 months)");
                addDocument('9', "one9", "Business plan e.g. PDF of the final business plan");
                addDocument('10', "one10", "Statement of assets and liabilities (for all owners)");
                addDocument('11', "one11", "Tax clearance certificate / Tax PIN on official SARS letterhead");
                addDocument('12', "one12", "Management accounts (Income statement, Balance Sheet)");
                addDocument('13', "one13", "Annual financial statements (signed by Accountant)");
                addDocument('14', "one14", "Share register and/or share certificates e.g. PDF of the signed certificates and share register document");
                addDocument('15', "one15", "Shareholder agreement e.g. PDF of the final signed agreement");
                addDocument('16', "one16", "BEE certificate or affidavit");
                addDocument('17', "one17", "Business Organogram e.g. PDF of the final business structure showcasing the different positions and reporting structure");
                addDocument('18', "one18", "Beneficial ownership register/compliance - New laws");
                addDocument('19', "one19", "COIDA letter of good standing. Requires CF number and completed return of earnings at COIDA");
                addDocument('20', "one20", "Industry certifications if applicable (e.g. CIBD)");
                addDocument('21', "one21", "Certified copies of spouse ID (if married in Community of property)");
                addDocument('22', "one22", "Certified copies of marriage certificate (if married in Community of property)");

                return temp;
            }
            return getCompanyPartnersObject();
        }


        getSummaryDocName() {
            return 'Company Partners Summary.pdf';

        }

        getSummaryDocType() {
            return '0123456789A00001';
        }

        onSubmit(cb) {
            let self = this;
            function submitDataPayload(cb) {

                let json = self.getCompanyPartnersPayload();
                let str = JSON.stringify(json);
                let payloadArgs = {
                    json: str
                };

                abp.services.app.applicationAppServiceExt.sendCompanyPartnersPayload(payloadArgs).done((payload) => {
                    let result = app.wizard.addResult();
                    result.data = {
                        id: self.appIdEnc
                    };
                    cb(result);
                });
            }

            submitDataPayload((result) => {
                super.onSubmit((result) => {
                    cb(result);
                });
            });
        }
    }

    controller.create = function (wizardId, bodyId) {
        return new AppController_CompanyPartners(wizardId, bodyId);
    }

})(app.wizard.controller);
