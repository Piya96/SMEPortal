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

(function (validation) {

    class EmployeesOwnershipValidator extends app.wizard.validation.Validation {
        constructor(id) {
            super(id);
            this.groups = [
                [
                    "input-business-years-in-operation",
                    "input-total-number-of-employees",
                    "input-number-of-permanent-employees",
                    "input-number-of-permanent-youth-employees-under35",
                    "input-number-of-permanent-female-employees",
                    "input-number-of-permanent-black-employees",
                    "input-number-of-new-jobs-created-through-loan",
                    "input-number-of-existing-jobs-sustained"
                ],
                [
                    "input-percent-ownership-by-south-africans",
                    "input-percent-black-coloured-indian-pdi",
                    "input-percent-black-south-africans-only",
                    "input-percent-white-only",
                    "input-percent-disabled-people",
                    "input-percent-youth-under-35",
                    "input-percent-women-women-any-race",
                    "input-percent-non-south-african-citizens",
                    "input-percent-companies-organisations",
                    "input-total-number-of-owners"
                ]
            ];
        }

        addValidations() {
            super.addValidations();

            this.validations.map.set("input-business-years-in-operation", 'message-business-years-in-operation');
            this.validations.map.set("input-total-number-of-employees", 'message-total-number-of-employees');
            this.validations.map.set("input-number-of-permanent-employees", 'message-number-of-permanent-employees');
            this.validations.map.set("input-number-of-permanent-youth-employees-under35", 'message-number-of-permanent-youth-employees-under35');
            this.validations.map.set("input-number-of-permanent-female-employees", 'message-number-of-permanent-female-employees');
            this.validations.map.set("input-number-of-permanent-black-employees", 'message-number-of-permanent-black-employees');
            this.validations.map.set("input-number-of-new-jobs-created-through-loan", 'message-number-of-new-jobs-created-through-loan');
            this.validations.map.set("input-number-of-existing-jobs-sustained", 'message-number-of-existing-jobs-sustained');

            this.validations.map.set("input-percent-ownership-by-south-africans", 'message-percent-ownership-by-south-africans');
            this.validations.map.set("input-percent-black-coloured-indian-pdi", 'message-percent-black-coloured-indian-pdi');
            this.validations.map.set("input-percent-black-south-africans-only", 'message-percent-black-south-africans-only');
            this.validations.map.set("input-percent-white-only", 'message-percent-white-only');
            this.validations.map.set("input-percent-asian-only", 'message-percent-asian-only');
            this.validations.map.set("input-percent-disabled-people", 'message-percent-disabled-people');
            this.validations.map.set("input-percent-youth-under-35", 'message-percent-youth-under-35');
            this.validations.map.set("input-percent-women-women-any-race", 'message-percent-women-women-any-race');
            this.validations.map.set("input-percent-women-black-only", 'message-percent-women-black-only');
            this.validations.map.set("input-percent-non-south-african-citizens", 'message-percent-non-south-african-citizens');
            this.validations.map.set("input-percent-companies-organisations", 'message-percent-companies-organisations');
            this.validations.map.set("input-total-number-of-owners", 'message-total-number-of-owners');

            this.validations.map.set('business-owners-dummy', 'message-business-owners-dummy');

            let self = this;
            // Business / employees.
            function addGroup1(fv) {

                // Checks if src <= dst. If any of these values turn out to be invalid, the comparison cannot happen, and we return true.
                function isLessOrEqual(src, dst) {
                    let v1 = self.helpers.getInt(src);
                    let v2 = self.helpers.getInt(dst);
                    if (v1.ret == true && v2.ret == true) {
                        return v1.val <= v2.val ? 1 : 0;
                    } else {
                        return -1;
                    }
                }

                function updateStatus(field, result) {
                    let status = '';
                    switch (result) {
                        case 0:
                            status = 'Invalid';
                            break;

                        case 1:
                            status = 'Valid';
                            break;

                        default:
                            status = 'NotValidated';
                            break;
                    }
                    return (status == 'Valid') || (status == 'NotValidated');
                }

                self.addField(
                    fv,
                    ['input-business-years-in-operation', 'Please enter value']);

                self.addField(
                    fv,
                    ['input-total-number-of-employees', 'Please enter value'],
                    [(args) => {
                        self.validateField('input-number-of-permanent-employees');
                        return true;
                    }]
                );

                self.addField(
                    fv,
                    ['input-number-of-permanent-employees', 'Please enter value'],
                    [(args) => {
                        self.validateFields([
                            'input-number-of-permanent-youth-employees-under35',
                            'input-number-of-permanent-female-employees',
                            'input-number-of-permanent-black-employees'
                        ]);
                        let result = isLessOrEqual('input-number-of-permanent-employees', 'input-total-number-of-employees');
                        return updateStatus('input-number-of-permanent-employees', result);
                    }, 'Must be less than or equal to total number of employees']
                );

                self.addField(
                    fv,
                    ['input-number-of-permanent-youth-employees-under35', 'Please enter value'],
                    [(args) => {
                        let result = isLessOrEqual('input-number-of-permanent-youth-employees-under35', 'input-number-of-permanent-employees');
                        return updateStatus('input-number-of-permanent-youth-employees-under35', result);
                    }, 'Must be less than or equal to number of current permanent employees']
                );

                self.addField(
                    fv,
                    ['input-number-of-permanent-female-employees', 'Please enter value'],
                    [(args) => {
                        let result = isLessOrEqual('input-number-of-permanent-female-employees', 'input-number-of-permanent-employees');
                        return updateStatus('input-number-of-permanent-female-employees', result);
                    }, 'Must be less than or equal to number of current permanent employees']
                );

                self.addField(
                    fv,
                    ['input-number-of-permanent-black-employees', 'Please enter value'],
                    [(args) => {
                        let result = isLessOrEqual('input-number-of-permanent-black-employees', 'input-number-of-permanent-employees');
                        return updateStatus('input-number-of-permanent-black-employees', result);
                    }, 'Must be less than or equal to number of current permanent employees']
                );

                fv.addField(
                    'input-number-of-new-jobs-created-through-loan',
                    {
                        validators: {
                            notEmpty: {
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
                            }
                        }
                    }
                );
            }

            // Ownership detail.
            function addGroup3(fv) {

                function totalSANonSAAndOrgEquals100() {

                    function toggleNotEmpty(name) {
                        let value = parseInt($('#' + name).val());
                        self.validations.validator.updateFieldStatus(name, isNaN(value) == true ? 'Invalid' : 'Valid', 'notEmpty');
                    }

                    function toggleCallback(name, inValid) {
                        self.validations.validator.updateFieldStatus(name, inValid == true ? 'Invalid' : 'Valid', 'callback');
                    }

                    let value1 = parseInt($('#input-percent-ownership-by-south-africans').val());
                    let value2 = parseInt($('#input-percent-non-south-african-citizens').val());
                    let value3 = parseInt($('#input-percent-companies-organisations').val());

                    let totalOwners = parseInt($('#input-total-number-of-owners').val());
                    let total = null;

                    let atLeastOneNaN = true;
                    let addsUp = false;
                    if (isNaN(totalOwners) == false && isNaN(value1) == false && isNaN(value2) == false && isNaN(value3) == false) {
                        atLeastOneNaN = false;
                        total = value1 + value2 + value3;
                        if (total == totalOwners) {
                            addsUp = true;
                        } else {
                            addsUp = false;
                        }
                    } else {
                        atLeastOneNaN = true;
                    }

                    setTimeout(() => {
                        toggleNotEmpty('input-percent-ownership-by-south-africans');
                        toggleNotEmpty('input-percent-non-south-african-citizens');
                        toggleNotEmpty('input-percent-companies-organisations');

                        toggleCallback('input-percent-ownership-by-south-africans', addsUp == false && atLeastOneNaN == false);
                        toggleCallback('input-percent-non-south-african-citizens', addsUp == false && atLeastOneNaN == false);
                        toggleCallback('input-percent-companies-organisations', addsUp == false && atLeastOneNaN == false);
                    }, 10);
                    return true;
                }

                function setCenterFields(enable, value) {
                    if (enable == false) {
                        $('#input-percent-black-coloured-indian-pdi').val(value);
                        $('#input-percent-white-only').val(value);
                        $('#input-percent-asian-only').val(value);
                        $('#input-percent-disabled-people').val(value);
                        $('#input-percent-youth-under-35').val(value);
                        $('#input-percent-women-women-any-race').val(value);
                        $('#input-percent-black-south-africans-only').val(value);
                        $('#input-percent-women-black-only').val(value);
                        self.updateFieldStatus(
                            ['input-percent-black-coloured-indian-pdi', 'input-percent-white-only', 'input-percent-asian-only', 'input-percent-disabled-people', 'input-percent-youth-under-35', 'input-percent-women-women-any-race', 'input-percent-black-south-africans-only', 'input-percent-women-black-only'],
                            ['Valid', 'Valid', 'Valid', 'Valid', 'Valid', 'Valid', 'Valid', 'Valid'],
                            ['callback', 'callback', 'callback', 'callback', 'callback', 'callback', 'callback', 'callback']
                        );
                    }

                    $('#input-percent-black-coloured-indian-pdi').prop('disabled', enable ^ true);
                    $('#input-percent-white-only').prop('disabled', enable ^ true);
                    $('#input-percent-asian-only').prop('disabled', enable ^ true);
                    $('#input-percent-disabled-people').prop('disabled', enable ^ true);
                    $('#input-percent-youth-under-35').prop('disabled', enable ^ true);
                    $('#input-percent-women-women-any-race').prop('disabled', enable ^ true);
                    $('#input-percent-black-south-africans-only').prop('disabled', enable ^ true);
                    $('#input-percent-women-black-only').prop('disabled', enable ^ true);

                    if (enable == true) {
                        self.validateFields([
                            'input-percent-black-coloured-indian-pdi',
                            'input-percent-white-only',
                            'input-percent-asian-only',
                            'input-percent-disabled-people',
                            'input-percent-youth-under-35',
                            'input-percent-women-women-any-race',
                            'input-percent-black-south-africans-only',
                            'input-percent-women-black-only'
                        ]);
                    } else {
                        self.updateFieldStatus(
                            [
                                'input-percent-black-coloured-indian-pdi',
                                'input-percent-white-only',
                                'input-percent-asian-only',
                                'input-percent-disabled-people',
                                'input-percent-youth-under-35',
                                'input-percent-women-women-any-race',
                                'input-percent-black-south-africans-only',
                                'input-percent-women-black-only'
                            ],
                            ['Valid', 'Valid', 'Valid', 'Valid', 'Valid', 'Valid', 'Valid', 'Valid'],
                            ['notEmpty', 'notEmpty', 'notEmpty', 'notEmpty', 'notEmpty', 'notEmpty', 'notEmpty', 'notEmpty']
                        );

                    }
                }

                function toggleCenterFields() {
                    let saCitizens = parseInt($('#input-percent-ownership-by-south-africans').val());
                    if (isNaN(saCitizens) == false) {
                        let nonSaCitizens = parseInt($('#input-percent-non-south-african-citizens').val());
                        let companies = parseInt($('#input-percent-companies-organisations').val());
                        let totalOwners = parseInt($('#input-total-number-of-owners').val());
                        if (isNaN(nonSaCitizens) == false && isNaN(companies) == false && isNaN(totalOwners) == false) {
                            if ((nonSaCitizens + companies) == totalOwners && saCitizens == 0) {
                                setCenterFields(false, 0);
                            } else {
                                setCenterFields(true, '');
                            }
                        } else {
                            setCenterFields(true, '');
                        }
                    }
                }

                function atLeastOneNaturalNumber() {
                    let value = parseInt($('#input-percent-ownership-by-south-africans').val());
                    if (isNaN(value) == true || value == 0) {
                        return true;
                    } else {
                        let arr = [
                            parseInt($('#input-percent-black-coloured-indian-pdi').val()),
                            parseInt($('#input-percent-white-only').val()),
                            parseInt($('#input-percent-asian-only').val()),
                            parseInt($('#input-percent-disabled-people').val()),
                            parseInt($('#input-percent-youth-under-35').val()),
                            parseInt($('#input-percent-women-women-any-race').val()),
                            parseInt($('#input-percent-black-south-africans-only').val()),
                            parseInt($('#input-percent-women-black-only').val())
                        ];
                        for (let i = 0, max = arr.length; i < max; i++) {
                            if (isNaN(arr[i]) == true || arr[i] > 0) {
                                return true;
                            }
                        }
                        return false;
                    }
                }

                self.addField(
                    fv,
                    ['input-percent-ownership-by-south-africans', 'Please enter value'],
                    [(args) => {
                        self.validateFields([
                            'input-percent-black-coloured-indian-pdi',
                            'input-percent-black-south-africans-only',
                            'input-percent-white-only',
                            'input-percent-asian-only',
                            'input-percent-disabled-people',
                            'input-percent-youth-under-35',
                            'input-percent-women-women-any-race',
                            'input-percent-women-black-only',
                            'input-total-number-of-owners'
                        ]);

                        toggleCenterFields();
                        return totalSANonSAAndOrgEquals100();
                    }, 'Total number of SA, Non-SA and companies / organizations must add up to total number of owners']
                );

                fv.addField(
                    'input-percent-black-coloured-indian-pdi',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    self.validateFields([
                                        'business-owners-dummy',
                                        'input-percent-black-south-africans-only'
                                    ]);
                                    let total = parseInt($('#input-percent-ownership-by-south-africans').val());
                                    let pdi = parseInt(args.value);
                                    let white = parseInt($('#input-percent-white-only').val());
                                    let asian = parseInt($('#input-percent-asian-only').val());
                                    let compare = (isNaN(total) == false && isNaN(pdi) == false && isNaN(white) == false && isNaN(asian) == false);
                                    if (compare == true) {
                                        if (white > total) {
                                            return {
                                                valid: false,
                                                message: 'Must be less than or equal to total ownership by South Africans'
                                            };
                                        }
                                        if ((pdi + white + asian) > total) {
                                            return {
                                                valid: false,
                                                message: 'Black, Coloured and Indians + White South Africans + Asian cannot exceed Total ownership by South Africans'
                                            };
                                        }
                                    }
                                    self.validations.validator.updateFieldStatus('input-percent-white-only', 'Valid', 'callback');
                                    self.validations.validator.updateFieldStatus('input-percent-asian-only', 'Valid', 'callback');
                                    return true;
                                },
                                message: 'Invalid input'
                            }
                        }
                    }
                );

                self.addField(
                    fv,
                    ['input-percent-black-south-africans-only', 'Please enter value'],
                    [(args) => {
                        self.validateFields([
                            'business-owners-dummy',
                            'input-percent-women-black-only'
                        ]);
                        let total = parseInt($('#input-percent-black-coloured-indian-pdi').val());
                        let current = parseInt(args.value);
                        let comparison = (isNaN(total) == false && isNaN(current) == false) ? current <= total : true;
                        return (
                            args.value == '' || comparison
                        );
                    }, 'Must be less than or equal to ownership by Black, Coloured and Indians']
                );

                fv.addField(
                    'input-percent-white-only',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    self.validateFields([
                                        'business-owners-dummy'
                                    ]);
                                    let total = parseInt($('#input-percent-ownership-by-south-africans').val());
                                    let pdi = parseInt($('#input-percent-black-coloured-indian-pdi').val());
                                    let white = parseInt(args.value);
                                    let asian = parseInt($('#input-percent-asian-only').val());
                                    let compare = (isNaN(total) == false && isNaN(pdi) == false && isNaN(white) == false && isNaN(asian) == false);
                                    if (compare == true) {
                                        if (white > total) {
                                            return {
                                                valid: false,
                                                message: 'Must be less than or equal to total ownership by South Africans'
                                            };
                                        }
                                        if ((pdi + white + asian) > total) {
                                            return {
                                                valid: false,
                                                message: 'Black, Coloured and Indians + White South Africans + Asian cannot exceed total ownership by South Africans'
                                            };
                                        }
                                    }
                                    self.validations.validator.updateFieldStatus('input-percent-black-coloured-indian-pdi', 'Valid', 'callback');
                                    self.validations.validator.updateFieldStatus('input-percent-asian-only', 'Valid', 'callback');
                                    return true;
                                },
                                message: 'Invalid input'
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
                                callback: function (args) {
                                    self.validateFields([
                                        'business-owners-dummy'
                                    ]);
                                    let total = parseInt($('#input-percent-ownership-by-south-africans').val());
                                    let pdi = parseInt($('#input-percent-black-coloured-indian-pdi').val());
                                    let white = parseInt($('#input-percent-white-only').val());
                                    let asian = parseInt(args.value);
                                    let compare = (isNaN(total) == false && isNaN(pdi) == false && isNaN(white) == false && isNaN(asian) == false);
                                    if (compare == true) {
                                        if (asian > total) {
                                            return {
                                                valid: false,
                                                message: 'Must be less than or equal to total ownership by South Africans'
                                            };
                                        }
                                        if ((pdi + white + asian) > total) {
                                            return {
                                                valid: false,
                                                message: 'Black, Coloured and Indians + White South Africans + Asian cannot exceed total ownership by South Africans'
                                            };
                                        }
                                    }
                                    self.validations.validator.updateFieldStatus('input-percent-black-coloured-indian-pdi', 'Valid', 'callback');
                                    self.validations.validator.updateFieldStatus('input-percent-white-only', 'Valid', 'callback');
                                    return true;
                                },
                                message: 'Invalid input'
                            }
                        }
                    }
                );

                self.addField(
                    fv,
                    ['input-percent-disabled-people', 'Please enter value'],
                    [(args) => {
                        self.validateFields([
                            'business-owners-dummy'
                        ]);

                        let total = parseInt($('#input-percent-ownership-by-south-africans').val());
                        let current = parseInt(args.value);
                        let comparison = (isNaN(total) == false && isNaN(current) == false) ? current <= total : true;
                        return (
                            args.value == '' || comparison
                        );
                    }, 'Must be less than or equal to total ownership by South Africans']
                );

                self.addField(
                    fv,
                    ['input-percent-youth-under-35', 'Please enter value'],
                    [(args) => {
                        self.validateFields([
                            'business-owners-dummy'
                        ]);

                        let total = parseInt($('#input-percent-ownership-by-south-africans').val());
                        let current = parseInt(args.value);
                        let comparison = (isNaN(total) == false && isNaN(current) == false) ? current <= total : true;
                        return (
                            args.value == '' || comparison
                        );
                    }, 'Must be less than or equal to total ownership by South Africans']
                );

                self.addField(
                    fv,
                    ['input-percent-women-women-any-race', 'Please enter value'],
                    [(args) => {
                        self.validateFields([
                            'business-owners-dummy',
                            'input-percent-women-black-only'
                        ]);

                        let total = parseInt($('#input-percent-ownership-by-south-africans').val());
                        let current = parseInt(args.value);
                        let comparison = (isNaN(total) == false && isNaN(current) == false) ? current <= total : true;
                        return (
                            args.value == '' || comparison
                        );
                    }, 'Must be less than or equal to total ownership by South Africans']
                );

                fv.addField(
                    'input-percent-women-black-only',
                    {
                        validators: {
                            notEmpty: {
                                message: 'Please enter value'
                            },
                            callback: {
                                callback: function (args) {
                                    self.validateFields([
                                        'business-owners-dummy'
                                    ]);
                                    let blackWomenOnly = parseInt(args.value);
                                    let womenAnyRace = parseInt($('#input-percent-women-women-any-race').val());
                                    let blackOnly = parseInt($('#input-percent-black-south-africans-only').val());
                                    if (isNaN(womenAnyRace) == false || isNaN(blackOnly) == false) {
                                        if (isNaN(womenAnyRace) == false && blackWomenOnly > womenAnyRace) {
                                            return {
                                                valid: false,
                                                message: 'Black women cannot exceed black South Africans only and/or women of any race'
                                            };
                                        }
                                        if (isNaN(blackOnly) == false && blackWomenOnly > blackOnly) {
                                            return {
                                                valid: false,
                                                message: 'Black women cannot exceed black South Africans only and/or women of any race'
                                            };
                                        }
                                        return true;
                                    } else {
                                        return true;
                                    }
                                },
                                message: 'Invalid input'
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
                                    self.validateFields([
                                        'input-total-number-of-owners'
                                    ]);
                                    toggleCenterFields();
                                    return totalSANonSAAndOrgEquals100();
                                },
                                message: 'Total number of SA, Non-SA and companies / organizations must add up to total number of owners'
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
                                    self.validateFields([
                                        'input-total-number-of-owners'
                                    ]);
                                    toggleCenterFields();
                                    return totalSANonSAAndOrgEquals100();
                                    //return isNaN(parseInt(arg.value)) == false && totalSANonSAAndOrgEquals100();
                                },
                                message: 'Total number of SA, Non-SA and companies / organizations must add up to total number of owners'
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
                                    let value = parseInt(arg.value);
                                    toggleCenterFields();
                                    //return (value > 0) && totalSANonSAAndOrgEquals100();
                                    return totalSANonSAAndOrgEquals100();
                                    //return (value > 0) && totalSANonSAAndOrgEquals100();
                                },
                                message: 'Total number owners must be greater than zero'
                            }
                        }
                    }
                );

                fv.addField(
                    'business-owners-dummy',
                    {
                        validators: {
                            callback: {
                                callback: function (arg) {
                                    let result = atLeastOneNaturalNumber();
                                    if (result == false) {
                                        $('#business-owners-dummy').show();
                                    } else {
                                        $('#business-owners-dummy').hide();
                                    }
                                    return result;
                                },
                                message: 'At least one of the above 6 fields above must be greater than zero'
                            }
                        }
                    }
                );
            }

            // Employees.
            addGroup1(fv);
            // Ownership.
            addGroup3(fv);

            return fv;
        }

        toggleGroup(group, enable) {
            this.groups[group - 1].forEach((name, idx) => {
                if (enable == true) {
                    this.validations.validator.enableValidator(name);
                } else {
                    this.validations.validator.disableValidator(name);
                }
            });
        }

        toggleGroups(groupArr, enable) {
            groupArr.forEach((groupIdx, idx) => {
                this.toggleGroup(groupIdx, enable);
            });
        }

        toggleAll(enable) {
            this.toggleGroups([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], false);
        }

        toggleYouthChallengeFund(enable) {
            this.toggleGroups([6], enable);
        }

        toggleTrep(enable) {
            this.toggleGroups([1, 2, 3, 4, 7], enable);
        }

        toggleRevolvingLoan(enable) {
            this.toggleGroups([1, 3, 4, 5], enable);
        }

        toggleAssetFinance(enable) {
            //this.toggleGroups([1, 3, 4, 5, 8], enable);
            this.toggleGroups([1, 3, 4, 5], enable);
        }

        toggleBridgingLoan(enable) {
            this.toggleGroups([1, 3, 4, 5], enable);
        }

        togglePurchaseOrder(enable) {
            this.toggleGroups([1, 3, 4, 5, 10], enable);
        }

        toggleManufactureVeteranDisability(enable) {
            this.toggleGroups([1, 3, 4, 5], enable);
        }

        toggleTermLoan(enable) {
            this.toggleGroups([1, 3, 4, 5], enable);
        }

        toggleGodisa(enable) {
            this.toggleGroups([1, 3, 4, 5], enable);
        }

        toggleCoOpDevelopment(enable) {
            this.toggleGroups([1, 3, 4, 9], enable);
        }

        toggleWLorRFIorEU(enable) {
            this.toggleGroups([1, 3, 4, 5], enable);
        }

        toggleMicroFinance(enable) {
            this.toggleGroups([1, 3, 4, 5], enable);
        }
    }

    validation.getFundingRequirementsValidator = function (id) {
        return new FundingRequirementsValidator(id);
    };

})(app.wizard.validation);
