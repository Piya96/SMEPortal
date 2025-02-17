(function () {
    $(function () {

        var _$ownersTable = $('#OwnersTable');
        var _ownersService = abp.services.app.owners;
		var _entityTypeFullName = 'SME.Portal.Company.Owner';
        
        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.Owners.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.Owners.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.Owners.Delete')
        };

         var _createOrEditModal = new app.ModalManager({
                    viewUrl: abp.appPath + 'App/Owners/CreateOrEditModal',
                    scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Owners/_CreateOrEditModal.js',
                    modalClass: 'CreateOrEditOwnerModal'
                });
                   

		 var _viewOwnerModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Owners/ViewownerModal',
            modalClass: 'ViewOwnerModal'
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

        var dataTable = _$ownersTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _ownersService.getAll,
                inputFilter: function () {
                    return {
					filter: $('#OwnersTableFilter').val(),
					nameFilter: $('#NameFilterId').val(),
					surnameFilter: $('#SurnameFilterId').val(),
					emailAddressFilter: $('#EmailAddressFilterId').val(),
					phoneNumberFilter: $('#PhoneNumberFilterId').val(),
					isPhoneNumberConfirmedFilter: $('#IsPhoneNumberConfirmedFilterId').val(),
					identityOrPassportFilter: $('#IdentityOrPassportFilterId').val(),
					isIdentityOrPassportConfirmedFilter: $('#IsIdentityOrPassportConfirmedFilterId').val(),
					raceFilter: $('#RaceFilterId').val(),
					verificationRecordJsonFilter: $('#VerificationRecordJsonFilterId').val(),
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
                                    _viewOwnerModal.open({ id: data.record.owner.id });
                                }
                        },
						{
                            text: app.localize('Edit'),
                            iconStyle: 'far fa-edit mr-2',
                            visible: function () {
                                return _permissions.edit;
                            },
                            action: function (data) {
                            _createOrEditModal.open({ id: data.record.owner.id });                                
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
                                    entityId: data.record.owner.id
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
                                deleteOwner(data.record.owner);
                            }
                        }]
                    }
                },
					{
						targets: 2,
						 data: "owner.name",
						 name: "name"   
					},
					{
						targets: 3,
						 data: "owner.surname",
						 name: "surname"   
					},
					{
						targets: 4,
						 data: "owner.emailAddress",
						 name: "emailAddress"   
					},
					{
						targets: 5,
						 data: "owner.phoneNumber",
						 name: "phoneNumber"   
					},
					{
						targets: 6,
						 data: "owner.isPhoneNumberConfirmed",
						 name: "isPhoneNumberConfirmed"  ,
						render: function (isPhoneNumberConfirmed) {
							if (isPhoneNumberConfirmed) {
								return '<div class="text-center"><i class="fa fa-check text-success" title="True"></i></div>';
							}
							return '<div class="text-center"><i class="fa fa-times-circle" title="False"></i></div>';
					}
			 
					},
					{
						targets: 7,
						 data: "owner.identityOrPassport",
						 name: "identityOrPassport"   
					},
					{
						targets: 8,
						 data: "owner.isIdentityOrPassportConfirmed",
						 name: "isIdentityOrPassportConfirmed"  ,
						render: function (isIdentityOrPassportConfirmed) {
							if (isIdentityOrPassportConfirmed) {
								return '<div class="text-center"><i class="fa fa-check text-success" title="True"></i></div>';
							}
							return '<div class="text-center"><i class="fa fa-times-circle" title="False"></i></div>';
					}
			 
					},
					{
						targets: 9,
						 data: "owner.race",
						 name: "race"   
					},
					{
						targets: 10,
						 data: "owner.verificationRecordJson",
						 name: "verificationRecordJson"   
					},
					{
						targets: 11,
						 data: "userName" ,
						 name: "userFk.name" 
					}
            ]
        });

        function getOwners() {
            dataTable.ajax.reload();
        }

        function deleteOwner(owner) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _ownersService.delete({
                            id: owner.id
                        }).done(function () {
                            getOwners(true);
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

        $('#CreateNewOwnerButton').click(function () {
            _createOrEditModal.open();
        });        

		$('#ExportToExcelButton').click(function () {
            _ownersService
                .getOwnersToExcel({
				filter : $('#OwnersTableFilter').val(),
					nameFilter: $('#NameFilterId').val(),
					surnameFilter: $('#SurnameFilterId').val(),
					emailAddressFilter: $('#EmailAddressFilterId').val(),
					phoneNumberFilter: $('#PhoneNumberFilterId').val(),
					isPhoneNumberConfirmedFilter: $('#IsPhoneNumberConfirmedFilterId').val(),
					identityOrPassportFilter: $('#IdentityOrPassportFilterId').val(),
					isIdentityOrPassportConfirmedFilter: $('#IsIdentityOrPassportConfirmedFilterId').val(),
					raceFilter: $('#RaceFilterId').val(),
					verificationRecordJsonFilter: $('#VerificationRecordJsonFilterId').val(),
					userNameFilter: $('#UserNameFilterId').val()
				})
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditOwnerModalSaved', function () {
            getOwners();
        });

		$('#GetOwnersButton').click(function (e) {
            e.preventDefault();
            getOwners();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getOwners();
		  }
		});
		
		
		
    });
})();
