"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.companyInfo == undefined) {
    app.wizard.companyInfo = {};
}

if (app.wizard.companyInfo.page == undefined) {
    app.wizard.companyInfo.page = {};
}

(function (page) {

    class ECEDDtoToPage extends app.wizard.companyInfo.dto.DtoToHtml_Tenant {
        constructor(self) {
            super(self);
            this.controls = self.controls;
            this.validation = self.validation;
        }

        set(name, show, fn = []) {
            let value = super.set(name, show, fn);
            this.controls[name].val(value);
            return value;
        }
    }

    class ECDCCompanyInfoPage extends app.wizard.companyInfo.page.CompanyInfoPage {

        constructor(id) {
            super(id);
            this.name = 'ECDC Business Info Page';
            this.productGuid = '';
        }

        validate(data, cb) {
            super.validate(data, cb);
        }

        onValidateField(field, isValid, args) {
            super.onValidateField(field, isValid, args);
        }

        dtoToPage(dto) {
            super.dtoToPage(dto);
        }

        serialize() {
            return super.serialize();
        }

        remap(nvp, cb) {
            return super.remap(nvp, cb);
        }

        pageToDto(dto) {
            super.pageToDto(dto);
        }

        reset() {
            super.reset();
        }

        createDtoToPage() {
            return new ECEDDtoToPage(this);
        }

        // Very important to initialize all controls on load because of the partial save from one page to the next.
        load(args, cb) {
            super.load(args, cb);
        }

        save(cb) {
            super.save(cb);
        }

        attentionHidden(args, cb) {
            super.attentionHidden(args, cb);
        }

        addControls() {
            let self = this;
            let control = null;

            super.addControls();
        }

        addHandlers() {
            let self = this;

            super.addHandlers();
        }
    }

    page.create = function (id) {
        return new ECDCCompanyInfoPage(id);
    }

})(app.wizard.companyInfo.page);
