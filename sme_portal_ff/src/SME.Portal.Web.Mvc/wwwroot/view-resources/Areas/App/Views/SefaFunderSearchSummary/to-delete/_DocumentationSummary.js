'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.documentation = {};
(function (documentation) {
    // Documentation ( _StepDocumentation.cshtml )
    const _names = {
        cipcRegistrationDoc : '5aaf6d123a022727ec3b587a',
        cipcAnnualReturn : '60549c63a2b3b4fb7c24bb34',
        copiesOfOwnersIDs : '5ab0cdb53efed8141436959b',
        proofOfBusinessAddress : '5b2a54ecb958c008605883ff',
        beeCertificate : '60549db9e3032aa608a98cc1',
        bankStatementsForBusinessAccount : '5aaf6d193a022727ec3b587b',
        cashFlowProjections : '5ab0ce1d3efed814143695a1',
        statementOfAssetsAndLiabilities : '5ab0cdd73efed8141436959d',
        taxClearanceCertificate : '5ab0cdc33efed8141436959c',
        businessPlan : '5ab0cde13efed8141436959e',
        latestManagementAccounts : '5ab0cdfc3efed814143695a0',
        latestAnnualFinancialStatements: '5ab0cded3efed8141436959f',
        wanttouploadbusbankstatements : 'wanttouploadbusbankstatements'
    };


    function Render(matchCriteria, appId, dataArr) {
        appId = '-' + appId;

        function pushTripple(name, value, label, literal) {
            dataArr.push(
                { 'name': name, 'value': value, 'label': label, 'literal': literal }
            );
        }
        let obj = app.common.nvp.arrayToObject(matchCriteria);

        function setValue(name, dstId) {
            if (obj.hasOwnProperty(name) == true) {
                let dstStr = obj[name][0];
                $(dstId + appId).text(dstStr);
                pushTripple(name, dstStr, '', dstStr);
            }
        }
        setValue(_names.cipcRegistrationDoc, '#id-div-summary-registration-reg-doc');
        setValue(_names.cipcAnnualReturn, '#id-div-summary-cipc-annual-return-doc');
        setValue(_names.copiesOfOwnersIDs, '#id-div-summary-cert-owners-reg-doc');
        setValue(_names.proofOfBusinessAddress, '#id-div-summary-proof-of-addr-reg-doc');
        setValue(_names.beeCertificate, '#id-div-summary-bee-certificate-doc');
        setValue(_names.bankStatementsForBusinessAccount, '#id-div-summary-bank-statements-reg-doc');
        setValue(_names.cashFlowProjections, '#id-div-summary-months-12-budget-reg-doc');
        setValue(_names.statementOfAssetsAndLiabilities, '#id-div-summary-assets-liabilities-reg-doc');
        setValue(_names.taxClearanceCertificate, '#id-div-summary-tax-clearance-reg-doc');
        setValue(_names.businessPlan, '#id-div-summary-business-plan-reg-doc');
        setValue(_names.latestManagementAccounts, '#id-div-summary-management-account-reg-doc');
        setValue(_names.latestAnnualFinancialStatements, '#id-div-summary-annual-fin-atatements-reg-doc');
        setValue(_names.wanttouploadbusbankstatements, '#id-latest-bank-statements-div');
    }

    documentation.render = function (funderSearches, appId) {
        if (funderSearches != null) {
            let dataArr = [];
            Render(funderSearches, appId, dataArr);
            return dataArr;
        } else {
            return null;
        }
    };

}(app.fss.documentation));
