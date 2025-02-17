'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

// fss ( funder search summary )
if (app.fss == undefined) {
    app.fss = {};
}

app.fss.fundingRequirements = {};
(function (fundingRequirements) {

    let helpers = app.onboard.helpers.get();
    let listItems = app.listItems.getter;

    class Summary {
        constructor() {
            this.json = null;
            this.appId = null;
        }

        getVal(name) {
            return helpers.getNvpValue(this.json, name, 0);
        }

        setVal(name, id, filters = []) {
            let value = this.getVal(name);
            let result = value;
            if (Array.isArray(filters) == true) {
                filters.forEach((func, idx) => {
                    let obj = func(value);
                    value = obj;
                });
            }
            $('#' + id + '-' + this.appId).text(value);
            return result;
        }

        setInt(name, id, total, filters = []) {
            let value = this.getVal(name);
            if (value == '' || value == null || isNaN(value) == true) {
                return '';
            }
            let result = value;
            if (Array.isArray(filters) == true) {
                filters.forEach((func, idx) => {
                    let obj = func(value);
                    value = obj;
                });
            }
            value = parseFloat(value);
            value /= 100.0;
            value *= total;
            value = parseInt(value);
            value = value.toString();
            $('#' + id + '-' + this.appId).text(value);
            return result;
        }

        group1() {
            this.setVal("input-business-years-in-operation", 'business-years-in-operation');
            this.setVal("input-total-number-of-employees", 'total-number-of-employees');
            this.setVal("input-number-of-permanent-employees", 'number-of-permanent-employees');
            this.setVal("input-number-of-permanent-youth-employees-under35", 'number-of-permanent-youth-employees-under35');
            this.setVal("input-number-of-permanent-female-employees", 'number-of-permanent-female-employees');
            this.setVal("input-number-of-permanent-black-employees", 'number-of-permanent-black-employees');
            this.setVal("input-number-of-new-jobs-created-through-loan", 'number-of-new-jobs-created-through-loan');
            this.setVal("input-number-of-existing-jobs-sustained", 'number-of-existing-jobs-sustained');

            $('#parent-group-1-' + this.appId).show();
        }

        group2() {
            this.setVal("input-key-suppliers", "key-suppliers");
            this.setVal("input-credit-held-with-suppliers", "credit-held-with-suppliers", [helpers.formatCurrencyR]);

            $('#parent-group-2-' + this.appId).show();
        }

        group3() {
            this.setVal("input-total-number-of-owners", "total-number-of-owners");
            let total = this.getVal('input-total-number-of-owners');
            this.setInt("input-percent-ownership-by-south-africans", "percent-ownership-by-south-africans", total);
            this.setInt("input-percent-black-coloured-indian-pdi", "percent-black-coloured-indian-pdi", total);
            this.setInt("input-percent-black-south-africans-only", "percent-black-south-africans-only", total);
            this.setInt("input-percent-white-only", "percent-white-only", total);
            this.setInt("input-percent-asian-only", "percent-asian-only", total);
            this.setInt("input-percent-disabled-people", "percent-disabled-people", total);
            this.setInt("input-percent-youth-under-35", "percent-youth-under-35", total);
            this.setInt("input-percent-women-women-any-race", "percent-women-women-any-race", total);
            this.setInt("input-percent-women-black-only", "percent-women-black-only", total);
            this.setInt("input-percent-non-south-african-citizens", "percent-non-south-african-citizens", total);
            this.setInt("input-percent-companies-organisations", "percent-companies-organisations", total);

            $('#parent-group-3-' + this.appId).show();
        }

        group4() {
            let value = this.setVal("input-owners-contribution", "owners-contribution", [helpers.formatCurrencyR]);
            value = parseInt(value);
            if (value > 0 && isNaN(value) == false) {
                $('#tr-source-of-funds-' + this.appId).show();
                this.setVal("select-source-of-funds", "source-of-funds", [listItems.getSourceOfFunds]);
            } else {
                $('#tr-source-of-funds-' + this.appId).hide();
            }
            this.setVal("input-business-premises-property-value-of-directors", "business-premises-property-value-of-directors", [helpers.formatCurrencyR]);

            $('#parent-group-4-' + this.appId).show();
        }

        group5() {
            this.setVal("input-has-up-to-date-audited-management-accounts", "has-up-to-date-audited-management-accounts");

            $('#parent-group-5-' + this.appId).show();
        }

        group6() {
            this.setVal("input-not-funding-for-debt-to-other-lending-institute", "not-funding-for-debt-to-other-lending-institute");
            this.setVal("input-not-funded-by-other-government-dept-parastal", "not-funded-by-other-government-dept-parastal");
            this.setVal("input-owner-not-government-or-soe-officials", "owner-not-government-or-soe-officials");
            this.setVal("input-not-gaming-pyramid-loan-shark-illegal", "not-gaming-pyramid-loan-shark-illegal");
            this.setVal("input-not-fraud-corruption-records", "not-fraud-corruption-records");
            this.setVal("input-owner-not-un-rehabilitated-insolvent", "owner-not-un-rehabilitated-insolvent");

            $('#parent-group-6-' + this.appId).show();
        }

        group7() {
            this.setVal("input-business-whole-sa-owned", "business-whole-sa-owned");
            this.setVal("input-70-perc-employees-south-african-valid-id-docs", "70-perc-employees-south-african-valid-id-docs");
            this.setVal("input-min-6-months-trading", "min-6-months-trading");
            this.setVal("input-turnover-less-than-r1point5mill-per-annum", "turnover-less-than-r1point5mill-per-annum");
            this.setVal("input-business-has-valid-bank-acc", "business-has-valid-bank-acc");
            this.setVal("input-willing-to-participate-in-dsbs-buying-scheme", "willing-to-participate-in-dsbs-buying-scheme");
            this.setVal("input-operating-in-township-or-village", "operating-in-township-or-village");
            this.setVal("input-enterprise-is-owner-managed", "enterprise-is-owner-managed");
            this.setVal("select-type-of-business", "type-of-business", [listItems.getTypeOfBusiness]);

            $('#parent-group-7-' + this.appId).show();
        }

        group8() {
            //this.setVal("select-asset-type", "asset-type", [listItems.getAssetType]);
            //this.setVal("input-description", "description");
            //this.setVal("input-model", "model");
            //this.setVal("input-new-or-used", "new-or-used");
            //this.setVal("input-has-natis-certificate", "has-natis-certificate");
            //
            //this.setVal("date-registration-date", "registration-date");
            //
            //this.setVal("input-registered-owner", "registered-owner");
            //this.setVal("input-title-holder", "title-holder");
            //this.setVal("select-year", "year");
            //this.setVal("input-serial-vin-chassis-number", "serial-vin-chassis-number");
            //this.setVal("input-engine-number", "engine-number");
            //this.setVal("input-insurer", "insurer");
            //this.setVal("input-purchase-value", "purchase-value", [helpers.formatCurrencyR]);
            //this.setVal("input-vat", "vat", [helpers.formatCurrencyR]);
            //this.setVal("input-total", "total", [helpers.formatCurrencyR]);
            //
            //$('#parent-group-8-' + this.appId).show();
        }

        group9() {
            this.setVal("select-min-membership", "min-membership", [listItems.getMinMembershipRequirement]);
            this.setVal("input-has-min-shares-savings-of-100k", "has-min-shares-savings-of-100k");
            this.setVal("input-has-savings-and-loan-policies", "has-savings-and-loan-policies");
            this.setVal("input-has-full-functioning-board", "has-full-functioning-board");
            this.setVal("input-has-min-opp-period-of-6months", "has-min-opp-period-of-6months");
            this.setVal("input-has-proof-of-proper-systems-processes-in-place", "has-proof-of-proper-systems-processes-in-place");
            this.setVal("input-is-outstanding-loan-book-at-least-100K", "is-outstanding-loan-book-at-least-100K");
            this.setVal("select-max-funding-req", "max-funding-req", [listItems.getMaxFundingRequirement]);
            this.setVal("input-is-legislation-complient", "is-legislation-complient");
            this.setVal("input-provice-pipeline-of-potential-clients-upon-app", "provice-pipeline-of-potential-clients-upon-app");

            $('#parent-group-9-' + this.appId).show();
        }

        group10() {
            this.setVal("input-purchase-order-number", "purchase-order-number");
            this.setVal("input-contract-provider-contract-details", "contract-provider-contract-details");
            this.setVal("input-contract-deliverables-desc", "contract-deliverables-desc");
            this.setVal("input-contract-value", "contract-value", [helpers.formatCurrencyR]);
            this.setVal("input-contract-delivery-period", "contract-delivery-period");
            this.setVal("input-are-products-locally-procured", "are-products-locally-procured");

            $('#parent-group-10-' + this.appId).show();
        }

        group11() {
            this.setVal("input-do-you-have-a-purchase-order", "do-you-have-a-purchase-order");

            $('#parent-group-11-' + this.appId).show();
        }

        hideAll() {
            $('#parent-group-1-' + this.appId).hide();
            $('#parent-group-2-' + this.appId).hide();
            $('#parent-group-3-' + this.appId).hide();
            $('#parent-group-4-' + this.appId).hide();
            $('#parent-group-5-' + this.appId).hide();
            $('#parent-group-6-' + this.appId).hide();
            $('#parent-group-7-' + this.appId).hide();
            //$('#parent-group-8-' + this.appId).hide();
            $('#parent-group-9-' + this.appId).hide();
            $('#parent-group-10-' + this.appId).hide();
            $('#parent-group-11-' + this.appId).hide();
        }

        setHeader(product) {
            //$('#funding-requirements-header').text('Funding Requirements: ' + product);
        }

        youthChannelFund() {
            this.setHeader('Youth Challenge Fund');
            this.group6();
        }

        trep() {
            this.setHeader('Township, Rural and Entrepreneurial Programme (TREP)');
            this.group1();
            this.group2();
            this.group3();
            this.group4();
            this.group7();
        }

        microFinance() {
            this.setHeader('Micro Finance');
            this.group1();
            this.group3();
            this.group4();
            this.group5();
        }

        godisaLoans() {
            this.setHeader('Godisa Loans');
            this.group1();
            this.group3();
            this.group4();
            this.group5();
        }

        WLorRFIorEU() {
            this.setHeader('WL or RFI or EU');
            this.group1();
            this.group3();
            this.group4();
            this.group5();
        }

        coOpDevelopmentFund() {
            this.setHeader('Co-op Development Fund');
            this.group1();
            this.group3();
            this.group4();
            this.group9();
        }

        manufactureVeteranDisability() {
            this.setHeader('ManufacutreVeteranDisability');
            this.group1();
            this.group3();
            this.group4();
            this.group5();
        }

        bridgingLoan() {
            this.setHeader('Bridging Loan');
            this.group1();
            this.group3();
            this.group4();
            this.group5();
            this.group10();
        }

        purchaseOrder() {
            this.setHeader('Purchase Order');
            this.group1();
            this.group3();
            this.group4();
            this.group5();
            this.group10();
            this.group11();
        }

        assetFinance() {
            this.setHeader('Asset Finance');
            this.group1();
            this.group3();
            this.group4();
            this.group5();
            //this.group8();
        }

        revolvingLoan() {
            this.setHeader('Revolving Loan');
            this.group1();
            this.group3();
            this.group4();
            this.group5();
        }

        termLoan() {
            this.setHeader('Term Loan');
            this.group1();
            this.group3();
            this.group4();
            this.group5();
        }

        apply(jsonStr, appId) {
            this.appId = appId;
            this.hideAll();
            let nvp = jsonStr;
            this.json = helpers.nvpArrayToObject(nvp);
            this.appId = appId.toString();

            let guid = this.getVal('product-fit-guid');
            if (guid == '' || guid == null || guid == undefined) {
                return;
            } else {
                switch (guid) {
                    case '6262851b4a757c7ed1f3097f': //Youth challenge fund
                        this.youthChannelFund();
                        break;

                    case '626284e1f8ecc0f40b8edf00': //TREP
                        this.trep();
                        break;

                    case '62628008f9fce6eea1f8f611': //WL or RFI or EU
                    case '6266620183b96943ddf85151': //WL or RFI or EU
                    case '62628286639e7b9d112e6666': //WL or RFI or EU
                        this.WLorRFIorEU();
                        break;

                    case '6266644706b2c31359cd102f': //Revolving loan
                        this.revolvingLoan();
                        break;

                    case '626663ff9d63e9cf83e4126a': //Asset finance
                        this.assetFinance();
                        break;

                    case '626663b9b8ac31dfde290063': //Bridging loan
                        this.bridgingLoan();
                        break;

                    case '63232c9e0bd9ef3f1a8e3b82': //Purchase order
                        this.purchaseOrder();
                        break;

                    case '62628556e79a488f50c98bc2': //ManufactureVeteranDisability
                    case '62666292443c96e336e77adb': //ManufactrueVeteranDisability
                        this.manufactureVeteranDisability();
                        break;

                    case '62666479ae31305e9e16f2fe': //Term loan
                        this.termLoan();
                        break;

                    case '626661851c7472bd5d1ee51c': //Godisa loans
                        this.godisaLoans();
                        break;

                    case '626282d9530062eea92b5b18': //Co - op development fund
                        this.coOpDevelopmentFund();
                        break;

                    case '626282bbbf0a95435552dbeb': //Micro Finance
                        this.microFinance();
                        break;
                }
            }
        }
    }

    function Render(jsonStr, appId) {
        let summary = new Summary();
        summary.apply(jsonStr, appId);
    }

    fundingRequirements.render = function (jsonStr, appId) {
        if (jsonStr != null) {
            Render(jsonStr, appId);
        } else {
        }
    };
}(app.fss.fundingRequirements));
