'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.mandateFit = {};
(function (mandateFit) {

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.getter;

    class Summary {
        constructor() {
            this.json = null;
            this.appId = null;
        }

        getVal(name) {
            return helpers.getNvpValue(this.json, name, 0);
        }

        setVal(name, id, filters = []) {
            let value = this.getVal(name);
            let result = value;
            if (Array.isArray(filters) == true) {
                filters.forEach((func, idx) => {
                    let obj = func(value);
                    value = obj;
                });
            }
            $('#' + id + '-' + this.appId).text(value);
            return result;
        }

        loanAmount() {
            this.setVal("input-mandate-fit-loan-amount", 'mandate-fit-loan-amount', [helpers.formatCurrencyR]);
        }

        reasonForFinance() {
            this.setVal("select-mandate-fit-reason-for-finance", "mandate-fit-reason-for-finance", [listItems.getReasonForFinance]);
        }

        forecastCashFlowRepayable() {
            this.setVal("input-mandate-fit-forecast-cash-flow-repayable", "mandate-fit-forecast-cash-flow-repayable");
        }

        conflictOfInterestAtSefa() {
            this.setVal("input-mandate-fit-conflict-of-interest-at-sefa", "mandate-fit-conflict-of-interest-at-sefa");
        }

        operationsWithinSaBorders() {
            this.setVal("input-mandate-fit-operations-within-boarders-sa", "mandate-fit-operations-within-boarders-sa");
        }

        controllingInterestGreater50Percent() {
            this.setVal("input-mandate-fit-controlling-interest-greater-than-50", "mandate-fit-controlling-interest-greater-than-50");
        }

        shareholderInvolved() {
            this.setVal("input-mandate-fit-shareholder-involved", "mandate-fit-shareholder-involved");
        }

        managementTeamHasXpSkills() {
            this.setVal("input-mandate-fit-management-team-has-xp-skills", "mandate-fit-management-team-has-xp-skills");
        }

        cipcAnnualFeesPaid() {
            this.setVal("input-mandate-fit-cipc-annual-fees-paid", "mandate-fit-cipc-annual-fees-paid");
        }

        taxInGoodStanding() {
            this.setVal("input-mandate-fit-tax-in-good-standing-pin-not-expired", "mandate-fit-tax-in-good-standing-pin-not-expired");
        }

        apply(jsonStr, appId) {
            this.appId = appId;
            let nvp = jsonStr;
            this.json = helpers.nvpArrayToObject(nvp);
            this.appId = appId.toString();

            this.loanAmount();
            this.reasonForFinance();
            this.forecastCashFlowRepayable();
            this.conflictOfInterestAtSefa();
            this.operationsWithinSaBorders();
            this.controllingInterestGreater50Percent();
            this.shareholderInvolved();
            this.managementTeamHasXpSkills();
            this.cipcAnnualFeesPaid();
            this.taxInGoodStanding();
        }
    }

    function Render(jsonStr, appId) {
        let summary = new Summary();
        summary.apply(jsonStr, appId);
    }

    mandateFit.render = function (jsonStr, appId) {
        if (jsonStr != null) {
            Render(jsonStr, appId);
        } else {
        }
    };
}(app.fss.mandateFit));
