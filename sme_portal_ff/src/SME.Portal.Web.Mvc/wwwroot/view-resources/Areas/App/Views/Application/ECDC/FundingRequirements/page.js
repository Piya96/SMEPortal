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

if (app.wizard.fundingRequirements.page == undefined) {
    app.wizard.fundingRequirements.page = {};
}

(function (page) {

    let dto = app.wizard.fundingRequirements.dto;
    let helpers = app.onboard.helpers.get();

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

        show(div, name, show) {
            if (div != '') {
                if (show == true) {
                    $('#' + div).show('fast');
                } else {
                    $('#' + div).hide('fast');
                }
            }
            if (name != '') {
                this.self.validation.toggleValidators([name], [show]);
            }
        }

        // TOTO: Move this into helpers.
        tradingTime(str) {
            return helpers.getYearsAndMonths(str);
        }

        startedTrading() {
            let str = super.startedTrading();
            let payload = this.tradingTime(str);
            if (payload == null) {
                return;
            }
            $('#input-application-trading-years').val(payload.years);
            $('#input-application-trading-months').val(payload.months);
            return str;
        }
    }

    class FundingRequirements extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Funding Requirements Page';
            this.fundingForGuids = app.wizard.common.page.fundingForGuids;
            this.imvabaEnterpriseActive = false;
        }

        remap(arr, cb) {
            let self = this;
            arr.forEach((o, i) => {
                if (o.name == 'input-loan-amount') {
                    if (o.value !== null && o.value != '') {
                        o.value = self.helpers.RemoveSpaces(o.value);
                    }
                }
            });
            return [];
        }

        getJson() {
        }

        serialize() {
            return [];
        }

        validate(data, cb) {
            cb(app.wizard.addResult());
        }

        dtoToPage(dto) {
            this.dto2Page.apply(dto);
        }

        pageToDto(dto) {
        }

        reset() {
        }

        load(args, cb) {
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            this.dto = this.helpers.nvpArrayToObject(mc);
            this.dto2Page = new DtoToPage(this);
            this.dtoToPage(this.dto);

            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            if (args.isNext == true) {
                let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
                this.dto = this.helpers.nvpArrayToObject(mc);
                this.dtoToPage(this.dto);
            }
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            super.attention(args, cb);
        }

        isImvabaEnterpriseActive() {
            //return false;
            let isSoleProp = this.model.smeCompany.smeCompany.type == app.wizard.common.page.companyGuids['Sole Proprietor'];
            // TODO: This only needs to be done once.
            let json = JSON.parse(this.model.smeCompany.smeCompany.propertiesJson);
            let iValue = parseInt(this.helpers.RemoveSpaces(this.controls['input-loan-amount'].val()));
            let fundingForGuid = this.controls['select-funding-for'].val();
            let isFundingForImvaba = this.common.fundingForImvaba(fundingForGuid);
            return isSoleProp == true && iValue <= 150000 && isFundingForImvaba == true;
        }

        tryActivateImvabaEnterprise() {
            if (this.isImvabaEnterpriseActive() == true && this.imvabaEnterpriseActive == false) {
                this.imvabaEnterpriseActive = true;
                this.dto2Page.fundApplicationCapacity();
            } else if (this.imvabaEnterpriseActive == true) {
                this.imvabaEnterpriseActive = false;
                this.helpers.setPropEx(this.dto, 'select-fund-application-capacity', '');
                this.helpers.setPropEx(this.dto, 'input-involved-in-daily-activities-of-coop', '');
                this.helpers.setPropEx(this.dto, 'input-any-other-loan-with-ecdc', '');
                this.dto2Page.fundApplicationCapacity();
            }
        }

        addControls() {
            let self = this;
            let control = null;
            let arr = null;
             // TODO: Refactor!!!
            control = this.addControl('date-started-trading-date', 'date');

            control = this.addControl('input-application-trading-years', 'input');
            control.enable(false);

            control = this.addControl('input-application-trading-months', 'input');
            control.enable(false);

            control = this.addControl('input-loan-amount', 'input');
            control.format(10, (value) => {
                let iValue = parseInt(value);
                if (isNaN(iValue) == false) {
                    self.tryActivateImvabaEnterprise();
                }
                return this.helpers.formatCurrency(value);
            });

            control = this.addControl('select-town-type', 'select');
            arr = this.listItems.getTownType();
            control.fill(arr);

            control = this.addControl('select-funding-for', 'select');
            arr = this.listItems.getFundingFor();
            control.fill(arr);

            control = this.addControl('input-has-contract-for-help-money', 'radio');

            control = this.addControl('input-money-to-help-with-tender', 'radio');

            control = this.addControl('input-purchase-order-funding', 'radio');

            control = this.addControl('select-fund-application-capacity', 'select');
            arr = this.listItems.getFundingCapacity();
            control.fill(arr);
            
            control = this.addControl('input-involved-in-daily-activities-of-coop', 'radio');
            
            control = this.addControl('input-any-other-loan-with-ecdc', 'radio');
        }

        addHandlers() {
            let self = this;
             // TODO: Refactor!!!
            $('#date-started-trading-date').datepicker().on(
                'changeDate', (e) => {
                    let str = [self.helpers.formatDate(e.date)];
                    let payload = self.dto2Page.tradingTime(str);
                    if (payload != null) {
                        $('#input-application-trading-years').val(payload.years);
                        $('#input-application-trading-months').val(payload.months);
                    }
                });

            self.controls['select-funding-for'].change((key, value) => {
                self.dto2Page.show('div-has-contract-for-help-money', 'input-has-contract-for-help-money', false);
                self.dto2Page.show('div-money-to-help-with-tender', 'input-money-to-help-with-tender', false);
                self.dto2Page.show('div-purchase-order-funding', 'input-purchase-order-funding', false);

                self.controls['input-has-contract-for-help-money'].val('');
                self.controls['input-money-to-help-with-tender'].val('');
                self.controls['input-purchase-order-funding'].val('');

                if (key == self.fundingForGuids['Money to help with a contract'] ||
                    key == this.fundingForGuids['Cash flow assistance'] ||
                    key == this.fundingForGuids['Money to buy stock']) {

                    self.dto2Page.show('div-has-contract-for-help-money', 'input-has-contract-for-help-money', true);
                } else if (key == self.fundingForGuids['Money to help with a tender']) {
                    self.dto2Page.show('div-money-to-help-with-tender', 'input-money-to-help-with-tender', true);
                } else if (key == self.fundingForGuids['Purchase order funding']) {
                    self.dto2Page.show('div-purchase-order-funding', 'input-purchase-order-funding', true);
                } else {

                }
                self.tryActivateImvabaEnterprise();
            });

            this.controls['select-fund-application-capacity'].change((key, value) => {
                self.dto['select-fund-application-capacity'] = [];
                self.dto['select-fund-application-capacity'].push(key);
                self.dto2Page.involvedInDailyCoopActivities(key != '653baf5e9b4cffaa25673c7b');
            });
            this.controls['input-involved-in-daily-activities-of-coop'].click((arg, name, curr, next) => {
                self.dto['input-involved-in-daily-activities-of-coop'] = [];
                self.dto['input-involved-in-daily-activities-of-coop'].push(next);
                self.dto2Page.involvedInDailyCoopActivities(true);
            });
            this.controls['input-any-other-loan-with-ecdc'].click((arg, name, curr, next) => {
                self.dto['input-any-other-loan-with-ecdc'] = [];
                self.dto['input-any-other-loan-with-ecdc'].push(next);
            });
        }
    }

    page.create = function (id) {
        return new FundingRequirements(id);
    }
})(app.wizard.fundingRequirements.page);
