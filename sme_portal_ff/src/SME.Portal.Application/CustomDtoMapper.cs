using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.Sme.Subscriptions;
using SME.Portal.Documents.Dtos;
using SME.Portal.Documents;
using SME.Portal.List.Dtos;
using SME.Portal.List;
using SME.Portal.ConsumerCredit.Dtos;
using SME.Portal.ConsumerCredit;
using SME.Portal.Company.Dtos;
using SME.Portal.Company;
using SME.Portal.SME.Dtos;
using SME.Portal.SME;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Lenders;
using SME.Portal.Currency.Dtos;
using SME.Portal.Currency;
using Abp.Application.Editions;
using Abp.Application.Features;
using Abp.Auditing;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.DynamicEntityProperties;
using Abp.EntityHistory;
using Abp.Localization;
using Abp.Notifications;
using Abp.Organizations;
using Abp.UI.Inputs;
using Abp.Webhooks;
using AutoMapper;
using SME.Portal.Auditing.Dto;
using SME.Portal.Authorization.Accounts.Dto;
using SME.Portal.Authorization.Delegation;
using SME.Portal.Authorization.Permissions.Dto;
using SME.Portal.Authorization.Roles;
using SME.Portal.Authorization.Roles.Dto;
using SME.Portal.Authorization.Users;
using SME.Portal.Authorization.Users.Delegation.Dto;
using SME.Portal.Authorization.Users.Dto;
using SME.Portal.Authorization.Users.Importing.Dto;
using SME.Portal.Authorization.Users.Profile.Dto;
using SME.Portal.Chat;
using SME.Portal.Chat.Dto;
using SME.Portal.DynamicEntityProperties.Dto;
using SME.Portal.Editions;
using SME.Portal.Editions.Dto;
using SME.Portal.Friendships;
using SME.Portal.Friendships.Cache;
using SME.Portal.Friendships.Dto;
using SME.Portal.Localization.Dto;
using SME.Portal.MultiTenancy;
using SME.Portal.MultiTenancy.Dto;
using SME.Portal.MultiTenancy.HostDashboard.Dto;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.MultiTenancy.Payments.Dto;
using SME.Portal.Notifications.Dto;
using SME.Portal.Organizations.Dto;
using SME.Portal.Sessions.Dto;
using SME.Portal.WebHooks.Dto;

namespace SME.Portal
{
    internal static class CustomDtoMapper
    {
        public static void CreateMappings(IMapperConfigurationExpression configuration)
        {
            configuration.CreateMap<CreateOrEditOwnerCompanyMapDto, OwnerCompanyMap>().ReverseMap();
            configuration.CreateMap<OwnerCompanyMapDto, OwnerCompanyMap>().ReverseMap();
            configuration.CreateMap<CreateOrEditSmeSubscriptionDto, SmeSubscription>().ReverseMap();
            configuration.CreateMap<SmeSubscriptionDto, SmeSubscription>().ReverseMap();
            configuration.CreateMap<CreateOrEditDocumentDto, Document>().ReverseMap();
            configuration.CreateMap<DocumentDto, Document>().ReverseMap();
            configuration.CreateMap<CreateOrEditListItemDto, ListItem>().ReverseMap();
            configuration.CreateMap<ListItemDto, ListItem>().ReverseMap();
            configuration.CreateMap<CreateOrEditCreditReportDto, CreditReport>().ReverseMap();
            configuration.CreateMap<CreditReportDto, CreditReport>().ReverseMap();
            configuration.CreateMap<CreateOrEditCreditScoreDto, CreditScore>().ReverseMap();
            configuration.CreateMap<CreditScoreDto, CreditScore>().ReverseMap();
            configuration.CreateMap<CreateOrEditSmeCompanyDto, SmeCompany>().ReverseMap();
            configuration.CreateMap<SmeCompanyDto, SmeCompany>().ReverseMap();
            configuration.CreateMap<CreateOrEditOwnerDto, Owner>().ReverseMap();
            configuration.CreateMap<OwnerDto, Owner>().ReverseMap();
            configuration.CreateMap<CreateOrEditApplicationDto, Application>().ReverseMap();
            configuration.CreateMap<ApplicationDto, Application>().ReverseMap();
            configuration.CreateMap<CreateOrEditMatchDto, Match>().ReverseMap();
            configuration.CreateMap<MatchDto, Match>().ReverseMap();
            configuration.CreateMap<CreateOrEditFinanceProductDto, FinanceProduct>().ReverseMap();
            configuration.CreateMap<CreateWebsiteUrlDto, WebsiteUrl>().ReverseMap();
            configuration.CreateMap<CreateResearchUrlDto, ResearchUrl>().ReverseMap();
            configuration.CreateMap<FinanceProductDto, FinanceProduct>()
                .ReverseMap()
                .ForMember(FinanceProductDto => FinanceProductDto.LenderName,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.Name));
            configuration.CreateMap<FinanceProductViewDto, FinanceProductView>()
                .ReverseMap()
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.LenderName,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.Name))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.PhysicalAddressLineOne,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.PhysicalAddressLineOne))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.PhysicalAddressLineTwo,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.PhysicalAddressLineTwo))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.PhysicalAddressLineThree,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.PhysicalAddressLineThree))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.City,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.City))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.PostalCode,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.PostalCode))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.Province,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.Province))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.HasContract,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.HasContract))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.LenderType,
                    options => options.MapFrom(financeProduct => financeProduct.LenderFk.LenderType));
            /*configuration.CreateMap<FinanceProductViewDto, FundFormView>()
                .ReverseMap()
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.Name,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductName))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.LenderName,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductFk.LenderFk.Name))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.PhysicalAddressLineOne,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductFk.LenderFk.PhysicalAddressLineOne))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.PhysicalAddressLineTwo,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductFk.LenderFk.PhysicalAddressLineTwo))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.PhysicalAddressLineThree,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductFk.LenderFk.PhysicalAddressLineThree))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.City,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductFk.LenderFk.City))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.PostalCode,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductFk.LenderFk.PostalCode))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.Province,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductFk.LenderFk.Province))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.HasContract,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductFk.LenderFk.HasContract))
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.LenderType,
                    options => options.MapFrom(fundForms => fundForms.FinanceProductFk.LenderFk.LenderType));*/
            configuration.CreateMap<CreateOrEditContractDto, Contract>().ReverseMap();
            configuration.CreateMap<ContractDto, Contract>().ReverseMap();
            configuration.CreateMap<CreateOrEditLenderDto, Lender>().ReverseMap();
            configuration.CreateMap<LenderDto, Lender>().ReverseMap();
            configuration.CreateMap<FundFormViewDto, FundFormDraftView>().ReverseMap();

            configuration.CreateMap<FinanceProductViewDto, FundFormDraftView>().ReverseMap()
                .ForMember(FinanceProductViewDto => FinanceProductViewDto.Name,
                    options => options.MapFrom(FundFormDraftView => FundFormDraftView.FinanceProductName));

            configuration.CreateMap<FundFormDto, FundForms>().ReverseMap();
            configuration.CreateMap<WebsiteUrlDto, WebsiteUrl>().ReverseMap();
            configuration.CreateMap<ResearchUrlDto, ResearchUrl>().ReverseMap();
            configuration.CreateMap<CreateOrEditCurrencyPairDto, CurrencyPair>().ReverseMap();
            configuration.CreateMap<CurrencyPairDto, CurrencyPair>().ReverseMap();
            //Inputs
            configuration.CreateMap<CheckboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<SingleLineStringInputType, FeatureInputTypeDto>();
            configuration.CreateMap<ComboboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<IInputType, FeatureInputTypeDto>()
                .Include<CheckboxInputType, FeatureInputTypeDto>()
                .Include<SingleLineStringInputType, FeatureInputTypeDto>()
                .Include<ComboboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<StaticLocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>();
            configuration.CreateMap<ILocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>()
                .Include<StaticLocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>();
            configuration.CreateMap<LocalizableComboboxItem, LocalizableComboboxItemDto>();
            configuration.CreateMap<ILocalizableComboboxItem, LocalizableComboboxItemDto>()
                .Include<LocalizableComboboxItem, LocalizableComboboxItemDto>();

            //Chat
            configuration.CreateMap<ChatMessage, ChatMessageDto>();
            configuration.CreateMap<ChatMessage, ChatMessageExportDto>();

            //Feature
            configuration.CreateMap<FlatFeatureSelectDto, Feature>().ReverseMap();
            configuration.CreateMap<Feature, FlatFeatureDto>();

            //Role
            configuration.CreateMap<RoleEditDto, Role>().ReverseMap();
            configuration.CreateMap<Role, RoleListDto>();
            configuration.CreateMap<UserRole, UserListRoleDto>();

            //Edition
            configuration.CreateMap<EditionEditDto, SubscribableEdition>().ReverseMap();
            configuration.CreateMap<EditionCreateDto, SubscribableEdition>();
            configuration.CreateMap<EditionSelectDto, SubscribableEdition>().ReverseMap();
            configuration.CreateMap<SubscribableEdition, EditionInfoDto>();

            configuration.CreateMap<Edition, EditionInfoDto>().Include<SubscribableEdition, EditionInfoDto>();

            configuration.CreateMap<SubscribableEdition, EditionListDto>();
            configuration.CreateMap<Edition, EditionEditDto>();
            configuration.CreateMap<Edition, SubscribableEdition>();
            configuration.CreateMap<Edition, EditionSelectDto>();

            //Payment
            configuration.CreateMap<SubscriptionPaymentDto, SubscriptionPayment>().ReverseMap();
            configuration.CreateMap<SubscriptionPaymentListDto, SubscriptionPayment>().ReverseMap();
            configuration.CreateMap<SubscriptionPayment, SubscriptionPaymentInfoDto>();

            //Permission
            configuration.CreateMap<Permission, FlatPermissionDto>();
            configuration.CreateMap<Permission, FlatPermissionWithLevelDto>();

            //Language
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageListDto>();
            configuration.CreateMap<NotificationDefinition, NotificationSubscriptionWithDisplayNameDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>()
                .ForMember(ldto => ldto.IsEnabled, options => options.MapFrom(l => !l.IsDisabled));

            //Tenant
            configuration.CreateMap<Tenant, RecentTenant>();
            configuration.CreateMap<Tenant, TenantLoginInfoDto>();
            configuration.CreateMap<Tenant, TenantListDto>();
            configuration.CreateMap<TenantEditDto, Tenant>().ReverseMap();
            configuration.CreateMap<CurrentTenantInfoDto, Tenant>().ReverseMap();

            //User
            configuration.CreateMap<User, UserEditDto>()
                .ForMember(dto => dto.Password, options => options.Ignore())
                .ReverseMap()
                .ForMember(user => user.Password, options => options.Ignore());
            configuration.CreateMap<User, UserLoginInfoDto>();
            configuration.CreateMap<User, UserListDto>();
            configuration.CreateMap<User, ChatUserDto>();
            configuration.CreateMap<User, OrganizationUnitUserListDto>();
            configuration.CreateMap<Role, OrganizationUnitRoleListDto>();
            configuration.CreateMap<CurrentUserProfileEditDto, User>().ReverseMap();
            configuration.CreateMap<UserLoginAttemptDto, UserLoginAttempt>().ReverseMap();
            configuration.CreateMap<ImportUserDto, User>();

            //AuditLog
            configuration.CreateMap<AuditLog, AuditLogListDto>();
            configuration.CreateMap<EntityChange, EntityChangeListDto>();
            configuration.CreateMap<EntityPropertyChange, EntityPropertyChangeDto>();

            //Friendship
            configuration.CreateMap<Friendship, FriendDto>();
            configuration.CreateMap<FriendCacheItem, FriendDto>();

            //OrganizationUnit
            configuration.CreateMap<OrganizationUnit, OrganizationUnitDto>();

            //Webhooks
            configuration.CreateMap<WebhookSubscription, GetAllSubscriptionsOutput>();
            configuration.CreateMap<WebhookSendAttempt, GetAllSendAttemptsOutput>()
                .ForMember(webhookSendAttemptListDto => webhookSendAttemptListDto.WebhookName,
                    options => options.MapFrom(l => l.WebhookEvent.WebhookName))
                .ForMember(webhookSendAttemptListDto => webhookSendAttemptListDto.Data,
                    options => options.MapFrom(l => l.WebhookEvent.Data));

            configuration.CreateMap<WebhookSendAttempt, GetAllSendAttemptsOfWebhookEventOutput>();

            configuration.CreateMap<DynamicProperty, DynamicPropertyDto>().ReverseMap();
            configuration.CreateMap<DynamicPropertyValue, DynamicPropertyValueDto>().ReverseMap();
            configuration.CreateMap<DynamicEntityProperty, DynamicEntityPropertyDto>()
                .ForMember(dto => dto.DynamicPropertyName,
                    options => options.MapFrom(entity => entity.DynamicProperty.PropertyName));
            configuration.CreateMap<DynamicEntityPropertyDto, DynamicEntityProperty>();

            configuration.CreateMap<DynamicEntityPropertyValue, DynamicEntityPropertyValueDto>().ReverseMap();

            //User Delegations
            configuration.CreateMap<CreateUserDelegationDto, UserDelegation>();

            /* ADD YOUR OWN CUSTOM AUTOMAPPER MAPPINGS HERE */

            //User Transfer Mapping
            configuration.CreateMap<User, User>();
            configuration.CreateMap<Owner, Owner>();
            configuration.CreateMap<SmeCompany, SmeCompany>();
            configuration.CreateMap<OwnerCompanyMap, OwnerCompanyMap>();
            configuration.CreateMap<SmeSubscription, SmeSubscription>();

            //Comment
            configuration.CreateMap<CommentDto, LendersComment>().ReverseMap();
            configuration.CreateMap<FinanceProductCommentDto, FinanceProductComment>().ReverseMap()
                .ForMember(FinanceProductCommentDto => FinanceProductCommentDto.UserName,
                    options => options.MapFrom(financeProductComment => financeProductComment.UserFk.Name));
        }
    }
}