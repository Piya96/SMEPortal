"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.financialInfo == undefined) {
    app.wizard.financialInfo = {};
}

if (app.wizard.financialInfo.dto == undefined) {
    app.wizard.financialInfo.dto = {};
}

(function (dto) {

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.get();

    class DtoToHtml_Sefa extends app.wizard.financialInfo.dto.DtoToHtml {
        constructor(self) {
            super(self);
        }

        companyContribution_Hide() {
            return false;
        }

        getCollateralOther() {
            return '62c6f856c50341864eb71970';
        }

        getCollateralNone() {
            return '4586ac64fbd24de3ae3e231d87fb6d4e';
        }

        getSecurityOther() {
            return '62c6f91ead740b088bee2947';
        }

        getSecurityNone() {
            return '93ce8e429c1542bdbc63674035a8cb19';
        }

        getSourceOfFundsOther() {
            return '6278d3714d04c757940db02e';
        }

        apply(dto) {
            super.apply(dto);
        }
    }

    dto.getDto = function (dto) {
        return new DtoToHtml_Sefa(dto);
    }

    dto.DtoToHtml_Sefa = DtoToHtml_Sefa;

})(app.wizard.financialInfo.dto);
