using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.HubSpot.Dtos
{
    public enum UserJourneyContextTypes
    {
        NewUserRegistration,
        UserEmailConfirmation,
        OnboardingStarted,
        OnboardingCompleted,
        ApplicationStarted,
        ApplicationPartialSubmit,
        ApplicationLocked,
        ApplicationAbandoned,
        UpgradeSubscription,
        CancelSubscription,
        ExpiredSubscription
    }
    public enum HubSpotEventTypes
    {
        Create,
        Edit,
        CreateEdit,
        WorkflowEnrol,
        WorkflowUnenrol
    };

    public enum HubSpotEntityTypes
    {
        contacts,
        companies,
        deals
    };

    public enum HubSpotDependencyDefinitionTypes
    {
        ContactToCompany = 1,
        CompanyToContact = 2,
        DealToContact = 3,
        ContactToDeal = 4,
        DealToCompany = 5
    }

    public class HubSpotEntityIdentifyingDto
    {
        public Dictionary<string, string> NameValuePairs { get; set; }

        public HubSpotEntityTypes HSEntityType { get; set; }
    }

    
    public class HubSpotEventTriggerDto
    {
        public string TenancyName { get; set; }
        public int TenantId { get; set; }
        public long? UserId { get; set; }
        public long? OwnerId { get; set; }
        public int? SmeCompanyId { get; set; }
        public int? ApplicationId { get; set; }
        public string PaymentId { get; set; }
        public string FSSummaryJson { get; set; }

        public UserJourneyContextTypes UserJourneyPoint { get; set; }
        public HubSpotEventTypes EventType { get; set; }
        public HubSpotEntityTypes HSEntityType { get; set; }

        public Dictionary<string,string> Properties { get; set; }

        public List<HubSpotDependencyDefinitionTypes> DependencyTypes { get; set; }
        public List<HubSpotEntityIdentifyingDto> DependentEntities { get; set; }
    }
}
