﻿using System.Threading.Tasks;
using Abp.Net.Mail;
using Microsoft.Extensions.Configuration;
using SME.Portal.Configuration.Dto;
using SME.Portal.Configuration.Host.Dto;

namespace SME.Portal.Configuration
{
    public abstract class SettingsAppServiceBase : PortalAppServiceBase
    {
        private readonly IEmailSender _emailSender;
        private readonly IAppConfigurationAccessor _configurationAccessor;

        protected SettingsAppServiceBase(
            IEmailSender emailSender, 
            IAppConfigurationAccessor configurationAccessor)
        {
            _emailSender = emailSender;
            _configurationAccessor = configurationAccessor;
        }

        #region Send Test Email

        public async Task SendTestEmail(SendTestEmailInput input)
        {
            await _emailSender.SendAsync(
                input.EmailAddress,
                L("TestEmail_Subject"),
                L("TestEmail_Body")
            );
        }

        public ExternalLoginSettingsDto GetEnabledSocialLoginSettings()
        {
            var dto = new ExternalLoginSettingsDto();
            if (!bool.Parse(_configurationAccessor.Configuration["Authentication:AllowSocialLoginSettingsPerTenant"]))
            {
                return dto;
            }

            if (IsSocialLoginEnabled("Facebook"))
            {
                dto.EnabledSocialLoginSettings.Add("Facebook");
            }

            if (IsSocialLoginEnabled("Google"))
            {
                dto.EnabledSocialLoginSettings.Add("Google");
            }

            if (IsSocialLoginEnabled("Twitter"))
            {
                dto.EnabledSocialLoginSettings.Add("Twitter");
            }

            if (IsSocialLoginEnabled("Microsoft"))
            {
                dto.EnabledSocialLoginSettings.Add("Microsoft");
            }
            
            if (IsSocialLoginEnabled("WsFederation"))
            {
                dto.EnabledSocialLoginSettings.Add("WsFederation");
            }
            
            if (IsSocialLoginEnabled("OpenId"))
            {
                dto.EnabledSocialLoginSettings.Add("OpenId");
            }

            return dto;
        }

        private bool IsSocialLoginEnabled(string name)
        {
            return _configurationAccessor.Configuration.GetSection("Authentication:" + name).Exists() &&
                   bool.Parse(_configurationAccessor.Configuration["Authentication:" + name + ":IsEnabled"]);
        }

        #endregion
    }
}
