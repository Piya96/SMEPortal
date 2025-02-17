"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.financialInfo == undefined) {
    app.wizard.financialInfo = {};
}

if (app.wizard.financialInfo.page == undefined) {
    app.wizard.financialInfo.page = {};
}

(function (page) {

    const BusinessType = {
        NoneOfTheAbove: '5c86148eb069b41688f61c8f'
    };

    const BankAccountOther = '5c86148eb069b41688f61c8f';

    const CollateralOther = '634d590a4d550ff4a17bbeae';
    const CollateralNone = '634d5744765726af72f9ab54';

    const SecurityOther = '634d5a5e36eaafd97068571f';
    const SecurityNone = '634d595473b83b026832e4a7';

    const SourceOfFundsOther = '634d5b1ff097ff5b024ab0d4';

    const AccountingSystemOther = '60d194ba05955b09d12f35e9';

    const PayrollSystemOther = '60d19618eac92464d407fb6c';

    const BusinessInsuranceOther = '64a52c4d3fe521609555ef70';

    class DtoToPage extends app.wizard.financialInfo.dto.DtoToHtml_Finfind {
        constructor(self) {
            super(self);
        }

        set(name, show, fn = []) {
            let value = super.set(name, show, fn);
            this.self.controls[name].val(value);
            return value;
        }

        setMult(name, show, fn = []) {
            let values = super.setMult(name, show, fn);
            values.forEach((value, idx) => {
                this.self.controls[name].val(value, true);
            });
            if (show == false) {
                this.self.controls[name].valAll(false);
            }
            return values;
        }

        apply(dto) {
            super.apply(dto);
        }
    }

    class FinfindLegalQuestionsPage extends app.wizard.financialInfo.page.FinancialInfoPage {
        constructor(id) {
            super(id);
            this.name = 'Finfind Legal Questions Page';
        }

        remap(arr, cb) {
            let self = this;
            arr.forEach((o, i) => {
                if (o.name == 'input-business-premises-and-or-property-value-directors' ||
                    o.name == 'input-owners-contribution' ||
                    o.name == 'input-value-of-collateral' ||
                    o.name == 'input-value-of-security' ||
                    o.name == 'input-company-contribution') {
                    if (o.value !== null && o.value != '') {
                        o.value = self.helpers.RemoveSpaces(o.value);
                    }
                }
            });
            return [];
        }

        onValidateField(field, isValid, args) {
            if (field != 'input-company-contribution') {
                super.onValidateField(field, isValid, args);
            }
        }

        dtoToPage(dto) {
            super.dtoToPage(dto);
            this.dto2Page.apply(dto);
        }

        load(args, cb) {
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            let dto = this.helpers.nvpArrayToObject(mc);
            this.dto = dto;
            this.dto2Page = new DtoToPage(this);
            this.dtoToPage(dto);
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            if (args.isNext == true) {
                let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
                let dto = this.helpers.nvpArrayToObject(mc);
                this.dto = dto;
                this.dtoToPage(dto);
            }
            cb(app.wizard.addResult());
        }

        addControls() {
            super.addControls();
            $('#input-permit-sefa-to-call-data-from-accounting-system-monthly').html(
                'Would you give permission to retrieve accounting data from your system monthly?'
            );
            let control = null;
            control = this.addControl('input-made-profit-over-last-6-months', 'radio');
            // This is sitting in SEFA cshtml because of the ordering of controls.
            control = this.addControl('input-has-invested-own-money', 'radio');
            // This is sitting in SEFA cshtml because of the ordering of controls.
            control = this.addControl('select-invested-own-money-value', 'select');

            let arr = this.listItems.getMoneyInvestedInBusiness();
            control.fill(arr);
        }

        addHandlers() {
            super.addHandlers();
            let self = this;
            this.controls['input-has-invested-own-money'].click((arg, name, value, checked) => {
                self.dto2Page.moneyInvested('', checked == 'Yes');
            });                   
        }

        collateralOther() {
            return CollateralOther;
        }

        collateralNone() {
            return CollateralNone;
        }

        securityOther() {
            return SecurityOther;
        }

        securityNone() {
            return SecurityNone;
        }

        sourceOfFundsOther() {
            return SourceOfFundsOther;
        }

        bankAccountOther() {
            return BankAccountOther;
        }

        accountingSystemOther() {
            return AccountingSystemOther;
        }

        payrollSystemOther() {
            return PayrollSystemOther;
        }

        businessType_NoneOfTheAbove() {
            return BusinessType.NoneOfTheAbove;
        }

        bankAccountOther() {
            return BankAccountOther;
        }

        getBusinessInsuranceOther() {
            return BusinessInsuranceOther;
        }
    }

    page.create = function (id) {
        return new FinfindLegalQuestionsPage(id);
    }

    page.FinfindFinancialInfo = FinfindLegalQuestionsPage;

    page.Finfind = FinfindLegalQuestionsPage;

})(app.wizard.financialInfo.page);
