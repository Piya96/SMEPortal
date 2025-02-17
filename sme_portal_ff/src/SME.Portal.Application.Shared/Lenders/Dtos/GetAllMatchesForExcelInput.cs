using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Lenders.Dtos
{
    public class GetAllMatchesForExcelInput
    {
        public string Filter { get; set; }

        public int? MaxApplicationIdFilter { get; set; }
        public int? MinApplicationIdFilter { get; set; }

        public string LeadDisplayNameFilter { get; set; }

        public int? MatchSuccessfulFilter { get; set; }

        public string FinanceProductIdsFilter { get; set; }

        public string ExclusionIdsFilter { get; set; }

    }
}