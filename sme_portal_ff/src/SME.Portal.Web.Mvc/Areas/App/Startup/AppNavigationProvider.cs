using Abp.Application.Navigation;
using Abp.Authorization;
using Abp.Localization;
using SME.Portal.Authorization;

namespace SME.Portal.Web.Areas.App.Startup
{
    public class AppNavigationProvider : NavigationProvider
    {
        public const string MenuName = "App";

        public override void SetNavigation(INavigationProviderContext context)
        {
            #region Host and Tenant Menu Items

            var menu = context.Manager.Menus[MenuName] = new MenuDefinition(MenuName, new FixedLocalizableString("Main Menu"));

            // HOST Dashboard
            var hostDashboardHeaderMenuItem = new MenuItemDefinition(AppPageNames.Host.Dashboard, L("Dashboard"), url: "App/HostDashboard", icon: "flaticon-line-graph", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Host_Dashboard));

            // Tenant Credit Report
            var creditReportsMenuItem = new MenuItemDefinition(AppPageNames.Tenant.CreditReports, L("CreditReports"), url: "App/CreditReports", icon: "flaticon-file-2", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_CreditReports));
            var creditScoresMenuItem = new MenuItemDefinition(AppPageNames.Tenant.CreditScores, L("CreditScores"), url: "App/CreditScores", icon: "flaticon-trophy", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_CreditScores));
            var tenantsHeaderMenuItem = new MenuItemDefinition(AppPageNames.Host.Tenants, L("Tenants"), url: "App/Tenants", icon: "flaticon-list-3", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Tenants));
            var editionsMenuItem = new MenuItemDefinition(AppPageNames.Host.Editions, L("Editions"), url: "App/Editions", icon: "flaticon-app", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Editions));
            var tenantDashboardMenuItem = new MenuItemDefinition(AppPageNames.Tenant.Dashboard, L("Dashboard"), url: "App/TenantDashboard", icon: "flaticon-line-graph", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Tenant_Dashboard));
            var administrationHeaderMenuItem = new MenuItemDefinition(AppPageNames.Common.Administration, L("Administration"), icon: "flaticon-interface-8");
            var organizationUnitsMenuItem = new MenuItemDefinition(AppPageNames.Common.OrganizationUnits, L("OrganizationUnits"), url: "App/OrganizationUnits", icon: "flaticon-map", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_OrganizationUnits));
            var rolesMenuItem = new MenuItemDefinition(AppPageNames.Common.Roles, L("Roles"), url: "App/Roles", icon: "flaticon-suitcase", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Roles));
            var usersMenuItem = new MenuItemDefinition(AppPageNames.Common.Users, L("Users"), url: "App/Users", icon: "flaticon-users", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Users));
            var smeCompaniesMenuItem = new MenuItemDefinition(AppPageNames.Tenant.SmeCompanies, L("SMECompanies"), url: "App/SmeCompanies", icon: "flaticon-map", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_SmeCompanies));
            var smeOwnersMenuItem = new MenuItemDefinition(AppPageNames.Tenant.Owners, L("SMEOwners"), url: "App/Owners", icon: "flaticon-users", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Owners));

            var smeOwnerCompanyMappings = new MenuItemDefinition(AppPageNames.Tenant.OwnerCompanyMapping, L("OwnerCompanyMapping"), url: "App/OwnerCompanyMapping", icon: "flaticon-more", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_OwnerCompanyMapping));

            var listItemsHeaderMenuItem = new MenuItemDefinition(AppPageNames.Common.ListItems, L("ListItems"), url: "App/ListItems", icon: "flaticon-menu-button", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_ListItems));

            var lendersHeaderMenuItem = new MenuItemDefinition(AppPageNames.Common.LenderAdmin, L("LenderAdmin"), icon: "flaticon-coins");
            var fundingApplicationsMenuItem = new MenuItemDefinition(AppPageNames.Common.Applications, L("FundingApplications"), url: "App/Applications", icon: "flaticon-list", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Applications));
            var matchesMenuItem = new MenuItemDefinition(AppPageNames.Tenant.Matches, L("Matches"), url: "App/Matches", icon: "flaticon-medal", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Matches));
            var financeProductsMenuItem = new MenuItemDefinition(AppPageNames.Tenant.FinanceProducts, L("FinanceProducts"), url: "App/FinanceProducts", icon: "flaticon-coins", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_FinanceProducts));
            var contractsMenuItem = new MenuItemDefinition(AppPageNames.Tenant.Contracts, L("Contracts"), url: "App/Contracts", icon: "flaticon-list-1", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Contracts));
            var lendersMenuItem = new MenuItemDefinition(AppPageNames.Tenant.Lenders, L("Lenders"), url: "App/Lenders", icon: "flaticon-piggy-bank", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Lenders));
            var currencyPairsMenuItem = new MenuItemDefinition(AppPageNames.Host.CurrencyPairs, L("CurrencyPairs"), url: "App/CurrencyPairs", icon: "flaticon-graphic-2", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_CurrencyPairs));
            var languagesMenuItem = new MenuItemDefinition(AppPageNames.Common.Languages, L("Languages"), url: "App/Languages", icon: "flaticon-tabs", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Languages));
            var auditLogsMenuItem = new MenuItemDefinition(AppPageNames.Common.AuditLogs, L("AuditLogs"), url: "App/AuditLogs", icon: "flaticon-folder-1", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_AuditLogs));
            var maintenanceMenuItem = new MenuItemDefinition(AppPageNames.Host.Maintenance, L("Maintenance"), url: "App/Maintenance", icon: "flaticon-lock", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Host_Maintenance));
            var subscriptionManagementMenuItem = new MenuItemDefinition(AppPageNames.Tenant.SubscriptionManagement, L("Subscription"), url: "App/SubscriptionManagement", icon: "flaticon-refresh", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Tenant_SubscriptionManagement));
            var uiCustomizationMenuItem = new MenuItemDefinition(AppPageNames.Common.UiCustomization, L("VisualSettings"), url: "App/UiCustomization", icon: "flaticon-medical", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_UiCustomization));
            var webhooksubscriptionsMenuItem = new MenuItemDefinition(AppPageNames.Common.WebhookSubscriptions, L("WebhookSubscriptions"), url: "App/WebhookSubscription", icon: "flaticon2-world", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_WebhookSubscription));
            var dynamicPropertiesMenuItem = new MenuItemDefinition(AppPageNames.Common.DynamicProperties, L("DynamicProperties"), url: "App/DynamicProperty", icon: "flaticon-interface-8", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_DynamicProperties));
            var hostSettingsMenuItem = new MenuItemDefinition(AppPageNames.Host.Settings, L("Settings"), url: "App/HostSettings", icon: "flaticon-settings", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Host_Settings));
            var tenantSettingsMenuItem = new MenuItemDefinition(AppPageNames.Tenant.Settings, L("Settings"), url: "App/Settings", icon: "flaticon-settings", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Tenant_Settings));
            var demoUIComponentsMenuItem = new MenuItemDefinition(AppPageNames.Common.DemoUiComponents, L("DemoUiComponents"), url: "App/DemoUiComponents", icon: "flaticon-shapes", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_DemoUiComponents));
            var documents = new MenuItemDefinition(AppPageNames.Tenant.Documents, L("Documents"), url: "App/Documents", icon: "flaticon-file-1", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Administration_Documents));
            var crowdFunders = new MenuItemDefinition(AppPageNames.Tenant.CrowdFunders, L("CrowdFunders"), url: "App/Documents", icon: "flaticon-file-1", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Startup_Services_CrowdFunders));
            var impactFunders = new MenuItemDefinition(AppPageNames.Tenant.ImpactFunders, L("ImpactFunders"), url: "App/Documents", icon: "flaticon-file-1", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Startup_Services_ImpactFunders));
            var incubators = new MenuItemDefinition(AppPageNames.Tenant.Incubators, L("Incubators"), url: "App/Documents", icon: "flaticon-file-1", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Startup_Services_Incubators));
            var enterpriseDevelopmentProgrammes = new MenuItemDefinition(AppPageNames.Tenant.EnterpriseDevelopmentProgrammes, L("EnterpriseDevelopmentProgrammes"), url: "App/Documents", icon: "flaticon-file-1", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Startup_Services_EnterpriseDevelopmentProgrammes));
            var usersHeaderMenuItem = new MenuItemDefinition(AppPageNames.Common.UserAdmin, L("UserAdmin"), icon: "flaticon-list", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_UserAdmin));
            var funderSearches = new MenuItemDefinition(AppPageNames.Tenant.FunderSearches, L("FunderSearches"), icon: "flaticon-list", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SmeData_FunderSearches));

            #endregion

            #region SME Menu items

            // SME Dashboard
            var smeDashboardHeaderMenuItem = new MenuItemDefinition(AppPageNames.Sme.Dashboard, L("Dashboard"), url: "App/SmeDashboard", icon: "flaticon-line-graph", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SME_Dashboard));

            // SME Company Profiles
            var smeCompaniesHeaderMenuItem = new MenuItemDefinition(AppPageNames.Sme.ProfileOnboarding, L("ProfileInformation"), url: "App", icon: "flaticon-map", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SME_Companies));
            //var smeOnboardingMenuItem = new MenuItemDefinition(AppPageNames.Sme.ProfileOnboarding, L("ProfileSummary"), url: "App/Sme/Onboarding", icon: "flaticon-user-ok");
            //smeCompaniesHeaderMenuItem.AddItem(smeOnboardingMenuItem);

            // SME Document Repo
            var smeDocumentationHeaderMenuItem = new MenuItemDefinition(AppPageNames.Sme.Documents, L("DocumentRepository"), icon: "flaticon2-document", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SME_Document_Repository));
            var smeDocumentWizardMenuItem = new MenuItemDefinition(AppPageNames.Sme.MyDocuments, L("DocumentManagement"), url: "App/SmeDocuments/Manage", icon: "flaticon2-medical-records", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SME_Document_Wizard));
            var smeMyDocumentsMenuItem = new MenuItemDefinition(AppPageNames.Sme.MyDocuments, L("MyDocuments"), url: "App/SmeDocuments/Index", icon: "flaticon2-file-1", isEnabled: false, isVisible: true, permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SME_Document_MyDocuments));
            smeDocumentationHeaderMenuItem.AddItem(smeMyDocumentsMenuItem);
            smeDocumentationHeaderMenuItem.AddItem(smeDocumentWizardMenuItem);

            //smeMyDocumentsMenuItem.AddItem(smeDocumentWizardMenuItem);

            // SME Funder Searches
            var smeFundingApplicationsHeaderMenuItem = new MenuItemDefinition(AppPageNames.Sme.FundingApplications, L("FunderSearches"), url: "App/FunderSearch", icon: "flaticon-app", isEnabled: false, isVisible: true, permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SME_FundingApplications));
            //var smeViewFundingApplicationsMenuItem = new MenuItemDefinition(AppPageNames.Sme.FundingApplications, L("MySearches"), url: "App/FunderSearch/Index", icon: "flaticon-avatar", isEnabled: false, isVisible: true);
            //var smeCreateFundingApplicationMenuItem = new MenuItemDefinition(AppPageNames.Sme.FundingApplicationWizard, L("NewFundingApplication"), url: "App/FundingApplication/Wizard", icon: "flaticon-list");
            //smeFundingApplicationsHeaderMenuItem.AddItem(smeViewFundingApplicationsMenuItem);
            //smeFundingApplicationsHeaderMenuItem.AddItem(smeMyDocumentsMenuItem); 
            //smeFundingApplicationsHeaderMenuItem.AddItem(smeCreateFundingApplicationMenuItem);

            // SME Consumer Credit Score
            var smeConsumerCreditScoreHeaderMenuItem = new MenuItemDefinition(AppPageNames.Sme.ConsumerCreditScore, L("ConsumerCreditScore"), url: "App/ConsumerCredit/Index", icon: "flaticon-list-2", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SME_ConsumerCreditScore));
            //var smeConsumerCreditScoreMenuItem = new MenuItemDefinition(AppPageNames.Sme.ConsumerCreditScore, L("MyConsumerCreditScore"), url: "App/ConsumerCredit/Index", icon: "flaticon-presentation");
            //smeConsumerCreditScoreHeaderMenuItem.AddItem(smeConsumerCreditScoreMenuItem);

            // SME Subscriptions
            var smeSubscriptionsHeaderMenuItem = new MenuItemDefinition(AppPageNames.Sme.Subscriptions, L("MyAccount"), url: "App/SmeSubscription/Index", icon: "flaticon-plus", isEnabled: true, isVisible: true, permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SME_Subscriptions));
            //var smeSubscriptionsMenuItem = new MenuItemDefinition(AppPageNames.Sme.SubscriptionUserSubscriptions, L("MyService"), url: "App/SmeSubscription/Index", icon: "flaticon-plus", isEnabled: true, isVisible: true);
            //var smeSubscriptionPricingMenuItem = new MenuItemDefinition(AppPageNames.Sme.SubscriptionPricing, L("ServicePricing"), url: "App/SmeSubscription/Pricing", icon: "flaticon-coins", isEnabled: true, isVisible: true);
            var smeSubscriptionTiersHeaderMenuItem = new MenuItemDefinition(AppPageNames.Sme.SubscriptionTiers, L("Tiers"), icon: "flaticon-more");
            var smeSubscriptionTierFreeMenuItem = new MenuItemDefinition(AppPageNames.Sme.SubscriptionFreeTier, L("Free"), url: "App/SmeSubscription/FreeTier", icon: "flaticon-coins");
            var smeSubscriptionTierPaidMenuItem = new MenuItemDefinition(AppPageNames.Sme.SubscriptionStandardTier, L("Paid"), url: "App/SmeSubscription/PaidTier", icon: "flaticon-coins");
            //smeSubscriptionsHeaderMenuItem.AddItem(smeSubscriptionsMenuItem);
            //smeSubscriptionsHeaderMenuItem.AddItem(smeSubscriptionPricingMenuItem);

            // SME Legal and Policy
            var smeLegalHeaderMenuItem = new MenuItemDefinition(AppPageNames.Sme.Legal, L("Legal"), icon: "flaticon-information", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SME_Legal));
            var smeLegalTermsMenuItem = new MenuItemDefinition(AppPageNames.Sme.TermsAndConditions, L("TermsAndConditions"), url: "App/Legal/Terms", icon: "flaticon-notes");
            var smeLegalPrivacyPolicyMenuItem = new MenuItemDefinition(AppPageNames.Sme.PrivacyPolicy, L("PrivacyPolicy"), url: "App/Legal/PrivacyPolicy", icon: "flaticon-edit");
            smeLegalHeaderMenuItem.AddItem(smeLegalTermsMenuItem);
            smeLegalHeaderMenuItem.AddItem(smeLegalPrivacyPolicyMenuItem);

            var sefaBasicScreeningMenuItem = new MenuItemDefinition("Sefa Basic Screening Menu", L("SefaBasicScreeningMenuItem"), url: "App", icon: "flaticon-information", permissionDependency: new SimplePermissionDependency("Basic Screening Menu"));
            var sefaFundingApplicationMenuItem = new MenuItemDefinition("Sefa Finance Application Menu", L("SefaFundingApplicationMenuItem"), url: "App/FunderSearch", icon: "flaticon-information", permissionDependency: new SimplePermissionDependency("Finance Application Menu"));
            var sefaSupportMenuItem = new MenuItemDefinition("Sefa Support Menu", L("SefaSupportMenuItem"), url: "App/Sme/Support", icon: "flaticon-information", permissionDependency: new SimplePermissionDependency("Support Menu"));
            var startupServicesHeaderMenuItem = new MenuItemDefinition(AppPageNames.Common.StartupServices, L("StartupServices"), icon: "flaticon-information", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_Startup_Services));
            var smeDataHeaderMenuItem = new MenuItemDefinition(AppPageNames.Common.SmeData, L("SmeData"), icon: "flaticon-information", permissionDependency: new SimplePermissionDependency(AppPermissions.Pages_SmeData));


            #endregion

            administrationHeaderMenuItem.AddItem(auditLogsMenuItem);                // Admin / AuditLogs
            administrationHeaderMenuItem.AddItem(currencyPairsMenuItem);            // Admin / Currency Pairs
            administrationHeaderMenuItem.AddItem(documents);                        // Admin / Documents
            administrationHeaderMenuItem.AddItem(dynamicPropertiesMenuItem);        // Admin / Dynamic Properties
            administrationHeaderMenuItem.AddItem(languagesMenuItem);                // Admin / Languages
            administrationHeaderMenuItem.AddItem(listItemsHeaderMenuItem);          // Admin / List 
            //administrationHeaderMenuItem.AddItem(lendersHeaderMenuItem);            // Admin / Lender Management
            lendersHeaderMenuItem.AddItem(fundingApplicationsMenuItem);             // Admin / Lender Management / Funding Applications
            lendersHeaderMenuItem.AddItem(lendersMenuItem);                         // Admin / Lender Management / Lenders
            lendersHeaderMenuItem.AddItem(financeProductsMenuItem);                 // Admin / Lender Management / Finance Products
            lendersHeaderMenuItem.AddItem(matchesMenuItem);                         // Admin / Lender Management / Matches
            lendersHeaderMenuItem.AddItem(contractsMenuItem);                       // Admin / Lender Management / Contracts
            administrationHeaderMenuItem.AddItem(maintenanceMenuItem);              // Admin / Maintenance
            administrationHeaderMenuItem.AddItem(organizationUnitsMenuItem);        // Admin / Organisation Units
            startupServicesHeaderMenuItem.AddItem(crowdFunders);
            startupServicesHeaderMenuItem.AddItem(impactFunders);
            startupServicesHeaderMenuItem.AddItem(incubators);
            startupServicesHeaderMenuItem.AddItem(enterpriseDevelopmentProgrammes);
            usersHeaderMenuItem.AddItem(rolesMenuItem);                    // Admin / Roles
            usersHeaderMenuItem.AddItem(usersMenuItem);
            smeDataHeaderMenuItem.AddItem(funderSearches);
            administrationHeaderMenuItem.AddItem(uiCustomizationMenuItem);          // Admin / Visual Settings
            //administrationHeaderMenuItem.AddItem(usersMenuItem);                    // Admin / User
            administrationHeaderMenuItem.AddItem(webhooksubscriptionsMenuItem);     // Admin / Webhook Subscriptions
            administrationHeaderMenuItem.AddItem(hostSettingsMenuItem);             // Admin / Settings (Host)
            administrationHeaderMenuItem.AddItem(tenantSettingsMenuItem);           // Admin / Settings (Host)    
            administrationHeaderMenuItem.AddItem(subscriptionManagementMenuItem);   // Admin / SubscriptionManagement (Host)    
            administrationHeaderMenuItem.AddItem(creditReportsMenuItem);            // Admin / Credit Reports
            administrationHeaderMenuItem.AddItem(creditScoresMenuItem);             // Admin / Credit Scores
            administrationHeaderMenuItem.AddItem(smeCompaniesMenuItem);             // Admin / SME Companies  
            administrationHeaderMenuItem.AddItem(smeOwnersMenuItem);                // Admin / SME Owners
            administrationHeaderMenuItem.AddItem(smeOwnerCompanyMappings);          // Admin / SME OwnerCompanyMapping

            menu.AddItem(hostDashboardHeaderMenuItem)                               // Host   Dashboard
                //.AddItem(tenantDashboardMenuItem)                                   // Tenant Dashboard
                .AddItem(tenantsHeaderMenuItem)                                     // Tenants
                .AddItem(editionsMenuItem)                                          // Editions
                .AddItem(administrationHeaderMenuItem)                              // Admin                        .. see above for sub menus
                .AddItem(demoUIComponentsMenuItem)                                  // Demo UI Components
                .AddItem(smeDashboardHeaderMenuItem)                                // SME Dashboarding
                .AddItem(smeCompaniesHeaderMenuItem)                                // SME Companies                .. see above for sub menus
                .AddItem(smeFundingApplicationsHeaderMenuItem)                      // SME Funding Applications     .. see above for sub menus
                .AddItem(smeConsumerCreditScoreHeaderMenuItem)                      // SME Consumer Credit Score    .. see above for sub menus
                //.AddItem(smeSubscriptionsHeaderMenuItem);                           // SME Subscriptions            .. see above for sub menus
                //.AddItem(smeDocumentationHeaderMenuItem)                            // SME Document Repo            .. see above for sub menus
                //.AddItem(smeLegalHeaderMenuItem);                                   // Legal                        .. see above for sub menus
                //.AddItem(smeLegalHeaderMenuItem);                                   // Legal                        .. see above for sub menus
                .AddItem(sefaBasicScreeningMenuItem)
                .AddItem(sefaFundingApplicationMenuItem)
                .AddItem(sefaSupportMenuItem)
                .AddItem(lendersHeaderMenuItem)
                .AddItem(startupServicesHeaderMenuItem)
                .AddItem(smeDataHeaderMenuItem)
                .AddItem(usersHeaderMenuItem);
                
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, PortalConsts.LocalizationSourceName);
        }
    }
}