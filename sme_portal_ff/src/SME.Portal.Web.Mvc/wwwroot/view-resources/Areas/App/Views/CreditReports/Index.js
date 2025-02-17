(function () {
    $(function () {

        var _$creditReportsTable = $('#CreditReportsTable');
        var _creditReportsService = abp.services.app.creditReports;
		var _entityTypeFullName = 'SME.Portal.ConsumerCredit.CreditReport';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.CreditReports.Create'),
            edit: abp.auth.hasPermission('Pages.CreditReports.Edit'),
            'delete': abp.auth.hasPermission('Pages.CreditReports.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/CreditReports/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/CreditReports/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditCreditReportModal'
                });
                   

		 var _viewCreditReportModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/CreditReports/ViewcreditReportModal',
            modalClass: 'ViewCreditReportModal'
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

        var dataTable = _$creditReportsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _creditReportsService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#CreditReportsTableFilter').val(),
					minEnquiryDateFilter:  getDateFilter($('#MinEnquiryDateFilterId')),
					maxEnquiryDateFilter:  getMaxDateFilter($('#MaxEnquiryDateFilterId')),
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
                                    _viewCreditReportModal.open({ id: data.record.creditReport.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.creditReport.id });                                
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
                                    entityId: data.record.creditReport.id
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
                                deleteCreditReport(data.record.creditReport);
                            }
                        }]
                    }
                },
					{
						targets: 2,
						 data: "creditReport.creditReportJson",
                        name: "creditReportJson",
                        render: function (data) {
                            //if (data) {
                            //    return data.substring(0, 8);
                            //}

                            return "Credit Report Json Data";
                        }
					},
					{
						targets: 3,
						 data: "creditReport.enquiryDate",
						 name: "enquiryDate" ,
					render: function (enquiryDate) {
						if (enquiryDate) {
							return moment(enquiryDate).format('L');
						}
						return "";
					}
			  
					},
					{
						targets: 4,
						 data: "userName" ,
						 name: "userFk.name" 
					}
            ]
        });

        function getCreditReports() {
            dataTable.ajax.reload();
        }

        function deleteCreditReport(creditReport) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _creditReportsService.delete({
                            id: creditReport.id
                        }).done(function () {
                            getCreditReports(true);
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

        $('#CreateNewCreditReportButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _creditReportsService
                .getCreditReportsToExcel({
				filter : $('#CreditReportsTableFilter').val(),
					minEnquiryDateFilter:  getDateFilter($('#MinEnquiryDateFilterId')),
					maxEnquiryDateFilter:  getMaxDateFilter($('#MaxEnquiryDateFilterId')),
					userNameFilter: $('#UserNameFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditCreditReportModalSaved', function () {
            getCreditReports();
        });

		$('#GetCreditReportsButton').click(function (e) {
            e.preventDefault();
            getCreditReports();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getCreditReports();
		  }
		});
		
		
		
    });
})();
