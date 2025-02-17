(function () {
    let x = 0;
    $(function () {

        var _$listItemsTable = $('#ListItemsTable');
        var _listItemsService = abp.services.app.listItems;
		var _entityTypeFullName = 'SME.Portal.List.ListItem';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.ListItems.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.ListItems.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.ListItems.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/ListItems/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/ListItems/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditListItemModal'
                });
                   

		 var _viewListItemModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/ListItems/ViewlistItemModal',
            modalClass: 'ViewListItemModal'
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

        var dataTable = _$listItemsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _listItemsService.getAllEx,
                inputFilter: function () {
                    return {
                        filter: $('#ListItemsTableFilter').val(),
                        listIdFilter: $('#ListIdFilterId').val(),
                        parentListIdFilter: $('#ParentListIdFilterId').val(),
					    nameFilter: $('#NameFilterId').val(),
                        detailsFilter: $('#DetailsFilterId').val(),
					    minPriorityFilter: $('#MinPriorityFilterId').val(),
					    maxPriorityFilter: $('#MaxPriorityFilterId').val(),
					    metaOneFilter: $('#MetaOneFilterId').val(),
					    metaTwoFilter: $('#MetaTwoFilterId').val(),
                        metaThreeFilter: $('#MetaThreeFilterId').val(),
					    slugFilter: $('#SlugFilterId').val()
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
                                    _viewListItemModal.open({ id: data.record.listItem.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.listItem.id });                                
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
                                    entityId: data.record.listItem.id
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
                                deleteListItem(data.record.listItem);
                            }
                        }]
                    }
                },
                    {
                        targets: 2,
                        data: "listItem.listId",
                        name: "listId"
                    },
                    {
                        targets: 3,
                        data: "listItem.parentListId",
                        name: "parentListId"
                    },
					{
						targets: 4,
						 data: "listItem.name",
						 name: "name"   
					},
                    {
                        targets: 5,
                        data: "listItem.details",
                        name: "details"
                    },
					{
						targets: 6,
						 data: "listItem.priority",
						 name: "priority"   
					},
					{
						targets: 7,
						 data: "listItem.metaOne",
						 name: "metaOne"   
					},
					{
						targets: 8,
						 data: "listItem.metaTwo",
						 name: "metaTwo"   
					},
					{
						targets: 9,
						 data: "listItem.metaThree",
						 name: "metaThree"   
                    },
                    {
                        targets: 10,
                        data: "listItem.slug",
                        name: "slug"
                    }
					
            ]
        });

        function getListItems() {
            dataTable.ajax.reload();
        }

        function deleteListItem(listItem) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _listItemsService.delete({
                            id: listItem.id
                        }).done(function () {
                            getListItems(true);
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

        $('#CreateNewListItemButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _listItemsService
                .getListItemsToExcel({
				filter : $('#ListItemsTableFilter').val(),
					nameFilter: $('#NameFilterId').val(),
					parentListIdFilter: $('#ParentListIdFilterId').val(),
					minPriorityFilter: $('#MinPriorityFilterId').val(),
					maxPriorityFilter: $('#MaxPriorityFilterId').val(),
					metaOneFilter: $('#MetaOneFilterId').val(),
					metaTwoFilter: $('#MetaTwoFilterId').val(),
					listIdFilter: $('#ListIdFilterId').val(),
					slugFilter: $('#SlugFilterId').val(),
					metaThreeFilter: $('#MetaThreeFilterId').val(),
					detailsFilter: $('#DetailsFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditListItemModalSaved', function () {
            getListItems();
        });

		$('#GetListItemsButton').click(function (e) {
            e.preventDefault();
            getListItems();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getListItems();
		  }
		});
		
		
		
    });
})();
