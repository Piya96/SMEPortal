(function () {
    $(function () {

        var _$smeCompaniesTable = $('#SmeCompaniesTable');
        var _smeCompaniesService = abp.services.app.smeCompanies;
		var _entityTypeFullName = 'SME.Portal.Company.SmeCompany';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.SmeCompanies.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.SmeCompanies.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.SmeCompanies.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/SmeCompanies/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/SmeCompanies/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditSmeCompanyModal'
                });
                   

		 var _viewSmeCompanyModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/SmeCompanies/ViewsmeCompanyModal',
            modalClass: 'ViewSmeCompanyModal'
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

        var dataTable = _$smeCompaniesTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _smeCompaniesService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#SmeCompaniesTableFilter').val(),
					nameFilter: $('#NameFilterId').val(),
					registrationNumberFilter: $('#RegistrationNumberFilterId').val(),
					typeFilter: $('#TypeFilterId').val(),
					minRegistrationDateFilter:  getDateFilter($('#MinRegistrationDateFilterId')),
					maxRegistrationDateFilter:  getMaxDateFilter($('#MaxRegistrationDateFilterId')),
					minStartedTradingDateFilter:  getDateFilter($('#MinStartedTradingDateFilterId')),
					maxStartedTradingDateFilter:  getMaxDateFilter($('#MaxStartedTradingDateFilterId')),
					registeredAddressFilter: $('#RegisteredAddressFilterId').val(),
					customersFilter: $('#CustomersFilterId').val(),
					propertiesJsonFilter: $('#PropertiesJsonFilterId').val(),
					webSiteFilter: $('#WebSiteFilterId').val(),
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
                                    _viewSmeCompanyModal.open({ id: data.record.smeCompany.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.smeCompany.id });                                
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
                                    entityId: data.record.smeCompany.id
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
                                deleteSmeCompany(data.record.smeCompany);
                            }
                        }]
                    }
                },
					{
						targets: 2,
						 data: "smeCompany.name",
						 name: "name"   
					},
					{
						targets: 3,
						 data: "smeCompany.registrationNumber",
						 name: "registrationNumber"   
					},
					{
						targets: 4,
						 data: "smeCompany.type",
						 name: "type"   
					},
					{
						targets: 5,
						 data: "smeCompany.registrationDate",
						 name: "registrationDate" ,
					render: function (registrationDate) {
						if (registrationDate) {
							return moment(registrationDate).format('L');
						}
						return "";
					}
			  
					},
					{
						targets: 6,
						 data: "smeCompany.startedTradingDate",
						 name: "startedTradingDate" ,
					render: function (startedTradingDate) {
						if (startedTradingDate) {
							return moment(startedTradingDate).format('L');
						}
						return "";
					}
			  
					},
					{
						targets: 7,
						 data: "smeCompany.registeredAddress",
						 name: "registeredAddress"   
					},
					{
						targets: 8,
						 data: "smeCompany.verificationRecordJson",
						 name: "verificationRecordJson"   
					},
					{
						targets: 9,
						 data: "smeCompany.customers",
						 name: "customers"   
					},
					{
						targets: 10,
						 data: "smeCompany.beeLevel",
						 name: "beeLevel"   
					},
					{
						targets: 11,
						 data: "smeCompany.industries",
						 name: "industries"   
					},
					{
						targets: 12,
						 data: "smeCompany.propertiesJson",
						 name: "propertiesJson"   
					},
					{
						targets: 13,
						 data: "smeCompany.webSite",
						 name: "webSite"   
					},
					{
						targets: 14,
						 data: "userName" ,
						 name: "userFk.name" 
					}
            ]
        });

        function getSmeCompanies() {
            dataTable.ajax.reload();
        }

        function deleteSmeCompany(smeCompany) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _smeCompaniesService.delete({
                            id: smeCompany.id
                        }).done(function () {
                            getSmeCompanies(true);
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

        $('#CreateNewSmeCompanyButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _smeCompaniesService
                .getSmeCompaniesToExcel({
				filter : $('#SmeCompaniesTableFilter').val(),
					nameFilter: $('#NameFilterId').val(),
					registrationNumberFilter: $('#RegistrationNumberFilterId').val(),
					typeFilter: $('#TypeFilterId').val(),
					minRegistrationDateFilter:  getDateFilter($('#MinRegistrationDateFilterId')),
					maxRegistrationDateFilter:  getMaxDateFilter($('#MaxRegistrationDateFilterId')),
					minStartedTradingDateFilter:  getDateFilter($('#MinStartedTradingDateFilterId')),
					maxStartedTradingDateFilter:  getMaxDateFilter($('#MaxStartedTradingDateFilterId')),
					registeredAddressFilter: $('#RegisteredAddressFilterId').val(),
					customersFilter: $('#CustomersFilterId').val(),
					propertiesJsonFilter: $('#PropertiesJsonFilterId').val(),
					webSiteFilter: $('#WebSiteFilterId').val(),
					userNameFilter: $('#UserNameFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditSmeCompanyModalSaved', function () {
            getSmeCompanies();
        });

		$('#GetSmeCompaniesButton').click(function (e) {
            e.preventDefault();
            getSmeCompanies();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getSmeCompanies();
		  }
		});
		
		
		
    });
})();
