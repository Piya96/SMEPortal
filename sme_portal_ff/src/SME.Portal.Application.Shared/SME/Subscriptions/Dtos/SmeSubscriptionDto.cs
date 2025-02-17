using System;
using Abp.Application.Services.Dto;
using SME.Portal.Editions.Dto;

namespace SME.Portal.Sme.Subscriptions.Dtos
{
    public class SmeSubscriptionDto : EntityDto
    {
        public DateTime StartDate { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public DateTime? NextBillingDate { get; set; }

        public string Status { get; set; }

        public int OwnerCompanyMapId { get; set; }

        public int EditionId { get; set; }

        public EditionListDto EditionFk { get; set; }

    }
}