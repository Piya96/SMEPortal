namespace SME.Portal.Web.Areas.App.Startup
{
    public class AppPageNames
    {
        public static class Common
        {
            public const string ListItems = "Administration.List.ListItems";
            public const string Applications = "Administration.SME.Applications";
            public const string Administration = "Administration";
            public const string Roles = "Administration.Roles";
            public const string Users = "Administration.Users";
            public const string AuditLogs = "Administration.AuditLogs";
            public const string OrganizationUnits = "Administration.OrganizationUnits";
            public const string Languages = "Administration.Languages";
            public const string DemoUiComponents = "Administration.DemoUiComponents";
            public const string UiCustomization = "Administration.UiCustomization";
            public const string WebhookSubscriptions = "Administration.WebhookSubscriptions";
            public const string DynamicProperties = "Administration.DynamicProperties";
            public const string DynamicEntityProperties = "Administration.DynamicEntityProperties";
            public const string LenderAdmin = "LenderAdmin";
            public const string EmailNotConfirmed = "Account.EmailNotConfirmed";
            public const string StartupServices = "StartupServices";
            public const string SmeData = "SmeData";
            public const string UserAdmin = "UserAdmin";


        }

        public static class Sme
        {
            public const string Welcome = "Welcome";

            public const string Dashboard = "Dashboard.Sme";

            public const string Subscriptions = "Subscriptions";
            public const string SubscriptionUserSubscriptions = "Subscriptions.UserSubscriptions";
            public const string SubscriptionPricing = "Subscription.Pricing";
            public const string SubscriptionFreeTier = "Subscription.FreeTier";
            public const string SubscriptionStandardTier = "Subscription.StandardTier";
            public const string SubscriptionPremiumTier = "Subscription.PremiumTier";
            public const string SubscriptionTiers = "Subscription.Tiers";
            public const string SubscriptionPaymentSuccess = "Subscription.Payment.Success";
            public const string SubscriptionPaymentCancelled = "Subscription.Payment.Cancelled";
            public const string SubscriptionCancelled = "Subscription.Cancelled"; 

            public const string Profiles = "Profiles";
            public const string ProfileCompanies = "Profiles.Companies";
            public const string ProfileOwnerWizard = "Profiles.Owner.Wizard";
            public const string ProfileCompanyWizard = "Profiles.Company.Wizard";
            public const string ProfileOnboarding = "Profiles.Onboarding";

            public const string LoanApplications = "Loan.Applications";
            public const string FundingApplications = "Funding.Applications";
            public const string FundingApplicationWizard = "Funding.ApplicationWizard";
            public const string FinanceProductSummary = "Funding.FinanceProductSummary";

            public const string ConsumerCreditScore = "Consumer.Credit.Score";
            public const string ConsumerCreditReport = "Consumer.Credit.Report";
            public const string ConsumerCreditScoreWizard = "Consumer.Credit.ScoreWizard";

            public const string Legal = "Legal";
            public const string TermsAndConditions = "Legal.TermsConditions";
            public const string PrivacyPolicy = "Legal.PrivacyPolicy";

            public const string Documents = "Documents.Documents";
            public const string MyDocuments = "Documents.MyDocuments";
            public const string DocumentManagement = "Documents.DocumentManagement";

        }

        public static class Host
        {
            public const string CurrencyPairs = "Currency.CurrencyPairs";
            public const string Tenants = "Tenants";
            public const string Editions = "Editions";
            public const string Maintenance = "Administration.Maintenance";
            public const string Settings = "Administration.Settings.Host";
            public const string Dashboard = "Dashboard";
        }

        public static class Tenant
        {
            public const string OwnerCompanyMapping = "Administration.Company.OwnerCompanyMapping";
            public const string SmeSubscriptions = "Administration.Subscriptions.SmeSubscriptions";
            public const string Documents = "Administration.Documents.Documents";
            public const string CreditReports = "ConsumerCredit.CreditReports";
            public const string CreditScores = "ConsumerCredit.CreditScores";
            public const string FinanceProducts = "Administration.Lenders.FinanceProducts";
            public const string Matches = "Administration.Lenders.Matches";
            public const string Contracts = "Administration.Lenders.Contracts";
            public const string Lenders = "Administration.Lenders.Lenders";
            public const string SmeCompanies = "Administration.Company.SmeCompanies";
            public const string Owners = "Administration.Company.Owners";
            public const string Dashboard = "Dashboard.Tenant";
            public const string Settings = "Administration.Settings.Tenant";
            public const string SubscriptionManagement = "Administration.SubscriptionManagement.Tenant";
            public const string CrowdFunders = "StartupServices.CrowdFunders.Tenant";
            public const string ImpactFunders = "StartupServices.ImpactFunders.Tenant";
            public const string Incubators = "StartupServices.Incubators.Tenant";
            public const string EnterpriseDevelopmentProgrammes = "StartupServices.EnterpriseDevelopmentProgrammes.Tenant";
            public const string FunderSearches = "SmeData.FunderSearches";
        }
    }
}