(function () {
    $(function () {

        var _$smeSubscriptionsTable = $('#SmeSubscriptionsTable');
        var _smeSubscriptionsService = abp.services.app.smeSubscriptions;
		var _entityTypeFullName = 'SME.Portal.Sme.Subscriptions.SmeSubscription';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.SmeSubscriptions.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.SmeSubscriptions.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.SmeSubscriptions.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/SmeSubscriptions/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/SmeSubscriptions/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditSmeSubscriptionModal'
                });
                   

		 var _viewSmeSubscriptionModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/SmeSubscriptions/ViewsmeSubscriptionModal',
            modalClass: 'ViewSmeSubscriptionModal'
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

        var dataTable = _$smeSubscriptionsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _smeSubscriptionsService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#SmeSubscriptionsTableFilter').val(),
					minStartDateFilter:  getDateFilter($('#MinStartDateFilterId')),
					maxStartDateFilter:  getMaxDateFilter($('#MaxStartDateFilterId')),
					minExpiryDateFilter:  getDateFilter($('#MinExpiryDateFilterId')),
					maxExpiryDateFilter:  getMaxDateFilter($('#MaxExpiryDateFilterId')),
					minNextBillingDateFilter:  getDateFilter($('#MinNextBillingDateFilterId')),
					maxNextBillingDateFilter:  getMaxDateFilter($('#MaxNextBillingDateFilterId')),
					statusFilter: $('#StatusFilterId').val(),
					minOwnerCompanyMapIdFilter: $('#MinOwnerCompanyMapIdFilterId').val(),
					maxOwnerCompanyMapIdFilter: $('#MaxOwnerCompanyMapIdFilterId').val()
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
                                    _viewSmeSubscriptionModal.open({ id: data.record.smeSubscription.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.smeSubscription.id });                                
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
                                    entityId: data.record.smeSubscription.id
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
                                deleteSmeSubscription(data.record.smeSubscription);
                            }
                        }]
                    }
                },
					{
						targets: 2,
						 data: "smeSubscription.startDate",
						 name: "startDate" ,
					render: function (startDate) {
						if (startDate) {
							return moment(startDate).format('L');
						}
						return "";
					}
			  
					},
					{
						targets: 3,
						 data: "smeSubscription.expiryDate",
						 name: "expiryDate" ,
					render: function (expiryDate) {
						if (expiryDate) {
							return moment(expiryDate).format('L');
						}
						return "";
					}
			  
					},
					{
						targets: 4,
						 data: "smeSubscription.nextBillingDate",
						 name: "nextBillingDate" ,
					render: function (nextBillingDate) {
						if (nextBillingDate) {
							return moment(nextBillingDate).format('L');
						}
						return "";
					}
			  
					},
					{
						targets: 5,
						 data: "smeSubscription.status",
						 name: "status"   
					},
					{
						targets: 6,
						 data: "smeSubscription.ownerCompanyMapId",
						 name: "ownerCompanyMapId"   
					}
            ]
        });

        function getSmeSubscriptions() {
            dataTable.ajax.reload();
        }

        function deleteSmeSubscription(smeSubscription) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _smeSubscriptionsService.delete({
                            id: smeSubscription.id
                        }).done(function () {
                            getSmeSubscriptions(true);
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

        $('#CreateNewSmeSubscriptionButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _smeSubscriptionsService
                .getSmeSubscriptionsToExcel({
				filter : $('#SmeSubscriptionsTableFilter').val(),
					minStartDateFilter:  getDateFilter($('#MinStartDateFilterId')),
					maxStartDateFilter:  getMaxDateFilter($('#MaxStartDateFilterId')),
					minExpiryDateFilter:  getDateFilter($('#MinExpiryDateFilterId')),
					maxExpiryDateFilter:  getMaxDateFilter($('#MaxExpiryDateFilterId')),
					minNextBillingDateFilter:  getDateFilter($('#MinNextBillingDateFilterId')),
					maxNextBillingDateFilter:  getMaxDateFilter($('#MaxNextBillingDateFilterId')),
					statusFilter: $('#StatusFilterId').val(),
					minOwnerCompanyMapIdFilter: $('#MinOwnerCompanyMapIdFilterId').val(),
					maxOwnerCompanyMapIdFilter: $('#MaxOwnerCompanyMapIdFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditSmeSubscriptionModalSaved', function () {
            getSmeSubscriptions();
        });

		$('#GetSmeSubscriptionsButton').click(function (e) {
            e.preventDefault();
            getSmeSubscriptions();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getSmeSubscriptions();
		  }
		});
		
		
		
    });
})();
