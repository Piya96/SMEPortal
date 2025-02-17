using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Lenders.Dtos
{
    public class GetAllFinanceProductsInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public string NameFilter { get; set; }

        public int? MaxVersionFilter { get; set; }
        public int? MinVersionFilter { get; set; }

        public string VersionLabelFilter { get; set; }

        public int? ShowMatchResultsFilter { get; set; }

        public string LenderNameFilter { get; set; }

        public string CurrencyPairNameFilter { get; set; }

    }
}