(function ($) {
    app.modals.SendFundFormsModal = function () {

        var _fundFormsAppService = abp.services.app.fundForms;
        var _modalManager;
        var _$sendFundForm = null;

        this.init = function (modalManager) {
            _modalManager = modalManager;

            var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$sendFundForm = _modalManager.getModal().find('form[name=SendFundForm]');
            _$sendFundForm.validate();
        };

        this.save = async function () {

            if (!_$sendFundForm.valid()) {
                return;
            }
            var fundform = _$sendFundForm.serializeFormToObject();
            _modalManager.setBusy(true);
            _fundFormsAppService.insertSendFundFormsEmail(
                fundform
            ).done(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                _modalManager.close();
                location.reload();
            }).always(function () {
                _modalManager.setBusy(false);
            });
        };
    };
})(jQuery);