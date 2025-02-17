using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Sme.Subscriptions.Dtos
{
    public class GetSmeSubscriptionForEditOutput
    {
        public CreateOrEditSmeSubscriptionDto SmeSubscription { get; set; }

    }
}