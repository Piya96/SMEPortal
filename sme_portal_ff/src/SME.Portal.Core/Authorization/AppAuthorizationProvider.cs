using Abp.Authorization;
using Abp.Configuration.Startup;
using Abp.Localization;
using Abp.MultiTenancy;

namespace SME.Portal.Authorization
{
    /// <summary>
    /// Application's authorization provider.
    /// Defines permissions for the application.
    /// See <see cref="AppPermissions"/> for all permission names.
    /// </summary>
    public class AppAuthorizationProvider : AuthorizationProvider
    {
        private readonly bool _isMultiTenancyEnabled;

        public AppAuthorizationProvider(bool isMultiTenancyEnabled)
        {
            _isMultiTenancyEnabled = isMultiTenancyEnabled;
        }

        public AppAuthorizationProvider(IMultiTenancyConfig multiTenancyConfig)
        {
            _isMultiTenancyEnabled = multiTenancyConfig.IsEnabled;
        }

        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            //COMMON PERMISSIONS (FOR BOTH OF TENANTS AND HOST)

            var pages = context.GetPermissionOrNull(AppPermissions.Pages) ?? context.CreatePermission(AppPermissions.Pages, L("Pages"));

            var creditReports = pages.CreateChildPermission(AppPermissions.Pages_CreditReports, L("CreditReports"));
            creditReports.CreateChildPermission(AppPermissions.Pages_CreditReports_Create, L("CreateNewCreditReport"));
            creditReports.CreateChildPermission(AppPermissions.Pages_CreditReports_Edit, L("EditCreditReport"));
            creditReports.CreateChildPermission(AppPermissions.Pages_CreditReports_Delete, L("DeleteCreditReport"));

            var creditScores = pages.CreateChildPermission(AppPermissions.Pages_CreditScores, L("CreditScores"), multiTenancySides: MultiTenancySides.Tenant);
            creditScores.CreateChildPermission(AppPermissions.Pages_CreditScores_Create, L("CreateNewCreditScore"), multiTenancySides: MultiTenancySides.Tenant);
            creditScores.CreateChildPermission(AppPermissions.Pages_CreditScores_Edit, L("EditCreditScore"), multiTenancySides: MultiTenancySides.Tenant);
            creditScores.CreateChildPermission(AppPermissions.Pages_CreditScores_Delete, L("DeleteCreditScore"), multiTenancySides: MultiTenancySides.Tenant);

            var currencyPairs = pages.CreateChildPermission(AppPermissions.Pages_Administration_CurrencyPairs, L("CurrencyPairs"), multiTenancySides: MultiTenancySides.Host);
            currencyPairs.CreateChildPermission(AppPermissions.Pages_Administration_CurrencyPairs_Create, L("CreateNewCurrencyPair"), multiTenancySides: MultiTenancySides.Host);
            currencyPairs.CreateChildPermission(AppPermissions.Pages_Administration_CurrencyPairs_Edit, L("EditCurrencyPair"), multiTenancySides: MultiTenancySides.Host);
            currencyPairs.CreateChildPermission(AppPermissions.Pages_Administration_CurrencyPairs_Delete, L("DeleteCurrencyPair"), multiTenancySides: MultiTenancySides.Host);

            pages.CreateChildPermission(AppPermissions.Pages_DemoUiComponents, L("DemoUiComponents"));

            var administration = pages.CreateChildPermission(AppPermissions.Pages_Administration, L("Administration"));

            var lenderAdmin = pages.CreateChildPermission(AppPermissions.Pages_LenderAdmin, L("LenderAdmin"), multiTenancySides: MultiTenancySides.Tenant);
            var userAdmin = pages.CreateChildPermission(AppPermissions.Pages_UserAdmin, L("UserAdmin"));
            var smeData = pages.CreateChildPermission(AppPermissions.Pages_SmeData, L("SmeData"), multiTenancySides: MultiTenancySides.Tenant);
            smeData.CreateChildPermission(AppPermissions.Pages_SmeData_FunderSearches, L("FunderSearches"), multiTenancySides: MultiTenancySides.Tenant);

            var startupServices = pages.CreateChildPermission(AppPermissions.Pages_Startup_Services, L("StartupServices"), multiTenancySides: MultiTenancySides.Tenant);
            startupServices.CreateChildPermission(AppPermissions.Pages_Startup_Services_CrowdFunders, L("CrowdFunders"), multiTenancySides: MultiTenancySides.Tenant);
            startupServices.CreateChildPermission(AppPermissions.Pages_Startup_Services_ImpactFunders, L("ImpactFunders"), multiTenancySides: MultiTenancySides.Tenant);
            startupServices.CreateChildPermission(AppPermissions.Pages_Startup_Services_Incubators, L("Incubators"), multiTenancySides: MultiTenancySides.Tenant);
            startupServices.CreateChildPermission(AppPermissions.Pages_Startup_Services_EnterpriseDevelopmentProgrammes, L("EnterpriseDevelopmentProgrammes"), multiTenancySides: MultiTenancySides.Tenant);


            var ownerCompanyMapping = administration.CreateChildPermission(AppPermissions.Pages_Administration_OwnerCompanyMapping, L("OwnerCompanyMapping"), multiTenancySides: MultiTenancySides.Tenant);
            ownerCompanyMapping.CreateChildPermission(AppPermissions.Pages_Administration_OwnerCompanyMapping_Create, L("CreateNewOwnerCompanyMap"), multiTenancySides: MultiTenancySides.Tenant);
            ownerCompanyMapping.CreateChildPermission(AppPermissions.Pages_Administration_OwnerCompanyMapping_Edit, L("EditOwnerCompanyMap"), multiTenancySides: MultiTenancySides.Tenant);
            ownerCompanyMapping.CreateChildPermission(AppPermissions.Pages_Administration_OwnerCompanyMapping_Delete, L("DeleteOwnerCompanyMap"), multiTenancySides: MultiTenancySides.Tenant);

            var adminSmeSubscriptions = administration.CreateChildPermission(AppPermissions.Pages_Administration_SmeSubscriptions, L("SmeSubscriptions"), multiTenancySides: MultiTenancySides.Tenant);
            adminSmeSubscriptions.CreateChildPermission(AppPermissions.Pages_Administration_SmeSubscriptions_Create, L("CreateNewSmeSubscription"), multiTenancySides: MultiTenancySides.Tenant);
            adminSmeSubscriptions.CreateChildPermission(AppPermissions.Pages_Administration_SmeSubscriptions_Edit, L("EditSmeSubscription"), multiTenancySides: MultiTenancySides.Tenant);
            adminSmeSubscriptions.CreateChildPermission(AppPermissions.Pages_Administration_SmeSubscriptions_Delete, L("DeleteSmeSubscription"), multiTenancySides: MultiTenancySides.Tenant);

            var documents = administration.CreateChildPermission(AppPermissions.Pages_Administration_Documents, L("Documents"), multiTenancySides: MultiTenancySides.Tenant);
            documents.CreateChildPermission(AppPermissions.Pages_Administration_Documents_Create, L("CreateNewDocument"), multiTenancySides: MultiTenancySides.Tenant);
            documents.CreateChildPermission(AppPermissions.Pages_Administration_Documents_Edit, L("EditDocument"), multiTenancySides: MultiTenancySides.Tenant);
            documents.CreateChildPermission(AppPermissions.Pages_Administration_Documents_Delete, L("DeleteDocument"), multiTenancySides: MultiTenancySides.Tenant);

            var listItems = administration.CreateChildPermission(AppPermissions.Pages_Administration_ListItems, L("ListItems"));
            listItems.CreateChildPermission(AppPermissions.Pages_Administration_ListItems_Create, L("CreateNewListItem"));
            listItems.CreateChildPermission(AppPermissions.Pages_Administration_ListItems_Edit, L("EditListItem"));
            listItems.CreateChildPermission(AppPermissions.Pages_Administration_ListItems_Delete, L("DeleteListItem"));

            var smeCompanies = administration.CreateChildPermission(AppPermissions.Pages_Administration_SmeCompanies, L("SmeCompanies"), multiTenancySides: MultiTenancySides.Tenant);
            smeCompanies.CreateChildPermission(AppPermissions.Pages_Administration_SmeCompanies_Create, L("CreateNewSmeCompany"), multiTenancySides: MultiTenancySides.Tenant);
            smeCompanies.CreateChildPermission(AppPermissions.Pages_Administration_SmeCompanies_Edit, L("EditSmeCompany"), multiTenancySides: MultiTenancySides.Tenant);
            smeCompanies.CreateChildPermission(AppPermissions.Pages_Administration_SmeCompanies_Delete, L("DeleteSmeCompany"), multiTenancySides: MultiTenancySides.Tenant);

            var owners = administration.CreateChildPermission(AppPermissions.Pages_Administration_Owners, L("Owners"), multiTenancySides: MultiTenancySides.Tenant);
            owners.CreateChildPermission(AppPermissions.Pages_Administration_Owners_Create, L("CreateNewOwner"), multiTenancySides: MultiTenancySides.Tenant);
            owners.CreateChildPermission(AppPermissions.Pages_Administration_Owners_Edit, L("EditOwner"), multiTenancySides: MultiTenancySides.Tenant);
            owners.CreateChildPermission(AppPermissions.Pages_Administration_Owners_Delete, L("DeleteOwner"), multiTenancySides: MultiTenancySides.Tenant);

            var matches = lenderAdmin.CreateChildPermission(AppPermissions.Pages_Administration_Matches, L("Matches"), multiTenancySides: MultiTenancySides.Tenant);
            matches.CreateChildPermission(AppPermissions.Pages_Administration_Matches_Create, L("CreateNewMatch"), multiTenancySides: MultiTenancySides.Tenant);
            matches.CreateChildPermission(AppPermissions.Pages_Administration_Matches_Edit, L("EditMatch"), multiTenancySides: MultiTenancySides.Tenant);
            matches.CreateChildPermission(AppPermissions.Pages_Administration_Matches_Delete, L("DeleteMatch"), multiTenancySides: MultiTenancySides.Tenant);

            var applications = administration.CreateChildPermission(AppPermissions.Pages_Administration_Applications, L("Applications"), multiTenancySides: MultiTenancySides.Tenant);
            applications.CreateChildPermission(AppPermissions.Pages_Administration_Applications_Create, L("CreateNewApplication"), multiTenancySides: MultiTenancySides.Tenant);
            applications.CreateChildPermission(AppPermissions.Pages_Administration_Applications_Edit, L("EditApplication"), multiTenancySides: MultiTenancySides.Tenant);
            applications.CreateChildPermission(AppPermissions.Pages_Administration_Applications_Delete, L("DeleteApplication"), multiTenancySides: MultiTenancySides.Tenant);

            
            var contracts = administration.CreateChildPermission(AppPermissions.Pages_Administration_Contracts, L("Contracts"), multiTenancySides: MultiTenancySides.Tenant);
            contracts.CreateChildPermission(AppPermissions.Pages_Administration_Contracts_Create, L("CreateNewContract"), multiTenancySides: MultiTenancySides.Tenant);
            contracts.CreateChildPermission(AppPermissions.Pages_Administration_Contracts_Edit, L("EditContract"), multiTenancySides: MultiTenancySides.Tenant);
            contracts.CreateChildPermission(AppPermissions.Pages_Administration_Contracts_Delete, L("DeleteContract"), multiTenancySides: MultiTenancySides.Tenant);

            var lenders = lenderAdmin.CreateChildPermission(AppPermissions.Pages_Administration_Lenders, L("Lenders"), multiTenancySides: MultiTenancySides.Tenant);
            lenders.CreateChildPermission(AppPermissions.Pages_Administration_Lenders_Create, L("CreateNewLender"), multiTenancySides: MultiTenancySides.Tenant);
            lenders.CreateChildPermission(AppPermissions.Pages_Administration_Lenders_Edit, L("EditLender"), multiTenancySides: MultiTenancySides.Tenant);
            lenders.CreateChildPermission(AppPermissions.Pages_Administration_Lenders_Delete, L("DeleteLender"), multiTenancySides: MultiTenancySides.Tenant);

            var financeProducts = lenderAdmin.CreateChildPermission(AppPermissions.Pages_Administration_FinanceProducts, L("FinanceProducts"), multiTenancySides: MultiTenancySides.Tenant);
            financeProducts.CreateChildPermission(AppPermissions.Pages_Administration_FinanceProducts_Create, L("CreateNewFinanceProduct"), multiTenancySides: MultiTenancySides.Tenant);
            financeProducts.CreateChildPermission(AppPermissions.Pages_Administration_FinanceProducts_Edit, L("EditFinanceProduct"), multiTenancySides: MultiTenancySides.Tenant);
            financeProducts.CreateChildPermission(AppPermissions.Pages_Administration_FinanceProducts_Delete, L("DeleteFinanceProduct"), multiTenancySides: MultiTenancySides.Tenant);

            var roles = userAdmin.CreateChildPermission(AppPermissions.Pages_Administration_Roles, L("Roles"));
            roles.CreateChildPermission(AppPermissions.Pages_Administration_Roles_Create, L("CreatingNewRole"));
            roles.CreateChildPermission(AppPermissions.Pages_Administration_Roles_Edit, L("EditingRole"));
            roles.CreateChildPermission(AppPermissions.Pages_Administration_Roles_Delete, L("DeletingRole"));

            var users = userAdmin.CreateChildPermission(AppPermissions.Pages_Administration_Users, L("Users"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Create, L("CreatingNewUser"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Edit, L("EditingUser"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Delete, L("DeletingUser"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_ChangePermissions, L("ChangingPermissions"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Impersonation, L("LoginForUsers"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Unlock, L("Unlock"));

            var languages = administration.CreateChildPermission(AppPermissions.Pages_Administration_Languages, L("Languages"));
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_Create, L("CreatingNewLanguage"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_Edit, L("EditingLanguage"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_Delete, L("DeletingLanguages"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_ChangeTexts, L("ChangingTexts"));

            administration.CreateChildPermission(AppPermissions.Pages_Administration_AuditLogs, L("AuditLogs"));

            var organizationUnits = administration.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits, L("OrganizationUnits"));
            organizationUnits.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits_ManageOrganizationTree, L("ManagingOrganizationTree"));
            organizationUnits.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits_ManageMembers, L("ManagingMembers"));
            organizationUnits.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits_ManageRoles, L("ManagingRoles"));

            administration.CreateChildPermission(AppPermissions.Pages_Administration_UiCustomization, L("VisualSettings"));

            var webhooks = administration.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription, L("Webhooks"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_Create, L("CreatingWebhooks"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_Edit, L("EditingWebhooks"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_ChangeActivity, L("ChangingWebhookActivity"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_Detail, L("DetailingSubscription"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_Webhook_ListSendAttempts, L("ListingSendAttempts"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_Webhook_ResendWebhook, L("ResendingWebhook"));

            var dynamicProperties = administration.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties, L("DynamicProperties"));
            dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties_Create, L("CreatingDynamicProperties"));
            dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties_Edit, L("EditingDynamicProperties"));
            dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties_Delete, L("DeletingDynamicProperties"));

            var dynamicPropertyValues = dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue, L("DynamicPropertyValue"));
            dynamicPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue_Create, L("CreatingDynamicPropertyValue"));
            dynamicPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue_Edit, L("EditingDynamicPropertyValue"));
            dynamicPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue_Delete, L("DeletingDynamicPropertyValue"));

            var dynamicEntityProperties = dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties, L("DynamicEntityProperties"));
            dynamicEntityProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties_Create, L("CreatingDynamicEntityProperties"));
            dynamicEntityProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties_Edit, L("EditingDynamicEntityProperties"));
            dynamicEntityProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties_Delete, L("DeletingDynamicEntityProperties"));

            var dynamicEntityPropertyValues = dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue, L("EntityDynamicPropertyValue"));
            dynamicEntityPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue_Create, L("CreatingDynamicEntityPropertyValue"));
            dynamicEntityPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue_Edit, L("EditingDynamicEntityPropertyValue"));
            dynamicEntityPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue_Delete, L("DeletingDynamicEntityPropertyValue"));

            //TENANT-SPECIFIC PERMISSIONS

            pages.CreateChildPermission(AppPermissions.Pages_Tenant_Dashboard, L("Dashboard"), multiTenancySides: MultiTenancySides.Tenant);

            var sme = pages.CreateChildPermission(AppPermissions.Pages_SME, L("SME"));

            sme.CreateChildPermission(AppPermissions.Pages_SME_Dashboard, L("SMEDashboard"));

            var smeProfileCompanies = sme.CreateChildPermission(AppPermissions.Pages_SME_Companies, L("CompanyProfiles"));
            var onboarding = smeProfileCompanies.CreateChildPermission(AppPermissions.Pages_SME_Onboarding, L("Onboarding"));
            onboarding.CreateChildPermission(AppPermissions.Pages_SME_Onboarding_Create, L("OnboardingCreate"));
            onboarding.CreateChildPermission(AppPermissions.Pages_SME_Onboarding_Edit, L("OnboardingEdit"));

            var creditScore = sme.CreateChildPermission(AppPermissions.Pages_SME_ConsumerCreditScore, L("ConsumerCreditScore"));
            creditScore.CreateChildPermission(AppPermissions.Pages_SME_ConsumerCreditScore_Create, L("ConsumerCreditScoreCreate"));

            var creditReport = sme.CreateChildPermission(AppPermissions.Pages_SME_ConsumerCreditReport, L("ConsumerCreditReport"));
            creditReport.CreateChildPermission(AppPermissions.Pages_SME_ConsumerCreditReport_Create, L("ConsumerCreditReportCreate"));

            var fundingApplications = sme.CreateChildPermission(AppPermissions.Pages_SME_FundingApplications, L("FundingApplications"));
            fundingApplications.CreateChildPermission(AppPermissions.Pages_SME_FundingApplication_Create, L("FundingApplicationCreate"));
            fundingApplications.CreateChildPermission(AppPermissions.Pages_SME_FundingApplication_Edit, L("FundingApplicationEdit"));

            var smeSubscriptions = sme.CreateChildPermission(AppPermissions.Pages_SME_Subscriptions, L("SMESubscriptions"));
            smeSubscriptions.CreateChildPermission(AppPermissions.Pages_SME_Subscriptions_Create, L("SMESubscriptionCreate"));
            smeSubscriptions.CreateChildPermission(AppPermissions.Pages_SME_Subscriptions_Cancel, L("SMESubscriptionEdit"));

            var legal = sme.CreateChildPermission(AppPermissions.Pages_SME_Legal, L("Legal"), multiTenancySides: MultiTenancySides.Tenant);

            var smeDocumentRepository = sme.CreateChildPermission(AppPermissions.Pages_SME_Document_Repository, L("SMEDocumentRepository"));
            smeDocumentRepository.CreateChildPermission(AppPermissions.Pages_SME_Document_MyDocuments, L("SMEMyDocuments"));
            smeDocumentRepository.CreateChildPermission(AppPermissions.Pages_SME_Document_Wizard, L("SMEDocumentManagementWizard"));

            var sefa = sme.CreateChildPermission("SEFA", L("Sefa"), multiTenancySides: MultiTenancySides.Tenant);

            sefa.CreateChildPermission("Basic Screening Menu", L("SefaBasicScreeningPermission"));
            sefa.CreateChildPermission("Finance Application Menu", L("SefaFundingApplicationPermission"));
            sefa.CreateChildPermission("Support Menu", L("SefaSupportPermission"));

            var consumerProfileBureau = pages.CreateChildPermission(AppPermissions.Pages_Administration_ConsumerProfileBureau, L("ConsumerProfileBureau"), multiTenancySides: MultiTenancySides.Host);


            administration.CreateChildPermission(AppPermissions.Pages_Administration_Tenant_Settings, L("Settings"), multiTenancySides: MultiTenancySides.Tenant);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_Tenant_SubscriptionManagement, L("Subscription"), multiTenancySides: MultiTenancySides.Tenant);

            //HOST-SPECIFIC PERMISSIONS

            var editions = pages.CreateChildPermission(AppPermissions.Pages_Editions, L("Editions"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_Create, L("CreatingNewEdition"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_Edit, L("EditingEdition"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_Delete, L("DeletingEdition"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_MoveTenantsToAnotherEdition, L("MoveTenantsToAnotherEdition"), multiTenancySides: MultiTenancySides.Host);

            var tenants = pages.CreateChildPermission(AppPermissions.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Create, L("CreatingNewTenant"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Edit, L("EditingTenant"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_ChangeFeatures, L("ChangingFeatures"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Delete, L("DeletingTenant"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Impersonation, L("LoginForTenants"), multiTenancySides: MultiTenancySides.Host);

            administration.CreateChildPermission(AppPermissions.Pages_Administration_Host_Settings, L("Settings"), multiTenancySides: MultiTenancySides.Host);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_Host_Maintenance, L("Maintenance"), multiTenancySides: MultiTenancySides.Tenant);//_isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_HangfireDashboard, L("HangfireDashboard"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_Host_Dashboard, L("Dashboard"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, PortalConsts.LocalizationSourceName);
        }
    }
}