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

    class DtoToPage extends app.wizard.financialInfo.dto.DtoToHtml_ECDC {
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
    }

    class ECDCFinancialInfoPage extends app.wizard.financialInfo.page.FinancialInfoPage {
        constructor(id) {
            super(id);
            this.name = 'ECDC Legal Questions Page';
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

        dtoToPage(dto) {
            let self = this;
            // div-method-of-repayment-ext - Remove for Imvaba
            // div-own-or-rent-business-premises-ext - Remove for Imvaba
            // div-existing-insurance-policies-in-place-ext - Remove for Imvaba, JobStimulus
            // div-type-of-collateral-ext - Remove for STRTEP, Imvaba, , JobStimulus
            // div-type-of-security-ext - Remove for STRTEP, Imvaba, JobStimulus
            // div-company-contribution-ext - Remove for Imvaba, JobStimulus
            // div-has-electronic-accounting-system-ext - Remove for Imvaba
            // div-any-other-business-loans-ext -  Remove for Imvaba
            // div-any-business-transactions-through-personal-accounts-ext - Imvaba
            // div-use-payroll-system-for-staff-payslips-ext - Imvaba

            // div-owner-invested-own-money-ext - Imvaba, JobStimulus
            // div-business-premises-and-or-property-value-directors-ext - Imvaba
            // div-up-to-date-audited-managements-accounts-ext
            this.dto2Page.apply(dto);
        }

        load(args, cb) {
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            this.dto = this.helpers.nvpArrayToObject(mc);
            this.productGuid = this.helpers.getPropEx(this.dto, 'input-product-guid', '');
            this.dto2Page = new DtoToPage(this);
            this.dtoToPage(this.dto);
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            this.dto = this.helpers.nvpArrayToObject(mc);
            this.productGuid = this.helpers.getPropEx(this.dto, 'input-product-guid', '');
            this.dtoToPage(this.dto);
            cb(app.wizard.addResult());
        }

        addControls() {
            let self = this;
            super.addControls();
            $('#input-permit-sefa-to-call-data-from-accounting-system-monthly').html(
                'Would you give permission to retrieve accounting data from your system monthly?'
            );
            function formatCurrency(val) {
                return self.helpers.formatCurrency(val);
            };

            let control = null;
            control = this.addControl('input-owner-invested-own-money', 'radio');
            control = this.addControl('input-business-premises-and-or-property-value-directors', 'input');
            control.format(8, formatCurrency);

            control = this.addControl('input-business-made-profit-over-last-6-months', 'radio');
            control = this.addControl('input-up-to-date-audited-managements-accounts', 'radio');
            control = this.addControl('input-owners-contribution', 'input');
            control.format(8, formatCurrency);
        }

        addHandlers() {
            super.addHandlers();
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
        return new ECDCFinancialInfoPage(id);
    }
})(app.wizard.financialInfo.page);
