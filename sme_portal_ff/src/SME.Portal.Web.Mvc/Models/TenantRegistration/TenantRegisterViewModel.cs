using SME.Portal.Editions;
using SME.Portal.Editions.Dto;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.Security;
using SME.Portal.MultiTenancy.Payments.Dto;

namespace SME.Portal.Web.Models.TenantRegistration
{
    public class TenantRegisterViewModel
    {
        public PasswordComplexitySetting PasswordComplexitySetting { get; set; }

        public int? EditionId { get; set; }

        public SubscriptionStartType? SubscriptionStartType { get; set; }

        public EditionSelectDto Edition { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }
    }
}
