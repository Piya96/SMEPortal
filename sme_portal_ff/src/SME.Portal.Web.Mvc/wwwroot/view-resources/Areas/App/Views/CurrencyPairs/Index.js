(function () {
    $(function () {

        var _$currencyPairsTable = $('#CurrencyPairsTable');
        var _currencyPairsService = abp.services.app.currencyPairs;
		var _entityTypeFullName = 'SME.Portal.Currency.CurrencyPair';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.CurrencyPairs.Create'),
            edit: abp.auth.hasPermission('Pages.CurrencyPairs.Edit'),
            'delete': abp.auth.hasPermission('Pages.CurrencyPairs.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/CurrencyPairs/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/CurrencyPairs/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditCurrencyPairModal'
                });
                   

		 var _viewCurrencyPairModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/CurrencyPairs/ViewcurrencyPairModal',
            modalClass: 'ViewCurrencyPairModal'
        });

		        var _entityTypeHistoryModal = app.modals.EntityTypeHistoryModal.create();
		        function entityHistoryIsEnabled() {
            return abp.auth.hasPermission('Pages.Administration.AuditLogs') &&
                abp.custom.EntityHistory &&
                abp.custom.EntityHistory.IsEnabled &&
                _.filter(abp.custom.EntityHistory.EnabledEntities, entityType => entityType === _entityTypeFullName).length === 1;
        }

        var getDateFilter = function (element) {
            if (element.data("DateTimePicker").date() == null) {
                return null;
            }
            return element.data("DateTimePicker").date().format("YYYY-MM-DDT00:00:00Z"); 
        }
        
        var getMaxDateFilter = function (element) {
            if (element.data("DateTimePicker").date() == null) {
                return null;
            }
            return element.data("DateTimePicker").date().format("YYYY-MM-DDT23:59:59Z"); 
        }

        var dataTable = _$currencyPairsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _currencyPairsService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#CurrencyPairsTableFilter').val(),
					nameFilter: $('#NameFilterId').val(),
					baseCurrencyCodeFilter: $('#BaseCurrencyCodeFilterId').val(),
					targetCurrencyCodeFilter: $('#TargetCurrencyCodeFilterId').val(),
					minExchangeRateFilter: $('#MinExchangeRateFilterId').val(),
					maxExchangeRateFilter: $('#MaxExchangeRateFilterId').val(),
					symbolFilter: $('#SymbolFilterId').val(),
					logFilter: $('#LogFilterId').val()
                    };
                }
            },
            columnDefs: [
                {
                    className: 'control responsive',
                    orderable: false,
                    render: function () {
                        return '';
                    },
                    targets: 0
                },
                {
                    width: 120,
                    targets: 1,
                    data: null,
                    orderable: false,
                    autoWidth: false,
                    defaultContent: '',
                    rowAction: {
                        cssClass: 'btn btn-brand dropdown-toggle',
                        text: '<i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span>',
                        items: [
						{
                                text: app.localize('View'),
                                iconStyle: 'far fa-eye mr-2',
                                action: function (data) {
                                    _viewCurrencyPairModal.open({ id: data.record.currencyPair.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.currencyPair.id });                                
                            }
                        },
                        {
                            text: app.localize('History'),
                            iconStyle: 'fas fa-history mr-2',
                            visible: function () {
                                return entityHistoryIsEnabled();
                            },
                            action: function (data) {
                                _entityTypeHistoryModal.open({
                                    entityTypeFullName: _entityTypeFullName,
                                    entityId: data.record.currencyPair.id
                                });
                            }
						}, 
						{
                            text: app.localize('Delete'),
                            iconStyle: 'far fa-trash-alt mr-2',
                            visible: function () {
                                return _permissions.delete;
                            },
                            action: function (data) {
                                deleteCurrencyPair(data.record.currencyPair);
                            }
                        }]
                    }
                },
					{
						targets: 2,
						 data: "currencyPair.name",
						 name: "name"   
					},
					{
						targets: 3,
						 data: "currencyPair.baseCurrencyCode",
						 name: "baseCurrencyCode"   
					},
					{
						targets: 4,
						 data: "currencyPair.targetCurrencyCode",
						 name: "targetCurrencyCode"   
					},
					{
						targets: 5,
						 data: "currencyPair.exchangeRate",
						 name: "exchangeRate"   
					},
					{
						targets: 6,
						 data: "currencyPair.symbol",
						 name: "symbol"   
					},
					{
						targets: 7,
						 data: "currencyPair.log",
						 name: "log"   
					}
            ]
        });

        function getCurrencyPairs() {
            dataTable.ajax.reload();
        }

        function deleteCurrencyPair(currencyPair) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _currencyPairsService.delete({
                            id: currencyPair.id
                        }).done(function () {
                            getCurrencyPairs(true);
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
            );
        }

		$('#ShowAdvancedFiltersSpan').click(function () {
            $('#ShowAdvancedFiltersSpan').hide();
            $('#HideAdvancedFiltersSpan').show();
            $('#AdvacedAuditFiltersArea').slideDown();
        });

        $('#HideAdvancedFiltersSpan').click(function () {
            $('#HideAdvancedFiltersSpan').hide();
            $('#ShowAdvancedFiltersSpan').show();
            $('#AdvacedAuditFiltersArea').slideUp();
        });

        $('#CreateNewCurrencyPairButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _currencyPairsService
                .getCurrencyPairsToExcel({
				filter : $('#CurrencyPairsTableFilter').val(),
					nameFilter: $('#NameFilterId').val(),
					baseCurrencyCodeFilter: $('#BaseCurrencyCodeFilterId').val(),
					targetCurrencyCodeFilter: $('#TargetCurrencyCodeFilterId').val(),
					minExchangeRateFilter: $('#MinExchangeRateFilterId').val(),
					maxExchangeRateFilter: $('#MaxExchangeRateFilterId').val(),
					symbolFilter: $('#SymbolFilterId').val(),
					logFilter: $('#LogFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditCurrencyPairModalSaved', function () {
            getCurrencyPairs();
        });

		$('#GetCurrencyPairsButton').click(function (e) {
            e.preventDefault();
            getCurrencyPairs();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getCurrencyPairs();
		  }
		});
		
		
		
    });
})();
