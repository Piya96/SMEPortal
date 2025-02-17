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

    dto.controls['input-made-profit-over-last-6-months'] = { type: 'input', label: 'Did your business make a profit over the last 6 months?', filters: {} };
    dto.controls['input-has-invested-own-money'] = { type: 'input', label: 'Have you as owner invested any of your own money in your business?', filters: {} };
    dto.controls['select-invested-own-money-value'] = { type: 'input', label: 'How much money have you invested in your business? (since it was started)', filters: [listItems.getMoneyInvestedInBusiness.bind(listItems)] };

    class DtoToHtml_Finfind extends app.wizard.financialInfo.dto.DtoToHtml {
        constructor(self) {
            super(self);
        }

        companyContribution_Hide() {
            return true;
        }

        hasMadeProfit() {
            let value = this.set('input-made-profit-over-last-6-months', true);
        }

        hasMoneyInvested() {
            $('#div-has-invested-own-money-finfind').show();
            let value = this.set('input-has-invested-own-money', true);
            this.moneyInvested(null, value == 'Yes');
        }

        // Note: This is sitting in the sefa cshtml defaulted to off because of the ordering of controls.
        moneyInvested(value, show) {
            this.show('div-has-invested-own-money', 'select-invested-own-money-value', show);
            this.set('select-invested-own-money-value', show);
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

        apply(dto) {
            super.apply(dto);
            this.hasMoneyInvested();
            this.hasMadeProfit();
        }
    }

    dto.getDto = function (dto) {
        return new DtoToHtml_Finfind(dto);
    }

    dto.DtoToHtml_Finfind = DtoToHtml_Finfind;

})(app.wizard.financialInfo.dto);
