using System.Collections.Generic;
using SME.Portal.Editions;
using SME.Portal.Editions.Dto;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.MultiTenancy.Payments.Dto;

namespace SME.Portal.Web.Models.Payment
{
    public class BuyEditionViewModel
    {
        public SubscriptionStartType? SubscriptionStartType { get; set; }

        public EditionSelectDto Edition { get; set; }

        public decimal? AdditionalPrice { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }

        public List<PaymentGatewayModel> PaymentGateways { get; set; }
    }
}
