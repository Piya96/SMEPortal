(function () {
    $(function () {

        var _$applicationsTable = $('#ApplicationsTable');
        var _applicationsService = abp.services.app.applications;
		var _entityTypeFullName = 'SME.Portal.SME.Application';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.Applications.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.Applications.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.Applications.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/Applications/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Applications/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditApplicationModal'
                });
                   

		 var _viewApplicationModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Applications/ViewapplicationModal',
            modalClass: 'ViewApplicationModal'
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

        var dataTable = _$applicationsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _applicationsService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#ApplicationsTableFilter').val(),
					minLockedFilter:  getDateFilter($('#MinLockedFilterId')),
					maxLockedFilter:  getMaxDateFilter($('#MaxLockedFilterId')),
					statusFilter: $('#StatusFilterId').val(),
					userNameFilter: $('#UserNameFilterId').val(),
					smeCompanyNameFilter: $('#SmeCompanyNameFilterId').val()
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
                                    _viewApplicationModal.open({ id: data.record.application.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.application.id });                                
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
                                    entityId: data.record.application.id
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
                                deleteApplication(data.record.application);
                            }
                        }]
                    }
                },
                {
                    targets: 2,
                    data: "smeCompanyName",
                    name: "smeCompanyFk.name"
                },
                {
                    targets: 3,
                    data: "userName",
                    name: "userFk.name"
                },
				{
					targets: 4,
						data: "application.status",
						name: "status"   
                },
                {
                    targets: 5,
                    data: "application.locked",
                    name: "locked",
                    render: function (locked) {
                        if (locked) {
                            return moment(locked).format('L');
                        }
                        return "";
                    }
                }
            ]
        });

        function getApplications() {
            dataTable.ajax.reload();
        }

        function deleteApplication(application) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _applicationsService.delete({
                            id: application.id
                        }).done(function () {
                            getApplications(true);
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

        $('#CreateNewApplicationButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _applicationsService
                .getApplicationsToExcel({
				filter : $('#ApplicationsTableFilter').val(),
					minLockedFilter:  getDateFilter($('#MinLockedFilterId')),
					maxLockedFilter:  getMaxDateFilter($('#MaxLockedFilterId')),
					statusFilter: $('#StatusFilterId').val(),
					userNameFilter: $('#UserNameFilterId').val(),
					smeCompanyNameFilter: $('#SmeCompanyNameFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditApplicationModalSaved', function () {
            getApplications();
        });

		$('#GetApplicationsButton').click(function (e) {
            e.preventDefault();
            getApplications();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getApplications();
		  }
		});
		
		
		
    });
})();
