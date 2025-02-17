(function ($) {
    app.modals.CreateOrEditCurrencyPairModal = function () {

        var _currencyPairsService = abp.services.app.currencyPairs;

        var _modalManager;
        var _$currencyPairInformationForm = null;

		

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$currencyPairInformationForm = _modalManager.getModal().find('form[name=CurrencyPairInformationsForm]');
            _$currencyPairInformationForm.validate();
        };

		  

        this.save = function () {
            if (!_$currencyPairInformationForm.valid()) {
                return;
            }

            var currencyPair = _$currencyPairInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _currencyPairsService.createOrEdit(
				currencyPair
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditCurrencyPairModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);