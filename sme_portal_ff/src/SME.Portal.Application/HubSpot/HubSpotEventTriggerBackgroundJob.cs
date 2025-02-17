using Abp.BackgroundJobs;
using Abp.Configuration;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Json;
using Abp.Threading;
using ConsumerProfileBureau.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NUglify.Helpers;
using SME.Portal.Authentication;
using SME.Portal.Authorization.Users;
using SME.Portal.Common.Dto;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using SME.Portal.Configuration;
using SME.Portal.ConsumerCredit;
using SME.Portal.Helpers;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.Lenders;
using SME.Portal.List;
using SME.Portal.List.Dtos;
using SME.Portal.SME;
using SME.Portal.SME.Dtos;
using SME.Portal.SME.Subscriptions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace SME.Portal.HubSpot
{
    public class HubSpotEventTriggerBackgroundJob : BackgroundJob<HubSpotEventTriggerDto>, ITransientDependency
    {
        private readonly UserManager _userManager;
        private readonly IRepository<SmeCompany, int> _smeCompaniesRepository;
        private readonly IRepository<Owner, long> _ownerRepository;
        private readonly IRepository<Application, int> _applicationRepo;
        private readonly IRepository<Match, int> _matchesRepository;
        private readonly IRepository<FinanceProduct, int> _financeProductRepository;
        private readonly IRepository<Lender, int> _lenderRepository;
        private readonly IRepository<ListItem, int> _listRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IConfigurationRoot _appConfiguration;
        private readonly ISettingManager _settingManager;
        private FinfindAzureApiGatewaySettings _settings;
        private List<ListItemDto> _listItems;
        private readonly IRepository<CreditScore> _creditScoreRepository;
        private readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;

        public HubSpotEventTriggerBackgroundJob( IRepository<ListItem, int> listRepository,
                                                 UserManager userManager,
                                                 IRepository<SmeCompany, int> smeCompaniesRepository,
                                                 IRepository<Owner, long> ownerRepository,
                                                 IRepository<Application, int> applicationRepo,
                                                 IRepository<Match, int> matchesRepository,
                                                 IRepository<FinanceProduct, int> financeProductRepository,
                                                 IRepository<Lender, int> lenderRepository,
                                                 IUnitOfWorkManager unitOfWorkManager,
                                                 IAppConfigurationAccessor configurationAccessor,
                                                 ISettingManager settingManager,
                                                 IRepository<CreditScore> creditScoreRepository,
                                                 SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt)
        {
            _listRepository = listRepository;
            _userManager = userManager;
            _smeCompaniesRepository = smeCompaniesRepository;
            _ownerRepository = ownerRepository;
            _applicationRepo = applicationRepo;
            _matchesRepository = matchesRepository;
            _financeProductRepository = financeProductRepository;
            _lenderRepository = lenderRepository;
            _unitOfWorkManager = unitOfWorkManager;
            _appConfiguration = configurationAccessor.Configuration;
            _settingManager = settingManager;
            _creditScoreRepository = creditScoreRepository;
            _smeSubscriptionsAppServiceExt = smeSubscriptionsAppServiceExt;

            var settingValue = settingManager.GetSettingValueForApplication(AppSettings.FinfindApi.AzureApiGateway);
            var settings = settingValue.FromJsonString<FinfindAzureApiGatewaySettings>();

            if (!settings.Enabled)
                throw new ArgumentException("FinfindApi is not enabled");

            if (string.IsNullOrEmpty(settings.KeyName))
                throw new ArgumentException("FinfindApi KeyName is not defined");

            if (string.IsNullOrEmpty(settings.KeyValue))
                throw new ArgumentException("FinfindApi KeyValue is not defined");

            if (string.IsNullOrEmpty(settings.ApiUrl))
                throw new ArgumentException("FinfindApi Base Api Url is not defined");

            _settings = settings;
        }

        [UnitOfWork]
        public override void Execute(HubSpotEventTriggerDto request)
        {
            Logger.Debug($"HubSpotEventTriggerBackgroundJob triggered with payload: {Environment.NewLine} {request}");

            try
            {
                using (CurrentUnitOfWork.SetTenantId(request.TenantId))
                {
                    SetListItems();

                    #region User Registration and Onboarding

                    // User Registration - new user properties
                    if (request.UserJourneyPoint == UserJourneyContextTypes.NewUserRegistration && request.HSEntityType == HubSpotEntityTypes.contacts && request.UserId.HasValue)
                        HandleNewUserRegistration(request);

                    // User Registration - email confirmation properties
                    if (request.UserJourneyPoint == UserJourneyContextTypes.UserEmailConfirmation && request.HSEntityType == HubSpotEntityTypes.contacts && request.UserId.HasValue)
                        HandleUserRegistrationEmailConfirmed(request);

                    // Onboarding Complete - set Company properties and dependencies
                    if (request.UserJourneyPoint == UserJourneyContextTypes.OnboardingCompleted && request.HSEntityType == HubSpotEntityTypes.companies)
                        HandleOnboardingCompleteCompany(request, request.TenancyName);

                    // Onboarding Complete - set contact (owner) properties 
                    if (request.UserJourneyPoint == UserJourneyContextTypes.OnboardingCompleted && request.HSEntityType == HubSpotEntityTypes.contacts)
                        HandleOnboardingCompleteOwner(request);
                    
                    #endregion

                    #region Application handlers

                    // Application Started/Partial Submit - deal properties (NOT IMPLEMENTED)
                    if (request.UserJourneyPoint == UserJourneyContextTypes.ApplicationPartialSubmit && request.HSEntityType == HubSpotEntityTypes.deals)
                    { 
                        HandleApplicationPartialSubmit(request, request.TenancyName);
                    }

                    // Application Started
                    if (request.UserJourneyPoint == UserJourneyContextTypes.ApplicationStarted && request.HSEntityType == HubSpotEntityTypes.contacts)
                    {
                        HandleUserNewApplicationStarted(request);
                    }

                    // Application Abandoned
                    if (request.UserJourneyPoint == UserJourneyContextTypes.ApplicationAbandoned && request.HSEntityType == HubSpotEntityTypes.contacts)
                    {
                        HandleUserApplicationAbandoned(request);
                    }

                    // Application Locked - deal properties
                    if (request.UserJourneyPoint == UserJourneyContextTypes.ApplicationLocked && request.HSEntityType == HubSpotEntityTypes.deals)
                        HandleApplicationLocked(request, request.TenancyName);

                    // TODO: Does this method ever get called?
                    if (request.UserJourneyPoint == UserJourneyContextTypes.ApplicationLocked && request.HSEntityType == HubSpotEntityTypes.companies)
                        HandleApplicationLockedForCompany(request, request.TenancyName);

                    // TODO: Does this method ever get called?
                    if (request.UserJourneyPoint == UserJourneyContextTypes.ApplicationLocked && request.HSEntityType == HubSpotEntityTypes.contacts)
                        HandleApplicationLockedForContact(request, request.TenancyName);

                    #endregion

                    #region Subscription handlers
                    // Subscription Upgrade - deal properties
                    if (request.UserJourneyPoint == UserJourneyContextTypes.UpgradeSubscription && request.HSEntityType == HubSpotEntityTypes.companies)
                        HandleSubscriptionUpgrade(request);

                    // Subscription Cancel - deal properties
                    if (request.UserJourneyPoint == UserJourneyContextTypes.CancelSubscription && request.HSEntityType == HubSpotEntityTypes.companies)
                        HandleSubscriptionCancel(request);

                    // Subscription Expiry - deal properties
                    if (request.UserJourneyPoint == UserJourneyContextTypes.ExpiredSubscription && request.HSEntityType == HubSpotEntityTypes.companies)
                        HandleSubscriptionExpired(request);

                    #endregion

                    CurrentUnitOfWork.SaveChanges();
                }
            }
            catch (Exception x)
            {
                Logger.Error($"Exception: {x.Message} {Environment.NewLine} Failed to get HubSpot entity properties. Request Json: {JsonConvert.SerializeObject(request)} ");
                throw x;
            }

        }

        #region Utility methods

        private void SetListItems()
        {
            _listItems = new List<ListItemDto>();

            foreach (var o in _listRepository.GetAll().ToList())
            {
                _listItems.Add(new ListItemDto
                {
                    Id = o.Id,
                    ListId = o.ListId,
                    ParentListId = o.ParentListId,
                    Name = o.Name,
                    Details = o.Details,
                    Priority = o.Priority,
                    MetaOne = o.MetaOne,
                    MetaTwo = o.MetaTwo,
                    MetaThree = o.MetaThree,
                    Slug = o.Slug
                });
            }
        }

        private void CheckField(string src, string dst, Dictionary<string, string> properties, string debugStr)
        {
            if (string.IsNullOrEmpty(src))
                Logger.Debug(debugStr);

            properties.Add(dst, src);
        }

        private string SendRequest(HubSpotEventTriggerDto request)
        {
            // Prod/Staging
            // create the HubSpot APIM url 
            var uriBuilder = new UriBuilder(UriHelper.CombineUri(_settings.ApiUrl, $"integrations/hubspot/create-entity"));

            // Dev environment
            //var uriBuilder = new UriBuilder(UriHelper.CombineUri("http://localhost:7071/", $"integrations/hubspot/create-entity"));

            // create a query
            HttpClient httpClient = new HttpClient();

            var jsonPayload = JsonConvert.SerializeObject(request);

            HttpRequestMessage httpRequest = new HttpRequestMessage
            {
                RequestUri = uriBuilder.Uri,
                Method = HttpMethod.Post,
                Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
            };

            httpRequest.Headers.Add(_settings.KeyName, _settings.KeyValue);

            HttpResponseMessage response = AsyncHelper.RunSync(() => httpClient.SendAsync(httpRequest));
            var jsonResponse = AsyncHelper.RunSync(() => response.Content.ReadAsStringAsync());

            Logger.Info($"Call to hubspit api uri:{uriBuilder.Uri} payload:{jsonPayload} response:{jsonResponse}");

            return jsonResponse;
        }

        #endregion

        #region User Registration
        private void HandleUserRegistrationEmailConfirmed(HubSpotEventTriggerDto request)
        {
            Logger.Info($"Handle HubSpot Event Trigger for UserRegistration EmailConfirmed");

            var user = _userManager.GetUser(new Abp.UserIdentifier(request.TenantId, request.UserId.Value));

            if (user == null)
            {
                Logger.Error($"Failed to retrieve User by Id:{request.UserId.Value} for UserJourneyPoint: {request.UserJourneyPoint}");
                return;
            }

            request.Properties = new Dictionary<string, string>()
            {
                { "email", user.EmailAddress },
                { "registration_finished", "true" }
            };

            // entity creation
            SendRequest(request);
        }

        

        private void HandleNewUserRegistration(HubSpotEventTriggerDto request)
        {
            Logger.Info($"Handle HubSpotEvent Trigger for UserRegistration");

            var user = _userManager.GetUser(new Abp.UserIdentifier(request.TenantId, request.UserId.Value));

            if (user == null)
            {
                Logger.Error($"Failed to retrieve User by Id:{request.UserId.Value} for UserJourneyPoint: {request.UserJourneyPoint}");
                return;
            }

            request.Properties = new Dictionary<string, string>()
            {
                { "firstname", user.Name },
                { "lastname", user.Surname },
                { "lifecyclestage", "opportunity" },
                { "registration_finished", "false" },
                { "email", user.EmailAddress },
                { "finfind_registration_date", DateTimeToUTC.ConvertToUnixTimeMs(DateTime.Now).ToString() },
                { "origin", string.IsNullOrEmpty(user.Origin) ? "Finfind" : user.Origin }
            };

            // queue the entity create request
            SendRequest(request);
        }
        #endregion

        #region Profiling/Onboarding - Owner/Company

        private void HandleOnboardingCompleteOwner(HubSpotEventTriggerDto request)
        {
            Logger.Info($"Handle HubSpotEvent Trigger for Onboarding Owner");

            #region Retrieve Owner entity and ensure verificationRecord exists

            var properties = new Dictionary<string, string>();

            var owner = _ownerRepository.FirstOrDefault(x => x.Id == request.OwnerId.Value);

            if (owner == null)
            {
                Logger.Error($"Failed to retrieve Owner by Id:{request.OwnerId.Value} for UserJourneyPoint: {request.UserJourneyPoint}");
                return;
            }

            if (string.IsNullOrEmpty(owner.VerificationRecordJson))
            {
                Logger.Error("Owner verification record not found");
                return;
            }

            #endregion

            #region Set Properties

            var verificationRecord = PersonVerificationDto.FromJson(owner.VerificationRecordJson);

            // set verification properties
            if (verificationRecord == null)
            {
                Logger.Debug($"Failed to retrieve VerificationRecord for Owner Id: {owner.Id}");
            }
            else
            {
                properties.Add("person_verification_record", owner.VerificationRecordJson);
                properties.Add("gender", verificationRecord.Gender);
                properties.Add("age", verificationRecord.Age.ToString());
                properties.Add("marital_status", verificationRecord.MaritalStatus);
            }

            CheckField(owner.IdentityOrPassport, "south_african_identity_number", properties, $"Failed to retieve [south_african_identity_number] for Owner Id: {owner.Id}");
            CheckField(owner.EmailAddress, "email", properties, $"Failed to retieve [email] for Owner Id: {owner.Id}");
            CheckField(owner.Name, "firstname", properties, $"Failed to retieve [firstname] for Owner Id: {owner.Id}");
            CheckField(owner.Surname, "lastname", properties, $"Failed to retieve [lastname] for Owner Id: {owner.Id}");
            CheckField(owner.PhoneNumber, "mobilephone", properties, $"Failed to retieve [mobilephone] for Owner Id: {owner.Id}");
            CheckField(owner.PhoneNumber, "phone", properties, $"Failed to retieve [phone] for Owner Id: {owner.Id}");
            CheckField(owner.IsPhoneNumberConfirmed ? "true" : "false", "mobile_verified", properties, $"Failed to retieve [IsPhoneNumberConfirmed] for Owner Id: {owner.Id}");
            CheckField(_listItems.FirstOrDefault(x=> x.ListId == owner.Race)?.Name, "race", properties, $"Failed to retieve [race] for Owner Id: {owner.Id}");
            CheckField(owner.IsIdentityOrPassportConfirmed ? "true" : "false", "identity_confirmed", properties, $"Failed to retieve [IsIdentityOrPassportConfirmed] for Owner Id: {owner.Id}");

            // set the registration date
            properties.Add("finfind_registration_date", DateTimeToUTC.ConvertToUnixTimeMs(DateTime.Now).ToString());
            // shows as an SME not a lender
            properties.Add("company_representative", "I am an entreprenuer/business owner");
            // "hs_lead_status", "OPEN_DEAL"
            properties.Add("hs_lead_status", "IN_PROGRESS");
            // "lifecyclestage", "lead"
            properties.Add("lifecyclestage", "lead");

            // queue entity creation
            request.Properties = properties;

            #endregion

            SendRequest(request);
        }

        private void HandleOnboardingCompleteCompany(HubSpotEventTriggerDto request, string tenancyName)
        {

            Logger.Info($"Handle HubSpotEvent Trigger for Onboarding Company");

            #region Get Company entity and associated Dto's

            var company = _smeCompaniesRepository.FirstOrDefault(x => x.Id == request.SmeCompanyId.Value);
            var owner = _ownerRepository.FirstOrDefault(x => x.Id == request.OwnerId.Value);

            if (company == null || owner == null)
            {
                Logger.Error($"Failed to retrieve Company Id:{request.SmeCompanyId.Value} and Owner Id:{request.OwnerId} for UserJourneyPoint: {request.UserJourneyPoint}");
                return;
            }

            var companyProperties = new List<NameValuePairDto>();

            JObject o = JObject.Parse(company.PropertiesJson);

            if (o["matchCriteriaJson"] != null && o["matchCriteriaJson"].HasValues)
                companyProperties = NameValuePairDto.FromJson(o["matchCriteriaJson"].ToString()).ToList();

            // get the Company associated with the Application
            var companyDto = new SmeCompanyDto()
            {
                Type = company.Type,
                RegisteredAddress = company.RegisteredAddress,
                StartedTradingDate = company.StartedTradingDate,
                Industries = company.Industries,
                BeeLevel = company.BeeLevel
            };

            // get the Owner of the Company
            var ownerDto = new OwnerDto()
            {
                IsIdentityOrPassportConfirmed = owner.IsIdentityOrPassportConfirmed,
            };

            var appCriteriaDto = new ApplicationCriteriaDto(companyProperties, companyDto, ownerDto, _listItems, tenancyName);

            #endregion

            #region Set Properties

            request.Properties = new Dictionary<string, string>();

            CheckField(company.Name, "name", request.Properties, $"Failed to retieve [name] for Owner Id: {owner.Id} and Company Id: {company.Id}");
            CheckField(company.RegistrationNumber, "registration_number", request.Properties, $"Failed to retieve [registration_number] for Owner Id: {owner.Id} and Company Id: {company.Id}");
            CheckField(_listItems.FirstOrDefault(x => x.ListId == company.Type)?.Name, "registration_type", request.Properties, $"Failed to retieve [Type] for Owner Id: {owner.Id} and Company Id: {company.Id}");
            CheckField(_listItems.FirstOrDefault(x => x.ListId == company.BeeLevel)?.Name, "bee_level", request.Properties, $"Failed to retieve [BeeLevel] for Owner Id: {owner.Id} and Company Id: {company.Id}");
            CheckField(company.StartedTradingDate.Value.Year.ToString(), "founded_year", request.Properties, $"Failed to retieve [founded_year] for Owner Id: {owner.Id} and Company Id: {company.Id}");

            if (string.IsNullOrEmpty(company.RegisteredAddress))
                Logger.Debug($"Failed to retrieve RegisteredAddress for Owner Id: {owner.Id} and Company Id: {company.Id}");

            var addressItems = company.RegisteredAddress.Split(',').ToList();

            CheckField(addressItems[0], "address", request.Properties, $"Failed to retieve [address] for Owner Id: {owner.Id} and Company Id: {company.Id}");
            CheckField(addressItems[1], "address2", request.Properties, $"Failed to retieve [address2] for Owner Id: {owner.Id} and Company Id: {company.Id}");
            CheckField(addressItems[2], "city", request.Properties, $"Failed to retieve [city] for Owner Id: {owner.Id} and Company Id: {company.Id}");
            CheckField(addressItems[3], "zip", request.Properties, $"Failed to retieve [zip] for Owner Id: {owner.Id} and Company Id: {company.Id}");
            CheckField(addressItems[4], "state", request.Properties, $"Failed to retieve [state] for Owner Id: {owner.Id} and Company Id: {company.Id}");

            CheckField(_listItems.FirstOrDefault(x => x.ListId == company.Industries)?.Name, "industry_sector", request.Properties, $"Failed to retieve [Industries] for Owner Id: {owner.Id} and Company Id: {company.Id}");

            var monthsTrading = appCriteriaDto.MonthStartedToTrade.HasValue ? appCriteriaDto.MonthStartedToTrade.Value.ToString() : "";
            CheckField(monthsTrading, "months_trading", request.Properties, $"Failed to retieve [months_trading] for Owner Id: {owner.Id} and Company Id: {company.Id}");

            var ownership = $"Total Number of Owners ({appCriteriaDto.NumberOfOwners}){Environment.NewLine}";
            ownership += $"Black, Coloured and Indian ({appCriteriaDto.BlackOwnedPercentage}%){Environment.NewLine}";
            ownership += $"Black South African only ({appCriteriaDto.BlackAllOwnedPercentage}%){Environment.NewLine}";
            ownership += $"White ({appCriteriaDto.WhiteOwnedPercentage}%){Environment.NewLine}";
            ownership += $"Woman ({appCriteriaDto.WomenOwnedPercentage}%){Environment.NewLine}";
            ownership += $"Black Woman ({appCriteriaDto.BlackWomenOwnedPercentage}%){Environment.NewLine}";
            ownership += $"Disabled ({appCriteriaDto.DisabledOwnedPercentage}%){Environment.NewLine}";
            ownership += $"Youth ({appCriteriaDto.YouthOwnedPercentage}%){Environment.NewLine}";
            CheckField(ownership, "ownership", request.Properties, $"Failed to retieve [ownership] for Owner Id: {owner.Id} and Company Id: {company.Id}");

            var employees = $"Full-time employees ({appCriteriaDto.NumberOfFullTimeEmployees}){Environment.NewLine}";
            employees += $"Full-time woman employees ({appCriteriaDto.NumberOfFullTimeWomanEmployees}){Environment.NewLine}";
            employees += $"Full-time employees under 35 ({appCriteriaDto.NumberOfFullTimeEmployeesUnder35}){Environment.NewLine}";
            employees += $"Part-time employees ({appCriteriaDto.NumberOfPartTimeEmployees}){Environment.NewLine}";
            employees += $"Part-time woman employees ({appCriteriaDto.NumberOfPartTimeWomanEmployees}){Environment.NewLine}";
            employees += $"Part-time employees under 35 ({appCriteriaDto.NumberOfPartTimeEmployeesUnder35}){Environment.NewLine}";
            CheckField(employees, "employees", request.Properties, $"Failed to retieve [employees] for Owner Id: {owner.Id} and Company Id: {company.Id}");

            // organisationid
            CheckField(company.Id.ToString(), "sme_company_id", request.Properties, $"Failed to retieve [employees] for Owner Id: {owner.Id} and Company Id: {company.Id}");

            // "hs_lead_status", "OPEN_DEAL"
            request.Properties.Add("hs_lead_status", "IN_PROGRESS");

            // "lifecyclestage", "lead"
            request.Properties.Add("lifecyclestage", "lead");

            // VerificationRecordJson exists add it 
            if (string.IsNullOrEmpty(company.VerificationRecordJson))
                Logger.Debug($"Failed to retrieve VerificationRecord for Owner Id: {owner.Id} and Company Id: {company.Id}");
            else
                request.Properties.Add("company_verification_record", company.VerificationRecordJson);

            #endregion

            #region Add dependencies

            request.DependencyTypes = new List<HubSpotDependencyDefinitionTypes>()
            {
                HubSpotDependencyDefinitionTypes.ContactToCompany,
                HubSpotDependencyDefinitionTypes.CompanyToContact
            };

            request.DependentEntities = new List<HubSpotEntityIdentifyingDto>()
            {
                new HubSpotEntityIdentifyingDto()
                {
                    HSEntityType = HubSpotEntityTypes.companies,
                    NameValuePairs = new Dictionary<string, string>() { { "name", company.Name } }
                },
                new HubSpotEntityIdentifyingDto()
                {
                    HSEntityType = HubSpotEntityTypes.contacts,
                    NameValuePairs = new Dictionary<string, string>() { { "email", owner.EmailAddress } }
                }
            };

            #endregion

            // queue entity creation
            SendRequest(request);
        }

        #endregion

        #region Application Submissions

        private void HandleApplicationPartialSubmit(HubSpotEventTriggerDto request, string tenancyName)
        {
            return;
        }

        private void HandleApplicationLocked(HubSpotEventTriggerDto request, string tenancyName)
        {
            Logger.Info($"Handle HubSpotEvent Trigger for Application.Id:{request.ApplicationId}");

            var application = GetApplication(request.ApplicationId);

            if(application.TenantId == 3)
            {
                CreateSefaDeal(request, application, tenancyName);
                return;
            }

			if(application.TenantId == 5)
			{
				CreateECDCDeal(request, application, tenancyName);
				return;
			}

			// get the associated Match
			var match = GetMatch(application.Id);

            // get all FinanceProducts
            var financeProductIds = match.FinanceProductIds.Split(',').ToList();

            var financeProducts = GetFinanceProducts(financeProductIds);

            // get a unique set of Lenders
            IEnumerable<int> enumerable = financeProducts.Select(x => x.LenderId);

            var lenderIds = enumerable;

            foreach (var lenderId in lenderIds)
            {
                try
                {
                    var financeProductsMatched = string.Empty;

                    var lender = _lenderRepository.Get(lenderId);

                    foreach (var fpName in financeProducts.Where(x => x.LenderId == lender.Id).Select(x => x.Name))
                        financeProductsMatched += $"{fpName} {Environment.NewLine}";

                    CreateDeal(request, application, match, lender, financeProductsMatched, tenancyName);
                }
                catch(Exception x)
                {
                    Logger.Error($"Failed to add Deals for Lender.Id:{lenderId} with Exception.Message:{x.Message}");
                    continue;
                }
            }
        }

        private void HandleApplicationLockedForCompany(HubSpotEventTriggerDto request, string tenancyName)
        {
            Logger.Info($"Handle HubSpotEvent Trigger for Funder Search Id:{request.ApplicationId} Submit for Company");

            #region Get entities Application, SmeCompany, Owner and AppCriteriaDto
            var application = GetApplication(request.ApplicationId);
            
            var userApplications = _applicationRepo.GetAll()
                                                   .Include(e => e.UserFk)
                                                   .Include(e => e.SmeCompanyFk)
                                                   .Where(e => e.UserId == application.UserId);
            var completedCompanyApplications = userApplications.Where(x=>x.SmeCompanyId == application.SmeCompanyId && x.Locked.HasValue).ToList().Count;

            var company = _smeCompaniesRepository.Get(application.SmeCompanyId);
            var owner = _ownerRepository.FirstOrDefault(x => x.UserId == company.UserId);

            // get the Company associated with the Application
            var companyDto = new SmeCompanyDto()
            {
                Type = company.Type,
                RegisteredAddress = company.RegisteredAddress,
                StartedTradingDate = company.StartedTradingDate,
                Industries = company.Industries,
                BeeLevel = company.BeeLevel
            };

            // get the Owner of the Company
            var ownerDto = new OwnerDto()
            {
                IsIdentityOrPassportConfirmed = owner.IsIdentityOrPassportConfirmed,
            };

            var criteria = NameValuePairDto.FromJson(application.MatchCriteriaJson).ToList();
            var appCriteriaDto = new ApplicationCriteriaDto(criteria, companyDto, ownerDto, _listItems, tenancyName);
            
            #endregion

            #region Set integration properties
            request.Properties = new Dictionary<string, string>();

            if (!string.IsNullOrEmpty(company.Name))
                request.Properties.Add("name", company.Name);

            var averageAnnualTurnover = appCriteriaDto.AnnualTurnover;
            var isProfitable = appCriteriaDto.IsProfitable.HasValue ? appCriteriaDto.IsProfitable.ToString().ToLower() : "";
            var hasCollateral = appCriteriaDto.HasCollateral.HasValue ? appCriteriaDto.HasCollateral.ToString().ToLower() : "";
            var investOwnMoney = appCriteriaDto.InvestedOwnMoney == "Yes" ? "true" : "false";
            var electronicAccSystemsOther = "";
            if (!string.IsNullOrEmpty(appCriteriaDto.OtherElectronicAccountingSystems))
                electronicAccSystemsOther = $": {appCriteriaDto.OtherElectronicAccountingSystems}";
            var electronicAccSystems = $"{appCriteriaDto.ElectronicAccountingSystems}{electronicAccSystemsOther}";
            var payrollSystemOther = "";
            if (!string.IsNullOrEmpty(appCriteriaDto.OtherPayrollSystem))
                payrollSystemOther = $": {appCriteriaDto.OtherPayrollSystem}";
            var payrollSystems = $"{appCriteriaDto.PayrollSystem}{payrollSystemOther}";


            request.Properties.Add("average_annual_turnover", averageAnnualTurnover);
            request.Properties.Add("profitable", isProfitable);
            request.Properties.Add("has_collateral", hasCollateral);
            request.Properties.Add("funder_searches_completed", completedCompanyApplications.ToString());
            request.Properties.Add("business_bank", appCriteriaDto.BusinessBank);
            request.Properties.Add("bank_account_services", appCriteriaDto.BankAccountServices);
            request.Properties.Add("personal_bank", appCriteriaDto.PersonalBank);
            request.Properties.Add("other_business_loans", appCriteriaDto.OtherBusinessLoans);
            request.Properties.Add("electronic_accounting_system", electronicAccSystems);
            request.Properties.Add("payroll_system", payrollSystems);
            request.Properties.Add("invested_own_money", investOwnMoney);

            #endregion

            SendRequest(request);
        }

        private void HandleApplicationLockedForContact(HubSpotEventTriggerDto request, string tenancyName)
        {
            Logger.Info($"Handle HubSpotEvent Trigger for Funder Search Id:{request.ApplicationId} Submit for Contact");

            #region Get entities Application, SmeCompany, Owner and AppCriteriaDto

            var application = GetApplication(request.ApplicationId);

            var userApplications = _applicationRepo.GetAll()
                                                   .Include(e => e.UserFk)
                                                   .Include(e => e.SmeCompanyFk)
                                                   .Where(e => e.UserId == application.UserId);
            var completedCompanyApplications = userApplications.Where(x => x.SmeCompanyId == application.SmeCompanyId && x.Locked.HasValue).ToList().Count;

            var company = _smeCompaniesRepository.Get(application.SmeCompanyId);
            var owner = _ownerRepository.FirstOrDefault(x => x.UserId == company.UserId);
            var user = _userManager.GetUser(new Abp.UserIdentifier(request.TenantId, request.UserId.Value));

            // get the Company associated with the Application
            var companyDto = new SmeCompanyDto()
            {
                Type = company.Type,
                RegisteredAddress = company.RegisteredAddress,
                StartedTradingDate = company.StartedTradingDate,
                Industries = company.Industries,
                BeeLevel = company.BeeLevel
            };

            // get the Owner of the Company
            var ownerDto = new OwnerDto()
            {
                IsIdentityOrPassportConfirmed = owner.IsIdentityOrPassportConfirmed,
            };

            var criteria = NameValuePairDto.FromJson(application.MatchCriteriaJson).ToList();
            var appCriteriaDto = new ApplicationCriteriaDto(criteria, companyDto, ownerDto, _listItems, tenancyName);
            var creditScore = _creditScoreRepository.GetAll().Where(x => x.UserId == application.UserId).OrderBy(x => x.EnquiryDate).FirstOrDefault();
            
            #endregion

            #region Set integration properties

            request.Properties = new Dictionary<string, string>
            {
                { "email", user.EmailAddress }
            };

            if (!string.IsNullOrEmpty(company.Name))
                request.Properties.Add("company", company.Name);

            if (creditScore != null)
                request.Properties.Add("consumer_credit_score", creditScore.Score.ToString());

            if (appCriteriaDto.SeeksFundingAdvice != null)
            {
                var seeksFundingAdvice = appCriteriaDto.SeeksFundingAdvice.HasValue ? appCriteriaDto.SeeksFundingAdvice.Value.ToString().ToLower() : "";
                
                request.Properties.Add("seeks_funding_advice", seeksFundingAdvice);
            }
                       

            #endregion

            SendRequest(request);
        }

        private void HandleUserApplicationAbandoned(HubSpotEventTriggerDto request)
        {
            Logger.Info($"Handle HubSpot Event Trigger for User Application abandoned");

            var user = _userManager.GetUser(new Abp.UserIdentifier(request.TenantId, request.UserId.Value));

            if (user == null)
            {
                Logger.Error($"Failed to retrieve User by Id:{request.UserId.Value} for UserJourneyPoint: {request.UserJourneyPoint}");
                return;
            }

            request.Properties = new Dictionary<string, string>()
            {
                { "email", user.EmailAddress },
                { "application_abandoned", "true" }
            };

            // entity creation
            SendRequest(request);
        }

        private void HandleUserNewApplicationStarted(HubSpotEventTriggerDto request)
        {
            Logger.Info($"Handle HubSpot Event Trigger for User new Application started");

            var user = _userManager.GetUser(new Abp.UserIdentifier(request.TenantId, request.UserId.Value));

            if (user == null)
            {
                Logger.Error($"Failed to retrieve User by Id:{request.UserId.Value} for UserJourneyPoint: {request.UserJourneyPoint}");
                return;
            }

            request.Properties = new Dictionary<string, string>()
            {
                { "email", user.EmailAddress },
                { "application_abandoned", "false" }
            };

            // entity creation
            SendRequest(request);
        }

        private Match GetMatch(int? applicationId)
        {
            if (!applicationId.HasValue)
                return null;

            var match = _matchesRepository.FirstOrDefault(x => x.ApplicationId == applicationId);

            if (match == null)
            {
                Logger.Error($"Failed to retrieve Match for Application Id:{applicationId.Value}");
                return null;
            }

            return match;
        }

        private Application GetApplication(int? applicationId)
        {
            if (!applicationId.HasValue)
                return null;

            var application = _applicationRepo.Get(applicationId.Value);

            if (application == null)
            {
                Logger.Error($"Failed to retrieve Application by Id:{applicationId.Value}");
                return null;
            }

            return application;
        }

        private List<FinanceProduct> GetFinanceProducts(List<string> financeProductIds)
        {
            var financeProducts = new List<FinanceProduct>();

            foreach (var fp in financeProductIds)
            {
                if (string.IsNullOrEmpty(fp))
                    continue;

                var fpId = int.Parse(fp);
                var financeProduct = _financeProductRepository.FirstOrDefault(x => x.Id == fpId);

                if (financeProduct == null)
                {
                    using (CurrentUnitOfWork.SetTenantId(2))
                    {
                        financeProduct = _financeProductRepository.FirstOrDefault(x => x.Id == fpId);
                        
                        if(financeProduct == null)
                            Logger.Error($"Failed to find FinanceProduct.Id:{fpId}");
                        else
                            financeProducts.Add(financeProduct);
                    }
                }
                else
                    financeProducts.Add(financeProduct);
            }

            return financeProducts;
        }

        private void CreateDeal( HubSpotEventTriggerDto request, Application application, Match match, Lender lender, string financeProductsMatched, string tenancyName )
        {
            try
            {
                var textInfo = new CultureInfo("en-ZA", false).TextInfo;
                Logger.Info($"Handle HubSpotEvent Trigger for Create new Deal");

                #region Get the Company associated with the funder search
                var company = _smeCompaniesRepository.Get(application.SmeCompanyId);
                var companyDto = new SmeCompanyDto()
                {
                    Type = company.Type,
                    RegisteredAddress = company.RegisteredAddress,
                    StartedTradingDate = company.StartedTradingDate,
                    Industries = company.Industries,
                    BeeLevel = company.BeeLevel
                };
                #endregion

                #region Get the Owner 
                var owner = _ownerRepository.FirstOrDefault(x => x.UserId == company.UserId);
                var ownerDto = new OwnerDto()
                {
                    IsIdentityOrPassportConfirmed = owner.IsIdentityOrPassportConfirmed,
                };
                #endregion

                #region Set Deal Properties

                var criteria = NameValuePairDto.FromJson(application.MatchCriteriaJson).ToList();
                var appCriteriaDto = new ApplicationCriteriaDto(criteria, companyDto, ownerDto, _listItems, tenancyName);

                var dealname = textInfo.ToTitleCase(!string.IsNullOrEmpty(company.Name) ? company.Name.ToLower() : "");
                var loanAmount = appCriteriaDto.LoanAmount.ToString();
                var financeForListId = appCriteriaDto.FinanceForListId;
                var financeFor = _listItems.FirstOrDefault(x => x.ListId == financeForListId)?.Name;

                var tenantName = appCriteriaDto.TenancyName;
                var dealIdentifier = $"ApplicationId:{application.Id}-MatchId:{match.Id}-LenderId:{lender.Id}";

                Logger.Info($"Create new Deal with Identifier:{dealIdentifier}");

                #region FinanceForDetails 

                string financeForDetailsJson = string.Empty;
                // CashForAnInvoice
                if (appCriteriaDto.CashForAnInvoice != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.CashForAnInvoice);
                // MoneyForContract
                if (appCriteriaDto.MoneyForContract != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.MoneyForContract);
                // PurchaseOrderFunding
                if (appCriteriaDto.PurchaseOrderFunding != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.PurchaseOrderFunding);
                // MoneyForTender
                if (appCriteriaDto.MoneyForTender != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.MoneyForTender);
                // BuyingBusinessProperty
                if (appCriteriaDto.BuyingBusinessProperty != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.BuyingBusinessProperty);
                // ShopFittingRenovations
                if (appCriteriaDto.ShopFittingRenovations != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.ShopFittingRenovations);
                // PropertyDevelopment
                if (appCriteriaDto.PropertyDevelopment != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.PropertyDevelopment);
                // BusinessExpansion
                if (appCriteriaDto.BusinessExpansion != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.BusinessExpansion);
                // ProductServiceExpansion
                if (appCriteriaDto.ProductServiceExpansion != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.ProductServiceExpansion);
                // BuyingAFranchise
                if (appCriteriaDto.BuyingAFranchise != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.BuyingAFranchise);
                // PartnerManagementBuyOut
                if (appCriteriaDto.PartnerManagementBuyOut != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.PartnerManagementBuyOut);
                // BuyingABusiness
                if (appCriteriaDto.BuyingABusiness != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.BuyingABusiness);
                // BeePartner
                if (appCriteriaDto.BeePartner != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.BeePartner);
                // Export
                if (appCriteriaDto.Export != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.Export);
                // Import
                if (appCriteriaDto.Import != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.Import);
                // CommercialisingResearch
                if (appCriteriaDto.CommercialisingResearch != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.CommercialisingResearch);
                // BusinessProcessingServices
                if (appCriteriaDto.BusinessProcessingServices != null)
                    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.BusinessProcessingServices);

                //// PovertyAlleviation
                //if (appCriteriaDto.PovertyAlleviation != null)
                //    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.PovertyAlleviation);
                //// ResearchAndDevelopment
                //if (appCriteriaDto.ResearchAndDevelopment != null)
                //    financeForDetailsJson = JsonConvert.SerializeObject(appCriteriaDto.ResearchAndDevelopment);
                #endregion

                #region add deal properties

                request.Properties = new Dictionary<string, string>();

                if (!string.IsNullOrEmpty(dealname))
                    request.Properties.Add("dealname", dealname);

                if (!string.IsNullOrEmpty(lender.Name.TrimEnd()))
                    request.Properties.Add("lender_id", lender.Name.TrimEnd());

                if (!string.IsNullOrEmpty(financeProductsMatched.TrimEnd()))
                    request.Properties.Add("finance_product_matched", financeProductsMatched.TrimEnd());

                if (!string.IsNullOrEmpty(loanAmount))
                    request.Properties.Add("amount", loanAmount);

                if (!string.IsNullOrEmpty(financeFor))
                    request.Properties.Add("finance_for", financeFor);

                if (!string.IsNullOrEmpty(tenantName))
                    request.Properties.Add("origin", tenantName);

                if (!string.IsNullOrEmpty(financeForDetailsJson))
                    request.Properties.Add("finance_for_details", financeForDetailsJson.TrimEnd());

                if (!string.IsNullOrEmpty(dealIdentifier))
                    request.Properties.Add("finfind_deal_identifier", dealIdentifier);

                if (application.Locked.HasValue)
                    request.Properties.Add("createdate", DateTimeOffset.Parse(application.Locked.Value.ToString()).ToUnixTimeMilliseconds().ToString());

                request.Properties.Add("dealstage", "2444819");
                request.Properties.Add("pipeline", "default");
                request.Properties.Add("dealtype", "newbusiness");

                #endregion

                #endregion

                #region add dependencies
                request.DependencyTypes = new List<HubSpotDependencyDefinitionTypes>() {
                    HubSpotDependencyDefinitionTypes.DealToCompany,
                    HubSpotDependencyDefinitionTypes.DealToContact,
                    HubSpotDependencyDefinitionTypes.ContactToDeal
                };
                request.DependentEntities = new List<HubSpotEntityIdentifyingDto>
                {
                    new HubSpotEntityIdentifyingDto()
                    {
                        HSEntityType = HubSpotEntityTypes.deals,
                        NameValuePairs = new Dictionary<string, string>() { { "finfind_deal_identifier", dealIdentifier } }
                    },

                    new HubSpotEntityIdentifyingDto()
                    {
                        HSEntityType = HubSpotEntityTypes.companies,
                        NameValuePairs = new Dictionary<string, string>() { { "name", lender.Name.TrimEnd() } }
                    },

                    new HubSpotEntityIdentifyingDto()
                    {
                        HSEntityType = HubSpotEntityTypes.contacts,
                        NameValuePairs = new Dictionary<string, string>() { { "email", owner.EmailAddress } }
                    }
                };
                #endregion

                // queue entity creation
                SendRequest(request);
            }
            catch (Exception x)
            {
                Logger.Error($"Failed call to CreateDeal for Funder Search / Application.Id:{application.Id} Match.Id:{match.Id} Lender.Id:{lender.Id} with Exception.Message:{x.Message}");
            }
        }

        private void CreateSefaDeal(HubSpotEventTriggerDto request, Application application, string tenancyName)
        {
            var textInfo = new CultureInfo("en-ZA", false).TextInfo;

            Logger.Info($"Handle HubSpot event trigger for create new Sefa deal");

            try
            {
                #region Get the Company and Owner for the Finance Application

                var company = _smeCompaniesRepository.Get(application.SmeCompanyId);

                if(company == null)
                {
                    Logger.Error($"Application.Id:{application.Id} has no Company association");
                    return;
                }

                var companyDto = new SmeCompanyDto()
                {
                    Type = company.Type,
                    RegisteredAddress = company.RegisteredAddress,
                    StartedTradingDate = company.StartedTradingDate,
                    Industries = company.Industries,
                    BeeLevel = company.BeeLevel,
                    PropertiesJson = company.PropertiesJson
                };

                var owner = _ownerRepository.FirstOrDefault(x => x.UserId == company.UserId);

                if (owner == null)
                {
                    Logger.Error($"Application.Id:{application.Id} has no Owner association");
                    return;
                }

                var ownerDto = new OwnerDto()
                {
                    IsIdentityOrPassportConfirmed = owner.IsIdentityOrPassportConfirmed,
                    VerificationRecordJson = owner.VerificationRecordJson,
                    IdentityOrPassport = owner.IdentityOrPassport
                };

                #endregion

                #region Set Deal Properties

                var lender = _lenderRepository.GetAll().Where(x => x.Name == "Small Enterprise Finance Agency (Sefa)").FirstOrDefault();

                var dealname = textInfo.ToTitleCase(!string.IsNullOrEmpty(company.Name) ? company.Name.ToLower() : "");
                var dealIdentifier = $"ApplicationId:{application.Id}-MatchId:null-LenderId:{lender.Id}";

                Logger.Info($"Create new Deal with Identifier:{dealIdentifier}");

                dynamic appPropertiesJObj = JsonConvert.DeserializeObject<object>(application.PropertiesJson);

                request.Properties = new Dictionary<string, string>();

                if (!string.IsNullOrEmpty(tenancyName))
                    request.Properties.Add("origin", tenancyName);

                if (!string.IsNullOrEmpty(dealname))
                    request.Properties.Add("dealname", dealname);

                if (!string.IsNullOrEmpty(lender.Name.TrimEnd()))
                    request.Properties.Add("lender_id", lender.Name.TrimEnd());

                if (!string.IsNullOrEmpty(dealIdentifier))
                    request.Properties.Add("finfind_deal_identifier", dealIdentifier);

                if (appPropertiesJObj["match-criteria"] != null)
                    request.Properties.Add("amount", (string)appPropertiesJObj["match-criteria"]["input-mandate-fit-loan-amount"]);

                if (appPropertiesJObj["program-product-fit"] != null)
                    request.Properties.Add("finance_for", (string)appPropertiesJObj["program-product-fit"]["Name"]);

                if (application.Locked.HasValue)
                    request.Properties.Add("createdate", DateTimeOffset.Parse(application.Locked.Value.ToString()).ToUnixTimeMilliseconds().ToString());

                request.Properties.Add("dealstage", "2444819");
                request.Properties.Add("pipeline", "default");
                request.Properties.Add("dealtype", "newbusiness");

                #endregion
                
                #region Add dependencies

                request.DependencyTypes = new List<HubSpotDependencyDefinitionTypes>() {
                    HubSpotDependencyDefinitionTypes.DealToCompany,
                    HubSpotDependencyDefinitionTypes.DealToContact,
                    HubSpotDependencyDefinitionTypes.ContactToDeal
                };
                request.DependentEntities = new List<HubSpotEntityIdentifyingDto>
                {
                    new HubSpotEntityIdentifyingDto()
                    {
                        HSEntityType = HubSpotEntityTypes.deals,
                        NameValuePairs = new Dictionary<string, string>() { { "finfind_deal_identifier", dealIdentifier } }
                    },

                    new HubSpotEntityIdentifyingDto()
                    {
                        HSEntityType = HubSpotEntityTypes.companies,
                        NameValuePairs = new Dictionary<string, string>() { { "name", lender.Name.TrimEnd() } }
                    },

                    new HubSpotEntityIdentifyingDto()
                    {
                        HSEntityType = HubSpotEntityTypes.contacts,
                        NameValuePairs = new Dictionary<string, string>() { { "email", owner.EmailAddress } }
                    }
                };

                #endregion

                // queue entity creation
                SendRequest(request);
            }
            catch (Exception x)
            {
                Logger.Error($"Failed call to CreateSefaDeal for Finance Application.Id: {application.Id} with Exception.Message:{x.Message}");
            }
        }

		private void CreateECDCDeal(
			HubSpotEventTriggerDto request, 
			Application application, 
			string tenancyName
		)
		{
			var textInfo = new CultureInfo("en-ZA", false).TextInfo;

			Logger.Info($"Handle HubSpot event trigger for create new ECDC deal");

			try
			{
				#region Get the Company and Owner for the Finance Application

				var company = _smeCompaniesRepository.Get(application.SmeCompanyId);

				if(company == null)
				{
					Logger.Error($"Application.Id:{application.Id} has no Company association");
					return;
				}

				var startedTradingDate = DateTime.Now;
				// Default to Don't know.
				var beeLevel = "5af2800e7fbbb21e6817bc42";
				string loanAmount = "";
				string productGuid = "";
				JArray array = JArray.Parse(application.MatchCriteriaJson);
				foreach(JObject obj in array.Children<JObject>())
				{
					var props = obj.Properties();
					var e = props.GetEnumerator();
					e.MoveNext();
					string name = e.Current.Value.ToString();
					e.MoveNext();
					string value = e.Current.Value.ToString();
					if(name == "date-started-trading-date")
					{
						string[] subs = value.Split('/');
						int[] date = new int[] { Int32.Parse(subs[2]), Int32.Parse(subs[1]), Int32.Parse(subs[0]) };
						startedTradingDate = new DateTime(date[0], date[1], date[2]);
					}
					if(name == "select-company-profile-bee-level")
					{
						beeLevel = value;
					}
					if(name == "input-loan-amount")
					{
						loanAmount = value;
					}
					if(name == "input-product-guid")
					{
						productGuid = value;
					}
				}

				dynamic appPropertiesJObj = JsonConvert.DeserializeObject<object>(application.MatchCriteriaJson);

				var companyDto = new SmeCompanyDto()
				{
					Type = company.Type,
					RegisteredAddress = company.RegisteredAddress,
					StartedTradingDate = startedTradingDate,
					Industries = company.Industries,
					BeeLevel = beeLevel,
					PropertiesJson = company.PropertiesJson
				};

				var owner = _ownerRepository.FirstOrDefault(x => x.UserId == company.UserId);

				if(owner == null)
				{
					Logger.Error($"Application.Id:{application.Id} has no Owner association");
					return;
				}

				var ownerDto = new OwnerDto()
				{
					IsIdentityOrPassportConfirmed = owner.IsIdentityOrPassportConfirmed,
					VerificationRecordJson = owner.VerificationRecordJson,
					IdentityOrPassport = owner.IdentityOrPassport
				};

				#endregion

				#region Set Deal Properties

				// TODO: Which name is this supposed to be for ECDC???
				var lender = _lenderRepository.GetAll().Where(x => x.Name == "Eastern Cape Development Corporation (ECDC)").FirstOrDefault();

				var dealname = textInfo.ToTitleCase(!string.IsNullOrEmpty(company.Name) ? company.Name.ToLower() : "");
				var dealIdentifier = $"ApplicationId:{application.Id}-MatchId:null-LenderId:{lender.Id}";

				Logger.Info($"Create new Deal with Identifier:{dealIdentifier}");

				request.Properties = new Dictionary<string, string>();

				if(!string.IsNullOrEmpty(tenancyName))
					request.Properties.Add("origin", tenancyName);

				if(!string.IsNullOrEmpty(dealname))
					request.Properties.Add("dealname", dealname);

				if(!string.IsNullOrEmpty(lender.Name.TrimEnd()))
					request.Properties.Add("lender_id", lender.Name.TrimEnd());

				if(!string.IsNullOrEmpty(dealIdentifier))
					request.Properties.Add("finfind_deal_identifier", dealIdentifier);

				if(appPropertiesJObj != null)
				{
					request.Properties.Add("amount", loanAmount);
				}
				if(appPropertiesJObj != null)
				{
					request.Properties.Add("finance_for", productGuid);
				}
				if(application.Locked.HasValue)
				{
					request.Properties.Add("createdate", DateTimeOffset.Parse(application.Locked.Value.ToString()).ToUnixTimeMilliseconds().ToString());
				}

				request.Properties.Add("dealstage", "2444819");
				request.Properties.Add("pipeline", "default");
				request.Properties.Add("dealtype", "newbusiness");

				#endregion

				#region Add dependencies

				request.DependencyTypes = new List<HubSpotDependencyDefinitionTypes>() {
					HubSpotDependencyDefinitionTypes.DealToCompany,
					HubSpotDependencyDefinitionTypes.DealToContact,
					HubSpotDependencyDefinitionTypes.ContactToDeal
				};
				request.DependentEntities = new List<HubSpotEntityIdentifyingDto>
				{
					new HubSpotEntityIdentifyingDto()
					{
						HSEntityType = HubSpotEntityTypes.deals,
						// TODO: findind_deal_identifier???
						NameValuePairs = new Dictionary<string, string>() { { "finfind_deal_identifier", dealIdentifier } }
					},

					new HubSpotEntityIdentifyingDto()
					{
						HSEntityType = HubSpotEntityTypes.companies,
						NameValuePairs = new Dictionary<string, string>() { { "name", lender.Name.TrimEnd() } }
					},

					new HubSpotEntityIdentifyingDto()
					{
						HSEntityType = HubSpotEntityTypes.contacts,
						NameValuePairs = new Dictionary<string, string>() { { "email", owner.EmailAddress } }
					}
				};

				#endregion

				// queue entity creation
				SendRequest(request);
			}
			catch(Exception x)
			{
				Logger.Error($"Failed call to CreateECDCDeal for Finance Application.Id: {application.Id} with Exception.Message:{x.Message}");
			}
		}


		#endregion

		#region DEPRECATED - Subscriptions

		private void HandleSubscriptionExpired(HubSpotEventTriggerDto request)
        {
            Logger.Info($"Handle HubSpotEvent Trigger for Subscription Expired");

            var company = _smeCompaniesRepository.FirstOrDefault(x => x.Id == request.SmeCompanyId.Value);
            var owner = _ownerRepository.FirstOrDefault(x => x.Id == request.OwnerId.Value);

            if (company == null || owner == null)
            {
                Logger.Error($"Failed to retrieve Company Id:{request.SmeCompanyId.Value} and Owner Id:{request.OwnerId} for UserJourneyPoint: {request.UserJourneyPoint}");
                return;
            }

            request.Properties = new Dictionary<string, string>();

            // used to identify the company
            if (!string.IsNullOrEmpty(company.Name))
                request.Properties.Add("name", company.Name);

            request.Properties.Add("sme_company_id", company.Id.ToString());

            // set the Company Subscription to Paid
            request.Properties.Add("subscription", "Expired");

            // queue entity creation
            SendRequest(request);

        }

        private void HandleSubscriptionCancel(HubSpotEventTriggerDto request)
        {
            Logger.Info($"Handle HubSpotEvent Trigger for Subscription Cancelled");

            var company = _smeCompaniesRepository.FirstOrDefault(x => x.Id == request.SmeCompanyId.Value);
            var owner = _ownerRepository.FirstOrDefault(x => x.Id == request.OwnerId.Value);

            if (company == null || owner == null)
            {
                Logger.Error($"Failed to retrieve Company Id:{request.SmeCompanyId.Value} and Owner Id:{request.OwnerId} for UserJourneyPoint: {request.UserJourneyPoint}");
                return;
            }

            request.Properties = new Dictionary<string, string>();

            // used to identify the company
            if (!string.IsNullOrEmpty(company.Name))
                request.Properties.Add("name", company.Name);

            request.Properties.Add("sme_company_id", company.Id.ToString());

            // set the Company Subscription to Paid
            request.Properties.Add("subscription", "Cancelled");

            // queue entity creation
            SendRequest(request);

        }

        private void HandleSubscriptionUpgrade(HubSpotEventTriggerDto request)
        {
            Logger.Info($"Handle HubSpotEvent Trigger for Subscription Upgrade");

            var company = _smeCompaniesRepository.FirstOrDefault(x => x.Id == request.SmeCompanyId.Value);
            var owner = _ownerRepository.FirstOrDefault(x => x.Id == request.OwnerId.Value);

            if (company == null || owner == null)
            {
                Logger.Error($"Failed to retrieve Company Id:{request.SmeCompanyId.Value} and Owner Id:{request.OwnerId} for UserJourneyPoint: {request.UserJourneyPoint}");
                return;
            }

            var subscription = _smeSubscriptionsAppServiceExt.GetCompanySmeSubscriptionById(company.Id).Result;

            request.Properties = new Dictionary<string, string>();

            // used to identify the company
            if (!string.IsNullOrEmpty(company.Name))
                request.Properties.Add("name", company.Name);

            request.Properties.Add("sme_company_id", company.Id.ToString());

            // set the Company Subscription to Paid
            request.Properties.Add("subscription", "Paid");

            if (subscription != null)
                if (subscription.EditionFk != null && subscription.EditionFk.OnceOffPrice != null)
                    request.Properties.Add("subscription_cost", subscription.EditionFk.OnceOffPrice.ToString());

            // queue entity creation
            SendRequest(request);

        }

        private void QueueRequest(HubSpotEventTriggerDto request, string queueName = "hubspot-create-edit-entity")
        {
            // if the properties could not be retrieved do not queue the message
            if (request.Properties == null || request.Properties.Count == 0)
                return;

            var payLoad = JsonConvert.SerializeObject(request);
            var azureStorageAccount = _appConfiguration["ConnectionStrings:AzureStorageAccount"];

            AsyncHelper.RunSync(() => AzureStorageHelpers.SendMessageAsync(azureStorageAccount, queueName, payLoad));

            Logger.Debug($"Azure Storage Queue 'hubspot-create-edit-entity' item added with payload '{payLoad}'");
        }

        #endregion

    }
}
