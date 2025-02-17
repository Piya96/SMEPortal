(function ($) {
    app.modals.CreateOrEditListItemModal = function () {

        var _listItemsService = abp.services.app.listItems;

        var _modalManager;
        var _$listItemInformationForm = null;

		

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$listItemInformationForm = _modalManager.getModal().find('form[name=ListItemInformationsForm]');
            _$listItemInformationForm.validate();
        };

		  

        this.save = function () {
            if (!_$listItemInformationForm.valid()) {
                return;
            }

            var listItem = _$listItemInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _listItemsService.createOrEdit(
				listItem
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditListItemModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);