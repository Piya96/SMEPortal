var steps = [
    {
        step: 'stepGeneralFundForm',
        nextStep: 'stepWebsitesURLsFundForm',
        previousStep: 'stepGeneralFundForm'
    },
    {
        step: 'stepWebsitesURLsFundForm',
        nextStep: 'stepLoanAmount',
        previousStep: 'stepGeneralFundForm'
    },
    {
        step: 'stepLoanAmount',
        nextStep: 'stepFinanceFor',
        previousStep: 'stepWebsitesURLsFundForm'
    },
    {
        step: 'stepFinanceFor',
        nextStep: 'stepSACitizen',
        previousStep: 'stepLoanAmount'
    },
    {
        step: 'stepSACitizen',
        nextStep: 'stepCompanyRegType',
        previousStep: 'stepFinanceFor'
    },
    {
        step: 'stepCompanyRegType',
        nextStep: 'stepProvince',
        previousStep: 'stepSACitizen'
    },
    {
        step: 'stepProvince',
        nextStep: 'stepMonthsTrading',
        previousStep: 'stepCompanyRegType'
    },
    {
        step: 'stepMonthsTrading',
        nextStep: 'stepAverageAnnualTurnover',
        previousStep: 'stepProvince'
    },
    {
        step: 'stepAverageAnnualTurnover',
        nextStep: 'stepIndustrySectors',
        previousStep: 'stepMonthsTrading'
    },
    {
        step: 'stepIndustrySectors',
        nextStep: 'stepMonthlyIncome',
        previousStep: 'stepAverageAnnualTurnover'
    },
    {
        step: 'stepMonthlyIncome',
        nextStep: 'stepProfitability',
        previousStep: 'stepIndustrySectors'
    },
    {
        step: 'stepProfitability',
        nextStep: 'stepCollateral',
        previousStep: 'stepMonthlyIncome'
    },
    {
        step: 'stepCollateral',
        nextStep: 'stepOwnership',
        previousStep: 'stepProfitability'
    },
    {
        step: 'stepOwnership',
        nextStep: 'stepBEELevel',
        previousStep: 'stepCollateral'
    },
    {
        step: 'stepBEELevel',
        nextStep: 'stepCountry',
        previousStep: 'stepOwnership'
    },
    {
        step: 'stepCountry',
        nextStep: 'stepCustomerTypes',
        previousStep: 'stepBEELevel'
    },
    {
        step: 'stepCustomerTypes',
        nextStep: 'stepDocumentType',
        previousStep: 'stepCountry'
    },
    {
        step: 'stepDocumentType',
        nextStep: 'stepLoanIndex',
        previousStep: 'stepCustomerTypes'
    },
    {
        step: 'stepLoanIndex',
        nextStep: 'stepLoanType',
        previousStep: 'stepDocumentType'
    },
    {
        step: 'stepLoanType',
        nextStep: 'stepLoanType',
        previousStep: 'stepLoanIndex'
    }
    //{
    //    step: 'stepLoanType',
    //    nextStep: 'stepSummaryPage'
    //},
    //{
    //    step: 'stepSummaryPage',
    //    nextStep: 'stepComment'
    //},
    //{
    //    step: 'stepComment',
    //    nextStep: 'stepWebsitesURLs'
    //},
    //{
    //    step: 'stepWebsitesURLs',
    //    nextStep: 'stepResearchURLs'
    //},
    //{
    //    step: 'stepResearchURLs',
    //    nextStep: 'stepResearchURLs'
    //},
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
    "financeProductName": null
}

var ManageFundFormViewModel = {};


var currentstep = 'stepGeneralFundForm';
$('#' + currentstep).show();
var isEdit = $('#IsEdit').val();
var manageFundFormToken = $('#ManageFundFormToken').val();
var encryptedFundFormToken = encodeURIComponent($('#EncryptedFundFormToken').val());

if (isEdit == 'True') {
    $('#FinanceProduct_MinLoanAmount').val(formatCurrency($('#FinanceProduct_MinLoanAmount').val()));
    $('#FinanceProduct_MaxLoanAmount').val(formatCurrency($('#FinanceProduct_MaxLoanAmount').val()));
    $('#MinimumMonthlyIncome').val(formatCurrency($('#MinimumMonthlyIncome').val()));
    $('#FinanceProduct_MinAverageAnnualTurnover').val(formatCurrency($('#FinanceProduct_MinAverageAnnualTurnover').val()));
    $('#FinanceProduct_MaxAverageAnnualTurnover').val(formatCurrency($('#FinanceProduct_MaxAverageAnnualTurnover').val()));
    matchcriteriajson = JSON.parse($('#MatchCriteriaJson').val());
}

function showStep(event, step) {
    event.preventDefault();
    $('.step').hide();
    
    $('#' + step).show();
    if (step === 'stepLoanType') {
        $('#NextFundForm').hide();
        $('#FinishFundForm').show();
    }
    else {
        $('#NextFundForm').show();
        $('#FinishFundForm').hide();
    }

    currentstep = step;
}

function saveForm(event, formData) {
    var fundForm;
    var matchCriteriaJson;
    if (currentstep === 'stepGeneralFundForm') {
        Object.keys(general).forEach(k => {
            general[k] = formData.hasOwnProperty(k) ? formData[k] : null;
        });
        Object.keys(formData).forEach(k => {
            if (matchcriteriajson.hasOwnProperty(k)) {
                matchcriteriajson[k] = formData[k];
            }
        });
        matchCriteriaJson = JSON.stringify(matchcriteriajson);
        fundForm = { ...general, matchCriteriaJson, "token": manageFundFormToken, beenCompleted: false }; 
    }
    else if (currentstep === 'stepWebsitesURLsFundForm') {
        fundForm = { ...formData, "token": manageFundFormToken, beenCompleted: false };
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
                if (!k.includes('Sub')) {
                    financeFor += formData[k] + ',';
                }
                else {
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
        matchCriteriaJson = JSON.stringify(matchcriteriajson);
        fundForm = { matchCriteriaJson, "token": manageFundFormToken, "beenCompleted": true };
    }

    if (currentstep !== 'stepGeneralFundForm' && currentstep !== 'stepLoanType' && currentstep !== 'stepWebsitesURLsFundForm') {
        matchCriteriaJson = JSON.stringify(matchcriteriajson);
        fundForm = { matchCriteriaJson, "token": manageFundFormToken, "beenCompleted": false };

        //modelObj.MatchCriteriaJsonString = matchCriteriaJson;
    }
    /* Saving Finance Product Details */
    if (fundForm) {
        $.ajax({
                url: window.location.origin + '/App/FundForms/CreateOrEdit',
                data: { input: fundForm },
                type: "Post",
                success: function (result) {
                   /* abp.notify.info(app.localize('SavedSuccessfully'));*/
                   //abp.notify.info('Saved Successfully');
                    //$('#' + currentstep).hide();
                    var stepn = _.find(steps, { step: currentstep });
                    showStep(event, stepn.nextStep);
                },
                error: function (error) {
                    abp.message.error("Something went wrong");
                }
        });
    }
}

function submitForm(event, modelBack) {
    var slicedcurrentstep = currentstep.includes("FundForm") ? currentstep.slice(0, -8) : currentstep;
    if (!modelBack) {
        if (!$('#' + slicedcurrentstep + 'Form').valid()) {
            if (currentstep === 'stepGeneralFundForm') {
                $('#nameError').hide();
            }
            return;
        }
        var formData = $('#' + slicedcurrentstep + 'Form').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        saveForm(event, formData, modelBack);
        if (currentstep === 'stepLoanType') {
            window.location.href = window.location.origin + '/App/FundForms/FundFormSuccess/?c=' + encryptedFundFormToken;
        }
    }
    else if (modelBack && currentstep !== "stepGeneralFundForm") {
        var stepn = _.find(steps, { step: currentstep });
        showStep(event, stepn.previousStep);
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

$('#MergeButton').click(function () {
    var FundFormId = $('#FundFormViewId').val();
    $.ajax({
        url: window.location.origin + '/App/FundForms/MergeFundForm',
        data: { fundFormId: FundFormId },
        type: "Post",
        success: function (result) {
             abp.message.success('Merged FundForm with FinanceProduct', app.localize('SavedSuccessfully'));
             //abp.notify.success(app.localize('SavedSuccessfully'));
        },
        error: function (error) {
            abp.notify.info(app.localize('Error'));
        }
    })
});


///* Enabling Child CheckBoxes if Parent Checkbox is checked */

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
///* Enabling Minimum Monthly Income Filed if Monthly Income is checked */

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
        $("#Ownership_Type_Input").css("width", "200px");
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
                    //abp.message.error(app.localize("Total Percentage exceeing 100%"));
                    abp.message.error("Total Percentage exceeing 100%");
                    return;
                }
            }
            if (temp.measure == "Percentage") {
                temp.percentage = data["Ownership_percentage"];
            }
            matchcriteriajson.OwnershipRules.push(temp);
            MatchCriteriaJson = JSON.stringify(matchcriteriajson);
            ManageFundFormViewModel.Token = manageFundFormToken;
            ManageFundFormViewModel.MatchCriteriaJson = MatchCriteriaJson;
            ManageFundFormViewModel.BeenCompleted = false;
            ManageFundFormViewModel.OwnershipStrings = $('#OwnershipListIds').val();
            $.ajax({
                url: window.location.origin + '/App/FundForms/AddOwnershipRule',
                data: { input: ManageFundFormViewModel },
                type: "Post",
                success: function (result) {
                    $("#OwnershipTable").html("");
                    $("#OwnershipTable").html(result);
                    //abp.notify.info(app.localize('Rule added successfully'));
                    abp.notify.info('Rule added successfully');
                    CheckRuleLength();
                },
                error: function (error) {
                    matchcriteriajson.OwnershipRules = matchcriteriajson.OwnershipRules.filter(a => a["demographic"] !== temp.demographic);
                    //abp.message.error(app.localize("Something went wrong"));
                    abp.message.error("Something went wrong");
                }
            });
        }
        else {
            //abp.message.error(app.localize("A rule for this ownership already exists."));
            abp.message.error("A rule for this ownership already exists.");
            return;
        }
    }
}
function deleteRule(id) {
    if (matchcriteriajson.OwnershipRules.length != 0) {
        matchcriteriajson.OwnershipRules = matchcriteriajson.OwnershipRules.filter(item => item["demographic"] !== id)
        MatchCriteriaJson = JSON.stringify(matchcriteriajson);
        ManageFundFormViewModel.Token = manageFundFormToken;
        ManageFundFormViewModel.MatchCriteriaJson = MatchCriteriaJson;
        ManageFundFormViewModel.BeenCompleted = false;
        ManageFundFormViewModel.OwnershipStrings = $('#OwnershipListIds').val();
        $.ajax({
            url: window.location.origin + '/App/FundForms/DeleteOwnershipRule',
            data: { input: ManageFundFormViewModel },
            type: "Post",
            success: function (result) {
                $("#OwnershipTable").html("");
                $("#OwnershipTable").html(result);
                //abp.notify.info(app.localize('Rule deleted successfully'));
                abp.notify.info('Rule deleted successfully');
                CheckRuleLength();
            },
            error: function (error) {
                //abp.message.error(app.localize('Something went wrong'));
                abp.message.error('Something went wrong');
            }
        });
    }
}