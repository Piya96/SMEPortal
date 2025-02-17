(function () {
  $(function () {
    var _$lendersTable = $("#LendersTable");
    var _lendersService = abp.services.app.lenders;
    var _entityTypeFullName = "SME.Portal.Lenders.Lender";

    $(".date-picker").datetimepicker({
      locale: abp.localization.currentLanguage.name,
      format: "L",
    });

    var _permissions = {
      create: abp.auth.hasPermission("Pages.Administration.Lenders.Create"),
      edit: abp.auth.hasPermission("Pages.Administration.Lenders.Edit"),
      delete: abp.auth.hasPermission("Pages.Administration.Lenders.Delete"),
    };

    var _commentsModal = new app.ModalManager({
      viewUrl: abp.appPath + "App/Lenders/CommentsLenderModal",
      scriptUrl:
        abp.appPath +
        "view-resources/Areas/App/Views/Lenders/_CommentsModal.js",
      modalClass: "CommentsLenderModal",
    });

    var _viewLenderModal = new app.ModalManager({
      viewUrl: abp.appPath + "App/Lenders/ViewlenderModal",
      modalClass: "ViewLenderModal",
    });

    var _entityTypeHistoryModal = app.modals.EntityTypeHistoryModal.create();
    function entityHistoryIsEnabled() {
      return (
        abp.auth.hasPermission("Pages.Administration.AuditLogs") &&
        abp.custom.EntityHistory &&
        abp.custom.EntityHistory.IsEnabled &&
        _.filter(
          abp.custom.EntityHistory.EnabledEntities,
          (entityType) => entityType === _entityTypeFullName
        ).length === 1
      );
    }

    var getDateFilter = function (element) {
      if (element.data("DateTimePicker").date() == null) {
        return null;
      }
      return element
        .data("DateTimePicker")
        .date()
        .format("YYYY-MM-DDT00:00:00Z");
    };

    var getMaxDateFilter = function (element) {
      if (element.data("DateTimePicker").date() == null) {
        return null;
      }
      return element
        .data("DateTimePicker")
        .date()
        .format("YYYY-MM-DDT23:59:59Z");
    };
    var archivecheck = false;

    var dataTable = _$lendersTable.DataTable({
      autoWidth: false,
      dom: "Atipl",
      serverSide: false,
      paging: true,
      processing: true,
      fixedcolumns: true,
      searching: true,
      listAction: {
        ajaxFunction: _lendersService.getAll,
        inputFilter: function () {
          return {
            filter: $("#LendersTableFilter").val(),
            nameFilter: $("#NameFilterId").val(),
            lenderTypesFilter: $("#LenderTypesFilterId").val(),
            hasContractFilter: $("#HasContractFilterId").val(),
            headOfficeProvinceFilter: $("#HeadOfficeProvinceFilterId").val(),
            hasArchivedFilter: $("#HasArchivedFilterId").val(),
          };
        },
      },
      columnDefs: [
        {
          className: "test",
          targets: 0,
          width: "30%",
          data: null,
          name: "name",
          render: function (data) {
              return `<a href="/App/Lenders/CreateOrEditModal/?id=${data.lender.id}">${data.lender.name}</a>`;
          }
        },
        {
          targets: 1,
          width: "20%",
          data: "lender.lenderType",
          name: "lenderType",
        },
        {
          targets: 2,
          width: "10%",
          data: null,
          name: "financeProductCount",
          render: function (data) {
                return `<a href="/App/FinanceProducts/?id=${data.lender.id}">${data.financeProductCount}</a>`;
          }
        },
        {
          targets: 3,
          width: "20%",
          data: "lender.headOfficeProvince",
          name: "headOfficeProvince",
        },
        {
        targets: 4,
        width: "25%",
        data: "financeProduct",
        render: function (data) {
            let retrieveComponent = archivecheck ? '<button class="retrivedata btn btn-primary btn-sm  btn-brand unique">Retrive</button>' : '';
            let editComponent = '<button class="editor-edit bg-transparent mx-1" style="border:none"><i class="fas fa fa-edit" style="font-size:15px;color:green;"></i></button>';
            let deleteComponent = '<button class="editor-delete bg-transparent mx-1" style="border:none"><i class="fa fa-trash" style="font-size:15px;color:#ff4d4d;"></i></button>';
            let dropdownComponent = '<div class="dropdown d-inline"><button class="editor-dropdown btn btn-primary dropdown-toggle mx-1" data-toggle="dropdown"><i class="fa fa-cog"></i><span class="caret"></span></button><div class="dropdown-menu" style="font-family: inherit;">' + '<a class="dropdown-item" id="lenderCommentItem" href="#">' + app.localize("Comments") + '</a>';
            return '<div style="display: flex; flex-direction: column;gap:20px;"><div class="d-flex align-items-center" style="justify-content:space-evenly;">' + retrieveComponent + editComponent + deleteComponent + dropdownComponent + '</div></div>' + '</div>' + '</div>';
        },
        className: "crudClass",
        orderable: false,
        }
      ]
    });

      dataTable.on("click", "td.crudClass button.editor-edit", function () {
          var data = dataTable.row($(this).parents("tr")).data();
          window.open('/App/Lenders/CreateOrEditModal/?id=' + data.lender.id, '_self');
      });

      dataTable.on("click", "td.crudClass button.editor-delete", function () {
          var data = dataTable.row($(this).parents("tr")).data();
          deleteLender(data.lender);
      });

      dataTable.on("click", "td.crudClass a#lenderCommentItem", function () {
          var data = dataTable.row($(this).parents("tr")).data();
          _commentsModal.open({ id: data.lender.id });
      });

      dataTable.on("click", "td.crudClass button.retrivedata", function () {
          var data = dataTable.row($(this).parents("tr")).data();
          retrieveLender(data.lender);
      });

    function getLenders() {
      dataTable.ajax.reload();
    }

    function deleteLender(lender) {
      abp.message.confirm(
        app.localize("ArchiveYear"),
        app.localize("AreYouSureArchive"),
        function (isConfirmed) {
          if (isConfirmed) {
            _lendersService
              .delete({
                id: lender.id,
              })
              .done(function () {
                getLenders(true);
                abp.notify.success(app.localize("SuccessfullyDeleted"));
              });
          }
        }
      );
    }

    function retrieveLender(lender) {
      lender.isDeleted = false;
      abp.message.confirm(
        "",
        app.localize("AreYouSureRetrieve"),
        function (isConfirmed) {
          if (isConfirmed) {
            _lendersService
              .retrieve({
                id: lender.id,
              })
              .done(function () {
                getLenders(true);
                abp.notify.success(app.localize("SuccessfullyRetrieved"));
              });
          }
        }
      );
    }
    $("#ShowAdvancedFiltersSpan").click(function () {
      $("#ShowAdvancedFiltersSpan").hide();
      $("#HideAdvancedFiltersSpan").show();
      $("#AdvacedAuditFiltersArea").slideDown();
    });

    $("#HideAdvancedFiltersSpan").click(function () {
      $("#HideAdvancedFiltersSpan").hide();
      $("#ShowAdvancedFiltersSpan").show();
      $("#AdvacedAuditFiltersArea").slideUp();
    });

    $("#CreateNewLenderButton").click(function () {
        window.open('/App/Lenders/CreateOrEditModal', '_self');
    });

    abp.event.on("app.createOrEditLenderModalSaved", function () {
      getLenders();
    });

    $("#GetLendersButton").click(function (e) {
      e.preventDefault();
      getLenders();
    });

    $("#SearchLendersButton").click(function (e) {
      e.preventDefault();
      archivecheck = $("#HasArchivedFilterId").prop("checked");
        if (archivecheck) {
            dataTable.on('draw', () => {
                $('td.crudClass button.editor-edit').hide();
                $('td.crudClass button.editor-delete').hide();
                $('td.crudClass button.editor-dropdown').hide();
                $('td.crudClass div.editor-checkedout').hide();
            });
        }
      getLenders();
    });
    $("#FilterLendersButton").click(function (e) {
      e.preventDefault();

      $("#LendersTableFilter").val("");
      $("#NameFilterId").val("");
      $("#LenderTypesFilterId").val("-1");
      $("#HasContractFilterId").val("0");
      $("#HasContractFilterId").prop("checked", false);
      $("#HeadOfficeProvinceFilterId").val("-1");
      $("#HasArchivedFilterId").val("0");
      $("#HasArchivedFilterId").prop("checked", false);
      $(".alphabet span.active").removeClass("active");
      dataTable.alphabetSearch('');
      archivecheck = false;
      if (!archivecheck) {
        dataTable.on('draw', () => {
            $('td.crudClass button.editor-edit').show();
            $('td.crudClass button.editor-delete').show();
            $('td.crudClass button.editor-dropdown').show();
            $('td.crudClass div.editor-checkedout').show();
        });
      }
      getLenders();
    });

    $(document).keypress(function (e) {
      if (e.which === 13) {
        getLenders();
      }
    });
  });
})();
