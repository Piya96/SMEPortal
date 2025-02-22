﻿(function ($) {
    app.modals.OwnerLookupTableModal = function () {

        var _modalManager;

        var _smeCompaniesService = abp.services.app.smeCompanies;
        var _$ownerTable = $('#OwnerTable');

        this.init = function (modalManager) {
            _modalManager = modalManager;
        };


        var dataTable = _$ownerTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _smeCompaniesService.getAllOwnerForLookupTable,
                inputFilter: function () {
                    return {
                        filter: $('#OwnerTableFilter').val()
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

        $('#OwnerTable tbody').on('click', '[id*=selectbtn]', function () {
            var data = dataTable.row($(this).parents('tr')).data();
            _modalManager.setResult(data);
            _modalManager.close();
        });

        function getOwner() {
            dataTable.ajax.reload();
        }

        $('#GetOwnerButton').click(function (e) {
            e.preventDefault();
            getOwner();
        });

        $('#SelectButton').click(function (e) {
            e.preventDefault();
        });

        $(document).keypress(function (e) {
            if (e.which === 13) {
                getOwner();
            }
        });

    };
})(jQuery);

