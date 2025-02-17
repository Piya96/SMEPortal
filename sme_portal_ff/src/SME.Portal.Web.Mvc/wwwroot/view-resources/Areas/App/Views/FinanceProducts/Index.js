(function () {
    $(function () {
        var lenderId = $('#FinanceProductsLenderIdFilter').val() ? $('#FinanceProductsLenderIdFilter').val() : "";
        var _$financeProductsTable = $('#FinanceProductsTable');
        var _financeProductsService = abp.services.app.financeProducts;
        var _entityTypeFullName = 'SME.Portal.Lenders.FinanceProduct';

        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.Administration.FinanceProducts.Create'),
            edit: abp.auth.hasPermission('Pages.Administration.FinanceProducts.Edit'),
            'delete': abp.auth.hasPermission('Pages.Administration.FinanceProducts.Delete')
        };

        var _createOrEditModal = new app.ModalManager({
            viewUrl: abp.appPath + 'App/FinanceProducts/CreateOrEditModal',
            scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/FinanceProducts/_CreateOrEditModal.js',
            modalClass: 'CreateOrEditFinanceProductModal'
        });
        /* MultiSelect DropDown Initialization */
        $('#FinanceForIdFilterId').select2({ placeholder: "All Finance Fors", width: '100%' });
        $('#BeeLevelFilterId').select2({ placeholder: "All BEE Levels", width: '100%' });
        $('#CompanyRegistrationTypeIdFilter').select2({ placeholder: "All Company Registration Type", width: '100%' });
        $('#DocumentIdFilter').select2({ placeholder: "All Documents", width: '100%' });
        $('#IndustrySectorIdFilterId').select2({ placeholder: "All Industry Sectors", width: '100%' });
        $('#ProvinceIdFilter').select2({ placeholder: "All Province", width: '100%' });
        $('#OwnershipFilterId').select2({ placeholder: "All Ownerships", width: '100%' });
        
        var archivecheck = false;
        var dataTable = _$financeProductsTable.DataTable({
            autoWidth: false,
            responsive: true,
            dom: "Atipl",
            serverSide: false,
            paging: true,
            processing: true,
            fixedColumns: true,
            searching: true,
            listAction: {
                ajaxFunction: _financeProductsService.searchAll,
                inputFilter: function () {

                    var Inactive = false;
                    if ($('#IsInactiveFilterId').is(":checked")) {
                        Inactive = true;
                    }

                    var isSACitizen = "";
                    if ($('#SaCitizensOnlyFilterId').is(":checked")) {
                        isSACitizen = true;
                    }

                    return {
                        lenderIdFilter: $('#LenderIdFilterId').val() ? $('#LenderIdFilterId').val() : lenderId,
                        financeForIdFilter: $('#FinanceForIdFilterId').val().length ? $('#FinanceForIdFilterId').val().join(", ") : "",
                        industrySectorIdFilter: $('#IndustrySectorIdFilterId').val().length ? $('#IndustrySectorIdFilterId').val().join(", ") : "",
                        countryIdFilter: $('#CountryIdFilterId').val(),
                        companyRegistrationTypeIdFilter: $('#CompanyRegistrationTypeIdFilter').val().length ? $('#CompanyRegistrationTypeIdFilter').val().join(", ") : "",
                        provinceTypeIdFilter: $('#ProvinceIdFilter').val().length ? $('#ProvinceIdFilter').val().join(", ") : "",
                        ownershipIdFilter: $('#OwnershipFilterId').val().length ? $('#OwnershipFilterId').val().join(", ") : "",
                        loanTypeIdFilter: $('#LoanIdFilter').val(),
                        customerTypeIdFilter: $('#CustomerIdFilter').val(),
                        documentTypeIdFilter: $('#DocumentIdFilter').val().length ? $('#DocumentIdFilter').val().join(", ") : "",
                        isDeleted: archivecheck,
                        IsEnabled: Inactive,
                        nameFilter: $('#NameFilterId').val(),
                        minAverageAnnualTurnoverFilter: $('#MinAverageAnnualTurnoverFilterId').val(),
                        maxAverageAnnualTurnoverFilter: $('#MaxAverageAnnualTurnoverFilterId').val(),
                        minLoanAmountFilter: $('#MinLoanAmountFilterId').val(),
                        maxLoanAmountFilter: $('#MaxLoanAmountFilterId').val(),
                        collateralBusinessFilter: $("input[name='CollateralBusinessFilterId']:checked").val(),
                        collateralOwnerFilter: $("input[name='CollateralOwnerFilterId']:checked").val(),
                        requiresProfitabilityFilter: $("input[name='RequiresProfitabilityFilterId']:checked").val(),
                        saCitizensOnlyFilter: isSACitizen,
                        minMonthsTradingFilter: $('#MinMonthsTradingFilterId').val(),
                        minMonthlyIncomeFilter: $('#MinMonthlyIncomeFilterId').val(),
                        beeLevelFilter: $('#BeeLevelFilterId').val().length ? $('#BeeLevelFilterId').val().join(", ") : "",
                    };
                }
            },
            columnDefs: [
                {
                    width: "50%",
                    targets: 0,
                    data: "financeProduct",
                    name: "lenderFk.name",
                    render: function (data) {
                        if (data) {
                            return (data.lenderName ? '<div class="text-left font-weight-bold">' + data.lenderName + '</div>' : '') +
                                ((data.minLoanAmount && data.maxLoanAmount) ? '<div class="small" >Loan Amount: Min: R' + data.minLoanAmount + ' - Max: R' + data.maxLoanAmount + '</div>' : '') +
                                (data.financeForSubListIds ? '<div class="small listItem-view" title="' + data.financeForSubListIds + '">Finance For: ' + data.financeForSubListIds + '</div>' : '') +
                                (data.saCitizensOnly ? '<div class="small" >SA Citizen: ' + data.saCitizensOnly + '</div>' : '') +
                                (data.companyRegistrationTypeListIds ? '<div class="small listItem-view" title="' + data.companyRegistrationTypeListIds + '">Company Reg Type: ' + data.companyRegistrationTypeListIds + '</div>' : '') +
                                (data.postalAddressProvince ? '<div class="small" >Province: ' + data.postalAddressProvince + '</div>' : '') +
                                (data.minimumMonthsTrading ? '<div class="small" >Months Trading: ' + data.minimumMonthsTrading + ' Months</div>' : '') +
                                (data.minAverageAnnualTurnover && data.minAverageAnnualTurnover ? '<div class="small" >Average Annual Turnover: Min: R' + data.minAverageAnnualTurnover + ' - Max: R' + data.minAverageAnnualTurnover + '</div>' : '') +
                                (data.industrySectorListIds ? '<div class="small listItem-view" title="' + data.industrySectorListIds + '">Industry Sector:' + data.industrySectorListIds + '</div>' : '') +
                                (data.minimumMonthlyIncome ? '<div class="small" >Monthly Income: R' + data.minimumMonthlyIncome + '</div>' : '') +
                                (data.requiresProfitability ? '<div class="small" >Profitability: ' + data.requiresProfitability + '</div>' : '') +
                                (data.requiresCollateral ? '<div class="small" >RequiresCollateral: ' + data.requiresCollateral + '</div>' : '') +
                                (data.beeLevelListIds ? '<div class="small listItem-view" title=">BEE Level : ' + data.beeLevelListIds + '</div>' : '') +
                                (data.countryListIds ? '<div class="small listItem-view" title="' + data.countryListIds + '">Country : ' + data.countryListIds + '</div>' : '') +
                                (data.financeForSubCategoryListIds ? '<div class="small listItem-view" title="' + data.financeForSubCategoryListIds + '">Finance For Subcategories : ' + data.financeForSubCategoryListIds + '</div>' : '') + GetCheckedStatus(data.lastCheckedDate);
                        }
                    }
                },
                {
                    targets: 1,
                    data: "financeProduct",
                    name: "name",
                    width: "25%",
                    render: function (data) {
                        if (data) {
                            return '<div style="text-wrap:wrap">' + data.name + '</div>';
                        }
                        return "";
                    }
                },
                {
                    targets: 2,
                    width: "25%",
                    data: "financeProduct",
                    render: function (data) {
                        let retrieveComponent = archivecheck ? '<button class="retrivedata btn btn-primary btn-sm  btn-brand unique">Retrive</button>' : '';
                        let editComponent = '<button class="editor-edit bg-transparent mx-1" style="border:none"><i class="fas fa fa-edit" style="font-size:15px;color:green;"></i></button>';
                        let deleteComponent = '<button class="editor-delete bg-transparent mx-1" style="border:none"><i class="fa fa-trash" style="font-size:15px;color:#ff4d4d;"></i></button>';
                        let dropdownComponent = '<div class="dropdown d-inline"><button class="editor-dropdown btn btn-primary dropdown-toggle mx-1" data-toggle="dropdown"><i class="fa fa-cog"></i><span class="caret"></span></button><div class="dropdown-menu" style="font-family: inherit;">' + '<a class="dropdown-item" id="fundFormItem" style="cursor: pointer;">' + app.localize("Lender Criteria Questionnaire") + '</a><a class="dropdown-item" href="#">' + app.localize("Comments") + '</a><a class="dropdown-item" href="#">' + app.localize('Archive') + '</a>';
                        let checkedOutComponent = (data.checkedOutUserName ? '<div class="editor-checkedout small" style="background-color:red;color:white;text-wrap:wrap">Checked Out By: ' + data.checkedOutUserName + '</div>' : "");
                        if (data.checkedOutSubjectId == abp.session.userId || (data.checkedOutSubjectId == null && _permissions.edit)) {
                            return '<div style="display: flex; flex-direction: column;gap:20px;"><div class="d-flex align-items-center" style="justify-content:space-evenly;">' + retrieveComponent + editComponent + deleteComponent + dropdownComponent + '</div></div>' + '</div>' + checkedOutComponent + '</div>';
                        }
                        else if (data.checkedOutSubjectId != abp.session.userId) {
                            return '<div style="display: flex; flex-direction: column;gap:20px;"><div class="d-flex align-items-center" style="justify-content:space-evenly;">' + retrieveComponent + deleteComponent + dropdownComponent + '<a class="dropdown-item" id="forceCheckOutItem" style="cursor: pointer;">' + app.localize('Force Check Out') + '</a>' + '</div></div>' + '</div>' + checkedOutComponent + '</div>';
                        }
                    },
                    className: "crudClass",
                    orderable: false,
                }
            ]
        });

        function retrieveFinanceProduct(financeProduct) {
            financeProduct.isDeleted = false;
            abp.message.confirm(
                "",
                app.localize("AreYouSureRetrieveFinanceProduct"),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _financeProductsService
                            .retrieve({
                                id: financeProduct.id,
                            })
                            .done(function () {
                                getFinanceProducts(true);
                                abp.notify.success(app.localize("SuccessfullyRetrieved"));
                            });
                    }
                }
            );
        }

        dataTable.on("click", "td.crudClass button.editor-edit", function () {
            var data = dataTable.row($(this).parents("tr")).data();
            window.open('/App/FinanceProducts/Manage/' + data.financeProduct.id + '/?step=stepGeneral', '_self');
        });

        dataTable.on("click", "td.crudClass button.editor-delete", function () {
            var data = dataTable.row($(this).parents("tr")).data();
            deleteFinanceProduct(data.financeProduct);
        });

        dataTable.on("click", "td.crudClass a#fundFormItem", function () {
            var data = dataTable.row($(this).parents("tr")).data();
            window.open('/App/FundForms/FundForms/' + data.financeProduct.id, '_self');
        });

        dataTable.on("click", "td.crudClass a#forceCheckOutItem", function () {
            var data = dataTable.row($(this).parents("tr")).data();
            window.open('/App/FinanceProducts/Manage/' + data.financeProduct.id + '/?step=stepGeneral', '_self');
        });

        dataTable.on("click", "td.crudClass button.retrivedata", function () {
            var data = dataTable.row($(this).parents("tr")).data();
            retrieveFinanceProduct(data.financeProduct);
        });

        function getFinanceProducts() {
            dataTable.ajax.reload();
        }

        function deleteFinanceProduct(financeProduct) {
            abp.message.confirm(
                app.localize('ArchiveYear'),
                app.localize('AreYouSureArchiveFinanceProduct'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _financeProductsService.delete({
                            id: financeProduct.id
                        }).done(function () {
                            getFinanceProducts(true);
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
            );
        }

        function GetCheckedStatus(dateChecked) {
            var summaryStatus = "summarygreen";

            var now = new Date();
            var dayDifference = Math.floor((now - new Date(dateChecked)) / (1000 * 60 * 60 * 24));
            dateChecked = dateChecked.split("T")[0];
            var message = `Checked recently (${dateChecked}) ${dayDifference} days since last checked.`;


            if (dayDifference >= 31 && dayDifference <= 40) {
                summaryStatus = "summarywarn";
                message = `Checking due (${dateChecked}) ${dayDifference} days since last checked.`;
            }
            else if (dayDifference >= 41 && dayDifference <= 59) {
                summaryStatus = "summarypurple";
                message = `Checking overdue (${dateChecked}) ${dayDifference} days since last checked.`;
            }
            else if (dayDifference >= 60) {
                summaryStatus = "summaryred";
                message = `Emergency checking required (${dateChecked}) ${dayDifference} days since last checked.`;
            }

            return '<div class="' + summaryStatus + ' small">' + message + '</div>';
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

        $('#CreateNewFinanceProductButton').click(function () {
            window.open('/App/FinanceProducts/Manage/?step=stepGeneral', '_self');
        });

        abp.event.on('app.createOrEditFinanceProductModalSaved', function () {
            getFinanceProducts();
        });

        $('#GetFinanceProductsButton').click(function (e) {
            e.preventDefault();
            removeFormatting($('#MinLoanAmountFilterId').val());
            removeFormatting($('#MaxLoanAmountFilterId').val());
            removeFormatting($('#MinAverageAnnualTurnoverFilterId').val());
            removeFormatting($('#MaxAverageAnnualTurnoverFilterId').val());
            $('#MinMonthlyIncomeFilterId').val($('#MinMonthlyIncomeFilterId').val() ? parseInt($('#MinMonthlyIncomeFilterId').val().replaceAll(',', '')) : null);
            archivecheck = $("#HasArchivedFilterId").prop("checked");
            if (archivecheck) {
                dataTable.on('draw', () => {
                    $('td.crudClass button.editor-edit').hide();
                    $('td.crudClass button.editor-delete').hide();
                    $('td.crudClass button.editor-dropdown').hide();
                    $('td.crudClass div.editor-checkedout').hide();
                });
            }
            getFinanceProducts();
        });

        $("#ClearFiltersButton").click(function (e) {
            e.preventDefault();
            $('#LenderIdFilterId').val("");
            $('#FinanceForIdFilterId').val([]).change();
            $('#IndustrySectorIdFilterId').val([]).change();
            $('#CountryIdFilterId').val("");
            $('#CompanyRegistrationTypeIdFilter').val([]).change();
            $('#ProvinceIdFilter').val([]).change();
            $('#LoanIdFilter').val("");
            $('#CustomerIdFilter').val("");
            $('#DocumentIdFilter').val([]).change();
            $('#NameFilterId').val("");
            $('#MinAverageAnnualTurnoverFilterId').val("");
            $('#MaxAverageAnnualTurnoverFilterId').val("");
            $('#MinLoanAmountFilterId').val("");
            $('#MaxLoanAmountFilterId').val("");
            $('#IsInactiveFilterId').prop("checked", false);
            $('#IsInactiveFilterId').val("false");
            $('#HasArchivedFilterId').prop("checked", false);
            $('#HasArchivedFilterId').val("false");
            $('#SaCitizensOnlyFilterId').prop("checked", false);
            $('#SaCitizensOnlyFilterId').val("");
            $('#MinMonthsTradingFilterId').val("");
            $('#MinMonthlyIncomeFilterId').val("");
            $('#BeeLevelFilterId').val([]).change();
            $('#AssignedToFilterId').val("");
            $('#CheckedOutToFilterId').val("");
            $('#OwnershipFilterId').val([]).change();
            $(".alphabet span.active").removeClass("active");
            var profitabilityButtons = document.querySelectorAll('input[name="RequiresProfitabilityFilterId"]');
            var collateralBusinessButtons = document.querySelectorAll('input[name="CollateralBusinessFilterId"]');
            var collateralOwnerButtons = document.querySelectorAll('input[name="CollateralOwnerFilterId"]');
            profitabilityButtons.forEach(function (button) { button.checked = false; });
            collateralBusinessButtons.forEach(function (button) { button.checked = false; });
            collateralOwnerButtons.forEach(function (button) { button.checked = false; });
            dataTable.alphabetSearch('');
            archivecheck = false;
            Inactive = false;
            if (!archivecheck) {
                dataTable.on('draw', () => {
                    $('td.crudClass button.editor-edit').show();
                    $('td.crudClass button.editor-delete').show();
                    $('td.crudClass button.editor-dropdown').show();
                    $('td.crudClass div.editor-checkedout').show();
                });
            }
            getFinanceProducts();
        });

        $(document).keypress(function (e) {
            if (e.which === 13) {
                getFinanceProducts();
            }
        });

        $("#MinMonthsTradingFilterId").on('input', function () {
            if ($(this).val() < 0) {
                $(this).val(0);
            }
        });

        $('#MinLoanAmountFilterId').keyup(function () {
            this.value = formatCurrency(this.value);
        });

        $('#MaxLoanAmountFilterId').keyup(function () {
            this.value = formatCurrency(this.value);
        });

        $('#MinAverageAnnualTurnoverFilterId').keyup(function () {
            this.value = formatCurrency(this.value);
        });

        $('#MaxAverageAnnualTurnoverFilterId').keyup(function () {
            this.value = formatCurrency(this.value);
        });

        $('#MinMonthlyIncomeFilterId').keyup(function () {
            this.value = formatCurrency(this.value);
        });

        function formatCurrency(strAmt) {

            if (strAmt) {
                var value = strAmt.toString();
                var justnumbers = value.replace(/[^0-9\.]+/g, '');
                var twodecimals = justnumbers.replace(/^([1-9]\d*\.?\d{0,2})(\d*)/g, "$1");
                var result = twodecimals.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                return result;
            } else {
                return "";
            }
        }

        function removeFormatting(val) {
            val = val.replaceAll(',', '');
            return val;
        }

    });
})();
