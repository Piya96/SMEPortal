using SME.Portal.Editions.Dto;

namespace SME.Portal.MultiTenancy.Payments.Dto
{
    public class PaymentInfoDto
    {
        public EditionSelectDto Edition { get; set; }

        public decimal AdditionalPrice { get; set; }

        public bool IsLessThanMinimumUpgradePaymentAmount()
        {
            return AdditionalPrice < PortalConsts.MinimumUpgradePaymentAmount;
        }
    }
}
