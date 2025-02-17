using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SME.Portal.Authorization;
using SME.Portal.Authorization.Users;
using SME.Portal.Lenders.Dtos;
using SME.Portal.List;
using SME.Portal.List.Dtos;
using SME.Portal.Url;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Lenders
{
    [RemoteService]
    [AllowAnonymous]
    public class FundFormsAppService : PortalAppServiceBase, IFundFormsAppService
    {
        private readonly IRepository<FundForms> _fundFormRepository;
        private readonly IRepository<FundFormDraftView> _fundFormDraftViewRepository;
        private readonly IRepository<FinanceProduct> _financeProductRepository;
        private readonly IRepository<WebsiteUrl> _websiteUrlRepository;
        private readonly IUserEmailer _userEmailer;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<ListItem> _listItemRepository;

        public IAppUrlService AppUrlService { get; set; }


        public FundFormsAppService(
           IRepository<FundFormDraftView> fundFormDraftViewRepository,
           IRepository<FundForms> fundFormRepository,
           IRepository<FinanceProduct> financeProductRepository,
           IRepository<WebsiteUrl> websiteUrlRepository,
           IUserEmailer userEmailer,
           IUnitOfWorkManager unitOfWorkManager,
           IRepository<ListItem> listItemRepository)
        {
            _fundFormDraftViewRepository = fundFormDraftViewRepository;
            _fundFormRepository = fundFormRepository;
            _financeProductRepository = financeProductRepository;
            _userEmailer = userEmailer;
            AppUrlService = NullAppUrlService.Instance;
            _unitOfWorkManager = unitOfWorkManager;
            _listItemRepository = listItemRepository;
            _websiteUrlRepository = websiteUrlRepository;
        }

        [AbpAllowAnonymous]
        public async Task<FinanceProductViewDto> GetManageFundFormByFinanceProductId(Guid tokens)
        {
            /*var fundForm = await _fundFormDraftViewRepository.GetAll().Include(a => a.FinanceProductFk).Where(a => a.Token == tokens).FirstOrDefaultAsync();*/
            var fundForm = await _fundFormDraftViewRepository.GetAll().Where(a => a.Token == tokens).FirstOrDefaultAsync();
            var result = ObjectMapper.Map<FinanceProductViewDto>(fundForm);
            return result;
        }

        [AllowAnonymous]
        public async Task CreateOrEditFundForm(CreateOrEditFundFormDto input)
        {
            var fundForm = await _fundFormRepository.FirstOrDefaultAsync(a => a.Token == input.Token);
            
            if (!String.IsNullOrEmpty(input.MatchCriteriaJson))
            {
                fundForm.MatchCriteriaJson = input.MatchCriteriaJson;
            }
            if (!String.IsNullOrEmpty(input.FinanceProductName) && input.FinanceProductName != fundForm.FinanceProductName)
            {
                fundForm.FinanceProductName = input.FinanceProductName;
            }
            if (!String.IsNullOrEmpty(input.FundWebsiteAddress) && input.FundWebsiteAddress != fundForm.FundWebsiteAddress)
            {
               fundForm.FundWebsiteAddress = input.FundWebsiteAddress;
            }
            if (input.BeenCompleted != false)
            {
                fundForm.BeenCompleted = input.BeenCompleted;
            }
            await _fundFormRepository.UpdateAsync(fundForm);
            await _unitOfWorkManager.Current.SaveChangesAsync();
        }
        [AbpAuthorize(AppPermissions.Pages_Administration_FinanceProducts_Create, AppPermissions.Pages_Administration_FinanceProducts_Edit)]
        public async Task InsertSendFundFormsEmail(FundFormDto input)
        {
            if (input.Id.HasValue)
            {
                var fundForm = await _fundFormRepository.GetAll().Where(a => a.Id == input.Id).FirstOrDefaultAsync();
                fundForm.Token = Guid.NewGuid();
                fundForm.TokenIssueDate = DateTime.UtcNow;
                fundForm.ReSendExpiredFundForm = true;
                await _fundFormRepository.UpdateAsync(fundForm);
                await _unitOfWorkManager.Current.SaveChangesAsync();
                await _userEmailer.SendFundFormsLinkAsync(fundForm, AppUrlService.CreateFundFormUrlFormat());
            }
            else
            {
                var financeProduct = await _financeProductRepository.GetAll().Include(a => a.LenderFk).Where(a => a.Id == input.FinanceProductId).FirstOrDefaultAsync();
                var websiteUrl = await _websiteUrlRepository.GetAll().Where(w => w.FinanceProductId == input.FinanceProductId && w.IsPrimary).FirstOrDefaultAsync();
                var fundForm = ObjectMapper.Map<FundForms>(input);
                fundForm.Token = Guid.NewGuid();
                fundForm.TokenIssueDate = DateTime.UtcNow;
                fundForm.MatchCriteriaJson = financeProduct.MatchCriteriaJson;
                fundForm.FinanceProductName = financeProduct.Name;
                fundForm.TenantId = financeProduct.TenantId;
                fundForm.LenderId = financeProduct.LenderId;
                fundForm.LenderName = financeProduct.LenderFk.Name;
                fundForm.LenderType = financeProduct.LenderFk.LenderType;
                fundForm.PhysicalAddressLineOne = financeProduct.LenderFk.PhysicalAddressLineOne;
                fundForm.PhysicalAddressLineTwo = financeProduct.LenderFk.PhysicalAddressLineTwo;
                fundForm.PhysicalAddressLineThree = financeProduct.LenderFk.PhysicalAddressLineThree;
                fundForm.City = financeProduct.LenderFk.City;
                fundForm.PostalCode = financeProduct.LenderFk.PostalCode;
                fundForm.Province = financeProduct.LenderFk.Province;
                fundForm.FundWebsiteAddress = websiteUrl?.Url;
                await _fundFormRepository.InsertAsync(fundForm);
                await _unitOfWorkManager.Current.SaveChangesAsync();
                await _userEmailer.SendFundFormsLinkAsync(fundForm, AppUrlService.CreateFundFormUrlFormat());

            }
        }
        [AbpAllowAnonymous]
        public async Task<List<FundFormDto>> GetFundFormsByFinanceProductId(int financeProductId)
        {
            var fundforms = await _fundFormRepository.GetAll().Include(e => e.UserFk).Include(e => e.FinanceProductFk).ThenInclude(e => e.LenderFk).Where(a => a.FinanceProductId == financeProductId).ToListAsync();
            return fundforms.Select(w =>
            new FundFormDto
            {
                LenderName = w.FinanceProductFk.LenderFk.Name,
                FinanceProductName = w.FinanceProductFk.Name,
                TokenIssueDate = w.TokenIssueDate,
                BeenCompleted = w.BeenCompleted,
                CreatedByUserName = w.UserFk.Name,
                MatchCriteriaJson = w.MatchCriteriaJson,
                Id = w.Id
            }).ToList();
        }
        [AbpAllowAnonymous]
        public FundFormViewDto GetFundFormDraftViewById(EntityDto input)
        {
            var fundFormDraft = _fundFormDraftViewRepository.FirstOrDefault(a => a.Id == input.Id);
            var result = ObjectMapper.Map<FundFormViewDto>(fundFormDraft);
            return result;
        }

        [AbpAllowAnonymous]
        public List<ListItemDto> GetAllGrandChildLists(string grandParentListId, int? tenantId)
        {
            using (CurrentUnitOfWork.SetTenantId(tenantId))
            {
                var lists = _listItemRepository.GetAll().Where(p => p.ParentListId == grandParentListId && p.TenantId == tenantId).ToList();
                var model = new List<ListItemDto>();
                lists.ForEach(list =>
                {
                    var childlists = GetAllChildLists(list.ListId, tenantId);
                    foreach (var childlist in childlists)
                    {
                        childlist.ParentName = list.Name;
                    }
                    model.AddRange(childlists);
                });

                return model;

            }
        }
        [AbpAllowAnonymous]
        public List<ListItemDto> GetAllChildLists(string parentListId, int? tenantId)
        {
            using (CurrentUnitOfWork.SetTenantId(tenantId))
            {
                if (parentListId == "0")
                    parentListId = null;

                var lists = GetAllChildListsBatch(0, 100, parentListId, tenantId)
                                                .Select(a => ObjectMapper.Map<ListItemDto>(a)).ToList();
                if (parentListId != null && lists.Any())
                {
                    var parentList = GetListById(parentListId, tenantId);
                    lists.ForEach(list =>
                    {
                        list.ParentName = parentList.Name;
                    });
                }

                return lists;
            }
        }
        [AbpAllowAnonymous]
        private List<ListItem> GetAllChildListsBatch(int skip, int limit, string parentListId, int? tenantId)
        {
            var lists = _listItemRepository.GetAll().Where(p => p.ParentListId == parentListId && p.TenantId == tenantId).OrderBy(p => p.Name).Skip(skip).Take(limit).ToList();
            if (lists.Count >= limit)
            {
                lists.AddRange(GetAllChildListsBatch(skip + limit, limit, parentListId, tenantId));
            }
            return lists;
        }
        [AbpAllowAnonymous]
        public ListItemDto GetListById(string id, int? tenantId)
        {
            var list = _listItemRepository.FirstOrDefault(p => p.ListId == id && p.TenantId == tenantId);
            return ObjectMapper.Map<ListItemDto>(list);
        }

        [AbpAllowAnonymous]
        public async Task<string> GetListItemsName(string id, int?  tenantId)
        {
            List<string> items = id.Split(',').ToList();
            var name = await _listItemRepository.GetAll().Where(p => items.Contains(p.ListId) && p.TenantId == tenantId).Select(p => p.Name).ToListAsync();
            var result = string.Join(";", name);
            return result;
        }
        [AbpAuthorize(AppPermissions.Pages_Administration_FinanceProducts_Delete)]
        public async Task DeleteFundForm(int fundFormId)
        {
            await _fundFormRepository.DeleteAsync(fundFormId);
        }
    }
}
