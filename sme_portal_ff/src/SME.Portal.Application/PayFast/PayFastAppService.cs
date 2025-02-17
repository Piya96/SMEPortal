using Abp.BackgroundJobs;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.Threading;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using PayFast;
using PayFast.ApiTypes;
using SME.Portal.Company;
using SME.Portal.Configuration;
using SME.Portal.Editions;
using SME.Portal.Editions.Dto;
using SME.Portal.Helpers;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.MultiTenancy.Payments.Dto;
using SME.Portal.PayFast.Dtos;
using SME.Portal.Sme.Subscriptions;
using SME.Portal.SME.Dtos.PayFast;
using SME.Portal.Url;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.PayFast
{
    public class PayFastAppService : PortalAppServiceBase, IPayFastAppService
    {
        private readonly IConfigurationRoot _appConfiguration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        private readonly IWebUrlService _webUrlService;
        private readonly IBackgroundJobManager _backgroundJobManager;
        private readonly PaymentAppServiceExt _paymentAppServiceExt;
        private readonly IRepository<OwnerCompanyMap, int> _ownerCompanyMapRepo;
        private readonly EditionManager _editionManager;
        private readonly ISubscriptionPaymentRepository _subscriptionPaymentRepository;
        private readonly IRepository<SmeSubscription, int> _smeSubscriptionRepo;
        private readonly ITenantCache _tenantCache;
        private PayFastSettings _payFastSettings;

        public PayFastAppService( IAppConfigurationAccessor configurationAccessor, 
                                  IHttpContextAccessor httpContextAccessor, 
                                  IWebUrlService webUrlService, 
                                  IBackgroundJobManager backgroundJobManager,
                                  PaymentAppServiceExt paymentAppServiceExt,
                                  IRepository<OwnerCompanyMap, int> ownerCompanyMapRepo,
                                  EditionManager editionManager,
                                  ISubscriptionPaymentRepository subscriptionPaymentRepository,
                                  IRepository<SmeSubscription, int> smeSubscriptionRepo,
                                  ITenantCache tenantCache)
        {
            _appConfiguration = configurationAccessor.Configuration;
            _webUrlService = webUrlService;
            _httpContextAccessor = httpContextAccessor;
            _backgroundJobManager = backgroundJobManager;
            _paymentAppServiceExt = paymentAppServiceExt;
            _ownerCompanyMapRepo = ownerCompanyMapRepo;
            _editionManager = editionManager;
            _subscriptionPaymentRepository = subscriptionPaymentRepository;
            _smeSubscriptionRepo = smeSubscriptionRepo;
            _tenantCache = tenantCache;
    
            // initialize the PayFastSettings object with a base site url
            InitPayFastSettings(_webUrlService.GetSiteRootAddress().EnsureEndsWith('/'));
            
        }

        private void InitPayFastSettings(string baseUrl)
        {
            _payFastSettings = new PayFastSettings
            {
                MerchantId = _appConfiguration["Payment:PayFast:MerchantId"],
                MerchantKey = _appConfiguration["Payment:PayFast:MerchantKey"],
                PassPhrase = _appConfiguration["Payment:PayFast:SecurityPassphrase"],
                ProcessUrl = _appConfiguration["Payment:PayFast:PaymentUrl"],
                ValidateUrl = _appConfiguration["Payment:PayFast:ValidateUrl"],
                ReturnUrl = $"{baseUrl}App/SmeSubscription/PaymentSuccess",
                CancelUrl = $"{baseUrl}App/SmeSubscription/PaymentCancel",
                NotifyUrl = $"{baseUrl}App/SmeSubscription/PaymentNotify"
            };
        }

        public async Task<IActionResult> NotifyHandler(PayFastNotify notifyReq)
        {
            #region PayFast validation checks

            // ensure pass phrase is set
            notifyReq.SetPassPhrase(_payFastSettings.PassPhrase);

            // check signature
            var isValid = notifyReq.signature == notifyReq.GetCalculatedSignature();

            if (!isValid)
                throw new SystemException("PayFast Notify Request Validation failed - Signature invalid");

            // determine remote calling ip address
            var remoteIp = _httpContextAccessor.HttpContext.Request.HttpContext.Connection.RemoteIpAddress;

            // Its not recommended to rely on this for production use cases
            var payfastValidator = new PayFastValidator(_payFastSettings, notifyReq, remoteIp);

            if (!payfastValidator.ValidateMerchantId())
                throw new SystemException("PayFast Notify Request Validation failed - Merchant Id invalid");

            if (!await payfastValidator.ValidateSourceIp())
                throw new SystemException("PayFast Notify Request Validation failed - Source IP invalid");

            #endregion

            #region Handle Notify Response - new 

            GetCompanyAndPaymentIds(notifyReq, out int companyId, out int tenantId, out int ownerCompanyMapId, out int upgradeEditionId, out int frequency);

            var ownerCompanyMap = _ownerCompanyMapRepo.Get(ownerCompanyMapId);
            var subscriptionEdition = await _editionManager.GetByIdAsync(upgradeEditionId);
            var subscriptionEditionDto = ObjectMapper.Map<EditionSelectDto>(subscriptionEdition);
            var smeSubscription = _smeSubscriptionRepo.GetAll().FirstOrDefault(x => x.OwnerCompanyMapId == ownerCompanyMapId);

            var tenancyName = _tenantCache.GetOrNull(tenantId)?.TenancyName;

            if (!string.IsNullOrEmpty(tenancyName))
            {
                var baseUrl = _webUrlService.GetSiteRootAddress(tenancyName).EnsureEndsWith('/');
                // initialize the PayFastSettings object with a base site url
                InitPayFastSettings(baseUrl);
            }

            var payment = _subscriptionPaymentRepository.FirstOrDefault(x => x.ExternalPaymentId == notifyReq.pf_payment_id);
            
            // create if not exists
            if (payment == null)
            {
                payment = new SubscriptionPayment
                {
                    Description = _paymentAppServiceExt.GetPaymentDescription(EditionPaymentType.NewRegistration, PaymentPeriodType.Monthly, subscriptionEdition.DisplayName, true),
                    PaymentPeriodType = (PaymentPeriodType)frequency,
                    EditionId = upgradeEditionId,
                    TenantId = ownerCompanyMap.TenantId,
                    UserId = ownerCompanyMap.UserId,
                    Gateway = SubscriptionPaymentGatewayType.PayFast,
                    Amount = decimal.Parse(notifyReq.amount_gross),
                    DayCount = frequency,
                    IsRecurring = false,
                    SuccessUrl = _payFastSettings.ReturnUrl,
                    ErrorUrl = _payFastSettings.CancelUrl,
                    EditionPaymentType = EditionPaymentType.NewRegistration,
                    ExternalPaymentId = notifyReq.pf_payment_id,
                    InvoiceNo = string.Empty,
                    SmeSubscriptionId = smeSubscription.Id
                };
            }

            if (notifyReq.payment_status == PayFastStatics.CompletePaymentConfirmation)
            {
                // update the Company SmeSubscription
                smeSubscription.EditionId = upgradeEditionId;
                smeSubscription.StartDate = DateTime.Now;

                if (smeSubscription.ExpiryDate == null)
                {
                    if((PaymentPeriodType)frequency == PaymentPeriodType.Monthly)
                        smeSubscription.ExpiryDate = DateTime.Parse(notifyReq.billing_date).AddMonths(1);
                    if ((PaymentPeriodType)frequency == PaymentPeriodType.Annual)
                        smeSubscription.ExpiryDate = DateTime.Parse(notifyReq.billing_date).AddYears(1);
                    if ((PaymentPeriodType)frequency == PaymentPeriodType.OnceOff)
                        smeSubscription.ExpiryDate = smeSubscription.StartDate.AddDays((int)PaymentPeriodType.OnceOff);
                }
                
                if(!string.IsNullOrEmpty(notifyReq.billing_date))
                    smeSubscription.NextBillingDate = DateTime.Parse(notifyReq.billing_date);
                
                smeSubscription.Status = SmeSubscriptionStatus.Active.ToString();
                // commit update
                _smeSubscriptionRepo.Update(smeSubscription);

                Logger.Info($"SmeSubscription upgraded to {payment.Description}");

                // payment complete
                payment.SetAsPaid();
                payment.ExternalPaymentToken = notifyReq.token;
                
                Logger.Info($"PayFast Notify handled for Completed Payment. ExternalPaymentId:{notifyReq.pf_payment_id}");
            }

            if (notifyReq.payment_status == PayFastStatics.CancelledPaymentConfirmation)
            {
                // payment cancelled
                payment.SetAsCancelled();

                Logger.Info($"PayFast Notify handled for Cancelled Payment. ExternalPaymentId:{notifyReq.pf_payment_id}");
            }

            // save the payment
            await _subscriptionPaymentRepository.InsertAndGetIdAsync(payment);

            #endregion

            #region Queue HubSpot Event

            // queue the job to add Owner/contact to crm
            await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
            {
                TenancyName = tenancyName,
                TenantId = ownerCompanyMap.TenantId,
                SmeCompanyId = ownerCompanyMap.SmeCompanyId,
                OwnerId = ownerCompanyMap.OwnerId,
                EventType = HubSpotEventTypes.CreateEdit,
                HSEntityType = HubSpotEntityTypes.companies,
                UserJourneyPoint = UserJourneyContextTypes.UpgradeSubscription
            }, BackgroundJobPriority.Normal, new TimeSpan(0, 0, 5));

            #endregion

            return new OkResult();
        }

        private void GetCompanyAndPaymentIds(PayFastNotify request, out int companyId, out int tenantId, out int ownerCompanyMapId, out int upgradeEditionId, out int frequency)
        {
            var notifyReqIds = request.m_payment_id.Split('_').ToList();

            if (notifyReqIds.Count < 2)
                Logger.Error($"PayFast Notify method called with invalid merchant payment identifier format");

            ownerCompanyMapId = int.Parse(notifyReqIds[0]);
            upgradeEditionId = int.Parse(notifyReqIds[1]);
            frequency = int.Parse(notifyReqIds[2]);

            var ownerCompanyMap = _ownerCompanyMapRepo.Get(ownerCompanyMapId);

            companyId = ownerCompanyMap.SmeCompanyId.Value;
            tenantId = ownerCompanyMap.TenantId;

        }

        public string GetPaymentRedirectUrl(PaymentRedirectDto dto, int tenantId)
        {
            var tenancyName = _tenantCache.Get(tenantId).TenancyName;
            var baseUrl = _webUrlService.GetSiteRootAddress(tenancyName).EnsureEndsWith('/');
            // initialize the PayFastSettings object with a base site url
            InitPayFastSettings(baseUrl);

            var request = new PayFastRequest(_payFastSettings.PassPhrase)
            {
                // Merchant Details
                merchant_id = _payFastSettings.MerchantId,
                merchant_key = _payFastSettings.MerchantKey,
                return_url = _payFastSettings.ReturnUrl,
                cancel_url = _payFastSettings.CancelUrl,
                notify_url = _payFastSettings.NotifyUrl,

                // Customer Details
                name_first = dto.BuyerName.TrimEnd(),
                name_last = dto.BuyerSurname.TrimEnd(),
                email_address = dto.BuyerEmail.ToLower().TrimEnd(),
               
                // Transaction Details
                m_payment_id = dto.PaymentId,
                amount = dto.TransactionAmount,
                item_name = dto.ItemName.TrimEnd(),
                item_description = dto.ItemDescription.TrimEnd(),
                // Transaction Options
                email_confirmation = dto.EmailConfirmation,
                confirmation_address = dto.ConfirmationEmailAddress.TrimEnd(),
            };

            if (dto.SubscriptionType != null)
            {
                request.recurring_amount = dto.Amount;
                request.frequency = (BillingFrequency)dto.Frequency;
                request.cycles = dto.Cycles;
                // Recurring Billing Details
                request.subscription_type = (SubscriptionType)dto.SubscriptionType;
                request.billing_date = dto.BillingDate;
            }

            return $"{_payFastSettings.ProcessUrl}?{request}";

        }

        #region Subscription management

        public async Task<UpdateResponse> FetchSubscription(string token)
        {
            var response = await new PayFastSubscription(_payFastSettings).Fetch(token);

            if (response.status != "success")
                throw new SystemException($"Failed to Fetch Subscription, call returned with Status:{response.status} and Code:{response.code}");

            // N.B. remove token from response for security purposes
            response.data.response.token = "";

            return response;
        }


        public async Task CancelSubscription(string token, bool test = false)
        {
            var result = await new PayFastSubscription(_payFastSettings).Cancel(token, test);

            if (result.status != "success")
                throw new SystemException($"Failed to Cancel Subscription, call returned with Status:{result.status} and Code:{result.code}");
        }


        public async Task PauseSubscription(string token, bool test = false)
        {
            var result = await new PayFastSubscription(_payFastSettings).Pause(token, test);

            if (result.status != "success")
                throw new SystemException($"Failed to pause Subscription, call returned with Status:{result.status} and Code:{result.code}");
        }

        public async Task UnPauseCubscription(string token, bool test = false)
        {
            var result = await new PayFastSubscription(_payFastSettings).UnPause(token, test);

            if (result.status != "success")
                throw new SystemException($"Failed to unpause Subscription, call returned with Status:{result.status} and Code:{result.code}");
        }

        #endregion
                
    }
}
