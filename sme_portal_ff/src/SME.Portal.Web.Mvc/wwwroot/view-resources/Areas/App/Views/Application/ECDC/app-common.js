"use strict";

if (typeof app === 'undefined') {
    var app = {};
}

if (app.wizard == undefined) {
    app.wizard = {};
}

if (app.wizard.common == undefined) {
    app.wizard.common = {};
}

if (app.wizard.common.page == undefined) {
    app.wizard.common.page = {};
}

(function (page) {
    let helpers = app.onboard.helpers.get();

    const FundingForGuids = {
        MoneyToHelpWithContract: '63ef3b8976122aee38ce9f87',
        MoneyToHelpWithTender: '63ef3bab78323009caea7de1',
        PurchaseOrderFunding: '63ef3c8e6a91e4089aaf174a'
    }

    const companyGuids = {
        '(Pty) Ltd': '5a6ab7cd506ea818e04548ac',
        'Sole Proprietor': '5a6ab7ce506ea818e04548ad',
        'Close Corporation': '5a6ab7d0506ea818e04548ae',
        'Primary Co-operative': '5a6ab7d2506ea818e04548af',
        'Partnership': '5a6ab7d3506ea818e04548b0',
        'Public Company': '5a6ab7d8506ea818e04548b1',
        'Trust': '5a6ab7ea506ea818e04548b2',
        'Not for Profit Organisation (NPO)': '5a6ab809506ea818e04548b3',
        'Section 21': '5a6ab80c506ea818e04548b5',
        'Government Entities': '5a6ab813506ea818e04548b6',
        'Public Benefit Organisation': '5a6ab817506ea818e04548b7',
        'Internationally Registered Company': '5c3cdd53261c1e011c7b67c4',
        'Internationally Registered Not for Profit Company': '5c3cdd79261c1e011c7b67c5',
        'Non Profit Company (NPC)': '5c3cdda7261c1e011c7b67c6',
        'Personal Liability Company': '5c3cde39261c1e011c7b67c7',
        'Secondary Co-operative': '5c3cdecd261c1e011c7b67c8',
        'Tertiary Co-operative': '5c3cdf0a261c1e011c7b67c9',
        'Non-Government Organisation (NGO)': '5a6ab80b506ea818e04548b4',

        'Limited by Guarentee': '63ef3f84db16393316a1ee05',
        'External company under Section 21A': '63ef3f9cce7c33519edd4236',
        'Inc': '63ef3fb3c75e9141b36e268e',
        'Unlimited': '63ef3fca4de7b7ab187f5983',
        'State owned Company (SOC Ltd)': '63ef3fe2677df4624d35deb7',
        'Statutory Body': '63ef3ffa4a17eb76e00d0b2e'
    };

    // -- TODO: Get from ListItems.
    const reasonForFinanceGuids = {
        'Buying equipment': '63ef3a53953855d24c1b8562',
        'Buying machinery': '63ef3a96e5705a5254042f46',
        'Business expansion': '63ef3ab05ea1e0bcbbd40451',
        'Buying business property': '63ef3ac826b19ff35557554a',
        'Capital expenditure': '63ef3ae09892604f5788da86',
        'Cash flow assistance': '63ef3afa8404766440ba5248',
        'Guarantee for construction project': '63ef3b2e514fd804db5a9cab',
        'Money to buy stock': '63ef3b6d814e2724d1b6547c',
        'Money to help with a contract': '63ef3b8976122aee38ce9f87',
        'Money to help with a tender': '63ef3bab78323009caea7de1',
        'Money for concept development (pre-feasibility studies/scoping)': '63ef3c06b0da8f7e62e0413c',
        'Operational expenditure': '63ef3c27e6c6b2ce1853c3e9',
        'Product/service expansion': '63ef3c439402e3c6278cfd66',
        'Property development': '63ef3c5ca706aab3c1cd1e11',
        'Property refinancing': '63ef3c7541111fccff53c88b',
        'Purchase order funding': '63ef3c8e6a91e4089aaf174a',
        'Refinancing existing debt': '63ef3ca4e38bfa421641e1ad',
        'Shopfitting/renovations': '63ef3cbedd60ee97d9f9c102',
        'Start-up funding': '63ef3cdb4b68dbd3235902c9',
        'Vehicle or fleet finance': '63ef3cf4235ba032e5db0b5d',
        'Working capital': '63ef3d13fd10b748c64bbd34',
        'Infrastructure finance': '63ef3d2e8d3a6f025bbb8494',
        'TotalFundingRequirements20Percent': '642570688091bcdf74283745',

        'Business in distress': '645b45972f848504b5eb4a85',
        'Working capital relief': '645b45ae9c278fac47102f22',
        'Jobs retention or saving': '645b45c42b7413354939c607'
    };

    const townGuids = {
        SmallTown: '63ef39653a8ed257db6f30f9',
        RuralArea: '63ef39808533200ff8bc8858',
        Township: '63ef399e03895c962beea92d'
    };

    const productGuids = {
        InvabaCooperativeFundEnterprise: '650c2fc52207cebdf845a80f',
        InvabaCooperativeFund: '63e242d27dc6fb5151bcff26',
        JobStimulusFund: '63e242eaceb9aecc0216700b',
        Strtep: '63e243ee6286966e8fdf083b',
        NexusTradeLoan: '63e24302ce1834f63fe2585a',
        WorkFlowContractorLoan: '63e243375e3bda02001f0ddf',
        RiskCapitalProjectDevelopmentFinance: '63e243c71ff5f39c333e8c69',
        RiskCapitalBusinessFinance: '63e243ae97fd86bb80a8248f',
        TermLoanPowerPlus: '63e243930ae52a7bb6caf7f8',
        TermLoanTermCap: '63e2440a1d31dfb1801b37b6'
    };

    const imvabaIndustryGuids = [
        '62220d3fb1b2c7508c7a9f91',
        '62220cda013e151a916367a5',
        '62220bc604e69b315d773e47',
        '62220b92a20a493bd4234489',
        '62220b4d501cdd6ad246f599',

        '62220b10e04bae05be7562ee',
        '62220b10e04bae05be7562ef',
        '62220b10e04bae05be7562f0',
        '62220b10e04bae05be7562f1',
        '62220b10e04bae05be7562f2',
        '62220b10e04bae05be7562f3',
        '62220b10e04bae05be7562f4',
        '62220b10e04bae05be7562f5',
        '62220b10e04bae05be7562f6',
        '62220b10e04bae05be7562f7',

        '62220ade04e69b315d7739b2',
        '62220ade04e69b315d7739b3',
        '62220ade04e69b315d7739b4',
        '62220ade04e69b315d7739b5',
        '62220ade04e69b315d7739b6',
        '62220ade04e69b315d7739b7',
        '62220ade04e69b315d7739b8',
        '62220ade04e69b315d7739b9',
        '62220ade04e69b315d7739ba',
        '62220ade04e69b315d7739bb',
        '62220ade04e69b315d7739bc',
        '62220ade04e69b315d7739bd',
        '62220ade04e69b315d7739be',
        '62220ade04e69b315d7739bf',
        '62220ade04e69b315d7739c0',
        '62220ade04e69b315d7739c1',
        '62220ade04e69b315d7739c2',
        '62220ade04e69b315d7739c3',
        '62220ade04e69b315d7739c4',
        '62220ade04e69b315d7739c5',
        '62220ade04e69b315d7739c6',
        '62220ade04e69b315d7739c7',
        '62220ade04e69b315d7739c8',


        '62220ade04e69b315d773902',
        '62220ade04e69b315d7738a3',
        '62220ade04e69b315d7738a4',
        '62220ade04e69b315d7738a5',
        '62220ade04e69b315d7738a6',
        '62220ade04e69b315d7738a7',
        '62220ade04e69b315d7738a8',

        '62220ade04e69b315d773750',
        '62220ade04e69b315d77375a'
    ];


    //'01610', Farm labour contractors activities
    //'22190', Manufacture of rubber sex articles
    //'32400', Gambling machines and equipment manufacturing
    //'46520', Electronic gambling machine wholesaling
    //'47540', Sex shop operation
    //'78200', Contract labour rental services
    //'78200', Contract labour supply service
    //'78200', Labour rental services
    //'78200', Labour - broking activities
    //'78200', Nursing placement agency employing on contract basis, providing training to staff
    //'78200', Outplacement services
    //'78200', Supplying workers to clients' businesses for limited periods of time to temporarily replace or supplement the working force of the client, where the individuals provided are employees of the temporary help service unit (Units do not provide direct supervi
    //'78200', Temporary employment agency activities
    //'78200', Temporary labour hire
    //'78200', Tradesman rental services

    //'92000', Activities of off - track betting
    //'92000', Automatic totalisator servicing
    //'92000', Betting shop operation
    //'92000', Bookmaker operation, independent
    //'92000', Bookmaking and other betting operations
    //'92000', Casino operation(including floating casino's)
    //'92000', Football pools operation
    //'92000', Gambling and betting activities
    //'92000', Gambling operation
    //'92000', Gambling services, such as lotteries
    //'92000', Gaming machine operation
    //'92000', Lottery agency operation
    //'92000', Lottery operation
    //'92000', Lottery ticket selling agency
    //'92000', Off - course betting operation
    //'92000', Operation of casinos, including “floating casinos”
    //'92000', Operation of coin - operated gambling machines
    //'92000', Operation of virtual gambling web sites
    //'92000', Race course betting
    //'92000', Racing tipster activity
    //'92000', Sale of lottery tickets
    //'92000', Tab operation
    //'92000', Totalisator agency board operation

    //'93290', Operation(exploitation) of coin - operated games(for operation(exploitation) of coin - operated gambling machines, see 9200)
    //'94920', Activities of political auxiliary organizations such as young people's auxiliaries associated with a political party
    //'94920', Activities of political organizations
    //'94920', Political association operation
    //'94920', Political organisation activities
    //'94920', Political party operation
    //'94920', Young people's auxiliaries associated with a political party

    //'96090', Sex services, all types
    //'96090'  Telephone sex operation


    class AppCommon extends app.wizard.page.Common {
        constructor() {
            super();
            this.name = 'App Common';
            this.productGuids = app.wizard.common.page.productGuids;
        }

        getIsCoop(companyGuid) {
            switch (companyGuid) {
                //'Internationally Registered Company' : '5c3cdd53261c1e011c7b67c4',
                case companyGuids['Primary Co-operative']:
                case companyGuids['Secondary Co-operative']:
                case companyGuids['Tertiary Co-operative']:
                case companyGuids['Limited by Guarentee']:
                case companyGuids['External company under Section 21A']:
                case companyGuids['Inc']:
                case companyGuids['Unlimited']:
                    return true;

                default:
                    return false;
            }
        }

        isValidIndustry(industryGuid) {
            for (let i = 0, max = imvabaIndustryGuids.length; i < max; i++) {
                if (industryGuid == imvabaIndustryGuids[i]) {
                    return false;
                }
            }
            return true;
        }

        testReasonForFinanceOR(reasonForFinance, reasonArr) {
            for (let i = 0, max = reasonArr.length; i < max; i++) {
                if (reasonForFinance == reasonArr[i]) {
                    return true;
                }
            }
            return false;
        }

        fundingForImvaba(reasonForFinanceGuid) {
            return this.testReasonForFinanceOR(
                reasonForFinanceGuid,
                [
                    reasonForFinanceGuids['Buying equipment'],
                    reasonForFinanceGuids['Buying machinery'],
                    reasonForFinanceGuids['Money to buy stock'],
                    reasonForFinanceGuids['Working capital']
                ]
            );
        }

        isInvabaCooperativeFund(amount, companyGuid, reasonForFinanceGuid) {
            if (amount <= 600000 &&
                companyGuid == companyGuids['Primary Co-operative'] &&
                this.fundingForImvaba(reasonForFinanceGuid) == true) {
                return true;
            } else {
                return false;
            }
        }

        isInvabaCooperativeFund_Enterprise(
            amount, 
            companyGuid, 
            reasonForFinanceGuid,
            isInvolvedInRunningDailyActivitiesOfCooperative,
            hasAnyOtherLoanWithECDC
        ) {
            if (amount <= 150000 &&
                companyGuid == companyGuids['Sole Proprietor'] &&
                this.fundingForImvaba(reasonForFinanceGuid) == true &&
                isInvolvedInRunningDailyActivitiesOfCooperative == true &&
                hasAnyOtherLoanWithECDC == false) {
                return true;
            } else {
                return false;
            }
        }

        getProduct(
            loanAmount,
            tradingTime,
            reasonForFinanceGuid,
            townGuid,
            companyGuid,
            indudstryGuid,
            hasContract,
            hasTender,
            hasPurchaseOrder,
            industrySector,
            isInvolvedInRunningDailyActivitiesOfCooperative,
            hasAnyOtherLoanWithECDC
        ) {
            let self = this;

            function testCompanyGuidOR(companyType, companyTypeArr) {
                for (let i = 0, max = companyTypeArr.length; i < max; i++) {
                    if (companyType == companyTypeArr[i]) {
                        return true;
                    }
                }
                return false;
            }

            function testTownOR(townType, townTypeArr) {
                for (let i = 0, max = townTypeArr.length; i < max; i++) {
                    if (townType == townTypeArr[i]) {
                        return true;
                    }
                }
                return false;
            }

            function testReasonForFinanceOR(reasonForFinance, reasonArr) {
                return self.testReasonForFinanceOR(reasonForFinance, reasonArr);
            }

            function getIsCoop(companyGuid) {
                return self.getIsCoop(companyGuid);
            }

            function hasImvabaIndustries(industryGuid) {
                for (let i = 0, max = imvabaIndustryGuids.length; i < max; i++) {
                    if (industryGuid == imvabaIndustryGuids[i]) {
                        return true;
                    }
                }
                return false;
            }

            function isInvabaCooperativeFund(amount, companyGuid, reasonForFinanceGuid) {
                return self.isInvabaCooperativeFund(amount, companyGuid, reasonForFinanceGuid);
            }

            function isSTRTEP() {
                if (loanAmount < 150000 &&
                    tradingTime >= 12 &&
                    testTownOR(
                        townGuid,
                        [
                            townGuids['SmallTown'],
                            townGuids['RuralArea'],
                            townGuids['Township']
                        ]
                    ) == true &&
                    testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [reasonForFinanceGuids['Buying equipment'],
                        reasonForFinanceGuids['Buying machinery'],
                        reasonForFinanceGuids['Infrastructure finance'],// ???
                        reasonForFinanceGuids['Vehicle or fleet finance'],
                        reasonForFinanceGuids['Start-up funding'],
                        reasonForFinanceGuids['Business expansion'],
                        reasonForFinanceGuids['Cash flow assistance'],
                        reasonForFinanceGuids['Money to buy stock'],
                        reasonForFinanceGuids['Operational expenditure'],
                        reasonForFinanceGuids['Product/service expansion'],
                        reasonForFinanceGuids['Shopfitting/renovations'],
                        reasonForFinanceGuids['Working capital']
                        ]
                    ) == true) {
                    return true;
                } else {
                    return false;
                }
            }

            function isJobStimulus() {
                if ((loanAmount >= 50000 && loanAmount <= 2000000) &&
                    tradingTime >= 24 &&
                    testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [
                            reasonForFinanceGuids['Business in distress'],
                            reasonForFinanceGuids['Working capital relief'],
                            reasonForFinanceGuids['Jobs retention or saving']
                        ]
                    ) == true) {
                    return true;
                } else {
                    return false;
                }
            }

            function isNexusTradeLoan() {
                if (loanAmount >= 10000 && loanAmount <= 2500000 &&// Inclusive 2.5 mil?
                    testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [
                            reasonForFinanceGuids['Money to buy stock'],
                            reasonForFinanceGuids['Cash flow assistance'],
                            reasonForFinanceGuids['Money to help with a contract'],
                            reasonForFinanceGuids['Money to help with a tender'],
                            reasonForFinanceGuids['Purchase order funding']
                        ]
                    ) == true) {
                    if(testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [
                            reasonForFinanceGuids['Money to buy stock'],
                            reasonForFinanceGuids['Cash flow assistance'],
                            reasonForFinanceGuids['Money to help with a contract']
                        ]
                    ) == true) {
                        if (hasContract == 'No') {
                            return false;
                        }
                    }
                    if (reasonForFinanceGuid == FundingForGuids.MoneyToHelpWithTender) {
                        if (hasTender == 'No') {
                            return false;
                        }
                    }
                    if (reasonForFinanceGuid == FundingForGuids.PurchaseOrderFunding) {
                        if (hasPurchaseOrder == 'No') {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            }

            function isWorkFlowContractorLoan() {
                if (loanAmount >= 350000 && loanAmount <= 20000000 &&// Inclusive 20 mil?
                    testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [
                            reasonForFinanceGuids['Money to buy stock'],
                            reasonForFinanceGuids['Cash flow assistance'],
                            reasonForFinanceGuids['Money to help with a contract'],
                            reasonForFinanceGuids['Money to help with a tender'],
                            reasonForFinanceGuids['Guarantee for construction project'],
                            reasonForFinanceGuids['Working capital']
                        ]
                    ) == true &&
                    industrySector == 'F') {
                    if (testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [
                            reasonForFinanceGuids['Money to buy stock'],
                            reasonForFinanceGuids['Cash flow assistance'],
                            reasonForFinanceGuids['Money to help with a contract']
                        ]
                    ) == true) {
                        if (hasContract == 'No') {
                            return false;
                        }
                    }
                    if (reasonForFinanceGuid == FundingForGuids.MoneyToHelpWithTender) {
                        if (hasTender == 'No') {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            }

            function isRiskCapitalProjectDevelopmentFinance() {
                if (loanAmount >= 150000 && loanAmount <= 1500000 &&
                    testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [
                            reasonForFinanceGuids['Money for concept development (pre-feasibility studies/scoping)']
                        ]
                    ) == true) {
                    return true;
                } else {
                    return false;
                }
            }

            function isRiskCapitalBusinessFinance() {
                if (loanAmount <= 3000000 &&
                    tradingTime >= 6 &&
                    testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [
                            reasonForFinanceGuids['TotalFundingRequirements20Percent']
                        ]
                    ) == true) {
                    return true;
                } else {
                    return false;
                }
            }

            function isTermLoanPowerPlus() {
                if (loanAmount <= 500000 &&
                    testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [
                            reasonForFinanceGuids['Start-up funding'],
                            reasonForFinanceGuids['Business expansion'],
                            reasonForFinanceGuids['Working capital'],
                            reasonForFinanceGuids['Money to buy stock'],
                            reasonForFinanceGuids['Buying equipment'],
                            reasonForFinanceGuids['Capital expenditure'],
                            reasonForFinanceGuids['Operational expenditure'],
                            reasonForFinanceGuids['Buying machinery'],
                            reasonForFinanceGuids['Shopfitting/renovations'],
                            reasonForFinanceGuids['Infrastructure finance'],
                            reasonForFinanceGuids['Property development']
                        ]
                    ) == true) {
                    return true;
                } else {
                    return false;
                }
            }

            function isTermLoanTermCap() {
                if (loanAmount <= 20000000 &&
                    testReasonForFinanceOR(
                        reasonForFinanceGuid,
                        [
                            reasonForFinanceGuids['Start-up funding'],
                            reasonForFinanceGuids['Business expansion'],
                            reasonForFinanceGuids['Working capital'],
                            reasonForFinanceGuids['Money to buy stock'],
                            reasonForFinanceGuids['Buying equipment'],
                            reasonForFinanceGuids['Capital expenditure'],
                            reasonForFinanceGuids['Operational expenditure'],
                            reasonForFinanceGuids['Buying machinery'],
                            reasonForFinanceGuids['Shopfitting/renovations'],
                            reasonForFinanceGuids['Infrastructure finance'],
                            reasonForFinanceGuids['Property development']
                        ]
                    ) == true) {
                    return true;
                } else {
                    return false;
                }
            }

            if (self.isInvabaCooperativeFund_Enterprise(loanAmount, companyGuid, reasonForFinanceGuid, isInvolvedInRunningDailyActivitiesOfCooperative, hasAnyOtherLoanWithECDC) == true) {
                return productGuids['InvabaCooperativeFundEnterprise'];
            }

            let isCoop = getIsCoop(companyGuid);
            if (isCoop == true) {

                if (isInvabaCooperativeFund(loanAmount, companyGuid, reasonForFinanceGuid) == true) {
                    return productGuids['InvabaCooperativeFund'];
                }

                if (isJobStimulus() == true) {
                    return productGuids['JobStimulusFund'];
                }

                if (isSTRTEP() == true) {
                    return productGuids['Strtep'];
                }

                if (loanAmount > 2000000) {
                    return null;
                }

                // What if all the above conditions fail??? Well.... Sorry for you.
            } else {
                if (testCompanyGuidOR(
                    companyGuid,
                    [
                        companyGuids['(Pty) Ltd'],
                        companyGuids['Close Corporation'],
                        companyGuids['Partnership'],
                        companyGuids['Trust'],
                        companyGuids['Sole Proprietor']
                    ]
                ) == true) {
                    if (isSTRTEP() == true) {
                        return productGuids['Strtep'];
                    }

                    if (isNexusTradeLoan() == true) {
                        return productGuids['NexusTradeLoan'];
                    }

                    if (isWorkFlowContractorLoan() == true) {
                        return productGuids['WorkFlowContractorLoan'];
                    }

                    if (isJobStimulus() == true) {
                        return productGuids['JobStimulusFund'];
                    }

                    if (isRiskCapitalProjectDevelopmentFinance() == true) {
                        return productGuids['RiskCapitalProjectDevelopmentFinance'];
                    }

                    if (isRiskCapitalBusinessFinance() == true) {
                        return productGuids['RiskCapitalBusinessFinance'];
                    }

                    if (isTermLoanPowerPlus() == true) {
                        return productGuids['TermLoanPowerPlus'];
                    }

                    if (isTermLoanTermCap() == true) {
                        return productGuids['TermLoanTermCap'];
                    }

                    return null;
                } else {
                    // Do a further company check.
                    if (testCompanyGuidOR(
                        companyGuid,
                        [
                            companyGuids['Limited by Guarentee'],
                            companyGuids['Internationally Registered Company'],// ???
                            companyGuids['External company under Section 21A'],// ???
                            companyGuids['Inc'],
                            companyGuids['Unlimited'],
                            companyGuids['Primary Co-operative'],
                            companyGuids['Secondary Co-operative'],
                            companyGuids['Tertiary Co-operative'],
                            companyGuids['Statutory Body']
                        ]
                    ) == true) {
                        if (isSTRTEP() == true) {
                            return productGuids['Strtep'];
                        } else {
                            return null;
                        }

                    } else {
                        return null;
                    }

                }

            }
            return null;
        }
    }

    page.companyGuids = companyGuids;

    page.fundingForGuids = reasonForFinanceGuids;

    page.productGuids = productGuids;

    page.create = function () {
        return new AppCommon();
    }

    page.AppCommon = AppCommon;

})(app.wizard.common.page);
