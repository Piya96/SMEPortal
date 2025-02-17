"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.fundingRequirements == undefined) {
    app.wizard.fundingRequirements = {};
}

if (app.wizard.fundingRequirements.dto == undefined) {
    app.wizard.fundingRequirements.dto = {};
}

(function (dto) {

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    dto.controls = {
        'date-started-trading-date': { type: 'date', label: 'What date did you start trading?', filters: {} },
        'input-loan-amount': { type: 'input', label: 'Loan amount', filters: {} },
        'select-town-type': { type: 'select', label: 'Are you based in a small town, rural area, or township?', filters: [listItems.getTownType.bind(listItems)] },
        'select-funding-for': { type: 'select', label: 'What do you need funding for?', filters: [listItems.getFundingFor.bind(listItems)] },
        'input-has-contract-for-help-money': { type: 'radio', label: 'Do you have a signed contract?', filters: {} },
        'input-money-to-help-with-tender': { type: 'radio', label: 'Do you have a signed tender?', filters: {} },
        'input-purchase-order-funding': { type: 'radio', label: 'Do you have a signed purchase?', filters: {} },

        //'select-fund-application-capacity': { type: 'select', label: 'In what capacity are you applying for this funding?', filters: [listItems.getFundingFor.bind(listItems)] },
        'select-fund-application-capacity': { type: 'select', label: 'In what capacity are you applying for this funding?', filters: [listItems.getFundingCapacity.bind(listItems)] },
        'input-involved-in-daily-activities-of-coop': { type: 'radio', label: 'Are you involved in the daily running activities of the cooperative?', filters: {} },
        'input-any-other-loan-with-ecdc': { type: 'radio', label: 'Do you have any other loan with ECDC?', filters: {} }
    };

    class DtoToHtml {
        constructor(self) {
            this.fundingForGuids = app.wizard.common.page.fundingForGuids;
            if (self != null) {
                this.self = self;
            }
        }

        set(name, show, fn = []) {
            if (show == false) {
                helpers.setPropEx(this.dto, name, '');
            }
            let value = '';
            value = helpers.getPropEx(this.dto, name, '');
            if (value == null || value == undefined) {
                value == '';
            }
            fn.forEach((f, idx) => {
                value = f(value);
            });
            return value;
        }

        show(div, name, show) {
        }

        startedTrading() {
            let value = this.set('date-started-trading-date', true);
            return value;
        }

        loanAmount() {
            let value = this.set('input-loan-amount', true, [helpers.formatCurrency]);
            return value;
        }

        whereBased() {
            let value = this.set('select-town-type', true);
            return value;
        }

        fundingFor() {
            let value = this.set('select-funding-for', true);
            return value;
        }

        hasContractForHelpMoney() {
            let value = helpers.getPropEx(this.dto, 'select-funding-for', '');
            if (value == this.fundingForGuids['Money to help with a contract'] ||
                value == this.fundingForGuids['Cash flow assistance'] ||
                value == this.fundingForGuids['Money to buy stock']) {

                this.show('div-has-contract-for-help-money', 'input-has-contract-for-help-money', true);
                this.set('input-has-contract-for-help-money', true);
            } else {
                this.show('div-has-contract-for-help-money', 'input-has-contract-for-help-money', false);
                this.set('input-has-contract-for-help-money', false);
            }
        }

        hasSignedTender() {
            let value = helpers.getPropEx(this.dto, 'select-funding-for', '');
            if (value == this.fundingForGuids['Money to help with a tender']) {
                this.show('div-money-to-help-with-tender', 'input-money-to-help-with-tender', true);
                this.set('input-money-to-help-with-tender', true);
            } else {
                this.show('div-money-to-help-with-tender', 'input-money-to-help-with-tender', false);
                this.set('input-money-to-help-with-tender', false);
            }
        }

        hasSignedPurchaseOrder() {
            let value = helpers.getPropEx(this.dto, 'select-funding-for', '');
            if (value == this.fundingForGuids['Purchase order funding']) {
                this.show('div-purchase-order-funding', 'input-purchase-order-funding', true);
                this.set('input-purchase-order-funding', true);
            } else {
                this.show('div-purchase-order-funding', 'input-purchase-order-funding', false);
                this.set('input-purchase-order-funding', false);
            }
        }

        isImvabaEnterpriseActive() {
            let active = this.self.isImvabaEnterpriseActive();
            this.self.imvabaEnterpriseActive = active;
            return active;
        }

        fundApplicationCapacity() {
            let show = this.isImvabaEnterpriseActive();
            this.show('div-fund-application-capacity', 'select-fund-application-capacity', show);
            let value = this.set('select-fund-application-capacity', show);
            this.involvedInDailyCoopActivities(value != '653baf5e9b4cffaa25673c7b' && value != '');
        }

        involvedInDailyCoopActivities(show) {
            this.show('div-involved-in-daily-activities-of-coop', 'input-involved-in-daily-activities-of-coop', show);
            let value = this.set('input-involved-in-daily-activities-of-coop', show);
            this.otherLoanWithECDC(value == 'Yes');
        }

        otherLoanWithECDC(show) {
            this.show('div-any-other-loan-with-ecdc', 'input-any-other-loan-with-ecdc', show);
            let value = this.set('input-any-other-loan-with-ecdc', show);
        }

        apply(dto) {
            this.dto = dto;
            this.startedTrading();
            this.loanAmount();
            this.whereBased();
            this.fundingFor();
            this.hasContractForHelpMoney();
            this.hasSignedTender();
            this.hasSignedPurchaseOrder();

            this.fundApplicationCapacity();
        }
    }

    dto.getDto = function (dto) {
        return new DtoToHtml(dto);
    }

    dto.DtoToHtml = DtoToHtml;

})(app.wizard.fundingRequirements.dto);
