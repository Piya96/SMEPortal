using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Abp.Application.Editions;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading;
using PayFast;
using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.Sme.Subscriptions;
using SME.Portal.SME.Dtos.PayFast;
using SME.Portal.SME.Subscriptions;

namespace SME.Portal.PayFast
{
    public class PayFastNotifyHandlerBackgroundJob : BackgroundJob<PayFastNotifyBackgroundJobDto>, ITransientDependency
    {
        private readonly IPaymentAppService _paymentAppService;
        private readonly IRepository<User, long> _userRepository;
        private readonly IRepository<SubscriptionPayment, long> _paymentRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<SmeCompany, int> _smeCompaniesRepo;
        private readonly IRepository<Edition, int> _editionRepo;
        private readonly IRepository<SmeSubscription, int> _smeSubscriptionRepo;
        private readonly IRepository<OwnerCompanyMap, int> _ownerCompanyMapRepo;
        private readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;

        public PayFastNotifyHandlerBackgroundJob( IPaymentAppService paymentAppService, 
                                                  IRepository<User, long> userRepository,
                                                  IRepository<SubscriptionPayment, long> paymentRepository,
                                                  IUnitOfWorkManager unitOfWorkManager,
                                                  IRepository<SmeCompany, int> smeCompaniesRepo,
                                                  IRepository<Edition, int> editionRepo,
                                                  IRepository<SmeSubscription, int> smeSubscriptionRepo,
                                                  IRepository<OwnerCompanyMap, int> ownerCompanyMapRepo,
                                                  SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt)
        {
            _paymentAppService = paymentAppService;
            _userRepository = userRepository;
            _paymentRepository = paymentRepository;
            _unitOfWorkManager = unitOfWorkManager;
            _smeCompaniesRepo = smeCompaniesRepo;
            _editionRepo = editionRepo;
            _smeSubscriptionRepo = smeSubscriptionRepo;
            _ownerCompanyMapRepo = ownerCompanyMapRepo;
            _smeSubscriptionsAppServiceExt = smeSubscriptionsAppServiceExt;
        }

        [UnitOfWork]
        public override void Execute(PayFastNotifyBackgroundJobDto request)
        {
            GetCompanyAndPaymentIds(request, out int companyId, out long paymentId, out int tenantId, out int ownerCompanyMapId);

            Logger.Info($"PayFast Notify BackgroundJob handled for PaymentId:{paymentId}");

            using var uow = _unitOfWorkManager.Begin();
            using (UnitOfWorkManager.Current.SetTenantId(tenantId))
            {
                var payment = _paymentRepository.Get(paymentId);

                if (request.payment_status == PayFastStatics.CompletePaymentConfirmation)
                {
                    var company = _smeCompaniesRepo.Get(companyId);
                    var paidEdition = _editionRepo.GetAll().FirstOrDefault(x => x.DisplayName == "Paid");

                    #region Update the SubscriptionPayment

                    payment.SetAsPaid();
                    payment.InvoiceNo = string.Empty;
                    payment.ExternalPaymentId = request.pf_payment_id;
                    payment.ExternalPaymentToken = request.token;

                    _paymentRepository.Update(payment);

                    #endregion

                    #region update the Company SmeSubscription

                    // get company subscription
                    var smeSubscription = _smeSubscriptionRepo.GetAll().FirstOrDefault(x => x.OwnerCompanyMapId == ownerCompanyMapId);
                    smeSubscription.EditionId = paidEdition.Id;
                    smeSubscription.StartDate = DateTime.Now;
                    smeSubscription.NextBillingDate = DateTime.Parse(request.billing_date);
                    smeSubscription.Status = SmeSubscriptionStatus.Active.ToString();

                    // upgrade to paid
                    _smeSubscriptionRepo.Update(smeSubscription);

                    #endregion

                    Logger.Info($"PayFast Notify handled for Complete Payment with PaymentId:{paymentId}");
                }

                // handle Cancelled Payment
                if (request.payment_status == PayFastStatics.CancelledPaymentConfirmation)
                {
                    payment.SetAsCancelled();
                    _paymentRepository.Update(payment);

                    Logger.Info($"PayFast Notify handled for Cancelled Payment with PaymentId:{paymentId}");
                }

                uow.Complete();
            }
        }

        private void GetCompanyAndPaymentIds(PayFastNotifyBackgroundJobDto request, out int companyId, out long paymentId, out int tenantId, out int ownerCompanyMapId)
        {
            var notifyReqIds = request.m_payment_id.Split('_').ToList();

            if (notifyReqIds.Count < 2)
                Logger.Error($"PayFast Notify method called with invalid merchant payment identifier format");

            ownerCompanyMapId = int.Parse(notifyReqIds[0]);

            var ownerCompanyMap = _ownerCompanyMapRepo.Get(ownerCompanyMapId);

            paymentId = long.Parse(notifyReqIds[1]);
            companyId = ownerCompanyMap.SmeCompanyId.Value;
            tenantId = ownerCompanyMap.TenantId;

        }
    }
}
