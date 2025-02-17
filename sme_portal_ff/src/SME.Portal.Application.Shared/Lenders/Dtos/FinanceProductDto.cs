using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using SME.Portal.List;
using SME.Portal.List.Dtos;
using SME.Portal.SME.Dtos;

namespace SME.Portal.Lenders.Dtos
{
    public class FinanceProductDto : EntityDto
    {
        public string Name { get; set; }

        public int Version { get; set; }

        public string VersionLabel { get; set; }

        public string Summary { get; set; }

        public bool ShowMatchResults { get; set; }

        public bool Enabled { get; set; }

        public bool IsDeleted { get; set; }

        public int LenderId { get; set; }

        public string LenderName { get; set; }

        public string SummaryHtml { get; set; }

        public int? CurrencyPairId { get; set; }

        public string LoanIndexIds { get; set; }

        public string MatchCriteriaJson { get; set; }

        public DateTime LastCheckedDate { get; set; }

        public string StatusClassificationId { get; set; }

        public virtual string Permalink { get; set; }

        public virtual decimal? MinLoanAmount { get; set; }

        public virtual decimal? MaxLoanAmount { get; set; }

        public virtual string FinanceForSubListIds { get; set; }

        public virtual string FinanceForSubCategoryListIds { get; set; }

        public virtual bool? SaCitizensOnly { get; set; }

        public virtual string CompanyRegistrationTypeListIds { get; set; }

        public virtual string PostalAddressProvince { get; set; }

        public virtual int? MinimumMonthsTrading { get; set; }

        public virtual decimal? MinAverageAnnualTurnover { get; set; }

        public virtual string IndustrySectorListIds { get; set; }

        public virtual int? MinimumMonthlyIncome { get; set; }

        public virtual bool? RequiresProfitability { get; set; }

        public virtual bool? RequiresCollateral { get; set; }

        public virtual string OwnershipRulesFilter { get; set; }

        public virtual string BeeLevelListIds { get; set; }

        public virtual string CountryListIds { get; set; }

        public virtual string CheckedOutUserName { get; set; }

        public virtual int? CheckedOutSubjectId { get; set; }

        public virtual string RequiredDocumentTypeListIds { get; set; }

        public virtual string ProvinceListIds { get; set; }

        public FinanceProductCriteriaDisplayDto FinanceProductCriteriaDisplayDto { get; set; }

        public FinanceProductCriteriaDto GetFinanceProductCriteriaDto()
        {
            if (string.IsNullOrEmpty(MatchCriteriaJson)) return null;

            return FinanceProductCriteriaDto.FromJson(MatchCriteriaJson);
        }

        public void SetFinanceProductCriteriaDisplayDto(List<ListItemDto> listItems)
        {
            var listHelper = new ListHelper(listItems);
            FinanceProductCriteriaDisplayDto = new FinanceProductCriteriaDisplayDto();

            var matchCriteria = GetFinanceProductCriteriaDto();
            FinanceProductCriteriaDisplayDto.FinanceFor = listHelper.NamesFromIds(matchCriteria.FinanceForSubListIds, "|");
            FinanceProductCriteriaDisplayDto.IndustrySectorTopLevels = listHelper.NamesFromIds(matchCriteria.IndustrySectorsLevel1ListIds, "|");
            FinanceProductCriteriaDisplayDto.IndustrySectorSecondaryLevels = listHelper.NamesFromIds(matchCriteria.IndustrySectorListIds, "|");
            FinanceProductCriteriaDisplayDto.CompanyRegistrationTypes = listHelper.NamesFromIds(matchCriteria.CompanyRegistrationTypeListIds, "|");
			FinanceProductCriteriaDisplayDto.ProvinceListIds = listHelper.NamesFromIds(matchCriteria.ProvinceListIds, "|");
			FinanceProductCriteriaDisplayDto.CustomerTypeListIds = listHelper.NamesFromIds(matchCriteria.CustomerTypeListIds, "|");
		}
    }
}