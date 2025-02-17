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

if (app.wizard.companyInfo.dto == undefined) {
    app.wizard.companyInfo.dto = {};
}

(function (dto) {

    let productGuids = app.wizard.common.page.productGuids;

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    class DtoToHtml_Tenant extends app.wizard.companyInfo.dto.DtoToHtml {
    
        constructor(self) {
            super(self);
        }
    
        showBeeLevel() {
            return (
                this.productGuid != productGuids.InvabaCooperativeFundEnterprise &&
                this.productGuid != productGuids.InvabaCooperativeFund
            );
        }
    
        showTotalNumberOfPermanentNonSAEmployees() {
            return (
                this.productGuid == productGuids.InvabaCooperativeFund ||
                this.productGuid == productGuids.InvabaCooperativeFundEnterprise ||
                this.productGuid == productGuids.Strtep ||
                this.productGuid == productGuids.JobStimulusFund
            );
        }
    
        showTotalNumberOfPermanentDisabledEmployees() {
            return (
                this.productGuid == productGuids.InvabaCooperativeFund ||
                this.productGuid == productGuids.InvabaCooperativeFundEnterprise ||
                this.productGuid == productGuids.Strtep ||
                this.productGuid == productGuids.JobStimulusFund
            );
        }
    
        showTotalNumberOfPartTimeNonSAEmployees() {
            return (
                this.productGuid == productGuids.InvabaCooperativeFund ||
                this.productGuid == productGuids.InvabaCooperativeFundEnterprise ||
                this.productGuid == productGuids.Strtep ||
                this.productGuid == productGuids.JobStimulusFund
            );
        }
    
        showTotalNumberOfPartTimeDisabledEmployees() {
            return (
                this.productGuid == productGuids.InvabaCooperativeFund ||
                this.productGuid == productGuids.InvabaCooperativeFundEnterprise ||
                this.productGuid == productGuids.Strtep ||
                this.productGuid == productGuids.JobStimulusFund
            );
        }
    
        showNumberOfMilitaryVeterans() {
            return (
                this.productGuid == productGuids.Strtep ||
                this.productGuid == productGuids.JobStimulusFund
            );
        }
    
        showPercentCompaniesOrganisations() {
            return (
                this.productGuid != productGuids.InvabaCooperativeFund &&
                this.productGuid != productGuids.InvabaCooperativeFundEnterprise
            );
        }
    }

    dto.getDto = function (dto) {
        return new DtoToHtml_Tenant(dto);
    }

    dto.DtoToHtml_Tenant = DtoToHtml_Tenant;

})(app.wizard.companyInfo.dto);
