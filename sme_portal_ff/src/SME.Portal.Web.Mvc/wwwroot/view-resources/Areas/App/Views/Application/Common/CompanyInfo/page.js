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

    let dto = app.wizard.companyInfo.dto;

    class DtoToPage extends dto.DtoToHtml {
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

        show(div, name, enable) {
            super.show(div, name, enable);
        }
    }

    page.DtoToPage = DtoToPage;

    class CompanyInfoPage extends app.wizard.page.Base {

        constructor(id) {
            super(id);
            this.name = 'Business Info Page';
            this.dto2Page = null;
            this.dto = null;
            // TODO: Move to ECDC derived class.
            this.productGuid = '';
        }

        showControlDiv(divId, elemIds, show, val = null) {
            if (show == false) {
                elemIds.forEach((item, index) => {
                    $('#' + item).val(val);
                });
            }
            this.validation.toggleValidators(elemIds, [show]);
            this.helpers.show(divId, show);
        }

        onValidateField(field, isValid, args) {
            if (field == 'input-registered-for-coida') {
                if (args == true) {
                    $('#div-registered-for-coida').show('fast');
                } else {
                    $('#div-registered-for-coida').hide('fast');
                    this.controls['input-registered-for-coida'].val('');
                }
            }
        }

        validate(data, cb) {
            super.validate(data, cb);
        }

        dtoToPage(dto) {
            this.dto2Page.apply(dto);
        }

        serialize() {
            return [];
        }

        remap(nvp, cb) {
            let arr = [];
            return arr;
        }

        pageToDto(dto) {
        }

        reset() {
        }

        createDtoToPage() {
            return new DtoToPage(this);
        }

        // Very important to initialize all controls on load because of the partial save from one page to the next.
        load(args, cb) {
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);

            this.dto = this.helpers.nvpArrayToObject(mc);
            // TODO: Move to ECDC derived class.
            this.productGuid = this.helpers.getPropEx(this.dto, 'input-product-guid', '');

            this.dto2Page = this.createDtoToPage();

            this.dtoToPage(this.dto);

            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            // TODO: Move to ECDC derived class.
            if (args.isNext == true) {
                let mc = JSON.parse(this.model.application.application.matchCriteriaJson);

                this.dto = this.helpers.nvpArrayToObject(mc);

                this.productGuid = this.helpers.getPropEx(this.dto, 'input-product-guid', '');
                //if (this.productGuid == '') {
                    //this.productGuid = args.user;
                //}

                this.dtoToPage(this.dto);
            }
            cb(app.wizard.addResult());
        }

        attention(data, cb) {
            cb(app.wizard.addResult());
        }

        addControls() {
            let self = this;
            let control = null;

            control = this.addControl("input-percent-ownership-by-south-africans", "input");
            control.format(5);

            control = this.addControl("input-percent-black-coloured-indian-pdi", "input");
            control.format(5);

            control = this.addControl("input-percent-black-south-africans-only", "input");
            control.format(5);

            control = this.addControl("input-percent-white-only", "input");
            control.format(5);

            control = this.addControl("input-percent-asian-only", "input");
            control.format(5);

            control = this.addControl("input-percent-disabled-people", "input");
            control.format(5);

            control = this.addControl("input-percent-youth-under-35", "input");
            control.format(5);

            control = this.addControl("input-percent-women-women-any-race", "input");
            control.format(5);

            control = this.addControl("input-percent-women-black-only", "input");
            control.format(5);

            control = this.addControl("input-military-veteran-owners", "input");
            control.format(5);

            control = this.addControl("input-percent-non-south-african-citizens", "input");
            control.format(5);

            control = this.addControl("input-percent-companies-organisations", "input");
            control.format(5);

            control = this.addControl("input-total-number-of-owners", "input");
            control.format(5);

            control = this.addControl('select-company-profile-bee-level', 'select');

            let arr = this.listItems.getBeeLevel();
            control.fill(arr);

            control = this.addControl('input-registered-for-coida', 'radio');

            control = this.addControl("input-total-number-of-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-permanent-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-permanent-youth-employees-under35", "input");
            control.format(4);

            control = this.addControl("input-number-of-permanent-female-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-permanent-black-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-new-jobs-created-through-loan", "input");
            control.format(4);

            control = this.addControl("input-number-of-existing-jobs-sustained", "input");
            control.format(4);

            control = this.addControl("input-number-of-part-time-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-part-time-youth-employees-under35", "input");
            control.format(4);

            control = this.addControl("input-number-of-part-time-female-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-part-time-black-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-new-part-time-jobs-created-through-loan", "input");
            control.format(4);

            control = this.addControl("input-number-of-existing-part-time-jobs-sustained", "input");
            control.format(4);

            control = this.addControl("input-number-of-permanent-non-sa-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-permanent-disabled-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-part-time-non-sa-employees", "input");
            control.format(4);

            control = this.addControl("input-number-of-part-time-disabled-employees", "input");
            control.format(4);
        }

        addHandlers() {
            let self = this;
        }
    }

    page.create = function (id) {
        return new CompanyInfoPage(id);
    }

    page.CompanyInfoPage = CompanyInfoPage;

})(app.wizard.companyInfo.page);
