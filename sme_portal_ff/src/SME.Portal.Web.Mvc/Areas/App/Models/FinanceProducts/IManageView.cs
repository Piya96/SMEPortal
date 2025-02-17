using Microsoft.AspNetCore.Mvc.Rendering;
using SME.Portal.Lenders.Dtos;
using SME.Portal.List.Dtos;
using System;
using System.Collections.Generic;

namespace SME.Portal.Web.Areas.App.Models.FinanceProducts
{
    public interface IManageView
    {
        public FinanceProductViewDto FinanceProduct { get; set; }
        public SelectList SelectLenders { get; }
        public SelectList SelectUsersList { get; }
        public SelectList SelectCurrencyPairs { get; }
        public SelectList SelectOwnershipList { get; }
        public List<ListItemDto> ProvinceTypeLists { get; set; }
        public List<ListItemDto> FinanceForLists { get; set; }
        public List<ListItemDto> FinanceForSubLists { get; set; }
        public List<ListItemDto> FinanceForSubChildLists { get; set; }
        public List<ListItemDto> IndustrySectorLists { get; set; }
        public List<ListItemDto> IndustrySectorSubLists { get; set; }
        public List<ListItemDto> BeeLevelLists { get; set; }
        public List<ListItemDto> CompanyRegistrationTypeLists { get; set; }
        public List<ListItemDto> LoanTypeLists { get; set; }
        public List<ListItemDto> LoanTypeSubLists { get; set; }
        public List<ListItemDto> LoanIndexLists { get; set; }
        public List<ListItemDto> DocumentTypeLists { get; set; }
        public List<ListItemDto> CustomerTypeLists { get; set; }
        public List<ListItemDto> Countries { get; set; }
        public List<ListItemDto> OwnershipLists { get; set; }
        public string BaseModelType { get; set; }
        public bool IsEdit { get; set; }
    }
}
