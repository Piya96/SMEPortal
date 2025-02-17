(function ($) {
    app.modals.SubscriptionPaymentLookupTableModal = function () {

        var _modalManager;

        var _smeSubscriptionsService = abp.services.app.smeSubscriptions;
        var _$subscriptionPaymentTable = $('#SubscriptionPaymentTable');

        this.init = function (modalManager) {
            _modalManager = modalManager;
        };


        var dataTable = _$subscriptionPaymentTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _smeSubscriptionsService.getAllSubscriptionPaymentForLookupTable,
                inputFilter: function () {
                    return {
                        filter: $('#SubscriptionPaymentTableFilter').val()
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

        $('#SubscriptionPaymentTable tbody').on('click', '[id*=selectbtn]', function () {
            var data = dataTable.row($(this).parents('tr')).data();
            _modalManager.setResult(data);
            _modalManager.close();
        });

        function getSubscriptionPayment() {
            dataTable.ajax.reload();
        }

        $('#GetSubscriptionPaymentButton').click(function (e) {
            e.preventDefault();
            getSubscriptionPayment();
        });

        $('#SelectButton').click(function (e) {
            e.preventDefault();
        });

        $(document).keypress(function (e) {
            if (e.which === 13) {
                getSubscriptionPayment();
            }
        });

    };
})(jQuery);

