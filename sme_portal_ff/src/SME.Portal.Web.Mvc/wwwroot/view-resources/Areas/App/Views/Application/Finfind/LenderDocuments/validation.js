"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.lenderDocuments == undefined) {
    app.wizard.lenderDocuments = {};
}

if (app.wizard.lenderDocuments.validator == undefined) {
    app.wizard.lenderDocuments.validator = {};
}

(function (validator) {

    class Finfind extends app.wizard.validator.Base {
        constructor(id) {
            super(id);
        }

        addFields(fv) {
            let errorStr1 = 'Please select Yes or No';
            for (let i = 0; i < 18; i++) {
                let name = 'one' + (i + 1).toString();
                fv.addField(
                    name,
                    {
                        validators: {
                            notEmpty: {
                                message: errorStr1
                            }
                        }
                    }
                );
            }

            let errorStr2 = 'Please select Yes, No or Not Applicable';
            for (let i = 18; i < 22; i++) {
                let name = 'one' + (i + 1).toString();
                fv.addField(
                    name,
                    {
                        validators: {
                            notEmpty: {
                                message: errorStr2
                            }
                        }
                    }
                );
            }
        }

        addValidations() {
            super.addValidations();
            for (let i = 0; i < 22; i++) {
                let name = 'one' + (i + 1).toString();
                let message = 'message-' + name;
                this.validations.map.set(name, message);
            }
            let self = this;
            let fv = FormValidation.formValidation(
                document.getElementById(this.id), {
                fields: {
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap({
                        defaultMessageContainer: false
                    }),
                    messages: new FormValidation.plugins.Message({
                        clazz: 'text-danger',
                        container: function (field, element) {
                            if (self.validations.map.has(field) == true) {
                                let data = self.validations.map.get(field);
                                return document.getElementById(data);
                            } else {
                                return document.getElementById(self.id);
                            }
                        }
                    })
                }
            });
            this.addFields(fv);
            return fv;
        }
    }

    validator.create = function (id) {
        return new Finfind(id);
    };

    validator.Finfind = Finfind;

})(app.wizard.lenderDocuments.validator);
