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

if (app.wizard.companyInfo.validator == undefined) {
    app.wizard.companyInfo.validator = {};
}

(function (validator) {

    class ECDC extends app.wizard.companyInfo.validator.Baseline {
        constructor(id) {
            super(id);
        }

        pemranentEmployeeCheck() {
            let productGuid = $('#input-product-guid').val();
            if (productGuid == app.wizard.common.page.productGuids.JobStimulusFund) {
                let v1 = this.getValEx('input-number-of-permanent-employees');
                if (v1 < 5 || v1 > 200) {
                    return {
                        valid: false,
                        message:
                            'A minimum of 5 and a maximum of 200 permanent jobs are required to\
                                                            qualify for Job Stimulus incentive.  Please correct the totals before you\
                                                            can continue or cancel your application.'
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }

        addValidations() {
            let fv = super.addValidations();

            let self = this;

            return fv;
        }
    }

    validator.create = function (id) {
        return new ECDC(id);
    };

    validator.ECDC = ECDC;

})(app.wizard.companyInfo.validator);
