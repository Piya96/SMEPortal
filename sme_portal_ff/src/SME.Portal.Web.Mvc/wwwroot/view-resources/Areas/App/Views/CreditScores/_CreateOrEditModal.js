(function ($) {
    app.modals.CreateOrEditCreditScoreModal = function () {

        var _creditScoresService = abp.services.app.creditScores;

        var _modalManager;
        var _$creditScoreInformationForm = null;

		        var _CreditScoreuserLookupTableModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/CreditScores/UserLookupTableModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/CreditScores/_CreditScoreUserLookupTableModal.js',
            modalClass: 'UserLookupTableModal'
        });

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$creditScoreInformationForm = _modalManager.getModal().find('form[name=CreditScoreInformationsForm]');
            _$creditScoreInformationForm.validate();
        };

		          $('#OpenUserLookupTableButton').click(function () {

            var creditScore = _$creditScoreInformationForm.serializeFormToObject();

            _CreditScoreuserLookupTableModal.open({ id: creditScore.userId, displayName: creditScore.userName }, function (data) {
                _$creditScoreInformationForm.find('input[name=userName]').val(data.displayName); 
                _$creditScoreInformationForm.find('input[name=userId]').val(data.id); 
            });
        });
		
		$('#ClearUserNameButton').click(function () {
                _$creditScoreInformationForm.find('input[name=userName]').val(''); 
                _$creditScoreInformationForm.find('input[name=userId]').val(''); 
        });
		


        this.save = function () {
            if (!_$creditScoreInformationForm.valid()) {
                return;
            }
            if ($('#CreditScore_UserId').prop('required') && $('#CreditScore_UserId').val() == '') {
                abp.message.error(app.localize('{0}IsRequired', app.localize('User')));
                return;
            }

            var creditScore = _$creditScoreInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _creditScoresService.createOrEdit(
				creditScore
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditCreditScoreModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);