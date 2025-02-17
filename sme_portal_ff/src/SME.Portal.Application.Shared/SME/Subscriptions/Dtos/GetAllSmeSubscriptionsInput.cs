using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Sme.Subscriptions.Dtos
{
    public class GetAllSmeSubscriptionsInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public DateTime? MaxStartDateFilter { get; set; }
        public DateTime? MinStartDateFilter { get; set; }

        public DateTime? MaxExpiryDateFilter { get; set; }
        public DateTime? MinExpiryDateFilter { get; set; }

        public DateTime? MaxNextBillingDateFilter { get; set; }
        public DateTime? MinNextBillingDateFilter { get; set; }

        public string StatusFilter { get; set; }

        public int? MaxOwnerCompanyMapIdFilter { get; set; }
        public int? MinOwnerCompanyMapIdFilter { get; set; }

    }
}