(function ($) {
    app.modals.CreateOrEditOwnerModal = function () {

        var _ownersService = abp.services.app.owners;

        var _modalManager;
        var _$ownerInformationForm = null;

		        var _OwneruserLookupTableModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Owners/UserLookupTableModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Owners/_OwnerUserLookupTableModal.js',
            modalClass: 'UserLookupTableModal'
        });

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$ownerInformationForm = _modalManager.getModal().find('form[name=OwnerInformationsForm]');
            _$ownerInformationForm.validate();
        };

		          $('#OpenUserLookupTableButton').click(function () {

            var owner = _$ownerInformationForm.serializeFormToObject();

            _OwneruserLookupTableModal.open({ id: owner.userId, displayName: owner.userName }, function (data) {
                _$ownerInformationForm.find('input[name=userName]').val(data.displayName); 
                _$ownerInformationForm.find('input[name=userId]').val(data.id); 
            });
        });
		
		$('#ClearUserNameButton').click(function () {
                _$ownerInformationForm.find('input[name=userName]').val(''); 
                _$ownerInformationForm.find('input[name=userId]').val(''); 
        });
		


        this.save = function () {
            if (!_$ownerInformationForm.valid()) {
                return;
            }
            if ($('#Owner_UserId').prop('required') && $('#Owner_UserId').val() == '') {
                abp.message.error(app.localize('{0}IsRequired', app.localize('User')));
                return;
            }

            var owner = _$ownerInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _ownersService.createOrEdit(
				owner
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditOwnerModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);