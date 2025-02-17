(function () {
    $(function () {

        var _$creditScoresTable = $('#CreditScoresTable');
        var _creditScoresService = abp.services.app.creditScores;
		var _entityTypeFullName = 'SME.Portal.ConsumerCredit.CreditScore';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.CreditScores.Create'),
            edit: abp.auth.hasPermission('Pages.CreditScores.Edit'),
            'delete': abp.auth.hasPermission('Pages.CreditScores.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/CreditScores/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/CreditScores/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditCreditScoreModal'
                });
                   

		 var _viewCreditScoreModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/CreditScores/ViewcreditScoreModal',
            modalClass: 'ViewCreditScoreModal'
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

        var dataTable = _$creditScoresTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _creditScoresService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#CreditScoresTableFilter').val(),
					minScoreFilter: $('#MinScoreFilterId').val(),
					maxScoreFilter: $('#MaxScoreFilterId').val(),
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
                                    _viewCreditScoreModal.open({ id: data.record.creditScore.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.creditScore.id });                                
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
                                    entityId: data.record.creditScore.id
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
                                deleteCreditScore(data.record.creditScore);
                            }
                        }]
                    }
                },
					{
						targets: 2,
						 data: "creditScore.score",
						 name: "score"   
					},
					{
						targets: 3,
						 data: "creditScore.enquiryDate",
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

        function getCreditScores() {
            dataTable.ajax.reload();
        }

        function deleteCreditScore(creditScore) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _creditScoresService.delete({
                            id: creditScore.id
                        }).done(function () {
                            getCreditScores(true);
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

        $('#CreateNewCreditScoreButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _creditScoresService
                .getCreditScoresToExcel({
				filter : $('#CreditScoresTableFilter').val(),
					minScoreFilter: $('#MinScoreFilterId').val(),
					maxScoreFilter: $('#MaxScoreFilterId').val(),
					minEnquiryDateFilter:  getDateFilter($('#MinEnquiryDateFilterId')),
					maxEnquiryDateFilter:  getMaxDateFilter($('#MaxEnquiryDateFilterId')),
					userNameFilter: $('#UserNameFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditCreditScoreModalSaved', function () {
            getCreditScores();
        });

		$('#GetCreditScoresButton').click(function (e) {
            e.preventDefault();
            getCreditScores();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getCreditScores();
		  }
		});
		
		
		
    });
})();
