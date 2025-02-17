using System.Collections.Generic;
using SME.Portal.Editions.Dto;
using SME.Portal.MultiTenancy.Payments;

namespace SME.Portal.Web.Models.Payment
{
    public class ExtendEditionViewModel
    {
        public EditionSelectDto Edition { get; set; }

        public List<PaymentGatewayModel> PaymentGateways { get; set; }
    }
}