using System;
using SME.Portal.Core;
using SME.Portal.Core.Dependency;
using SME.Portal.Services.Permission;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SME.Portal.Extensions.MarkupExtensions
{
    [ContentProperty("Text")]
    public class HasPermissionExtension : IMarkupExtension
    {
        public string Text { get; set; }
        
        public object ProvideValue(IServiceProvider serviceProvider)
        {
            if (ApplicationBootstrapper.AbpBootstrapper == null || Text == null)
            {
                return false;
            }

            var permissionService = DependencyResolver.Resolve<IPermissionService>();
            return permissionService.HasPermission(Text);
        }
    }
}