using SME.Portal.Sme.Subscriptions;
using SME.Portal.Documents;
using SME.Portal.List;
using SME.Portal.ConsumerCredit;
using SME.Portal.Company;
using SME.Portal.SME;
using SME.Portal.Lenders;
using SME.Portal.Currency;
using System;
using System.Linq;
using Abp.Organizations;
using SME.Portal.Authorization.Roles;
using SME.Portal.MultiTenancy;

namespace SME.Portal.EntityHistory
{
    public static class EntityHistoryHelper
    {
        public const string EntityHistoryConfigurationName = "EntityHistory";

        public static readonly Type[] HostSideTrackedTypes =
        {
            typeof(ListItem),
            typeof(CreditReport),
            typeof(Application),
            typeof(Match),
            typeof(Contract),
            typeof(Lender),
            typeof(CurrencyPair),
            typeof(OrganizationUnit), typeof(Role), typeof(Tenant)
        };

        public static readonly Type[] TenantSideTrackedTypes =
        {
            typeof(OwnerCompanyMap),
            typeof(SmeSubscription),
            typeof(Document),
            typeof(ListItem),
            typeof(CreditReport),
            typeof(CreditScore),
            typeof(FinanceProduct),
            typeof(SmeCompany),
            typeof(Owner),
            typeof(Application),
            typeof(OrganizationUnit), typeof(Role)
        };

        public static readonly Type[] TrackedTypes =
            HostSideTrackedTypes
                .Concat(TenantSideTrackedTypes)
                .GroupBy(type => type.FullName)
                .Select(types => types.First())
                .ToArray();
    }
}