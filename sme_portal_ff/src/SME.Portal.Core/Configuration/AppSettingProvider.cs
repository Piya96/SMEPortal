﻿using System.Collections.Generic;
using System.Linq;
using Abp.Configuration;
using Abp.Json;
using Abp.Net.Mail;
using Abp.Zero.Configuration;
using Microsoft.Extensions.Configuration;
using SME.Portal.Authentication;
using SME.Portal.DashboardCustomization;
using Newtonsoft.Json;

namespace SME.Portal.Configuration
{
    /// <summary>
    /// Defines settings for the application.
    /// See <see cref="AppSettings"/> for setting names.
    /// </summary>
    public class AppSettingProvider : SettingProvider
    {
        private readonly IConfigurationRoot _appConfiguration;

        public AppSettingProvider(IAppConfigurationAccessor configurationAccessor)
        {
            _appConfiguration = configurationAccessor.Configuration;
        }

        public override IEnumerable<SettingDefinition> GetSettingDefinitions(SettingDefinitionProviderContext context)
        {
            // Disable TwoFactorLogin by default (can be enabled by UI)
            context.Manager.GetSettingDefinition(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsEnabled)
                .DefaultValue = false.ToString().ToLowerInvariant();

            // Change scope of Email settings
            ChangeEmailSettingScopes(context);

            return GetHostSettings().Union(GetTenantSettings()).Union(GetSharedSettings())
                // theme settings
                .Union(GetDefaultThemeSettings())
                .Union(GetTheme2Settings())
                .Union(GetTheme3Settings())
                .Union(GetTheme4Settings())
                .Union(GetTheme5Settings())
                .Union(GetTheme6Settings())
                .Union(GetTheme7Settings())
                .Union(GetTheme8Settings())
                .Union(GetTheme9Settings())
                .Union(GetTheme10Settings())
                .Union(GetTheme11Settings())
                .Union(GetTheme12Settings())
                .Union(GetDashboardSettings())
                .Union(GetExternalLoginProviderSettings())
                .Union(GetFinfindAzureApiGatewaySettings());
        }

        private void ChangeEmailSettingScopes(SettingDefinitionProviderContext context)
        {
            if (!PortalConsts.AllowTenantsToChangeEmailSettings)
            {
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.Host).Scopes = SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.Port).Scopes = SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.UserName).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.Password).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.Domain).Scopes = SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.EnableSsl).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.Smtp.UseDefaultCredentials).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.DefaultFromAddress).Scopes =
                    SettingScopes.Application;
                context.Manager.GetSettingDefinition(EmailSettingNames.DefaultFromDisplayName).Scopes =
                    SettingScopes.Application;
            }
        }

        private IEnumerable<SettingDefinition> GetHostSettings()
        {
            return new[]
            {
                new SettingDefinition(AppSettings.TenantManagement.AllowSelfRegistration,
                    GetFromAppSettings(AppSettings.TenantManagement.AllowSelfRegistration, "true"),
                    isVisibleToClients: true),
                new SettingDefinition(AppSettings.TenantManagement.IsNewRegisteredTenantActiveByDefault,
                    GetFromAppSettings(AppSettings.TenantManagement.IsNewRegisteredTenantActiveByDefault, "false")),
                new SettingDefinition(AppSettings.TenantManagement.UseCaptchaOnRegistration,
                    GetFromAppSettings(AppSettings.TenantManagement.UseCaptchaOnRegistration, "true"),
                    isVisibleToClients: true),
                new SettingDefinition(AppSettings.TenantManagement.DefaultEdition,
                    GetFromAppSettings(AppSettings.TenantManagement.DefaultEdition, "")),
                new SettingDefinition(AppSettings.UserManagement.SmsVerificationEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.SmsVerificationEnabled, "false"),
                    isVisibleToClients: true),
                new SettingDefinition(AppSettings.TenantManagement.SubscriptionExpireNotifyDayCount,
                    GetFromAppSettings(AppSettings.TenantManagement.SubscriptionExpireNotifyDayCount, "7"),
                    isVisibleToClients: true),
                new SettingDefinition(AppSettings.HostManagement.BillingLegalName,
                    GetFromAppSettings(AppSettings.HostManagement.BillingLegalName, "")),
                new SettingDefinition(AppSettings.HostManagement.BillingAddress,
                    GetFromAppSettings(AppSettings.HostManagement.BillingAddress, "")),
                new SettingDefinition(AppSettings.Recaptcha.SiteKey, GetFromSettings("Recaptcha:SiteKey"),
                    isVisibleToClients: true),
                new SettingDefinition(AppSettings.UiManagement.Theme,
                    GetFromAppSettings(AppSettings.UiManagement.Theme, "default"), isVisibleToClients: true,
                    scopes: SettingScopes.All),
            };
        }

        private IEnumerable<SettingDefinition> GetTenantSettings()
        {
            return new[]
            {
                new SettingDefinition(AppSettings.UserManagement.AllowSelfRegistration,
                    GetFromAppSettings(AppSettings.UserManagement.AllowSelfRegistration, "true"),
                    scopes: SettingScopes.Tenant, isVisibleToClients: true),
                new SettingDefinition(AppSettings.UserManagement.IsNewRegisteredUserActiveByDefault,
                    GetFromAppSettings(AppSettings.UserManagement.IsNewRegisteredUserActiveByDefault, "false"),
                    scopes: SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.UseCaptchaOnRegistration,
                    GetFromAppSettings(AppSettings.UserManagement.UseCaptchaOnRegistration, "true"),
                    scopes: SettingScopes.Tenant, isVisibleToClients: true),
                new SettingDefinition(AppSettings.TenantManagement.BillingLegalName,
                    GetFromAppSettings(AppSettings.TenantManagement.BillingLegalName, ""),
                    scopes: SettingScopes.Tenant),
                new SettingDefinition(AppSettings.TenantManagement.BillingAddress,
                    GetFromAppSettings(AppSettings.TenantManagement.BillingAddress, ""), scopes: SettingScopes.Tenant),
                new SettingDefinition(AppSettings.TenantManagement.BillingTaxVatNo,
                    GetFromAppSettings(AppSettings.TenantManagement.BillingTaxVatNo, ""), scopes: SettingScopes.Tenant),
                new SettingDefinition(AppSettings.Email.UseHostDefaultEmailSettings,
                    GetFromAppSettings(AppSettings.Email.UseHostDefaultEmailSettings,
                        PortalConsts.MultiTenancyEnabled ? "true" : "false"), scopes: SettingScopes.Tenant)
            };
        }

        private IEnumerable<SettingDefinition> GetSharedSettings()
        {
            return new[]
            {
                new SettingDefinition(AppSettings.UserManagement.TwoFactorLogin.IsGoogleAuthenticatorEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.TwoFactorLogin.IsGoogleAuthenticatorEnabled, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, isVisibleToClients: true),
                new SettingDefinition(AppSettings.UserManagement.IsCookieConsentEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.IsCookieConsentEnabled, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, isVisibleToClients: true),
                new SettingDefinition(AppSettings.UserManagement.IsQuickThemeSelectEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.IsQuickThemeSelectEnabled, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, isVisibleToClients: true),
                new SettingDefinition(AppSettings.UserManagement.UseCaptchaOnLogin,
                    GetFromAppSettings(AppSettings.UserManagement.UseCaptchaOnLogin, "false"),
                    scopes: SettingScopes.Application | SettingScopes.Tenant, isVisibleToClients: true),
                new SettingDefinition(AppSettings.UserManagement.SessionTimeOut.IsEnabled,
                    GetFromAppSettings(AppSettings.UserManagement.SessionTimeOut.IsEnabled, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.SessionTimeOut.TimeOutSecond,
                    GetFromAppSettings(AppSettings.UserManagement.SessionTimeOut.TimeOutSecond, "30"),
                    isVisibleToClients: true, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.SessionTimeOut.ShowTimeOutNotificationSecond,
                    GetFromAppSettings(AppSettings.UserManagement.SessionTimeOut.ShowTimeOutNotificationSecond, "30"),
                    isVisibleToClients: true, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.SessionTimeOut.ShowLockScreenWhenTimedOut,
                    GetFromAppSettings(AppSettings.UserManagement.SessionTimeOut.ShowLockScreenWhenTimedOut, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.AllowOneConcurrentLoginPerUser,
                    GetFromAppSettings(AppSettings.UserManagement.AllowOneConcurrentLoginPerUser, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.AllowUsingGravatarProfilePicture,
                    GetFromAppSettings(AppSettings.UserManagement.AllowUsingGravatarProfilePicture, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.Application | SettingScopes.Tenant),
                new SettingDefinition(AppSettings.UserManagement.UseGravatarProfilePicture,
                    GetFromAppSettings(AppSettings.UserManagement.UseGravatarProfilePicture, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.User)
            };
        }

        private string GetFromAppSettings(string name, string defaultValue = null)
        {
            return GetFromSettings("App:" + name, defaultValue);
        }

        private string GetFromSettings(string name, string defaultValue = null)
        {
            return _appConfiguration[name] ?? defaultValue;
        }

        private IEnumerable<SettingDefinition> GetDefaultThemeSettings()
        {
            var themeName = "default";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.Skin,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.Skin, "light"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Style,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Style, "solid"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LeftAside.AsideSkin,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LeftAside.AsideSkin, "light"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LeftAside.FixedAside,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LeftAside.FixedAside, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LeftAside.AllowAsideMinimizing,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LeftAside.AllowAsideMinimizing,
                        "true"), isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LeftAside.DefaultMinimizedAside,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LeftAside.DefaultMinimizedAside,
                        "false"), isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LeftAside.SubmenuToggle,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LeftAside.SubmenuToggle, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LeftAside.HoverableAside,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LeftAside.HoverableAside,
                        "false"), isVisibleToClients: true, scopes: SettingScopes.All),
                
                
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme2Settings()
        {
            var themeName = "theme2";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LayoutType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LayoutType, "fixed"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MinimizeType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MinimizeType, "topbar"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme3Settings()
        {
            var themeName = "theme3";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Style,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Style, "solid"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme4Settings()
        {
            var themeName = "theme4";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LayoutType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LayoutType, "fixed"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MinimizeType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MinimizeType, "menu"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme5Settings()
        {
            var themeName = "theme5";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LayoutType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LayoutType, "fixed"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MinimizeType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MinimizeType, "menu"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme6Settings()
        {
            var themeName = "theme6";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Style,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Style, "solid"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme7Settings()
        {
            var themeName = "theme7";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Style,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Style, "solid"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme8Settings()
        {
            var themeName = "theme8";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LayoutType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LayoutType, "fluid"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme9Settings()
        {
            var themeName = "theme9";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LayoutType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LayoutType, "fixed"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme10Settings()
        {
            var themeName = "theme10";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LayoutType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LayoutType, "fluid"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme11Settings()
        {
            var themeName = "theme11";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LayoutType,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LayoutType, "fluid"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LeftAside.FixedAside,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LeftAside.FixedAside, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetTheme12Settings()
        {
            var themeName = "theme12";

            return new[]
            {
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.DesktopFixedHeader, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Header.MobileFixedHeader, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Fixed, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SubHeader.Style,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SubHeader.Style, "solid"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LeftAside.FixedAside,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LeftAside.FixedAside, "true"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.LeftAside.SubmenuToggle,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.LeftAside.SubmenuToggle, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),

                new SettingDefinition(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.Footer.FixedFooter, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All),
                new SettingDefinition(themeName + "." + AppSettings.UiManagement.SearchActive,
                    GetFromAppSettings(themeName + "." + AppSettings.UiManagement.SearchActive, "false"),
                    isVisibleToClients: true, scopes: SettingScopes.All)
            };
        }

        private IEnumerable<SettingDefinition> GetDashboardSettings()
        {
            var mvcDefaultSettings = GetDefaultMvcDashboardViews();
            var mvcDefaultSettingsJson = JsonConvert.SerializeObject(mvcDefaultSettings);

            var angularDefaultSettings = GetDefaultAngularDashboardViews();
            var angularDefaultSettingsJson = JsonConvert.SerializeObject(angularDefaultSettings);

            return new[]
            {
                new SettingDefinition(
                    AppSettings.DashboardCustomization.Configuration + "." +
                    PortalDashboardCustomizationConsts.Applications.Mvc, mvcDefaultSettingsJson,
                    scopes: SettingScopes.User, isVisibleToClients: true),
                new SettingDefinition(
                    AppSettings.DashboardCustomization.Configuration + "." +
                    PortalDashboardCustomizationConsts.Applications.Angular, angularDefaultSettingsJson,
                    scopes: SettingScopes.User, isVisibleToClients: true)
            };
        }

        public List<Dashboard> GetDefaultMvcDashboardViews()
        {
            //It is the default dashboard view which your user will see if they don't do any customization.
            return new List<Dashboard>
            {
                new Dashboard
                {
                    DashboardName = PortalDashboardCustomizationConsts.DashboardNames.DefaultSmeDashboard,
                    Pages = new List<Page>
                    {
                        new Page
                        {
                            Name = PortalDashboardCustomizationConsts.DefaultPageName,
                            Widgets = new List<Widget>
                            {
                                //new Widget
                                //{
                                //    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                //        .GeneralStats, // General Stats
                                //    Height = 9,
                                //    Width = 6,
                                //    PositionX = 0,
                                //    PositionY = 19
                                //},
                                //new Widget
                                //{
                                //    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                //        .ProfitShare, // Profit Share
                                //    Height = 13,
                                //    Width = 6,
                                //    PositionX = 0,
                                //    PositionY = 28
                                //},
                                //new Widget
                                //{
                                //    WidgetId =
                                //        PortalDashboardCustomizationConsts.Widgets.Tenant
                                //            .MemberActivity, // Memeber Activity
                                //    Height = 13,
                                //    Width = 6,
                                //    PositionX = 6,
                                //    PositionY = 28
                                //},
                                //new Widget
                                //{
                                //    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                //        .RegionalStats, // Regional Stats
                                //    Height = 14,
                                //    Width = 6,
                                //    PositionX = 6,
                                //    PositionY = 5
                                //},
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Sme
                                        .DailySales, // Daily Sales
                                    Height = 9,
                                    Width = 6,
                                    PositionX = 0,
                                    PositionY = 19
                                },
                                //new Widget
                                //{
                                //    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                //        .TopStats, // Top Stats
                                //    Height = 5,
                                //    Width = 12,
                                //    PositionX = 0,
                                //    PositionY = 0
                                //},
                                //new Widget
                                //{
                                //    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                //        .SalesSummary, // Sales Summary
                                //    Height = 14,
                                //    Width = 6,
                                //    PositionX = 0,
                                //    PositionY = 5
                                //}
                            }
                        }
                    }
                },
                new Dashboard
                {
                    DashboardName = PortalDashboardCustomizationConsts.DashboardNames.DefaultTenantDashboard,
                    Pages = new List<Page>
                    {
                        new Page
                        {
                            Name = PortalDashboardCustomizationConsts.DefaultPageName,
                            Widgets = new List<Widget>
                            {
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .GeneralStats, // General Stats
                                    Height = 9,
                                    Width = 6,
                                    PositionX = 0,
                                    PositionY = 19
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .ProfitShare, // Profit Share
                                    Height = 13,
                                    Width = 6,
                                    PositionX = 0,
                                    PositionY = 28
                                },
                                new Widget
                                {
                                    WidgetId =
                                        PortalDashboardCustomizationConsts.Widgets.Tenant
                                            .MemberActivity, // Memeber Activity
                                    Height = 13,
                                    Width = 6,
                                    PositionX = 6,
                                    PositionY = 28
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .RegionalStats, // Regional Stats
                                    Height = 14,
                                    Width = 6,
                                    PositionX = 6,
                                    PositionY = 5
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .DailyRegistrations, // Daily Sales
                                    Height = 9,
                                    Width = 6,
                                    PositionX = 6,
                                    PositionY = 19
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .TopStats, // Top Stats
                                    Height = 5,
                                    Width = 12,
                                    PositionX = 0,
                                    PositionY = 0
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .SalesSummary, // Sales Summary
                                    Height = 14,
                                    Width = 6,
                                    PositionX = 0,
                                    PositionY = 5
                                }
                            }
                        }
                    }
                },
                new Dashboard
                {
                    DashboardName = PortalDashboardCustomizationConsts.DashboardNames.DefaultHostDashboard,
                    Pages = new List<Page>
                    {
                        new Page
                        {
                            Name = PortalDashboardCustomizationConsts.DefaultPageName,
                            Widgets = new List<Widget>
                            {
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Host
                                        .TopStats, // Top Stats
                                    Height = 6,
                                    Width = 12,
                                    PositionX = 0,
                                    PositionY = 0
                                },
                                new Widget
                                {
                                    WidgetId =
                                        PortalDashboardCustomizationConsts.Widgets.Host
                                            .IncomeStatistics, // Income Statistics
                                    Height = 11,
                                    Width = 7,
                                    PositionX = 0,
                                    PositionY = 6
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Host
                                        .RecentTenants, // Recent tenants
                                    Height = 10,
                                    Width = 5,
                                    PositionX = 7,
                                    PositionY = 17
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Host
                                        .SubscriptionExpiringTenants, // Subscription expiring tenants
                                    Height = 10,
                                    Width = 7,
                                    PositionX = 0,
                                    PositionY = 17
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Host
                                        .EditionStatistics, // Edition statistics
                                    Height = 11,
                                    Width = 5,
                                    PositionX = 7,
                                    PositionY = 6
                                }
                            }
                        }
                    }
                }
            };
        }

        public List<Dashboard> GetDefaultAngularDashboardViews()
        {
            //It is the default dashboard view which your user will see if they don't do any customization.
            return new List<Dashboard>
            {
                new Dashboard
                {
                    DashboardName = PortalDashboardCustomizationConsts.DashboardNames.DefaultTenantDashboard,
                    Pages = new List<Page>
                    {
                        new Page
                        {
                            Name = PortalDashboardCustomizationConsts.DefaultPageName,
                            Widgets = new List<Widget>
                            {
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .TopStats, // Top Stats
                                    Height = 4,
                                    Width = 12,
                                    PositionX = 0,
                                    PositionY = 0
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .SalesSummary, // Sales Summary
                                    Height = 12,
                                    Width = 6,
                                    PositionX = 0,
                                    PositionY = 4
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .RegionalStats, // Regional Stats
                                    Height = 12,
                                    Width = 6,
                                    PositionX = 6,
                                    PositionY = 4
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .GeneralStats, // General Stats
                                    Height = 8,
                                    Width = 6,
                                    PositionX = 0,
                                    PositionY = 16
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .DailyRegistrations, // Daily Sales
                                    Height = 8,
                                    Width = 6,
                                    PositionX = 6,
                                    PositionY = 16
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Tenant
                                        .ProfitShare, // Profit Share
                                    Height = 11,
                                    Width = 6,
                                    PositionX = 0,
                                    PositionY = 24
                                },
                                new Widget
                                {
                                    WidgetId =
                                        PortalDashboardCustomizationConsts.Widgets.Tenant
                                            .MemberActivity, // Member Activity
                                    Height = 11,
                                    Width = 6,
                                    PositionX = 6,
                                    PositionY = 24
                                }
                            }
                        }
                    }
                },
                new Dashboard
                {
                    DashboardName = PortalDashboardCustomizationConsts.DashboardNames.DefaultHostDashboard,
                    Pages = new List<Page>
                    {
                        new Page
                        {
                            Name = PortalDashboardCustomizationConsts.DefaultPageName,
                            Widgets = new List<Widget>
                            {
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Host
                                        .TopStats, // Top Stats
                                    Height = 4,
                                    Width = 12,
                                    PositionX = 0,
                                    PositionY = 0
                                },
                                new Widget
                                {
                                    WidgetId =
                                        PortalDashboardCustomizationConsts.Widgets.Host
                                            .IncomeStatistics, // Income Statistics
                                    Height = 8,
                                    Width = 7,
                                    PositionX = 0,
                                    PositionY = 4
                                },
                                new Widget
                                {
                                    WidgetId =
                                        PortalDashboardCustomizationConsts.Widgets.Host
                                            .RecentTenants, // Recent tenants
                                    Height = 9,
                                    Width = 5,
                                    PositionX = 7,
                                    PositionY = 12
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Host
                                        .SubscriptionExpiringTenants, // Subscription expiring tenants
                                    Height = 9,
                                    Width = 7,
                                    PositionX = 0,
                                    PositionY = 12
                                },
                                new Widget
                                {
                                    WidgetId = PortalDashboardCustomizationConsts.Widgets.Host
                                        .EditionStatistics, // Edition statistics
                                    Height = 8,
                                    Width = 5,
                                    PositionX = 7,
                                    PositionY = 4
                                }
                            }
                        }
                    }
                }
            };
        }


        private IEnumerable<SettingDefinition> GetFinfindAzureApiGatewaySettings()
        {
            string enabledStr = GetFromSettings("Authentication:FinfindApi:IsEnabled");
            string apiKeyName = GetFromSettings("Authentication:FinfindApi:ApiKeyName");
            string apiKeyValue = GetFromSettings("Authentication:FinfindApi:ApiKeyValue");
            string apiUrl = GetFromSettings("Authentication:FinfindApi:ApiUrl");

            bool enabled = false;

            if (!string.IsNullOrEmpty(enabledStr))
                enabled = bool.Parse(enabledStr);

            var config = new FinfindAzureApiGatewaySettings()
            {
                Enabled = enabled,
                ApiUrl = apiUrl,
                KeyName = apiKeyName,
                KeyValue = apiKeyValue
            };

            return new[]
            {
                new SettingDefinition(
                    AppSettings.FinfindApi.AzureApiGateway,
                    config.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
            };
        }

        private IEnumerable<SettingDefinition> GetExternalLoginProviderSettings()
        {
            return GetFacebookExternalLoginProviderSettings()
                .Union(GetGoogleExternalLoginProviderSettings())
                .Union(GetTwitterExternalLoginProviderSettings())
                .Union(GetMicrosoftExternalLoginProviderSettings())
                .Union(GetOpenIdConnectExternalLoginProviderSettings())
                .Union(GetWsFederationExternalLoginProviderSettings());
        }

        private SettingDefinition[] GetFacebookExternalLoginProviderSettings()
        {
            string appId = GetFromSettings("Authentication:Facebook:AppId");
            string appSecret = GetFromSettings("Authentication:Facebook:AppSecret");

            var facebookExternalLoginProviderInfo = new FacebookExternalLoginProviderSettings()
            {
                AppId = appId,
                AppSecret = appSecret
            };

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.Facebook,
                    facebookExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.Facebook,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
            };
        }

        private SettingDefinition[] GetGoogleExternalLoginProviderSettings()
        {
            string clientId = GetFromSettings("Authentication:Google:ClientId");
            string clientSecret = GetFromSettings("Authentication:Google:ClientSecret");
            string userInfoEndPoint = GetFromSettings("Authentication:Google:UserInfoEndpoint");

            var googleExternalLoginProviderInfo = new GoogleExternalLoginProviderSettings()
            {
                ClientId = clientId,
                ClientSecret = clientSecret,
                UserInfoEndpoint = userInfoEndPoint
            };

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.Google,
                    googleExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.Google,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
            };
        }

        private SettingDefinition[] GetTwitterExternalLoginProviderSettings()
        {
            string consumerKey = GetFromSettings("Authentication:Twitter:ConsumerKey");
            string consumerSecret = GetFromSettings("Authentication:Twitter:ConsumerSecret");

            var twitterExternalLoginProviderInfo = new TwitterExternalLoginProviderSettings()
            {
                ConsumerKey = consumerKey,
                ConsumerSecret = consumerSecret
            };

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.Twitter,
                    twitterExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.Twitter,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
            };
        }

        private SettingDefinition[] GetMicrosoftExternalLoginProviderSettings()
        {
            string consumerKey = GetFromSettings("Authentication:Microsoft:ConsumerKey");
            string consumerSecret = GetFromSettings("Authentication:Microsoft:ConsumerSecret");

            var microsoftExternalLoginProviderInfo = new MicrosoftExternalLoginProviderSettings()
            {
                ClientId = consumerKey,
                ClientSecret = consumerSecret
            };


            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.Microsoft,
                    microsoftExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),

                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.Microsoft,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
            };
        }

        private SettingDefinition[] GetOpenIdConnectExternalLoginProviderSettings()
        {
            var clientId = GetFromSettings("Authentication:OpenId:ClientId");
            var clientSecret = GetFromSettings("Authentication:OpenId:ClientSecret");
            var authority = GetFromSettings("Authentication:OpenId:Authority");
            var validateIssuerStr = GetFromSettings("Authentication:OpenId:ValidateIssuer");

            bool.TryParse(validateIssuerStr, out bool validateIssuer);

            var openIdConnectExternalLoginProviderInfo = new OpenIdConnectExternalLoginProviderSettings()
            {
                ClientId = clientId,
                ClientSecret = clientSecret,
                Authority = authority,
                ValidateIssuer = validateIssuer
            };

            var jsonClaimMappings = new List<JsonClaimMapDto>();
            _appConfiguration.GetSection("Authentication:OpenId:ClaimsMapping").Bind(jsonClaimMappings);

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.OpenIdConnect,
                    openIdConnectExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.OpenIdConnect,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),

                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.OpenIdConnectMappedClaims,
                    jsonClaimMappings.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application | SettingScopes.Tenant
                )
            };
        }

        private SettingDefinition[] GetWsFederationExternalLoginProviderSettings()
        {
            var clientId = GetFromSettings("Authentication:WsFederation:ClientId");
            var wtrealm = GetFromSettings("Authentication:WsFederation:Wtrealm");
            var authority = GetFromSettings("Authentication:WsFederation:Authority");
            var tenant = GetFromSettings("Authentication:WsFederation:Tenant");
            var metaDataAddress = GetFromSettings("Authentication:WsFederation:MetaDataAddress");

            var wsFederationExternalLoginProviderInfo = new WsFederationExternalLoginProviderSettings()
            {
                ClientId = clientId,
                Tenant = tenant,
                Authority = authority,
                Wtrealm = wtrealm,
                MetaDataAddress = metaDataAddress
            };

            var jsonClaimMappings = new List<JsonClaimMapDto>();
            _appConfiguration.GetSection("Authentication:WsFederation:ClaimsMapping").Bind(jsonClaimMappings);

            return new[]
            {
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.Host.WsFederation,
                    wsFederationExternalLoginProviderInfo.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application,
                    isEncrypted:true
                ),
                new SettingDefinition( //default is empty for tenants
                    AppSettings.ExternalLoginProvider.Tenant.WsFederation,
                    "",
                    isVisibleToClients: false,
                    scopes: SettingScopes.Tenant,
                    isEncrypted:true
                ),
                new SettingDefinition(
                    AppSettings.ExternalLoginProvider.WsFederationMappedClaims,
                    jsonClaimMappings.ToJsonString(),
                    isVisibleToClients: false,
                    scopes: SettingScopes.Application | SettingScopes.Tenant
                )
            };
        }
    }
}
