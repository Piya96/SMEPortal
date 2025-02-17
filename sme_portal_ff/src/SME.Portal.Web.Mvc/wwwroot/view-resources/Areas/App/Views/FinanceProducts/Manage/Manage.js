var steps = [
    {
        step: 'stepGeneral',
        nextStep: 'stepLoanAmount'
    },
    {
        step: 'stepLoanAmount',
        nextStep: 'stepFinanceFor'
    },
    {
        step: 'stepFinanceFor',
        nextStep: 'stepSACitizen'
    },
    {
        step: 'stepSACitizen',
        nextStep: 'stepCompanyRegType'
    },
    {
        step: 'stepCompanyRegType',
        nextStep: 'stepProvince'
    },
    {
        step: 'stepProvince',
        nextStep: 'stepMonthsTrading'
    },
    {
        step: 'stepMonthsTrading',
        nextStep: 'stepAverageAnnualTurnover'
    },
    {
        step: 'stepAverageAnnualTurnover',
        nextStep: 'stepIndustrySectors'
    },
    {
        step: 'stepIndustrySectors',
        nextStep: 'stepMonthlyIncome'
    },
    {
        step: 'stepMonthlyIncome',
        nextStep: 'stepProfitability'
    },
    {
        step: 'stepProfitability',
        nextStep: 'stepCollateral'
    },
    {
        step: 'stepCollateral',
        nextStep: 'stepOwnership'
    },
    {
        step: 'stepOwnership',
        nextStep: 'stepBEELevel'
    },
    {
        step: 'stepBEELevel',
        nextStep: 'stepCountry'
    },
    {
        step: 'stepCountry',
        nextStep: 'stepFinanceForSubCategories'
    },
    {
        step: 'stepFinanceForSubCategories',
        nextStep: 'stepMatches'
    },
    {
        step: 'stepMatches',
        nextStep: 'stepCustomerTypes'
    },
    {
        step: 'stepCustomerTypes',
        nextStep: 'stepDocumentType'
    },
    {
        step: 'stepDocumentType',
        nextStep: 'stepLoanIndex'
    },
    {
        step: 'stepLoanIndex',
        nextStep: 'stepLoanType'
    },
    {
        step: 'stepLoanType',
        nextStep: 'stepSummaryPage'
    },
    {
        step: 'stepSummaryPage',
        nextStep: 'stepComment'
    },
    {
        step: 'stepComment',
        nextStep: 'stepWebsitesURLs'
    },
    {
        step: 'stepWebsitesURLs',
        nextStep: 'stepResearchURLs'
    },
    {
        step: 'stepResearchURLs',
        nextStep: 'stepResearchURLs'
    },
];

var matchcriteriajson = {
    "FundManager": null,
    "FundManagerEmail": null,
    "ContactNumber": null,
    "LoanIndexListIds": null,
    "LoanTypeListIds": null,
    "LoanTypeSubListIds": null,
    "InnovationStageListIds": null,
    "HideOnResultScreen": null,
    "IsDisabled": null,
    "IsDeleted": null,
    "StartupFundingListIds": null,
    "MinLoanAmount": null,
    "MaxLoanAmount": null,
    "MinAverageAnnualTurnover": null,
    "MaxAverageAnnualTurnover": null,
    "FinanceForSubListIds": null,
    "FinanceForSubCategoryListIds": null,
    "SaCitizensOnly": null,
    "IncludePermanentResidents": null,
    "AgeListIds": null,
    "GenderListIds": null,
    "RaceListIds": null,
    "DisabilityListIds": null,
    "CompanyRegistrationTypeListIds": null,
    "IndustrySectorsLevel1ListIds": null,
    "IndustrySectorListIds": null,
    "IndustrySectorSubCategoryListIds": null,
    "RequiredDocumentTypeListIds": null,
    "NotRequiredDocumentTypeListIds": null,
    "ProvinceListIds": null,
    "MinimumMonthsTrading": null,
    "CustomerTypeListIds": null,
    "CustomerProfileListIds": null,
    "MinimumMonthlyIncome": null,
    "MinimumMonthlyIncomeRetail": null,
    "MonthlyOrSporadicIncome": null,
    "IncomeReceivedListIds": null,
    "RequiresProfitability": null,
    "CollateralListIds": null,
    "RequiresCollateral": null,
    "RequireBusinessCollateral": null,
    "RequireOwnerCollateral": null,
    "CashForAnInvoiceMinInvoiceValue": null,
    "CashForAnInvoiceCustomerProfileListIds": null,
    "MoneyForContractMinContractValue": null,
    "MoneyForContractCustomerProfileListIds": null,
    "MoneyForContractExperience": null,
    "PurchaseOrderMinFundingValue": null,
    "PurchaseOrderFundingCustomerProfileListIds": null,
    "PurchaseOrderFundingExperience": null,
    "MoneyForTenderMinTenderValue": null,
    "MoneyForTenderCustomerProfileListIds": null,
    "MoneyForTenderExperience": null,
    "BuyingBusinessPropertyMinPropertyValue": null,
    "BuyingBusinessPropertyPropertyTypeListIds": null,
    "ShopFittingRenovationsMinPropertyValue": null,
    "ShopFittingRenovationsPropertyTypeListIds": null,
    "ShopFittingRenovationsRequireUnbonded": null,
    "PropertyDevelopmentDevelopmentTypeListIds": null,
    "BusinessExpansionRequireEquity": null,
    "BusinessExpansionMinimumEquityScore": null,
    "BusinessExpansionRequireJobCreation": null,
    "BusinessExpansionRequireIncreasedProfitability": null,
    "BusinessExpansionRequireIncreasedExports": null,
    "BusinessExpansionRequireEmpowerment": null,
    "BusinessExpansionRequireRural": null,
    "BusinessExpansionRequireSocial": null,
    "ProductServiceExpansionTypesOfExpansionListIds": null,
    "BuyingAFranchiseRequireAccreditation": null,
    "BuyingAFranchiseRequirePreapproval": null,
    "PartnerManagementBuyOutMinimumBeeShareholding": null,
    "BuyingABusinessIndustrySectorsLevel1ListIds": null,
    "BuyingABusinessIndustrySectorsListIds": null,
    "BuyingABusinessBusinessTypeListIds": null,
    "BuyingABusinessRuralTownship": null,
    "BeePartnerMinimumBeeShareholding": null,
    "ExportProductSectionListIds": null,
    "ExportInternationalResearch": null,
    "ExportCountryListId": null,
    "ExportConfirmedOrder": null,
    "ExportOrderValue": null,
    "ImportSignedContract": null,
    "ImportCountryListId": null,
    "ImportProductSectionListIds": null,
    "CommercialisingResearchRequireStudentStatus": null,
    "CommercialisingResearchRequireIncreasedExports": null,
    "CommercialisingResearchRequireJobCreation": null,
    "CommercialisingResearchRequireInnovation": null,
    "CommercialisingResearchProductListIds": null,
    "PovertyAlleviationRequireRural": null,
    "PovertyAlleviationRequireJobCreation": null,
    "PovertyAlleviationRequireDisabled": null,
    "PovertyAlleviationRequireImprovedHealthcare": null,
    "PovertyAlleviationRequireIncomeGeneration": null,
    "PovertyAlleviationRequireIncreasedExports": null,
    "ResearchAndDevelopmentRequireTertiary": null,
    "ResearchAndDevelopmentIndustrySectorListIds": null,
    "BusinessProcessingServicesJobCreation": null,
    "BusinessProcessingServicesSecureContracts": null,
    "BusinessProcessingServicesYouthJobs": null,
    "CashFlowAssistanceHasPosDevice": null,
    "BeeLevelListIds": null,
    "CountryListIds": null,
    "HelpPrepareLoanApplication": null,
    "MonitorProgressAfterFunding": null,
    "ProvideMentorship": null,
    "OwnershipRules": []
}

var general = {
    "lenderId": null,
    "name": null,
    "enabled": null,
    "assignedTo": null,
    "currencyPairId":null
}

var ManageFinanceProductViewModel = {};

var modelObj = {
    MatchCriteriaJsonString: null,
    LenderId: null,
    FinanceProductName: null,
    WebsiteUrlPresent: false,
    ResearchUrlPresent: false,
    LenderType: null,
    Summary: null,
    CommentPresent: false
}

var currentstep = 'stepGeneral';
var isEdit = $('#IsEdit').val();
var financeproductId = isEdit == 'False' ? null : $('#FinanceProductId').val();
var lenderTypeCheck = isEdit == 'False' ? null : $('#LenderTypeCheck').val();
var lenderId = isEdit == 'False' ? null : $('#LenderId').val();
var financeProductName = isEdit == 'False' ? null : $('#FinanceProductName').val();
var websiteUrlsCount = isEdit == 'False' ? null : $('#WebsiteUrls').val();
var researchUrlsCount = isEdit == 'False' ? null : $('#ResearchUrls').val();
var summaryData = isEdit == 'False' ? null : $('#Summary').val();
var commentCount = isEdit == 'False' ? null : $('#Comments').val();
var summaryText = null; 
if (isEdit == 'True') {
    $('#FinanceProduct_MinLoanAmount').val(formatCurrency($('#FinanceProduct_MinLoanAmount').val()));
    $('#FinanceProduct_MaxLoanAmount').val(formatCurrency($('#FinanceProduct_MaxLoanAmount').val()));
    $('#MinimumMonthlyIncome').val(formatCurrency($('#MinimumMonthlyIncome').val()));
    $('#FinanceProduct_MinAverageAnnualTurnover').val(formatCurrency($('#FinanceProduct_MinAverageAnnualTurnover').val()));
    $('#FinanceProduct_MaxAverageAnnualTurnover').val(formatCurrency($('#FinanceProduct_MaxAverageAnnualTurnover').val()));
    matchcriteriajson = JSON.parse($('#MatchCriteriaJson').val());
    modelObj.MatchCriteriaJsonString = JSON.stringify(matchcriteriajson);
    modelObj.LenderId = lenderId;
    modelObj.FinanceProductName = financeProductName;
    if (websiteUrlsCount > 0) {
        modelObj.WebsiteUrlPresent = true;
    }
    if (researchUrlsCount > 0) {
        modelObj.ResearchUrlPresent = true;
    }
    modelObj.LenderType = lenderTypeCheck;
    modelObj.Summary = summaryData;
    if (commentCount > 0) {
        modelObj.CommentPresent = true;
    }
    fetchStatus(modelObj);
}

var _financeProductsService = abp.services.app.financeProducts;

function showStep(event, step) {
    event.preventDefault();
    $('.step').hide();
    $('.edit-pencil').hide();
    if (financeproductId) {
        $('.menuStatus').show();
    } else {
        $('.menuStatus').hide();
    }
    if (step === 'stepLoanIndex' && (lenderTypeCheck != null && lenderTypeCheck != '')) {
        $('#' + lenderTypeCheck).prop('checked', true);
    }
    $('#' + step).show();
    $('#' + step + 'Pencil').show();
    $('#' + step + 'Pencil').css('display', 'inline-block');
    currentstep = step;
}
function showPencil() {
    $('#' + currentstep + 'Pencil').show();
    $('#' + currentstep + 'Pencil').css('display', 'inline-block');
}
/* Condition Check for rendering Menus */
if (financeproductId) {
    $('#' + currentstep).show();
    $('.menuStatus').show();
    $('#' + currentstep + 'Pencil').show();
    $('#' + currentstep + 'Pencil').css('display', 'inline-block');
} else {
    $('#' + currentstep).show();
    $('.menuStatus').hide();
    $('#' + currentstep + 'Pencil').show();
    $('#' + currentstep + 'Pencil').css('display', 'inline-block');
}

function fetchStatus(obj) {
    $.ajax({
        url: window.location.origin + '/App/FinanceProducts/ManageEdit',
        data: { modelObj: obj },
        type: "Post",
        success: function (resultView) {
            $("#MenuStatus").html("");
            $("#MenuStatus").html(resultView);
            showPencil();
        },
        error: function (error) {
        }
    });
}

function updateCheckout(id) {
    $.ajax({
        url: window.location.origin + '/App/FinanceProducts/CheckOutReset',
        data: { id: id },
        type: "Post",
        success: function () {
        },
        error: function (error) {
        }
    });
}

function saveForm(event, formData, close, checkStatus) {
    var financeProduct;
    var matchCriteriaJson;
    if (currentstep === 'stepGeneral') {
        Object.keys(general).forEach(k => {
            general[k] = formData.hasOwnProperty(k) ? formData[k] : null;
        });
        Object.keys(formData).forEach(k => {
            if (matchcriteriajson.hasOwnProperty(k)) {
                matchcriteriajson[k] = formData[k];
            }
        });
        general.enabled = general.enabled ? JSON.parse(general.enabled) : false;
        matchcriteriajson.HideOnResultScreen = matchcriteriajson.HideOnResultScreen && matchcriteriajson.HideOnResultScreen !=="false" ? "true" : "false";
        general.lenderId = Number(general.lenderId);
        general.assignedTo = Number(general.assignedTo);
        general.currencyPairId = general.currencyPairId ? Number(general.currencyPairId) : null;
        matchCriteriaJson = JSON.stringify(matchcriteriajson);
        financeProduct = checkStatus ? { ...general, matchCriteriaJson, "id": financeproductId, "lastCheckedUserStatus": true } : { ...general, matchCriteriaJson, "id": financeproductId };
        modelObj.LenderId = general.lenderId;
        modelObj.FinanceProductName = general.name;
        modelObj.MatchCriteriaJsonString = matchCriteriaJson;
    }
    else if (currentstep === 'stepLoanAmount') {
        formData.MinLoanAmount = formData.MinLoanAmount.replaceAll(/\s/g, '');
        formData.MaxLoanAmount = formData.MaxLoanAmount.replaceAll(/\s/g, '');
        formData.MinLoanAmount = formData.MinLoanAmount !== '' ? formData.MinLoanAmount : null;
        formData.MaxLoanAmount = formData.MaxLoanAmount !== '' ? formData.MaxLoanAmount : null;
        Object.keys(formData).forEach(k => {
            matchcriteriajson[k] = formData.hasOwnProperty(k) && matchcriteriajson.hasOwnProperty(k) ? formData[k] : matchcriteriajson[k];
        });
    }
    else if (currentstep === 'stepFinanceFor') {
        var financeFor = '';
        var financeForSubCat = '';
        if (!_.isEmpty(formData)) {
            Object.keys(formData).forEach(k => {
                if (!k.includes('Parent') && !k.includes('Sub')) {
                    financeFor += formData[k] + ',';
                }
                else if (k.includes('Sub')) {
                    financeForSubCat += formData[k] + ',';
                }
            })
            matchcriteriajson.FinanceForSubListIds = financeFor ? financeFor.slice(0, -1) : null;
            matchcriteriajson.FinanceForSubCategoryListIds = financeForSubCat ? financeForSubCat.slice(0, -1) : null;
        }
    }
    else if (currentstep === 'stepSACitizen') {
        matchcriteriajson.SaCitizensOnly = !_.isEmpty(formData) ? Object.values(formData)[0] : null;
        matchcriteriajson.IncludePermanentResidents = !_.isEmpty(formData) ? Object.values(formData)[1] : null;
    }
    else if (currentstep === 'stepCompanyRegType') {
        matchcriteriajson.CompanyRegistrationTypeListIds = !_.isEmpty(formData) ? Object.values(formData).join(',') : null;
    }
    else if (currentstep === 'stepProvince') {
        matchcriteriajson.ProvinceListIds = !_.isEmpty(formData) ? Object.values(formData).join(',') : null;
    }
    else if (currentstep === 'stepMonthsTrading') {
        matchcriteriajson.MinimumMonthsTrading = !_.isEmpty(formData) ? Object.values(formData)[0] : null;
    }
    else if (currentstep === 'stepAverageAnnualTurnover') {
        formData.MinAverageAnnualTurnover = formData.MinAverageAnnualTurnover.replaceAll(/\s/g, '');
        formData.MaxAverageAnnualTurnover = formData.MaxAverageAnnualTurnover.replaceAll(/\s/g, '');
        formData.MinAverageAnnualTurnover = formData.MinAverageAnnualTurnover !== '' ? formData.MinAverageAnnualTurnover : null;
        formData.MaxAverageAnnualTurnover = formData.MaxAverageAnnualTurnover !== '' ? formData.MaxAverageAnnualTurnover : null;
        Object.keys(formData).forEach(k => {
            matchcriteriajson[k] = formData.hasOwnProperty(k) && matchcriteriajson.hasOwnProperty(k) ? formData[k] : matchcriteriajson[k];
        });
    }
    else if (currentstep === 'stepIndustrySectors') {
        var industrySector = '';
        var industrySectorSubCat = '';
        if (!_.isEmpty(formData)) {
            Object.keys(formData).forEach(k => {
                if (!k.includes('Sub')) {
                    industrySector += formData[k] + ',';
                }
                else {
                    industrySectorSubCat += formData[k] + ',';
                }
            })
            matchcriteriajson.IndustrySectorListIds = industrySector ? industrySector.slice(0, -1) : null;
            matchcriteriajson.IndustrySectorSubCategoryListIds = industrySectorSubCat ? industrySectorSubCat.slice(0, -1) : null;
        }
    }
    else if (currentstep === 'stepMonthlyIncome') {
        if (formData.MonthlyOrSporadicIncome === "monthly") {
            formData.MinimumMonthlyIncome = formData.MinimumMonthlyIncome ? formData.MinimumMonthlyIncome.replaceAll(/\s/g, '') : null;
        } else {
            formData.MinimumMonthlyIncome = null;
        }
        Object.keys(formData).forEach(k => {
            matchcriteriajson[k] = formData.hasOwnProperty(k) && matchcriteriajson.hasOwnProperty(k) ? formData[k] : matchcriteriajson[k];
        });
    }
    else if (currentstep === 'stepProfitability') {
        matchcriteriajson.RequiresProfitability = !_.isEmpty(formData) ? Object.values(formData)[0] : null;
    }
    else if (currentstep === 'stepCollateral') {
        matchcriteriajson.RequireBusinessCollateral = !_.isEmpty(formData) ? Object.values(formData)[0] : null;
        matchcriteriajson.RequireOwnerCollateral = !_.isEmpty(formData) ? Object.values(formData)[1] : null;
    }
    else if (currentstep === 'stepOwnership') {
       
    }
    else if (currentstep === 'stepBEELevel') {
        matchcriteriajson.BeeLevelListIds = !_.isEmpty(formData) ? Object.values(formData).join(',') : null;
    }
    else if (currentstep === 'stepCountry') {
        matchcriteriajson.CountryListIds = !_.isEmpty(formData) ? Object.values(formData).join(',') : null;
    }
    else if (currentstep === 'stepCustomerTypes') {
        matchcriteriajson.CustomerTypeListIds = !_.isEmpty(formData) ? Object.values(formData).join(',') : null;
    }
    else if (currentstep === 'stepDocumentType') {
        var required = '';
        var notRequired = '';
        Object.keys(formData).forEach(k => {
            if (formData[k] == 'required') {
                required += k + ',';
            }
            else if (formData[k] == 'notrequired') {
                notRequired += k + ',';
            }
        });
        matchcriteriajson.RequiredDocumentTypeListIds = required ? required.slice(0, -1) : null;
        matchcriteriajson.NotRequiredDocumentTypeListIds = notRequired ? notRequired.slice(0, -1) : null;
    }
    else if (currentstep === 'stepLoanIndex') {
        matchcriteriajson.LoanIndexListIds = !_.isEmpty(formData) ? Object.values(formData).join(',') : null;
    }
    else if (currentstep === 'stepLoanType') {
        var loanType = '';
        var loanTypeSub = '';
        if (!_.isEmpty(formData)) {
            Object.keys(formData).forEach(k => {
                if (!k.includes('Sub')) {
                    loanType += formData[k] + ',';
                }
                else {
                    loanTypeSub += formData[k] + ',';
                }
            })
            matchcriteriajson.LoanTypeListIds = loanType ? loanType.slice(0, -1) : null;
            matchcriteriajson.LoanTypeSubListIds = loanTypeSub ? loanTypeSub.slice(0, -1) : null;
        }
    }
    else if (currentstep === 'stepSummaryPage') {
        summaryText = formData.Text;
        financeProduct = checkStatus ? { "id": financeproductId, "summary": summaryText, "lastCheckedUserStatus": true } : { "id": financeproductId, "summary": summaryText };
        modelObj.Summary = summaryText;
    }

    else if (currentstep === 'stepComment') {
        ManageFinanceProductViewModel.FinanceProductId = financeproductId;
        ManageFinanceProductViewModel.FinanceProductCommentText = formData.Text;
        ManageFinanceProductViewModel.FinanceProductCommentUserId = Number(formData.UserId);
    }

    if (currentstep !== 'stepGeneral' && currentstep !== 'stepSummaryPage' && currentstep !== 'stepComment') {
        matchCriteriaJson = JSON.stringify(matchcriteriajson);
        financeProduct = checkStatus ? { "id": financeproductId, matchCriteriaJson, "lastCheckedUserStatus": true } : { "id": financeproductId, matchCriteriaJson };
        modelObj.MatchCriteriaJsonString = matchCriteriaJson;
    }
    /* Saving Finance Product Details */
    if (currentstep !== 'stepComment' && financeProduct) {
        _financeProductsService.createOrEdit(
            financeProduct
        ).done(function (result) {
            abp.notify.info(app.localize('SavedSuccessfully'));
            if (checkStatus) {
                updateCheckout(financeproductId);
                window.location.assign('/App/FinanceProducts');
            } else {
                if (currentstep === 'stepGeneral') {
                    financeproductId = result;
                    lenderTypeCheck = $('#LenderTypeCheck').val();
                    modelObj.LenderType = lenderTypeCheck;
                    $('.menuStatus').show();
                }
                fetchStatus(modelObj);
                var stepn = _.find(steps, { step: currentstep });
                showStep(event, stepn.nextStep);
            }

        });
    } else if (currentstep === 'stepComment'){
        $.ajax({
            url: window.location.origin + '/App/FinanceProducts/AddFinanceProductComment',
            data: { model: ManageFinanceProductViewModel },
            type: "Post",
            success: function (result) {
                $("#commentList").html("");
                $("#commentList").html(result);
                $('#FinanceProduct_Comment').trumbowyg('empty');
                abp.notify.info(app.localize('Comment added successfully'));
                modelObj.CommentPresent = true;
                fetchStatus(modelObj);
                if (close) {
                    updateCheckout(financeproductId);
                    window.location.assign('/App/FinanceProducts');
                } else {
                    var stepn = _.find(steps, { step: currentstep });
                    showStep(event, stepn.nextStep);
                }
            },
            error: function (error) {
                //console.log("Error Message: ", error);
                abp.message.error(app.localize("FinanceProductCommentInsertionError"));
            }
        });
    }
}

function submitForm(event, modelClose, checkStatus) {
if (modelClose) {
    window.location.assign('/App/FinanceProducts');
} else {
    if (currentstep !== 'stepWebsitesURLs' && currentstep !== 'stepResearchURLs' && currentstep !== 'stepLoanIndex') {
        if (!$('#' + currentstep + 'Form').valid()) {
            if (currentstep === 'stepGeneral') {
                $('#lenderError').hide();
                $('#nameError').hide();
            }
            return;
        }
        var formData = $('#' + currentstep + 'Form').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        saveForm(event, formData, modelClose, checkStatus);
    }
    else {
        if (checkStatus) {
            updateCheckout(financeproductId);
        }
        else {
            var stepn = _.find(steps, { step: currentstep });
            showStep(event, stepn.nextStep);
        }
    }
    }
}

function formatCurrency(strAmt) {

    if (strAmt) {
        var value = strAmt.toString();
        var justnumbers = value.replace(/[^0-9\.]+/g, '');
        var twodecimals = justnumbers.replace(/^([1-9]\d*\.?\d{0,2})(\d*)/g, "$1");
        var result = twodecimals.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
        return result;
    } else {
        return "";
    }
}

function removeFormatting(val) {
    val = val.replace(/\s/g, '');
    return val;
}

/*Format Currency on Loan Amount */

$('#FinanceProduct_MinLoanAmount').keyup(function () {
    if ($(this).val() < 0) {
        $(this).val(0);
    }
    this.value = formatCurrency(this.value);
});

$('#FinanceProduct_MaxLoanAmount').keyup(function () {
    if ($(this).val() < 0) {
        $(this).val(0);
    }
    this.value = formatCurrency(this.value);
});

/*Format Currency on Average Annual Turn Over */

$('#FinanceProduct_MinAverageAnnualTurnover').keyup(function () {
    if ($(this).val() < 0) {
        $(this).val(0);
    }
    this.value = formatCurrency(this.value);
});

$('#FinanceProduct_MaxAverageAnnualTurnover').keyup(function () {
    if ($(this).val() < 0) {
        $(this).val(0);
    }
    this.value = formatCurrency(this.value);
});


$('#MinimumMonthlyIncome').keyup(function () {
    if ($(this).val() < 0) {
        $(this).val(0);
    }
    this.value = formatCurrency(this.value);
});
$('#MinimumMonthsTrading').keyup(function () {
    if ($(this).val() < 0) {
        $(this).val(0);
    }
});

/* Add Website Url */

function addWebsiteUrl() {
    if (!$('#websiteUrl').val()) {
        return;
    }
    var isPrimary = $('#isPrimary:checked').val() === "true";
    ManageFinanceProductViewModel.WebsiteUrl = $('#websiteUrl').val();
    ManageFinanceProductViewModel.IsPrimary = isPrimary;
    ManageFinanceProductViewModel.FinanceProductId = financeproductId;
    $.ajax({
        url: window.location.origin + '/App/FinanceProducts/AddWebsiteUrl',
        data: { model: ManageFinanceProductViewModel },
        type: "Post",
        success: function (result) {
            $("#websiteUrlList").html("");
            $("#websiteUrlList").html(result);
            $('#isPrimary').prop("checked", false);
            $('#websiteUrl').val("");
            modelObj.WebsiteUrlPresent = true;
            fetchStatus(modelObj);
            abp.notify.info(app.localize('URL added successfully'));

        },
        error: function (error) {
            //console.log("Error Message: ", error);
            abp.message.error(app.localize("WebsiteUrlInsertionError"));
        }
    });
}

/* Add Research Url */

function addResearchUrl() {
    if (!$('#researchUrl').val()) {
        return;
    }
    ManageFinanceProductViewModel.ResearchUrl = $('#researchUrl').val();
    ManageFinanceProductViewModel.FinanceProductId = financeproductId;
    $.ajax({
        url: window.location.origin + '/App/FinanceProducts/AddResearchUrl',
        data: { model: ManageFinanceProductViewModel },
        type: "Post",
        success: function (result) {
            $("#researchUrlList").html("");
            $("#researchUrlList").html(result);
            $('#researchUrl').val("");
            modelObj.ResearchUrlPresent = true;
            fetchStatus(modelObj);
            abp.notify.info(app.localize('URL added successfully'));

        },
        error: function (error) {
            //console.log("Error Message: ", error);
            abp.message.error(app.localize("ResearchUrlInsertionError"));
        }
    });
}

/* Delete Website Url */

function deleteWebsiteUrl(fpId, websiteId) {
    ManageFinanceProductViewModel.FinanceProductId = fpId;
    ManageFinanceProductViewModel.WebsiteUrlId = websiteId;
    abp.message.confirm(
        "",
        app.localize("AreYouSureDeleteWebsiteUrl"),
        function (isConfirmed) {
            if (isConfirmed) {
                $.ajax({
                    url: window.location.origin + '/App/FinanceProducts/DeleteWebsiteUrl',
                    data: { model: ManageFinanceProductViewModel },
                    type: "Post",
                    success: function (result) {
                        $("#websiteUrlList").html("");
                        $("#websiteUrlList").html(result);
                        let count = $("#WebUrlBody").find('td').length;
                        if (count == 0) {
                            modelObj.WebsiteUrlPresent = false;
                            fetchStatus(modelObj);
                        }
                        abp.notify.info(app.localize('URL deleted successfully'));

                    },
                    error: function (error) {
                        //console.log("Error Message: ", error);
                        abp.message.error(app.localize("WebsiteUrlDeletionError"));

                    }
                });
            }
        }
    );
}

/* Delete Research Url */

function deleteResearchUrl(fpId, researchId) {
    ManageFinanceProductViewModel.FinanceProductId = fpId;
    ManageFinanceProductViewModel.ResearchUrlId = researchId;
    abp.message.confirm(
        "",
        app.localize("AreYouSureDeleteResearchUrl"),
        function (isConfirmed) {
            if (isConfirmed) {
                $.ajax({
                    url: window.location.origin + '/App/FinanceProducts/DeleteResearchUrl',
                    data: { model: ManageFinanceProductViewModel },
                    type: "Post",
                    success: function (result) {
                        $("#researchUrlList").html("");
                        $("#researchUrlList").html(result);
                        let count = $("#ResearchUrlBody").find('td').length;
                        if (count == 0) {
                            modelObj.ResearchUrlPresent = false;
                            fetchStatus(modelObj);
                        }
                        abp.notify.info(app.localize('URL deleted successfully'));

                    },
                    error: function (error) {
                        //console.log("Error Message: ", error);
                        abp.message.error(app.localize("ResearchUrlDeletionError"));

                    }
                });
            }
        }
    );
}

/* Delete Finance Product Comment */

function deleteFinanceProductComment(commentId) {
    ManageFinanceProductViewModel.FinanceProductCommentId = commentId;
    abp.message.confirm(
        "",
        app.localize("AreYouSureDeleteFinanceProductComment"),
        function (isConfirmed) {
            if (isConfirmed) {
                $.ajax({
                    url: window.location.origin + '/App/FinanceProducts/DeleteFinanceProductComment',
                    data: { model: ManageFinanceProductViewModel },
                    type: "Post",
                    success: function (result) {
                        $("#commentList").html("");
                        $("#commentList").html(result);
                        let count = $("#CommentDiv").length;
                        if (count == 0) {
                            modelObj.CommentPresent = false;
                        }
                        fetchStatus(modelObj);
                        abp.notify.info(app.localize('Comment deleted successfully'));
                    },
                    error: function (error) {
                        //console.log("Error Message: ", error);
                        abp.message.error(app.localize("FinanceProductCommentDeletionError"));

                    }
                });
            }
        }
    );
}

/* Enabling Child CheckBoxes if Parent Checkbox is checked */

$('.parent-checkbox').change(function () {
    var parentcheckboxId = $(this).attr('id');
    var childcheckboxes = $('#child-' + parentcheckboxId).find('.child-checkbox');
    var subchildcheckboxes = $('#child-' + parentcheckboxId).find('.sub-child-checkbox');
    if ($(this).is(':checked')) {
        childcheckboxes.prop('disabled', false);
    } else {
        subchildcheckboxes.prop('disabled', true).prop('checked', false);
        childcheckboxes.prop('disabled', true).prop('checked', false);
    }
});

$('.child-checkbox').change(function () {
    var childcheckboxId = $(this).attr('id');
    var subchildcheckboxes = $('#sub-child-' + childcheckboxId).find('.sub-child-checkbox');
    if ($(this).is(':checked')) {
        subchildcheckboxes.prop('disabled', false);
    } else {
        subchildcheckboxes.prop('disabled', true).prop('checked', false);
    }
});

/* Enabling Minimum Monthly Income Filed if Monthly Income is checked */

function EnableOrDisableMonthlyIncome(MonthlyOrSporadic) {
    if (MonthlyOrSporadic === 'monthly') {
        $('#MinimumMonthlyIncomeContainer').show();
    } else {
        $('#MinimumMonthlyIncomeContainer').hide();
    }
}

$("#Ownership_Percentage_Div").hide();

function measureChange(value) {
    if (value == "Percentage") {
        $("#Ownership_Percentage_Div").show();
        $("#Ownership_Type_Input").css("width","200px");
    }
    else {
        $("#Ownership_Percentage_Div").hide();
        $("#Ownership_Type_Input").css("width", "300px");
    }
}

function validationCheck() {
    if ($("#Ownership_Percentage_Input").val() > 100) {
        $("#OwnershipPercentageError").show();
    } else { 
        $("#OwnershipPercentageError").hide();
    }

    if ($("#Ownership_Type_Input").val() == "") {
        $("#OwnershipTypeError").show();
    } else { 
        $("#OwnershipTypeError").hide();
    }
}
function CheckRuleLength() {
    if (matchcriteriajson.OwnershipRules.length !== 0) {
        $("#Ownership_Operator  option[value='']").prop("disabled", true);
        $("#Ownership_Operator").val("And");
    }
    else {
        $("#Ownership_Operator  option[value='']").prop("disabled", false);
        $("#Ownership_Operator").val("");
    }
}

CheckRuleLength();

function addRule() {
    var MatchCriteriaJson;
    var data = $('#' + currentstep + 'Form').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
    if (!_.isEmpty(data)) {
        if (!matchcriteriajson.OwnershipRules.some(obj => obj.demographic === data["Ownership_Type"])) {
            if (data["Ownership_Type"] == "") {
                $("#OwnershipTypeError").show();
                return;
            }
            else {
                $("#OwnershipTypeError").hide();
            }
            let temp = {
                "demographic": data["Ownership_Type"],
                "operator": data["Ownership_Operator"],
                "measure": data["Ownership_Measure"],
                "percentage": null
            };
            if (temp.operator === 'And' && temp.measure === 'Percentage') {
                let totalPercent = 0;
                let andPercentItems = matchcriteriajson.OwnershipRules.filter(function (item) { return item.operator === 'And' && item.measure === 'Percentage'; });
                totalPercent = andPercentItems.reduce(function (sum, item) { return sum + Number(item.percentage) }, 0);
                temp.percentage = data["Ownership_percentage"];
                totalPercent += Number(temp.percentage);
                if (totalPercent > 100) {
                    abp.message.error(app.localize("Total Percentage exceeing 100%"));
                    return;
                }
            }
            if (temp.measure == "Percentage") {
                temp.percentage = data["Ownership_percentage"];
            }
            matchcriteriajson.OwnershipRules.push(temp);
            MatchCriteriaJson = JSON.stringify(matchcriteriajson);
            ManageFinanceProductViewModel.FinanceProductId = financeproductId;
            ManageFinanceProductViewModel.MatchCriteriaJsonString = MatchCriteriaJson;
            ManageFinanceProductViewModel.OwnershipStrings = $('#OwnershipListIds').val();
            $.ajax({
                url: window.location.origin + '/App/FinanceProducts/AddOwnershipRule',
                data: { model: ManageFinanceProductViewModel },
                type: "Post",
                success: function (result) {
                    $("#OwnershipTable").html("");
                    $("#OwnershipTable").html(result);
                    abp.notify.info(app.localize('Rule added successfully'));
                    CheckRuleLength();
                    modelObj.MatchCriteriaJsonString = MatchCriteriaJson;
                    fetchStatus(modelObj);
                },
                error: function (error) {
                    matchcriteriajson.OwnershipRules = matchcriteriajson.OwnershipRules.filter(a => a["demographic"] !== temp.demographic);
                    abp.message.error(app.localize("Something went wrong"));
                }
            });
        }
        else {
            abp.message.error(app.localize("A rule for this ownership already exists."));
            return;
        }
    }
    
}

function deleteRule(id) {
    if (matchcriteriajson.OwnershipRules.length != 0) {
        matchcriteriajson.OwnershipRules = matchcriteriajson.OwnershipRules.filter(item => item["demographic"] !== id)
        MatchCriteriaJson = JSON.stringify(matchcriteriajson);
        ManageFinanceProductViewModel.FinanceProductId = financeproductId;
        ManageFinanceProductViewModel.MatchCriteriaJsonString = MatchCriteriaJson;
        ManageFinanceProductViewModel.OwnershipStrings = $('#OwnershipListIds').val();
        $.ajax({
            url: window.location.origin + '/App/FinanceProducts/DeleteOwnershipRule',
            data: { model: ManageFinanceProductViewModel },
            type: "Post",
            success: function (result) {
                $("#OwnershipTable").html("");
                $("#OwnershipTable").html(result);
                abp.notify.info(app.localize('Rule deleted successfully'));
                CheckRuleLength();
                modelObj.MatchCriteriaJsonString = MatchCriteriaJson;
                fetchStatus(modelObj);
            },
            error: function (error) {
                abp.message.error(app.localize('Something went wrong'));
            }
        });
    }
}