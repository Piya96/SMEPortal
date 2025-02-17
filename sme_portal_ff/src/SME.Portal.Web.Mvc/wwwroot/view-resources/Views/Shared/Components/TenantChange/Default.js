(function () {

    var _tenantChangeModal = new app.ModalManager({
        viewUrl: abp.appPath + 'Account/TenantChangeModal',
        scriptUrl: abp.appPath + 'view-resources/Views/Shared/Components/TenantChange/_ChangeModal.js',
        modalClass: 'TenantChangeModal',
        modalSize: null
    });

    $('.tenant-change-component a')
        .click(function (e) {
            e.preventDefault();
            _tenantChangeModal.open({}, null, function ($modal) {
                var $tenancyNameInput = $modal.find('#TenancyName');
                var $switchToTenant = $modal.find('#SwitchToTenant');
                var $selectToTenant = $modal.find('#SelectToTenant');
                var $tenancyNameRequired = $modal.find('#TenancyNameRequired');
                var $saveButton = $modal.find('.save-button');
                var tenancyName = $tenancyNameInput.val();

                var validate = function (pristine) {
                    if ($switchToTenant.is(":checked") && !$tenancyNameInput.val()) {
                       $saveButton.prop('disabled', true);
                       if (!pristine) {
                           $tenancyNameRequired.removeClass("d-none");
                       }
                    } else {
                        $saveButton.prop('disabled', false);
                        if (!pristine) {
                            $tenancyNameRequired.addClass("d-none");
                        }
                    }
                };

                $switchToTenant.change(function () {
                    $tenancyNameInput.prop('disabled', !this.checked);
                    $selectToTenant.prop('disabled', !this.checked);

                    if (this.checked) {
                        $tenancyNameInput.focus();
                        $tenancyNameInput.val(tenancyName);
                        $saveButton.find('span').text(app.localize('SwitchToTheTenant'));
                    } else {
                        tenancyName = $tenancyNameInput.val();
                        $tenancyNameInput.val('');
                        $saveButton.find('span').text(app.localize('SwitchToTheHost'));
                    }

                    validate(true);
                });

                $selectToTenant.change(function () {
                    var value = $("#SelectToTenant option:selected").text();
                    $tenancyNameInput.val(value);
                    $saveButton.click();
                });

                $tenancyNameInput.keyup(function() {
                    validate(false);
                });

            });
        });
})();