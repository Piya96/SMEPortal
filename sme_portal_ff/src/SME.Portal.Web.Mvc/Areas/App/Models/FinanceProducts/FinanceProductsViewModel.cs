using Microsoft.AspNetCore.Mvc.Rendering;
using SME.Portal.Authorization.Users.Dto;
using SME.Portal.Lenders.Dtos;
using SME.Portal.List.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace SME.Portal.Web.Areas.App.Models.FinanceProducts
{
    public class FinanceProductsViewModel
    {
        public LastUpdatedLegendDto LastUpdatedLegend { get; set; }
        public List<LenderDto> Lenders { get; set; }
        public List<ListItemDto> FinanceForLists { get; set; }
        public List<ListItemDto> IndustrySectorLists { get; set; }
        public List<ListItemDto> Countries { get; set; }
        public List<ListItemDto> CompanyRegistrationTypeLists { get; set; }
        public List<ListItemDto> StartupFundingLists { get; set; }
        public List<ListItemDto> ProvinceTypeLists { get; set; }
        public List<ListItemDto> TechInnovationStageTypeLists { get; set; }
        public List<ListItemDto> LoanTypeLists { get; set; }
        public List<ListItemDto> LoanIndexTypeLists { get; set; }
        public List<ListItemDto> IncomeReceivedTypeLists { get; set; }
        public List<ListItemDto> CustomerTypeLists { get; set; }
        public List<ListItemDto> DocumentTypeLists { get; set; }
        public List<ListItemDto> StatusClassificationLists { get; set; }
        public List<ListItemDto> BeeLevelLists { get; set; }
        public List<UserListDto> StaffMembers { get; set; }
        public string FilterText { get; set; }
        public int? LenderId { get; set; }
        public List<ListItemDto> OwnershipLists { get; set; }
        public SelectList SelecLenders
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
        
        public SelectList SelectFinanceForLists
        {
            get
            {
                if (FinanceForLists?.Any() ?? false)
                {
                    return new SelectList(FinanceForLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectIndustrySectorLists
        {
            get
            {
                if (IndustrySectorLists?.Any() ?? false)
                {
                    return new SelectList(IndustrySectorLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectCountries
        {
            get
            {
                if (Countries?.Any() ?? false)
                {
                    return new SelectList(Countries, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectCompanyRegistrationTypeLists
        {
            get
            {
                if (CompanyRegistrationTypeLists?.Any() ?? false)
                {
                    return new SelectList(CompanyRegistrationTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectStartupFundingLists
        {
            get
            {
                if (StartupFundingLists?.Any() ?? false)
                {
                    return new SelectList(StartupFundingLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectProvinceTypeLists
        {
            get
            {
                if (ProvinceTypeLists?.Any() ?? false)
                {
                    return new SelectList(ProvinceTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectTechInnovationStageTypeLists
        {
            get
            {
                if (TechInnovationStageTypeLists?.Any() ?? false)
                {
                    return new SelectList(TechInnovationStageTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectLoanTypeLists
        {
            get
            {
                if (LoanTypeLists?.Any() ?? false)
                {
                    return new SelectList(LoanTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectLoanIndexTypeLists
        {
            get
            {
                if (LoanIndexTypeLists?.Any() ?? false)
                {
                    return new SelectList(LoanIndexTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectIncomeReceivedTypeLists
        {
            get
            {
                if (IncomeReceivedTypeLists?.Any() ?? false)
                {
                    return new SelectList(IncomeReceivedTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectCustomerTypeLists
        {
            get
            {
                if (CustomerTypeLists?.Any() ?? false)
                {
                    return new SelectList(CustomerTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }
        public SelectList SelectDocumentTypeLists
        {
            get
            {
                if (DocumentTypeLists?.Any() ?? false)
                {
                    return new SelectList(DocumentTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectStatusClassificationLists
        {
            get
            {
                if (StatusClassificationLists?.Any() ?? false)
                {
                    return new SelectList(StatusClassificationLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }

        public SelectList SelectBeeLevelLists
        {
            get
            {
                if (BeeLevelLists?.Any() ?? false)
                {
                    return new SelectList(BeeLevelLists, "ListId", "Name");
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
                    return new SelectList(OwnershipLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }
    }
}