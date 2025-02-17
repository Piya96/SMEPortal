"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.user == undefined) {
    app.wizard.user = {};
}

if (app.wizard.user.validator == undefined) {
    app.wizard.user.validator = {};
}

(function (validator) {

    class Sefa extends app.wizard.user.validator.Baseline {
        constructor(id) {
            super(id);
        }

        addValidations() {
            let fv = super.addValidations();
            fv.addField(
                'select-how-did-you-hear-about-sefa',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection Required'
                        }
                    }
                }
            );
            fv.addField(
                'select-user-profile-sefa-origin-strategic-partner',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection Required'
                        }
                    }
                }
            );
            fv.addField(
                'input-user-profile-sefa-origin-other',
                {
                    validators: {
                        notEmpty: {
                            message: 'Other Required'
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

})(app.wizard.user.validator);
