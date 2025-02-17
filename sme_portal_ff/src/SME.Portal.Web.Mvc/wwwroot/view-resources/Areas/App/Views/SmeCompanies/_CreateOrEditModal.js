(function ($) {
    app.modals.CreateOrEditSmeCompanyModal = function () {

        var _smeCompaniesService = abp.services.app.smeCompanies;

        var _modalManager;
        var _$smeCompanyInformationForm = null;

		        var _SmeCompanyuserLookupTableModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/SmeCompanies/UserLookupTableModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/SmeCompanies/_SmeCompanyUserLookupTableModal.js',
            modalClass: 'UserLookupTableModal'
        });

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$smeCompanyInformationForm = _modalManager.getModal().find('form[name=SmeCompanyInformationsForm]');
            _$smeCompanyInformationForm.validate();
        };

		          $('#OpenUserLookupTableButton').click(function () {

            var smeCompany = _$smeCompanyInformationForm.serializeFormToObject();

            _SmeCompanyuserLookupTableModal.open({ id: smeCompany.userId, displayName: smeCompany.userName }, function (data) {
                _$smeCompanyInformationForm.find('input[name=userName]').val(data.displayName); 
                _$smeCompanyInformationForm.find('input[name=userId]').val(data.id); 
            });
        });
		
		$('#ClearUserNameButton').click(function () {
                _$smeCompanyInformationForm.find('input[name=userName]').val(''); 
                _$smeCompanyInformationForm.find('input[name=userId]').val(''); 
        });
		


        this.save = function () {
            if (!_$smeCompanyInformationForm.valid()) {
                return;
            }
            if ($('#SmeCompany_UserId').prop('required') && $('#SmeCompany_UserId').val() == '') {
                abp.message.error(app.localize('{0}IsRequired', app.localize('User')));
                return;
            }

            var smeCompany = _$smeCompanyInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _smeCompaniesService.createOrEdit(
				smeCompany
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditSmeCompanyModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);