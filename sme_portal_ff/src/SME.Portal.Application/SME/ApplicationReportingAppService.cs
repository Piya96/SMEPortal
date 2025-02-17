using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.SME.Exporting;
using SME.Portal.SME.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using Abp.Runtime.Session;

using SME.Portal.Lenders;
using SME.Portal.Common.Dto;
using SME.Portal.List;
using System;
using Abp.Threading;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using Abp.BackgroundJobs;
using Abp.MultiTenancy;
using Newtonsoft.Json;
using SME.Portal.Lenders.Dtos;

namespace SME.Portal.SME
{
    [AbpAuthorize]
    public class ApplicationReportingAppService : PortalAppServiceBase, IApplicationReportingAppService
    {
        private readonly IRepository<Match> _matchRepository;
        private readonly IRepository<Application> _applicationRepository;
        private readonly IApplicationsExcelExporter _applicationsExcelExporter;
        private readonly IRepository<User, long> _lookup_userRepository;
        private readonly IRepository<SmeCompany, int> _lookup_smeCompanyRepository;
        private readonly IAbpSession _session;
        private readonly IRepository<Owner, long> _ownerRepository;
        private readonly IRepository<ListItem, int> _listRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;
        private readonly ITenantCache _tenantCache;
        private readonly IRepository<FinanceProduct> _financeProductRepository;
        private readonly IRepository<Lender> _lenderRepository;

        public ApplicationReportingAppService(
            IRepository<Match> matchRepository,
            IRepository<Application> applicationRepository,
            IApplicationsExcelExporter applicationsExcelExporter,
            IRepository<User, long> lookup_userRepository,
            IRepository<SmeCompany, int> lookup_smeCompanyRepository,
            IAbpSession session,
            IRepository<Owner, long> ownerRepository,
            IRepository<ListItem, int> listRepository,
            IBackgroundJobManager backgroundJobManager,
            ITenantCache tenantCache,
            IRepository<Lender> lenderRepository,
            IRepository<FinanceProduct> financeProductRepository)
        {
            _matchRepository = matchRepository;
            _applicationRepository = applicationRepository;
            _applicationsExcelExporter = applicationsExcelExporter;
            _lookup_userRepository = lookup_userRepository;
            _lookup_smeCompanyRepository = lookup_smeCompanyRepository;
            _session = session;
            _ownerRepository = ownerRepository;
            _listRepository = listRepository;
            _backgroundJobManager = backgroundJobManager;
            _tenantCache = tenantCache;
            _lenderRepository = lenderRepository;
            _financeProductRepository = financeProductRepository;
        }

        [AbpAllowAnonymous]
        public async Task<List<Dictionary<string, string>>> GetDataExport()
        {
            try
            {
                using (CurrentUnitOfWork.SetTenantId(2))
                {
                    var rows = new List<List<DynamicColumn>>();

                    var fromDate = new DateTime(2022, 01, 01);
                    var toDate = new DateTime(2022, 03, 08);

                    var applications = await _applicationRepository
                                                    .GetAll()
                                                    .Include(a => a.SmeCompanyFk)
                                                    .Where(a => a.Status == "Locked" &&
                                                    a.IsDeleted == false
                                                    )
                                                    .Where(a => a.Locked >= fromDate)
                                                    //.Where(a => a.Locked <= toDate.AddMinutes(-1))
                                                    //.Where(a =>
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Worcester".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Upington".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Kakamas".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Kathu".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Kimberley".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Bloemfontein".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Welkom".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Hennenman".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Kroonstad".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Orkney".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Klerksdorp".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Middelburg".ToLower()) ||
                                                    //a.SmeCompanyFk.RegisteredAddress.ToLower().Contains("Bronkhorstspruit".ToLower())
                                                    //)
                                                    .ToListAsync();

                    //var filteredFinanceProducts = _financeProductRepository.GetAll()
                    //    .Include(e => e.LenderFk)
                    //    .Include(e => e.CurrencyPairFk)
                    //    .Where(a => a.IsDeleted == false && a.Enabled == true)
                    //    .Where(a => a.LenderId != 149).ToList();

                    //var financeProducts = filteredFinanceProducts.Select(a =>

                    //                  new FinanceProductDto
                    //                  {
                    //                      Name = a.Name,
                    //                      Version = a.Version,
                    //                      VersionLabel = a.VersionLabel,
                    //                      ShowMatchResults = a.ShowMatchResults,
                    //                      Enabled = a.Enabled,
                    //                      Id = a.Id,
                    //                      LenderId = a.LenderId,
                    //                      MatchCriteriaJson = a.MatchCriteriaJson,
                    //                      SummaryHtml = a.SummaryHtml,
                    //                      LastCheckedDate = a.LastCheckedDate
                    //                  }
                    //              ).ToList();

                    //var loanIndex = new[] { "5a8d1875ea39ca66b4d754fe", "5a8d185dea39ca66b4d754fd" };
                    //var loanType = "6195ba1de4da9e23c056c20e";

                    //financeProducts = financeProducts
                    //    .Where(a => a.GetFinanceProductCriteriaDto().LoanIndexListIds != null && loanIndex.Any(b => a.GetFinanceProductCriteriaDto().LoanIndexListIds.Contains(b)))
                    //    .Where(a => a.GetFinanceProductCriteriaDto().LoanTypeListIds != null &&  a.GetFinanceProductCriteriaDto().LoanTypeListIds.Contains(loanType)).ToList();

                    var listItemsSet = _listRepository.GetAll().ToList();
                    var _listItems = new List<List.Dtos.ListItemDto>();
                    foreach (var o in listItemsSet)
                    {
                        _listItems.Add(new List.Dtos.ListItemDto
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

                    foreach (var application in applications)
                    {
                        //var match = _matchRepository.FirstOrDefault(a => a.ApplicationId == application.Id);

                        //if(match != null && !string.IsNullOrEmpty(match.FinanceProductIds))
                        //{
                        //    var fpIds = match.FinanceProductIds.Split(",").ToList();

                        //    var hasFpId = fpIds.Any(a => financeProducts.Any(b => a == b.Id.ToString()));
                        //    if (!hasFpId)
                        //    {
                        //        continue;
                        //    }
                        //}
                        //else
                        //{
                        //    continue;
                        //}

                        var company = application.SmeCompanyFk;
                        var owner = _ownerRepository.FirstOrDefault(x => x.UserId == company.UserId);

                        var companyDto = new Company.Dtos.SmeCompanyDto()
                        {
                            Type = company.Type,
                            RegisteredAddress = company.RegisteredAddress,
                            StartedTradingDate = company.StartedTradingDate,
                            Industries = company.Industries,
                            BeeLevel = company.BeeLevel
                        };

                        var ownerDto = new Company.Dtos.OwnerDto()
                        {
                            IsIdentityOrPassportConfirmed = owner.IsIdentityOrPassportConfirmed,
                        };

                        var criteria = NameValuePairDto.FromJson(application.MatchCriteriaJson).ToList();
                        var appCriteriaDto = new ApplicationCriteriaDto(criteria, companyDto, ownerDto, _listItems, "");

                        var columns = new List<DynamicColumn>();

                        columns.Add(new DynamicColumn { ColumnName = "Business Name", ColumnValue = company.Name });
                        columns.Add(new DynamicColumn { ColumnName = "User Name", ColumnValue = owner.Name });
                        columns.Add(new DynamicColumn { ColumnName = "User Surname", ColumnValue = owner.Surname });
                        columns.Add(new DynamicColumn { ColumnName = "EmailAddress", ColumnValue = owner.EmailAddress });
                        columns.Add(new DynamicColumn { ColumnName = "PhoneNumber", ColumnValue = owner.PhoneNumber });
                        //columns.Add(new DynamicColumn { ColumnName = "Race", ColumnValue = owner.Race });
                        columns.Add(new DynamicColumn { ColumnName = "Status", ColumnValue = application.Status });
                        columns.Add(new DynamicColumn { ColumnName = "Locked Time", ColumnValue = application.Locked.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Black All Owned Percentage", ColumnValue = appCriteriaDto.BlackAllOwnedPercentage.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Blacked Owned Percentage", ColumnValue = appCriteriaDto.BlackOwnedPercentage.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "White Owned Percentage", ColumnValue = appCriteriaDto.WhiteOwnedPercentage.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Disabled Owned Percentage", ColumnValue = appCriteriaDto.DisabledOwnedPercentage.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Youth Owned Percentage", ColumnValue = appCriteriaDto.YouthOwnedPercentage.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Woman Owned Percentage", ColumnValue = appCriteriaDto.WomenOwnedPercentage.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Black Woman Owned Percentage", ColumnValue = appCriteriaDto.BlackWomenOwnedPercentage.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Military Vet Owned Percentage", ColumnValue = appCriteriaDto.MilitaryVeteranOwnedPercentage.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Non South African Owned Percentage", ColumnValue = appCriteriaDto.NonSouthAfricanOwnedPercentage.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Permanent Redidency", ColumnValue = appCriteriaDto.IsPermanentResident.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Number Of Owners", ColumnValue = appCriteriaDto.NumberOfOwners.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Number Of Fulltime Employees", ColumnValue = appCriteriaDto.NumberOfFullTimeEmployees.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Number Of Part Time Employees", ColumnValue = appCriteriaDto.NumberOfPartTimeEmployees.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "Average Annual Turnover", ColumnValue = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.AverageAnnualTurnoverListId)?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "Bee Level", ColumnValue = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.BeeLevelListId)?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "MinimumBeeShareholding", ColumnValue = appCriteriaDto.BeePartner?.MinimumBeeShareholding.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessBank", ColumnValue = appCriteriaDto.BusinessBank });
                        columns.Add(new DynamicColumn { ColumnName = "BankAccountServices", ColumnValue = appCriteriaDto.BankAccountServices });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessExpansionEmpowerment", ColumnValue = appCriteriaDto.BusinessExpansion?.Empowerment?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessExpansionHasCustomers", ColumnValue = appCriteriaDto.BusinessExpansion?.HasCustomers?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessExpansionIncreasedEmployees", ColumnValue = appCriteriaDto.BusinessExpansion?.IncreasedEmployees?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessExpansionIncreasedExports", ColumnValue = appCriteriaDto.BusinessExpansion?.IncreasedExports?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessExpansionIncreasedProfitability", ColumnValue = appCriteriaDto.BusinessExpansion?.IncreasedProfitability?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessExpansionLargePotentialMarket", ColumnValue = appCriteriaDto.BusinessExpansion?.LargePotentialMarket?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessExpansionRuralDevelopment", ColumnValue = appCriteriaDto.BusinessExpansion?.RuralDevelopment?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessExpansionSolvesSocial", ColumnValue = appCriteriaDto.BusinessExpansion?.SolvesSocial?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessExpansionWillSellShares", ColumnValue = appCriteriaDto.BusinessExpansion?.WillSellShares?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessProcessingServicesJobCreation", ColumnValue = appCriteriaDto.BusinessProcessingServices?.JobCreation?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessProcessingServicesSecureContracts", ColumnValue = appCriteriaDto.BusinessProcessingServices?.SecureContracts?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessProcessingServicesYouthJobs", ColumnValue = appCriteriaDto.BusinessProcessingServices?.YouthJobs?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BuyingABusinessBusinessType", ColumnValue = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.BuyingABusiness?.BusinessTypeListId)?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "BuyingABusinessIndustrySector", ColumnValue = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.BuyingABusiness?.IndustrySectorListId)?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "BuyingABusinessRuralOrTownship", ColumnValue = appCriteriaDto.BuyingABusiness?.RuralOrTownship?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BuyingAFranchiseAccredited", ColumnValue = appCriteriaDto.BuyingAFranchise?.Accredited?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BuyingAFranchisePreapproved", ColumnValue = appCriteriaDto.BuyingAFranchise?.Preapproved?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BuyingBusinessPropertyPropertyValue", ColumnValue = appCriteriaDto.BuyingBusinessProperty?.PropertyValue?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BuyingBusinessPropertyPropertyType", ColumnValue = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.BuyingBusinessProperty?.PropertyTypeListId)?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "CashFlowAssistanceHasPosDevice", ColumnValue = appCriteriaDto.CashFlowAssistance?.HasPosDevice?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CashForAnInvoiceChooseDifferentWorkingCapitalOption", ColumnValue = appCriteriaDto.CashForAnInvoice?.ChooseDifferentWorkingCapitalOption?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CashForAnInvoiceCustomerAgreedCompleted", ColumnValue = appCriteriaDto.CashForAnInvoice?.CustomerAgreedCompleted?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CashForAnInvoiceCustomerProfile", ColumnValue = appCriteriaDto.CashForAnInvoice?.CustomerProfile?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CashForAnInvoiceInvoiceValue", ColumnValue = appCriteriaDto.CashForAnInvoice?.InvoiceValue?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CashForAnInvoiceSaveAndContinueLater", ColumnValue = appCriteriaDto.CashForAnInvoice?.SaveAndContinueLater?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CommercialisingResearchIncreasedExports", ColumnValue = appCriteriaDto.CommercialisingResearch?.IncreasedExports?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CommercialisingResearchInnovation", ColumnValue = appCriteriaDto.CommercialisingResearch?.Innovation?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CommercialisingResearchJobCreation", ColumnValue = appCriteriaDto.CommercialisingResearch?.JobCreation?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CommercialisingResearchProducts", ColumnValue = appCriteriaDto.CommercialisingResearch?.Products?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CommercialisingResearchStudentStatus", ColumnValue = appCriteriaDto.CommercialisingResearch?.StudentStatus?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "CompanyRegistrationType", ColumnValue = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.CompanyRegistrationTypeListId)?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "ElectronicAccountingSystems", ColumnValue = appCriteriaDto.ElectronicAccountingSystems?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ExportConfirmedExportOrder", ColumnValue = appCriteriaDto.Export?.ConfirmedExportOrder?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ExportInternationalResearch", ColumnValue = appCriteriaDto.Export?.InternationalResearch?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ExportOrderValue", ColumnValue = appCriteriaDto.Export?.OrderValue?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "FinanceFor", ColumnValue = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.FinanceForListId)?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "FinanceForSub", ColumnValue = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.FinanceForSubListId)?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "HasCollateral", ColumnValue = appCriteriaDto.HasCollateral?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "HowIncomeReceived", ColumnValue = string.Join(",", appCriteriaDto.HowIncomeReceivedListIds?.Split(",").Select(a => _listItems.FirstOrDefault(b => b.ListId == a)?.Name) ?? Array.Empty<string>()) });
                        columns.Add(new DynamicColumn { ColumnName = "ImportSignedContract", ColumnValue = appCriteriaDto.Import?.SignedContract?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ImportCountry", ColumnValue = string.Join(",", appCriteriaDto.Import?.CountryListIds?.Split(",").Select(a => _listItems.FirstOrDefault(b => b.ListId == a)?.Name) ?? Array.Empty<string>()) });
                        columns.Add(new DynamicColumn { ColumnName = "ImportProductSection", ColumnValue = string.Join(",", appCriteriaDto.Import?.ProductSectionListIds?.Split(",").Select(a => _listItems.FirstOrDefault(b => b.ListId == a)?.Name) ?? Array.Empty<string>()) });
                        columns.Add(new DynamicColumn { ColumnName = "InvestedOwnMoney", ColumnValue = appCriteriaDto.InvestedOwnMoney?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "IsProfitable", ColumnValue = appCriteriaDto.IsProfitable?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "IsSouthAfricanCitizen", ColumnValue = appCriteriaDto.IsSouthAfricanCitizen?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "LoanAmount", ColumnValue = appCriteriaDto.LoanAmount.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "MoneyForContractContractAmount", ColumnValue = appCriteriaDto.MoneyForContract?.ContractAmount?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "MoneyForContractExperience", ColumnValue = appCriteriaDto.MoneyForContract?.Experience?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "MoneyForTenderCustomerProfile", ColumnValue = appCriteriaDto.MoneyForTender?.CustomerProfile?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "MoneyForTenderExperience", ColumnValue = appCriteriaDto.MoneyForTender?.Experience?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "MoneyForTenderTenderValue", ColumnValue = appCriteriaDto.MoneyForTender?.TenderValue?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "MonthlyIncomeRetail", ColumnValue = appCriteriaDto.MonthlyIncomeRetail?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "RegularMonthlyIncome", ColumnValue = appCriteriaDto.RegularMonthlyIncome?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "MonthStartedToTrade", ColumnValue = appCriteriaDto.MonthStartedToTrade?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "MonthsTrading", ColumnValue = appCriteriaDto.MonthsTrading?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "OtherBusinessLoans", ColumnValue = appCriteriaDto.OtherBusinessLoans?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "OtherElectronicAccountingSystems", ColumnValue = appCriteriaDto.OtherElectronicAccountingSystems?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "OtherPayrollSystem", ColumnValue = appCriteriaDto.OtherPayrollSystem?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "PartnerManagementBuyOutMinimumBeeShareholding", ColumnValue = appCriteriaDto.PartnerManagementBuyOut?.MinimumBeeShareholding?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "PayrollSystem", ColumnValue = appCriteriaDto.PayrollSystem?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "PersonalBank", ColumnValue = appCriteriaDto.PersonalBank?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ProductServiceExpansionTypeOfExpansion", ColumnValue = appCriteriaDto.ProductServiceExpansion?.TypeOfExpansion?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ProductServiceExpansionTypeOfExpansionOther", ColumnValue = appCriteriaDto.ProductServiceExpansion?.TypeOfExpansionOther?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "PropertyDevelopmentDevelopmentType", ColumnValue = appCriteriaDto.PropertyDevelopment?.DevelopmentType?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "RegisteredAddress", ColumnValue = companyDto.RegisteredAddress });
                        columns.Add(new DynamicColumn { ColumnName = "ProvinceListId", ColumnValue = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.ProvinceListId)?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "PurchaseOrderFundingCustomerProfile", ColumnValue = appCriteriaDto.PurchaseOrderFunding?.CustomerProfile?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "PurchaseOrderFundingFundingAmount", ColumnValue = appCriteriaDto.PurchaseOrderFunding?.FundingAmount?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "PurchaseOrderFundingExperience", ColumnValue = appCriteriaDto.PurchaseOrderFunding?.Experience?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ShopFittingRenovationsBondAmount", ColumnValue = appCriteriaDto.ShopFittingRenovations?.BondAmount?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ShopFittingRenovationsIsPropertyBonded", ColumnValue = appCriteriaDto.ShopFittingRenovations?.IsPropertyBonded?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ShopFittingRenovationsPropertyType", ColumnValue = appCriteriaDto.ShopFittingRenovations?.PropertyType?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "ShopFittingRenovationsPropertyValue", ColumnValue = appCriteriaDto.ShopFittingRenovations?.PropertyValue?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "YearStartedToTrade", ColumnValue = appCriteriaDto.YearStartedToTrade?.ToString() });
                        var industrySector = _listItems.FirstOrDefault(a => a.ListId == appCriteriaDto.IndustrySectorListId);
                        var industrySectorMain = _listItems.FirstOrDefault(a => a.ListId == industrySector?.ParentListId);
                        columns.Add(new DynamicColumn { ColumnName = "Industry Sector Main", ColumnValue = industrySectorMain?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "Industry Sector", ColumnValue = industrySector?.Name });
                        columns.Add(new DynamicColumn { ColumnName = "DoYouKnowYourPersonalCreditScore", ColumnValue = appCriteriaDto.DoYouKnowYourPersonalCreditScore?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "HasElecAccSystems", ColumnValue = appCriteriaDto.HasElecAccSystems?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "HasPayroll", ColumnValue = appCriteriaDto.HasPayroll?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "WantToUploadBusBankStatements", ColumnValue = appCriteriaDto.WantToUploadBusBankStatements?.ToString() });
                        columns.Add(new DynamicColumn { ColumnName = "BusinessTxPersonalAcc", ColumnValue = appCriteriaDto.BusinessTxPersonalAcc?.ToString() });

                        rows.Add(columns);
                    }

                    return rows.Select(x => x.ToDictionary(y => y.ColumnName, y => y.ColumnValue)).ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
                return await Task.FromResult<List<Dictionary<string, string>>>(null);
            }
        }

        public class DynamicColumn
        {
            public string ColumnName { get; set; }
            public string ColumnValue { get; set; }
        }
    }
}
