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

if (app.wizard.financialInfo.validator == undefined) {
    app.wizard.financialInfo.validator = {};
}

(function (validator) {

    class ECDC extends app.wizard.financialInfo.validator.Baseline {
        constructor(id) {
            super(id);
        }

        addValidations() {
            this.validations.map.set('input-owner-invested-own-money', 'message-owner-invested-own-money');
            this.validations.map.set('input-business-premises-and-or-property-value-directors', 'message-business-premises-and-or-property-value-directors');
            this.validations.map.set('input-business-made-profit-over-last-6-months', 'message-business-made-profit-over-last-6-months');
            this.validations.map.set('input-up-to-date-audited-managements-accounts', 'message-up-to-date-audited-managements-accounts');
            this.validations.map.set('input-owners-contribution', 'message-owners-contribution');

            let fv = super.addValidations();

            fv.addField(
                'input-owner-invested-own-money',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or No required'
                        }
                    }
                }
            );

            fv.addField(
                'input-business-premises-and-or-property-value-directors',
                {
                    validators: {
                        notEmpty: {
                            message: 'Please enter value'
                        }
                    }
                }
            );

            fv.addField(
                'input-business-made-profit-over-last-6-months',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or No required'
                        }
                    }
                }
            );

            fv.addField(
                'input-up-to-date-audited-managements-accounts',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or No required'
                        }
                    }
                }
            );

            fv.addField(
                'input-owners-contribution',
                {
                    validators: {
                        notEmpty: {
                            message: 'Please enter value'
                        }
                    }
                }
            );

            return fv;
        }
    }

    validator.create = function (id) {
        return new ECDC(id);
    };

    validator.ECDC = ECDC;

})(app.wizard.financialInfo.validator);
