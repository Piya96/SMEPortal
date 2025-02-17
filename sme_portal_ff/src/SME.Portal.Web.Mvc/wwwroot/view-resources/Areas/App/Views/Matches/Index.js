(function () {
    $(function () {

        var _$matchesTable = $('#MatchesTable');
        var _matchesService = abp.services.app.matches;
		var _entityTypeFullName = 'SME.Portal.Lenders.Match';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.Matches.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.Matches.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.Matches.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/Matches/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Matches/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditMatchModal'
                });
                   

		 var _viewMatchModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Matches/ViewmatchModal',
            modalClass: 'ViewMatchModal'
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

        var dataTable = _$matchesTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _matchesService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#MatchesTableFilter').val(),
					minApplicationIdFilter: $('#MinApplicationIdFilterId').val(),
					maxApplicationIdFilter: $('#MaxApplicationIdFilterId').val(),
					leadDisplayNameFilter: $('#LeadDisplayNameFilterId').val(),
					matchSuccessfulFilter: $('#MatchSuccessfulFilterId').val(),
					financeProductIdsFilter: $('#FinanceProductIdsFilterId').val(),
					exclusionIdsFilter: $('#ExclusionIdsFilterId').val()
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
                                    _viewMatchModal.open({ id: data.record.match.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.match.id });                                
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
                                    entityId: data.record.match.id
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
                                deleteMatch(data.record.match);
                            }
                        }]
                    }
                },
					{
						targets: 2,
						 data: "match.notes",
						 name: "notes"   
					},
					{
						targets: 3,
						 data: "match.applicationId",
						 name: "applicationId"   
					},
					{
						targets: 4,
						 data: "match.leadDisplayName",
						 name: "leadDisplayName"   
					},
					{
						targets: 5,
						 data: "match.matchSuccessful",
						 name: "matchSuccessful"  ,
						render: function (matchSuccessful) {
							if (matchSuccessful) {
								return '<div class="text-center"><i class="fa fa-check text-success" title="True"></i></div>';
							}
							return '<div class="text-center"><i class="fa fa-times-circle" title="False"></i></div>';
					}
			 
					},
					{
						targets: 6,
						 data: "match.financeProductIds",
						 name: "financeProductIds"   
					},
					{
						targets: 7,
						 data: "match.exclusionIds",
						 name: "exclusionIds"   
					}
            ]
        });

        function getMatches() {
            dataTable.ajax.reload();
        }

        function deleteMatch(match) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _matchesService.delete({
                            id: match.id
                        }).done(function () {
                            getMatches(true);
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

        $('#CreateNewMatchButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _matchesService
                .getMatchesToExcel({
				filter : $('#MatchesTableFilter').val(),
					minApplicationIdFilter: $('#MinApplicationIdFilterId').val(),
					maxApplicationIdFilter: $('#MaxApplicationIdFilterId').val(),
					leadDisplayNameFilter: $('#LeadDisplayNameFilterId').val(),
					matchSuccessfulFilter: $('#MatchSuccessfulFilterId').val(),
					financeProductIdsFilter: $('#FinanceProductIdsFilterId').val(),
					exclusionIdsFilter: $('#ExclusionIdsFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditMatchModalSaved', function () {
            getMatches();
        });

		$('#GetMatchesButton').click(function (e) {
            e.preventDefault();
            getMatches();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getMatches();
		  }
		});
		
		
		
    });
})();
