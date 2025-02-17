"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.page == undefined) {
    app.wizard.page = {};
}
// has-loan-policies-in-place
// max-funding-no-more-than-15%-total-assets
// max-funding-no-more-than-50M

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-1 : TREP, Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, Co-op development fund, WL or RFI or EU, Micro finance -->

// "input-business-years-in-operation"
// "input-total-number-of-employees"
// "input-number-of-permanent-employees"
// "input-number-of-permanent-youth-employees-under35"
// "input-number-of-permanent-female-employees"
// "input-number-of-permanent-black-employees"
// "input-number-of-new-jobs-created-through-loan"
// "input-number-of-existing-jobs-sustained"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-2 : TREP

// "input-key-suppliers"
// "input-credit-held-with-suppliers"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-3 : TREP, Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, Co - op development fund, WL or RFI or EU, Micro finance-- >

// "input-percent-ownership-by-south-africans"
// "input-percent-black-coloured-indian-pdi"
// "input-percent-black-south-africans-only"
// "input-percent-white-only"
// "input-percent-asian-only"
// "input-percent-disabled-people"
// "input-percent-youth-under-35"
// "input-percent-women-women-any-race"
// "input-percent-women-black-only"
// "input-percent-non-south-african-citizens"
// "input-percent-companies-organisations"
// "input-total-number-of-owners"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-4 : TREP, Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, Co - op development fund, WL or RFI or EU, Micro finance-- >

// "input-owners-contribution"
// "select-source-of-funds"
// "input-business-premises-property-value-of-directors"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-5 : Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, WL or RFI or EU, Micro finance-- >

// "input-has-up-to-date-audited-management-accounts"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-6 : Youth challenge fund

// "input-not-funding-for-debt-to-other-lending-institute"
// "input-not-funded-by-other-government-dept-parastal"
// "input-owner-not-government-or-soe-officials"
// "input-not-gaming-pyramid-loan-shark-illegal"
// "input-not-fraud-corruption-records"
// "input-owner-not-un-rehabilitated-insolvent"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-7 : TREP

// "input-business-whole-sa-owned"
// "input-70-perc-employees-south-african-valid-id-docs"
// "input-min-6-months-trading"
// "input-turnover-less-than-r1point5mill-per-annum"
// "input-business-has-valid-bank-acc"
// "input-willing-to-participate-in-dsbs-buying-scheme"
// "input-operating-in-township-or-village"
// "input-enterprise-is-owner-managed"
// "select-type-of-business"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-8 : Asset finance

// "select-asset-type"
// "input-description"
// "input-model"
// "input-new-or-used"
// "input-has-natis-certificate"
// "date-registration-date"
// "input-registered-owner"
// "input-title-holder"
// "select-year"
// "input-serial-vin-chassis-number"
// "input-engine-number"
// "input-insurer"
// "input-purchase-value"
// "input-vat"
// "input-total"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-9 : Co-op development fund

// "select-min-membership"
// "input-has-min-shares-savings-of-100k"
// "input-has-savings-and-loan-policies"
// "input-has-full-functioning-board"
// "input-has-min-opp-period-of-6months"
// "input-has-proof-of-proper-systems-processes-in-place"
// "input-is-outstanding-loan-book-at-least-100K"
// "select-max-funding-req"
// "input-is-legislation-complient"
// "input-provice-pipeline-of-potential-clients-upon-app"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// group-10 : Bridging-loan

// "input-purchase-order-number",
// "input-contract-provider-contract-details",
// "input-contract-deliverables-desc",
// "input-contract-value",
// "input-contract-delivery-period",
// "input-are-products-locally-procured",

(function (page) {
    //let fundingRequirementsNames = [
    //    "input-business-years-in-operation",
    //    "input-total-number-of-employees",
    //    "input-number-of-permanent-employees",
    //    "input-number-of-permanent-youth-employees-under35",
    //    "input-number-of-permanent-female-employees",
    //    "input-number-of-permanent-black-employees",
    //    "input-number-of-new-jobs-created-through-loan",
    //    "input-number-of-existing-jobs-sustained",
    //    "input-key-suppliers",
    //    "input-credit-held-with-suppliers",
    //    "input-percent-ownership-by-south-africans",
    //    "input-percent-black-coloured-indian-pdi",
    //    "input-percent-black-south-africans-only",
    //    "input-percent-white-only",
    //    "input-percent-disabled-people",
    //    "input-percent-youth-under-35",
    //    "input-percent-women-women-any-race",
    //    "input-percent-non-south-african-citizens",
    //    "input-percent-companies-organisations",
    //    "input-total-number-of-owners",
    //    "input-owners-contribution",
    //    "select-source-of-funds",
    //    "input-business-premises-property-value-of-directors",
    //    "input-has-up-to-date-audited-management-accounts",
    //    "input-not-funding-for-debt-to-other-lending-institute",
    //    "input-not-funded-by-other-government-dept-parastal",
    //    "input-owner-not-government-or-soe-officials",
    //    "input-not-gaming-pyramid-loan-shark-illegal",
    //    "input-not-fraud-corruption-records",
    //    "input-owner-not-un-rehabilitated-insolvent",
    //    "input-business-whole-sa-owned",
    //    "input-70-perc-employees-south-african-valid-id-docs",
    //    "input-min-6-months-trading",
    //    "input-turnover-less-than-r1point5mill-per-annum",
    //    "input-business-has-valid-bank-acc",
    //    "input-willing-to-participate-in-dsbs-buying-scheme",
    //    "input-operating-in-township-or-village",
    //    "input-enterprise-is-owner-managed",
    //    "select-type-of-business",
    //    "select-asset-type",
    //    "input-description",
    //    "input-model",
    //    "input-new-or-used",
    //    "input-has-natis-certificate",
    //    "date-registration-date",
    //    "input-registered-owner",
    //    "input-title-holder",
    //    "select-year",
    //    "input-serial-vin-chassis-number",
    //    "input-engine-number",
    //    "input-insurer",
    //    "input-purchase-value",
    //    "input-vat",
    //    "input-total",
    //    "select-min-membership",
    //    "input-has-min-shares-savings-of-100k",
    //    "input-has-savings-and-loan-policies",
    //    "input-has-full-functioning-board",
    //    "input-has-min-opp-period-of-6months",
    //    "input-has-proof-of-proper-systems-processes-in-place",
    //    "input-is-outstanding-loan-book-at-least-100K",
    //    "select-max-funding-req",
    //    "input-is-legislation-complient",
    //    "input-provice-pipeline-of-potential-clients-upon-app",
    //    "input-purchase-order-number",
    //    "input-contract-provider-contract-details",
    //    "input-contract-deliverables-desc",
    //    "input-contract-value",
    //    "input-contract-delivery-period",
    //    "input-are-products-locally-procured"
    //];

    class FundingRequirementsPage extends app.wizard.page.Base {
        constructor(id) {
            super(id);
            this.name = 'Funding Requirements Page';
            this.controls = {};
        }

        hideGroups() {
            $('#parent-group-1').hide();
            $('#parent-group-2').hide();
            $('#parent-group-3').hide();
            $('#parent-group-4').hide();
            $('#parent-group-5').hide();
            $('#parent-group-6').hide();
            $('#parent-group-7').hide();
            $('#parent-group-8').hide();
            $('#parent-group-9').hide();
            $('#parent-group-10').hide();
            $('#parent-group-11').hide();
        }

        setHeader(product) {
            $('#funding-requirements-header').text(product);
        }

        validate(data, cb) {
            super.validate(data, cb);
        }

        onValidateField(field, isValid, args) {
            if (field == 'input-owners-contribution') {
                if (isValid == true && args > 0) {
                    $('#source-of-funds-root').show();
                    this.validation.toggleValidators(['select-source-of-funds'], [true]);
                    this.validation.validateField('select-source-of-funds', (name, status) => {
                    });
                } else {
                    $('#source-of-funds-root').hide();
                    this.validation.toggleValidators(['select-source-of-funds'], [false]);
                    this.validation.validateField('select-source-of-funds', (name, status) => {
                    });
                }
            }
        }

        dtoToPage(dto) {
            let self = this;

            function getVal(name) {
                return self.helpers.getNvpValue(dto.data, name, 0);
            }

            function setVal(name, formatCurrency = false) {
                let value = getVal(name);
                let result = self.helpers.RemoveSpaces(value);
                if (formatCurrency == true) {
                    value = self.helpers.formatCurrency(value);
                }
                self.controls[name].val(value);
                return result;
            }

            function setValDefault(name, def) {
                let value = getVal(name);
                let result = self.helpers.RemoveSpaces(value);
                value = (value == '' || value == null) ? def : value;
                self.controls[name].val(value);
                return result;
            }

            function setIntDefault(name, def, total) {
                let value = getVal(name);
                value = parseFloat(value);
                value /= 100.0;
                value *= total;
                value = parseInt(value);
                if (isNaN(value) == true) {
                    return '';
                }
                value = value.toString();
                //let result = self.helpers.RemoveSpaces(value);
                value = (value == '' || value == null) ? def : value;
                self.controls[name].val(value);
                return value;
            }

            function group1() {
                // group-1 : TREP, Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, Co-op development fund, WL or RFI or EU, Micro finance -->
                setVal("input-business-years-in-operation");
                setVal("input-total-number-of-employees");
                setVal("input-number-of-permanent-employees");
                setVal("input-number-of-permanent-youth-employees-under35");
                setVal("input-number-of-permanent-female-employees");
                setVal("input-number-of-permanent-black-employees");
                setVal("input-number-of-new-jobs-created-through-loan");
                setVal("input-number-of-existing-jobs-sustained");

                $('#parent-group-1').show();
            }

            function group2() {
                // group-2 : TREP
                setVal("input-key-suppliers");
                setVal("input-credit-held-with-suppliers");

                $('#parent-group-2').show();
            }

            function group3() {
                // group-3 : TREP, Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, Co - op development fund, WL or RFI or EU, Micro finance-- >
                setValDefault("input-total-number-of-owners", '');
                let total = getVal('input-total-number-of-owners');

                setIntDefault("input-percent-ownership-by-south-africans", '', total);
                setIntDefault("input-percent-black-coloured-indian-pdi", '', total);
                setIntDefault("input-percent-black-south-africans-only", '', total);
                setIntDefault("input-percent-white-only", '', total);
                setIntDefault("input-percent-asian-only", '', total);
                setIntDefault("input-percent-disabled-people", '', total);
                setIntDefault("input-percent-youth-under-35", '', total);
                setIntDefault("input-percent-women-women-any-race", '', total);
                setIntDefault('input-percent-women-black-only', '', total);
                setIntDefault("input-percent-non-south-african-citizens", '', total);
                setIntDefault("input-percent-companies-organisations", '', total);

                $('#parent-group-3').show();
            }

            function group4() {
                // group-4 : TREP, Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, Co - op development fund, WL or RFI or EU, Micro finance-- >
                let value = setVal("input-owners-contribution", true);
                value = parseInt(value);
                if (isNaN(value) == true || value == 0) {
                    $('#source-of-funds-root').hide('fast');
                    self.validation.toggleValidators(['select-source-of-funds'], [false]);
                } else {
                    $('#source-of-funds-root').show('fast');
                    self.validation.toggleValidators(['select-source-of-funds'], [true]);
                }
                setVal("select-source-of-funds");
                setVal("input-business-premises-property-value-of-directors", true);

                $('#parent-group-4').show();
            }

            function group5() {
                // group-5 : Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, WL or RFI or EU, Micro finance-- >
                setVal("input-has-up-to-date-audited-management-accounts");

                $('#parent-group-5').show();
            }

            function group6() {
                // group-6 : Youth challenge fund
                setVal("input-not-funding-for-debt-to-other-lending-institute");
                setVal("input-not-funded-by-other-government-dept-parastal");
                setVal("input-owner-not-government-or-soe-officials");
                setVal("input-not-gaming-pyramid-loan-shark-illegal");
                setVal("input-not-fraud-corruption-records");
                setVal("input-owner-not-un-rehabilitated-insolvent");

                $('#parent-group-6').show();
            }

            function group7() {
                // group-7 : TREP
                setVal("input-business-whole-sa-owned");
                setVal("input-70-perc-employees-south-african-valid-id-docs");
                setVal("input-min-6-months-trading");
                setVal("input-turnover-less-than-r1point5mill-per-annum");
                setVal("input-business-has-valid-bank-acc");
                setVal("input-willing-to-participate-in-dsbs-buying-scheme");
                setVal("input-operating-in-township-or-village");
                setVal("input-enterprise-is-owner-managed");

                setVal("select-type-of-business");

                $('#parent-group-7').show();
            }

            function group8() {
                // group-8 : Asset finance

                //setVal("select-asset-type");
                //
                //setVal("input-description");
                //setVal("input-model");
                //setVal("input-new-or-used");
                //setVal("input-has-natis-certificate");
                //
                //let value = getVal('date-registration-date');
                //$('#date-registration-date').datepicker('update', value);
                //
                //setVal("input-registered-owner");
                //setVal("input-title-holder");
                //setVal("select-year");
                //
                //setVal("input-serial-vin-chassis-number");
                //setVal("input-engine-number");
                //setVal("input-insurer");
                //setVal("input-purchase-value", true);
                //setVal("input-vat", true);
                //setVal("input-total", true);
                //
                //$('#parent-group-8').show();
            }

            function group9() {
                // group-9 : Co - op development fund
                setVal("select-min-membership");
                setVal("input-has-min-shares-savings-of-100k");
                setVal("input-has-savings-and-loan-policies");
                setVal("input-has-full-functioning-board");
                setVal("input-has-min-opp-period-of-6months");
                setVal("input-has-proof-of-proper-systems-processes-in-place");
                setVal("input-is-outstanding-loan-book-at-least-100K");
                setVal("select-max-funding-req");
                setVal("input-is-legislation-complient");
                setVal("input-provice-pipeline-of-potential-clients-upon-app");

                $('#parent-group-9').show();
            }

            function group10() {
                setVal("input-purchase-order-number");
                setVal("input-contract-provider-contract-details");
                setVal("input-contract-deliverables-desc");
                setVal("input-contract-value", true);
                setVal("input-contract-delivery-period");
                setVal("input-are-products-locally-procured");
                $('#parent-group-10').show();
            }

            function group11() {
                setVal("input-do-you-have-a-purchase-order");
                $('#parent-group-11').show();
            }

            function hideGroups() {
                $('#parent-group-1').hide();
                $('#parent-group-2').hide();
                $('#parent-group-3').hide();
                $('#parent-group-4').hide();
                $('#parent-group-5').hide();
                $('#parent-group-6').hide();
                $('#parent-group-7').hide();
                $('#parent-group-8').hide();
                $('#parent-group-9').hide();
                $('#parent-group-10').hide();
                $('#parent-group-11').hide();
            }

            function setHeader(product) {
                $('#funding-requirements-header').text(product);
            }

            function youthChannelFund() {
                self.validation.toggleYouthChallengeFund(true);
                setHeader('Youth Challenge Fund');
                group6();
            }

            function trep(guid) {
                self.validation.toggleTrep(true);
                let header = '';
                switch (guid) {

                    case '626284c39771fd971fa548c2': // Direct lending sub program.
                        header = 'Direct lending';
                        break;
                    case '626284e1f8ecc0f40b8edf00': //TREP
                        header = 'Township, Rural and Entrepreneurial Programme (TREP)';
                        break;
                }
                setHeader(header);
                group1();
                group2();
                group3();
                group4();
                group7();
                //group11();
            }

            function microFinance() {
                self.validation.toggleMicroFinance(true);
                setHeader('Micro Finance');
                group1();
                group3();
                group4();
                group5();
            }

            function godisaLoans() {
                self.validation.toggleGodisa(true);
                setHeader('Godisa Loans');
                group1();
                group3();
                group4();
                group5();
            }

            function WLorRFIorEU(guid) {
                self.validation.toggleWLorRFIorEU(true);
                let header = '';
                switch (guid) {
                    // Channel - Wholesale Lending Channel
                    // Program - Wholesale Lending
                    // Sub-programme - null
                    // Product - null
                    case '62628008f9fce6eea1f8f611': //WL or RFI or EU
                        header = 'Wholesale Lending';
                        break;
                    // Channel - WL
                    // Program - RFI
                    // Sub-programme - RFI Business Loans
                    // Product - null
                    case '6266620183b96943ddf85151': //WL or RFI or EU
                        header = 'RFI Business Loans';
                        break;
                    // Channel - WL
                    // Program - EU ( Change to "Wholesale Lending" )
                    // Sub-programme - null
                    // Product - null
                    case '62628286639e7b9d112e6666': //WL or RFI or EU
                        header = 'Wholesale Lending';
                        break;
                }
                setHeader(header);
                group1();
                group3();
                group4();
                group5();
            }

            function coOpDevelopmentFund() {
                self.validation.toggleCoOpDevelopment(true);
                setHeader('Co-op Development Fund');
                group1();
                group3();
                group4();
                group9();
            }

            function manufactureVeteranDisability(guid) {
                self.validation.toggleManufactureVeteranDisability(true);
                let header = '';
                switch (guid) {
                    case '626662df990a95913a1aa780':
                        header = 'Disability Amavulandlela Funding Scheme';
                        break;
                    // Channel - DL
                    // Program - Manufacturing Support Programme
                    // Sub-programme - null
                    // Product - null
                    case '62628556e79a488f50c98bc2': //ManufactureVeteranDisability
                        header = 'Manufacturing Support Programme';
                        break;
                    // Channel - DL
                    // Program - Direct Lending
                    // Sub-programme - Veteran Inyamanzane Funding Scheme
                    // Product - null
                    case '62666292443c96e336e77adb': //ManufactrueVeteranDisability
                        header = 'Veteran Inyamanzane Funding Scheme';
                        break;
                }

                setHeader(header);
                group1();
                group3();
                group4();
                group5();
            }

            function bridgingLoan() {
                self.validation.toggleBridgingLoan(true);
                setHeader('Bridging Loan');
                group1();
                group3();
                group4();
                group5();
                group10();
            }

            function purchaseOrder() {
                self.validation.togglePurchaseOrder(true);
                setHeader('Purchase Order');
                group1();
                group3();
                group4();
                group5();
                group10();
                group11();
            }

            function assetFinance() {
                self.validation.toggleAssetFinance(true);
                setHeader('Asset Finance');
                group1();
                group3();
                group4();
                group5();

                //group8();

                //group1();
                //group2();
                //group3();
                //group4();
                //group5();
                //group6();
                //group7();
                //group8();
                //group9();
                //group10();
            }

            function revolvingLoan() {
                self.validation.toggleRevolvingLoan(true);
                setHeader('Revolving Loan');
                group1();
                group3();
                group4();
                group5();
            }

            function termLoan() {
                self.validation.toggleTermLoan(true);
                setHeader('Term Loan');
                group1();
                group3();
                group4();
                group5();
            }

            (function () {
                let listId = getVal('product-fit-guid');
                hideGroups();
                self.validation.toggleAll(false);

                if (dto.partial == false) {
                    group1();
                    group2();
                    group3();
                    group4();
                    group5();
                    group6();
                    group7();
                    //group8();
                    group9();
                    group10();
                } else {
                    switch (listId) {
                        case '6262851b4a757c7ed1f3097f': //Youth channel fund
                            // Channel - DL
                            // Program - Youth Channel Fund.
                            // Sub-programme - null.
                            // Product - null.
                            youthChannelFund();
                            break;

                        case '626284c39771fd971fa548c2': // Direct lending sub program.
                        case '626284e1f8ecc0f40b8edf00': //TREP
                            // Channel - DL
                            // Program - TREP
                            // Sub-programme - null
                            // Product - null
                            trep(listId);
                            break;

                        // Channel - Wholesale Lending Channel
                        // Program - Wholesale Lending
                        // Sub-programme - null
                        // Product - null
                        case '62628008f9fce6eea1f8f611': //WL or RFI or EU
                        // Channel - WL
                        // Program - RFI
                        // Sub-programme - RFI Business Loans
                        // Product - null
                        case '6266620183b96943ddf85151': //WL or RFI or EU
                        // Channel - WL
                        // Program - EU ( Change to "Wholesale Lending" )
                        // Sub-programme - null
                        // Product - null
                        case '62628286639e7b9d112e6666': //WL or RFI or EU
                            WLorRFIorEU(listId);
                            break;

                        case '6266644706b2c31359cd102f': //Revolving loan
                            // Channel - DL
                            // Program - Direct Lending
                            // Sub-programme - Direct Lending Loans
                            // Product - Revolving Loan
                            revolvingLoan();
                            break;

                        case '626663ff9d63e9cf83e4126a': //Asset finance
                            // Channel - DL
                            // Program - Direct Lending.
                            // Sub-programme - Direct Lending Loans
                            // Product - Asset Finance
                            assetFinance();
                            break;

                        case '626663b9b8ac31dfde290063': //Bridging loan
                            // Channel - DL
                            // Program - Direct Lending.
                            // Sub-programme - Direct lending loans.
                            // Product - Bridging Loan.
                            bridgingLoan();
                            break;

                        case '63232c9e0bd9ef3f1a8e3b82': //Purchase order
                            // Channel - DL
                            // Program - Direct Lending.
                            // Sub-programme - Direct lending loans.
                            // Product - Bridging Loan.
                            purchaseOrder();
                            break;

                        case '626662df990a95913a1aa780':
                        // Channel - DL
                        // Program - Manufacturing Support Programme
                        // Sub-programme - null
                        // Product - null
                        case '62628556e79a488f50c98bc2': //ManufactureVeteranDisability
                        // Channel - DL
                        // Program - Direct Lending
                        // Sub-programme - Veteran Inyamanzane Funding Scheme
                        // Product - null
                        case '62666292443c96e336e77adb': //ManufactrueVeteranDisability
                            manufactureVeteranDisability(listId);
                            break;

                        case '62666479ae31305e9e16f2fe': //Term loan
                            // Channel - DL
                            // Program - Direct Lending
                            // Sub-programme - Direct Lending Loans
                            // Product - Term Loan
                            termLoan();
                            break;

                        case '626661851c7472bd5d1ee51c': //Godisa loans
                            // Channel - WL
                            // Program - Specialized funds
                            // Sub-programme - Godisa Loans
                            // Product - null
                            godisaLoans();
                            break;

                        case '626282d9530062eea92b5b18': //Co - op development fund
                            // Channel - WL
                            // Program - Co-Op Development Fund
                            // Sub-programme - null
                            // Product - null
                            coOpDevelopmentFund();
                            break;

                        case '626282bbbf0a95435552dbeb': //Micro Finance
                            // Channel - WL
                            // Program - Micro Finance
                            // Sub-programme - null
                            // Product - null
                            microFinance();
                            break;
                    }
                }
            })();
        }

        serialize() {
            let arr = super.serialize();
            let date = $('#date-registration-date').datepicker('getDate');
            arr.push({
                name: 'date-registration-date',
                value: date == null ? '' : self.helpers.formatDate(date)
            });
            return arr;
        }

        pageToDto(dto) {
        }

        reset() {
        }

        // Very important to initialize all controls on load because of the partial save from one page to the next.
        load(args, cb) {
            this.model = args;
            let mc = JSON.parse(this.model.application.application.matchCriteriaJson);
            let dto = {
                data: this.helpers.nvpArrayToObject(mc),
                partial: true
            };
            this.dtoToPage(dto);

            //this.programProductFit();

            cb(app.wizard.addResult());
        }

        save(cb) {
            cb(app.wizard.addResult());
        }

        attentionHidden(args, cb) {
            // TODO: Not ok to usethe model here!!!
            if (args.isNext == true) {
                let mc = JSON.parse(this.model.application.application.matchCriteriaJson);

                let dto = {
                    data: this.helpers.nvpArrayToObject(mc),
                    partial: true
                };

                this.dtoToPage(dto);
            }
            cb(app.wizard.addResult());
        }

        attention(data, cb) {
            cb(app.wizard.addResult());
        }

        addControls() {
            let self = this;

            function formatCurrency(val) {
                return self.helpers.formatCurrency(val);
            };

            function addControl(name, type) {
                switch (type) {
                    case 'input':
                        self.controls[name] = app.control.input(name, name);
                        break;

                    case 'select':
                        self.controls[name] = app.control.select(name, name);
                        break;

                    case 'radio':
                        self.controls[name] = app.control.radio(name, name);
                        break;

                    default:
                        return null;
                }
                return self.controls[name];
            }

            // group-1 : TREP, Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, Co-op development fund, WL or RFI or EU, Micro finance -->
            let control = null;
            control = addControl("input-business-years-in-operation", "input");
            control.format(4);

            control = addControl("input-total-number-of-employees", "input");
            control.format(4);

            control = addControl("input-number-of-permanent-employees", "input");
            control.format(4);

            control = addControl("input-number-of-permanent-youth-employees-under35", "input");
            control.format(4);

            control = addControl("input-number-of-permanent-female-employees", "input");
            control.format(4);

            control = addControl("input-number-of-permanent-black-employees", "input");
            control.format(4);

            control = addControl("input-number-of-new-jobs-created-through-loan", "input");
            control.format(4);

            control = addControl("input-number-of-existing-jobs-sustained", "input");
            control.format(4);

            // group-2 : TREP
            control = addControl("input-key-suppliers", "input");
            control = addControl("select-type-of-business", "select");

            let arr = this.listItems.getTypeOfBusiness();
            control.fill(arr);

            control = addControl("input-credit-held-with-suppliers", "input");
            control.format(8, formatCurrency);

            // group-3 : TREP, Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, Co - op development fund, WL or RFI or EU, Micro finance-- >
            control = addControl("input-percent-ownership-by-south-africans", "input");
            control.format(5);

            control = addControl("input-percent-black-coloured-indian-pdi", "input");
            control.format(5);

            control = addControl("input-percent-black-south-africans-only", "input");
            control.format(5);

            control = addControl("input-percent-white-only", "input");
            control.format(5);

            control = addControl("input-percent-asian-only", "input");
            control.format(5);

            control = addControl("input-percent-disabled-people", "input");
            control.format(5);

            control = addControl("input-percent-youth-under-35", "input");
            control.format(5);

            control = addControl("input-percent-women-women-any-race", "input");
            control.format(5);

            control = addControl("input-percent-women-black-only", "input");
            control.format(5);

            control = addControl("input-percent-non-south-african-citizens", "input");
            control.format(5);

            control = addControl("input-percent-companies-organisations", "input");
            control.format(5);

            control = addControl("input-total-number-of-owners", "input");
            control.format(5);

            // group-4 : TREP, Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, Co - op development fund, WL or RFI or EU, Micro finance-- >

            control = addControl("input-owners-contribution", "input");
            control.format(10, formatCurrency);

            control = addControl("select-source-of-funds", "select");
            // TODO: Get from list items!!!
            arr = this.listItems.getSourceOfFunds();
            //$('#select-source-of-funds').selectpicker();
            control.fill(arr);
            //$('#select-source-of-funds').selectpicker('refresh');

            control = addControl("input-business-premises-property-value-of-directors", "input");
            control.format(10, formatCurrency);

            // group-5 : Revolving loan, Asset finance, Bridging loan, ManufactureVeteranDisability, Term loan, Godisa, WL or RFI or EU, Micro finance-- >

            addControl("input-has-up-to-date-audited-management-accounts", "radio");

            // group-6 : Youth challenge fund

            addControl("input-not-funding-for-debt-to-other-lending-institute", "radio");
            addControl("input-not-funded-by-other-government-dept-parastal", "radio");
            addControl("input-owner-not-government-or-soe-officials", "radio");
            addControl("input-not-gaming-pyramid-loan-shark-illegal", "radio");
            addControl("input-not-fraud-corruption-records", "radio");
            addControl("input-owner-not-un-rehabilitated-insolvent", "radio");

            // group-7 : TREP

            addControl("input-business-whole-sa-owned", "radio");
            addControl("input-70-perc-employees-south-african-valid-id-docs", "radio");
            addControl("input-min-6-months-trading", "radio");
            addControl("input-turnover-less-than-r1point5mill-per-annum", "radio");
            addControl("input-business-has-valid-bank-acc", "radio");
            addControl("input-willing-to-participate-in-dsbs-buying-scheme", "radio");
            addControl("input-operating-in-township-or-village", "radio");
            addControl("input-enterprise-is-owner-managed", "radio");

            // group-8 : Asset finance

            //control = addControl("select-asset-type", "select");
            //
            //arr = this.listItems.getAssetType();
            //control.fill(arr);
            //control.val('');
            //
            //addControl("input-description", "input");
            //addControl("input-model", "input");
            //addControl("input-new-or-used", "radio");
            //addControl("input-has-natis-certificate", "radio");
            //
            //const START_DATE = '01/01/1950';
            //const END_DATE = '01/01/2099';
            //
            //$('#date-registration-date').datepicker({
            //    format: 'dd/mm/yyyy',
            //    clearBtn: false,
            //    autoclose: true,
            //    startDate: START_DATE,
            //    endDate: END_DATE
            //});
            //
            //addControl("input-registered-owner", "input");
            //addControl("input-title-holder", "input");
            //
            //control = addControl("select-year", "select");
            //// TODO: Get from list items!!!
            //arr = [];
            //let yearMax = (new Date()).getFullYear();
            //for (let year = 1950, max = yearMax; year <= max; year++) {
            //    let temp = year.toString();
            //    arr.push({
            //        value: temp,
            //        text: temp
            //    });
            //}
            //control.fill(arr);
            //control.val('');
            ////$('#select-year').selectpicker('refresh');
            //
            //control = addControl("input-serial-vin-chassis-number", "input");
            //control = addControl("input-engine-number", "input");
            //control = addControl("input-insurer", "input");
            //
            //control = addControl("input-purchase-value", "input");
            //control.format(10, formatCurrency);
            //
            //control = addControl("input-vat", "input");
            //control.format(10, formatCurrency);
            //
            //control = addControl("input-total", "input");
            //control.format(10, formatCurrency);

            // group-9 : Co - op development fund
            control = addControl("select-min-membership", "select");

            arr = this.listItems.getMinMembershipReq();

            control.fill(arr);
            control.val('');

            addControl("input-has-min-shares-savings-of-100k", "radio");
            addControl("input-has-savings-and-loan-policies", "radio");
            addControl("input-has-full-functioning-board", "radio");
            addControl("input-has-min-opp-period-of-6months", "radio");
            addControl("input-has-proof-of-proper-systems-processes-in-place", "radio");
            addControl("input-is-outstanding-loan-book-at-least-100K", "radio");

            control = addControl("select-max-funding-req", "select");
            arr = this.listItems.getMaxFundingReq();

            control.fill(arr);
            control.val('');

            addControl("input-is-legislation-complient", "radio");
            addControl("input-provice-pipeline-of-potential-clients-upon-app", "radio");

            // group-10 : Bridgin loan
            addControl("input-purchase-order-number", 'input');

            addControl("input-contract-provider-contract-details", 'input');

            addControl("input-contract-deliverables-desc", 'input');

            control = addControl("input-contract-value", 'input');
            control.format(10, formatCurrency);

            control = addControl("input-contract-delivery-period", 'input');
            control.format(10);

            addControl("input-are-products-locally-procured", 'radio');

            // group-11 : Purchase Order
            addControl("input-do-you-have-a-purchase-order", "radio");
        }

        addHandlers() {
            let self = this;
        }
    }

    page.getFundingRequirementsPage = function (id) {
        return new FundingRequirementsPage(id);
    }
})(app.wizard.page);
