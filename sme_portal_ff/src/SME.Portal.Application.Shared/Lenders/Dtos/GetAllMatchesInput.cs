using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;

namespace SME.Portal.Lenders.Dtos
{
    public class GetAllMatchesInput : PagedAndSortedResultRequestDto
    {

        public string Filter { get; set; }

        public int? MaxApplicationIdFilter { get; set; }
        public int? MinApplicationIdFilter { get; set; }
        public List<int> ApplicationIdsFilter { get; set; } = new List<int>();

        public string LeadDisplayNameFilter { get; set; }

        public int? MatchSuccessfulFilter { get; set; }

        public string FinanceProductIdsFilter { get; set; }

        public string ExclusionIdsFilter { get; set; }

    }
}