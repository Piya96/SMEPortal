using Abp.MultiTenancy;
using SME.Portal.Url;

namespace SME.Portal.Web.Url
{
    public class AngularAppUrlService : AppUrlServiceBase
    {
        public override string EmailActivationRoute => "account/confirm-email";
        public override string FundFormRoute => "app/fund-forms/manage-fund-forms";

        public override string PasswordResetRoute => "account/reset-password";

        public AngularAppUrlService(
                IWebUrlService webUrlService,
                ITenantCache tenantCache
            ) : base(
                webUrlService,
                tenantCache
            )
        {

        }
    }
}