using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Sme.Subscriptions.Dtos
{
    public class CreateOrEditSmeSubscriptionDto : EntityDto<int?>
    {

        public DateTime StartDate { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public DateTime? NextBillingDate { get; set; }

        [Required]
        public string Status { get; set; }
        
        public int EditionId { get; set; }

        public int OwnerCompanyMapId { get; set; }

    }
}