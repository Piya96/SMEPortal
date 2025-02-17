(function ($) {
    app.modals.LenderLookupTableModal = function () {

        var _modalManager;

        var _contractsService = abp.services.app.contracts;
        var _$lenderTable = $('#LenderTable');

        this.init = function (modalManager) {
            _modalManager = modalManager;
        };


        var dataTable = _$lenderTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _contractsService.getAllLenderForLookupTable,
                inputFilter: function () {
                    return {
                        filter: $('#LenderTableFilter').val()
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

        $('#LenderTable tbody').on('click', '[id*=selectbtn]', function () {
            var data = dataTable.row($(this).parents('tr')).data();
            _modalManager.setResult(data);
            _modalManager.close();
        });

        function getLender() {
            dataTable.ajax.reload();
        }

        $('#GetLenderButton').click(function (e) {
            e.preventDefault();
            getLender();
        });

        $('#SelectButton').click(function (e) {
            e.preventDefault();
        });

        $(document).keypress(function (e) {
            if (e.which === 13) {
                getLender();
            }
        });

    };
})(jQuery);

