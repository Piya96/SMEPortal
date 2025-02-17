using SME.Portal.Common.Dto;
using SME.Portal.Company.Dtos;
using SME.Portal.List.Dtos;
using SME.Portal.SME.Dtos.Applications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;

namespace SME.Portal.SME.Dtos
{
    public partial class ApplicationCriteriaDto
    {
        public ApplicationCriteriaDto(List<NameValuePairDto> criteria, SmeCompanyDto companyDto, OwnerDto ownerDto, List<ListItemDto> listItems, string tenancyName)
        {
            // TenancyName
            TenancyName = tenancyName;

            Criteria = criteria;

            #region criteria: 1 Loan Amount - we use all Lenders for matching 
            LoanAmount = GetLongFromString(Criteria.FirstOrDefault(x => x.Name == "loanamount")?.Value);
            #endregion

            #region criteria: 2 Finance For - we use lenders from criteria #1 matches
            FinanceForListId = Criteria.FirstOrDefault(x => x.Name == "financefor")?.Value;
            FinanceForSubListId = GetFinanceForSubListId(Criteria, FinanceForListId);
            #endregion

            #region criteria: 3 SA Citizen 
            // TODO this needs to be figured out: ownerDto.VerificationRecordJson
            IsSouthAfricanCitizen = true;
            IsPermanentResident = true;

            if (ownerDto.IsIdentityOrPassportConfirmed)
            {
                IsSouthAfricanCitizen = true;
                IsPermanentResident = true;
            }
            #endregion

            #region criteria: 4 Age - NOT MATCHED
            
            #endregion
            
            #region  criteria: 5 Race - NOT MATCHED
            
            #endregion
            
            #region criteria: 6 Gender - NOT MATCHED

            #endregion

            #region criteria: 7 Company Reg Type
            CompanyRegistrationTypeListId = companyDto.Type;
            #endregion

            #region criteria: 8 Province
            var provinceSlug = companyDto.RegisteredAddress.Split(',').ToList().Last().ToLower();
            ProvinceListId = listItems.FirstOrDefault(x => x.Slug == provinceSlug)?.ListId;
            #endregion

            #region criteria: 9 Years/Months Trading
            
            if (companyDto.StartedTradingDate.HasValue)
            {
				//var StartedTradingDate = Criteria.FirstOrDefault(x => x.Name == "date-company-profile-started-trading-date")?.Value;
				//if(StartedTradingDate != null)
				//{
					//string[] dateFormats = new[] { "yyyy/MM/dd", "MM/dd/yyyy", "dd/MM/yyyy", "MM/dd/yyyyHH:mm:ss" };
					//CultureInfo provider = new CultureInfo("en-US");
					//DateTime date = DateTime.ParseExact(StartedTradingDate, dateFormats, provider, DateTimeStyles.AdjustToUniversal);
					//YearStartedToTrade = date.Year;
					//MonthStartedToTrade = date.Month;
					//DateTime date = DateTime.Parse(StartedTradingDate);
					var startedDate = companyDto.StartedTradingDate.Value;
					YearStartedToTrade = startedDate.Year;
					MonthStartedToTrade = startedDate.Month;
					MonthsTrading = Math.Abs(12 * (DateTime.Now.Year - (int)YearStartedToTrade.Value) + DateTime.Now.Month - MonthStartedToTrade.Value);
				//}
            }
            #endregion

            #region criteria: 10 Average Annual Turnover

            AverageAnnualTurnoverListId = Criteria.FirstOrDefault(x => x.Name == "annualturnover")?.Value;
            var annualTurnoverListItem = listItems.FirstOrDefault(x => x.ListId == AverageAnnualTurnoverListId);
            AnnualTurnover = annualTurnoverListItem?.Name;

            if (annualTurnoverListItem != null)
            {
                AverageAnnualTurnoverMin = long.Parse(annualTurnoverListItem.MetaOne);
                AverageAnnualTurnoverMax = long.Parse(annualTurnoverListItem.MetaTwo);
            }
            
            #endregion

            #region criteria: 11 Industry Sector
            IndustrySectorListId = companyDto.Industries;
			#endregion

			#region criteria: 12 Customer Types / Supply Chain - NOT MATCHED
			#endregion

			#region criteria: 13 Monthly Income
			MinimumMonthlyTurnover = (int)AverageAnnualTurnoverMax;
            #endregion

            #region criteria: 14 Income Received - NOT MATCHED
            #endregion

            #region criteria: 15 Profitability
            IsProfitable = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessisprofitable")?.Value);
            #endregion

            #region criteria: 16 Collateral
            HasCollateral = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businesshascolateral")?.Value);
            #endregion

            #region criteria: 52 Ownership

            BlackOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "blackownedpercentage")?.Value);
            BlackAllOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "blackallownedpercentage")?.Value);
            WhiteOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "whiteownedpercentage")?.Value);
            NonSouthAfricanOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "nonsouthafricanownedpercentage")?.Value);
            BlackWomenOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "blackwomenownedpercentage")?.Value);
            WomenOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "womenownedpercentage")?.Value);
            DisabledOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "disabledownedpercentage")?.Value);
            YouthOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "youthownedpercentage")?.Value);
            MilitaryVeteranOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "militaryveteranownedpercentage")?.Value);
            NumberOfOwners = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "numberofowners")?.Value);

            #endregion

            #region Employees

            NumberOfFullTimeEmployees = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "numberoffulltimeemployees")?.Value);
            NumberOfFullTimeWomanEmployees = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "numberoffulltimewomenemployees")?.Value);
            NumberOfFullTimeEmployeesUnder35 = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "numberoffulltimeemployeesunder35")?.Value);
            NumberOfPartTimeEmployees = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "numberofparttimeemployees")?.Value);
            NumberOfPartTimeWomanEmployees = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "numberofparttimewomenemployees")?.Value);
            NumberOfPartTimeEmployeesUnder35 = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "numberofparttimeemployeesunder35")?.Value);

            #endregion

            #region Compliance
            Compliance = new ComplianceDto()
            {
                ComplianceOwnerAdverseCreditBureau = Criteria.FirstOrDefault(x => x.Name == "ownerssadversecreditlistings")?.Value,
                ComplianceOwnerCreditBureauArrangement = Criteria.FirstOrDefault(x => x.Name == "ownersmadearrangements")?.Value,
                ComplianceOwnerUnderDebtReview = Criteria.FirstOrDefault(x => x.Name == "ownersunderdebtreview")?.Value,
                ComplianceOwnerInsolvency = Criteria.FirstOrDefault(x => x.Name == "ownersdeclaredinsolvent")?.Value,
                ComplianceOwnerInsolvencyRehabilitated = Criteria.FirstOrDefault(x => x.Name == "ownersrehabilitated")?.Value,
                ComplianceCompanyAdverseCreditBureau = Criteria.FirstOrDefault(x => x.Name == "directorsadversecreditlistings")?.Value,
                ComplianceCompanyCreditBureauArrangement = Criteria.FirstOrDefault(x => x.Name == "directorsmadearrangements")?.Value,
                ComplianceCompanyUnderDebtReview = Criteria.FirstOrDefault(x => x.Name == "directorsunderdebtreview")?.Value,
                ComplianceCompanyInsolvency = Criteria.FirstOrDefault(x => x.Name == "directorsdeclaredinsolvent")?.Value,
                ComplianceCompanyInsolvencyRehabilitated = Criteria.FirstOrDefault(x => x.Name == "directorsrehabilitated")?.Value,
                ComplianceHonestDeclaration = Criteria.FirstOrDefault(x => x.Name == "summarydeclaration")?.Value
            };

            #endregion

            #region SmmeDocs
            SmmeDocs = new List<SmmeDocDto>();
            // CIPC - Company Registration Documents
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5aaf6d123a022727ec3b587a", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5aaf6d123a022727ec3b587a")?.Value });
            // CIPC - Annual Returns
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "60549c63a2b3b4fb7c24bb34", DocStatus = Criteria.FirstOrDefault(x => x.Name == "60549c63a2b3b4fb7c24bb34")?.Value });
            // Certified Copies of Owners ID
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cdb53efed8141436959b", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cdb53efed8141436959b")?.Value });
            // Proof of Business Address
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5b2a54ecb958c008605883ff", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5b2a54ecb958c008605883ff")?.Value });
            // BEE Certificate
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "60549db9e3032aa608a98cc1", DocStatus = Criteria.FirstOrDefault(x => x.Name == "60549db9e3032aa608a98cc1")?.Value });
            // Company Bank Statements
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5aaf6d193a022727ec3b587b", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5aaf6d193a022727ec3b587b")?.Value });
            // 12 Months Budget and Projections
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0ce1d3efed814143695a1", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0ce1d3efed814143695a1")?.Value });
            // Statements of Assets and Liabilities
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cdd73efed8141436959d", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cdd73efed8141436959d")?.Value });
            // Tax Clearance Cert
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cdc33efed8141436959c", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cdc33efed8141436959c")?.Value });
            // Business Plan
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cde13efed8141436959e", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cde13efed8141436959e")?.Value });
            // Management Accounts
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cdfc3efed814143695a0", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cdfc3efed814143695a0")?.Value });
            // Annual Financial Statement
            SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cded3efed8141436959f", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cded3efed8141436959f")?.Value });

            #endregion

            #region criteria: 66 Bee Level
            BeeLevelListId = companyDto.BeeLevel;
			//BeeLevelListId = Criteria.FirstOrDefault(x => x.Name == "select-company-profile-bee-level")?.Value;
			#endregion

			#region Finance For Sub

			#region Working Capital

			// Cash for Invoice
			if (FinanceForSubListId == "59cc9d26132f4c40c446a4f7")
            {
                var customerProfileListId = Criteria.FirstOrDefault(x => x.Name == "cashforinvoicecustomer")?.Value;

                CashForAnInvoice = new CashForInvoiceDto
                {
                    // criteria: 21 Cash for an invoice - Invoice value
                    InvoiceValue = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "cashforaninvoiceamount")?.Value),

                    // criteria: 22 Cash for an invoice - Customer Profile
                    CustomerProfileListId = customerProfileListId,

                    // List Item literal
                    CustomerProfile = GetListNameFor(customerProfileListId, listItems)
                };
            }

            // Money for Contract
            if (FinanceForSubListId == "59cca8a430e9df02c82d0795")
            {
                var customerProfileListId = Criteria.FirstOrDefault(x => x.Name == "moneyforcontractcustomer")?.Value;

                MoneyForContract = new MoneyForContractDto
                {
                    // criteria: 23 Money for contract - Contract value
                    ContractAmount = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "moneyforcontractvalue")?.Value),

                    // criteria: 24 Money for contract - Customer Profile
                    CustomerProfileListId = customerProfileListId,

                    // list item literal
                    CustomerProfile = GetListNameFor(customerProfileListId, listItems),

                    // criteria: 25 Money for contract - Experience
                    Experience = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "moneyforcontractcompanyexperience")?.Value)
                };
            }

            // Money for Tender
            if (FinanceForSubListId == "59cca89030e9df02c82d0794")
            {
                var customerProfileListId = Criteria.FirstOrDefault(x => x.Name == "moneyfortendercustomer")?.Value;

                MoneyForTender = new MoneyForTenderDto
                {
                    // criteria: 26 Money for tender - Tender value
                    TenderValue = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "moneyfortendervalue")?.Value),

                    // criteria: 27 Money for tender - Customer Profile
                    CustomerProfileListId = customerProfileListId,

                    CustomerProfile = GetListNameFor(customerProfileListId, listItems),

                    // criteria: 28 Money for tender - Experience
                    Experience = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "moneyfortendercompanyexperience")?.Value)
                };
            }

            // Cash for Retailers
            //criteria: 56 - Income Received
            HowIncomeReceivedListIds = string.Join(",", Criteria.Where(x => x.Name == "cardmachinepaymenttypes")?.Select(x => x.Value).ToList());

            //criteria: 57 - Monthly Income Retail
            MonthlyIncomeRetail = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "monthlyincomeincomevalue")?.Value);

            // Purchase Order Funding
            if (FinanceForSubListId == "5b213996b958c008605883e8")
            {
                var customerProfileListId = Criteria.FirstOrDefault(x => x.Name == "purchaseordercustomer")?.Value;

                PurchaseOrderFunding = new PurchaseOrderFundingDto
                {
                    //criteria: 53 - Purchase Order Funding - Contract value
                    FundingAmount = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "purchaseordervalue")?.Value),

                    //criteria: 54 - Purchase Order Funding - Customer Profile
                    CustomerProfileListId = customerProfileListId,

                    CustomerProfile = GetListNameFor(customerProfileListId, listItems),

                    //criteria: 55 - Purchase Order Funding- Experience
                    Experience = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "purchaseordercustomerexperience")?.Value)
                };
            }

            // Cashflow Assistance
            if(FinanceForSubListId == "59cc9d36132f4c40c446a4f8")
            {
                // criteria 66 - Has Point of sale
                var hasPoS = Criteria.FirstOrDefault(x => x.Name == "hasposdevice")?.Value == "No" ? false : true;

                CashFlowAssistance = new CashFlowAssistanceDto() { HasPosDevice = hasPoS };
            }

            
            #endregion

            #region Asset Finance

            // Buying Business Property
            if (FinanceForSubListId == "59d2694720070a604097b047")
            {
                var propertyTypeListId = Criteria.FirstOrDefault(x => x.Name == "buyingbusinesspropertytype")?.Value;

                BuyingBusinessProperty = new BuyingBusinessPropertyDto
                {
                    // criteria: 29 - Buying business property - property value
                    PropertyValue = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "buyingbusinesspropertyvalue")?.Value),

                    // criteria: 30 - Buying business property - Property type
                    PropertyTypeListId = propertyTypeListId,

                    // ListItem literal
                    PropertyType = GetListNameFor(propertyTypeListId, listItems)
                };
            }

            // Property Development
            if (FinanceForSubListId == "59d2695420070a604097b048")
            {
                var developmentTypeListId = Criteria.FirstOrDefault(x => x.Name == "propertydevelopmenttype")?.Value;

                PropertyDevelopment = new PropertyDevelopmentDto
                {
                    // criteria: 33 Property Development - development type
                    DevelopmentTypeListId = developmentTypeListId,
                    
                    // ListItem literal
                    DevelopmentType = GetListNameFor(developmentTypeListId, listItems)
                };
            }

            // Shopfitting Renovations
            if (FinanceForSubListId == "59d2693920070a604097b046")
            {
                var propertyTypeListId = Criteria.FirstOrDefault(x => x.Name == "shopfittingpropertytype")?.Value;

                ShopFittingRenovations = new ShopFittingRenovationsDto
                {
                    // criteria: 31 Shop Fitting Renovations - unbonded - shopfittingpropbonded
                    IsPropertyBonded = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "shopfittingpropbonded")?.Value),

                    // criteria: 32 Shop Fitting Renovations - Property type - shopfittingpropertytype
                    PropertyTypeListId = propertyTypeListId,

                    // ListItem literal
                    PropertyType = GetListNameFor(propertyTypeListId, listItems)
                };
            }

            #endregion

            #region Growth Finance

            // Business Expansion
            if (FinanceForSubListId == "59d269bd20070a604097b04a")
            {
                BusinessExpansion = new BusinessExpansionDto
                {
                    // criteria: 34 Business expansion - equity
                    WillSellShares = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "willingtosellshares")?.Value),

                    // criteria: 35 Business expansion - job creation
                    IncreasedEmployees = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinincreasedemployees")?.Value),

                    // criteria: 36 - Business expansion - profitability
                    IncreasedProfitability = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinincreasedprofitability")?.Value),

                    // criteria: 37 - Business expansion - exports
                    IncreasedExports = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinincreasedexports")?.Value),

                    // criteria: 38 - Business expansion - empowerment
                    Empowerment = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultineconomicempowerment")?.Value),

                    // criteria: 39 - Business expansion - rural
                    RuralDevelopment = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinsustainabledev")?.Value),

                    // criteria: 40 - Business expansion - social
                    SolvesSocial = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinsolveenvchallenges")?.Value)
                };
            }

            // Product Service Expansion
            if (FinanceForSubListId == "59d269c920070a604097b04b")
            {
                var typeOfExpansionListId = Criteria.FirstOrDefault(x => x.Name == "productserviceexpansiontype")?.Value;

                ProductServiceExpansion = new ProductServiceExpansionDto
                {
                    //criteria: 41 - Product Service expansion -type of expansion
                    TypeOfExpansionListId = typeOfExpansionListId,

                    // ListItem literal
                    TypeOfExpansion = GetListNameFor(typeOfExpansionListId, listItems)
                };
            }

            #endregion

            #region Franchise Acquisition

            // Buying a Franchise
            if (FinanceForSubListId == "59c2c7087c83b736d463c255")
            {
                BuyingAFranchise = new BuyingAFranchiseDto
                {
                    //criteria: 42 - Buying a franchise - accredited
                    Accredited = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "buyingafranchisefranchiseaccredited")?.Value),

                    //criteria: 43 - Buying a franchise - preapproved
                    Preapproved = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "preapprovedbyfranchisor")?.Value)
                };
            }

            // BEE partner
            if (FinanceForSubListId == "59d26a3120070a604097b04f")
            {
                BeePartner = new BeePartnerDto
                {
                    //criteria: 48 - BEE Partner - min bee
                    MinimumBeeShareholding = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "beepartnerfranchiseaccredited")?.Value)
                };
            }

            // Buy an existing Business
            if (FinanceForSubListId == "59d26a1620070a604097b04d")
            {
                var businessTypeListId = Criteria.FirstOrDefault(x => x.Name == "fundingtobuyanexistingbusinesstype")?.Value;
                var industrySubSectorListId = Criteria.FirstOrDefault(x => x.Name == "industry-sub-sector")?.Value;

                BuyingABusiness = new BuyingABusinessDto
                {
                    //criteria: 45 - Buying a business - industry sector
                    IndustrySectorLevel1ListId = GetListParentListId(industrySubSectorListId, listItems),
                    IndustrySectorListId = industrySubSectorListId,

                    //criteria: 46 - Buying a business - business type
                    BusinessTypeListId = businessTypeListId,

                    BusinessType = GetListNameFor(businessTypeListId, listItems),

                    //criteria: 47 - Buying a business - rural 
                    RuralOrTownship = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businesslocatedinruralarea")?.Value)
                };
            }

            // Partner Management Buyout
            if (FinanceForSubListId == "59d26a2620070a604097b04e")
            {
                PartnerManagementBuyOut = new PartnerManagementBuyOutDto
                {
                    //criteria: 44 - Partner management buyout - min bee
                    MinimumBeeShareholding = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "shareholdinggreaterthanperc")?.Value)
                };
            }

            #endregion

            #region Research Innovation

            // Commercialising Research
            if (FinanceForSubListId == "5acb25f862ba593724e0a788")
            {
                var productListIds = Criteria.FirstOrDefault(x => x.Name == "commresindustries")?.Value;

                CommercialisingResearch = new CommercialisingResearchDto
                {
                    // criteria: 61 Student Status 
                    StudentStatus = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "commresstudentstatus")?.Value),

                    // criteria: 62 - Increase exports 
                    IncreasedExports = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "commreswillincexports")?.Value),

                    // criteria: 63 - Job creations 
                    JobCreation = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "commresresultinjobcreation")?.Value),

                    // criteria: 64 - Innovation 
                    Innovation = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "commresintroinnov")?.Value),

                    // criteria: 65 - Products 
                    ProductListIds = productListIds,

                    // ListItem literal
                    Products = GetListNamesFor(productListIds, listItems)
                };
            }

            #endregion

            #region Other Funding

            // Business Processing Services
            if (FinanceForSubListId == "59d26d8720070a604097b059")
            {
                BusinessProcessingServices = new BusinessProcessingServicesDto
                {
                    //criteria: 58 - Job Creation 
                    JobCreation = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "willworkgenerate50newjobs")?.Value),

                    //criteria: 59 - Secure Contracts 
                    SecureContracts = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "doyouhavecontractsforbps")?.Value),

                    //criteria: 60 - Youth Jobs will80percofjobsbeforyouth
                    YouthJobs = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "will80percofjobsbeforyouth")?.Value)
                };
            }

            // Export
            if (FinanceForSubListId == "59d26a6420070a604097b052")
            {
                Export = new ExportDto
                {
                    ConfirmedExportOrder = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "haveconfirmedorders")?.Value)
                };
            }

            // Import
            if (FinanceForSubListId == "59d26d3120070a604097b053")
            {
                Import = new ImportDto
                {
                    SignedContract = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "havesignedcontracts")?.Value)
                };
            }

            #endregion

            #endregion

            #region Other
            var businessBankListId = Criteria.FirstOrDefault(x => x.Name == "bank")?.Value;
            if(!string.IsNullOrEmpty(businessBankListId))
                BusinessBank = listItems.FirstOrDefault(x => x.ListId == businessBankListId).Name;

            var bankServiceListIds = criteria.Where(x => x.Name == "bankaccservices").Select(x => x.Value).ToList();
            if (bankServiceListIds.Count > 0)
            {
                var bankServices = new List<string>();
                foreach (var bankService in bankServiceListIds)
                    bankServices.Add($"{listItems.FirstOrDefault(x => x.ListId == bankService)?.Name}");
                BankAccountServices = String.Join(",", bankServices).Replace(",", ", ");
            }

            var otherBusinessLoansListId = Criteria.FirstOrDefault(x => x.Name == "whoistheloanfrom")?.Value;
            if (!string.IsNullOrEmpty(otherBusinessLoansListId))
                OtherBusinessLoans = listItems.FirstOrDefault(x => x.ListId == otherBusinessLoansListId)?.Name;

            var personalBankListId = Criteria.FirstOrDefault(x => x.Name == "personalbank")?.Value;
            if (!string.IsNullOrEmpty(personalBankListId))
                PersonalBank = listItems.FirstOrDefault(x => x.ListId == personalBankListId)?.Name;

            var electronicAccountingSystemsListId = Criteria.FirstOrDefault(x => x.Name == "elecaccsystems")?.Value;
            if (!string.IsNullOrEmpty(electronicAccountingSystemsListId))
                ElectronicAccountingSystems = listItems.FirstOrDefault(x => x.ListId == electronicAccountingSystemsListId)?.Name;

            OtherElectronicAccountingSystems = Criteria.FirstOrDefault(x => x.Name == "elecaccsystemother")?.Value;

            var payrollSystemListId = Criteria.FirstOrDefault(x => x.Name == "payrollsystems")?.Value;
            if (!string.IsNullOrEmpty(payrollSystemListId))
                PayrollSystem = listItems.FirstOrDefault(x => x.ListId == payrollSystemListId)?.Name;

            OtherPayrollSystem = Criteria.FirstOrDefault(x => x.Name == "payrollsystemother")?.Value;
            
            InvestedOwnMoney = Criteria.FirstOrDefault(x => x.Name == "hasinvestedownmoney")?.Value;

            DoYouKnowYourPersonalCreditScore = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "doyouknowyourpersonalcreditscore")?.Value);
            HasElecAccSystems = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "haselecaccsystems")?.Value);
            HasPayroll = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "haspayroll")?.Value);
            WantToUploadBusBankStatements = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "wanttouploadbusbankstatements")?.Value);
            BusinessTxPersonalAcc = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businesstxpersonalacc")?.Value);
            RegularMonthlyIncome = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "regularmonthlyincome")?.Value);

            SeeksFundingAdvice = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "name-input-seeks-funding-advice")?.Value);
            
            #endregion
        }

        public static string GetFinanceForSubListId(List<NameValuePairDto> criteria, string financeForListId )
        {

            if (financeForListId == "59c35d64463361150873b641")
            {
                return criteria.FirstOrDefault(x => x.Name == "assetfinancetype").Value;
            }
            else if (financeForListId == "59c2c6b37c83b736d463c251")
            {
                return criteria.FirstOrDefault(x => x.Name == "workingcapitaltype").Value;
            }
            else if (financeForListId == "59c5d92b5eac2311202772f5")
            {
                return criteria.FirstOrDefault(x => x.Name == "growthfinancetype").Value;
            }
            else if (financeForListId == "59c2c6f77c83b736d463c254")
            {
                return criteria.FirstOrDefault(x => x.Name == "franchiseacquisitiontype").Value;
            }
            else if (financeForListId == "59c5d95c5eac2311202772f6")
            {
                return criteria.FirstOrDefault(x => x.Name == "researchinnovationfundingtype").Value;
            }
            else if (financeForListId == "59c5d96b5eac2311202772f7")
            {
                return criteria.FirstOrDefault(x => x.Name == "otherfinancetype").Value;
            }

            return string.Empty;
        }


        #region Utility Methods

        private string GetListNamesFor(string productListIds, List<ListItemDto> listItems)
        {
            var response = string.Empty;
            foreach(var item in productListIds.Split(',').ToList())
                response = response + item + ",";

            return response;
        }

        private string GetListNameFor(string propertyTypeListId, List<ListItemDto> listItems)
        {
            return listItems.FirstOrDefault(x => x.ListId == propertyTypeListId)?.Name;
        }

        private string GetListParentListId(string propertyTypeListId, List<ListItemDto> listItems)
        {
            return listItems.FirstOrDefault(x => x.ListId == propertyTypeListId)?.ParentListId;
        }

        private int? GetIntOrNull(string value)
        {
            if (string.IsNullOrEmpty(value))
                return null;

            value = value.Replace(" ", "");

            int index = value.IndexOf(".");

            if (index >= 0)
                value = value.Substring(0, index);

            return int.TryParse(value, out int intValue) ? intValue : (int?)null;
        }

        private long GetLongFromString(string value)
        {
            if (string.IsNullOrEmpty(value))
                return 0;

            value = value.Replace(" ", "");
            
            int index = value.IndexOf(".");

            if (index >= 0)
                value = value.Substring(0, index);

            return long.TryParse(value, out long longValue) ? longValue : 0;
        }

        private decimal? GetDecimalOrNull(string value)
        {
            if (string.IsNullOrEmpty(value))
                return null;

            value = value.Replace(" ", "");

            return decimal.TryParse(value, out decimal decValue) ? decValue : 0;
        }

        private bool? GetBoolOrNull(string value)
        {
            if (string.IsNullOrEmpty(value))
                return null;

            if (value.ToLower() == "yes")
                return true;

            if (value.ToLower() == "no")
                return false;

            return null;
        }
        #endregion

        #region Matching Properties
        public long LoanAmount { get; set; }
        public string AnnualTurnover { get; set; }
        public string FinanceForListId { get; set; }
        public bool? IsSouthAfricanCitizen { get; set; }
        public bool? IsPermanentResident { get; set; }
        public string CompanyRegistrationTypeListId { get; set; }
        public string ProvinceListId { get; set; }
        public int? YearStartedToTrade { get; set; }
        public int? MonthStartedToTrade { get; set; }
        public int? MonthsTrading { get; set; }
        public string FinanceForSubListId { get; set; }

        public string AverageAnnualTurnoverListId { get; set; }
        public long AverageAnnualTurnoverMin { get; set; }
        public long AverageAnnualTurnoverMax { get; set; }
        public int MinimumMonthlyTurnover { get; set; }
        public string IndustrySectorListId { get; set; }
        public bool? IsProfitable { get; set; }
        public bool? HasCollateral { get; set; }
        public string BeeLevelListId { get; set; }

        public string BusinessBank { get; set; }
        public string BankAccountServices { get; set; }
        public string PersonalBank { get; set; }
        public string OtherBusinessLoans { get; set; }
        public string ElectronicAccountingSystems { get; set; }
        public string OtherElectronicAccountingSystems { get; set; }
        public string PayrollSystem { get; set; }
        public string OtherPayrollSystem { get; set; }
        public string InvestedOwnMoney { get; set; }
        public bool? DoYouKnowYourPersonalCreditScore { get; set; }
        public bool? HasElecAccSystems { get; set; }
        public bool? HasPayroll { get; set; }
        public bool? WantToUploadBusBankStatements { get; set; }
        public bool? BusinessTxPersonalAcc { get; set; }
        public bool? RegularMonthlyIncome { get; set; }

        public decimal? BlackOwnedPercentage { get; set; }
        public decimal? BlackAllOwnedPercentage { get; set; }
        public decimal? WhiteOwnedPercentage { get; set; }
        public decimal? NonSouthAfricanOwnedPercentage { get; set; }
        public decimal? BlackWomenOwnedPercentage { get; set; }
        public decimal? WomenOwnedPercentage { get; set; }
        public decimal? DisabledOwnedPercentage { get; set; }
        public decimal? YouthOwnedPercentage { get; set; }
        public decimal? MilitaryVeteranOwnedPercentage { get; set; }
        public decimal? NumberOfOwners { get; set; }

        public decimal? NumberOfFullTimeEmployees { get; set; }
        public decimal? NumberOfFullTimeWomanEmployees { get; set; }
        public decimal? NumberOfFullTimeEmployeesUnder35 { get; set; }
        public decimal? NumberOfPartTimeEmployees { get; set; }
        public decimal? NumberOfPartTimeWomanEmployees { get; set; }
        public decimal? NumberOfPartTimeEmployeesUnder35 { get; set; }
        

        public CashForInvoiceDto CashForAnInvoice { get; set; }
        public MoneyForContractDto MoneyForContract { get; set; }
        public MoneyForTenderDto MoneyForTender { get; set; }
        public BuyingBusinessPropertyDto BuyingBusinessProperty { get; set; }
        public ShopFittingRenovationsDto ShopFittingRenovations { get; set; }
        public PropertyDevelopmentDto PropertyDevelopment { get; set; }
        public BusinessExpansionDto BusinessExpansion { get; set; }
        public ProductServiceExpansionDto ProductServiceExpansion { get; set; }
        public BuyingAFranchiseDto BuyingAFranchise { get; set; }
        public PartnerManagementBuyOutDto PartnerManagementBuyOut { get; set; }
        public BuyingABusinessDto BuyingABusiness { get; set; }
        public BeePartnerDto BeePartner { get; set; }
        public ExportDto Export { get; set; }
        public ImportDto Import { get; set; }
        public PurchaseOrderFundingDto PurchaseOrderFunding { get; set; }
        public string HowIncomeReceivedListIds { get; set; }
        public int? MonthlyIncomeRetail { get; set; }
        public BusinessProcessingServicesDto BusinessProcessingServices { get; set; }
        public CommercialisingResearchDto CommercialisingResearch { get; set; }

        public List<NameValuePairDto> Criteria { get; set; }
        public string TenancyName { get; set; }
        public CashFlowAssistanceDto CashFlowAssistance { get; set; }
        public ComplianceDto Compliance { get; set; }
        public List<SmmeDocDto> SmmeDocs { get; set; }
        #endregion

        public bool? SeeksFundingAdvice { get; set; }
    }


}
