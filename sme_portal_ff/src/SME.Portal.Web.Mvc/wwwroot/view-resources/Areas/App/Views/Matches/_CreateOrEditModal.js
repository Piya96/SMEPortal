(function ($) {
    app.modals.CreateOrEditMatchModal = function () {

        var _matchesService = abp.services.app.matches;

        var _modalManager;
        var _$matchInformationForm = null;

		

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$matchInformationForm = _modalManager.getModal().find('form[name=MatchInformationsForm]');
            _$matchInformationForm.validate();
        };

		  

        this.save = function () {
            if (!_$matchInformationForm.valid()) {
                return;
            }

            var match = _$matchInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _matchesService.createOrEdit(
				match
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditMatchModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);