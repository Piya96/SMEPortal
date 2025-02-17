using Abp.AspNetCore.Mvc.ViewComponents;

namespace SME.Portal.Web.Views
{
    public abstract class PortalViewComponent : AbpViewComponent
    {
        protected PortalViewComponent()
        {
            LocalizationSourceName = PortalConsts.LocalizationSourceName;
        }
    }
}