(function () {
    $(function () {

        var _$ownerCompanyMappingTable = $('#OwnerCompanyMappingTable');
        var _ownerCompanyMappingService = abp.services.app.ownerCompanyMapping;
		var _entityTypeFullName = 'SME.Portal.Company.OwnerCompanyMap';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.OwnerCompanyMapping.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.OwnerCompanyMapping.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.OwnerCompanyMapping.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/OwnerCompanyMapping/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/OwnerCompanyMapping/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditOwnerCompanyMapModal'
                });
                   

		 var _viewOwnerCompanyMapModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/OwnerCompanyMapping/ViewownerCompanyMapModal',
            modalClass: 'ViewOwnerCompanyMapModal'
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

        var dataTable = _$ownerCompanyMappingTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _ownerCompanyMappingService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#OwnerCompanyMappingTableFilter').val(),
					isPrimaryOwnerFilter: $('#IsPrimaryOwnerFilterId').val(),
					ownerIdentityOrPassportFilter: $('#OwnerIdentityOrPassportFilterId').val(),
					smeCompanyRegistrationNumberFilter: $('#SmeCompanyRegistrationNumberFilterId').val()
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
                                    _viewOwnerCompanyMapModal.open({ id: data.record.ownerCompanyMap.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.ownerCompanyMap.id });                                
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
                                    entityId: data.record.ownerCompanyMap.id
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
                                deleteOwnerCompanyMap(data.record.ownerCompanyMap);
                            }
                        }]
                    }
                },
					{
						targets: 2,
						 data: "ownerCompanyMap.isPrimaryOwner",
						 name: "isPrimaryOwner"  ,
						render: function (isPrimaryOwner) {
							if (isPrimaryOwner) {
								return '<div class="text-center"><i class="fa fa-check text-success" title="True"></i></div>';
							}
							return '<div class="text-center"><i class="fa fa-times-circle" title="False"></i></div>';
					}
			 
					},
					{
						targets: 3,
						 data: "ownerIdentityOrPassport" ,
						 name: "ownerFk.identityOrPassport" 
					},
					{
						targets: 4,
						 data: "smeCompanyRegistrationNumber" ,
						 name: "smeCompanyFk.registrationNumber" 
					}
            ]
        });

        function getOwnerCompanyMapping() {
            dataTable.ajax.reload();
        }

        function deleteOwnerCompanyMap(ownerCompanyMap) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _ownerCompanyMappingService.delete({
                            id: ownerCompanyMap.id
                        }).done(function () {
                            getOwnerCompanyMapping(true);
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

        $('#CreateNewOwnerCompanyMapButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _ownerCompanyMappingService
                .getOwnerCompanyMappingToExcel({
				filter : $('#OwnerCompanyMappingTableFilter').val(),
					isPrimaryOwnerFilter: $('#IsPrimaryOwnerFilterId').val(),
					ownerIdentityOrPassportFilter: $('#OwnerIdentityOrPassportFilterId').val(),
					smeCompanyRegistrationNumberFilter: $('#SmeCompanyRegistrationNumberFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditOwnerCompanyMapModalSaved', function () {
            getOwnerCompanyMapping();
        });

		$('#GetOwnerCompanyMappingButton').click(function (e) {
            e.preventDefault();
            getOwnerCompanyMapping();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getOwnerCompanyMapping();
		  }
		});
		
		
		
    });
})();
