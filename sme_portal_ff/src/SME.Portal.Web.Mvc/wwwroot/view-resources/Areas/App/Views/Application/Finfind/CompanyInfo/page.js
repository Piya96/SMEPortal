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
    let helpers = app.onboard.helpers.get();

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
            this.name = 'Finfind Business Info Page';
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

            control = this.addControl('date-started-trading-date', 'date');

            control = this.addControl('input-application-trading-years', 'input');
            control.enable(false);

            control = this.addControl('input-application-trading-months', 'input');
            control.enable(false);

            super.addControls();
        }

        addHandlers() {
            let self = this;

            $('#date-started-trading-date').datepicker().on(
                'changeDate', (e) => {
                    let str = [self.helpers.formatDate(e.date)];
                    let payload = self.dto2Page.tradingTime(str);
                    if (payload != null) {
                        $('#input-application-trading-years').val(payload.years);
                        $('#input-application-trading-months').val(payload.months);
                    }
                });

            super.addHandlers();
        }
    }

    page.create = function (id) {
        return new ECDCCompanyInfoPage(id);
    }

    page.FinfindCompanyInfo = ECDCCompanyInfoPage;

    page.Finfind = ECDCCompanyInfoPage;

})(app.wizard.companyInfo.page);
