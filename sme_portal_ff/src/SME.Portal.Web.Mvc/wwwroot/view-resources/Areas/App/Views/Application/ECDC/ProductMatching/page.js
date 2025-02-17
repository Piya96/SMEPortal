"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.productMatching == undefined) {
    app.wizard.productMatching = {};
}

if (app.wizard.productMatching.page == undefined) {
    app.wizard.productMatching.page = {};
}

(function (page) {

    class ProductMatching extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Product Matching Page';
            this.backgroundCheck = null;
            this.productGuid = null;
            this.productGuids = app.wizard.common.page.productGuids;
            this.failInfoShown = false;
        }

        showFailInfo(show) {
            if (show == true) {
                $('#div-product-match-fail-info').show('fast');
                this.failInfoShown = true;
            } else {
                $('#div-product-match-fail-info').hide('fast');
                this.failInfoShown = false;
            }
        }

        toggleFailInfo() {
            if (this.failInfoShown == true) {
                this.showFailInfo(false);
                this.failInfoShown = false;
            } else {
                $('#div-product-match-fail-info').show('fast');
                this.showFailInfo(true);
                this.failInfoShown = true;
            }
        }

        serialize() {
            return [];
        }

        validate(data, cb) {
            cb(app.wizard.addResult());
        }

        dtoToPage(dto) {
        }

        pageToDto(dto) {
        }

        reset() {
        }

        refreshDto() {
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            this.dto = this.helpers.nvpArrayToObject(mc);
            this.productGuid = this.helpers.getPropEx(this.dto, 'input-product-guid', '');
            this.productGuid = this.productGuid[0];
        }

        load(args, cb) {
            this.model = args;
            this.refreshDto();
            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attention(args, cb) {
            super.attention(args, cb);
        }

        attentionHidden(args, cb) {
            let self = this;
            if (args.isNext == true) {
                this.refreshDto();
                this.showProductInfo(this.productGuid);
            }
            cb(app.wizard.addResult());
        }

        neglectHidden(args, cb) {
            this.showFailInfo(false);
            cb(app.wizard.addResult());
        }

        neglect(args, cb) {
            cb(app.wizard.addResult());
        }

        addControls() {
            let self = this;
            let control = null;
            //control = this.addControl('select-product-guid', 'select');
            //let arr = [
            //    { value: this.productGuids['InvabaCooperativeFund'], text: 'InvabaCooperativeFund' },
            //    { value: this.productGuids['JobStimulusFund'], text: 'JobStimulusFund' },
            //    { value: this.productGuids['Strtep'], text: 'Strtep' },
            //    { value: this.productGuids['NexusTradeLoan'], text: 'NexusTradeLoan' },
            //    { value: this.productGuids['WorkFlowContractorLoan'], text: 'WorkFlowContractorLoan' },
            //    { value: this.productGuids['RiskCapitalProjectDevelopmentFinance'], text: 'RiskCapitalProjectDevelopmentFinance' },
            //    { value: this.productGuids['RiskCapitalBusinessFinance'], text: 'RiskCapitalBusinessFinance' },
            //    { value: this.productGuids['TermLoanPowerPlus'], text: 'TermLoanPowerPlus' },
            //    { value: this.productGuids['TermLoanTermCap'], text: 'TermLoanTermCap' }
            //];
            //control.fill(arr);
            //$('#div-product-guid').show();
        }

        addHandlers() {
            let self = this;
            //this.controls['select-product-guid'].change((value, text) => {
            //    this.productGuid = value;
            //    $('#input-product-guid').val(value);
            //});

            $('#a-product-match-fail-info').on('click', (ev) => {
                //self.toggleFailInfo();
            });
        }

        showProductInfo(guid) {
            let self = this;

            function invabaCooperativeFund_Enterprise() {
                $('#p-product-header').html('Imvaba Participating Individual Enterprise');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>Imvaba Participating Individual Enterprise!</b><br/>\
                           <i>The Imvaba Participating Individual Enterprise promotes the viability of the cooperative enterprise in the Eastern Cape province.</i>');
            }

            function invabaCooperativeFund() {
                $('#p-product-header').html('Imvaba Co-operative Fund');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>Imvaba Co-operative Fund!</b><br/>\
                           <i>The Imvaba Co-operative Fund promotes the viability of the cooperative enterprise in the Eastern Cape province.</i>');
            }

            function jobStimulusFund() {
                $('#p-product-header').html('Job Stimulus Fund');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>Job Stimulus Fund!</b><br/>\
                           <i>The Job Stimulus Fund assists distressed companies (that are trading for a minimum of 24 months) with employees who are in the risk of losing their jobs.</i>');
            }

            function strtep() {
                $('#p-product-header').html('STTREP');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>STTREP programme!</b><br/>\
                           <i>STTREP support informal and emerging formal enterprises that are trading for a minimum of one year in small towns, rural areas and/or townships.</i>');
            }

            function nexusTradeLoan() {
                $('#p-product-header').html('NEXUS Trade Loan');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>NEXUS Trade Loan!</b><br/>\
                           <i>The NEXUS Trade Loan typically provide working capital for approved projects where a contract, purchase order or tender exists at any of the following institutions:\
                            <ul>\
                                <li>Corporate/blue chip company</li>\
                                <li>Government – Municipal, National or Provincial</li>\
                                <li>Other private business</li>\
                            </ul>\
                           </i>'
                    );
            }

            function workFlowContractorLoan() {
                $('#p-product-header').html('Workflow Contractor Loan');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>Workflow Contractor Loan!</b><br/>\
                           <i>The Workflow Contractor Loan typically provides a construction guarantee and working capital for approved projects where a contract or tender with a minimum value of R500k exists at any of the following institutions:\
                            <ul>\
                                <li>Corporate/blue chip company</li>\
                                <li>Government – Municipal, National or Provincial</li>\
                                <li>Other private business</li>\
                            </ul>\
                           </i>'
                );
            }

            function riskCapitalProjectDevelopmentFinance() {
                $('#p-product-header').html('Risk Capital Project Development Finance');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>Risk Capital Project Development Finance!</b><br/>\
                           <i>Risk Capital Project Development Finance is typically available for large development projects during the concept development phases when pre-feasibility studies and scoping is done.</i>');
            }

            function riskCapitalBusinessFinance() {
                $('#p-product-header').html('Risk Capital Business Finance');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>Risk Capital Business Finance!</b><br/>\
                           <i>The Risk Capital Business Finance Loan is typically used for business expansion or capital and operational expenditures.</i>');
            }

            function termLoanPowerPlus() {
                $('#p-product-header').html('Term Loan POWERplus');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>Term Loan POWERplus!</b><br/>\
                           <i>POWERplus is a small term loan that forms part of the short-term finance offerings geared towards facilitating efficient cash flow management of clients’ businesses</i>');
            }

            function termLoadTermCap() {
                $('#p-product-header').html('Term Loan TERMcap');
                $('#p-product-body').html(
                    'Your requirements were successfully matched to our <b>Term Loan TERMcap!</b><br/>\
                           <i>The TERMcap loan is a long-term finance offering including commercial property finance.</i>');
            }

            function noMatch() {
            }

            let productGuids = app.wizard.common.page.productGuids;
            if (guid !== null && guid != '') {
                $('#div-product-match-pass').show('fast');
                $('#div-product-match-fail').hide('fast');
            } else {
                $('#div-product-match-fail').show('fast');
                $('#div-product-match-pass').hide('fast');
            }

            switch (guid) {
                case productGuids.InvabaCooperativeFundEnterprise:
                    invabaCooperativeFund_Enterprise();
                    break;

                case productGuids.InvabaCooperativeFund :
                    invabaCooperativeFund();
                    break;

                case productGuids.JobStimulusFund:
                    jobStimulusFund();
                    break;

                case productGuids.Strtep:
                    strtep();
                    break;

                case productGuids.NexusTradeLoan:
                    nexusTradeLoan();
                    break;

                case productGuids.WorkFlowContractorLoan:
                    workFlowContractorLoan();
                    break;

                case productGuids.RiskCapitalProjectDevelopmentFinance:
                    riskCapitalProjectDevelopmentFinance();
                    break;

                case productGuids.RiskCapitalBusinessFinance:
                    riskCapitalBusinessFinance();
                    break;

                case productGuids.TermLoanPowerPlus:
                    termLoanPowerPlus();
                    break;

                case productGuids.TermLoanTermCap:
                    termLoadTermCap()
                    break;

                default:
                    noMatch();
                    break;
            }
        }

        validate(args, cb) {
            let result = app.wizard.addResult();
            if (this.productGuid == null || this.productGuid == '') {
                result.status = app.wizard.Result.Fail;
                result.message = 'No match found';
            } else {
            }
            cb(result);
        }
    }

    page.create = function (id) {
        return new ProductMatching(id);
    }
})(app.wizard.productMatching.page);
