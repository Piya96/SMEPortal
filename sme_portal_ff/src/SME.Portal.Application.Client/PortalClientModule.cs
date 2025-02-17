using Abp.Modules;
using Abp.Reflection.Extensions;

namespace SME.Portal
{
    public class PortalClientModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PortalClientModule).GetAssembly());
        }
    }
}
