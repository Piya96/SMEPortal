using Abp.AspNetCore.Mvc.Authorization;
using Abp.BackgroundJobs;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using PayFast;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Common.Dto;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using SME.Portal.Configuration;
using SME.Portal.Editions;
using SME.Portal.Editions.Dto;
using SME.Portal.Helpers;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.List;
using SME.Portal.List.Dtos;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.PayFast;
using SME.Portal.PayFast.Dtos;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.SME;
using SME.Portal.SME.Dtos;
using SME.Portal.SME.Subscriptions;
using SME.Portal.Timing;
using SME.Portal.Timing.Dto;
using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.Web.Areas.App.Models.SmeSubscription;
using SME.Portal.Web.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize]
    public class SmeSubscriptionController : PortalControllerBase
    {
        private readonly IConfigurationRoot _appConfiguration;
        private readonly IProfileAppService _profileAppService;
        private readonly ITimingAppService _timingAppService;
        private readonly EditionManager _editionManager;
        private readonly PaymentAppServiceExt _paymentAppServiceExt;
        private readonly IPayFastAppService _payFastAppService;
        private readonly SmeCompaniesAppServiceExt _smeCompaniesAppServiceExt;
        private readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;
        private readonly ApplicationAppServiceExt _applicationsAppServiceExt;
        private readonly IBackgroundJobManager _backgroundJobManager;
        private readonly string _azureStorageAccount;
        private readonly IRepository<ListItem, int> _listRepository;
        private readonly ITenantCache _tenantCache;
        private readonly OwnersAppServiceExt _ownersAppServiceExt;

        public SmeSubscriptionController( IProfileAppService profileAppService,
                                          ITimingAppService timingAppService,
                                          IPayFastAppService payFastAppService,
                                          EditionManager editionManager,
                                          PaymentAppServiceExt paymentAppServiceExt, 
                                          SmeCompaniesAppServiceExt smeCompaniesAppServiceExt,
                                          SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt,
                                          ApplicationAppServiceExt applicationsAppServiceExt,
                                          IAppConfigurationAccessor configurationAccessor,
                                          IBackgroundJobManager backgroundJobManager,
                                          IRepository<ListItem, int> listRepository,
                                          ITenantCache tenantCache,
                                          OwnersAppServiceExt ownersAppServiceExt)
        {
            _appConfiguration = configurationAccessor.Configuration;
            _editionManager = editionManager;
            _profileAppService = profileAppService;
            _timingAppService = timingAppService;
            _paymentAppServiceExt = paymentAppServiceExt;
            _payFastAppService = payFastAppService;
            _smeCompaniesAppServiceExt = smeCompaniesAppServiceExt;
            _smeSubscriptionsAppServiceExt = smeSubscriptionsAppServiceExt;
            _applicationsAppServiceExt = applicationsAppServiceExt;
            _backgroundJobManager = backgroundJobManager;
            _azureStorageAccount = _appConfiguration["ConnectionStrings:AzureStorageAccount"];
            _listRepository = listRepository;
            _tenantCache = tenantCache;
            _ownersAppServiceExt = ownersAppServiceExt;
        }

        private async Task<MySettingsViewModel> GetMySettings()
        {
            var output = await _profileAppService.GetCurrentUserProfileForEdit();
            var mySettingsViewModel = ObjectMapper.Map<MySettingsViewModel>(output);

            mySettingsViewModel.TimezoneItems = await _timingAppService.GetTimezoneComboboxItems(new GetTimezoneComboboxItemsInput
            {
                DefaultTimezoneScope = SettingScopes.User,
                SelectedTimezoneId = output.Timezone
            });

            mySettingsViewModel.SmsVerificationEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.SmsVerificationEnabled);

            return mySettingsViewModel;
        }

        public async Task<IActionResult> Index()
        {
            var mySettings = await GetMySettings();
            var hasApplications = _applicationsAppServiceExt.HasApplications().Data;

            if (!mySettings.IsOnboarded)
                return RedirectToAction("Index", "SME", new { userMessage = L("PleaseCompleteProfileInformationToContinue") });

            var companySmeSubscriptions = new Dictionary<int, SmeSubscriptionDto>();
            var companiesDtoList = await _smeCompaniesAppServiceExt.GetSmeCompaniesForViewByUser();
            var companies = new List<SmeCompanyDto>();

            foreach (var company in companiesDtoList)
            {
                companies.Add(company.SmeCompany);

                // get company subscriptions
                var smeSubscription = await _smeSubscriptionsAppServiceExt.GetCompanySmeSubscription(company.SmeCompany);
                // add to collection
                companySmeSubscriptions.Add(company.SmeCompany.Id, smeSubscription);

            }

            var payments = await _paymentAppServiceExt.GetPaymentsForUser(SubscriptionPaymentStatus.Paid);

            return View(new SmeSubscriptionsViewModel() { 
                Companies = companies,
                Payments = payments,
                CompanySmeSubscriptions = companySmeSubscriptions
            });
        }

        public async Task<IActionResult> Pricing(string cId)
        {
            if (string.IsNullOrEmpty(cId))
                throw new ArgumentException("Company.Id cannot be null", "cId");

            var companyId = Convert.ToInt32(SimpleStringCipher.Instance.Decrypt(cId));

            var mySettings = await GetMySettings();
            var applications = await _applicationsAppServiceExt.GetAllForUserId(AbpSession.UserId.Value);

            if (!mySettings.IsOnboarded)
                return RedirectToAction("Index", "SME", new { userMessage = L("PleaseCompleteProfileInformationToContinue") });

            if(applications.Items.Count == 0)
                return RedirectToAction("Index", "SME", new { userMessage = L("PleasePressStartFunderSearchButton") });

            var company = await _smeCompaniesAppServiceExt.GetSmeCompanyForView(companyId);
            var owner = await _ownersAppServiceExt.GetOwnerForViewByUser();
            var listItemsSet = _listRepository.GetAll().ToList();
            var listItems = new List<ListItemDto>();
            foreach (var o in listItemsSet)
                listItems.Add(ObjectMapper.Map<ListItemDto>(o));
            var editions = await _editionManager.GetAllAsync();

            // free edition
            var freeEdition = editions.FirstOrDefault(x => x.DisplayName.Contains("Free"));
            var free = ObjectMapper.Map<EditionSelectDto>(freeEdition);

            // paid editions list
            var paidEditions = editions.Where(x => x.DisplayName.Contains("Paid")).ToList();

            #region BUSINESS RULE: determine edition for upgrade based on turnover, is profitable and trading months
            // Paid Product 1 criteria
            // - Annual Turnover > R500k
            // - Trading months > 6
            // - Is Profitable true
            // Paid Product 2 criteria
            // - Annual Turnover > R500k
            // - Trading months > 6
            // - Is Profitable false

            var latestApplication = applications.Items.OrderByDescending(x => x.Application.Created).FirstOrDefault();
            var application = latestApplication.Application;
            // Application/Funder Search Criteria DTO
            var tenancyName = string.Empty;

            if (AbpSession.TenantId.HasValue)
             tenancyName = _tenantCache.GetOrNull(AbpSession.TenantId.Value)?.TenancyName;

            var criteria = NameValuePairDto.FromJson(application.MatchCriteriaJson).ToList();
            var appCriteriaDto = new ApplicationCriteriaDto(criteria, company.SmeCompany, owner.Owner, listItems, tenancyName);
            EditionSelectDto edition = null;
            
            // annual turnover over R500k and months trading > 6 months
            if(appCriteriaDto.AverageAnnualTurnoverMax >= 500000 && appCriteriaDto.MonthsTrading >= 6)
            {
                // is profitable
                if(appCriteriaDto.IsProfitable.HasValue && appCriteriaDto.IsProfitable.Value)
                {
                    edition = ObjectMapper.Map<EditionSelectDto>(paidEditions.FirstOrDefault(x=> x.DisplayName == "Paid"));
                }
                // not profitable
                else
                {
                    edition = ObjectMapper.Map<EditionSelectDto>(paidEditions.FirstOrDefault(x => x.DisplayName == "Paid Product 2"));
                }
            } 
            // if annual turnover < R500k OR months trading <=6 months and finance for matches criteria
            else if (appCriteriaDto.AverageAnnualTurnoverMax < 500000 || appCriteriaDto.MonthsTrading < 6)
            {
                var financeForSubListId = appCriteriaDto.FinanceForSubListId;

                if (financeForSubListId == "59cc9d26132f4c40c446a4f7" ||        // Cash advance for an invoice
                    financeForSubListId == "59cca8a430e9df02c82d0795" ||        // Money to help with a contract
                    financeForSubListId == "59cca89030e9df02c82d0794" ||        // Money to help with a tender
                    financeForSubListId == "5b213996b958c008605883e8" ||        // Purchase order funding
                    financeForSubListId == "59d26a1620070a604097b04d" ||        // Funding to buy an existing business
                    financeForSubListId == "59d26a5320070a604097b051" ||        // Funding for green initiatives
                    financeForSubListId == "5acb467062ba593724e0a78a" ||        // Cash for retailers with a card machine
                    financeForSubListId == "59d26a4820070a604097b050")          // Tech innovation
                {
                    edition = ObjectMapper.Map<EditionSelectDto>(paidEditions.FirstOrDefault(x => x.DisplayName == "Paid Product 3"));
                }
            }
            #endregion

            return View(new PricingViewModel()
            {
                Free = free,
                Paid = edition,
                Company = company?.SmeCompany
            });
        }

        public async Task<IActionResult> CancelSubscription(string externalToken)
        {
            await _payFastAppService.CancelSubscription(externalToken);

            var payFastContractState = await _payFastAppService.FetchSubscription(externalToken);

            return View(new SubscriptionCancelledViewModel(payFastContractState));
        }

        [HttpPost]
        public async Task<IActionResult> Monthly(int upgradeEditionId, int companyId)
        {
            var ownerCompanyMap = _smeCompaniesAppServiceExt.GetOwnerCompanyMapForView(companyId, AbpSession.UserId.Value, true);
            var subscriptionEditionDto = ObjectMapper.Map<EditionSelectDto>(await _editionManager.GetByIdAsync(upgradeEditionId));

            var amount = (decimal)subscriptionEditionDto.MonthlyPrice;

            // generate payment redirect url
            return Redirect(await GenerateRedirect( ownerCompanyMapId: ownerCompanyMap.Id,                                       // Owner Company
                                                    upgradeEditionId,                                                            // EditionId 
                                                    BillingFrequency.Monthly,                                                    // Monthly
                                                    billingDate: DateTime.Now.AddMonths(1),                                      // Bill again next month
                                                    cycles: 12,                                                                  // 12 cycles
                                                    amount: (double)amount,                                                      // Amount to charge plus VAT
                                                    itemName: subscriptionEditionDto.DisplayName,                                // Item name on charge
                                                    true));                                                                      // Send confirmation email
        }

        [HttpPost]
        public async Task<IActionResult> Annual(int upgradeEditionId, int companyId)
        {
            var ownerCompanyMap = _smeCompaniesAppServiceExt.GetOwnerCompanyMapForView(companyId, AbpSession.UserId.Value, true);
            var subscriptionEditionDto = ObjectMapper.Map<EditionSelectDto>(await _editionManager.GetByIdAsync(upgradeEditionId));
            var amount = (decimal)subscriptionEditionDto.AnnualPrice;

            // generate payment redirect url
            return Redirect(await GenerateRedirect( ownerCompanyMapId: ownerCompanyMap.Id,                                       // Owner Company
                                                    upgradeEditionId,                                                            // EditionId 
                                                    BillingFrequency.Annual,                                                     // Annually
                                                    billingDate: DateTime.Now.AddYears(1),                                       // Bill again in a years time
                                                    cycles: 1,                                                                   // Once
                                                    amount: (double)amount,                                                      // Amount to charge plus VAT
                                                    itemName: subscriptionEditionDto.DisplayName,                                // Item name on charge
                                                    true));                                                                      // Send confirmation email
        }

        public async Task<IActionResult> Adhoc(int upgradeEditionId, int companyId)
        {
            var ownerCompanyMap = _smeCompaniesAppServiceExt.GetOwnerCompanyMapForView(companyId, AbpSession.UserId.Value, true);
            var subscriptionEditionDto = ObjectMapper.Map<EditionSelectDto>(await _editionManager.GetByIdAsync(upgradeEditionId));

            // generate payment redirect url
            return Redirect(await GenerateAdhocPaymentRedirect( ownerCompanyMapId: ownerCompanyMap.Id,                           // Owner Company
                                                                upgradeEditionId,                                                // EditionId 
                                                                amount: (double)(subscriptionEditionDto.OnceOffPrice),           // Amount to charge plus VAT
                                                                itemName: subscriptionEditionDto.DisplayName,                    // Item name on charge
                                                                true));                                                          // Send confirmation email
        }


        private async Task<string> GenerateRedirect( int ownerCompanyMapId, 
                                                     int upgradeEditionId, 
                                                     BillingFrequency billingFrequency, 
                                                     DateTime billingDate, 
                                                     int? cycles, 
                                                     double amount, 
                                                     string itemName,
                                                     bool sendConfirmationEmail = false)
        {
            var mySettingsVm = await GetMySettings();
            
            var itemDescription = L("ServiceItemDescription", billingFrequency.ToString(), itemName);

            var paymentRedirectDto = new PaymentRedirectDto()
            {
                PaymentId = $"{ownerCompanyMapId}_{upgradeEditionId}_{(int)billingFrequency}",
                BillingDate = billingDate,
                Cycles = cycles,
                BuyerEmail = mySettingsVm.EmailAddress,
                BuyerName = mySettingsVm.Name,
                BuyerSurname = mySettingsVm.Surname,
                TransactionAmount = Math.Round(amount, 2),
                Amount = Math.Round(amount, 2),
                Frequency = (int)billingFrequency,
                SubscriptionType = (int)SubscriptionType.Subscription,
                ItemName = itemDescription,
                ItemDescription = itemDescription,
                EmailConfirmation = sendConfirmationEmail,
                ConfirmationEmailAddress = "accounts@finfind.co.za"
            };

            return _payFastAppService.GetPaymentRedirectUrl(paymentRedirectDto, AbpSession.TenantId.Value);
        }

        private async Task<string> GenerateAdhocPaymentRedirect( int ownerCompanyMapId,
                                                                 int upgradeEditionId,
                                                                 double amount,
                                                                 string itemName,
                                                                 bool sendConfirmationEmail = false)
        {
            var mySettingsVm = await GetMySettings();

            var itemDescription = L("ServiceItemAdhocDescription", itemName);

            var paymentRedirectDto = new PaymentRedirectDto()
            {
                // the "0" is for single adhoc payment
                PaymentId = $"{ownerCompanyMapId}_{upgradeEditionId}_{(int)PaymentPeriodType.OnceOff}",
                BuyerEmail = mySettingsVm.EmailAddress,
                BuyerName = mySettingsVm.Name,
                BuyerSurname = mySettingsVm.Surname,
                TransactionAmount = Math.Round(amount, 2),
                Amount = Math.Round(amount, 2),
                ItemName = itemDescription,
                ItemDescription = itemDescription,
                EmailConfirmation = sendConfirmationEmail,
                ConfirmationEmailAddress = "accounts@finfind.co.za"
            };

            return _payFastAppService.GetPaymentRedirectUrl(paymentRedirectDto, AbpSession.TenantId.Value);
        }



        [AllowAnonymous]
        public IActionResult PaymentSuccess()
        {
            return View();
        }

        [AllowAnonymous]
        public IActionResult PaymentCancel()
        {
            return View();
        }

        [AllowAnonymous]
        public async Task<IActionResult> PaymentNotify(PayFastNotify notifyReq)
        {
            // send the notify request to azure storage queue
            await AzureStorageHelpers.SendMessageAsync(_azureStorageAccount, "payfast-notify-requests", JsonConvert.SerializeObject(notifyReq));

            // Handle the notify request from the PayFast gateway
            await _payFastAppService.NotifyHandler(notifyReq);

            // render view
            return View();
        }

        public IActionResult FreeTier()
        {
            return View();
        }

        public IActionResult PaidTier()
        {
            return View();
        }

    }
}
