(function ($) {
    app.modals.CreateOrEditCreditReportModal = function () {

        var _creditReportsService = abp.services.app.creditReports;

        var _modalManager;
        var _$creditReportInformationForm = null;

		        var _CreditReportuserLookupTableModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/CreditReports/UserLookupTableModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/CreditReports/_CreditReportUserLookupTableModal.js',
            modalClass: 'UserLookupTableModal'
        });

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$creditReportInformationForm = _modalManager.getModal().find('form[name=CreditReportInformationsForm]');
            _$creditReportInformationForm.validate();
        };

		          $('#OpenUserLookupTableButton').click(function () {

            var creditReport = _$creditReportInformationForm.serializeFormToObject();

            _CreditReportuserLookupTableModal.open({ id: creditReport.userId, displayName: creditReport.userName }, function (data) {
                _$creditReportInformationForm.find('input[name=userName]').val(data.displayName); 
                _$creditReportInformationForm.find('input[name=userId]').val(data.id); 
            });
        });
		
		$('#ClearUserNameButton').click(function () {
                _$creditReportInformationForm.find('input[name=userName]').val(''); 
                _$creditReportInformationForm.find('input[name=userId]').val(''); 
        });
		


        this.save = function () {
            if (!_$creditReportInformationForm.valid()) {
                return;
            }
            if ($('#CreditReport_UserId').prop('required') && $('#CreditReport_UserId').val() == '') {
                abp.message.error(app.localize('{0}IsRequired', app.localize('User')));
                return;
            }

            var creditReport = _$creditReportInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _creditReportsService.createOrEdit(
				creditReport
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditCreditReportModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);