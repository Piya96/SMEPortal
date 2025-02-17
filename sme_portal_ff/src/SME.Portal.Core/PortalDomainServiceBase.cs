using Abp.Domain.Services;

namespace SME.Portal
{
    public abstract class PortalDomainServiceBase : DomainService
    {
        /* Add your common members for all your domain services. */

        protected PortalDomainServiceBase()
        {
            LocalizationSourceName = PortalConsts.LocalizationSourceName;
        }
    }
}
