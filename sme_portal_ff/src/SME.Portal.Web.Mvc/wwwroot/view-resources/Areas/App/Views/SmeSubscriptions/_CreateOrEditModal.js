(function ($) {
    app.modals.CreateOrEditSmeSubscriptionModal = function () {

        var _smeSubscriptionsService = abp.services.app.smeSubscriptions;

        var _modalManager;
        var _$smeSubscriptionInformationForm = null;

		

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$smeSubscriptionInformationForm = _modalManager.getModal().find('form[name=SmeSubscriptionInformationsForm]');
            _$smeSubscriptionInformationForm.validate();
        };

		  

        this.save = function () {
            if (!_$smeSubscriptionInformationForm.valid()) {
                return;
            }

            var smeSubscription = _$smeSubscriptionInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _smeSubscriptionsService.createOrEdit(
				smeSubscription
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditSmeSubscriptionModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);