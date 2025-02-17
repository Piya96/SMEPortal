using SME.Portal.Company.Dtos;
using SME.Portal.MultiTenancy.Payments.Dto;
using SME.Portal.Sme.Subscriptions.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Models.SmeSubscription
{
    public class SmeSubscriptionsViewModel
    {
        public List<SmeCompanyDto> Companies { get; set; }

        public List<SubscriptionPaymentDto> Payments { get; internal set; }

        public Dictionary<int, SmeSubscriptionDto> CompanySmeSubscriptions { get; set; }
    }
}
