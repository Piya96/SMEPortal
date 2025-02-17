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

if (app.wizard.financialInfo.dto == undefined) {
    app.wizard.financialInfo.dto = {};
}

(function (dto) {

    let productGuids = app.wizard.common.page.productGuids;
    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    const BankAccountOther = '5c86148eb069b41688f61c8f';

    const CollateralOther = '634d590a4d550ff4a17bbeae';
    const CollateralNone = '634d5744765726af72f9ab54';

    const SecurityOther = '634d5a5e36eaafd97068571f';
    const SecurityNone = '634d595473b83b026832e4a7';

    const SourceOfFundsOther = '634d5b1ff097ff5b024ab0d4';

    const AccountingSystemOther = '60d194ba05955b09d12f35e9';

    const PayrollSystemOther = '60d19618eac92464d407fb6c';

    const BusinessInsuranceOther = '64a52c4d3fe521609555ef70';

    dto.controls['input-business-made-profit-over-last-6-months'] = { type: 'input', label: 'Did your business make a profit over the last 6 months?', filters: {} };
    dto.controls['input-owner-invested-own-money'] = { type: 'input', label: 'Have you as owner invested any of your own money in your business?', filters: { } };
    dto.controls['input-business-premises-and-or-property-value-directors'] = { type: 'input', label: 'What is the value of the business property and/or other property owned by the directors (Give net value of premises - property value less any finance still owing)?', filters: {} };
    dto.controls['input-up-to-date-audited-managements-accounts'] = { type: 'input', label: 'Do you have up to date Management Accounts?', filters: {} };
    dto.controls['input-owners-contribution'] = { type: 'input', label: "Owner's contribution", filters: {} };

    // Inherits from common class.
    class DtoToHtml_ECDC extends app.wizard.financialInfo.dto.DtoToHtml {
        constructor(self) {
            super(self);
        }

        methodOfPayment_Hide() {
            return (
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise'] ||
                this.productGuid == productGuids['InvabaCooperativeFund']
            );
        }

        rentOrOwnBusinessPremises_Hide() {
           return (
               this.productGuid == productGuids['InvabaCooperativeFundEnterprise'] ||
               this.productGuid == productGuids['InvabaCooperativeFund']
           );
        }

        existingInsurancePoliciesInPlace_Hide() {
            return (
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise'] ||
                this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['JobStimulusFund']
            );
        }

        businessCollateral_Hide() {
            return (
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise'] ||
                this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['JobStimulusFund'] ||
                this.productGuid == productGuids['Strtep']
            );
        }

        ownerCollateral_Hide() {
            return (
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise'] ||
                this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['JobStimulusFund'] ||
                this.productGuid == productGuids['Strtep']
            );
        }

        companyContribution_Hide() {
            return (
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise'] ||
                this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['JobStimulusFund']
            );
        }

        electronicAccouningSystem_Hide() {
            return (
                this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise']
            );
        }

        otherBusinessLoans_Hide() {
            return (
                this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise']
            );
        }

        transactionsThroughPersonalAccounts_Hide() {
            return (
                this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise']
            );
        }

        payrollSystem_Hide() {
            return (
                this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise']
            );
        }

        companyContribution() {
            // Note: Requested for removal in ECDC and Finfind. Not Sefa.
            $('#div-company-contribution-ext').hide(false);

            this.set('input-company-contribution', false, []);
            this.show('', 'input-company-contribution', false);

            this.set('select-source-of-funds-company', false, []);
            this.show('', 'select-source-of-funds-company', false);

            this.set('input-source-of-funds-company-other', false, []);
            this.show('', 'input-source-of-funds-company-other', false);
        }

        // -----------------------------------------------------------------------------
        ownerInvestedOwnMoney() {
            if (this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['InvabaCooperativeFundEnterprise'] ||
                this.productGuid == productGuids['JobStimulusFund']) {
            } else {
            }
            this.set('input-owner-invested-own-money', true);
        }

        businessPremisesValue() {
            this.show('', 'input-business-premises-and-or-property-value-directors', false);
            if (this.productGuid == productGuids['InvabaCooperativeFund']) {
                this.show('div-business-premises-and-or-property-value-directors-ext', '', false);
            } else {
                this.show('div-business-premises-and-or-property-value-directors-ext', '', true);
                this.show('', 'input-business-premises-and-or-property-value-directors', true);
                this.set('input-business-premises-and-or-property-value-directors', true, [helpers.formatCurrency]);
            }
        }

        madeProfitInLast6Months() {
            this.set('input-business-made-profit-over-last-6-months', true);
        }

        auditedManagementAccounts() {
            this.show('', 'input-up-to-date-audited-managements-accounts', false);
            if (this.productGuid == productGuids['InvabaCooperativeFund'] ||
                this.productGuid == productGuids['JobStimulusFund']) {
                this.show('div-up-to-date-audited-managements-accounts-ext', '', false);
            } else {
                this.show('div-up-to-date-audited-managements-accounts-ext', '', true);
                this.show('', 'input-up-to-date-audited-managements-accounts', true);
                this.set('input-up-to-date-audited-managements-accounts', true);
            }
        }

        ownersContribution() {
            this.set('input-owners-contribution', true, [helpers.formatCurrency]);
        }


        apply(dto) {
            this.productGuid = helpers.getPropEx(dto, 'input-product-guid', '');
            super.apply(dto);

            this.ownerInvestedOwnMoney();
            this.businessPremisesValue();
            this.madeProfitInLast6Months();
            this.auditedManagementAccounts();
            this.ownersContribution();
        }
    }

    dto.getDto = function (dto) {
        return new DtoToHtml_ECDC(dto);
    }

    dto.DtoToHtml_ECDC = DtoToHtml_ECDC;

})(app.wizard.financialInfo.dto);
