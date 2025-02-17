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
        Loan: '60a65f60b71eded66202ef4c',
        CreditCard: '60a65f059d7ed8e9f7fce6df',
        CurrentAccount: '60a65eb4c8406fdf0f77612e',
        Investment: '60a65edcec1e15cb3033d4c2',
        Overdraft: '60a65f2f3469b5545d896913',
        RevolvingCredit: '60a65f3c58408ebc1778fd36',
        SavingsAccount: '60a65ec322522ac7002797cd',
        VehicleFinance: '60a65ef11bf07739f9de8a54',
        NoneOfTheAbove: '5c86148eb069b41688f61c8f'
    };

    const BankAccountOther = '5c86148eb069b41688f61c8f';

    const CollateralOther = '62c6f856c50341864eb71970';
    const CollateralNone = '4586ac64fbd24de3ae3e231d87fb6d4e';

    const SecurityOther = '62c6f91ead740b088bee2947';
    const SecurityNone = '93ce8e429c1542bdbc63674035a8cb19';

    const SourceOfFundsOther = '6278d3714d04c757940db02e';

    const AccountingSystemOther = '60d194ba05955b09d12f35e9';

    const PayrollSystemOther = '60d19618eac92464d407fb6c';

    const BusinessInsuranceOther = '64a52c4d3fe521609555ef70';

    class DtoToPage extends app.wizard.financialInfo.dto.DtoToHtml_Sefa {
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

    class SefaLegalQuestionsPage extends app.wizard.financialInfo.page.FinancialInfoPage {
        constructor(id) {
            super(id);
            this.name = 'Sefa Legal Questions Page';
        }

        remap(arr, cb) {
            let self = this;
            arr.forEach((o, i) => {
                if (//o.name == 'input-business-premises-and-or-property-value-directors' ||
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
            //if (field != 'input-company-contribution') {
                super.onValidateField(field, isValid, args);
            //}
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
        }

        addHandlers() {
            super.addHandlers();
            //let self = this;
            //this.controls['input-has-invested-own-money'].click((arg, name, value, checked) => {
            //    self.dto2Page.moneyInvested('', checked == 'Yes');
            //});
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
        return new SefaLegalQuestionsPage(id);
    }

})(app.wizard.financialInfo.page);
