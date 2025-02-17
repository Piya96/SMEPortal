(function ($) {
    app.modals.CreateOrEditOwnerCompanyMapModal = function () {

        var _ownerCompanyMappingService = abp.services.app.ownerCompanyMapping;

        var _modalManager;
        var _$ownerCompanyMapInformationForm = null;

		        var _OwnerCompanyMapownerLookupTableModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/OwnerCompanyMapping/OwnerLookupTableModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/OwnerCompanyMapping/_OwnerCompanyMapOwnerLookupTableModal.js',
            modalClass: 'OwnerLookupTableModal'
        });        var _OwnerCompanyMapsmeCompanyLookupTableModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/OwnerCompanyMapping/SmeCompanyLookupTableModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/OwnerCompanyMapping/_OwnerCompanyMapSmeCompanyLookupTableModal.js',
            modalClass: 'SmeCompanyLookupTableModal'
        });

        this.init = function (modalManager) {
            _modalManager = modalManager;

			var modal = _modalManager.getModal();
            modal.find('.date-picker').datetimepicker({
                locale: abp.localization.currentLanguage.name,
                format: 'L'
            });

            _$ownerCompanyMapInformationForm = _modalManager.getModal().find('form[name=OwnerCompanyMapInformationsForm]');
            _$ownerCompanyMapInformationForm.validate();
        };

		          $('#OpenOwnerLookupTableButton').click(function () {

            var ownerCompanyMap = _$ownerCompanyMapInformationForm.serializeFormToObject();

            _OwnerCompanyMapownerLookupTableModal.open({ id: ownerCompanyMap.ownerId, displayName: ownerCompanyMap.ownerIdentityOrPassport }, function (data) {
                _$ownerCompanyMapInformationForm.find('input[name=ownerIdentityOrPassport]').val(data.displayName); 
                _$ownerCompanyMapInformationForm.find('input[name=ownerId]').val(data.id); 
            });
        });
		
		$('#ClearOwnerIdentityOrPassportButton').click(function () {
                _$ownerCompanyMapInformationForm.find('input[name=ownerIdentityOrPassport]').val(''); 
                _$ownerCompanyMapInformationForm.find('input[name=ownerId]').val(''); 
        });
		
        $('#OpenSmeCompanyLookupTableButton').click(function () {

            var ownerCompanyMap = _$ownerCompanyMapInformationForm.serializeFormToObject();

            _OwnerCompanyMapsmeCompanyLookupTableModal.open({ id: ownerCompanyMap.smeCompanyId, displayName: ownerCompanyMap.smeCompanyRegistrationNumber }, function (data) {
                _$ownerCompanyMapInformationForm.find('input[name=smeCompanyRegistrationNumber]').val(data.displayName); 
                _$ownerCompanyMapInformationForm.find('input[name=smeCompanyId]').val(data.id); 
            });
        });
		
		$('#ClearSmeCompanyRegistrationNumberButton').click(function () {
                _$ownerCompanyMapInformationForm.find('input[name=smeCompanyRegistrationNumber]').val(''); 
                _$ownerCompanyMapInformationForm.find('input[name=smeCompanyId]').val(''); 
        });
		


        this.save = function () {
            if (!_$ownerCompanyMapInformationForm.valid()) {
                return;
            }
            if ($('#OwnerCompanyMap_OwnerId').prop('required') && $('#OwnerCompanyMap_OwnerId').val() == '') {
                abp.message.error(app.localize('{0}IsRequired', app.localize('Owner')));
                return;
            }
            if ($('#OwnerCompanyMap_SmeCompanyId').prop('required') && $('#OwnerCompanyMap_SmeCompanyId').val() == '') {
                abp.message.error(app.localize('{0}IsRequired', app.localize('SmeCompany')));
                return;
            }

            var ownerCompanyMap = _$ownerCompanyMapInformationForm.serializeFormToObject();
			
			 _modalManager.setBusy(true);
			 _ownerCompanyMappingService.createOrEdit(
				ownerCompanyMap
			 ).done(function () {
               abp.notify.info(app.localize('SavedSuccessfully'));
               _modalManager.close();
               abp.event.trigger('app.createOrEditOwnerCompanyMapModalSaved');
			 }).always(function () {
               _modalManager.setBusy(false);
			});
        };
    };
})(jQuery);