(function ($) {
    app.modals.CreateOrEditDocumentModal = function () {

        var _documentsService = abp.services.app.documents;

        var _modalManager;
        var _$documentInformationForm = null;

		        var _DocumentsmeCompanyLookupTableModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Documents/SmeCompanyLookupTableModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Documents/_DocumentSmeCompanyLookupTableModal.js',
            modalClass: 'SmeCompanyLookupTableModal'
        });

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$documentInformationForm = _modalManager.getModal().find('form[name=DocumentInformationsForm]');
            _$documentInformationForm.validate();
        };

		          $('#OpenSmeCompanyLookupTableButton').click(function () {

            var document = _$documentInformationForm.serializeFormToObject();

            _DocumentsmeCompanyLookupTableModal.open({ id: document.smeCompanyId, displayName: document.smeCompanyName }, function (data) {
                _$documentInformationForm.find('input[name=smeCompanyName]').val(data.displayName); 
                _$documentInformationForm.find('input[name=smeCompanyId]').val(data.id); 
            });
        });
		
		$('#ClearSmeCompanyNameButton').click(function () {
                _$documentInformationForm.find('input[name=smeCompanyName]').val(''); 
                _$documentInformationForm.find('input[name=smeCompanyId]').val(''); 
        });
		


        this.save = function () {
            if (!_$documentInformationForm.valid()) {
                return;
            }
            if ($('#Document_SmeCompanyId').prop('required') && $('#Document_SmeCompanyId').val() == '') {
                abp.message.error(app.localize('{0}IsRequired', app.localize('SmeCompany')));
                return;
            }

            var document = _$documentInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _documentsService.createOrEdit(
				document
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditDocumentModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);