'use strict';
// app is used by asp.net zero.
if (typeof app === 'undefined') {
    var app = {};
}

app.listItems = {};

(function (listItems) {

    function Swap(arr, text) {
        for (let i = 0, max = arr.length; i < max - 1; i++) {
            let temp1 = arr[i].value;
            let temp2 = arr[i].text;
            if (temp2 == text) {
                arr[i].value = arr[max - 1].value;
                arr[i].text = arr[max - 1].text;

                arr[max - 1].value = temp1;
                arr[max - 1].text = temp2;

                break;
            }
        }
    }

    function Sort(arr, text) {
        arr.sort(function (a, b) {
            if (a.text == text) {
                return 1;
            } else {
                return a.text > b.text ? 1 : -1;
            }
        });
    }

    let countryMap = {
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


    class ListItems
    {
        constructor() {
            this.roles = {
                rootId: '',
                arr: []
            };
            this.industrySector = {
                rootId : '',
                arr : []
            };
            this.race = {
                rootId: '',
                arr: []
            };
            this.annualTurnover = {
                rootId: '',
                arr: []
            };
            this.bank = {
                rootId: '',
                arr: []
            };
            this.accountingSystem = {
                rootId: '',
                arr: []
            };
            this.payrollSystem = {
                rootId: '',
                arr: []
            };
            this.bankAccounts = {
                rootId: '',
                arr: []
            };
            this.months = {
                rootId: '',
                arr: []
            };
            this.ffrentTypes = {
                rootId: '',
                arr: []
            };
            this.ffpaymentTypes = {
                rootId: '',
                arr: []
            };
            this.loanFrom = {
                rootId: '',
                arr: []
            };
            this.companyType = {
                rootId: '',
                arr: []
            };

            this.titles = {
                rootId: '',
                arr: []
            };

            this.ffsourceOfFunds = {
                rootId: '',
                arr: []
            };

            this.ffcollateralBusiness = {
                rootId: '',
                arr: []
            };

            this.ffcollateralOwner = {
                rootId: '',
                arr: []
            };
            this.beeLevel = {
                rootId: '',
                arr: []
            };
            this.moneyInvestedInBusiness = {
                rootId: '',
                arr: []
            };

            this.businessInsuranceTypes = {
                rootId: '',
                arr: []
            };
            this.ownerLoanAccountStatus = {
                rootId: '',
                arr: []
            };

            this.listItemsMap = new Map();
        }

        getRolesRootId() {
            return '6226122fc3ac73094c399c46';
        }

        getIndustrySectorRootId() {
            return '5ae9ad66aa58c01494058da5';
        }

        getRaceRootId() {
            return '59e44c9bce32df0ebcdc27d4';
        }

        getAnnualTurnoverRootId() {
            return '59d359ac7112ea2ef072eec4';
        }

        getBankRootId() {
            return '5c810d51b069b41688f61c78';
        }

        getAccountingSystemRootId() {
            return '60d194ba05955b09d12f35e3';
        }

        getPayrollSystemRootId() {
            return '60d19618eac92464d407fb62';
        }

        getBankAccountsRootId() {
            return '60a65b5b61d3627f442b31fb';
        }

        getMonthsRootId() {
            return '616d6e53668f1708a649134b';
        }

        getRentTypesRootId() {
            return '62c44449f252aed95345af15';
        }

        getPaymentTypesRootId() {
            return '62c4435273368b9d83842a13';
        }

        getLoanFromRootId() {
            return '60d193354e4bf55f7b0b8ff8';
        }

        getCompanyTypeRootId() {
            return '59d26e1620070a604097b05a';
        }

        getTitlesRootId() {
            return '622605ca67e3cc13cf216095';
        }

        getSefaSourceOfFundsRootId() {
            return '6278d25ba5a926059e491691';
        }

        getSefaCollateralBusinessRootId() {
            return '62c6f7a038ffd81379804dfb';
        }

        getSefaCollateralOwnerRootId() {
            return '62c6f8906b9e3f9dd8e3d8c4';
        }

        getBeeLevelRootId() {
            return '5af27ffb7fbbb21e6817bc41';
        }

        getMoneyInvestedInBusinessRootId() {
            return '649acc419b59eb161cbc2bb6';
        }

        getBusinessInsuranceTypesRootId() {
            return '64a52a3196d8da823f62da3a';
        }

        getOwnerLoanAccountStatusRootId() {
            return '64a52ce558ab257c5beda2da';
        }

        generateRoles(listArray) {
            let self = this;
            self.roles.rootId = this.getRolesRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.roles.rootId) {
                    self.roles.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Swap(self.roles.arr, 'Other');
            Sort(self.roles.arr, 'Other');
        }

        generateIndustrySectors(src) {
            let self = this;
            this.industrySector.rootId = this.getIndustrySectorRootId();
            src.forEach(function (obj, idx) {
                if (obj.parentListId == self.industrySector.rootId) {
                    if (obj.name === 'Beauty industry') {
                        let x = 0;
                    }
                    self.industrySector.arr.push({
                        key: obj.listId,
                        text: obj.name,
                        secondary: []
                    });
                }
            });

            this.industrySector.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });

            for (let i = 0, max = this.industrySector.arr.length; i < max; i++) {
                src.forEach(function (obj, idx) {
                    if (obj.parentListId == self.industrySector.arr[i].key) {
                        self.industrySector.arr[i].secondary.push({
                            key: obj.listId,
                            text: obj.name
                        });
                    }
                });
                this.industrySector.arr[i].secondary.sort(function (a, b) {
                    return a.text > b.text ? 1 : -1;
                });
            }
        }

        generateRace(listArray) {
            let self = this;
            self.race.rootId = this.getRaceRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.race.rootId) {
                    self.race.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Swap(self.race.arr, 'Other');
            Sort(self.race.arr, 'Other');
        }

        generateAnnualTurnover(listArray) {
            let self = this;
            self.annualTurnover.rootId = this.getAnnualTurnoverRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.annualTurnover.rootId) {
                    self.annualTurnover.arr.push({
                        value: obj.listId,
                        text: obj.name,
                        priority : obj.priority
                    });
                }
            });
            self.annualTurnover.arr.sort(function (a, b) {
                return a.priority > b.priority ? 1 : -1;
            });
        }

        generateBanks(listArray) {
            let self = this;
            self.bank.rootId = this.getBankRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.bank.rootId) {
                    self.bank.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Swap(self.bank.arr, 'Don\'t have a business bank account');
            Sort(self.bank.arr, 'Don\'t have a business bank account');
        }

        generateAccountingSystems(listArray) {
            let self = this;
            self.accountingSystem.rootId = this.getAccountingSystemRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.accountingSystem.rootId) {
                    self.accountingSystem.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Swap(self.accountingSystem.arr, 'Other');
            Sort(self.accountingSystem.arr, 'Other');
        }

        generatePayrollSystems(listArray) {
            let self = this;
            self.payrollSystem.rootId = this.getPayrollSystemRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.payrollSystem.rootId) {
                    self.payrollSystem.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Swap(self.payrollSystem.arr, 'Other');
            Sort(self.payrollSystem.arr, 'Other');
        }

        generateBankAccounts(listArray) {
            let self = this;
            self.bankAccounts.rootId = this.getBankAccountsRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.bankAccounts.rootId) {
                    self.bankAccounts.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Sort(self.bankAccounts.arr, '');
        }

        generateMonths(listArray) {
            let self = this;
            self.months.rootId = this.getMonthsRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.months.rootId) {
                    self.months.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        generateFinfindRentTypes(listArray) {
            let self = this;
            self.ffrentTypes.rootId = this.getRentTypesRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.ffrentTypes.rootId) {
                    self.ffrentTypes.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.ffrentTypes.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateFinfindPaymentTypes(listArray) {
            let self = this;
            self.ffpaymentTypes.rootId = this.getPaymentTypesRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.ffpaymentTypes.rootId) {
                    self.ffpaymentTypes.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.ffpaymentTypes.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateLoanFrom(listArray) {
            let self = this;
            self.loanFrom.rootId = this.getLoanFromRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.loanFrom.rootId) {
                    self.loanFrom.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.loanFrom.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateCompanyTypes(listArray) {
            let self = this;
            self.companyType.rootId = this.getCompanyTypeRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.companyType.rootId) {
                    self.companyType.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        generateTitles(listArray) {
            let self = this;
            self.titles.rootId = this.getTitlesRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.titles.rootId) {
                    self.titles.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            this.titles.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateFinfindSourceOfFunds(listArray) {
            let self = this;
            self.ffsourceOfFunds.rootId = this.getSefaSourceOfFundsRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.ffsourceOfFunds.rootId) {
                    self.ffsourceOfFunds.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.ffsourceOfFunds.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateFinfindCollateralBusiness(listArray) {
            let self = this;
            self.ffcollateralBusiness.rootId = this.getSefaCollateralBusinessRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.ffcollateralBusiness.rootId) {
                    self.ffcollateralBusiness.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Swap(self.ffcollateralBusiness.arr, 'Other');
            Sort(self.ffcollateralBusiness.arr, 'Other');
        }

        generateFinfindCollateralOwner(listArray) {
            let self = this;
            self.ffcollateralOwner.rootId = this.getSefaCollateralOwnerRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.ffcollateralOwner.rootId) {
                    self.ffcollateralOwner.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Swap(self.ffcollateralOwner.arr, 'Other');
            Sort(self.ffcollateralOwner.arr, 'Other');
        }

        generateBeeLevel(listArray) {
            let self = this;
            self.beeLevel.rootId = this.getBeeLevelRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.beeLevel.rootId) {
                    self.beeLevel.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Swap(self.beeLevel.arr, 'Don\'t Know');
            Sort(self.beeLevel.arr, 'Don\'t Know');
        }

        generateMoneyInvestedInBusiness(listArray) {
            let self = this;
            self.moneyInvestedInBusiness.rootId = this.getMoneyInvestedInBusinessRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.moneyInvestedInBusiness.rootId) {
                    self.moneyInvestedInBusiness.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        //generateX(listArray) {
        //    let self = this;
        //    self.X.rootId = this.getXRootId();
        //    listArray.forEach(function (obj, idx) {
        //        if (obj.parentListId == self.X.rootId) {
        //            self.X.arr.push({
        //                value: obj.listId,
        //                text: obj.name
        //            });
        //        }
        //    });
        //}

        generateBusinessInsuranceTypes(listArray) {
            let self = this;
            self.businessInsuranceTypes.rootId = this.getBusinessInsuranceTypesRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.businessInsuranceTypes.rootId) {
                    self.businessInsuranceTypes.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        generateOwnerLoanAccountStatus(listArray) {
            let self = this;
            self.ownerLoanAccountStatus.rootId = this.getOwnerLoanAccountStatusRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.ownerLoanAccountStatus.rootId) {
                    self.ownerLoanAccountStatus.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        getIndustrySector (guid = null) {
            return this.industrySector.arr;
        }

        getRoles(guid = null) {
            let self = this;
            if (guid == null) {
                return this.roles.arr;
            } else {
                let roles = this.roles.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return roles;
            }
        }

        getRace(guid = null) {
            if (guid == null) {
                return this.race.arr;
            } else {
                let race = this.race.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return race;
            }
        }

        getAnnualTurnover(guid = null) {
            if (guid == null || guid == '') {
                return this.annualTurnover.arr;
            } else {
                let annualTurnover = this.annualTurnover.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return annualTurnover;
            }
        }

        getBank(guid = null) {
            if (guid == null || guid == '') {
                return this.bank.arr;
            } else {
                let bank = this.bank.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return bank;
            }
        }

        getAccountingSystem(guid = null) {
            if (guid == null || guid == '') {
                return this.accountingSystem.arr;
            } else {
                let accountingSystem = this.accountingSystem.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return accountingSystem === undefined ? '' : accountingSystem;
            }
        }

        getPayrollSystem(guid = null) {
            if (guid == null || guid == '') {
                return this.payrollSystem.arr;
            } else {
                let payrollSystem = this.payrollSystem.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return payrollSystem === undefined ? '' : payrollSystem;
            }
        }

        getBankAccount(guid = null) {
            if (guid == null || guid == '') {
                return this.bankAccount.arr;
            } else {
                let bankAccount = this.bankAccounts.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return bankAccount;
            }
        }

        getMonth(guid = null) {
            if (guid == null || guid == '') {
                return this.months.arr;
            } else {
                let month = this.months.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return month;
            }
        }

        getRentType(guid = null) {
            if (guid == null || guid == '') {
                return this.ffrentTypes.arr;
            } else {
                let rentType = this.ffrentTypes.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return rentType;
            }
        }

        getPaymentType(guid = null) {
            if (guid == null || guid == '') {
                return this.ffpaymentTypes.arr;
            } else {
                let paymentType = this.ffpaymentTypes.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return paymentType;
            }
        }

        getLoanFrom(guid = null) {
            if (guid == null || guid == '') {
                return this.loanFrom.arr;
            } else {
                let loanFrom = this.loanFrom.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return loanFrom;
            }
        }

        getCompanyType(guid = null) {
            if (guid == null || guid == '') {
                return this.companyType.arr;
            } else {
                let companyType = this.companyType.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return companyType;
            }
        }

        getLabel (parentId, childId) {
            if (parentId == 'COUNTRY') {
                if (countryMap.hasOwnProperty(childId) == true) {
                    return countryMap[childId];
                } else {
                    return 'Unknown';
                }
            } else {
                return this.listItemsMap.get(parentId + childId);
            }
        };

        getTitles(guid = null) {
            if (guid == null) {
                return this.titles.arr;
            } else {
                let title = this.titles.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return title;
            }
        }

        getSourceOfFunds(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.ffsourceOfFunds.arr;
            } else {
                let sourceOfFunds = this.ffsourceOfFunds.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return sourceOfFunds;
            }
        }

        getSefaCollateralBusiness(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.ffcollateralBusiness.arr;
            } else {
                let collateralBusiness = this.ffcollateralBusiness.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return collateralBusiness;
            }
        }

        getSefaCollateralOwner(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.ffcollateralOwner.arr;
            } else {
                let collateralOwner = this.ffcollateralOwner.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return collateralOwner;
            }
        }

        getBeeLevel(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.beeLevel.arr;
            } else {
                let beeLevel = this.beeLevel.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return beeLevel;
            }
        }

        getMoneyInvestedInBusiness(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.moneyInvestedInBusiness.arr;
            } else {
                let moneyInvestedInBusiness = this.moneyInvestedInBusiness.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return moneyInvestedInBusiness;
            }
        }

        //getX(guid = null) {
        //    let self = this;
        //    if (guid == null || guid == '') {
        //        return this.X.arr;
        //    } else {
        //        let X = this.X.arr.find(function (item, idx) {
        //            if (item.value == guid) {
        //                return true;
        //            }
        //        });
        //        return X;
        //    }
        //}

        getBusinessInsuranceTypes(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.businessInsuranceTypes.arr;
            } else {
                let businessInsuranceTypes = this.businessInsuranceTypes.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return businessInsuranceTypes;
            }
        }

        getOwnerLoanAccountStatus(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.ownerLoanAccountStatus.arr;
            } else {
                let ownerLoanAccountStatus = this.ownerLoanAccountStatus.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return ownerLoanAccountStatus;
            }
        }

        init(listArray) {
            let self = this;
            listArray.forEach(function (obj, idx) {
                let key = obj.parentListId + obj.listId;
                if (obj.parentListId == '') {
                    key = key + obj.listId;
                }
                let val = self.listItemsMap.get(key);
                if (val != null) {
                    let duplicateFound = true;
                } else {
                    self.listItemsMap.set(key, obj.name);
                }
            });
            this.generateRoles(listArray);
            this.generateIndustrySectors(listArray);
            this.generateRace(listArray);
            this.generateAnnualTurnover(listArray);
            this.generateBanks(listArray);
            this.generateAccountingSystems(listArray);
            this.generatePayrollSystems(listArray);
            this.generateBankAccounts(listArray);
            this.generateMonths(listArray);
            this.generateFinfindRentTypes(listArray);
            this.generateFinfindPaymentTypes(listArray);
            this.generateLoanFrom(listArray);
            this.generateCompanyTypes(listArray);
            this.generateTitles(listArray);

            this.generateFinfindSourceOfFunds(listArray);
            this.generateFinfindCollateralBusiness(listArray);
            this.generateFinfindCollateralOwner(listArray);

            this.generateBeeLevel(listArray);
            this.generateMoneyInvestedInBusiness(listArray);

            this.generateBusinessInsuranceTypes(listArray);
            this.generateOwnerLoanAccountStatus(listArray);
        }
    };

    class ListItemsSefa extends ListItems {
        constructor() {
            super();

            this.reasonForFinance = {
                rootId: '',
                arr: []
            };
            this.roles = {
                rootId: '',
                arr: []
            };
            this.entityTypes = {
                rootId: '',
                arr: []
            };
            this.titles = {
                rootId: '',
                arr: []
            };
            this.sefaOrigin = {
                rootId: '',
                arr: []
            };
            this.sefaOriginStrategicPartner = {
                rootId: '',
                arr: []
            };
            this.productFit = {
                map : {}
            };
            this.assetType = {
                rootId: '',
                arr: []
            };
            this.sourceOfFunds = {
                rootId: '',
                arr: []
            };
            this.minMembershipReq = {
                rootId: '',
                arr: []
            };
            this.maxFundingReq = {
                rootId: '',
                arr: []
            };
            this.typeOfBusiness = {
                rootId: '',
                arr: []
            };
            this.collateralBusiness = {
                rootId: '',
                arr: []
            };
            this.collateralOwner = {
                rootId: '',
                arr: []
            };
        }

        getReasonForFinanceRootId() {
            return '6169375bf2e88328fa1cf6c3';
        }

        getRolesRootId() {
            return '6226122fc3ac73094c399c46';
        }

        getEntityTypesRootId() {
            return '62260eb61d4e1537377b38a1';
        }

        getTitlesRootId() {
            return '622605ca67e3cc13cf216095';
        }

        getSefaOriginRootId() {
            return '6321d9c69cfd54968ce4063d';
        }

        getSefaOriginStrategicPartnerRootId() {
            return '6321dc1406e2aec37f7023b8';
        }

        getSefaAssetTypesRootId() {
            return '6278d0d755ba3c38f1c7ca5c';
        }

        getSefaSourceOfFundsRootId() {
            return '6278d25ba5a926059e491691';
        }

        getSefaMinMembershipReqRootId() {
            return '62835b429b7b37005c94660b';
        }

        getSefaMaxFundingReqRootId() {
            return '62835a0652402438bf804276';
        }

        getSefaTypeOfBusinessRootId() {
            return '62b50dc00e535af63a65a061';
        }

        getSefaCollateralBusinessRootId() {
            return '62c6f7a038ffd81379804dfb';
        }

        getSefaCollateralOwnerRootId() {
            return '62c6f8906b9e3f9dd8e3d8c4';
        }

        getReasonForFinance(guid = null) {
            if (guid == null) {
                return this.reasonForFinance.arr;
            } else {
                let reasonForFinance = this.reasonForFinance.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                if (reasonForFinance == undefined) {
                    return '';
                } else {
                    return reasonForFinance;
                }
            }
        }

        generateIndustrySectors(src) {
            let self = this;
            self.industrySector.arr = [];
            industrySubSectors_v7.forEach(function (item, index) {
                let text = item.label;
                let i = 0;
                let ch = '';
                while (1) {
                    ch = text.charAt(i);
                    if (ch == ' ' || ch == '\n' || ch == '\r' || ch == '\t') {
                        break;
                    } else {
                        i++;
                    }
                }
                let sicCode = text.slice(0, i);
                while (1) {
                    ch = text.charAt(i);
                    if (ch != ' ' && ch != '\n' && ch != '\r' && ch != '\t') {
                        break;
                    } else {
                        i++;
                    }
                }
                let len = i;
                while (len < text.length) {
                    ch = text.charAt(len);
                    if (ch == '\t' || ch == '\n' || ch == '\r' || ch == '\"') {
                        break;
                    } else {
                        len++;
                    }
                }

                let label = text.slice(i, len);
                self.industrySector.arr.push({
                    'key' : item.key,
                    'sicCode': sicCode,
                    'label' : label
                });
            });
            //industrySubSectors_v7 = [];
            return self.industrySector.arr;
        }

        // Capacity...
        getRoles(guid = null) {
            if (guid == null) {
                return this.roles.arr;
            } else {
                let roles = this.roles.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return roles;
            }
        }

        getEntityTypes(guid = null) {
            if (guid == null) {
                return this.entityTypes.arr;
            } else {
                let entityType = this.entityTypes.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return entityType;
            }
        }

        getTitles(guid = null) {
            if (guid == null) {
                return this.titles.arr;
            } else {
                let title = this.titles.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return title;
            }
        }

        getSefaOrigin(guid = null) {
            let self = this;
            if (guid == null) {
                return this.sefaOrigin.arr;
            } else {
                let sefaOrigin = this.sefaOrigin.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return sefaOrigin;
            }
        }

        getSefaOriginStrategicPartner(guid = null) {
            let self = this;
            if (guid == null) {
                return this.sefaOriginStrategicPartner.arr;
            } else {
                let sefaOriginStrategicPartner = this.sefaOriginStrategicPartner.arr.find(function (obj, idx) {
                    if (obj.value == guid) {
                        return true;
                    }
                });
                return sefaOriginStrategicPartner;
            }
        }

        getIndustrySector(guid = null) {
            let self = this;
            if (guid == null) {
                return super.getIndustrySector();
            } else {
                let industry = this.industrySector.arr.find(function (item, idx) {
                    if (item.key == guid) {
                        return true;
                    }
                });
                return industry;
            }
        }

        getProductFit(guid = null) {
            let self = this;
            if (guid == null) {
                return this.productFit.map;
            } else {
                if (this.productFit.map.has(guid) == true) {
                    return this.productFit.map.get(guid);
                } else {
                    return null;
                }
            }
        }

        getAssetType(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.assetType.arr;
            } else {
                let assetType = this.assetType.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return assetType;
            }
        }

        getSourceOfFunds(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.sourceOfFunds.arr;
            } else {
                let sourceOfFunds = this.sourceOfFunds.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return sourceOfFunds;
            }
        }

        getMinMembershipReq(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.minMembershipReq.arr;
            } else {
                let minMembershipReq = this.minMembershipReq.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return minMembershipReq;
            }
        }

        getMaxFundingReq(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.maxFundingReq.arr;
            } else {
                let maxFundingReq = this.maxFundingReq.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return maxFundingReq;
            }
        }

        getTypeOfBusiness(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.typeOfBusiness.arr;
            } else {
                let typeOfBusiness = this.typeOfBusiness.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return typeOfBusiness;
            }
        }

        //getSefaCollateralBusiness(guid = null) {
        //    return super.getSefaCollateralBusiness(guid);
        //    let self = this;
        //    if (guid == null || guid == '') {
        //        return this.collateralBusiness.arr;
        //    } else {
        //        let collateralBusiness = this.collateralBusiness.arr.find(function (item, idx) {
        //            if (item.value == guid) {
        //                return true;
        //            }
        //        });
        //        return collateralBusiness;
        //    }
        //}
        //
        //getSefaCollateralOwner(guid = null) {
        //    return super.getSefaCollateralOwner(guid);
        //    let self = this;
        //    if (guid == null || guid == '') {
        //        return this.collateralOwner.arr;
        //    } else {
        //        let collateralOwner = this.collateralOwner.arr.find(function (item, idx) {
        //            if (item.value == guid) {
        //                return true;
        //            }
        //        });
        //        return collateralOwner;
        //    }
        //}

        generateReasonForFinance(listArray) {
            let self = this;
            self.reasonForFinance.rootId = this.getReasonForFinanceRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.reasonForFinance.rootId) {
                    self.reasonForFinance.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            //self.roles.arr.sort(function (a, b) {
            //    return a.text > b.text ? 1 : -1;
            //});
        }

        generateRoles(listArray) {
            let self = this;
            self.roles.rootId = this.getRolesRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.roles.rootId) {
                    self.roles.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            Swap(self.roles.arr, 'Other');
            Sort(self.roles.arr, 'Other');
        }

        generateEntityTypes(listArray) {
            let self = this;
            self.entityTypes.rootId = this.getEntityTypesRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.entityTypes.rootId) {
                    self.entityTypes.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.entityTypes.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateTitles(listArray) {
            let self = this;
            self.titles.rootId = this.getTitlesRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.titles.rootId) {
                    self.titles.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            this.titles.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateSefaOrigin(listArray) {
            let self = this;
            self.sefaOrigin.rootId = this.getSefaOriginRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.sefaOrigin.rootId) {
                    self.sefaOrigin.arr.push({
                        value: obj.listId,
                        text: obj.name,
                        priority : obj.priority
                    });
                }
            });
            this.sefaOrigin.arr.sort(function (a, b) {
                return a.priority > b.priority ? 1 : -1;
            });
        }

        generateSefaOriginStrategicPartner(listArray) {
            let self = this;
            self.sefaOriginStrategicPartner.rootId = this.getSefaOriginStrategicPartnerRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.sefaOriginStrategicPartner.rootId) {
                    self.sefaOriginStrategicPartner.arr.push({
                        value: obj.listId,
                        text: obj.name,
                        priority: obj.priority
                    });
                }
            });
            this.sefaOriginStrategicPartner.arr.sort(function (a, b) {
                return a.priority > b.priority ? 1 : -1;
            });
        }

        generateProductFit(listArray) {
            let guidArr = [
                '626662df990a95913a1aa780', // Disability Amavulandlela Funding Scheme
                '626284c39771fd971fa548c2', // Direct lending sub program

                '6262851b4a757c7ed1f3097f', //Youth challenge fund
                '626284e1f8ecc0f40b8edf00', //TREP

                '62628008f9fce6eea1f8f611', //WL or RFI or EU
                '6266620183b96943ddf85151', //WL or RFI or EU
                '62628286639e7b9d112e6666', //WL or RFI or EU

                '6266644706b2c31359cd102f', //Revolving loan

                '626663ff9d63e9cf83e4126a', //Asset finance

                '626663b9b8ac31dfde290063', //Bridging loan

                '63232c9e0bd9ef3f1a8e3b82', // Purchase Order

                '62628556e79a488f50c98bc2', //ManufactureVeteranDisability
                '62666292443c96e336e77adb', //ManufactrueVeteranDisability

                '62666479ae31305e9e16f2fe', //Term loan

                '626661851c7472bd5d1ee51c', //Godisa loans

                '626282d9530062eea92b5b18', //Co - op development fund
                '626282bbbf0a95435552dbeb'  //Micro Finance
            ];
            this.productFit.map = new Map();
            guidArr.forEach((guid, idx) => {
                listArray.find((obj, idx) => {
                    if (obj.listId == guid) {
                        this.productFit.map.set(guid, obj);
                        return true;
                    }
                });
            });
        }

        generateSefaAssetTypes(listArray) {
            let self = this;
            self.assetType.rootId = this.getSefaAssetTypesRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.assetType.rootId) {
                    self.assetType.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        generateSefaSourceOfFunds(listArray) {
            let self = this;
            self.sourceOfFunds.rootId = this.getSefaSourceOfFundsRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.sourceOfFunds.rootId) {
                    self.sourceOfFunds.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        generateSefaMinMembershipReq(listArray) {
            let self = this;
            self.minMembershipReq.rootId = this.getSefaMinMembershipReqRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.minMembershipReq.rootId) {
                    self.minMembershipReq.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        generateSefaMaxFundingReq(listArray) {
            let self = this;
            self.maxFundingReq.rootId = this.getSefaMaxFundingReqRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.maxFundingReq.rootId) {
                    self.maxFundingReq.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        generateSefaTypeOfBusiness(listArray) {
            let self = this;
            self.typeOfBusiness.rootId = this.getSefaTypeOfBusinessRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.typeOfBusiness.rootId) {
                    self.typeOfBusiness.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        generateSefaCollateralBusiness(listArray) {
            let self = this;
            self.collateralBusiness.rootId = this.getSefaCollateralBusinessRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.collateralBusiness.rootId) {
                    self.collateralBusiness.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        generateSefaCollateralOwner(listArray) {
            let self = this;
            self.collateralOwner.rootId = this.getSefaCollateralOwnerRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.collateralOwner.rootId) {
                    self.collateralOwner.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
        }

        init(listArray) {
            let self = this;
            super.init(listArray);

            this.generateReasonForFinance(listArray);
            this.generateEntityTypes(listArray);
            this.generateSefaOrigin(listArray);
            this.generateSefaOriginStrategicPartner(listArray);
            this.generateProductFit(listArray);
            this.generateSefaAssetTypes(listArray);
            this.generateSefaSourceOfFunds(listArray);
            this.generateSefaMinMembershipReq(listArray);
            this.generateSefaMaxFundingReq(listArray);
            this.generateSefaTypeOfBusiness(listArray);
            //this.generateSefaCollateralBusiness(listArray);
            //this.generateSefaCollateralOwner(listArray);
        }
    };

    class ListItemsECDC extends ListItems {
        constructor() {
            super();
            this.fundingCapacity =
            {
                rootId: '',
                arr: []
            };
            this.region =
            {
                rootId: '',
                arr: []
            };
            this.townType = {
                rootId: '',
                arr: []
            };
            this.fundingFor = {
                rootId: '',
                arr: []
            };
            this.product = {
                rootId : '',
                arr : []
            };
        }

        getFundingCapacityRootId() {
            return '653baeffb7530e43400d6e83';
        }

        getRegionRootId() {
            return '647dc6bc2a23c77335601e23';
        }

        getTownTypeRootId() {
            return '63ef39441097c0313380ff39';
        }

        getFundingForRootId() {
            return '63ef3a3773f8046d1938db49';
        }

        getProductRootId() {
            return '63e242aecd3ed9b1a570e77c';
        }

        generateFundingCapacity(listArray) {
            let self = this;
            self.fundingCapacity.rootId = this.getFundingCapacityRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.fundingCapacity.rootId) {
                    self.fundingCapacity.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.fundingCapacity.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateRegion(listArray) {
            let self = this;
            self.region.rootId = this.getRegionRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.region.rootId) {
                    self.region.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.region.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateTownType(listArray) {
            let self = this;
            self.townType.rootId = this.getTownTypeRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.townType.rootId) {
                    self.townType.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.townType.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateFundingFor(listArray) {
            let self = this;
            self.fundingFor.rootId = this.getFundingForRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.fundingFor.rootId) {
                    self.fundingFor.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.fundingFor.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateProduct(listArray) {
            let self = this;
            self.product.rootId = this.getProductRootId();
            listArray.forEach(function (obj, idx) {
                if (obj.parentListId == self.product.rootId) {
                    self.product.arr.push({
                        value: obj.listId,
                        text: obj.name
                    });
                }
            });
            self.product.arr.sort(function (a, b) {
                return a.text > b.text ? 1 : -1;
            });
        }

        generateRace(listArray) {
            super.generateRace(listArray);
        }

        getFundingCapacity(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.fundingCapacity.arr;
            } else {
                let fundingCapacity = this.fundingCapacity.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return fundingCapacity;
            }
        }

        getRegion(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.region.arr;
            } else {
                let region = this.region.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return region;
            }
        }

        getTownType(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.townType.arr;
            } else {
                let townType = this.townType.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return townType;
            }
        }

        getFundingFor(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.fundingFor.arr;
            } else {
                let fundingFor = this.fundingFor.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return fundingFor;
            }
        }

        getProduct(guid = null) {
            let self = this;
            if (guid == null || guid == '') {
                return this.product.arr;
            } else {
                let product = this.product.arr.find(function (item, idx) {
                    if (item.value == guid) {
                        return true;
                    }
                });
                return product;
            }
        }

        init(listArray) {
            let self = this;
            super.init(listArray);
            this.generateFundingCapacity(listArray);
            this.generateRegion(listArray);
            this.generateTownType(listArray);
            this.generateFundingFor(listArray);
            this.generateProduct(listArray);
        }
    };

    class ListItemsCompanyPartners extends ListItems {
        constructor() {
            super();
        }

        init(listArray) {
            let self = this;
            super.init(listArray);
        }
    };

    class ListItemsAfricanBank extends ListItems {
        constructor() {
            super();
        }

        init(listArray) {
            let self = this;
            super.init(listArray);
        }
    };

    class ListItemsHloolo extends ListItems {
        constructor() {
            super();
        }

        init(listArray) {
            let self = this;
            super.init(listArray);
        }
    };

    class ListItems___TENANT___ extends ListItems {
        constructor() {
            super();
        }

        init(listArray) {
            let self = this;
            super.init(listArray);
        }
    };

    listItems.create = function (tenant) {
        switch (tenant) {
            case 'sefa':
                listItems.obj = new ListItemsSefa();
                break;

            case 'ecdc':
                listItems.obj = new ListItemsECDC();
                break;

            case 'finfind':
                listItems.obj = new ListItems();
                break;

            case 'company-partners':
                listItems.obj = new ListItemsCompanyPartners();
                break;

            case 'african-bank':
                listItems.obj = new ListItemsAfricanBank();
                break;

            case 'hloolo':
                listItems.obj = new ListItemsHloolo();
                break;

            case '___tenant___':
                listItems.obj = new ListItems___TENANT___();
                break;

        }
        return listItems.obj;
    }

    listItems.get = function () {
        if (listItems.hasOwnProperty('obj') == true) {
            return listItems.obj;
        } else {
            return null;
        }
    }

    class Sefa {
        static getCompanyType(guid, def = '') {
            let result = listItems.get().getCompanyType(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        // Race. Should be in base class???
        static getRace(guid, def = '') {
            let result = listItems.get().getRace(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        // In mandate fit page.
        static getReasonForFinance(guid, def = '') {
            let result = listItems.get().getReasonForFinance(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        // Capacity, in user profile.
        static getRole(guid, def = '') {
            let result = listItems.get().getRoles(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        // In company profile.
        static getEntityType(guid, def = '') {
            let result = listItems.get().getEntityTypes(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        // Mr, Mrs, Dr, etc.
        static getTitle(guid, def = '') {
            let result = listItems.get().getTitles(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        // Where did you hear about sefa?
        static getOrigin(guid, def = '') {
            let result = listItems.get().getSefaOrigin(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        // Program based on onboarding and application inputs.
        static getProgram(guid, def = null) {
            let result = listItems.get().getProductFit(guid);
            return result == null || result == undefined ? def : result;
        }

        // Asset finance program.
        static getAssetType(guid, def = '') {
            let result = listItems.get().getAssetType(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getSourceOfFunds(guid, def = '') {
            let result = listItems.get().getSourceOfFunds(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getMinMembershipRequirement(guid, def = '') {
            let result = listItems.get().getMinMembershipReq(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getMaxFundingRequirement(guid, def = '') {
            let result = listItems.get().getMaxFundingReq(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getTypeOfBusiness(guid, def = '') {
            let result = listItems.get().getTypeOfBusiness(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getPaymentType(guid, def = '') {
            let result = listItems.get().getPaymentType(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getRentType(guid, def = '') {
            let result = listItems.get().getRentType(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getSefaCollateralBusiness(guid, def = '') {
            let result = listItems.get().getSefaCollateralBusiness(guid);
            return result === '' || result == undefined || result == undefined ? def : result.text;
        }

        static getSefaCollateralOwner(guid, def = '') {
            let result = listItems.get().getSefaCollateralOwner(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getSourceOfFunds(guid, def = '') {
            let result = listItems.get().getSourceOfFunds(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getAnnualTurnover(guid, def = '') {
            let result = listItems.get().getAnnualTurnover(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getMonth(guid, def = '') {
            let result = listItems.get().getMonth(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getBank(guid, def = '') {
            let result = listItems.get().getBank(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getBankAccount(guid, def = '') {
            let result = listItems.get().getBankAccount(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getAccountingSystem(guid, def = '') {
            let result = listItems.get().getAccountingSystem(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getLoanFrom(guid, def = '') {
            let result = listItems.get().getLoanFrom(guid);
            return result === '' || result == undefined ? def : result.text;
        }

        static getPayrollSystem(guid, def = '') {
            let result = listItems.get().getPayrollSystem(guid);
            return result === '' || result == undefined ? def : result.text;
        }
    };

    listItems.getter = Sefa;

}(app.listItems));

if (typeof app.common === 'undefined') {
    app.common = {};
}

if (app.common.industrySector == undefined) {
    app.common.industrySector = {};
}

// TODO: Perhaps this should be inside _ListItems.js?
(function (industrySector) {
    let _industrySectorData = null;

    // TODO: Shift into common place!!!
    function fill(selectId, arr, name) {
        let root = document.getElementById(selectId);
        for (let i = 0; i < arr.length; i++) {
            let optionElem = document.createElement('option');
            optionElem.text = arr[i][name];
            optionElem.value = i.toString();
            root.add(optionElem);
        }
    }

    // TODO: Shift into common place!!!
    function flush(selectId) {
        let root = document.getElementById(selectId);
        let max = root.children.length;
        for (let i = 1; i < max; i++) {
            let elem = root.children[1];
            elem.remove();
        }
    }

    industrySector.filter = function (id, guid, str) {
        let obj = industrySector.getIndexesFromKey(guid);
        let index = parseInt(obj.industrySectorIndex);
        let result = [];
        _industrySectorData[index].secondary.forEach(function (item, index) {
            if (item.text.includes(str) == true) {
                result.push(item);
            }
        });
        if (result.length > 0) {
            flush(id);
            fill(id, result, 'text');
        }
    };

    //industrySector.industrySectorData = _industrySectorData;

    industrySector.populateIndustrySector = function (industrySectorId) {
        flush(industrySectorId);
        fill(industrySectorId, _industrySectorData, 'text');
    };

    industrySector.populateIndustrySubSectorFromKey = function (industrySubSectorId, key) {
        let obj = industrySector.getIndexesFromKey(key);
        let index = parseInt(obj.industrySectorIndex);
        flush(industrySubSectorId);
        fill(industrySubSectorId, _industrySectorData[index].secondary, 'text');
    };

    industrySector.populateFromKey = function (industrySectorId, industrySubSectorId, key) {
        let obj = industrySector.getIndexesFromKey(key);
        industrySector.populateIndustrySector(industrySectorId);
        industrySector.populateIndustrySubSectorFromKey(industrySubSectorId, key);
        $('#' + industrySectorId).val(obj.industrySectorIndex.toString());
        $('#' + industrySubSectorId).val(obj.industrySubSectorIndex.toString());
    };

    industrySector.populateIndustrySubSectorFromIndex = function (industrySubSectorId, industrySectorIndex) {
        let index = parseInt(industrySectorIndex);
        flush(industrySubSectorId);
        fill(industrySubSectorId, _industrySectorData[index].secondary, 'text');
        $('#' + industrySubSectorId).val('');
    };

    // TODO: Incorporate this and test!!!
    industrySector.getIndexesFromKey = function (key) {
        for (let outerIndex = 0; outerIndex < _industrySectorData.length; outerIndex++) {
            let outerItem = _industrySectorData[outerIndex];

            for (let innerIndex = 0; innerIndex < outerItem.secondary.length; innerIndex++) {
                let innerItem = outerItem.secondary[innerIndex];

                if (key == innerItem.key) {
                    return {
                        industrySectorIndex: outerIndex,
                        industrySubSectorIndex: innerIndex
                    };
                }
            }
        }
        return null;
    };

    // TODO: Incorporate this and test!!!
    industrySector.getKeyFromIndexes = function (sectorIndex, subSectorIndex) {
        return _industrySectorData[sectorIndex].secondary[subSectorIndex].key;
    };

    // TODO: Incorporate this and test!!!
    industrySector.getLabelsFromKey = function (key) {
        for (let outerIndex = 0; outerIndex < _industrySectorData.length; outerIndex++) {
            let outerItem = _industrySectorData[outerIndex];

            for (let innerIndex = 0; innerIndex < outerItem.secondary.length; innerIndex++) {
                let innerItem = outerItem.secondary[innerIndex];

                if (key == innerItem.key) {
                    return {
                        industrySectorLabel: outerItem.text,
                        industrySubSectorLabel: innerItem.text
                    };
                }
            }
        }
        return null;
    };

    industrySector.populateSector = function (sectorControl) {
        let industry = app.common.industrySector.industrySectorData;
        let arr = [];
        industry.forEach((item, index) => {
            arr.push({
                value: item.key,
                text: item.text
            });
        });
        sectorControl.flush();
        sectorControl.fill(arr);
    }

    industrySector.populateSubSector = function (sectorGuid, subSectorControl) {

        function getIndustryFromKey() {
            let data = app.common.industrySector.industrySectorData;
            for (let i = 0, max1 = data.length; i < max1; i++) {
                if (sectorGuid == data[i].key) {
                    return data[i].secondary;
                }
            }
            return null;
        }

        let industry = getIndustryFromKey(sectorGuid);
        if (industry != null) {
            let arr = [];
            industry.forEach((item, index) => {
                arr.push({
                    value: item.key,
                    text: item.text
                });
            });
            subSectorControl.flush();
            subSectorControl.fill(arr);
        }
    }

    industrySector.populateSectors = function (subSectorGuid, sectorControl, subSectorControl) {
        function getSectorFromKey(subSectorGuid) {
            let data = app.common.industrySector.industrySectorData;
            for (let i = 0, max1 = data.length; i < max1; i++) {
                for (let j = 0, max2 = data[i].secondary.length; j < max2; j++) {
                    if (subSectorGuid == data[i].secondary[j].key) {
                        return data[i];
                    }
                }
            }
            return null;
        }
        let obj = getSectorFromKey(subSectorGuid);
        industrySector.populateSector(sectorControl);
        industrySector.populateSubSector(obj.key, subSectorControl);
        sectorControl.val(obj.key);
        subSectorControl.val(subSectorGuid);
    }

    industrySector.init = function () {
        _industrySectorData = app.listItems.obj.getIndustrySector();
        industrySector.industrySectorData = _industrySectorData;
    }

})(app.common.industrySector);
