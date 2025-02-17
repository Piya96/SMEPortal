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

    class Baseline extends app.wizard.validator.Base{
        constructor (id) {
            super(id);
        }
    
        getValEx(name) {
            let val1 = $('#' + name).val();
            let val2 = parseInt(val1);
            return val2;
        }

        pemranentEmployeeCheck() {
            return null;
        }

        addValidations() {
            super.addValidations();
            
            this.validations.map.set('date-started-trading-date','message-started-trading-date');

            this.validations.map.set("input-total-number-of-employees", 'message-total-number-of-employees');
            this.validations.map.set("input-registered-for-coida", 'message-registered-for-coida');

            this.validations.map.set("input-number-of-permanent-employees", 'message-number-of-permanent-employees');
            this.validations.map.set("input-number-of-permanent-youth-employees-under35", 'message-number-of-permanent-youth-employees-under35');
            this.validations.map.set("input-number-of-permanent-female-employees", 'message-number-of-permanent-female-employees');
            this.validations.map.set("input-number-of-permanent-black-employees", 'message-number-of-permanent-black-employees');

            this.validations.map.set("input-number-of-new-jobs-created-through-loan", 'message-number-of-new-jobs-created-through-loan');
            this.validations.map.set("input-number-of-existing-jobs-sustained", 'message-number-of-existing-jobs-sustained');

            this.validations.map.set("input-number-of-part-time-employees", 'message-number-of-part-time-employees');
            this.validations.map.set("input-number-of-part-time-youth-employees-under35", 'message-number-of-part-time-youth-employees-under35');
            this.validations.map.set("input-number-of-part-time-female-employees", 'message-number-of-part-time-female-employees');
            this.validations.map.set("input-number-of-part-time-black-employees", 'message-number-of-part-time-black-employees');
            this.validations.map.set("input-number-of-new-part-time-jobs-created-through-loan", 'message-number-of-new-part-time-jobs-created-through-loan');
            this.validations.map.set("input-number-of-existing-part-time-jobs-sustained", 'message-number-of-existing-part-time-jobs-sustained');

            this.validations.map.set('select-company-profile-bee-level', 'message-company-profile-bee-level');


            this.validations.map.set("input-percent-ownership-by-south-africans", 'message-percent-ownership-by-south-africans');
            this.validations.map.set("input-percent-black-coloured-indian-pdi", 'message-percent-black-coloured-indian-pdi');
            this.validations.map.set("input-percent-black-south-africans-only", 'message-percent-black-south-africans-only');
            this.validations.map.set("input-percent-white-only", 'message-percent-white-only');
            this.validations.map.set("input-percent-asian-only", 'message-percent-asian-only');
            this.validations.map.set("input-percent-disabled-people", 'message-percent-disabled-people');
            this.validations.map.set("input-percent-youth-under-35", 'message-percent-youth-under-35');
            this.validations.map.set("input-percent-women-women-any-race", 'message-percent-women-women-any-race');
            this.validations.map.set("input-percent-women-black-only", 'message-percent-women-black-only');

            this.validations.map.set("input-military-veteran-owners", 'message-military-veteran-owners');

            this.validations.map.set("input-percent-non-south-african-citizens", 'message-percent-non-south-african-citizens');
            this.validations.map.set("input-percent-companies-organisations", 'message-percent-companies-organisations');
            this.validations.map.set("input-total-number-of-owners", 'message-total-number-of-owners');

            this.validations.map.set('business-owners-dummy', 'message-business-owners-dummy');

            // ECDC
            this.validations.map.set('input-military-veteran-owners', 'message-military-veteran-owners');
            this.validations.map.set('input-number-of-permanent-non-sa-employees', 'message-number-of-permanent-non-sa-employees');
            this.validations.map.set('input-number-of-permanent-disabled-employees', 'message-number-of-permanent-disabled-employees');
            this.validations.map.set('input-number-of-part-time-non-sa-employees', 'message-number-of-part-time-non-sa-employees');
            this.validations.map.set('input-number-of-part-time-disabled-employees', 'message-number-of-part-time-disabled-employees');

            let self = this;

            function addEmployees(fv) {

                function getVal(name) {
                    return parseInt($('#' + name).val());
                }

                let names = [];
                function addNames() {
                    names = [];
                    names.push('input-total-number-of-employees');

                    names.push('input-number-of-permanent-employees');
                    names.push('input-number-of-permanent-youth-employees-under35');
                    names.push('input-number-of-permanent-female-employees');
                    names.push('input-number-of-permanent-black-employees');

                    if (self.isFieldEnabled('input-number-of-permanent-non-sa-employees') == true) {
                        names.push('input-number-of-permanent-non-sa-employees');
                    }
                    if (self.isFieldEnabled('input-number-of-permanent-disabled-employees') == true) {
                        names.push('input-number-of-permanent-disabled-employees');
                    }

                    names.push('input-number-of-new-jobs-created-through-loan');
                    names.push('input-number-of-existing-jobs-sustained');

                    names.push('input-number-of-part-time-employees');
                    names.push('input-number-of-part-time-youth-employees-under35');
                    names.push('input-number-of-part-time-female-employees');
                    names.push('input-number-of-part-time-black-employees');

                    if (self.isFieldEnabled('input-number-of-part-time-non-sa-employees') == true) {
                        names.push('input-number-of-part-time-non-sa-employees');
                    }
                    if (self.isFieldEnabled('input-number-of-part-time-disabled-employees') == true) {
                        names.push('input-number-of-part-time-disabled-employees');
                    }

                    if (self.isFieldEnabled('input-number-of-new-part-time-jobs-created-through-loan') == true) {
                        names.push('input-number-of-new-part-time-jobs-created-through-loan');
                    }
                    if (self.isFieldEnabled('input-number-of-existing-part-time-jobs-sustained') == true) {
                        names.push('input-number-of-existing-part-time-jobs-sustained');
                    }
                }

                function areAnyEmpty() {
                    addNames();
                    for (let i = 0, max = names.length; i < max; i++) {
                        if ($('#' + names[i]).val() == '') {
                            return true;
                        }
                    }
                    return false;
                }

                let count = 0;

                function validateAll() {
                    addNames();
                    count = names.length;
                    self.validateFields(names);
                }

                function callBackFunc(fn) {
                    if (areAnyEmpty() == true) {
                        return true;
                    }
                    if (count > 0) {
                        count--;
                        let result = fn();
                        if (self.helpers.isObject(result) == true) {
                            return result;
                        }
                    } else {
                        setTimeout(validateAll, 10);
                    }
                    return true;
                }

                fv.addField(
                    'date-started-trading-date',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Date required'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-registered-for-coida',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Yes or No required'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-total-number-of-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    setTimeout(() => {
                                        let v4 = parseInt($('#input-total-number-of-employees').val());
                                        let show = (v4 != 0 && isNaN(v4) == false);
                                        self.pageCallback.onValidateField(
                                            'input-registered-for-coida', true, show);
                                    }, 10);
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-total-number-of-employees').val());
                                        let v2 = parseInt($('#input-number-of-permanent-employees').val());
                                        let v3 = parseInt($('#input-number-of-part-time-employees').val());
                                        if (v1 == 0) {
                                            return {
                                                valid: false,
                                                message: 'Total number of employees must be greater than zero'
                                            }
                                        } else {
                                            if (v1 != (v2 + v3)) {
                                                return {
                                                    valid: false,
                                                    message: 'Number of employees must equal number of permanent plus number of part-time employees'
                                                }
                                            }
                                        }
                                        return true;
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-permanent-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-total-number-of-employees').val());
                                        let v2 = parseInt($('#input-number-of-permanent-employees').val());
                                        let v3 = parseInt($('#input-number-of-part-time-employees').val());
                                        if (v2 == 0 && v3 == 0) {
                                            return {
                                                valid: false,
                                                message: 'Either one or both permanent and part-time employees must be greater than zero'
                                            }
                                        }
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of permanent employees must not exceed total number of employees'
                                            }
                                        }
                                        // TODO: Move to ECDC derived class.
                                        let check = self.pemranentEmployeeCheck();
                                        if (check != null) {
                                            return check;
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-permanent-youth-employees-under35',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-permanent-employees').val());
                                        let v2 = parseInt($('#input-number-of-permanent-youth-employees-under35').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of permanent youth employees under 35 must not exceed number of permanent employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-permanent-female-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-permanent-employees').val());
                                        let v2 = parseInt($('#input-number-of-permanent-female-employees').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of permanent Female employees must not exceed number of permanent employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-permanent-black-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-permanent-employees').val());
                                        let v2 = parseInt($('#input-number-of-permanent-black-employees').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of permanent Black employees must not exceed number of permanent employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-permanent-non-sa-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-permanent-employees').val());
                                        let v2 = parseInt($('#input-number-of-permanent-non-sa-employees').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of permanent non South African employees must not exceed number of permanent employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-permanent-disabled-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-permanent-employees').val());
                                        let v2 = parseInt($('#input-number-of-permanent-disabled-employees').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of permanent disabled employees must not exceed number of permanent employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-new-jobs-created-through-loan',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        //let v1 = parseInt($('#input-number-of-permanent-employees').val());
                                        //let v2 = parseInt($('#input-number-of-new-jobs-created-through-loan').val());
                                        //if (v2 > v1) {
                                        //    return {
                                        //        valid: false,
                                        //        message: 'Number of permanent jobs retained must not exceed total number of permanent employees'
                                        //    }
                                        //}
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-existing-jobs-sustained',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-permanent-employees').val());
                                        let v2 = parseInt($('#input-number-of-existing-jobs-sustained').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Jobs sustained cannot exceed total permanent jobs'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-part-time-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-total-number-of-employees').val());
                                        let v2 = parseInt($('#input-number-of-permanent-employees').val());
                                        let v3 = parseInt($('#input-number-of-part-time-employees').val());
                                        if (v2 == 0 && v3 == 0) {
                                            return {
                                                valid: false,
                                                message: 'Either one or both permanent and part-time employees must be greater than zero'
                                            }
                                        }
                                        if (v3 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of part-time employees must not exceed number of employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-part-time-youth-employees-under35',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-part-time-employees').val());
                                        let v2 = parseInt($('#input-number-of-part-time-youth-employees-under35').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of part-time youth employees under 35 must not exceed number of part-time employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-part-time-female-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-part-time-employees').val());
                                        let v2 = parseInt($('#input-number-of-part-time-female-employees').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of part-time Female employees must not exceed number of part-time employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-part-time-black-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-part-time-employees').val());
                                        let v2 = parseInt($('#input-number-of-part-time-black-employees').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of part-time Black employees must not exceed number of part-time employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-part-time-non-sa-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-part-time-employees').val());
                                        let v2 = parseInt($('#input-number-of-part-time-non-sa-employees').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of part-time non South African employees must not exceed number of part-time employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-part-time-disabled-employees',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-part-time-employees').val());
                                        let v2 = parseInt($('#input-number-of-part-time-disabled-employees').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of part-time disabled employees must not exceed number of part-time employees'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-new-part-time-jobs-created-through-loan',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-number-of-existing-part-time-jobs-sustained',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = parseInt($('#input-number-of-part-time-employees').val());
                                        let v2 = parseInt($('#input-number-of-existing-part-time-jobs-sustained').val());
                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Jobs sustained cannot exceed total part-time jobs'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

            }

            function addOwnership(fv) {

                let names = [];

                function addNames() {
                    names = [];
                    names.push('input-percent-ownership-by-south-africans');
                    names.push('input-percent-black-coloured-indian-pdi');
                    names.push('input-percent-black-south-africans-only');
                    names.push('input-percent-white-only');
                    names.push('input-percent-asian-only');
                    names.push('input-percent-disabled-people');
                    names.push('input-percent-youth-under-35');
                    names.push('input-percent-women-women-any-race');
                    names.push('input-percent-women-black-only');
                    names.push('input-percent-non-south-african-citizens');
                    names.push('input-total-number-of-owners',);

                    if (self.isFieldEnabled('input-percent-companies-organisations') == true) {
                        names.push('input-percent-companies-organisations');
                    }
                    if (self.isFieldEnabled('input-military-veteran-owners') == true) {
                        names.push('input-military-veteran-owners');
                    }
                }

                function areAnyEmpty() {
                    addNames();
                    for (let i = 0, max = names.length; i < max; i++) {
                        if ($('#' + names[i]).val() == '') {
                            return true;
                        }
                    }
                    return false;
                }

                function resetInput(value) {
                    $('#input-percent-black-coloured-indian-pdi').val(value);
                    $('#input-percent-black-south-africans-only').val(value);
                    $('#input-percent-white-only').val(value);
                    $('#input-percent-asian-only').val(value);
                    $('#input-percent-disabled-people').val(value);
                    $('#input-percent-youth-under-35').val(value);
                    $('#input-percent-women-women-any-race').val(value);
                    $('#input-percent-women-black-only').val(value);
                    $('#input-military-veteran-owners').val(value);
                }

                function enableInput(enable) {
                    $('#input-percent-black-coloured-indian-pdi').prop('disabled', enable ^ true);
                    $('#input-percent-black-south-africans-only').prop('disabled', enable ^ true);
                    $('#input-percent-white-only').prop('disabled', enable ^ true);
                    $('#input-percent-asian-only').prop('disabled', enable ^ true);
                    $('#input-percent-disabled-people').prop('disabled', enable ^ true);
                    $('#input-percent-youth-under-35').prop('disabled', enable ^ true);
                    $('#input-percent-women-women-any-race').prop('disabled', enable ^ true);
                    $('#input-percent-women-black-only').prop('disabled', enable ^ true);
                    $('#input-military-veteran-owners').prop('disabled', enable ^ true);
                }

                function getVal(name) {
                    return parseInt($('#' + name).val());
                }

                let count = 0;
                function validateAll() {
                    addNames();
                    count = names.length;
                    self.validateFields(names);
                }

                fv.addField(
                    'input-percent-ownership-by-south-africans',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-companies-organisations');

                                        let v5 = getVal('input-percent-black-coloured-indian-pdi');
                                        let v6 = getVal('input-percent-black-south-africans-only');
                                        let v7 = getVal('input-percent-white-only');
                                        let v8 = getVal('input-percent-asian-only');
                                        let v9 = getVal('input-percent-disabled-people');
                                        let v10 = getVal('input-percent-youth-under-35');
                                        let v11 = getVal('input-percent-women-women-any-race');
                                        let v12 = getVal('input-percent-women-black-only');

                                        let v13 = 0;
                                        if (self.isFieldEnabled('input-military-veteran-owners') == true) {
                                            v13 = getVal('input-military-veteran-owners');
                                        }

                                        if (v2 > 0) {
                                            enableInput(true);
                                        }

                                        if (self.isFieldEnabled('input-percent-companies-organisations') == true) {
                                            if (v2 == 0 && (v3 > 0 || v4 > 0)) {
                                                resetInput(0);
                                                enableInput(false);
                                            }
                                        } else {
                                            if (v2 == 0 && (v3 > 0)) {
                                                resetInput(0);
                                                enableInput(false);
                                            }
                                        }


                                        if (self.isFieldEnabled('input-percent-companies-organisations') == true) {
                                            if (v2 == 0 && v3 == 0 && v4 == 0) {
                                                enableInput(true);
                                                return {
                                                    valid: false,
                                                    message: 'At least one value must be greater than zero for total South Africans, Non-South Africans, and Companies/organisations'
                                                }
                                            }
                                        } else {
                                            if (v2 == 0 && v3 == 0) {
                                                enableInput(true);
                                                return {
                                                    valid: false,
                                                    message: 'At least one value must be greater than zero for total South Africans, Non-South Africans'
                                                }
                                            }
                                        }


                                        if (v2 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of South Africans must not exceed number owners'
                                            }
                                        }

                                        if (v2 > 0) {
                                            if (v5 == 0 && v6 == 0 && v7 == 0 && v8 == 0 && v9 == 0 && v10 == 0 && v11 == 0 && v12 == 0 && v13 == 0) {
                                                return {
                                                    valid : false,
                                                    message : 'At least one of the eight fields below must be greater than zero'
                                                }
                                            }
                                        }

                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-black-coloured-indian-pdi',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-black-coloured-indian-pdi');
                                        let v5 = getVal('input-percent-white-only');
                                        let v6 = getVal('input-percent-asian-only');
                                        if (v4 > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of Black, Coloured, and Indian must not exceed number of South Africans'
                                            }
                                        }
                                        if ((v4 + v5 + v6) > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of Black, Coloured, and Indian plus number of White plus number of Asian must not exceed number of South Africans'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-black-south-africans-only',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-black-coloured-indian-pdi');
                                        let v5 = getVal('input-percent-black-south-africans-only');
                                        if (v5 > v4) {
                                            return {
                                                valid: false,
                                                message: 'Number of Black South Africans must not exceed number of Black, Coloured, and Indian'
                                            }
                                        }
                                        if (v5 > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of Black South Africans must not exceed number of South Africans'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-white-only',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-white-only');
                                        if (v4 > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of White only must not exceed number of South Africans'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-asian-only',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-asian-only');
                                        if (v4 > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of Asian only must not exceed number of South Africans'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-disabled-people',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-disabled-people');
                                        if (v4 > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of disabled people must not exceed number of South Africans'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-youth-under-35',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-youth-under-35');
                                        if (v4 > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of youth under 35 must not exceed number of South Africans'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-women-women-any-race',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-women-women-any-race');
                                        if (v4 > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of Women of any race must not exceed number of South Africans'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-women-black-only',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-women-women-any-race');
                                        let v5 = getVal('input-percent-women-black-only');
                                        if (v5 > v4) {
                                            return {
                                                valid: false,
                                                message: 'Number of Black Women only must not exceed number of Women any race '
                                            }
                                        }
                                        if (v5 > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of Black Women only must not exceed number of South Africans'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-military-veteran-owners',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-military-veteran-owners');
                                        if (v4 > v2) {
                                            return {
                                                valid: false,
                                                message: 'Number of veteran owners must not exceed number of South Africans'
                                            }
                                        }
                                    }
                                    return true;
                                },
                                message: 'Please enter value'
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-non-south-african-citizens',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-companies-organisations');

                                        if (self.isFieldEnabled('input-percent-companies-organisations') == true) {
                                            if (v2 == 0 && v3 == 0 && v4 == 0) {
                                                enableInput(true);
                                                return {
                                                    valid: false,
                                                    message: 'At least one value must be greater than zero for total South Africans, Non-South Africans, and Companies/organisations'
                                                }
                                            }
                                        } else {
                                            if (v2 == 0 && v3 == 0) {
                                                enableInput(true);
                                                return {
                                                    valid: false,
                                                    message: 'At least one value must be greater than zero for total South Africans, Non-South Africans'
                                                }
                                            }
                                        }

                                        if (v3 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of non South Africans must not exceed number owners'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-percent-companies-organisations',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-companies-organisations');

                                        if (self.isFieldEnabled('input-percent-companies-organisations') == true) {
                                            if (v2 == 0 && v3 == 0 && v4 == 0) {
                                                enableInput(true);
                                                return {
                                                    valid: false,
                                                    message: 'At least one value must be greater than zero for total South Africans, Non-South Africans, and Companies/organisations'
                                                }
                                            }
                                        } else {
                                            if (v2 == 0 && v3 == 0) {
                                                enableInput(true);
                                                return {
                                                    valid: false,
                                                    message: 'At least one value must be greater than zero for total South Africans, Non-South Africans'
                                                }
                                            }
                                        }

                                        if (v4 > v1) {
                                            return {
                                                valid: false,
                                                message: 'Number of companies / organisations must not exceed number owners'
                                            }
                                        }
                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );

                fv.addField(
                    'input-total-number-of-owners',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (arg) {
                                    if (areAnyEmpty() == true) {
                                        return true;
                                    }
                                    if (count > 0 || self.validating == true) {
                                        count--;
                                        let v1 = getVal('input-total-number-of-owners');
                                        let v2 = getVal('input-percent-ownership-by-south-africans');
                                        let v3 = getVal('input-percent-non-south-african-citizens');
                                        let v4 = getVal('input-percent-companies-organisations');
                                        if (v1 == 0) {
                                            return {
                                                valid : false,
                                                message : 'Number of owners must be greater than zero'
                                            }
                                        }
                                        // 0 will work here if not active.
                                        if (self.isFieldEnabled('input-percent-companies-organisations') == true) {
                                            if ((v2 + v3 + v4) != v1) {
                                                return {
                                                    valid: false,
                                                    message: 'Number of owners must be equal total South Africans plus Non-South Africans plus Companies/organisations'
                                                }
                                            }
                                        } else {
                                            if ((v2 + v3) != v1) {
                                                return {
                                                    valid: false,
                                                    message: 'Number of owners must be equal total South Africans plus Non-South Africans'
                                                }
                                            }
                                        }

                                    } else {
                                        setTimeout(validateAll, 10);
                                    }
                                    return true;
                                },
                                message: ''
                            }
                        }
                    }
                );
            }

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
                }
            );

            fv.addField(
                'select-company-profile-bee-level',
                {
                    validators: {
                        notEmpty: {
                            message: 'Selection required'
                        }
                    }
                }
            );

            addEmployees(fv);

            addOwnership(fv);

            return fv;
        }
    }

    validator.Baseline = Baseline;

    validator.create = function(id) {
        return new Baseline(id);
    };

})(app.wizard.companyInfo.validator);
