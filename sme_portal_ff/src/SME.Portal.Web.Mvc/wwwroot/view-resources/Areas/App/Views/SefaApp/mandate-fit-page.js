"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.page == undefined) {
    app.wizard.page = {};
}

(function (page) {

    const SoleProprietor = '5a6ab7ce506ea818e04548ad';
    const Partnership = '5a6ab7d3506ea818e04548b0';

    const mandateFitErrorMessage = 
        '<p>You have not met the requirements for <b>sefa</b> funding products at this time.<br/>\
          Please update your answers/selections (after you press ok), or read the information on the\
          top of the page to find other funding options available to you.</p>';

    class MandateFitPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Mandate Fit Page';
            this.controls = {};
            this.failInfoShow = true;
        }

        validate(data, cb) {
            super.validate(data, cb);
        }

        dtoToPage(dto) {
            let get = app.onboard.helpers.getter(dto);

            let self = this;

            function getVal(name) {
                return self.helpers.getNvpValue(dto, name, 0);
            }
            this.controls['input-mandate-fit-loan-amount'].val(
                get.get('input-mandate-fit-loan-amount', [self.helpers.formatCurrency])
            );

            this.controls['select-mandate-fit-reason-for-finance'].val(
                get.get('select-mandate-fit-reason-for-finance', [self.helpers.getReasonForFinanceSefa])
            );

            this.controls['input-mandate-fit-forecast-cash-flow-repayable'].val(getVal('input-mandate-fit-forecast-cash-flow-repayable'));
            this.controls['input-mandate-fit-conflict-of-interest-at-sefa'].val(getVal('input-mandate-fit-conflict-of-interest-at-sefa'));
            this.controls['input-mandate-fit-operations-within-boarders-sa'].val(getVal('input-mandate-fit-operations-within-boarders-sa'));
            this.controls['input-mandate-fit-controlling-interest-greater-than-50'].val(getVal('input-mandate-fit-controlling-interest-greater-than-50'));
            this.controls['input-mandate-fit-shareholder-involved'].val(getVal('input-mandate-fit-shareholder-involved'));
            this.controls['input-mandate-fit-management-team-has-xp-skills'].val(getVal('input-mandate-fit-management-team-has-xp-skills'));
            this.controls['input-mandate-fit-cipc-annual-fees-paid'].val(getVal('input-mandate-fit-cipc-annual-fees-paid'));
            this.controls['input-mandate-fit-tax-in-good-standing-pin-not-expired'].val(getVal('input-mandate-fit-tax-in-good-standing-pin-not-expired'));

            if (this.isSoleProprietorOrPartnership(this.model.smeCompany.smeCompany) == true) {
                this.toggleCIPCAnnualFees(false);
            } else {
                this.toggleCIPCAnnualFees(true);
            }
        }

        serialize() {
            return super.serialize();
        }

        pageToDto(dto) {
        }

        reset() {
        }

        isSoleProprietorOrPartnership(company) {
            return (company.type == SoleProprietor || company.type == Partnership);
        }

        toggleCIPCAnnualFees(toggle) {
            if (toggle == false) {
                $('#div-mandate-fit-cipc-annual-fees-paid').hide();
                this.validation.toggleValidators(['input-mandate-fit-cipc-annual-fees-paid'], [false]);
                this.controls['input-mandate-fit-cipc-annual-fees-paid'].val('Yes');
            } else {
                $('#div-mandate-fit-cipc-annual-fees-paid').show();
                this.validation.toggleValidators(['input-mandate-fit-cipc-annual-fees-paid'], [true]);
            }
        }

        load(args, cb) {
            self = this;
            // TODO: Look at the wizard controller serializing and re-parsing the model on load to keep a proper copy for the wizard.
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            let dto = this.helpers.nvpArrayToObject(mc);
            this.dtoToPage(dto);
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            if (args.isNext == true) {
                let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
                let dto = this.helpers.nvpArrayToObject(mc);
                this.dtoToPage(dto);
            }
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            cb(app.wizard.addResult());
        }

        neglect(args, cb) {
            cb(app.wizard.addResult());
        }

        mandateFitCheck(cb) {
            abp.services.app.applicationAppServiceExt.mandateFitCheck(this.model.application.application.id).done(function (payload) {
                let json = JSON.parse(payload);
                let result = app.wizard.addResult();
                if (json.Success == false) {
                    result.status = app.wizard.Result.Fail;
                    result.message = mandateFitErrorMessage;
                } else {
                }
                cb(result);
            });
        }

        validate(args, cb) {
            this.mandateFitCheck((result) => {
                $('#parent-mandatefit-fail-info').hide('fast');
                $('#div-program-not-active').hide('fast');
                if (result.status == app.wizard.Result.Success) {
                    $('#parent-madate-fit-fail').hide('fast');
                    $('#parent-madate-fit-pass').show('fast');
                } else {
                    $('#parent-madate-fit-pass').hide('fast');
                    $('#parent-madate-fit-fail').show('fast');
                }
                this.failInfoShow = true;
                cb(result);
            });
        }

        addControls() {
            this.controls['input-mandate-fit-loan-amount'] = app.control.input('input-mandate-fit-loan-amount', 'input-mandate-fit-loan-amount');
            this.controls['select-mandate-fit-reason-for-finance'] = app.control.select('select-mandate-fit-reason-for-finance', 'select-mandate-fit-reason-for-finance');
            this.controls['input-mandate-fit-forecast-cash-flow-repayable'] = app.control.radio('input-mandate-fit-forecast-cash-flow-repayable');
            this.controls['input-mandate-fit-conflict-of-interest-at-sefa'] = app.control.radio('input-mandate-fit-conflict-of-interest-at-sefa');
            this.controls['input-mandate-fit-operations-within-boarders-sa'] = app.control.radio('input-mandate-fit-operations-within-boarders-sa');
            this.controls['input-mandate-fit-controlling-interest-greater-than-50'] = app.control.radio('input-mandate-fit-controlling-interest-greater-than-50');
            this.controls['input-mandate-fit-shareholder-involved'] = app.control.radio('input-mandate-fit-shareholder-involved');
            this.controls['input-mandate-fit-management-team-has-xp-skills'] = app.control.radio('input-mandate-fit-management-team-has-xp-skills');

            this.controls['input-mandate-fit-cipc-annual-fees-paid'] = app.control.radio('input-mandate-fit-cipc-annual-fees-paid');
            this.controls['input-mandate-fit-tax-in-good-standing-pin-not-expired'] = app.control.radio('input-mandate-fit-tax-in-good-standing-pin-not-expired');

            let arr = app.listItems.obj.getReasonForFinance();
            this.controls['select-mandate-fit-reason-for-finance'].fill(arr);
        }

        addHandlers() {
            let self = this;
            this.controls['input-mandate-fit-loan-amount'].format(10, function (val) {
                return self.helpers.formatCurrency(val);
            });

            $('#a-mandatefit-fail-redirect').on('click', (ev) => {
            });

            $('#a-mandatefit-fail-info').on('click', (ev) => {
                if (this.failInfoShow == true) {
                    $('#parent-mandatefit-fail-info').show('fast');
                } else {
                    $('#parent-mandatefit-fail-info').hide('fast');
                }
                this.failInfoShow ^= true;
            });
        }
    }

    page.getMandateFitPage = function (id) {
        return new MandateFitPage(id);
    }
})(app.wizard.page);
