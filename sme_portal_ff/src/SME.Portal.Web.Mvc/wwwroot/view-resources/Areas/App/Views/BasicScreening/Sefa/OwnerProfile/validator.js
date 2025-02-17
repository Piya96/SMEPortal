"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.validation == undefined) {
    app.wizard.validation = {};
}

if (app.wizard.owner.validator == undefined) {
    app.wizard.owner.validator = {};
}

(function (validator) {

    class Sefa extends app.wizard.owner.validator.Baseline {
        constructor(id) {
            super(id);
        }

        addValidations() {
            let fv = super.addValidations();
            fv.addField(
                'input-owner-is-disabled',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select Yes or No'
                        }
                    }
                }
            );
            //fv.addField(
            //    'input-owner-profile-race-other',
            //    {
            //        validators: {
            //            notEmpty: {
            //                message: 'Race required'
            //            }
            //        }
            //    }
            //);
            fv.addField(
                'input-owner-profile-registered-address',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select Yes or No'
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

})(app.wizard.owner.validator);
