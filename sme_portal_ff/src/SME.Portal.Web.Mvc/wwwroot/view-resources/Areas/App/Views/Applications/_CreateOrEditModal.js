(function ($) {
    app.modals.CreateOrEditApplicationModal = function () {

    var _applicationsService = abp.services.app.applications;

    var _modalManager;
    var _$applicationInformationForm = null;

	var _ApplicationuserLookupTableModal = new app.ModalManager({
        viewUrl: abp.appPath + 'App/Applications/UserLookupTableModal',
        scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Applications/_ApplicationUserLookupTableModal.js',
        modalClass: 'UserLookupTableModal'
    });

    var _ApplicationsmeCompanyLookupTableModal = new app.ModalManager({
        viewUrl: abp.appPath + 'App/Applications/SmeCompanyLookupTableModal',
        scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Applications/_ApplicationSmeCompanyLookupTableModal.js',
        modalClass: 'SmeCompanyLookupTableModal'
    });

    this.init = function (modalManager) {
        _modalManager = modalManager;

		var modal = _modalManager.getModal();
        modal.find('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        _$applicationInformationForm = _modalManager.getModal().find('form[name=ApplicationInformationsForm]');
        _$applicationInformationForm.validate();
    };

    $('#OpenUserLookupTableButton').click(function () {

        var application = _$applicationInformationForm.serializeFormToObject();

        _ApplicationuserLookupTableModal.open({ id: application.userId, displayName: application.userName }, function (data) {
            _$applicationInformationForm.find('input[name=userName]').val(data.displayName); 
            _$applicationInformationForm.find('input[name=userId]').val(data.id); 
        });
    });
		
	$('#ClearUserNameButton').click(function () {
        _$applicationInformationForm.find('input[name=userName]').val(''); 
        _$applicationInformationForm.find('input[name=userId]').val(''); 
    });
		
    $('#OpenSmeCompanyLookupTableButton').click(function () {

        var application = _$applicationInformationForm.serializeFormToObject();

        _ApplicationsmeCompanyLookupTableModal.open({ id: application.smeCompanyId, displayName: application.smeCompanyName }, function (data) {
            _$applicationInformationForm.find('input[name=smeCompanyName]').val(data.displayName); 
            _$applicationInformationForm.find('input[name=smeCompanyId]').val(data.id); 
        });
    });
		
	$('#ClearSmeCompanyNameButton').click(function () {
            _$applicationInformationForm.find('input[name=smeCompanyName]').val(''); 
            _$applicationInformationForm.find('input[name=smeCompanyId]').val(''); 
    });
		


    this.save = function () {
        if (!_$applicationInformationForm.valid()) {
            return;
        }
        if ($('#Application_UserId').prop('required') && $('#Application_UserId').val() == '') {
            abp.message.error(app.localize('{0}IsRequired', app.localize('User')));
            return;
        }
        if ($('#Application_SmeCompanyId').prop('required') && $('#Application_SmeCompanyId').val() == '') {
            abp.message.error(app.localize('{0}IsRequired', app.localize('SmeCompany')));
            return;
        }

        var application = _$applicationInformationForm.serializeFormToObject();
			
			_modalManager.setBusy(true);
			_applicationsService.createOrEdit(
			application
			).done(function () {
            abp.notify.info(app.localize('SavedSuccessfully'));
            _modalManager.close();
            abp.event.trigger('app.createOrEditApplicationModalSaved');
			}).always(function () {
            _modalManager.setBusy(false);
		});
    };
};
})(jQuery);