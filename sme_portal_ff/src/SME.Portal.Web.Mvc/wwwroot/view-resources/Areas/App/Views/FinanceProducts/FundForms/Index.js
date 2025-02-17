var _fundFormsAppService = abp.services.app.fundForms;
var _sendFundForms = new app.ModalManager({
    viewUrl: abp.appPath + 'App/FundForms/SendFundForm',
    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/FinanceProducts/FundForms/SendFundForms.js',
    modalClass: 'SendFundFormsModal'
});
var FundFormDto = { Id: null }
function deleteFundFormItem(fundformid) {
    console.log("Hi deletefundform id", fundformid);
    _fundFormsAppService.deleteFundForm(fundformid).done(function () {
        abp.notify.info(app.localize('DeletedSuccessfully'));
        location.reload();
    });
}

function resendFundForm(fundformid) {
    FundFormDto.Id = fundformid;
    _fundFormsAppService.insertSendFundFormsEmail(FundFormDto).done(function () {
        abp.notify.info(app.localize('SavedSuccessfully'));
        location.reload();
    });
}

$('#SendFundFormButton').click(function () {
    _sendFundForms.open({ financeProductId: $('#FinanceProductIdInFundForms').val() });
});