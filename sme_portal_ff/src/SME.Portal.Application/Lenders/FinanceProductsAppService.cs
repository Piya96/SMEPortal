using SME.Portal.Currency;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.Lenders.Exporting;
using SME.Portal.Lenders.Dtos;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using SME.Portal.List;
using SME.Portal.Lenders.Helpers;
using Abp.Collections.Extensions;
using Abp.Domain.Uow;
using Abp.EntityFrameworkCore.EFPlus;
using System.Linq.Expressions;
using SME.Portal.Authorization.Users;

namespace SME.Portal.Lenders
{

    [AbpAuthorize]
    public class FinanceProductsAppService : PortalAppServiceBase, IFinanceProductsAppService
    {
        private readonly IRepository<FinanceProduct> _financeProductRepository;
        private readonly IRepository<WebsiteUrl> _websiteUrlRepository;
        private readonly IRepository<ResearchUrl> _researchUrlRepository;
        private readonly IRepository<FinanceProductComment> _financeProductCommentRepository;
        private readonly IRepository<FinanceProductView> _financeProductViewRepository;
        private readonly IFinanceProductsExcelExporter _financeProductsExcelExporter;
        private readonly IRepository<Lender, int> _lookup_lenderRepository;
        private readonly IRepository<CurrencyPair, int> _lookup_currencyPairRepository;
        private readonly IListItemsAppService _listItemsAppService;
        private readonly IUserAppService _userAppService;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public FinanceProductsAppService(IRepository<FinanceProduct> financeProductRepository,
            IFinanceProductsExcelExporter financeProductsExcelExporter,
            IRepository<Lender, int> lookup_lenderRepository,
            IRepository<CurrencyPair, int> lookup_currencyPairRepository,
            IListItemsAppService listItemsAppService,
            IRepository<FinanceProductView> financeProductViewRepository,
            IRepository<WebsiteUrl> websiteUrlRepository,
            IRepository<ResearchUrl> researchUrlRepository,
            IRepository<FinanceProductComment> financeProductCommentRepository,
            IUnitOfWorkManager unitOfWorkManager,
            IUserAppService userAppService)
        {
            _financeProductRepository = financeProductRepository;
            _financeProductsExcelExporter = financeProductsExcelExporter;
            _lookup_lenderRepository = lookup_lenderRepository;
            _lookup_currencyPairRepository = lookup_currencyPairRepository;
            _listItemsAppService = listItemsAppService;
            _financeProductViewRepository = financeProductViewRepository;
            _websiteUrlRepository = websiteUrlRepository;
            _researchUrlRepository = researchUrlRepository;
            _financeProductCommentRepository = financeProductCommentRepository;
            _unitOfWorkManager = unitOfWorkManager;
            _userAppService = userAppService;
        }

        public async Task<PagedResultDto<GetFinanceProductForViewDto>> SearchAll(SearchAllFinanceProductsInput input)
        {
            try
            {
                using (_unitOfWorkManager.Current.DisableFilter(AbpDataFilters.SoftDelete))
                {
                    var mappedIndustrySectorIds = new List<string>();
                    List<string> financeForList = input.FinanceForIdFilter.Split(",").Select(f => f.Trim()).ToList();
                    List<string> industrySectorList = input.IndustrySectorIdFilter.Split(",").Select(f => f.Trim()).ToList();
                    List<string> beeLevelList = input.BeeLevelFilter.Split(",").Select(f => f.Trim()).ToList();
                    List<string> companyRegistrationList = input.CompanyRegistrationTypeIdFilter.Split(",").Select(f => f.Trim()).ToList();
                    List<string> documentTypeList = input.DocumentTypeIdFilter.Split(",").Select(f => f.Trim()).ToList();
                    List<string> provinceList = input.ProvinceTypeIdFilter.Split(",").Select(f => f.Trim()).ToList();
                    List<string> ownershipList = input.OwnershipIdFilter.Split(",").Select(f => f.Trim()).ToList();
                    var filteredFinanceProductsView = _financeProductViewRepository.GetAll()
                    .Include(e => e.LenderFk)
                    .Include(e => e.CurrencyPairFk)
                    .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name.Contains(input.NameFilter))
                    .WhereIf(input.LenderIdFilter.HasValue, e => e.LenderFk != null && e.LenderFk.Id == input.LenderIdFilter)
                    .WhereIf(!string.IsNullOrEmpty(input.CountryIdFilter), e => e.CountryListIds.Contains(input.CountryIdFilter))
                    .WhereIf(!string.IsNullOrEmpty(input.LoanTypeIdFilter), e => e.LoanTypeListIds.Contains(input.LoanTypeIdFilter))
                    .WhereIf(input.SaCitizensOnlyFilter.HasValue, e => e.SaCitizensOnly == input.SaCitizensOnlyFilter)
                    .WhereIf(input.MinLoanAmountFilter.HasValue, e => e.MinLoanAmount >= input.MinLoanAmountFilter)
                    .WhereIf(input.MaxLoanAmountFilter.HasValue, e => e.MaxLoanAmount <= input.MaxLoanAmountFilter)
                    .WhereIf(input.MinMonthsTradingFilter.HasValue, e => e.MinimumMonthsTrading >= input.MinMonthsTradingFilter)
                    .WhereIf(input.MinMonthlyIncomeFilter.HasValue, e => e.MinimumMonthlyIncome >= input.MinMonthlyIncomeFilter)
                    .WhereIf(input.CollateralBusinessFilter.HasValue, e => e.RequireBusinessCollateral == input.CollateralBusinessFilter)
                    .WhereIf(input.CollateralOwnerFilter.HasValue, e => e.RequireOwnerCollateral == input.CollateralOwnerFilter)
                    .WhereIf(input.RequiresProfitabilityFilter.HasValue, e => e.RequiresProfitability == input.RequiresProfitabilityFilter)
                    .WhereIf(input.MinAverageAnnualTurnoverFilter.HasValue, e => e.MinAverageAnnualTurnover >= input.MinAverageAnnualTurnoverFilter)
                    .WhereIf(input.MaxAverageAnnualTurnoverFilter.HasValue, e => e.MaxAverageAnnualTurnover <= input.MaxAverageAnnualTurnoverFilter)
                    .WhereIf(input.IsDeleted.HasValue, p => p.IsDeleted == input.IsDeleted)
                    .WhereIf(input.IsEnabled.HasValue, p => p.Enabled == input.IsEnabled)
                    .WhereIf(AbpSession.TenantId.HasValue, p => p.TenantId == AbpSession.TenantId);

                    var financeProducts = await filteredFinanceProductsView.Select(a =>

                                          new GetFinanceProductForViewDto()
                                          {
                                              FinanceProduct = new FinanceProductDto
                                              {
                                                  Name = a.Name,
                                                  ShowMatchResults = a.ShowMatchResults,
                                                  Enabled = a.Enabled,
                                                  Id = a.Id,
                                                  LenderId = a.LenderId,
                                                  SummaryHtml = a.SummaryHtml,
                                                  LastCheckedDate = a.LastCheckedDate,
                                                  MinLoanAmount = a.MinLoanAmount,
                                                  MaxLoanAmount = a.MaxLoanAmount,
                                                  FinanceForSubListIds = a.FinanceForSubListIds,
                                                  FinanceForSubCategoryListIds = a.FinanceForSubCategoryListIds,
                                                  SaCitizensOnly = a.SaCitizensOnly,
                                                  CompanyRegistrationTypeListIds = a.CompanyRegistrationTypeListIds,
                                                  PostalAddressProvince = a.PostalAddressProvince,
                                                  MinimumMonthsTrading = a.MinimumMonthsTrading,
                                                  MinAverageAnnualTurnover = a.MinAverageAnnualTurnover,
                                                  IndustrySectorListIds = a.IndustrySectorListIds,
                                                  MinimumMonthlyIncome = a.MinimumMonthlyIncome,
                                                  RequiresProfitability = a.RequiresProfitability,
                                                  RequiresCollateral = a.RequiresCollateral,
                                                  OwnershipRulesFilter = a.OwnershipRulesFilter,
                                                  BeeLevelListIds = a.BeeLevelListIds,
                                                  CountryListIds = a.CountryListIds,
                                                  LenderName = a.LenderFk.Name,
                                                  CheckedOutSubjectId = a.CheckedOutSubjectId,
                                                  CheckedOutUserName = null,
                                                  ProvinceListIds = a.ProvinceListIds,
                                                  RequiredDocumentTypeListIds = a.RequiredDocumentTypeListIds
                                              },
                                              LenderId = a.LenderFk.Id,
                                              LenderName = a.LenderFk.Name,
                                              CurrencyPairName = a.CurrencyPairFk.Name
                                          }).ToListAsync();

                    financeProducts = financeProducts.WhereIf(!string.IsNullOrEmpty(input.DocumentTypeIdFilter), e => e.FinanceProduct.RequiredDocumentTypeListIds != null && documentTypeList.Any(value => e.FinanceProduct.RequiredDocumentTypeListIds.Contains(value))).WhereIf(!string.IsNullOrEmpty(input.FinanceForIdFilter), e => e.FinanceProduct.FinanceForSubListIds != null && financeForList.Any(value => e.FinanceProduct.FinanceForSubListIds.Contains(value))).WhereIf(!string.IsNullOrEmpty(input.IndustrySectorIdFilter), e => e.FinanceProduct.IndustrySectorListIds != null && industrySectorList.Any(value => e.FinanceProduct.IndustrySectorListIds.Contains(value))).WhereIf(!string.IsNullOrEmpty(input.BeeLevelFilter), e => e.FinanceProduct.BeeLevelListIds != null && beeLevelList.Any(value => e.FinanceProduct.BeeLevelListIds.Contains(value))).WhereIf(!string.IsNullOrEmpty(input.CompanyRegistrationTypeIdFilter), e => e.FinanceProduct.CompanyRegistrationTypeListIds != null && companyRegistrationList.Any(value => e.FinanceProduct.CompanyRegistrationTypeListIds.Contains(value))).WhereIf(!string.IsNullOrEmpty(input.ProvinceTypeIdFilter), e => e.FinanceProduct.ProvinceListIds != null && provinceList.Any(value => e.FinanceProduct.ProvinceListIds.Contains(value))).WhereIf(!string.IsNullOrEmpty(input.OwnershipIdFilter), e => e.FinanceProduct.OwnershipRulesFilter != null && ownershipList.Any(value => e.FinanceProduct.OwnershipRulesFilter.Contains(value))).ToList();
                    if (financeProducts != null)
                    {
                        foreach (var finance in financeProducts)
                        {
                            var FPData = finance.FinanceProduct;
                            FPData.FinanceForSubListIds = !string.IsNullOrEmpty(FPData.FinanceForSubListIds) ? await _listItemsAppService.GetListItemsName(FPData.FinanceForSubListIds) : null;
                            FPData.FinanceForSubCategoryListIds = !string.IsNullOrEmpty(FPData.FinanceForSubCategoryListIds) ? await _listItemsAppService.GetListItemsName(FPData.FinanceForSubCategoryListIds) : null;
                            FPData.CompanyRegistrationTypeListIds = !string.IsNullOrEmpty(FPData.CompanyRegistrationTypeListIds) ? await _listItemsAppService.GetListItemsName(FPData.CompanyRegistrationTypeListIds) : null;
                            FPData.IndustrySectorListIds = !string.IsNullOrEmpty(FPData.IndustrySectorListIds) ? await _listItemsAppService.GetListItemsName(FPData.IndustrySectorListIds) : null;
                            FPData.BeeLevelListIds = !string.IsNullOrEmpty(FPData.BeeLevelListIds) ? await _listItemsAppService.GetListItemsName(FPData.BeeLevelListIds) : null;
                            FPData.CountryListIds = !string.IsNullOrEmpty(FPData.CountryListIds) ? await _listItemsAppService.GetListItemsName(FPData.CountryListIds) : null;
                            FPData.CheckedOutUserName = FPData.CheckedOutSubjectId != null ? await _userAppService.GetUserById(FPData.CheckedOutSubjectId) : null;
                        }
                    }

                    var pagedAndFilteredFinanceProducts = financeProducts.OrderBy(a => a.LenderName);

                    var totalCount = financeProducts.Count();

                    return new PagedResultDto<GetFinanceProductForViewDto>(
                        totalCount,
                        pagedAndFilteredFinanceProducts.ToList()
                    );
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error ", e);
                return new PagedResultDto<GetFinanceProductForViewDto>(
                        0,
                        new List<GetFinanceProductForViewDto>()
                    );
            }
        }

        private bool LastCheckedDateFilter(DateTime lastCheckedDate, string lastUpdatedStatus)
        {
            var dayDifference = (DateTimeExt.GetSaNow() - lastCheckedDate).Days;

            switch (lastUpdatedStatus)
            {
                case "checked":
                    return dayDifference <= LastUpdatedLegendHelper.CheckedDays;
                case "due":
                    return dayDifference >= LastUpdatedLegendHelper.CheckingDueDaysMin && dayDifference <= LastUpdatedLegendHelper.CheckingDueDaysMax;
                case "overdue":
                    return dayDifference >= LastUpdatedLegendHelper.CheckingOverdueDaysMin && dayDifference <= LastUpdatedLegendHelper.CheckingOverdueDaysMax;
                case "emergency":
                    return dayDifference >= LastUpdatedLegendHelper.CheckingEmergencyDays;
            }

            return true;
        }

        public List<FinanceProductDto> GetAllFinanceProductsById(List<int> ids)
        {
            var financeProducts = _financeProductRepository.GetAllIncluding(a => a.LenderFk)
                                                           .Where(a => ids.Contains(a.Id))
                                                           .ToList();

            return financeProducts.Select(a => ObjectMapper.Map<FinanceProductDto>(a)).ToList();
        }

        public List<FinanceProductDto> GetAllFinanceProductsByLenderId(int lenderId)
        {
            var financeProducts = _financeProductRepository.GetAll().Where(a => a.LenderId == lenderId)
                                                           .ToList();

            return financeProducts.Select(a => ObjectMapper.Map<FinanceProductDto>(a)).ToList();
        }

        public FinanceProductViewDto GetFinanceProductById(EntityDto input)
        {
            var financeProduct =  _financeProductViewRepository.FirstOrDefault(input.Id);
            var result = ObjectMapper.Map<FinanceProductViewDto>(financeProduct);
            return result;
        }

        public async Task<GetFinanceProductForViewDto> GetFinanceProductForView(int id)
        {
            // NB: setting the TenantId for the UOW to null to include all as matching is across all tenants 
            using (UnitOfWorkManager.Current.SetTenantId(null))
            {
                var financeProduct = await _financeProductRepository.GetAsync(id);

                var output = new GetFinanceProductForViewDto { FinanceProduct = ObjectMapper.Map<FinanceProductDto>(financeProduct) };

                var _lookupLender = await _lookup_lenderRepository.FirstOrDefaultAsync((int)output.FinanceProduct.LenderId);
                output.LenderName = _lookupLender?.Name?.ToString();

                if (output.FinanceProduct.CurrencyPairId != null)
                {
                    var _lookupCurrencyPair = await _lookup_currencyPairRepository.FirstOrDefaultAsync((int)output.FinanceProduct.CurrencyPairId);
                    output.CurrencyPairName = _lookupCurrencyPair?.Name?.ToString();
                }

                return output;
            }
        }

        public async Task<int> CreateOrEdit(CreateOrEditFinanceProductDto input)
        {
            if (input.Id == null)
            {
               return await Create(input);
            }
            else
            {
               return await Update(input);
            } 
        }

        public async Task UpdateCheckedOutSubjectId(int id,int? userId)
        {
            var financeProduct = await _financeProductRepository.FirstOrDefaultAsync(id);
            financeProduct.CheckedOutSubjectId = userId;
            await _financeProductRepository.UpdateAsync(financeProduct);
            
        }

        public async Task<WebsiteUrlDto> AddWebsiteUrl(CreateWebsiteUrlDto input)
        {
            var websiteUrl = ObjectMapper.Map<WebsiteUrl>(input);
            var websiteUrlId = await _websiteUrlRepository.InsertAndGetIdAsync(websiteUrl);
            return new WebsiteUrlDto { Id=websiteUrlId,IsPrimary=input.IsPrimary};
        }

        public async Task MergeFundFormsPrimaryWebsiteUrls(int financeProductId, string FundWebsiteAddress)
        {
            var websites = await _websiteUrlRepository.GetAll().Where(w => w.FinanceProductId == financeProductId).ToListAsync();
            if (!websites.Any(w => w.Url.Contains(FundWebsiteAddress)))
            {
                if (websites.Any())
                {
                    var primary = websites.Single(a => a.IsPrimary);
                    primary.Url = FundWebsiteAddress;
                    await _websiteUrlRepository.UpdateAsync(primary);
                }
                else
                {
                    var input = new CreateWebsiteUrlDto()
                    {
                        FinanceProductId = financeProductId,
                        Url = FundWebsiteAddress,
                        IsPrimary = true
                    };
                    var websiteUrl = ObjectMapper.Map<WebsiteUrl>(input);
                    await _websiteUrlRepository.InsertAsync(websiteUrl);
                }
            }
        }

        public async Task<int> AddResearchUrl(CreateResearchUrlDto input)
        {
            var researchUrl = ObjectMapper.Map<ResearchUrl>(input);
            var researchUrlId = await _researchUrlRepository.InsertAndGetIdAsync(researchUrl);
            return researchUrlId;
        }

        public async Task CreateFinanceProductComment(FinanceProductCommentDto input)
        {
            var comment = ObjectMapper.Map<FinanceProductComment>(input);
            await _financeProductCommentRepository.InsertAsync(comment);
            /* Explicitly Saving the changes to database inorder to avoid reduntant data in the local PortalDbContext Cache */
            await _unitOfWorkManager.Current.SaveChangesAsync();
        }

        public async Task ResetPrimaryUrls(WebsiteUrlDto WebsiteUrl, int financeProductId)
        {
            if (WebsiteUrl.IsPrimary)
            {
                Expression<Func<WebsiteUrl, bool>> predicateFilter = a => a.FinanceProductId == financeProductId && a.IsPrimary && a.Id != WebsiteUrl.Id;
                Expression<Func<WebsiteUrl, WebsiteUrl>> updateExpression = u => new WebsiteUrl { IsPrimary = false };
                await _websiteUrlRepository.BatchUpdateAsync(updateExpression, predicateFilter, null);
            }
        }

        public async Task DeleteWebsiteUrl(int websiteurlId)
        {
            await _websiteUrlRepository.DeleteAsync(websiteurlId);
            /* Explicitly Saving the changes to database inorder to avoid reduntant data in the local PortalDbContext Cache */
            await _unitOfWorkManager.Current.SaveChangesAsync();
        }

        public async Task DeleteResearchUrl(int researchurlId)
        {
            await _researchUrlRepository.DeleteAsync(researchurlId);
            /* Explicitly Saving the changes to database inorder to avoid reduntant data in the local PortalDbContext Cache */
            await _unitOfWorkManager.Current.SaveChangesAsync();
        }

        public async Task DeleteFinanceProductComments(int commentId)
        {
            await _financeProductCommentRepository.DeleteAsync(commentId);
            /* Explicitly Saving the changes to database inorder to avoid reduntant data in the local PortalDbContext Cache */
            await _unitOfWorkManager.Current.SaveChangesAsync();
        }

        public async Task<List<WebsiteUrlDto>> GetWebsiteUrlsByFinanceProductId(int financeProductId)
        {
            var websiteurls = await _websiteUrlRepository.GetAll().Where(a=> a.FinanceProductId == financeProductId && !a.IsDeleted).ToListAsync();
            return websiteurls.Select(w =>
            new WebsiteUrlDto
            {
                Id = w.Id,
                Url = w.Url,
                IsPrimary = w.IsPrimary,
                FinanceProductId = w.FinanceProductId
            }).ToList();
        }
        public async Task<List<ResearchUrlDto>> GetResearchUrlsByFinanceProductId(int financeProductId)
        {
            var researchurls = await _researchUrlRepository.GetAll().Where(a => a.FinanceProductId == financeProductId && !a.IsDeleted).ToListAsync();
            return researchurls.Select(w =>
            new ResearchUrlDto
            {
                Id = w.Id,
                Url = w.Url,
                FinanceProductId = w.FinanceProductId
            }).ToList();
        }

        public async Task<List<FinanceProductCommentDto>> GetFinanceProductCommentsByFinanceProductId(int financeProductId)
        {
            var comments = await _financeProductCommentRepository.GetAll().Include(e => e.UserFk).Where(a => a.FinanceProductId == financeProductId && !a.IsDeleted).OrderByDescending(a => a.CreationTime).ToListAsync();
            return comments.Select(w =>
            new FinanceProductCommentDto
            {
                Id = w.Id,
                Text = w.Text,
                CreationTime = w.CreationTime,
                FinanceProductId = w.FinanceProductId,
                UserName = w.UserFk.Name
            }).ToList();
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_FinanceProducts_Create)]
        protected virtual async Task<int> Create(CreateOrEditFinanceProductDto input)
        {
            var financeProduct = ObjectMapper.Map<FinanceProduct>(input);
            financeProduct.VersionLabel = "";
            financeProduct.LastCheckedDate = DateTime.UtcNow;
            if (AbpSession.TenantId != null)
            {
                financeProduct.TenantId = (int)AbpSession.TenantId;
            }
            if (input.LastCheckedUserStatus.HasValue)
            {
                financeProduct.LastCheckedUserId = AbpSession.UserId;
            }
            await _unitOfWorkManager.Current.SaveChangesAsync();
            return await _financeProductRepository.InsertAndGetIdAsync(financeProduct);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_FinanceProducts_Edit)]
        protected virtual async Task<int> Update(CreateOrEditFinanceProductDto input)
        {
            await _financeProductRepository.UpdateAsync((int)input.Id, async (entity) =>
            {
                if (!String.IsNullOrEmpty(input.MatchCriteriaJson))
                {
                    entity.MatchCriteriaJson = input.MatchCriteriaJson;
                }
                if (!String.IsNullOrEmpty(input.Name))
                {
                    entity.Name = input.Name;
                }
                if (input.AssignedTo.HasValue)
                {
                    entity.AssignedTo = input.AssignedTo;
                }
                if (input.CurrencyPairId.HasValue)
                {
                    entity.CurrencyPairId = input.CurrencyPairId;
                }
                if (input.LenderId != 0)
                {
                    entity.LenderId = input.LenderId;
                }
                if (input.Enabled)
                {
                    entity.Enabled = input.Enabled;
                }
                if (!String.IsNullOrEmpty(input.Summary))
                {
                    entity.Summary = input.Summary;
                }
                if(input.LastCheckedUserStatus.HasValue)
                {
                    entity.LastCheckedUserId = AbpSession.UserId;
                }
                entity.LastCheckedDate = DateTime.UtcNow;
                
            });
            await _unitOfWorkManager.Current.SaveChangesAsync();
            return (int)input.Id;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_FinanceProducts_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _financeProductRepository.DeleteAsync(input.Id);
        }

        public async Task Retrieve(EntityDto input)
        {
            using (_unitOfWorkManager.Current.DisableFilter(AbpDataFilters.SoftDelete))
            {
                var financeProduct = await _financeProductRepository.FirstOrDefaultAsync((int)input.Id);
                financeProduct.IsDeleted = false;
                await _financeProductRepository.UpdateAsync(financeProduct);
            }

        }

        public async Task<LastUpdatedLegendDto> GetLastUpdatedStatus()
        {
            var finProducts = await _financeProductRepository.GetAll()
                .WhereIf(AbpSession.TenantId.HasValue,p => p.TenantId == AbpSession.TenantId && p.IsDeleted == false && !p.Enabled).ToListAsync();

            var currentDate = DateTimeExt.GetSaNow();

            var green = finProducts.Count(a => (currentDate - a.LastCheckedDate).Days <= LastUpdatedLegendHelper.CheckedDays);
            var orange = finProducts.Count(a => (currentDate - a.LastCheckedDate).Days >= LastUpdatedLegendHelper.CheckingDueDaysMin && (currentDate - a.LastCheckedDate).Days <= LastUpdatedLegendHelper.CheckingDueDaysMax);
            var purple = finProducts.Count(a => (currentDate - a.LastCheckedDate).Days >= LastUpdatedLegendHelper.CheckingOverdueDaysMin && (currentDate - a.LastCheckedDate).Days <= LastUpdatedLegendHelper.CheckingOverdueDaysMax);
            var red = finProducts.Count(a => (currentDate - a.LastCheckedDate).Days >= LastUpdatedLegendHelper.CheckingEmergencyDays);

            return new LastUpdatedLegendDto() { GreenCount = green, OrangeCount = orange, PurpleCount = purple, RedCount = red };
        }
    }
}