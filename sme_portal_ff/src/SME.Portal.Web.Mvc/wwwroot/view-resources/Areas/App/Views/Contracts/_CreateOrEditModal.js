(function ($) {
    app.modals.CreateOrEditContractModal = function () {

        var _contractsService = abp.services.app.contracts;

        var _modalManager;
        var _$contractInformationForm = null;

		        var _ContractlenderLookupTableModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Contracts/LenderLookupTableModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Contracts/_ContractLenderLookupTableModal.js',
            modalClass: 'LenderLookupTableModal'
        });        var _ContractuserLookupTableModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Contracts/UserLookupTableModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Contracts/_ContractUserLookupTableModal.js',
            modalClass: 'UserLookupTableModal'
        });

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$contractInformationForm = _modalManager.getModal().find('form[name=ContractInformationsForm]');
            _$contractInformationForm.validate();
        };

		          $('#OpenLenderLookupTableButton').click(function () {

            var contract = _$contractInformationForm.serializeFormToObject();

            _ContractlenderLookupTableModal.open({ id: contract.lenderId, displayName: contract.lenderName }, function (data) {
                _$contractInformationForm.find('input[name=lenderName]').val(data.displayName); 
                _$contractInformationForm.find('input[name=lenderId]').val(data.id); 
            });
        });
		
		$('#ClearLenderNameButton').click(function () {
                _$contractInformationForm.find('input[name=lenderName]').val(''); 
                _$contractInformationForm.find('input[name=lenderId]').val(''); 
        });
		
        $('#OpenUserLookupTableButton').click(function () {

            var contract = _$contractInformationForm.serializeFormToObject();

            _ContractuserLookupTableModal.open({ id: contract.userId, displayName: contract.userName }, function (data) {
                _$contractInformationForm.find('input[name=userName]').val(data.displayName); 
                _$contractInformationForm.find('input[name=userId]').val(data.id); 
            });
        });
		
		$('#ClearUserNameButton').click(function () {
                _$contractInformationForm.find('input[name=userName]').val(''); 
                _$contractInformationForm.find('input[name=userId]').val(''); 
        });
		


        this.save = function () {
            if (!_$contractInformationForm.valid()) {
                return;
            }
            if ($('#Contract_LenderId').prop('required') && $('#Contract_LenderId').val() == '') {
                abp.message.error(app.localize('{0}IsRequired', app.localize('Lender')));
                return;
            }
            if ($('#Contract_UserId').prop('required') && $('#Contract_UserId').val() == '') {
                abp.message.error(app.localize('{0}IsRequired', app.localize('User')));
                return;
            }

            var contract = _$contractInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _contractsService.createOrEdit(
				contract
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditContractModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);