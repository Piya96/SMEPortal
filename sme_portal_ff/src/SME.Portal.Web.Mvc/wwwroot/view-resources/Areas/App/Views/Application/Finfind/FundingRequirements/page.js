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

if (app.wizard.fundingRequirements.page == undefined) {
    app.wizard.fundingRequirements.page = {};
}

(function (page) {
    let helpers = app.onboard.helpers.get();

    let dto = app.wizard.fundingRequirements.dto;

    class DtoToPage extends dto.DtoToHtml {
        constructor(self) {
            super(self);
            this.controls = self.controls;
            this.validation = self.validation;
        }

        set(name, enable) {
            let value = super.set(name, enable);
            if (this.controls[name].type == 'checkbox') {
                // Make a function for this in the checkbox class.
                if (enable == true && value != '') {
                    value.forEach((guid, idx) => {
                        this.controls[name].val(guid, true);
                    });
                } else {
                    this.controls[name].valAll(false);
                }

            } else if (this.controls[name].type == 'selectmulti') {
                this.controls[name].valEx(value);
            } else {
                this.controls[name].val(value);
            }
            return value;
        }

        show(name, enable) {
            super.show(name, enable);
        }

        franchiseAquisition_fundingToBuyAnExistingBusiness_industry(enable = true) {
            super.franchiseAquisition_fundingToBuyAnExistingBusiness_industry(enable);
        }

        other_exportFundingTradeFinance(enable = true) {
            super.other_exportFundingTradeFinance(enable);
            //if (enable == true && helpers.isPortrait() == true) {
            //    $('#b-otherfinanceexportindustry').text('Swipe');
            //} else {
            //    $('#b-otherfinanceexportindustry').text('');
            //}

        }

        other_importFundingTradeFinance(enable = true) {
            super.other_importFundingTradeFinance(enable);
            //if (enable == true && helpers.isPortrait() == true) {
            //    $('#b-otherfinanceimportindustry').text('Swipe');
            //} else {
            //    $('#b-otherfinanceimportindustry').text('');
            //}
        }
    }

    class FundingRequirementsPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Funding Requirements Page';
            this.dto2Page = null;
            this.dto = null;
        }

        validate(data, cb) {
            super.validate(data, cb);
        }

        dtoToPage(dto) {
            this.dto2Page.apply();
        }

        serialize() {
            return super.serialize();
        }

        pageToDto(dto) {
        }

        reset() {
        }

        load(args, cb) {
            self = this;
            // TODO: Look at the wizard controller serializing and re-parsing the model on load to keep a proper copy for the wizard.
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);

            this.dto = this.helpers.nvpArrayToObject(mc);

            this.dto2Page = new DtoToPage(this);

            this.dtoToPage(this.dto);
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            if (args.isNext == true) {
                let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
                this.dto = this.helpers.nvpArrayToObject(mc);
                this.dtoToPage(this.dto);
            }
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            cb(app.wizard.addResult());
        }

        neglect(args, cb) {
            cb(app.wizard.addResult());
        }

        validate(args, cb) {
            cb(app.wizard.addResult());
        }

        addControls() {
            let control = null;

            control = this.addControl('financefor', 'radio');

            control = this.addControl('loanamount', 'input');
            control.format(10, this.helpers.formatCurrency);
            // Buy and asset.
            control = this.addControl('assetfinancetype', 'select');

            control = this.addControl('buyingbusinesspropertyvalue', 'input');
            control.format(10, this.helpers.formatCurrency);
            control = this.addControl('buyingbusinesspropertytype', 'select');

            control = this.addControl('propertydevelopmenttype', 'select');

            control = this.addControl('shopfittingpropbonded', 'radio');
            control = this.addControl('shopfittingpropertyvalue', 'input');
            control.format(10, this.helpers.formatCurrency);
            control = this.addControl('shopfittingpropertytype', 'select');

            // Grow my business.
            control = this.addControl('growthfinancetype', 'select');

            control = this.addControl('willingtosellshares', 'radio');
            // YES
            control = this.addControl('largepotentialmarket', 'radio');
            control = this.addControl('customersbuying', 'radio');

            control = this.addControl('businessexpansioncompetitiveadv', 'select');

            control = this.addControl('businessexpansionresultinincreasedemployees', 'radio');
            control = this.addControl('businessexpansionresultinincreasedprofitability', 'radio');
            control = this.addControl('businessexpansionresultinincreasedexports', 'radio');
            control = this.addControl('businessexpansionresultineconomicempowerment', 'radio');
            control = this.addControl('businessexpansionresultinsustainabledev', 'radio');
            control = this.addControl('businessexpansionresultinsolveenvchallenges', 'radio');

            control = this.addControl('productserviceexpansiontype', 'select');

            // Other.
            control = this.addControl('otherfinancetype', 'select');

            control = this.addControl('willworkgenerate50newjobs', 'radio');
            control = this.addControl('doyouhavecontractsforbps', 'radio');
            control = this.addControl('will80percofjobsbeforyouth', 'radio');

            control = this.addControl('otherfinanceexportindustry', 'selectmulti');
            control = this.addControl('exportcountry', 'select');
            control = this.addControl('needingtoconductintmarketresearch', 'radio');
            control = this.addControl('haveconfirmedorders', 'radio');

            control = this.addControl('otherfinanceimportindustry', 'selectmulti');
            control = this.addControl('importcountry', 'select');
            control = this.addControl('havesignedcontracts', 'radio');

            control = this.addControl('workinruralareas', 'radio');
            control = this.addControl('resultinemploymentsavejobs', 'radio');
            control = this.addControl('workwithpeoplewithdisabilities', 'radio');
            control = this.addControl('willprojectimprovehealthcare', 'radio');
            control = this.addControl('willgenerateincomeinimpoverishedareas', 'radio');
            control = this.addControl('willgenerateincreasedexportvalue', 'radio');

            // Working Capital.
            control = this.addControl('workingcapitaltype', 'select');

            control = this.addControl('cashforaninvoiceamount', 'input');
            control.format(10, this.helpers.formatCurrency);

            control = this.addControl('cashforinvoicecustomer', 'select');
            control = this.addControl('customeragreed', 'radio');

            control = this.addControl('hasposdevice', 'radio');

            control = this.addControl('regularmonthlyincome', 'radio');

            control = this.addControl('monthlyincomeincomevalue', 'input');
            control.format(10, this.helpers.formatCurrency);

            control = this.addControl('cardmachinepaymenttypes', 'checkbox');

            control = this.addControl('moneyforcontractvalue', 'input');
            control.format(10, this.helpers.formatCurrency);

            control = this.addControl('moneyforcontractcustomer', 'select');
            control = this.addControl('moneyforcontractcompanyexperience', 'radio');

            control = this.addControl('moneyfortendervalue', 'input');
            control.format(10, this.helpers.formatCurrency);

            control = this.addControl('moneyfortendercustomer', 'select');
            control = this.addControl('moneyfortendercompanyexperience', 'radio');

            control = this.addControl('purchaseordervalue', 'input');
            control.format(10, this.helpers.formatCurrency);

            control = this.addControl('purchaseordercustomer', 'select');
            control = this.addControl('purchaseordercustomerexperience', 'radio');

            // Franchise Acquisition.
            control = this.addControl('franchiseacquisitiontype', 'select');

            control = this.addControl('buyingafranchisefranchiseaccredited', 'radio');
            control = this.addControl('preapprovedbyfranchisor', 'radio');

            control = this.addControl('beepartnerfranchiseaccredited', 'radio');

            control = this.addControl('fundingtobuyanexistingbusinesstype', 'select');
            control = this.addControl('businesslocatedinruralarea', 'radio');

            control = this.addControl('shareholdinggreaterthanperc', 'radio');

            control = this.addControl('select-sic-section', 'select');
            $('#div-sic-section').show();
            control = this.addControl('select-sic-division', 'select');
            $('#div-sic-division').show();
            control = this.addControl('select-sic-group', 'select');
            $('#div-sic-group').show();
            control = this.addControl('select-sic-class', 'select');
            $('#div-sic-class').show();
            control = this.addControl('select-sic-sub-class', 'select');
            $('#div-sic-sub-class').show();

            // Research Innovation.
            control = this.addControl('researchinnovationfundingtype', 'select');

            control = this.addControl('commresstudentstatus', 'radio');
            control = this.addControl('commreswillincexports', 'radio');
            control = this.addControl('commresresultinjobcreation', 'radio');
            control = this.addControl('commresintroinnov', 'radio');
            control = this.addControl('commresindustries', 'selectmulti');

            control = this.addControl('researchtakingplaceinuniversity', 'radio');
            control = this.addControl('researchfieldofresearchtype', 'select');

            let divNames = [
                'div-sic-section',
                'div-sic-division',
                'div-sic-group',
                'div-sic-class',
                'div-sic-sub-class'
            ];
            divNames.forEach((name, index) => {
                $('#' + name).show();
            });
            let names = [
                'select-sic-section',
                'select-sic-division',
                'select-sic-group',
                'select-sic-class',
                'select-sic-sub-class'
            ];
            app.wizard.isb.init(this.controls, names, divNames);
            app.wizard.isb.reset();
        }

        addHandlers() {
            let self = this;

            this.controls['financefor'].click((arg, name, prev, next) => {
                self.helpers.setPropEx(self.dto, 'financefor', next);
                self.dto2Page.financeFor();
            });

            this.controls['assetfinancetype'].change((value, text) => {
                self.helpers.setPropEx(self.dto, 'assetfinancetype', value);
                self.dto2Page.asset();
            });

            this.controls['growthfinancetype'].change((value, text) => {
                self.helpers.setPropEx(self.dto, 'growthfinancetype', value);
                self.dto2Page.growth();
            });

            this.controls['willingtosellshares'].click((arg, name, value, def) => {
                self.helpers.setPropEx(self.dto, 'willingtosellshares', def);
                self.dto2Page.growth_willingToSellShares();
            });

            this.controls['otherfinancetype'].change((value, text) => {
                self.helpers.setPropEx(self.dto, 'otherfinancetype', value);
                self.dto2Page.other();
            });

            this.controls['workingcapitaltype'].change((value, text) => {
                self.helpers.setPropEx(self.dto, 'workingcapitaltype', value);
                self.dto2Page.workingCapital();
            });

            this.controls['regularmonthlyincome'].click((arg, name, value, def) => {
                self.helpers.setPropEx(self.dto, 'regularmonthlyincome', def);
                self.dto2Page.workingCapital_cashForRetailersWithACardMachine_monthlyIncomeIncomeValue(def == 'Yes');
            });

            this.controls['customeragreed'].click((arg, name, value, def) => {
                self.helpers.setPropEx(self.dto, 'customeragreed', def);
                self.dto2Page.workingCapital_cashAdvanceForAnInvoice_customerAgreed(def == 'No');
            });

            this.controls['franchiseacquisitiontype'].change((value, text) => {
                self.helpers.setPropEx(self.dto, 'franchiseacquisitiontype', value);
                self.dto2Page.franchiseAquisition();
            });

            this.controls['researchinnovationfundingtype'].change((value, text) => {
                self.helpers.setPropEx(self.dto, 'researchinnovationfundingtype', value);
                self.dto2Page.researchInnovation();
            });

            function sectionHook(level, result) {
                self.helpers.setPropEx(self.dto, 'select-sic-section', result[1].id);
                self.helpers.setPropEx(self.dto, 'select-sic-division', '');
                self.helpers.setPropEx(self.dto, 'select-sic-group', '');
                self.helpers.setPropEx(self.dto, 'select-sic-class', '');
                self.helpers.setPropEx(self.dto, 'select-sic-sub-class', '');
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            function divisionHook(level, result) {
                self.helpers.setPropEx(self.dto, 'select-sic-division', result[2].id);
                self.helpers.setPropEx(self.dto, 'select-sic-group', '');
                self.helpers.setPropEx(self.dto, 'select-sic-class', '');
                self.helpers.setPropEx(self.dto, 'select-sic-sub-class', '');
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            function groupHook(level, result) {
                self.helpers.setPropEx(self.dto, 'select-sic-group', result[3].id);
                self.helpers.setPropEx(self.dto, 'select-sic-class', '');
                self.helpers.setPropEx(self.dto, 'select-sic-sub-class', '');
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            function classHook(level, result) {
                self.helpers.setPropEx(self.dto, 'select-sic-class', result[4].id);
                self.helpers.setPropEx(self.dto, 'select-sic-sub-class', '');
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            function subClassHook(level, result) {
                self.helpers.setPropEx(self.dto, 'select-sic-sub-class', result[5].id);
                self.dto2Page.franchiseAquisition_fundingToBuyAnExistingBusiness_industry();
            }

            app.wizard.isb.addCallbacks([
                sectionHook, divisionHook, groupHook, classHook, subClassHook
            ]);



            $('#industry-sector-info-tooltip').on('click', (ev) => {
                this.industryHelp ^= true;
                self.helpers.show('div-industry-sector-info', this.industryHelp);
            });
        }
    }

    page.create = function (id) {
        return new FundingRequirementsPage(id);
    }

    page.FinfindFundingRequirements = FundingRequirementsPage;

    page.Finfind = FundingRequirementsPage;

})(app.wizard.fundingRequirements.page);
