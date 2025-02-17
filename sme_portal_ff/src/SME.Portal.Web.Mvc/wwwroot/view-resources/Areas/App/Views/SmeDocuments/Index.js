(function () {

    $(function () {

        var _$documentsTable = $('#DocumentsTable');
        var _documentsService = abp.services.app.documents;
        var _documentsServiceExt = abp.services.app.documentsAppServiceExt;
        var _entityTypeFullName = 'SME.Portal.Documents.Document';

        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.Documents.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.Documents.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.Documents.Delete')
        };

        var _createOrEditModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/Documents/CreateOrEditModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Documents/_CreateOrEditModal.js',
            modalClass: 'CreateOrEditDocumentModal'
        });


        var _viewDocumentModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/SmeDocuments/ViewDocumentModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/SmeDocuments/_ViewDocumentModal.js',
            modalClass: 'ViewDocumentModal'
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

        var dataTable = _$documentsTable.DataTable({
            paging: true,
            serverSide: true,
            processing: true,
            listAction: {
                ajaxFunction: _documentsServiceExt.getAllByUser,
                inputFilter: function () {
                    return {
                        filter: $('#DocumentsTableFilter').val(),
                        typeFilter: $('#TypeFilterId').val(),
                        fileNameFilter: $('#FileNameFilterId').val(),
                        fileTypeFilter: $('#FileTypeFilterId').val(),
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
                                    _viewDocumentModal.open({ id: data.record.document.id });
                                }
                            },
                            {
                                text: app.localize('Edit'),
                                iconStyle: 'far fa-edit mr-2',
                                visible: function () {
                                    return _permissions.edit;
                                },
                                action: function (data) {
                                    _createOrEditModal.open({ id: data.record.document.id });
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
                                        entityId: data.record.document.id
                                    });
                                }
                            },
                            {
                                text: app.localize('Delete'),
                                iconStyle: 'far fa-trash-alt mr-2',
                                visible: function () {
                                    return true;//_permissions.delete;
                                },
                                action: function (data) {
                                    deleteDocument(data.record.document);
                                }
                            }]
                    }
                },
                //{
                //    targets: 2,
                //    data: "document.type",
                //    name: "type"
                //},
                {
                    targets: 2,
                    data: "smeCompanyName",
                    name: "smeCompanyFk.name"
                },
                {
                    targets: 3,
                    data: "document.fileName",
                    name: "fileName"
                },
                {
                    targets: 4,
                    data: "document.type",
                    name: "type"
                }
                
            ]
        });

        function getDocuments() {
            dataTable.ajax.reload();
        }

        function deleteDocument(document) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _documentsService.delete({
                            id: document.id
                        }).done(function () {
                            getDocuments(true);
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

        $('#CreateNewDocumentButton').click(function () {
            _createOrEditModal.open();
        });

        $('#ExportToExcelButton').click(function () {
            _documentsService
                .getDocumentsToExcel({
                    filter: $('#DocumentsTableFilter').val(),
                    typeFilter: $('#TypeFilterId').val(),
                    fileNameFilter: $('#FileNameFilterId').val(),
                    fileTypeFilter: $('#FileTypeFilterId').val(),
                    smeCompanyNameFilter: $('#SmeCompanyNameFilterId').val()
                })
                .done(function (result) {
                    app.downloadTempFile(result);
                });
        });

        abp.event.on('app.createOrEditDocumentModalSaved', function () {
            getDocuments();
        });

        $('#GetDocumentsButton').click(function (e) {
            e.preventDefault();
            getDocuments();
        });

        $(document).keypress(function (e) {
            if (e.which === 13) {
                getDocuments();
            }
        });
    });
})();
