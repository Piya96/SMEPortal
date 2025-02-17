using System;
using System.Threading.Tasks;
using System.Web;
using Abp.AspNetCore.Mvc.Controllers;
using Abp.Configuration.Startup;
using Abp.IdentityFramework;
using Abp.Runtime.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using SME.Portal.Net.Sms;
using Twilio.Exceptions;

namespace SME.Portal.Web.Controllers
{
    public abstract class PortalControllerBase : AbpController
    {
        

        protected PortalControllerBase()
        {
            LocalizationSourceName = PortalConsts.LocalizationSourceName;

        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        protected void SetTenantIdCookie(int? tenantId)
        {
            var multiTenancyConfig = HttpContext.RequestServices.GetRequiredService<IMultiTenancyConfig>();
            Response.Cookies.Append(
                multiTenancyConfig.TenantIdResolveKey,
                tenantId?.ToString(),
                new CookieOptions
                {
                    Expires = DateTimeOffset.Now.AddYears(5),
                    Path = "/"
                }
            );
        }

        protected string EncryptUrlEncode(string input)
        {
            return HttpUtility.UrlEncode(SimpleStringCipher.Instance.Encrypt(input));
        }

        protected int DecryptToInt(string input)
        {
            return Convert.ToInt32(SimpleStringCipher.Instance.Decrypt(input));
        }

        
    }
}