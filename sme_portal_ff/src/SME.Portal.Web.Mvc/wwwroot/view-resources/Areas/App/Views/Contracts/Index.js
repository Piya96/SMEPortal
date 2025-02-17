(function () {
    $(function () {

        var _$contractsTable = $('#ContractsTable');
        var _contractsService = abp.services.app.contracts;
		var _entityTypeFullName = 'SME.Portal.Lenders.Contract';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.Contracts.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.Contracts.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.Contracts.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/Contracts/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Contracts/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditContractModal'
                });
                   

		 var _viewContractModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Contracts/ViewcontractModal',
            modalClass: 'ViewContractModal'
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

        var dataTable = _$contractsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _contractsService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#ContractsTableFilter').val(),
					minStartFilter:  getDateFilter($('#MinStartFilterId')),
					maxStartFilter:  getMaxDateFilter($('#MaxStartFilterId')),
					minExpiryFilter:  getDateFilter($('#MinExpiryFilterId')),
					maxExpiryFilter:  getMaxDateFilter($('#MaxExpiryFilterId')),
					minCommissionFilter: $('#MinCommissionFilterId').val(),
					maxCommissionFilter: $('#MaxCommissionFilterId').val(),
					lenderNameFilter: $('#LenderNameFilterId').val(),
					userNameFilter: $('#UserNameFilterId').val()
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
                                    _viewContractModal.open({ id: data.record.contract.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.contract.id });                                
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
                                    entityId: data.record.contract.id
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
                                deleteContract(data.record.contract);
                            }
                        }]
                    }
                },
					{
						targets: 2,
						 data: "contract.start",
						 name: "start" ,
					render: function (start) {
						if (start) {
							return moment(start).format('L');
						}
						return "";
					}
			  
					},
					{
						targets: 3,
						 data: "contract.expiry",
						 name: "expiry" ,
					render: function (expiry) {
						if (expiry) {
							return moment(expiry).format('L');
						}
						return "";
					}
			  
					},
					{
						targets: 4,
						 data: "contract.commission",
						 name: "commission"   
					},
					{
						targets: 5,
						 data: "lenderName" ,
						 name: "lenderFk.name" 
					},
					{
						targets: 6,
						 data: "userName" ,
						 name: "userFk.name" 
					}
            ]
        });

        function getContracts() {
            dataTable.ajax.reload();
        }

        function deleteContract(contract) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _contractsService.delete({
                            id: contract.id
                        }).done(function () {
                            getContracts(true);
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

        $('#CreateNewContractButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _contractsService
                .getContractsToExcel({
				filter : $('#ContractsTableFilter').val(),
					minStartFilter:  getDateFilter($('#MinStartFilterId')),
					maxStartFilter:  getMaxDateFilter($('#MaxStartFilterId')),
					minExpiryFilter:  getDateFilter($('#MinExpiryFilterId')),
					maxExpiryFilter:  getMaxDateFilter($('#MaxExpiryFilterId')),
					minCommissionFilter: $('#MinCommissionFilterId').val(),
					maxCommissionFilter: $('#MaxCommissionFilterId').val(),
					lenderNameFilter: $('#LenderNameFilterId').val(),
					userNameFilter: $('#UserNameFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditContractModalSaved', function () {
            getContracts();
        });

		$('#GetContractsButton').click(function (e) {
            e.preventDefault();
            getContracts();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getContracts();
		  }
		});
		
		
		
    });
})();
