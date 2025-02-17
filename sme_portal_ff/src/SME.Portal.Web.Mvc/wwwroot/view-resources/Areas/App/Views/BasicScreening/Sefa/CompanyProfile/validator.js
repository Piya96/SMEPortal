"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.business == undefined) {
    app.wizard.business = {};
}

if (app.wizard.business.validator == undefined) {
    app.wizard.business.validator = {};
}

(function (validator) {

    class Sefa extends app.wizard.business.validator.Baseline {
        constructor(id) {
            super(id);
        }

        addValidations() {
            let fv = super.addValidations();
            fv.addField(
                'select-entity-type',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection Required'
                        }
                    }
                }
            );
            return fv;
        }
    }

    validator.create = function (id) {
        return new Sefa(id);
    };

    validator.Sefa = Sefa;

})(app.wizard.business.validator);
