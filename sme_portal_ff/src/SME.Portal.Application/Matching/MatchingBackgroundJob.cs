using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading;
using Newtonsoft.Json;
using SME.Portal.Common.Dto;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using SME.Portal.Currency;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.Lenders;
using SME.Portal.Lenders.Dtos;
using SME.Portal.List;
using SME.Portal.List.Dtos;
using SME.Portal.Qlana;
using SME.Portal.SME;
using SME.Portal.SME.Dtos;
using SME.Portal.SME.Dtos.Applications;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SME.Portal.Matching
{
    public class MatchingBackgroundJob : BackgroundJob<MatchApplicationDto>, ITransientDependency
    {
        private readonly IRepository<Application, int> _applicationRepo;
        private readonly IRepository<FinanceProduct, int> _financeProductsRepo;
        private readonly IRepository<Owner, long> _ownersRepo;
        private readonly IRepository<SmeCompany, int> _companiesRepo;
        private readonly IRepository<Match, int> _matchesRepo;
        private readonly IRepository<Lender, int> _lenderRepo;
        private readonly IRepository<CurrencyPair, int> _currencyPairRepo;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<ListItem, int> _listRepository;
        private readonly IRepository<MultiTenancy.Tenant, int> _tenantRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        MatchingCriteriaDto _matchCriteria;

        public MatchingBackgroundJob( IRepository<Application, int> applicationRepo, 
                                        IRepository<FinanceProduct, int> financeProductsRepo,
                                        IRepository<Owner, long> ownersRepo,
                                        IRepository<SmeCompany, int> companiesRepo,
                                        IRepository<Match, int> matchesRepo,
                                        IRepository<Lender, int> lenderRepo,
                                        IUnitOfWorkManager unitOfWorkManager, 
                                        IRepository<ListItem, int> listRepository,
                                        IBackgroundJobManager backgroundJobManager,
                                        IRepository<MultiTenancy.Tenant, int> tenantRepository,
                                        IRepository<CurrencyPair, int> currencyPairRepo)
        {
            _applicationRepo = applicationRepo;
            _financeProductsRepo = financeProductsRepo;
            _ownersRepo = ownersRepo;
            _companiesRepo = companiesRepo;
            _matchesRepo = matchesRepo;
            _lenderRepo = lenderRepo;
            _unitOfWorkManager = unitOfWorkManager;
            _listRepository = listRepository;
            _backgroundJobManager = backgroundJobManager;
            _tenantRepository = tenantRepository;
            _matchCriteria = new MatchingCriteriaDto();
            _currencyPairRepo = currencyPairRepo;
        }

        [UnitOfWork]
        public override void Execute(MatchApplicationDto request)
        {
            try
            {

                var exclusions = new List<ExclusionDto>();
                var financeProductsCriteria = new List<FinanceProductCriteriaDto>();
                int? hs_companyId = null;
                long? userId = null;

                // N.B: The FinanceProducts need to include all tenants and hence are retrieved outside of the 
                // UOW where the request tenant is set.
                // get the FinanceProducts and Lenders
                var financeProducts = _financeProductsRepo.GetAll().Where(x => x.Enabled && !x.IsDeleted).ToList();
                var lenders = _lenderRepo.GetAll().ToList();

                // NB: we purposefully set the tenantId to null to include all FinanceProducts for matching.
                // Customizing this for future tenants will be required.
                using var uow = _unitOfWorkManager.Begin();
                using (UnitOfWorkManager.Current.SetTenantId(request.TenantId))
                {
                    Logger.Info($"Matching job triggered for FunderSearch.Id:{request.ApplicationId}");

                    // get application
                    var application = _applicationRepo.Get(request.ApplicationId);
                    userId = application.UserId;

                    #region Get ListItems

                    var listItemsSet = _listRepository.GetAll().ToList();
                    var listItems = new List<ListItemDto>();

                    foreach (var o in listItemsSet)
                    {
                        listItems.Add(new ListItemDto
                        {
                            Id = o.Id,
                            ListId = o.ListId,
                            ParentListId = o.ParentListId,
                            Name = o.Name,
                            Details = o.Details,
                            Priority = o.Priority,
                            MetaOne = o.MetaOne,
                            MetaTwo = o.MetaTwo,
                            MetaThree = o.MetaThree,
                            Slug = o.Slug
                        });
                    }

                    #endregion

                    #region Get FinanceProducts, Application criteria, Company and Owner entities


                    // get the Company associated with the Application
                    var company = _companiesRepo.Get(application.SmeCompanyId);
                    hs_companyId = company.Id;
                    var companyDto = new SmeCompanyDto()
                    {
                        Type = company.Type,
                        RegisteredAddress = company.RegisteredAddress,
                        StartedTradingDate = company.StartedTradingDate,
                        Industries = company.Industries,
                        BeeLevel = company.BeeLevel
                    };

                    // get the Owner of the Company
                    var owner = _ownersRepo.FirstOrDefault(x=> x.UserId == company.UserId);
                    var ownerDto = new OwnerDto()
                    {
                        IsIdentityOrPassportConfirmed = owner.IsIdentityOrPassportConfirmed,
                    };

                    var criteria = NameValuePairDto.FromJson(application.MatchCriteriaJson).ToList();
                    var appCriteriaDto = new ApplicationCriteriaDto(criteria, companyDto, ownerDto, listItems, request.TenancyName);

                    foreach (var fpView in financeProducts)
                    {
                        var financeProductCriteriaDto = FinanceProductCriteriaDto.FromJson(fpView.MatchCriteriaJson);
                        var lender = lenders.FirstOrDefault(x => x.Id == fpView.LenderId);

                        if (lender == null)
                            Logger.Error($"FinanceProduct.Id:{financeProductCriteriaDto.Id} Name:{financeProductCriteriaDto.Name} with invalid Lender.Id:{lender.Id} Name:{lender.Name}");

                        financeProductCriteriaDto.LenderName = lender.Name;
                        financeProductCriteriaDto.LenderId = lender.Id;
                        financeProductCriteriaDto.Name = fpView.Name;
                        financeProductCriteriaDto.Id = fpView.Id;
                        financeProductCriteriaDto.CurrencyPairId = fpView.CurrencyPairId;

                        // adjust for foreign funds
                        financeProductCriteriaDto = AdjustForForeignFunds(financeProductCriteriaDto);

                        // add to included list
                        financeProductsCriteria.Add(financeProductCriteriaDto);
                    }

                    #endregion

                    #region Match all FinanceProducts

                    var finalMatches = MatchCriteria(exclusions, appCriteriaDto, financeProductsCriteria);

                    // write match to database
                    var financeProductsMatchedList = GetMatchedFinanceProductsList(finalMatches);
                    var matchedFinanceProducts = string.Join(",", financeProductsMatchedList.Select(s => s.Id).ToList());
                    var excludedFinanceProducts = JsonConvert.SerializeObject(exclusions.Select(s => new { s.FinanceProductId, s.MatchingCriteriaListId }).ToList());


                    #endregion

                    #region Create/Edit Match
                    var matchSuccess = finalMatches.MatchedLenders.Any();

                    var match = new Match()
                    {
                        TenantId = request.TenantId,
                        MatchSuccessful = matchSuccess,
                        ApplicationId = application.Id,
                        ExclusionIds = excludedFinanceProducts,
                        FinanceProductIds = matchedFinanceProducts,
                        LeadDisplayName = $"{owner.Name} {owner.Surname}",
                        Notes = null
                    };

                    var matchId = _matchesRepo.GetAll().FirstOrDefault(x => x.ApplicationId == match.ApplicationId)?.Id;

                    if (matchId != null)
                        match.Id = (int)matchId;

                    matchId = _matchesRepo.InsertOrUpdateAndGetId(match);

                    Logger.Info($"Created new Match.Id:{matchId} FinanceProducts:[{financeProductsMatchedList.Count}] Exclusions:[{exclusions.Count}] MatchSuccessful:{matchSuccess}");

                    #endregion

                    #region Update Application.Status

                    // TODO: remove locking when Flexi-Edit is back in the game, revert to above.
                    //application.SetStatus(match);
                    application.Lock();

                    _applicationRepo.Update(application);

                    #endregion

                    uow.Complete();
                }

                #region Queue HubSpot Event

                Logger.Info("Queuing HubSpot Sync Job - FunderSearch and Company properties sync");

                var tenancyName = _tenantRepository.Get(request.TenantId)?.TenancyName;

                // queue the job to add funder search to crm
                AsyncHelper.RunSync(() => _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
                {
                    TenancyName = tenancyName,
                    TenantId = request.TenantId,
                    ApplicationId = request.ApplicationId,
                    EventType = HubSpotEventTypes.CreateEdit,
                    HSEntityType = HubSpotEntityTypes.deals,
                    UserJourneyPoint = UserJourneyContextTypes.ApplicationLocked
                }));

                // queue the job to add company to crm
                AsyncHelper.RunSync(() => _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
                {
                    TenancyName = tenancyName,
                    TenantId = request.TenantId,
                    SmeCompanyId = hs_companyId,
                    ApplicationId = request.ApplicationId,
                    EventType = HubSpotEventTypes.CreateEdit,
                    HSEntityType = HubSpotEntityTypes.companies,
                    UserJourneyPoint = UserJourneyContextTypes.ApplicationLocked
                }));

                // queue the job to add contact/owner to crm
                AsyncHelper.RunSync(() => _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
                {
                    TenancyName = tenancyName,
                    TenantId = request.TenantId,
                    SmeCompanyId = hs_companyId,
                    ApplicationId = request.ApplicationId,
                    EventType = HubSpotEventTypes.CreateEdit,
                    HSEntityType = HubSpotEntityTypes.contacts,
                    UserId = userId,
                    UserJourneyPoint = UserJourneyContextTypes.ApplicationLocked
                }));

                #endregion

                #region Queue Qlana Event

                #region Queue the job to add Owner/contact to Qlana

                //AsyncHelper.RunSync(() => _backgroundJobManager.EnqueueAsync<QLanaCreateUpdateBackgroundJob, QlanaEventTriggerDto>(new QlanaEventTriggerDto()
                //{
                //    TenantId = request.TenantId,
                //    ApplicationId = request.ApplicationId,
                //    EventType = QlanaEntityTypes.Project
                //}, BackgroundJobPriority.Normal));

                #endregion

                #endregion

            }
            catch (Exception x)
            {
                Logger.Error($"MatchingBackgroundJob failed with exception.Message:{x.Message}");
            }
        }

        

        #region Matching Functions and helpers

        private MatchResponseDto MatchCriteria(List<ExclusionDto> exclusions, ApplicationCriteriaDto app, IEnumerable<FinanceProductCriteriaDto> financeProducts)
        {
            // criteria: 1 Loan Amount - we use all Lenders for matching 
            var matchResponse1 = MatchLoanAmount(financeProducts, _matchCriteria.LoanAmountListId, app.LoanAmount, exclusions);

            // criteria: 2 Finance For - we use lenders from criteria #1 matches
            var matchResponse2 = MatchFinanceFor(matchResponse1.MatchedLenders, _matchCriteria.FinanceForListId, app.FinanceForSubListId, exclusions);

            // criteria: 3 SA Citizen 
            var matchResponse3 = MatchSaCitizen(matchResponse2.MatchedLenders, _matchCriteria.SACitizenListId, app.IsSouthAfricanCitizen, app.IsPermanentResident, exclusions);

            // criteria: 4 Age          - not being matched
            // criteria: 5 Race         - not being matched
            // criteria: 6 Gender       - not being matched

            // criteria: 7 Company Reg Type
            var matchResponse7 = MatchCompanyRegistrationType(matchResponse3.MatchedLenders, _matchCriteria.CompanyRegistrationTypeListId, app.CompanyRegistrationTypeListId, exclusions);

            // criteria: 8 Province
            var matchResponse8 = MatchProvince(matchResponse7.MatchedLenders, _matchCriteria.ProvinceListId, app.ProvinceListId, exclusions);

            // criteria: 9 Years Trading
            var matchResponse9 = MatchYearsTrading(matchResponse8.MatchedLenders, _matchCriteria.YearsTradingListId, app.YearStartedToTrade, app.MonthStartedToTrade ?? 0, exclusions);

            // criteria: 10 Average Annual Turnover
            var matchResponse10 = MatchTurnover(matchResponse9.MatchedLenders, _matchCriteria.TurnoverListId, (int)app.AverageAnnualTurnoverMin, (int)app.AverageAnnualTurnoverMax, exclusions);

            // criteria: 11 Industry Sector
            var matchResponse11 = MatchIndustrySector(matchResponse10.MatchedLenders, _matchCriteria.IndustrySectorListId, app.IndustrySectorListId, exclusions);

            // criteria: 12 Customer Types / Supply Chain - not being matched

            // criteria: 13 Monthly Income
            var matchResponse13 = MatchMonthlyIncome(matchResponse11.MatchedLenders, _matchCriteria.MonthlyIncomeListId, app.MinimumMonthlyTurnover, exclusions);

            // criteria: 14 Income Received - not being matched

            // criteria: 15 Profitability
            var matchResponse15 = MatchProfitability(matchResponse13.MatchedLenders, _matchCriteria.ProfitabilityListId, app.IsProfitable ?? false, exclusions);

            // criteria: 16 Collateral
            var matchResponse16 = MatchCollateral(matchResponse15.MatchedLenders, _matchCriteria.CollateralListId, app.HasCollateral ?? false, exclusions);

            // criteria: 17 Min Black Ownership             - not being matched
            // criteria: 18 Min Black Women Ownership       - not being matched
            // criteria: 19 Min Women Ownership             - not being matched
            // criteria: 20 Disability                      - not being matched

            // criteria: 52 Ownership
            var matchResponse52 = MatchOwnership(matchResponse16.MatchedLenders, _matchCriteria.OwnershipListId, app, exclusions);

            // criteria: 66 Bee Level
            var matchResponse66 = MatchBeeLevel(matchResponse52.MatchedLenders, _matchCriteria.BeeLevel, app.BeeLevelListId, exclusions);

            //*****WHEN YOU ADD A NEW CRITERIA MAKE SURE TO UPDATE THE HandleFinanceForSub method MatchResponse input with the last one added

            //*****NB THE FINAL RESULT BELOW MUST BE THE LAST MATCHING CRITERIA RESULT SET
            return HandleFinanceForSub(app, matchResponse66, exclusions);
        }

        private List<FinanceProductDto> GetMatchedFinanceProductsList(MatchResponseDto matchResponseFinal)
        {
            return matchResponseFinal.MatchedLenders.Select(p => new FinanceProductDto
            {
                Id = p.Id,
                Name = p.Name,
                LenderId = p.LenderId,
            }).ToList();
        }

        private void AddExclusions(string criteriaListId, IEnumerable<FinanceProductCriteriaDto> previousLenders, IEnumerable<FinanceProductCriteriaDto> nextLenders, List<ExclusionDto> exclusions)
        {
            var previousfpids = previousLenders.Select(p => p.Id).ToList();
            var nextfpids = nextLenders.Select(p => p.Id).ToList();

            var excludedlenders = previousfpids.Where(p => !nextfpids.Contains(p)).ToList();

            excludedlenders.ForEach(exclusion =>
            {
                exclusions.Add(new ExclusionDto
                {
                    MatchingCriteriaListId = criteriaListId,
                    FinanceProductId = exclusion,
                    LenderId = previousLenders.FirstOrDefault(p => p.Id == exclusion).LenderId,
                    LenderName = previousLenders.FirstOrDefault(p => p.Id == exclusion).LenderName,
                    Name = previousLenders.FirstOrDefault(p => p.Id == exclusion).Name,
                });
            });
        }

        private MatchResponseDto HandleFinanceForSub(ApplicationCriteriaDto app, MatchResponseDto finalMatches, List<ExclusionDto> exclusions)
        {
            // cash for invoice
            if (app.FinanceForSubListId == _matchCriteria.CashForAnInvoiceSubListId)
            {
                // criteria: 21 Cash for an invoice - Invoice value
                var matchResponse21 = MatchCashForAnInvoiceInvoiceValue(finalMatches.MatchedLenders, _matchCriteria.CashForAnInvoiceInvoiceValue, app.CashForAnInvoice?.InvoiceValue, exclusions);

                // criteria: 22 Cash for an invoice - Customer Profile
                return MatchCashForAnInvoiceCustomerProfile(matchResponse21.MatchedLenders, _matchCriteria.CashForAnInvoiceCustomerProfile, app.CashForAnInvoice?.CustomerProfileListId, exclusions);
            }

            // money for contract
            if (app.FinanceForSubListId == _matchCriteria.MoneyForContractSubListId)
            {
                // criteria: 23 Money for contract - Contract value
                var matchResponse23 = MatchMoneyForContractContractValue(finalMatches.MatchedLenders, _matchCriteria.MoneyForContractContractValue, app.MoneyForContract?.ContractAmount, exclusions);

                // criteria: 24 Money for contract - Customer Profile
                var matchResponse24 = MatchMoneyForContractCustomerProfile(matchResponse23.MatchedLenders, _matchCriteria.MoneyForContractCustomerProfile, app.MoneyForContract?.CustomerProfileListId, exclusions);

                // criteria: 25 Money for contract - Experience
                return MatchMoneyForContractExperience(matchResponse24.MatchedLenders, _matchCriteria.MoneyForContractExperience, app.MoneyForContract?.Experience ?? false, exclusions);
            }

            // money for tender
            if (app.FinanceForSubListId == _matchCriteria.MoneyForTenderSubListId)
            {
                // criteria: 26 Money for tender - Tender value
                var matchResponse26 = MatchMoneyForTenderTenderValue(finalMatches.MatchedLenders, _matchCriteria.MoneyForContractContractValue, app.MoneyForTender?.TenderValue, exclusions);

                // criteria: 27 Money for tender - Customer Profile
                var matchResponse27 = MatchMoneyForTenderCustomerProfile(matchResponse26.MatchedLenders, _matchCriteria.MoneyForTenderCustomerProfile, app.MoneyForTender?.CustomerProfileListId, exclusions);

                // criteria: 28 Money for tender - Experience
                return MatchMoneyForTenderExperience(matchResponse27.MatchedLenders, _matchCriteria.MoneyForTenderExperience, app.MoneyForTender?.Experience ?? false, exclusions);
            }

            // buying business property
            if (app.FinanceForSubListId == _matchCriteria.BuyingBusinessPropertySubListId)
            {
                // criteria: 29 - Buying business property - property value
                var matchResponse29 = MatchBuyingBusinessPropertyPropertyValue(finalMatches.MatchedLenders, _matchCriteria.BuyingBusinessPropertyPropertyValue, app.BuyingBusinessProperty?.PropertyValue, exclusions);

                // criteria: 30 - Buying business property - Property type
                return MatchBuyingBusinessPropertyPropertyTypes(matchResponse29.MatchedLenders, _matchCriteria.BuyingBusinessPropertyPropertyType, app.BuyingBusinessProperty?.PropertyTypeListId, exclusions);
            }

            // shop fitting renovations
            if (app.FinanceForSubListId == _matchCriteria.ShopFittingRenovationsSubListId)
            {
                // criteria: 31 Shop Fitting Renovations - unbonded
                var matchResponse31 = MatchShopFittingRenovationsUnbonded(finalMatches.MatchedLenders, _matchCriteria.ShopFittingRenovationsUnbonded, app.ShopFittingRenovations?.IsPropertyBonded ?? false, exclusions);

                // criteria: 32 Shop Fitting Renovations - Property type
                return MatchShopFittingRenovationsPropertyTypes(matchResponse31.MatchedLenders, _matchCriteria.ShopFittingRenovationsPropertyType, app.ShopFittingRenovations?.PropertyTypeListId, exclusions);
            }

            // property development
            if (app.FinanceForSubListId == _matchCriteria.PropertyDevelopmentSubListId)
            {
                // criteria: 33 Property Development - development type
                return MatchPropertyDevelopmentDevelopmentTypes(finalMatches.MatchedLenders, _matchCriteria.PropertyDevelopmentDevelopmentTypes, app.PropertyDevelopment?.DevelopmentTypeListId, exclusions);
            }

            // business expansion
            if (app.FinanceForSubListId == _matchCriteria.BusinessExpansionSubListId)
            {
                // criteria: 34 Business expansion - equity
                var matchResponse34 = MatchBusinessExpansionEquity(finalMatches.MatchedLenders, _matchCriteria.BusinessExpansionRequireEquity, app.BusinessExpansion?.WillSellShares ?? false, exclusions);

                // criteria: 35 Business expansion - job creation
                var matchResponse35 = MatchBusinessExpansionJobCreation(matchResponse34.MatchedLenders, _matchCriteria.BusinessExpansionRequireJobCreation, app.BusinessExpansion?.IncreasedEmployees ?? false, exclusions);

                //criteria: 36 - Business expansion - profitability
                var matchResponse36 = MatchBusinessExpansionIncreasedProfitability(matchResponse35.MatchedLenders, _matchCriteria.BusinessExpansionRequireIncreasedProfitability, app.BusinessExpansion?.IncreasedProfitability ?? false, exclusions);

                //criteria: 37 - Business expansion - exports
                var matchResponse37 = MatchBusinessExpansionIncreasedExports(matchResponse36.MatchedLenders, _matchCriteria.BusinessExpansionRequireIncreasedExports, app.BusinessExpansion?.IncreasedExports ?? false, exclusions);

                //criteria: 38 - Business expansion - empowerment
                var matchResponse38 = MatchBusinessExpansionEmpowerment(matchResponse37.MatchedLenders, _matchCriteria.BusinessExpansionRequireEmpowerment, app.BusinessExpansion?.Empowerment ?? false, exclusions);

                //criteria: 39 - Business expansion - rural
                var matchResponse39 = MatchBusinessExpansionRural(matchResponse38.MatchedLenders, _matchCriteria.BusinessExpansionRequireRural, app.BusinessExpansion?.RuralDevelopment ?? false, exclusions);

                //criteria: 40 - Business expansion - social
                return MatchBusinessExpansionSocial(matchResponse39.MatchedLenders, _matchCriteria.BusinessExpansionRequireSocial, app.BusinessExpansion?.SolvesSocial ?? false, exclusions);
            }

            // product service expansion
            if (app.FinanceForSubListId == _matchCriteria.ProductServiceExpansionSubListId)
            {
                //criteria: 41 - Product Service expansion -type of expansion
                return MatchProductServiceExpansionTypeOfExpansion(finalMatches.MatchedLenders, _matchCriteria.ProductServiceExpansionExpansionType, app.ProductServiceExpansion?.TypeOfExpansionListId, exclusions);
            }

            // buying a franchise
            if (app.FinanceForSubListId == _matchCriteria.BuyingAFranchiseSubListId)
            {
                //criteria: 42 - Buying a franchise - accredited
                var matchResponse42 = MatchBuyingAFranchiseAccredited(finalMatches.MatchedLenders, _matchCriteria.BuyingAFranchiseAccredited, app.BuyingAFranchise?.Accredited ?? false, exclusions);

                //criteria: 43 - Buying a franchise - preapproved
                return MatchBuyingAFranchisePreapproved(matchResponse42.MatchedLenders, _matchCriteria.BuyingAFranchisePreapproved, app.BuyingAFranchise?.Preapproved ?? false, exclusions);
            }

            // partner management buyout
            if (app.FinanceForSubListId == _matchCriteria.PartnerManagementBuyOutSubListId)
            {
                //criteria: 44 - Partner management buyout - min bee
                return MatchPartnerManagementBuyOutMinimumBeeShareholding(finalMatches.MatchedLenders, _matchCriteria.PartnerManagementBuyOutMinimumBeeShareHolding, app.PartnerManagementBuyOut?.MinimumBeeShareholding ?? false, exclusions);
            }

            // buying a business
            if (app.FinanceForSubListId == _matchCriteria.BuyingABusinessSubListId)
            {
                //criteria: 45 - Buying a business - industry sector
                var matchResponse45 = MatchBuyingABusinessIndustrySector(finalMatches.MatchedLenders, _matchCriteria.BuyingABusinessIndustrySector, app.BuyingABusiness?.IndustrySectorListId, exclusions);

                //criteria: 46 - Buying a business - business type
                var matchResponse46 = MatchBuyingABusinessBusinessType(matchResponse45.MatchedLenders, _matchCriteria.BuyingABusinessBusinessType, app.BuyingABusiness?.BusinessTypeListId, exclusions);

                //criteria: 47 - Buying a business - rural
                return MatchBuyingABusinessRural(matchResponse46.MatchedLenders, _matchCriteria.BuyingABusinessRural, app.BuyingABusiness?.RuralOrTownship ?? false, exclusions);
            }

            // BEE partner
            if (app.FinanceForSubListId == _matchCriteria.BeePartnerSubListId)
            {
                //criteria: 48 - BEE Partner - min bee
                return MatchBeePartnerBeeShareholding(finalMatches.MatchedLenders, _matchCriteria.BeePartnerMinimumBeeShareholding, app.BeePartner?.MinimumBeeShareholding ?? false, exclusions);
            }

            // export
            if (app.FinanceForSubListId == _matchCriteria.ExportSubListId)
            {
                //criteria: 49 - Export - product section

                //criteria: 50 - Export - Confirmed order
                return MatchExportConfirmedOrder(finalMatches.MatchedLenders, _matchCriteria.ExportConfirmedOrder, app.Export?.ConfirmedExportOrder ?? false, exclusions);

            }

            // import
            if (app.FinanceForSubListId == _matchCriteria.ImportSubListId)
            {
                //criteria: 51 - Import - Signed contract
                return MatchImportSignedContract(finalMatches.MatchedLenders, _matchCriteria.ImportSignedContract, app.Import?.SignedContract ?? false, exclusions);
            }

            // purchase order funding 
            if (app.FinanceForSubListId == _matchCriteria.PurchaseOrderFundingSubListId)
            {
                //criteria: 53 - Purchase Order Funding - Contract value
                var matchResponse53 = MatchPurchaseOrderFundingMinFundingValue(finalMatches.MatchedLenders, _matchCriteria.PurchaseOrderFundingMinFundingValue, app.PurchaseOrderFunding?.FundingAmount, exclusions);

                //criteria: 54 - Purchase Order Funding - Customer Profile
                var matchResponse54 = MatchPurchaseOrderFundingCustomerProfiles(matchResponse53.MatchedLenders, _matchCriteria.PurchaseOrderFundingCustomerProfiles, app.PurchaseOrderFunding?.CustomerProfileListId, exclusions);

                //criteria: 55 - Purchase Order Funding- Experience
                return MatchPurchaseOrderFundingExperience(matchResponse54.MatchedLenders, _matchCriteria.PurchaseOrderFundingExperience, app.PurchaseOrderFunding?.Experience ?? false, exclusions);
            }

            // cash for retailers
            if (app.FinanceForSubListId == _matchCriteria.CashForRetailersSubListId)
            {
                //criteria: 56 - Income Received
                var matchResponse56 = MatchIncomeReceived(finalMatches.MatchedLenders, _matchCriteria.RetailIncomeReceived, app.HowIncomeReceivedListIds, exclusions);

                //criteria: 57 - Monthly Income Retail
                return MatchMinimumMonthlyIncomeRetail(matchResponse56.MatchedLenders, _matchCriteria.RetailMonthlyIncome, app.MonthlyIncomeRetail ?? 0, exclusions);
            }

            // business processing services
            if (app.FinanceForSubListId == _matchCriteria.BusinessProcessingServicesSubListId)
            {
                //criteria: 58 - Job Creation
                var matchResponse58 = MatchBusinessProcessingServicesJobCreation(finalMatches.MatchedLenders, _matchCriteria.BusinessProcessingServicesJobCreation, app.BusinessProcessingServices?.JobCreation ?? false, exclusions);

                //criteria: 59 - Secure Contracts
                var matchResponse59 = MatchBusinessProcessingServicesSecureContracts(matchResponse58.MatchedLenders, _matchCriteria.BusinessProcessingServicesSecureContracts, app.BusinessProcessingServices?.SecureContracts ?? false, exclusions);

                //criteria: 60 - Youth Jobs
                return MatchBusinessProcessingServicesYouthJobs(matchResponse59.MatchedLenders, _matchCriteria.BusinessProcessingServicesYouthJobs, app.BusinessProcessingServices?.YouthJobs ?? false, exclusions);
            }

            // commercialising research
            if (app.FinanceForSubListId == _matchCriteria.CommercialisingResearchSubListId)
            {
                // criteria: 61 Student Status
                var matchResponse61 = MatchCommercialisingResearchRequireStudentStatus(finalMatches.MatchedLenders, _matchCriteria.CommercialisingResearchRequireStudentStatus, app.CommercialisingResearch?.StudentStatus ?? false, exclusions);

                //criteria: 62 - Increase exports
                var matchResponse62 = MatchCommercialisingResearchRequireIncreasedExports(matchResponse61.MatchedLenders, _matchCriteria.CommercialisingResearchRequireIncreasedExports, app.CommercialisingResearch?.IncreasedExports ?? false, exclusions);

                // criteria: 63 - Job creations
                var matchResponse63 = MatchCommercialisingResearchRequireJobCreation(matchResponse62.MatchedLenders, _matchCriteria.CommercialisingResearchRequireJobCreation, app.CommercialisingResearch?.JobCreation ?? false, exclusions);

                // criteria: 64 - Innovation
                var matchResponse64 = MatchCommercialisingResearchRequireInnovation(matchResponse63.MatchedLenders, _matchCriteria.CommercialisingResearchRequireInnovation, app.CommercialisingResearch?.Innovation ?? false, exclusions);

                // criteria: 65 - Products
                return MatchCommercialisingResearchProducts(matchResponse64.MatchedLenders, _matchCriteria.CommercialisingResearchProducts, app.CommercialisingResearch?.ProductListIds, exclusions);
            }

            // cashflow assistance - has pos device
            if(app.FinanceForSubListId == _matchCriteria.CashFlowAssistanceSubListId)
            {
                //criteria: 66 - Has POS Device
                return MatchCashFlowAssistanceHasPosDevice(finalMatches.MatchedLenders, _matchCriteria.CashFlowAssistanceSubListId, app.CashFlowAssistance?.HasPosDevice ?? false, exclusions);
            }

            return finalMatches;
        }

        public MatchResponseDto MatchLoanAmount(IEnumerable<FinanceProductCriteriaDto> forMatching, string criteriaListId, long? amount, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = forMatching.Where(p =>
                    (p.MinLoanAmount == null && p.MaxLoanAmount == null) ||
                    ((p.MaxLoanAmount == null && p.MinLoanAmount != null) && (amount >= p.MinLoanAmount)) ||
                    ((p.MinLoanAmount == null && p.MaxLoanAmount != null) && (amount <= p.MaxLoanAmount)) ||
                    ((p.MinLoanAmount != null && p.MaxLoanAmount != null) && (amount >= p.MinLoanAmount && amount <= p.MaxLoanAmount))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, forMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchFinanceFor(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string financeForListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                                (p.FinanceForSubListIds == null) ||
                                ((p.FinanceForSubListIds != null) && (p.FinanceForSubListIds.Contains(financeForListId)))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchSaCitizen(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool? isSaCitizen, bool? isPermanentResident, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.SaCitizensOnly && (bool)isSaCitizen) ||
                    (!p.SaCitizensOnly))
                .OrderBy(p => p.Name)
            };

            if (isPermanentResident != null)
            {
                model.MatchedLenders = model.MatchedLenders.Where(p =>
                (p.IncludePermanentResidents ?? false) && (isPermanentResident.Value) ||
                p.IncludePermanentResidents == null)
                    .OrderBy(p => p.Name);
            }

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCompanyRegistrationType(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string companyRegistrationTypeListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.CompanyRegistrationTypeListIds == null) ||
                    ((p.CompanyRegistrationTypeListIds != null) && (p.CompanyRegistrationTypeListIds.Contains(companyRegistrationTypeListId)))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchProvince(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string provinceListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.ProvinceListIds == null) ||
                    ((p.ProvinceListIds != null) && (p.ProvinceListIds.Contains(provinceListId)))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchYearsTrading(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, int? yearStartedToTrade, int monthStartedToTrade, List<ExclusionDto> exclusions)
        {
            var monthsTrading = Math.Abs(12 * (DateTime.Now.Year - (int)yearStartedToTrade) + DateTime.Now.Month - monthStartedToTrade);

            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.MinimumMonthsTrading == null) ||
                    ((p.MinimumMonthsTrading != null) && (monthsTrading >= p.MinimumMonthsTrading))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchTurnover(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, int minimum, int maximum, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.MinAverageAnnualTurnover == null && p.MaxAverageAnnualTurnover == null) ||
                    ((p.MaxAverageAnnualTurnover == null && p.MinAverageAnnualTurnover != null) && (maximum >= p.MinAverageAnnualTurnover)) ||
                    ((p.MinAverageAnnualTurnover == null && p.MaxAverageAnnualTurnover != null) && (minimum <= p.MaxAverageAnnualTurnover)) ||
                    ((p.MinAverageAnnualTurnover != null && p.MaxAverageAnnualTurnover != null) && (minimum <= p.MaxAverageAnnualTurnover && p.MinAverageAnnualTurnover <= maximum))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchIndustrySector(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string industrySectorListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.IndustrySectorListIds == null) ||
                    ((p.IndustrySectorListIds != null) && (p.IndustrySectorListIds.Contains(industrySectorListId)))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchMonthlyIncome(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, int minimumMonthlyIncome, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.MinimumMonthlyIncome == null) ||
                    ((p.MinimumMonthlyIncome != null) && (minimumMonthlyIncome >= p.MinimumMonthlyIncome))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchProfitability(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool isProfitable, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.RequiresProfitability && isProfitable) ||
                    (!p.RequiresProfitability))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCollateral(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool hasCollateral, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.RequiresCollateral && hasCollateral) ||
                    (!p.RequiresCollateral))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchOwnership(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, ApplicationCriteriaDto app, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId);

            var blackOwnershipPercentage = app.BlackOwnedPercentage ?? 0;
            var blackAllOwnershipPercentage = app.BlackAllOwnedPercentage ?? 0;
            var whiteOwnershipPercentage = app.WhiteOwnedPercentage ?? 0;
            var nonSouthAfricanOwnershipPercentage = app.NonSouthAfricanOwnedPercentage ?? 0;
            var blackWomenOwnershipPercentage = app.BlackWomenOwnedPercentage ?? 0;
            var womenOwnershipPercentage = app.WomenOwnedPercentage ?? 0;
            var disabledOwnershipPercentage = app.DisabledOwnedPercentage ?? 0;
            var youthOwnershipPercentage = app.YouthOwnedPercentage ?? 0;
            var militaryVeteranOwnedPercentage = app.MilitaryVeteranOwnedPercentage ?? 0;

            //get lenders who have ownership rules
            var lendersWithOwnershipRules = lendersForMatching.Where(p =>
                p.OwnershipRules != null && p.OwnershipRules.Count > 0).OrderBy(p => p.Name);

            //include lenders who have no ownership rules
            var lendersWithNoOwnership = lendersForMatching.Where(p =>
                p.OwnershipRules == null || p.OwnershipRules.Count == 0).OrderBy(p => p.Name).ToList();

            foreach (var lenderWithRule in lendersWithOwnershipRules)
            {
                var includeThisLender = true;
                var prevPassed = true;
                var currPassed = true;
                lenderWithRule.OwnershipRules.OrderBy(p => p.Num).ToList().ForEach(rule =>
                {
                    prevPassed = currPassed;
                    switch (rule.Demographic)
                    {
                        case "black-all-sa":
                            {
                                currPassed = DidRulePass(rule, blackAllOwnershipPercentage);
                                break;
                            }
                        case "black-sa":
                            {
                                currPassed = DidRulePass(rule, blackOwnershipPercentage);
                                break;
                            }
                        case "white":
                            {
                                currPassed = DidRulePass(rule, whiteOwnershipPercentage);
                                break;
                            }
                        case "non-south-africans":
                            {
                                currPassed = DidRulePass(rule, nonSouthAfricanOwnershipPercentage);
                                break;
                            }
                        case "women":
                            {
                                currPassed = DidRulePass(rule, womenOwnershipPercentage);
                                break;
                            }
                        case "black-women":
                            {
                                currPassed = DidRulePass(rule, blackWomenOwnershipPercentage);
                                break;
                            }
                        case "youth":
                            {
                                currPassed = DidRulePass(rule, youthOwnershipPercentage);
                                break;
                            }
                        case "disabled":
                            {
                                currPassed = DidRulePass(rule, disabledOwnershipPercentage);
                                break;
                            }
                        case "military-veteran":
                            {
                                currPassed = DidRulePass(rule, militaryVeteranOwnedPercentage);
                                break;
                            }
                    }
                    includeThisLender = IncludeLender(rule.Operator, currPassed, prevPassed);
                    currPassed = includeThisLender;
                });
                if (includeThisLender)
                {
                    lendersWithNoOwnership.Add(lenderWithRule);
                }
            }

            model.MatchedLenders = lendersWithNoOwnership;

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        private bool DidRulePass(OwnershipRuleDto rule, decimal percentage)
        {
            if (
            (rule.Measure == "percentage" && (int)percentage >= rule.Percentage) ||
            (rule.Measure == "any" && (int)percentage > 0)
            )
            {
                return true;
            }

            return false;
        }

        private bool IncludeLender(string opp, bool currPassed, bool prevPassed)
        {
            switch (opp)
            {
                case "and":
                    {
                        if (currPassed && prevPassed)
                        {
                            return true;
                        }
                        break;
                    }
                case "or":
                    {
                        if (currPassed || prevPassed)
                        {
                            return true;
                        }
                        break;
                    }
                default:
                    {
                        return currPassed;
                    }
            }

            return false;
        }

        public MatchResponseDto MatchBeeLevel(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string beeLevelListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BeeLevelListIds == null) ||
                    ((p.BeeLevelListIds != null) && (p.BeeLevelListIds.Contains(beeLevelListId)))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCashForAnInvoiceCustomerProfile(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string customerProfileListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.CashForAnInvoiceCustomerProfileListIds == null) ||
                    (p.CashForAnInvoiceCustomerProfileListIds.Contains(customerProfileListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCashForAnInvoiceInvoiceValue(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, int? invoiceValue, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.CashForAnInvoiceMinInvoiceValue == null) ||
                    (invoiceValue >= p.CashForAnInvoiceMinInvoiceValue)).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchMoneyForContractContractValue(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, int? contractValue, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.MoneyForContractMinContractValue == null) ||
                    (contractValue >= p.MoneyForContractMinContractValue)).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchMoneyForContractCustomerProfile(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string customerProfileListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.MoneyForContractCustomerProfileListIds == null) ||
                    (p.MoneyForContractCustomerProfileListIds.Contains(customerProfileListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchMoneyForContractExperience(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool experience, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.MoneyForContractExperience && experience) ||
                    (!p.MoneyForContractExperience))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchMoneyForTenderCustomerProfile(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string customerProfileListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.MoneyForTenderCustomerProfileListIds == null) ||
                    (p.MoneyForTenderCustomerProfileListIds.Contains(customerProfileListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchMoneyForTenderExperience(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool experience, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.MoneyForTenderExperience && experience) ||
                    (!p.MoneyForTenderExperience))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchMoneyForTenderTenderValue(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, int? tenderValue, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.MoneyForTenderMinTenderValue == null) ||
                    (tenderValue >= p.MoneyForTenderMinTenderValue)).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBuyingBusinessPropertyPropertyTypes(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string propertyTypeListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BuyingBusinessPropertyPropertyTypeListIds == null) ||
                    (p.BuyingBusinessPropertyPropertyTypeListIds.Contains(propertyTypeListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBuyingBusinessPropertyPropertyValue(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, int? propertyValue, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BuyingBusinessPropertyMinPropertyValue == null) ||
                    (propertyValue >= p.BuyingBusinessPropertyMinPropertyValue)).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchShopFittingRenovationsPropertyTypes(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string propertyTypeListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.ShopFittingRenovationsPropertyTypeListIds == null) ||
                    (p.ShopFittingRenovationsPropertyTypeListIds.Contains(propertyTypeListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchShopFittingRenovationsUnbonded(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool unbonded, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.ShopFittingRenovationsRequireUnbonded && unbonded) ||
                    (!p.ShopFittingRenovationsRequireUnbonded))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchPropertyDevelopmentDevelopmentTypes(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string developmentTypeListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.PropertyDevelopmentDevelopmentTypeListIds == null) ||
                    (p.PropertyDevelopmentDevelopmentTypeListIds.Contains(developmentTypeListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchProductServiceExpansionTypeOfExpansion(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string typeOfExpansionListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.ProductServiceExpansionTypesOfExpansionListIds == null) ||
                    (p.ProductServiceExpansionTypesOfExpansionListIds.Contains(typeOfExpansionListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessExpansionEmpowerment(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool requireEmpowerment, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessExpansionRequireEmpowerment && requireEmpowerment) ||
                    (!p.BusinessExpansionRequireEmpowerment))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessExpansionEquity(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool willSellShares, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessExpansionRequireEquity && willSellShares) ||
                    (!p.BusinessExpansionRequireEquity)
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessExpansionIncreasedExports(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool requireIncreasedExports, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessExpansionRequireIncreasedExports && requireIncreasedExports) ||
                    (!p.BusinessExpansionRequireIncreasedExports))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessExpansionIncreasedProfitability(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool requireIncreasedProfitability, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessExpansionRequireIncreasedProfitability && requireIncreasedProfitability) ||
                    (!p.BusinessExpansionRequireIncreasedProfitability))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessExpansionJobCreation(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool requireJobCreation, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessExpansionRequireJobCreation && requireJobCreation) ||
                    (!p.BusinessExpansionRequireJobCreation))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessExpansionRural(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool requireRural, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessExpansionRequireRural && requireRural) ||
                    (!p.BusinessExpansionRequireRural))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessExpansionSocial(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool requireSocial, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessExpansionRequireSocial && requireSocial) ||
                    (!p.BusinessExpansionRequireSocial))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBuyingAFranchiseAccredited(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool accredited, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BuyingAFranchiseRequireAccreditation && accredited) ||
                    (!p.BuyingAFranchiseRequireAccreditation))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBuyingAFranchisePreapproved(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool preapproved, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BuyingAFranchiseRequirePreapproval && preapproved) ||
                    (!p.BuyingAFranchiseRequirePreapproval))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBeePartnerBeeShareholding(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool minimumBeeShareholding, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BeePartnerMinimumBeeShareholding && minimumBeeShareholding) ||
                    (!p.BeePartnerMinimumBeeShareholding))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBuyingABusinessBusinessType(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string businessTypeListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BuyingABusinessBusinessTypeListIds == null) ||
                    (p.BuyingABusinessBusinessTypeListIds.Contains(businessTypeListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchPartnerManagementBuyOutMinimumBeeShareholding(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool minimumBeeShareholding, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.PartnerManagementBuyOutMinimumBeeShareholding && minimumBeeShareholding) ||
                    (!p.PartnerManagementBuyOutMinimumBeeShareholding))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBuyingABusinessIndustrySector(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string industrySectorListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BuyingABusinessIndustrySectorsListIds == null) ||
                    (p.BuyingABusinessIndustrySectorsListIds.Contains(industrySectorListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBuyingABusinessRural(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool rural, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BuyingABusinessRuralTownship && rural) ||
                    (!p.BuyingABusinessRuralTownship))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchExportConfirmedOrder(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool confirmedOrder, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.ExportConfirmedOrder && confirmedOrder) ||
                    (!p.ExportConfirmedOrder))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchImportSignedContract(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool signedContract, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.ImportSignedContract && signedContract) ||
                    (!p.ImportSignedContract))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchPurchaseOrderFundingMinFundingValue(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, int? fundingValue, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.PurchaseOrderMinFundingValue == null) ||
                    (fundingValue >= p.PurchaseOrderMinFundingValue)).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchPurchaseOrderFundingCustomerProfiles(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string customerProfileListId, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.PurchaseOrderFundingCustomerProfileListIds == null) ||
                    (p.PurchaseOrderFundingCustomerProfileListIds.Contains(customerProfileListId))).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchPurchaseOrderFundingExperience(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool experience, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.PurchaseOrderFundingExperience && experience) ||
                    (!p.PurchaseOrderFundingExperience))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchMinimumMonthlyIncomeRetail(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, int minimumMonthlyIncome, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId);

            model.MatchedLenders = lendersForMatching.Where(p =>
                (p.MinimumMonthlyIncomeRetail == null) ||
                ((p.MinimumMonthlyIncomeRetail != null) && (minimumMonthlyIncome >= p.MinimumMonthlyIncomeRetail))
                ).OrderBy(p => p.Name);

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchIncomeReceived(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string incomeReceivedListIds, List<ExclusionDto> exclusions)
        {

            var matchingLenderIds = new List<int>();

            foreach (var lender in lendersForMatching.Where(p => p.IncomeReceivedListIds != null))
            {
                var matched = false;
                foreach (var listId in incomeReceivedListIds.Split(','))
                {
                    if (!matched)
                    {
                        if (lender.IncomeReceivedListIds.Contains(listId.Trim()))
                        {
                            matchingLenderIds.Add(lender.Id);
                            matched = true;
                        }
                    }
                }
            }

            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.IncomeReceivedListIds == null) ||
                    ((p.IncomeReceivedListIds != null) && (matchingLenderIds.Contains(p.Id)))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessProcessingServicesJobCreation(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool jobCreation, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessProcessingServicesJobCreation && jobCreation) ||
                    (!p.BusinessProcessingServicesJobCreation))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessProcessingServicesSecureContracts(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool secureContracts, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessProcessingServicesSecureContracts && secureContracts) ||
                    (!p.BusinessProcessingServicesSecureContracts))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchBusinessProcessingServicesYouthJobs(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool youthJobs, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.BusinessProcessingServicesYouthJobs && youthJobs) ||
                    (!p.BusinessProcessingServicesYouthJobs))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCommercialisingResearchRequireStudentStatus(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool studentStatus, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.CommercialisingResearchRequireStudentStatus && studentStatus) ||
                    (!p.CommercialisingResearchRequireStudentStatus))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCommercialisingResearchRequireIncreasedExports(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool increaseExports, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.CommercialisingResearchRequireIncreasedExports && increaseExports) ||
                    (!p.CommercialisingResearchRequireIncreasedExports))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCommercialisingResearchRequireJobCreation(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool jobCreation, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.CommercialisingResearchRequireJobCreation && jobCreation) ||
                    (!p.CommercialisingResearchRequireJobCreation))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCommercialisingResearchRequireInnovation(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool innovation, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.CommercialisingResearchRequireInnovation && innovation) ||
                    (!p.CommercialisingResearchRequireInnovation))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCommercialisingResearchProducts(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string productIds, List<ExclusionDto> exclusions)
        {
            var matchingLenderIds = new List<int>();

            foreach (var lender in lendersForMatching.Where(p => p.CommercialisingResearchProductListIds != null))
            {
                var matched = false;
                foreach (var listId in productIds.Split(','))
                {
                    if (!matched)
                    {
                        if (lender.CommercialisingResearchProductListIds.Contains(listId.Trim()))
                        {
                            matchingLenderIds.Add(lender.Id);
                            matched = true;
                        }
                    }
                }
            }

            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.CommercialisingResearchProductListIds == null) ||
                    ((p.CommercialisingResearchProductListIds != null) && (matchingLenderIds.Contains(p.Id)))
                ).OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchCashFlowAssistanceHasPosDevice(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, bool hasPosDevice, List<ExclusionDto> exclusions)
        {
            var model = new MatchResponseDto(criteriaListId)
            {
                MatchedLenders = lendersForMatching.Where(p =>
                    (p.CashFlowAssistanceHasPosDevice && hasPosDevice) ||
                    (!p.CashFlowAssistanceHasPosDevice))
                .OrderBy(p => p.Name)
            };

            AddExclusions(criteriaListId, lendersForMatching, model.MatchedLenders, exclusions);

            return model;
        }

        public MatchResponseDto MatchAge(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string ageListId, List<ExclusionDto> exclusions)
        {
            throw new NotImplementedException();
        }

        public MatchResponseDto MatchRace(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string raceListId, List<ExclusionDto> exclusions)
        {
            throw new NotImplementedException();
        }

        public MatchResponseDto MatchGender(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string genderListId, List<ExclusionDto> exclusions)
        {
            throw new NotImplementedException();
        }

        public MatchResponseDto MatchCustomerType(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string customerTypeListId, List<ExclusionDto> exclusions)
        {
            throw new NotImplementedException();
        }

        public MatchResponseDto MatchOwnership(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, List<ExclusionDto> exclusions)
        {
            throw new NotImplementedException();
        }

        public MatchResponseDto MatchExportProductSection(IEnumerable<FinanceProductCriteriaDto> lendersForMatching, string criteriaListId, string productSectionIds, List<ExclusionDto> exclusions)
        {
            throw new NotImplementedException();
        }

        private FinanceProductCriteriaDto AdjustForForeignFunds(FinanceProductCriteriaDto dto)
        {
            if (dto.CurrencyPairId == null)
                return dto;

            var useCurrency = _currencyPairRepo.FirstOrDefault(x => x.Id == dto.CurrencyPairId);

            if (dto.MinLoanAmount != null)
            {
                dto.MinLoanAmount = (long)decimal.Round(dto.MinLoanAmount.Value * useCurrency.ExchangeRate);
            }
            if (dto.MaxLoanAmount != null)
            {
                dto.MaxLoanAmount = (long)decimal.Round(dto.MaxLoanAmount.Value * useCurrency.ExchangeRate);
            }
            if (dto.MinAverageAnnualTurnover != null)
            {
                dto.MinAverageAnnualTurnover = (long)decimal.Round(dto.MinAverageAnnualTurnover.Value * useCurrency.ExchangeRate);
            }
            if (dto.MaxAverageAnnualTurnover != null)
            {
                dto.MaxAverageAnnualTurnover = (long)decimal.Round(dto.MaxAverageAnnualTurnover.Value * useCurrency.ExchangeRate);
            }

            return dto;
        }


        #endregion
    }
}
