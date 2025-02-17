using Microsoft.AspNetCore.Mvc.Rendering;
using SME.Portal.Authorization.Users.Dto;
using SME.Portal.Currency.Dtos;
using SME.Portal.Lenders.Dtos;
using SME.Portal.List.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SME.Portal.Web.Areas.App.Models.FinanceProducts
{
    public class ManageFundFormViewModel : IManageView
    {
        public FinanceProductViewDto FinanceProduct { get; set; }
        public List<ListItemDto> FinanceForLists { get; set; }
        public List<ListItemDto> IndustrySectorLists { get; set; }
        public List<ListItemDto> FinanceForSubLists { get; set; }
        public List<ListItemDto> FinanceForSubChildLists { get; set; }
        public List<ListItemDto> IndustrySectorSubLists { get; set; }
        public List<ListItemDto> ProvinceTypeLists { get; set; }
        public List<ListItemDto> BeeLevelLists { get; set; }
        public List<ListItemDto> Countries { get; set; }
        public List<ListItemDto> CompanyRegistrationTypeLists { get; set; }
        public List<ListItemDto> CustomerTypeLists { get; set; }
        public List<ListItemDto> DocumentTypeLists { get; set; }
        public List<ListItemDto> LoanIndexLists { get; set; }
        public List<ListItemDto> LoanTypeLists { get; set; }
        public List<ListItemDto> LoanTypeSubLists { get; set; }
        public List<ListItemDto> OwnershipLists { get; set; }
        public bool IsEdit { get; set; }
        public bool Checked { get; set; }
        public bool FundFormError { get; set; }
        public bool FundFormExpired { get; set; }
        public string CurrentStep { get; set; }
        public string ProvinceTypeStrings { get; set; }
        public string NextStep { get; set; }
        public string WebsiteUrl { get; set; }
        public string ResearchUrl { get; set; }
        public string FinanceProductCommentText { get; set; }
        public bool IsPrimary { get; set; }
        public int FinanceProductId { get; set; }
        public int FundFormId { get; set; }
        public int WebsiteUrlId { get; set; }
        public int ResearchUrlId { get; set; }
        public int FinanceProductCommentId { get; set; }
        public long FinanceProductCommentUserId { get; set; }
        public string MatchCriteriaJsonString { get; set; }
        public string BaseModelType { get; set; }
        public Guid ManageFundFormToken {  get; set; }
        public string EncryptedFundFormToken {  get; set; }
        public List<LenderDto> Lenders { get; set; }
        public List<WebsiteUrlDto> WebsiteUrls { get; set; }
        public List<ResearchUrlDto> ResearchUrls { get; set; }
        public List<FinanceProductCommentDto> FinanceProductComments { get; set; }
        public List<CurrencyPairDto> CurrencyPairs { get; set; }

        public List<UserListDto> StaffMembers { get; set; }
        public string OwnershipStrings { get; set; }
        public SelectList SelectLenders
        {
            get
            {
                if (Lenders?.Any() ?? false)
                {
                    return new SelectList(Lenders, "Id", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectCurrencyPairs
        {
            get
            {
                if (CurrencyPairs?.Any() ?? false)
                {
                    return new SelectList(CurrencyPairs, "Id", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectUsersList
        {
            get
            {
                if (StaffMembers?.Any() ?? false)
                {
                    return new SelectList(StaffMembers, "Id", "UserName");
                }
                return new SelectList(Enumerable.Empty<List<UserListDto>>(), "Id", "UserName");
            }
        }
        public SelectList SelectOwnershipList
        {
            get
            {
                if (OwnershipLists?.Any() ?? false)
                {
                    return new SelectList(OwnershipLists, "Name", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "Name", "Name");
            }
        }
    }
}


