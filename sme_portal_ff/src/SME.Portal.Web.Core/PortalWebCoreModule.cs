﻿using System;
using System.IO;
using System.Text;
using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.AspNetCore.SignalR;
using Abp.AspNetZeroCore.Licensing;
using Abp.AspNetZeroCore.Web;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Hangfire;
using Abp.Hangfire.Configuration;
using Abp.IO;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Runtime.Caching.Redis;
using Abp.Threading.BackgroundWorkers;
using Abp.Zero.Configuration;
using Castle.Core.Internal;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SME.Portal.Accounts;
using SME.Portal.Accounts.UserTestAccountRestJobLogic;
using SME.Portal.Chat;
using SME.Portal.Configuration;
using SME.Portal.Currency;
using SME.Portal.EntityFrameworkCore;
using SME.Portal.Lenders;
using SME.Portal.sefa;
using SME.Portal.SME.Subscriptions;
using SME.Portal.Startup;
using SME.Portal.Web.Authentication.JwtBearer;
using SME.Portal.Web.Authentication.TwoFactor;
using SME.Portal.Web.Chat.SignalR;
using SME.Portal.Web.Configuration;
using SME.Portal.Web.DashboardCustomization;

namespace SME.Portal.Web
{
    [DependsOn(
        typeof(PortalApplicationModule),
        typeof(PortalEntityFrameworkCoreModule),
        typeof(AbpAspNetZeroCoreWebModule),
        typeof(AbpAspNetCoreSignalRModule),
        typeof(PortalGraphQLModule),
        typeof(AbpRedisCacheModule), //AbpRedisCacheModule dependency (and Abp.RedisCache nuget package) can be removed if not using Redis cache
        typeof(AbpHangfireAspNetCoreModule) //AbpHangfireModule dependency (and Abp.Hangfire.AspNetCore nuget package) can be removed if not using Hangfire
    )]
    public class PortalWebCoreModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public PortalWebCoreModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize()
        {
            //Set default connection string
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                PortalConsts.ConnectionStringName
            );

            //Use database for language management
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            Configuration.Modules.AbpAspNetCore()
                .CreateControllersForAppServices(
                    typeof(PortalApplicationModule).GetAssembly()
                );

            Configuration.Caching.Configure(TwoFactorCodeCacheItem.CacheName, cache =>
            {
                cache.DefaultAbsoluteExpireTime = TimeSpan.FromMinutes(2);
            });

            if (_appConfiguration["Authentication:JwtBearer:IsEnabled"] != null && bool.Parse(_appConfiguration["Authentication:JwtBearer:IsEnabled"]))
            {
                ConfigureTokenAuth();
            }

            Configuration.ReplaceService<IAppConfigurationAccessor, AppConfigurationAccessor>();

            Configuration.ReplaceService<IAppConfigurationWriter, AppConfigurationWriter>();

            //Uncomment this line to use Hangfire instead of default background job manager (remember also to uncomment related lines in Startup.cs file(s)).
            //Configuration.BackgroundJobs.UseHangfire();

            //Uncomment this line to use Redis cache instead of in-memory cache.
            //See app.config for Redis configuration and connection string
            //Configuration.Caching.UseRedis(options =>
            //{
            //    options.ConnectionString = _appConfiguration["Abp:RedisCache:ConnectionString"];
            //    options.DatabaseId = _appConfiguration.GetValue<int>("Abp:RedisCache:DatabaseId");
            //});
        }

        private void ConfigureTokenAuth()
        {
            IocManager.Register<TokenAuthConfiguration>();
            var tokenAuthConfig = IocManager.Resolve<TokenAuthConfiguration>();

            tokenAuthConfig.SecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appConfiguration["Authentication:JwtBearer:SecurityKey"]));
            tokenAuthConfig.Issuer = _appConfiguration["Authentication:JwtBearer:Issuer"];
            tokenAuthConfig.Audience = _appConfiguration["Authentication:JwtBearer:Audience"];
            tokenAuthConfig.SigningCredentials = new SigningCredentials(tokenAuthConfig.SecurityKey, SecurityAlgorithms.HmacSha256);
            tokenAuthConfig.AccessTokenExpiration = AppConsts.AccessTokenExpiration;
            tokenAuthConfig.RefreshTokenExpiration = AppConsts.RefreshTokenExpiration;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PortalWebCoreModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            SetAppFolders();

            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(PortalWebCoreModule).Assembly);

            IocManager.Register<IShallowReset, ShallowReset>(DependencyLifeStyle.Transient);
            IocManager.Register<IPartialReset, PartialReset>(DependencyLifeStyle.Transient);
            IocManager.Register<IFullReset, FullReset>(DependencyLifeStyle.Transient);

            var workManager = IocManager.Resolve<IBackgroundWorkerManager>();
            workManager.Add(IocManager.Resolve<CurrencyPairUpdateWorkerJob>());
            workManager.Add(IocManager.Resolve<SmeSubscriptionExpiryJob>());
            workManager.Add(IocManager.Resolve<SyncLendersFinanceProductsJob>());
            workManager.Add(IocManager.Resolve<EmailConfirmationReminderJob>());
            workManager.Add(IocManager.Resolve<UserTestAccountResetJob>());
            workManager.Add(IocManager.Resolve<SefaApplicationAutoCancelJob>());
			workManager.Add(IocManager.Resolve<UserAccessRevokeJob>());
		}

        private void SetAppFolders()
        {
            var appFolders = IocManager.Resolve<AppFolders>();

            appFolders.SampleProfileImagesFolder = Path.Combine(_env.WebRootPath, $"Common{Path.DirectorySeparatorChar}Images{Path.DirectorySeparatorChar}SampleProfilePics");
            appFolders.WebLogsFolder = Path.Combine(_env.ContentRootPath, $"App_Data{Path.DirectorySeparatorChar}Logs");
        }
    }
}
