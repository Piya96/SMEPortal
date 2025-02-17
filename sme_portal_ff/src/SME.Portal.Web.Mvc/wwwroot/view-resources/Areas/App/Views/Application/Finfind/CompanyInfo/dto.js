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

if (app.wizard.companyInfo.dto == undefined) {
    app.wizard.companyInfo.dto = {};
}

(function (dto) {
    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    dto.controls['date-started-trading-date'] = { type: 'date', label: 'What date did you start trading?', filters: { } };

    class DtoToHtml_Tenant extends app.wizard.companyInfo.dto.DtoToHtml {

        constructor(self) {
            super(self);
        }

        showBeeLevel() {
            return (
                true
            );
        }

        showTotalNumberOfPermanentNonSAEmployees() {
            return (
                true
            );
        }

        showTotalNumberOfPermanentDisabledEmployees() {
            return (
                true
            );
        }

        showTotalNumberOfPartTimeNonSAEmployees() {
            return (
                true
            );
        }

        showTotalNumberOfPartTimeDisabledEmployees() {
            return (
                true
            );
        }

        showNumberOfMilitaryVeterans() {
            return (
                true
            );
        }

        showPercentCompaniesOrganisations() {
            return (
                true
            );
        }

        tradingTime(str) {
            return helpers.getYearsAndMonths(str);
        }

        startedTrading() {
            let str = this.set('date-started-trading-date', true);
            let payload = this.tradingTime(str);
            if (payload == null) {
                return;
            }
            //this.set('input-application-trading-years', true);
            //this.set('input-application-trading-months', true);

            $('#input-application-trading-years').val(payload.years);
            $('#input-application-trading-months').val(payload.months);
            return str;
        }

        partTimeEmployeesJobInfo() {
            // TODO: Make a base method that does this all in one.
            $('#div-part-time-employees-job-info').hide();

            this.show('', 'input-number-of-new-part-time-jobs-created-through-loan', false);
            this.show('', 'input-number-of-existing-part-time-jobs-sustained', false);
        }

        apply(dto) {
            super.apply(dto);
            this.startedTrading();
            this.partTimeEmployeesJobInfo();
        }
    }

    dto.getDto = function (dto) {
        return new DtoToHtml_Tenant(dto);
    }

    dto.DtoToHtml_Tenant = DtoToHtml_Tenant;

})(app.wizard.companyInfo.dto);
