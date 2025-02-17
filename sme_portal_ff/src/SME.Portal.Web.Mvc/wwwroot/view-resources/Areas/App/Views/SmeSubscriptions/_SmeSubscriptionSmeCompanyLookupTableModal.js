(function ($) {
    app.modals.SmeCompanyLookupTableModal = function () {

        var _modalManager;

        var _smeSubscriptionsService = abp.services.app.smeSubscriptions;
        var _$smeCompanyTable = $('#SmeCompanyTable');

        this.init = function (modalManager) {
            _modalManager = modalManager;
        };


        var dataTable = _$smeCompanyTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _smeSubscriptionsService.getAllSmeCompanyForLookupTable,
                inputFilter: function () {
                    return {
                        filter: $('#SmeCompanyTableFilter').val()
                    };
                }
            },
            columnDefs: [
                {
                    targets: 0,
                    data: null,
                    orderable: false,
                    autoWidth: false,
                    defaultContent: "<div class=\"text-center\"><input id='selectbtn' class='btn btn-success' type='button' width='25px' value='" + app.localize('Select') + "' /></div>"
                },
                {
                    autoWidth: false,
                    orderable: false,
                    targets: 1,
                    data: "displayName"
                }
            ]
        });

        $('#SmeCompanyTable tbody').on('click', '[id*=selectbtn]', function () {
            var data = dataTable.row($(this).parents('tr')).data();
            _modalManager.setResult(data);
            _modalManager.close();
        });

        function getSmeCompany() {
            dataTable.ajax.reload();
        }

        $('#GetSmeCompanyButton').click(function (e) {
            e.preventDefault();
            getSmeCompany();
        });

        $('#SelectButton').click(function (e) {
            e.preventDefault();
        });

        $(document).keypress(function (e) {
            if (e.which === 13) {
                getSmeCompany();
            }
        });

    };
})(jQuery);

