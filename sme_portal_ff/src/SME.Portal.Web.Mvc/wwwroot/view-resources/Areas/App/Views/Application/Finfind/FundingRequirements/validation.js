"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.fundingRequirements == undefined) {
    app.wizard.fundingRequirements = {};
}

if (app.wizard.fundingRequirements.validator == undefined) {
    app.wizard.fundingRequirements.validator = {};
}

(function (validator) {

    const MIN_LOAN_AMOUNT = 5000;

    class Finfind extends app.wizard.validator.Base {
        constructor(id) {
            super(id);
        }

        addFields(fv) {
            fv.addField(
                'financefor',
                {
                    validators: {
                        notEmpty: {
                            message: 'Please select your funding type'
                        }
                    }
                }
            );
            fv.addField(
                'loanamount',
                {
                    validators: {
                        notEmpty: {
                            message: 'Minimum loan amount of ' + MIN_LOAN_AMOUNT.toString() + ' Rands is required'
                        }
                    }
                }
            );

            // Buy and asset.
            fv.addField(
                'assetfinancetype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Asset Finance Type must be selected'
                        }
                    }
                }
            );
            fv.addField(
                'buyingbusinesspropertyvalue',
                {
                    validators: {
                        notEmpty: {
                            message: 'Value is required'
                        }
                    }
                }
            );
            fv.addField(
                'buyingbusinesspropertytype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'propertydevelopmenttype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'shopfittingpropbonded',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'shopfittingpropertyvalue',
                {
                    validators: {
                        notEmpty: {
                            message: 'Value is required'
                        }
                    }
                }
            );
            fv.addField(
                'shopfittingpropertytype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            // Grow my business.
            fv.addField(
                'growthfinancetype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Growth Finance Type must be selected'
                        }
                    }
                }
            );
            fv.addField(
                'willingtosellshares',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'largepotentialmarket',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'customersbuying',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'businessexpansioncompetitiveadv',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'businessexpansionresultinincreasedemployees',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'businessexpansionresultinincreasedprofitability',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'businessexpansionresultinincreasedexports',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'businessexpansionresultineconomicempowerment',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'businessexpansionresultinsustainabledev',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'businessexpansionresultinsolveenvchallenges',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'productserviceexpansiontype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );

            // Other.
            fv.addField(
                'otherfinancetype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Other Business Finance Type must be selected'
                        }
                    }
                }
            );
            fv.addField(
                'willworkgenerate50newjobs',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'doyouhavecontractsforbps',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'will80percofjobsbeforyouth',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'otherfinanceexportindustry',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'exportcountry',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'needingtoconductintmarketresearch',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'haveconfirmedorders',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'otherfinanceimportindustry',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'importcountry',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'havesignedcontracts',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'workinruralareas',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'resultinemploymentsavejobs',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'workwithpeoplewithdisabilities',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'willprojectimprovehealthcare',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'willgenerateincomeinimpoverishedareas',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'willgenerateincreasedexportvalue',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );

            // Working Capital.
            fv.addField(
                'workingcapitaltype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Working Capital Type must be selected'
                        }
                    }
                }
            );
            fv.addField(
                'cashforaninvoiceamount',
                {
                    validators: {
                        notEmpty: {
                            message: 'Value is required'
                        }
                    }
                }
            );
            fv.addField(
                'cashforinvoicecustomer',
                {
                    validators: {
                        notEmpty: {
                            message: 'Customer Type must be selected'
                        }
                    }
                }
            );
            fv.addField(
                'customeragreed',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'hasposdevice',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'regularmonthlyincome',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'monthlyincomeincomevalue',
                {
                    validators: {
                        notEmpty: {
                            message: 'Value is required'
                        }
                    }
                }
            );
            fv.addField(
                'cardmachinepaymenttypes',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'moneyforcontractvalue',
                {
                    validators: {
                        notEmpty: {
                            message: 'Value is required'
                        }
                    }
                }
            );
            fv.addField(
                'moneyforcontractcustomer',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'moneyforcontractcompanyexperience',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'moneyfortendervalue',
                {
                    validators: {
                        notEmpty: {
                            message: 'Value is required'
                        }
                    }
                }
            );
            fv.addField(
                'moneyfortendercustomer',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'moneyfortendercompanyexperience',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'purchaseordervalue',
                {
                    validators: {
                        notEmpty: {
                            message: 'Value is required'
                        }
                    }
                }
            );
            fv.addField(
                'purchaseordercustomer',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'purchaseordercustomerexperience',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );

            // Franchise Acquisition.
            fv.addField(
                'franchiseacquisitiontype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Franchise Acquisition Type must be selected'
                        }
                    }
                }
            );
            fv.addField(
                'buyingafranchisefranchiseaccredited',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'preapprovedbyfranchisor',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'beepartnerfranchiseaccredited',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'fundingtobuyanexistingbusinesstype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'businesslocatedinruralarea',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'shareholdinggreaterthanperc',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );

            // Research Innovation.
            fv.addField(
                'researchinnovationfundingtype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Research and Innovation Type must be selected'
                        }
                    }
                }
            );
            fv.addField(
                'commresstudentstatus',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'commreswillincexports',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'commresresultinjobcreation',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'commresintroinnov',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'commresindustries',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
            fv.addField(
                'researchtakingplaceinuniversity',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select either Yes or No'
                        }
                    }
                }
            );
            fv.addField(
                'researchfieldofresearchtype',
                {
                    validators: {
                        notEmpty: {
                            message: 'Select an appropriate option'
                        }
                    }
                }
            );
        }


        addValidations() {
            super.addValidations();



            this.validations.map.set("select-select2", 'message-select2');
            this.validations.map.set("financefor", 'message-financefor');

            let self = this;
            let fv = FormValidation.formValidation(
                document.getElementById(this.id), {
                fields: {
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap({
                        defaultMessageContainer: true
                    })
                    //messages: new FormValidation.plugins.Message({
                    //    clazz: 'text-danger',
                    //    container: function (field, element) {
                    //        if (self.validations.map.has(field) == true) {
                    //            let data = self.validations.map.get(field);
                    //            return document.getElementById(data);
                    //        } else {
                    //            return document.getElementById(self.id);
                    //        }
                    //    }
                    //})
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

})(app.wizard.fundingRequirements.validator);
