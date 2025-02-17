using Abp.Runtime.Session;
using SME.Portal.Editions;
using SME.Portal.MultiTenancy.Payments.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.MultiTenancy.Payments
{
    public class PaymentAppServiceExt : PaymentAppService
    {
        private readonly ISubscriptionPaymentRepository _subscriptionPaymentRepository;
        private readonly EditionManager _editionManager;
        private readonly IPaymentGatewayStore _paymentGatewayStore;
        private readonly TenantManager _tenantManager;


        public PaymentAppServiceExt(
            ISubscriptionPaymentRepository subscriptionPaymentRepository,
            EditionManager editionManager,
            IPaymentGatewayStore paymentGatewayStore,
            TenantManager tenantManager)
            : base(subscriptionPaymentRepository, editionManager, paymentGatewayStore, tenantManager)
        {
            _subscriptionPaymentRepository = subscriptionPaymentRepository;
            _editionManager = editionManager;
            _paymentGatewayStore = paymentGatewayStore;
            _tenantManager = tenantManager;
        }

        public async Task<long> CreatePaymentForUser(CreatePaymentDto input)
        {
            if (!AbpSession.TenantId.HasValue)
            {
                throw new ApplicationException("A payment only can be created for a tenant. TenantId is not set in the IAbpSession!");
            }

            if (!AbpSession.UserId.HasValue)
            {
                throw new ApplicationException("A payment only can be created for a user. UserId is not set in the IAbpSession!");
            }

            var targetEdition = (SubscribableEdition)await _editionManager.GetByIdAsync(input.EditionId);

            var payment = new SubscriptionPayment
            {
                Description = GetPaymentDescription(input.EditionPaymentType, input.PaymentPeriodType, targetEdition.DisplayName, input.RecurringPaymentEnabled),
                PaymentPeriodType = input.PaymentPeriodType,
                EditionId = input.EditionId,
                TenantId = AbpSession.GetTenantId(),
                UserId = AbpSession.GetUserId(),
                Gateway = input.SubscriptionPaymentGatewayType,
                Amount = targetEdition.GetPaymentAmount(input.PaymentPeriodType.Value),
                DayCount = input.PaymentPeriodType.HasValue ? (int)input.PaymentPeriodType.Value : 0,
                IsRecurring = input.RecurringPaymentEnabled,
                SuccessUrl = input.SuccessUrl,
                ErrorUrl = input.ErrorUrl,
                EditionPaymentType = input.EditionPaymentType
            };

            return await _subscriptionPaymentRepository.InsertAndGetIdAsync(payment);
        }

        public async Task<List<SubscriptionPaymentDto>> GetPaymentsForUser(SubscriptionPaymentStatus status)
        {

            if (!AbpSession.UserId.HasValue)
            {
                throw new ApplicationException("A payment can only be retrieved for a user with a valid session. UserId is not set in the IAbpSession!");
            }

            var payments = await _subscriptionPaymentRepository.GetByUserIdAsync(AbpSession.UserId.Value, status);

            var paymentDtoList = new List<SubscriptionPaymentDto>();

            foreach (var payment in payments)
                paymentDtoList.Add(ObjectMapper.Map<SubscriptionPaymentDto>(payment));

            return paymentDtoList;
        }

    }
}
