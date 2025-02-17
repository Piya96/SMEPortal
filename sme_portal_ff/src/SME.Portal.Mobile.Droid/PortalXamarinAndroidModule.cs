using Abp.Modules;
using Abp.Reflection.Extensions;

namespace SME.Portal
{
    [DependsOn(typeof(PortalXamarinSharedModule))]
    public class PortalXamarinAndroidModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PortalXamarinAndroidModule).GetAssembly());
        }
    }
}