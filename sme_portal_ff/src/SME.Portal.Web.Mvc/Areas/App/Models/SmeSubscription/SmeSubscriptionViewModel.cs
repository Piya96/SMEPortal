using SME.Portal.Editions.Dto;
using SME.Portal.MultiTenancy.Payments;
using System;

namespace SME.Portal.Web.Areas.App.Models.SmeSubscription
{
    public class SmeSubscriptionViewModel
    {
        public EditionSelectDto UpgradeEdition { get; set; }

        public EditionSelectDto CurrentEdition { get; set; }

        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }

        public SubscriptionPaymentType SubscriptionPaymentType { get; set; }

    }
}
