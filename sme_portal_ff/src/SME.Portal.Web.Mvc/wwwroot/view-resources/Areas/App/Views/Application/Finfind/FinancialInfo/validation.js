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

    class Finfind extends app.wizard.financialInfo.validator.Baseline {
        constructor(id) {
            super(id);
        }

        addValidations() {
            let fv = super.addValidations();

            this.validations.map.set('input-made-profit-over-last-6-months', 'message-made-profit-over-last-6-months');
            this.validations.map.set('input-has-invested-own-money', 'message-has-invested-own-money');
            this.validations.map.set('select-invested-own-money-value', 'message-invested-own-money-value');

            let self = this;

            fv.addField(
                'input-made-profit-over-last-6-months',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or No Required'
                        }
                    }
                }
            );

            fv.addField(
                'input-has-invested-own-money',
                {
                    validators: {
                        notEmpty: {
                            message: 'Yes or No Required'
                        }
                    }
                }
            );

            fv.addField(
                'select-invested-own-money-value',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection required'
                        }
                    }
                }
            );
            return fv;
        }
    }

    validator.create = function (id) {
        return new Finfind(id);
    };

    validator.Finfind = Finfind;

})(app.wizard.financialInfo.validator);
