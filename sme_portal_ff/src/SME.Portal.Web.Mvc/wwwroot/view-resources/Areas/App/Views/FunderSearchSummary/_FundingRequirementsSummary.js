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
    let _countryName = {
        AF: 'Afghanistan',
        AX: 'Åland Islands',
        AL: 'Albania',
        DZ: 'Algeria',
        AS: 'American Samoa',
        AD: 'Andorra',
        AO: 'Angola',
        AI: 'Anguilla',
        AQ: 'Antarctica',
        AG: 'Antigua and Barbuda',
        AR: 'Argentina',
        AM: 'Armenia',
        AW: 'Aruba',
        AU: 'Australia',
        AT: 'Austria',
        AZ: 'Azerbaijan',
        BS: 'Bahamas',
        BH: 'Bahrain',
        BD: 'Bangladesh',
        BB: 'Barbados',
        BY: 'Belarus',
        BE: 'Belgium',
        BZ: 'Belize',
        BJ: 'Benin',
        BM: 'Bermuda',
        BT: 'Bhutan',
        BO: 'Bolivia, Plurinational State of',
        BQ: 'Bonaire, Sint Eustatius and Saba',
        BA: 'Bosnia and Herzegovina',
        BW: 'Botswana',
        BV: 'Bouvet Island',
        BR: 'Brazil',
        IO: 'British Indian Ocean Territory',
        BN: 'Brunei Darussalam',
        BG: 'Bulgaria',
        BF: 'Burkina Faso',
        BI: 'Burundi',
        KH: 'Cambodia',
        CM: 'Cameroon',
        CA: 'Canada',
        CV: 'Cape Verde',
        KY: 'Cayman Islands',
        CF: 'Central African Republic',
        TD: 'Chad',
        CL: 'Chile',
        CN: 'China',
        CX: 'Christmas Island',
        CC: 'Cocos (Keeling) Islands',
        CO: 'Colombia',
        KM: 'Comoros',
        CG: 'Congo',
        CD: 'Congo, the Democratic Republic of the',
        CK: 'Cook Islands',
        CR: 'Costa Rica',
        CI: 'Côte d\'Ivoire',
        HR: 'Croatia',
        CU: 'Cuba',
        CW: 'Curaçao',
        CY: 'Cyprus',
        CZ: 'Czech Republic',
        DK: 'Denmark',
        DJ: 'Djibouti',
        DM: 'Dominica',
        DO: 'Dominican Republic',
        EC: 'Ecuador',
        EG: 'Egypt',
        SV: 'El Salvador',
        GQ: 'Equatorial Guinea',
        ER: 'Eritrea',
        EE: 'Estonia',
        ET: 'Ethiopia',
        FK: 'Falkland Islands (Malvinas)',
        FO: 'Faroe Islands',
        FJ: 'Fiji',
        FI: 'Finland',
        FR: 'France',
        GF: 'French Guiana',
        PF: 'French Polynesia',
        TF: 'French Southern Territories',
        GA: 'Gabon',
        GM: 'Gambia',
        GE: 'Georgia',
        DE: 'Germany',
        GH: 'Ghana',
        GI: 'Gibraltar',
        GR: 'Greece',
        GL: 'Greenland',
        GD: 'Grenada',
        GP: 'Guadeloupe',
        GU: 'Guam',
        GT: 'Guatemala',
        GG: 'Guernsey',
        GN: 'Guinea',
        GW: 'Guinea-Bissau',
        GY: 'Guyana',
        HT: 'Haiti',
        HM: 'Heard Island and McDonald Islands',
        VA: 'Holy See (Vatican City State)',
        HN: 'Honduras',
        HK: 'Hong Kong',
        HU: 'Hungary',
        IS: 'Iceland',
        IN: 'India',
        ID: 'Indonesia',
        IR: 'Iran, Islamic Republic of',
        IQ: 'Iraq',
        IE: 'Ireland',
        IM: 'Isle of Man',
        IL: 'Israel',
        IT: 'Italy',
        JM: 'Jamaica',
        JP: 'Japan',
        JE: 'Jersey',
        JO: 'Jordan',
        KZ: 'Kazakhstan',
        KE: 'Kenya',
        KI: 'Kiribati',
        KP: 'Korea, Democratic People\'s Republic of',
        KR: 'Korea, Republic of',
        KW: 'Kuwait',
        KG: 'Kyrgyzstan',
        LA: 'Lao People\'s Democratic Republic',
        LV: 'Latvia',
        LB: 'Lebanon',
        LS: 'Lesotho',
        LR: 'Liberia',
        LY: 'Libya',
        LI: 'Liechtenstein',
        LT: 'Lithuania',
        LU: 'Luxembourg',
        MO: 'Macao',
        MK: 'Macedonia, the former Yugoslav Republic of',
        MG: 'Madagascar',
        MW: 'Malawi',
        MY: 'Malaysia',
        MV: 'Maldives',
        ML: 'Mali',
        MT: 'Malta',
        MH: 'Marshall Islands',
        MQ: 'Martinique',
        MR: 'Mauritania',
        MU: 'Mauritius',
        YT: 'Mayotte',
        MX: 'Mexico',
        FM: 'Micronesia, Federated States of',
        MD: 'Moldova, Republic of',
        MC: 'Monaco',
        MN: 'Mongolia',
        ME: 'Montenegro',
        MS: 'Montserrat',
        MA: 'Morocco',
        MZ: 'Mozambique',
        MM: 'Myanmar',
        NA: 'Namibia',
        NR: 'Nauru',
        NP: 'Nepal',
        NL: 'Netherlands',
        NC: 'New Caledonia',
        NZ: 'New Zealand',
        NI: 'Nicaragua',
        NE: 'Niger',
        NG: 'Nigeria',
        NU: 'Niue',
        NF: 'Norfolk Island',
        MP: 'Northern Mariana Islands',
        NO: 'Norway',
        OM: 'Oman',
        PK: 'Pakistan',
        PW: 'Palau',
        PS: 'Palestinian Territory, Occupied',
        PA: 'Panama',
        PG: 'Papua New Guinea',
        PY: 'Paraguay',
        PE: 'Peru',
        PH: 'Philippines',
        PN: 'Pitcairn',
        PL: 'Poland',
        PT: 'Portugal',
        PR: 'Puerto Rico',
        QA: 'Qatar',
        RE: 'Réunion',
        RO: 'Romania',
        RU: 'Russian Federation',
        RW: 'Rwanda',
        BL: 'Saint Barthélemy',
        SH: 'Saint Helena, Ascension and Tristan da Cunha',
        KN: 'Saint Kitts and Nevis',
        LC: 'Saint Lucia',
        MF: 'Saint Martin (French part)',
        PM: 'Saint Pierre and Miquelon',
        VC: 'Saint Vincent and the Grenadines',
        WS: 'Samoa',
        SM: 'San Marino',
        ST: 'Sao Tome and Principe',
        SA: 'Saudi Arabia',
        SN: 'Senegal',
        RS: 'Serbia',
        SC: 'Seychelles',
        SL: 'Sierra Leone',
        SG: 'Singapore',
        SX: 'Sint Maarten (Dutch part)',
        SK: 'Slovakia',
        SI: 'Slovenia',
        SB: 'Solomon Islands',
        SO: 'Somalia',
        ZA: 'South Africa',
        GS: 'South Georgia and the South Sandwich Islands',
        SS: 'South Sudan',
        ES: 'Spain',
        LK: 'Sri Lanka',
        SD: 'Sudan',
        SR: 'Suriname',
        SJ: 'Svalbard and Jan Mayen',
        SZ: 'Swaziland',
        SE: 'Sweden',
        CH: 'Switzerland',
        SY: 'Syrian Arab Republic',
        TW: 'Taiwan, Province of China',
        TJ: 'Tajikistan',
        TZ: 'Tanzania, United Republic of',
        TH: 'Thailand',
        TL: 'Timor-Leste',
        TG: 'Togo',
        TK: 'Tokelau',
        TO: 'Tonga',
        TT: 'Trinidad and Tobago',
        TN: 'Tunisia',
        TR: 'Turkey',
        TM: 'Turkmenistan',
        TC: 'Turks and Caicos Islands',
        TV: 'Tuvalu',
        UG: 'Uganda',
        UA: 'Ukraine',
        AE: 'United Arab Emirates',
        GB: 'United Kingdom',
        US: 'United States',
        UM: 'United States Minor Outlying Islands',
        UY: 'Uruguay',
        UZ: 'Uzbekistan',
        VU: 'Vanuatu',
        VE: 'Venezuela, Bolivarian Republic of',
        VN: 'Viet Nam',
        VG: 'Virgin Islands, British',
        VI: 'Virgin Islands, U.S.',
        WF: 'Wallis and Futuna',
        EH: 'Western Sahara',
        YE: 'Yemen',
        ZM: 'Zambia',
        ZW: 'Zimbabwe'
    };

    function getCountryName(code) {
        if (_countryName.hasOwnProperty(code) == true) {
            return _countryName[code];
        } else {
            return 'Unknown Country';
        }
    }

    // FundingRequirement ( _FinanceForSelector.cshtml )
    const financefor = 'financefor';
    const loanamount = 'loanamount';
    const assetfinancetype = 'assetfinancetype';
    const buyingbusinesspropertyvalue = 'buyingbusinesspropertyvalue';
    const buyingbusinesspropertytype = 'buyingbusinesspropertytype';
    const propertydevelopmenttype = 'propertydevelopmenttype';
    const shopfittingpropbonded = 'shopfittingpropbonded';
    const shopfittingpropertyvalue = 'shopfittingpropertyvalue';
    const shopfittingpropertytype = 'shopfittingpropertytype';
    // Growth finance types
    const growthfinancetype = 'growthfinancetype';
    const willingtosellshares = 'willingtosellshares';
    const largepotentialmarket = 'largepotentialmarket';
    const customersbuying = 'customersbuying';
    const businessexpansioncompetitiveadv = 'businessexpansioncompetitiveadv';
    const businessexpansionresultinincreasedemployees = 'businessexpansionresultinincreasedemployees';
    const businessexpansionresultinincreasedprofitability = 'businessexpansionresultinincreasedprofitability';
    const businessexpansionresultinincreasedexports = 'businessexpansionresultinincreasedexports';
    const businessexpansionresultineconomicempowerment = 'businessexpansionresultineconomicempowerment';
    const businessexpansionresultinsustainabledev = 'businessexpansionresultinsustainabledev';
    const businessexpansionresultinsolveenvchallenges = 'businessexpansionresultinsolveenvchallenges';
    const productserviceexpansiontype = 'productserviceexpansiontype';
    // Working capital types
    const workingcapitaltype = 'workingcapitaltype';
    const cashforaninvoiceamount = 'cashforaninvoiceamount';
    const cashforinvoicecustomer = 'cashforinvoicecustomer';
    const customeragreed = 'customeragreed';
    const hasposdevice = 'hasposdevice';
    const regularmonthlyincome = 'regularmonthlyincome';
    const monthlyincomeincomevalue = 'monthlyincomeincomevalue';
    const cardmachinepaymenttypes = 'cardmachinepaymenttypes';
    const moneyforcontractvalue = 'moneyforcontractvalue';
    const moneyforcontractcustomer = 'moneyforcontractcustomer';
    const moneyforcontractcompanyexperience = 'moneyforcontractcompanyexperience';
    const moneyfortendervalue = 'moneyfortendervalue';
    const moneyfortendercustomer = 'moneyfortendercustomer';
    const moneyfortendercompanyexperience = 'moneyfortendercompanyexperience';
    const purchaseordervalue = 'purchaseordervalue';
    const purchaseordercustomer = 'purchaseordercustomer';
    const purchaseordercustomerexperience = 'purchaseordercustomerexperience';
    // Framchise acquisition types
    const franchiseacquisitiontype = 'franchiseacquisitiontype';
    const buyingafranchisefranchiseaccredited = 'buyingafranchisefranchiseaccredited';
    const preapprovedbyfranchisor = 'preapprovedbyfranchisor';
    const beepartnerfranchiseaccredited = 'beepartnerfranchiseaccredited';

    const industrySector = 'industry-sector';
    const industrySubSector = 'industry-sub-sector';

    const fundingtobuyanexistingbusinesstype = 'fundingtobuyanexistingbusinesstype';
    const businesslocatedinruralarea = 'businesslocatedinruralarea';
    const shareholdinggreaterthanperc = 'shareholdinggreaterthanperc';
    // Research innovation funding types
    const researchinnovationfundingtype = 'researchinnovationfundingtype';
    const commresstudentstatus = 'commresstudentstatus';
    const commreswillincexports = 'commreswillincexports';
    const commresresultinjobcreation = 'commresresultinjobcreation';
    const commresintroinnov = 'commresintroinnov';
    const commresindustries = 'commresindustries';
    const researchtakingplaceinuniversity = 'researchtakingplaceinuniversity';
    const researchfieldofresearchtype = 'researchfieldofresearchtype';
    // Other funding types
    const otherfinancetype = 'otherfinancetype';
    const willworkgenerate50newjobs = 'willworkgenerate50newjobs';
    const doyouhavecontractsforbps = 'doyouhavecontractsforbps';
    const will80percofjobsbeforyouth = 'will80percofjobsbeforyouth';
    const otherfinanceexportindustry = 'otherfinanceexportindustry';
    const exportcountry = 'exportcountry';
    const needingtoconductintmarketresearch = 'needingtoconductintmarketresearch';
    const haveconfirmedorders = 'haveconfirmedorders';
    const otherfinanceimportindustry = 'otherfinanceimportindustry';
    const importcountry = 'importcountry';
    const havesignedcontracts = 'havesignedcontracts';
    const workinruralareas = 'workinruralareas';
    const resultinemploymentsavejobs = 'resultinemploymentsavejobs';
    const workwithpeoplewithdisabilities = 'workwithpeoplewithdisabilities';
    const willprojectimprovehealthcare = 'willprojectimprovehealthcare';
    const willgenerateincomeinimpoverishedareas = 'willgenerateincomeinimpoverishedareas';
    const willgenerateincreasedexportvalue = 'willgenerateincreasedexportvalue';

    let _fundingRequirement = {};
    // FundingRequirement ( _FinanceForSelector.cshtml )
    _fundingRequirement[financefor] = { control: app.json.radio(financefor), parentId: '59c2c6a37c83b736d463c250' };
    _fundingRequirement[loanamount] = { control: app.json.input(loanamount), parentId: '' };
    _fundingRequirement[assetfinancetype] = { control: app.json.select(assetfinancetype), parentId: '59c35d64463361150873b641' };
    _fundingRequirement[buyingbusinesspropertyvalue] = { control: app.json.input(buyingbusinesspropertyvalue), parentId: '' };
    _fundingRequirement[buyingbusinesspropertytype] = { control: app.json.select(buyingbusinesspropertytype), parentId: '5a6f0a36cb0d114734ecf1fe' };
    _fundingRequirement[propertydevelopmenttype] = { control: app.json.select(propertydevelopmenttype), parentId: '5a6f0afacb0d114734ecf1ff' };
    _fundingRequirement[shopfittingpropbonded] = { control: app.json.radio(shopfittingpropbonded), parentId: '' };
    _fundingRequirement[shopfittingpropertyvalue] = { control: app.json.input(shopfittingpropertyvalue), parentId: '' };
    _fundingRequirement[shopfittingpropertytype] = { control: app.json.select(shopfittingpropertytype), parentId: '5a6f0a36cb0d114734ecf1fe' };
    // Growth finance types
    _fundingRequirement[growthfinancetype] = { control: app.json.select(growthfinancetype), parentId: '59c5d92b5eac2311202772f5' };
    _fundingRequirement[willingtosellshares] = { control: app.json.radio(willingtosellshares), parentId: '' };
    _fundingRequirement[largepotentialmarket] = { control: app.json.radio(largepotentialmarket), parentId: '' };
    _fundingRequirement[customersbuying] = { control: app.json.radio(customersbuying), parentId: '' };
    _fundingRequirement[businessexpansioncompetitiveadv] = { control: app.json.select(businessexpansioncompetitiveadv), parentId: '59ec85401b37792024771d41' };
    _fundingRequirement[businessexpansionresultinincreasedemployees] = { control: app.json.radio(businessexpansionresultinincreasedemployees), parentId: '' };
    _fundingRequirement[businessexpansionresultinincreasedprofitability] = { control: app.json.radio(businessexpansionresultinincreasedprofitability), parentId: '' };
    _fundingRequirement[businessexpansionresultinincreasedexports] = { control: app.json.radio(businessexpansionresultinincreasedexports), parentId: '' };
    _fundingRequirement[businessexpansionresultineconomicempowerment] = { control: app.json.radio(businessexpansionresultineconomicempowerment), parentId: '' };
    _fundingRequirement[businessexpansionresultinsustainabledev] = { control: app.json.radio(businessexpansionresultinsustainabledev), parentId: '' };
    _fundingRequirement[businessexpansionresultinsolveenvchallenges] = { control: app.json.radio(businessexpansionresultinsolveenvchallenges), parentId: '' };
    _fundingRequirement[productserviceexpansiontype] = { control: app.json.select(productserviceexpansiontype), parentId: '5a7a7afe646a451744bca3b4' };
    // Working capital types
    _fundingRequirement[workingcapitaltype] = { control: app.json.select(workingcapitaltype), parentId: '59c2c6b37c83b736d463c251' };
    _fundingRequirement[cashforaninvoiceamount] = { control: app.json.input(cashforaninvoiceamount), parentId: '' };
    _fundingRequirement[cashforinvoicecustomer] = { control: app.json.select(cashforinvoicecustomer), parentId: '59db18348964a744e4ad0aa7' };
    _fundingRequirement[customeragreed] = { control: app.json.radio(customeragreed), parentId: '' };
    _fundingRequirement[hasposdevice] = { control: app.json.radio(hasposdevice), parentId: '' };
    _fundingRequirement[regularmonthlyincome] = { control: app.json.radio(regularmonthlyincome), parentId: '' };
    _fundingRequirement[monthlyincomeincomevalue] = { control: app.json.input(monthlyincomeincomevalue), parentId: '' };
    _fundingRequirement[cardmachinepaymenttypes] = { control: app.json.checkbox(cardmachinepaymenttypes), parentId: '59d370517112ea2ef072eec7' };
    _fundingRequirement[moneyforcontractvalue] = { control: app.json.input(moneyforcontractvalue), parentId: '' };
    _fundingRequirement[moneyforcontractcustomer] = { control: app.json.select(moneyforcontractcustomer), parentId: '59db18348964a744e4ad0aa7' };
    _fundingRequirement[moneyforcontractcompanyexperience] = { control: app.json.radio(moneyforcontractcompanyexperience), parentId: '' };
    _fundingRequirement[moneyfortendervalue] = { control: app.json.input(moneyfortendervalue), parentId: '' };
    _fundingRequirement[moneyfortendercustomer] = { control: app.json.select(moneyfortendercustomer), parentId: '59db18348964a744e4ad0aa7' };
    _fundingRequirement[moneyfortendercompanyexperience] = { control: app.json.radio(moneyfortendercompanyexperience), parentId: '' };
    _fundingRequirement[purchaseordervalue] = { control: app.json.input(purchaseordervalue), parentId: '' };
    _fundingRequirement[purchaseordercustomer] = { control: app.json.select(purchaseordercustomer), parentId: '59db18348964a744e4ad0aa7' };
    _fundingRequirement[purchaseordercustomerexperience] = { control: app.json.radio(purchaseordercustomerexperience), parentId: '' };
    // Framchise acquisition types
    _fundingRequirement[franchiseacquisitiontype] = { control: app.json.select(franchiseacquisitiontype), parentId: '59c2c6f77c83b736d463c254' };
    _fundingRequirement[buyingafranchisefranchiseaccredited] = { control: app.json.radio(buyingafranchisefranchiseaccredited), parentId: '' };
    _fundingRequirement[preapprovedbyfranchisor] = { control: app.json.radio(preapprovedbyfranchisor), parentId: '' };
    _fundingRequirement[beepartnerfranchiseaccredited] = { control: app.json.radio(beepartnerfranchiseaccredited), parentId: '' };
    _fundingRequirement[industrySector] = { control: app.json.select(industrySector), parentId: '' };
    _fundingRequirement[industrySubSector] = { control: app.json.select(industrySubSector), parentId: '' };
    _fundingRequirement[fundingtobuyanexistingbusinesstype] = { control: app.json.select(fundingtobuyanexistingbusinesstype), parentId: '59d2ed3839b41c2b749a03d9' };
    _fundingRequirement[businesslocatedinruralarea] = { control: app.json.radio(businesslocatedinruralarea), parentId: '' };
    _fundingRequirement[shareholdinggreaterthanperc] = { control: app.json.radio(shareholdinggreaterthanperc), parentId: '' };
    // Research innovation funding types
    _fundingRequirement[researchinnovationfundingtype] = { control: app.json.select(researchinnovationfundingtype), parentId: '59c5d95c5eac2311202772f6' };
    _fundingRequirement[commresstudentstatus] = { control: app.json.radio(commresstudentstatus), parentId: '' };
    _fundingRequirement[commreswillincexports] = { control: app.json.radio(commreswillincexports), parentId: '' };
    _fundingRequirement[commresresultinjobcreation] = { control: app.json.radio(commresresultinjobcreation), parentId: '' };
    _fundingRequirement[commresintroinnov] = { control: app.json.radio(commresintroinnov), parentId: '' };
    _fundingRequirement[commresindustries] = { control: app.json.selectmulti(commresindustries), parentId: '5a8288d5c053780e8c1eb731' };
    _fundingRequirement[researchtakingplaceinuniversity] = { control: app.json.radio(researchtakingplaceinuniversity), parentId: '' };
    _fundingRequirement[researchfieldofresearchtype] = { control: app.json.select(researchfieldofresearchtype), parentId: '5b1fa3a5b958c008605883e1' };
    // Other funding types
    _fundingRequirement[otherfinancetype] = { control: app.json.select(otherfinancetype), parentId: '59c5d96b5eac2311202772f7' };
    _fundingRequirement[willworkgenerate50newjobs] = { control: app.json.radio(willworkgenerate50newjobs), parentId: '' };
    _fundingRequirement[doyouhavecontractsforbps] = { control: app.json.radio(doyouhavecontractsforbps), parentId: '' };
    _fundingRequirement[will80percofjobsbeforyouth] = { control: app.json.radio(will80percofjobsbeforyouth), parentId: '' };
    _fundingRequirement[otherfinanceexportindustry] = { control: app.json.selectmulti(otherfinanceexportindustry), parentId: '5a8288d5c053780e8c1eb731' };
    _fundingRequirement[exportcountry] = { control: app.json.select(exportcountry), parentId: '' };
    _fundingRequirement[needingtoconductintmarketresearch] = { control: app.json.radio(needingtoconductintmarketresearch), parentId: '' };
    _fundingRequirement[haveconfirmedorders] = { control: app.json.radio(haveconfirmedorders), parentId: '' };
    _fundingRequirement[otherfinanceimportindustry] = { control: app.json.selectmulti(otherfinanceimportindustry), parentId: '5a8288d5c053780e8c1eb731' };
    _fundingRequirement[importcountry] = { control: app.json.select(importcountry), parentId: '' };
    _fundingRequirement[havesignedcontracts] = { control: app.json.radio(havesignedcontracts), parentId: '' };
    _fundingRequirement[workinruralareas] = { control: app.json.radio(workinruralareas), parentId: '' };
    _fundingRequirement[resultinemploymentsavejobs] = { control: app.json.radio(resultinemploymentsavejobs), parentId: '' };
    _fundingRequirement[workwithpeoplewithdisabilities] = { control: app.json.radio(workwithpeoplewithdisabilities), parentId: '' };
    _fundingRequirement[willprojectimprovehealthcare] = { control: app.json.radio(willprojectimprovehealthcare), parentId: '' };
    _fundingRequirement[willgenerateincomeinimpoverishedareas] = { control: app.json.radio(willgenerateincomeinimpoverishedareas), parentId: '' };
    _fundingRequirement[willgenerateincreasedexportvalue] = { control: app.json.radio(willgenerateincreasedexportvalue), parentId: '' };

    function _init_(matchCriteria) {
        for (const name in _fundingRequirement) {
            let json = _fundingRequirement[name].control;
            json.clear();
        }

        matchCriteria.forEach(function (obj, idx) {

            function setValue(json, value) {
                if (json.type == 'selectmulti') {
                    let x = 0;
                }

                if (json.type == 'checkbox') {
                    json.val(value, true);
                } else {
                    json.val(value);
                }
                if (json.name == industrySubSector) {
                    json.user(value);
                }
            }

            let name = obj.name;
            if (_fundingRequirement.hasOwnProperty(name) == true) {
                setValue(_fundingRequirement[name].control, obj.value);
            }
        });
    }

    function Render(matchCriteria, appId, dataArr) {
        appId = '-' + appId;

        function pushTripple(name, value, label, literal) {
            dataArr.push(
                { 'name': name, 'value': value, 'label': label, 'literal': literal }
            );
        }

        function enumFundingRequirementControls(cb) {

            function showAssetFinanceControls() {

                function showBuyingBusinessPropertyControls() {
                    // input: buyingbusinesspropertyvalue
                    cb(_fundingRequirement.buyingbusinesspropertyvalue);

                    // select: buyingbusinesspropertytype
                    cb(_fundingRequirement.buyingbusinesspropertytype);
                }

                function showBuyingEquipmentControls() {
                    // Leaf
                }

                function showBuyingMachineryControls() {
                    // Leaf
                }

                function showBuyingVehecleOrFleetFinanceControls() {
                    // Leaf
                }

                function showPropertyDevelopementControls() {
                    // select: propertydevelopmenttype
                    cb(_fundingRequirement.propertydevelopmenttype);
                }

                function showPropertyRefinancingControls() {
                    // Leaf
                }

                function showShopfittingRennovationsControls() {
                    // radio: shopfittingpropbonded
                    cb(_fundingRequirement.shopfittingpropbonded);
                    // input: shopfittingpropertyvalue
                    cb(_fundingRequirement.shopfittingpropertyvalue);
                    // select: shopfittingpropertytype
                    cb(_fundingRequirement.shopfittingpropertytype);
                }

                const buyingBusinessProperty_Value = '59d2694720070a604097b047';
                const buyingEquipment_Value = '59c35d86463361150873b642';
                const buyingMachinery_Value = '59c3605c463361150873b643';
                const buyingVehecleOrFleetFinance_Value = '59d2692520070a604097b045';
                const propertyDevelopment_Value = '59d2695420070a604097b048';
                const propertyRefinancing_Value = '59d2696020070a604097b049';
                const shopfittingRenovations_Value = '59d2693920070a604097b046';

                // assetfinancetype
                switch (_fundingRequirement.assetfinancetype.control.val()) {
                    // Buying business property
                    case buyingBusinessProperty_Value:
                        showBuyingBusinessPropertyControls();
                        break;
                    // Buying equipment
                    case buyingEquipment_Value:
                        showBuyingEquipmentControls();
                        break;
                    // Buying machinery
                    case buyingMachinery_Value:
                        showBuyingMachineryControls();
                        break;
                    // Buying vehecle or fleet finance
                    case buyingVehecleOrFleetFinance_Value:
                        showBuyingVehecleOrFleetFinanceControls();
                        break;
                    // Property development
                    case propertyDevelopment_Value:
                        showPropertyDevelopementControls();
                        break;
                    // Property refinancing
                    case propertyRefinancing_Value:
                        showPropertyRefinancingControls();
                        break;
                    // Shopfitting/renovations
                    case shopfittingRenovations_Value:
                        showShopfittingRennovationsControls();
                        break;
                }
                // select: assetfinancetype
                cb(_fundingRequirement.assetfinancetype);
            }

            function showWorkingCapitalControls() {

                function showCashAdvanceForAnInvoiceControls() {

                    function showCustomerAgreedWorkIsComplete() {
                        // div: customernotagreed
                    }
                    // input: cashforaninvoiceamount
                    cb(_fundingRequirement.cashforaninvoiceamount);

                    // select: cashforinvoicecustomer
                    cb(_fundingRequirement.cashforinvoicecustomer);

                    // radio: customeragreed
                    cb(_fundingRequirement.customeragreed);

                    switch (_fundingRequirement.customeragreed.control.val()) {
                        case 'No':
                            showCustomerAgreedWorkIsComplete();
                            break;
                    }
                }

                function showCashFlowAssistanceControls() {
                    // radio: hasposdevice
                    cb(_fundingRequirement.hasposdevice);
                }

                function showCashForRetailersWithCardMachineControls() {

                    function showMonthlyIncomeValue() {
                        // input: monthlyincomeincomevalue
                        cb(_fundingRequirement.monthlyincomeincomevalue);
                    }
                    // radio: regularmonthlyincome ( switch )
                    cb(_fundingRequirement.regularmonthlyincome);

                    switch (_fundingRequirement.regularmonthlyincome.control.val()) {
                        case 'Yes':
                            showMonthlyIncomeValue();
                            break;
                    }

                    // checkbox: cardmachinepaymenttypes
                    cb(_fundingRequirement.cardmachinepaymenttypes);
                }

                function showMoneyToBuyStockControls() {
                    // Leaf
                }

                function showMoneyToHelpWithContractControls() {
                    // input: moneyforcontractvalue
                    cb(_fundingRequirement.moneyforcontractvalue);
                    // select: moneyforcontractcustomer
                    cb(_fundingRequirement.moneyforcontractcustomer);
                    // radio: moneyforcontractcompanyexperience
                    cb(_fundingRequirement.moneyforcontractcompanyexperience);
                }

                function showMoneyToHelpWithTenderControls() {
                    // input: moneyfortendervalue
                    cb(_fundingRequirement.moneyfortendervalue);
                    // select: moneyfortendercustomer
                    cb(_fundingRequirement.moneyfortendercustomer);
                    // radio: moneyfortendercompanyexperience
                    cb(_fundingRequirement.moneyfortendercompanyexperience);
                }

                function showPurchaseOrderFundingControls() {
                    // input: purchaseordervalue
                    cb(_fundingRequirement.purchaseordervalue);
                    // select: purchaseordercustomer
                    cb(_fundingRequirement.purchaseordercustomer);
                    // radio: purchaseordercustomerexperience
                    cb(_fundingRequirement.purchaseordercustomerexperience);
                }

                const cashAdvanceForAnInvoice_Value = '59cc9d26132f4c40c446a4f7';
                const cashFlowAssistance_Value = '59cc9d36132f4c40c446a4f8';
                const cashForRetailersWithACardMachine_Value = '5acb467062ba593724e0a78a';
                const moneyToBuyStock_Value = '59cca85e30e9df02c82d0793';
                const moneyToHelpWithAContract_Value = '59cca8a430e9df02c82d0795';
                const moneyToHelpWithATender_Value = '59cca89030e9df02c82d0794';
                const purchaseOrderFunding_Value = '5b213996b958c008605883e8';

                switch (_fundingRequirement.workingcapitaltype.control.val()) {
                    // Cash advance for an invoice
                    case cashAdvanceForAnInvoice_Value:
                        showCashAdvanceForAnInvoiceControls();
                        break;
                    // Cash flow assistance
                    case cashFlowAssistance_Value:
                        showCashFlowAssistanceControls();
                        break;
                    // Cash for retailers with a card machine
                    case cashForRetailersWithACardMachine_Value:
                        showCashForRetailersWithCardMachineControls();
                        break;
                    // Money to buy stock
                    case moneyToBuyStock_Value:
                        showMoneyToBuyStockControls();
                        break;
                    // Money to help with a contract
                    case moneyToHelpWithAContract_Value:
                        showMoneyToHelpWithContractControls();
                        break;
                    // Money to help with a tender
                    case moneyToHelpWithATender_Value:
                        showMoneyToHelpWithTenderControls();
                        break;
                    // Purchase order funding
                    case purchaseOrderFunding_Value:
                        showPurchaseOrderFundingControls();
                        break;
                }
                // select: workingcapitaltype
                cb(_fundingRequirement.workingcapitaltype);
            }

            function showGrowthFinanceControls() {

                function showBusinessExpansionControls() {

                    function showWillingToSellSharesControls() {
                        // radio: largepotentialmarket
                        cb(_fundingRequirement.largepotentialmarket);
                        // radio: customersbuying
                        cb(_fundingRequirement.customersbuying);
                    }

                    // radio: willingtosellshares ( drill down )
                    cb(_fundingRequirement.willingtosellshares);
                    switch (_fundingRequirement.willingtosellshares.control.val()) {
                        case 'Yes':
                            showWillingToSellSharesControls();
                            break;
                    }

                    // select: businessexpansioncompetitiveadv
                    cb(_fundingRequirement.businessexpansioncompetitiveadv);
                    // radio: businessexpansionresultinincreasedemployees
                    cb(_fundingRequirement.businessexpansionresultinincreasedemployees);
                    // radio: businessexpansionresultinincreasedprofitability
                    cb(_fundingRequirement.businessexpansionresultinincreasedprofitability);
                    // radio: businessexpansionresultinincreasedexports
                    cb(_fundingRequirement.businessexpansionresultinincreasedexports);
                    // radio: businessexpansionresultineconomicempowerment
                    cb(_fundingRequirement.businessexpansionresultineconomicempowerment);
                    // radio: businessexpansionresultinsustainabledev
                    cb(_fundingRequirement.businessexpansionresultinsustainabledev);
                    // radio: businessexpansionresultinsolveenvchallenges
                    cb(_fundingRequirement.businessexpansionresultinsolveenvchallenges);
                }

                function showProductServiceExpansionControls() {
                    // select: productserviceexpansiontype
                    cb(_fundingRequirement.productserviceexpansiontype);
                }

                function showRefinancingExistingDebtControls() {
                    // End of the line. Leaf node.
                }

                const businessExpansion_Value = '59d269bd20070a604097b04a';
                const productServiceExpansion_Value = '59d269c920070a604097b04b';
                const refinancingExistingDebt_Value = '59d269d620070a604097b04c';

                switch (_fundingRequirement.growthfinancetype.control.val()) {
                    // Business expansion
                    case businessExpansion_Value:
                        showBusinessExpansionControls();
                        break;
                    // Product/service expansion
                    case productServiceExpansion_Value:
                        showProductServiceExpansionControls();
                        break;
                    // Refinancing existing debt
                    case refinancingExistingDebt_Value:
                        showRefinancingExistingDebtControls();
                        break;
                }
                // select: growthfinancetype
                cb(_fundingRequirement.growthfinancetype);
            }

            function showFranchiseAquisitionControls() {

                function showBuyingFranchiseControls() {
                    // radio: buyingafranchisefranchiseaccredited
                    cb(_fundingRequirement.buyingafranchisefranchiseaccredited);
                    // radio: preapprovedbyfranchisor
                    cb(_fundingRequirement.buyingafranchisefranchiseaccredited);
                }

                function showFundingToBeingOnBEEPartenerControls() {
                    // radio: beepartnerfranchiseaccredited
                    cb(_fundingRequirement.beepartnerfranchiseaccredited);
                }

                function showFundingToBuyExistingBusinessControls() {
                    cb(_fundingRequirement['industry-sub-sector']);
                    cb(_fundingRequirement.fundingtobuyanexistingbusinesstype);
                    // radio: businesslocatedinruralarea
                    cb(_fundingRequirement.businesslocatedinruralarea);
                }

                function showPartenerOrManagementBuyoutControls() {
                    // radio: shareholdinggreaterthanperc
                    cb(_fundingRequirement.shareholdinggreaterthanperc);
                }

                function showStartingYourOwnFranchiseControls() {
                    // Leaf node.
                }

                const buyingAFranchise_Value = '59c2c7087c83b736d463c255';
                const fundingToBringOnABEEPartner_Value = '59d26a3120070a604097b04f';
                const fundingToBuyAnExistingBusiness_Value = '59d26a1620070a604097b04d';
                const partnerOrManagementBuyout_Value = '59d26a2620070a604097b04e';
                const startingYourOwnFranchise_Value = '59c2c7197c83b736d463c256';

                //let o = _controlMap.get(franchiseacquisitiontype);
                switch (_fundingRequirement.franchiseacquisitiontype.control.val()) {
                    // Buying a franchise
                    case buyingAFranchise_Value:
                        showBuyingFranchiseControls();
                        break;
                    // Funding to bring on a BEE Partner
                    case fundingToBringOnABEEPartner_Value:
                        showFundingToBeingOnBEEPartenerControls();
                        break;
                    // Funding to buy an existing business
                    case fundingToBuyAnExistingBusiness_Value:
                        showFundingToBuyExistingBusinessControls();
                        break;
                    // Partner or management buyout
                    case partnerOrManagementBuyout_Value:
                        showPartenerOrManagementBuyoutControls();
                        break;
                    // Starting your own franchise
                    case startingYourOwnFranchise_Value:
                        showStartingYourOwnFranchiseControls()
                        break;
                }
                // select: franchiseacquisitiontype
                cb(_fundingRequirement.franchiseacquisitiontype);
            }

            function showOtherBusinessControls() {

                function showBusinessProcessOutsourcingControls() {
                    // radio: willworkgenerate50newjobs
                    cb(_fundingRequirement.willworkgenerate50newjobs);
                    // radio: doyouhavecontractsforbps
                    cb(_fundingRequirement.doyouhavecontractsforbps);
                    // radio: will80percofjobsbeforyouth
                    cb(_fundingRequirement.will80percofjobsbeforyouth);
                }

                function showExportFundingTradeFinanceControls() {
                    // selectmulti: otherfinanceexportindustry
                    cb(_fundingRequirement.otherfinanceexportindustry);
                    // select: exportcountry
                    cb(_fundingRequirement.exportcountry);
                    // radio: needingtoconductintmarketresearch
                    cb(_fundingRequirement.needingtoconductintmarketresearch);
                    // radio: haveconfirmedorders
                    cb(_fundingRequirement.haveconfirmedorders);
                }

                function showFundingForArtistsAndEventsControls() {
                }

                function showImportFundingTradeFinanceControls() {
                    // selectmulti: otherfinanceimportindustry
                    cb(_fundingRequirement.otherfinanceimportindustry);
                    // select: importcountry
                    cb(_fundingRequirement.importcountry);
                    // radio: havesignedcontracts
                    cb(_fundingRequirement.havesignedcontracts);
                }

                function showPropertyAlleviationAndRuralDevelopementControls() {
                    // radio: workinruralareas
                    cb(_fundingRequirement.workinruralareas);
                    // radio: resultinemploymentsavejobs
                    cb(_fundingRequirement.resultinemploymentsavejobs);
                    // radio: workwithpeoplewithdisabilities
                    cb(_fundingRequirement.workwithpeoplewithdisabilities);
                    // radio: willprojectimprovehealthcare
                    cb(_fundingRequirement.willprojectimprovehealthcare);
                    // radio: willgenerateincomeinimpoverishedareas
                    cb(_fundingRequirement.willgenerateincomeinimpoverishedareas);
                    // radio: willgenerateincreasedexportvalue
                    cb(_fundingRequirement.willgenerateincreasedexportvalue);
                }

                const businessProcessOutsourcing_Value = '59d26d8720070a604097b059';
                const exportFundingTradeFinance_Value = '59d26a6420070a604097b052';
                const fundingForArtistsAndEvents_Value = '59d26d4720070a604097b054';
                const importFundingTradeFinance_Value = '59d26d3120070a604097b053';
                const povertyAlleviationAndRuralDevelopment_Value = '59d26d6020070a604097b056';

                switch (_fundingRequirement.otherfinancetype.control.val()) {
                    // Business Process Outsourcing (BPO)
                    case businessProcessOutsourcing_Value:
                        showBusinessProcessOutsourcingControls;
                        break;

                    // Export funding - trade finance
                    case exportFundingTradeFinance_Value:
                        showExportFundingTradeFinanceControls();
                        break;

                    // Funding for artists and events
                    case fundingForArtistsAndEvents_Value:
                        showFundingForArtistsAndEventsControls();
                        break;

                    // Import funding - trade finance
                    case importFundingTradeFinance_Value:
                        showImportFundingTradeFinanceControls();
                        break;

                    // Poverty alleviation and rural development
                    case povertyAlleviationAndRuralDevelopment_Value:
                        showPropertyAlleviationAndRuralDevelopementControls();
                        break;
                }
                // select: otherfinancetype
                cb(_fundingRequirement.otherfinancetype);
            }

            function showResearchInnovationControls() {

                function showDevelopingNewProductProcessControls() {
                    // Leaf
                }

                function showFilingPatentControls() {
                    // Leaf
                }

                function showFundingForGreenInitiativesControls() {
                    // Leaf
                }

                function showNewProductCommercialisationControls() {
                    // radio: commresstudentstatus
                    cb(_fundingRequirement.commresstudentstatus);
                    // radio: commreswillincexports
                    cb(_fundingRequirement.commreswillincexports);
                    // radio: commresresultinjobcreation
                    cb(_fundingRequirement.commresresultinjobcreation);
                    // radio: commresintroinnov
                    cb(_fundingRequirement.commresintroinnov);
                    // selectmulti: commresindustries
                    cb(_fundingRequirement.commresindustries);
                }

                function showResearchFundingControls() {
                    // radio: researchtakingplaceinuniversity
                    cb(_fundingRequirement.researchtakingplaceinuniversity);
                    // select: researchfieldofresearchtype
                    cb(_fundingRequirement.researchfieldofresearchtype);
                }

                function showTechInnovationControls() {
                    // Leaf
                }

                const developingANewProductProcess_Value = '5acb25ce62ba593724e0a786';
                const filingAPatent_Value = '5acb25dd62ba593724e0a787';
                const fundingForGreenInitiatives_Value = '59d26a5320070a604097b051';
                const newProductCommercialisation_Value = '5acb25f862ba593724e0a788';
                const researchFunding_Value = '5acb260462ba593724e0a789';
                const techInnovation_Value = '59d26a4820070a604097b050';

                switch (_fundingRequirement.researchinnovationfundingtype.control.val()) {
                    // Developing a new product/process
                    case developingANewProductProcess_Value:
                        showDevelopingNewProductProcessControls();
                        break;
                    // Filing a patent
                    case filingAPatent_Value:
                        showFilingPatentControls();
                        break;
                    // Funding for green initiatives
                    case fundingForGreenInitiatives_Value:
                        showFundingForGreenInitiativesControls();
                        break;
                    // New product commercialisation
                    case newProductCommercialisation_Value:
                        showNewProductCommercialisationControls();
                        break;
                    // Research funding
                    case researchFunding_Value:
                        showResearchFundingControls();
                        break;
                    // Tech innovation
                    case techInnovation_Value:
                        showTechInnovationControls();
                        break;
                }

                // select: researchinnovationfundingtype
                cb(_fundingRequirement.researchinnovationfundingtype);
            }

            function amountOfFundingNeededControls() {
                // input: loanamount
                cb(_fundingRequirement.loanamount);
            }

            const assetFinance_Value = '59c35d64463361150873b641';
            const workingCapital_Value = '59c2c6b37c83b736d463c251';
            const growthFinance_Value = '59c5d92b5eac2311202772f5';
            const franchiseAcqusition_Value = '59c2c6f77c83b736d463c254';
            const otherBusiness_Value = '59c5d96b5eac2311202772f7';
            const researchInnovation_Value = '59c5d95c5eac2311202772f6';

            cb(_fundingRequirement.financefor);
            switch (_fundingRequirement.financefor.control.val()) {
                // Asset finance
                case assetFinance_Value:
                    showAssetFinanceControls();
                    break;
                // Working capital
                case workingCapital_Value:
                    showWorkingCapitalControls();
                    break;
                // Growth finance
                case growthFinance_Value:
                    showGrowthFinanceControls();
                    break;
                // Franchise acqusition
                case franchiseAcqusition_Value:
                    showFranchiseAquisitionControls();
                    break;
                // Other business
                case otherBusiness_Value:
                    showOtherBusinessControls();
                    break;
                // ResearchInnovation
                case researchInnovation_Value:
                    showResearchInnovationControls();
                    break;
            }
            amountOfFundingNeededControls();
        }

        function resetRowDivs() {

            for (const name in _fundingRequirement) {
                let id = '#id-div-' + name + appId;
                $(id).hide();
            }
        }

        _init_(matchCriteria);

        resetRowDivs();

        enumFundingRequirementControls(function (_control) {
            let control = _control.control;
            let parentId = _control.parentId;

            function hideDivs(name, max) {
                for (let i = 0; i < max; i++) {
                    let id = ('#id-' + name + '-' + (i + 1).toString() + appId);
                    $(id).hide();
                }
            }

            function renderInputSummary() {

                function renderAmountSummary() {
                    let id = ('#id-' + control.name + appId);
                    let val = 'R' + control.val();
                    $(id).text(val);

                    pushTripple(control.name, control.val(), '', val);
                }

                function renderDefaultSummary() {
                    let id = ('#id-' + control.name + appId);
                    let val = control.val();
                    $(id).text(val);

                    pushTripple(control.name, val, '', val);
                }

                switch (control.name) {
                    case 'loanamount':
                    case 'buyingbusinesspropertyvalue':
                    case 'shopfittingpropertyvalue':
                    case 'cashforaninvoiceamount':
                    case 'monthlyincomeincomevalue':
                    case 'moneyforcontractvalue':
                    case 'moneyfortendervalue':
                    case 'purchaseordervalue':
                        renderAmountSummary();
                        break;

                    default:
                        renderDefaultSummary();
                        break;
                }
            }

            function renderRadioSummary() {

                function renderGUIDSummary() {
                    let val = control.val();
                    let dstId = ('#id-' + control.name + appId);
                    let srcVal = app.listItems.obj.getLabel(parentId, val);
                    $(dstId).text(srcVal);

                    pushTripple(control.name, val, '', srcVal);
                }

                function renderDefaultSummary() {
                    let dstId = ('#id-' + control.name + appId);
                    let srcVal = control.val();
                    $(dstId).text(srcVal);

                    pushTripple(control.name, srcVal, '', srcVal);
                }

                switch (control.name) {
                    case 'financefor':
                        renderGUIDSummary();
                        break;

                    default:
                        renderDefaultSummary();
                        break;
                }
            }

            function renderCheckboxSummary() {

                function renderGUIDSummary() {
                    hideDivs(control.name, 4);

                    let valArr = control.getAll(true);
                    for (let i = 0, max = valArr.length; i < max; i++) {
                        let dstId = ('#id-' + control.name + '-' + (i + 1).toString() + appId);
                        let srcVal = app.listItems.obj.getLabel(parentId, valArr[i]);
                        $(dstId).text(srcVal);
                        $(dstId).show();

                        pushTripple(control.name, valArr[i], '', srcVal);
                    }
                }

                switch (control.name) {
                    case 'cardmachinepaymenttypes':
                        renderGUIDSummary();
                        break;

                    default:
                        break;
                }
            }

            function renderSelectSummary() {

                function renderGUIDSummary() {
                    let val = control.val();
                    let dstId = ('#id-' + control.name + appId);
                    let srcVal = app.listItems.obj.getLabel(parentId, val);
                    $(dstId).text(srcVal);

                    pushTripple(control.name, val, '', srcVal);
                }

                function renderIndustrySectorSummary() {
                    let industrySectorKey = control.user();
                    //let industrySelect = sme.common.getIndustryCategoryIndexs(industrySectorKey, app.common.industrySector.industrySectorData);
                    //let outerIndex = parseInt(industrySelect.outerVal);
                    //let innerIndex = parseInt(industrySelect.innerVal);
                    //let outerText = app.common.industrySector.industrySectorData[outerIndex].text;
                    //let innerText = app.common.industrySector.industrySectorData[outerIndex].secondary[innerIndex].text;
                    let labels = app.common.industrySector.getLabelsFromKey(industrySectorKey);
                    let outerText = labels.industrySectorLabel;
                    let innerText = labels.industrySubSectorLabel;

                    $('#id-industry-sector' + appId).text(outerText);
                    $('#id-industry-sub-sector' + appId).text(innerText);
                    $('#id-div-industry-sector' + appId).show();
                    $('#id-div-industry-sub-sector' + appId).show();

                    pushTripple('industry-sector', industrySectorKey, '', outerText);
                    pushTripple('industry-sub-sector', industrySectorKey, '', innerText);
                }

                function renderCountrySummary() {
                    let srcVal = control.val();
                    let dstId = ('#id-' + control.name + appId);
                    let dstVal = getCountryName(srcVal);
                    $(dstId).text(dstVal);

                    pushTripple(control.name, srcVal, '', dstVal);
                }

                function renderDefaultSummary() {
                    let dstId = ('#id-' + control.name + appId);
                    let dstVal = control.val();
                    $(dstId).text(dstVal);

                    pushTripple(control.name, dstVal, '', dstVal);
                }

                switch (control.name) {
                    case 'assetfinancetype':
                    case 'buyingbusinesspropertytype':
                    case 'propertydevelopmenttype':
                    case 'shopfittingpropertytype':
                    case 'franchiseacquisitiontype':
                    case 'fundingtobuyanexistingbusinesstype':
                    case 'growthfinancetype':
                    case 'businessexpansioncompetitiveadv':
                    case 'productserviceexpansiontype':
                    case 'otherfinancetype':
                    case 'researchinnovationfundingtype':
                    case 'researchfieldofresearchtype':
                    case 'workingcapitaltype':
                    case 'cashforinvoicecustomer':
                    case 'moneyforcontractcustomer':
                    case 'moneyfortendercustomer':
                    case 'purchaseordercustomer':
                        renderGUIDSummary()
                        break;

                    case 'industry-sub-sector':
                        renderIndustrySectorSummary();
                        break;

                    case 'exportcountry':
                    case 'importcountry':
                        renderCountrySummary();
                        break;

                    default:
                        renderDefaultSummary()
                        break;
                }
            }

            function renderMultiSelectSummary() {

                function renderGUIDSummary() {
                    hideDivs(control.name, 21);

                    let valArr = control.val();
                    for (let i = 0, max = valArr.length; i < max; i++) {
                        let dstId = ('#id-' + control.name + '-' + (i + 1).toString() + appId);
                        let srcVal = app.listItems.obj.getLabel(parentId, valArr[i]);
                        $(dstId).text(srcVal);
                        $(dstId).show();

                        pushTripple(control.name, valArr[i], '', srcVal);
                    }
                }

                switch (control.name) {
                    case 'otherfinanceexportindustry':
                    case 'otherfinanceimportindustry':
                    case 'commresindustries':
                        renderGUIDSummary();
                        break;

                    default:
                        break;
                }
            }

            function renderDefaultSummary() {
                let id = ('#id-' + control.name + appId);
                let val = control.val();
                $(id).text(val);

                pushTripple(control.name, val, '', val);
            }

            let div = ('#id-div-' + control.name + appId);
            $(div).show();
            switch (control.type) {
                case 'input':
                    renderInputSummary();
                    break;

                case 'radio':
                    renderRadioSummary();
                    break;

                case 'checkbox':
                    renderCheckboxSummary();
                    break;

                case 'select':
                    renderSelectSummary();
                    break;

                case 'selectmulti':
                    renderMultiSelectSummary();
                    break;

                default:
                    renderDefaultSummary();
                    break;
            }
        });
    }

    fundingRequirements.render = function (funderSearches, appId) {
        if (funderSearches != null) {
            let dataArr = [];
            Render(funderSearches, appId, dataArr);
            return dataArr;
        } else {
            return null;
        }
    };

}(app.fss.fundingRequirements));
