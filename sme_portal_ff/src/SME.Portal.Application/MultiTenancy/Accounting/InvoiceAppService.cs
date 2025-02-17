using System;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Runtime.Session;
using Abp.Timing;
using Abp.UI;
using SME.Portal.Authorization.Users;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Company;
using SME.Portal.Configuration;
using SME.Portal.Editions;
using SME.Portal.MultiTenancy.Accounting.Dto;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.Sme.Subscriptions;

namespace SME.Portal.MultiTenancy.Accounting
{
    public class InvoiceAppService : PortalAppServiceBase, IInvoiceAppService
    {
        private readonly ISubscriptionPaymentRepository _subscriptionPaymentRepository;
        private readonly IInvoiceNumberGenerator _invoiceNumberGenerator;
        private readonly EditionManager _editionManager;
        private readonly IRepository<Invoice> _invoiceRepository;
        private readonly OwnersAppServiceExt _ownersServiceExt;
        private readonly IUserAppService _userAppService;
        private readonly IOwnerCompanyMappingAppService _ownerCompanyMappingAppService;
        private readonly ISmeSubscriptionsAppService _smeSubscriptionsAppService;
        private readonly ISmeCompaniesAppService _smeCompaniesAppService;

        public InvoiceAppService(
            ISubscriptionPaymentRepository subscriptionPaymentRepository,
            IInvoiceNumberGenerator invoiceNumberGenerator,
            EditionManager editionManager,
            IRepository<Invoice> invoiceRepository,
            OwnersAppServiceExt ownersServiceExt,
            IUserAppService userAppService,
            IOwnerCompanyMappingAppService ownerCompanyMappingAppService,
            ISmeSubscriptionsAppService smeSubscriptionsAppService,
            ISmeCompaniesAppService smeCompaniesAppService)
        {
            _subscriptionPaymentRepository = subscriptionPaymentRepository;
            _invoiceNumberGenerator = invoiceNumberGenerator;
            _editionManager = editionManager;
            _invoiceRepository = invoiceRepository;
            _ownersServiceExt = ownersServiceExt;
            _userAppService = userAppService;
            _ownerCompanyMappingAppService = ownerCompanyMappingAppService;
            _smeSubscriptionsAppService = smeSubscriptionsAppService;
            _smeCompaniesAppService = smeCompaniesAppService;
        }

        public async Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input)
        {
            var payment = await _subscriptionPaymentRepository.GetAsync(input.Id);

            if (string.IsNullOrEmpty(payment.InvoiceNo))
            {
                throw new Exception("There is no invoice for this payment !");
            }

            if (payment.TenantId != AbpSession.GetTenantId())
            {
                throw new UserFriendlyException(L("ThisInvoiceIsNotYours"));
            }

            if (payment.UserId != null && payment.UserId != AbpSession.GetUserId())
            {
                throw new UserFriendlyException(L("ThisInvoiceIsNotYours"));
            }

            var invoice = await _invoiceRepository.FirstOrDefaultAsync(b => b.InvoiceNo == payment.InvoiceNo);
            if (invoice == null)
            {
                throw new UserFriendlyException($"Unable to retrieve InvoiceNo:{payment.InvoiceNo}", Abp.Logging.LogSeverity.Error);
            }

            var edition = await _editionManager.FindByIdAsync(payment.EditionId);
            var hostAddress = await SettingManager.GetSettingValueAsync(AppSettings.HostManagement.BillingAddress);
            var tenantBillingTaxVatNo = await SettingManager.GetSettingValueAsync(AppSettings.TenantManagement.BillingTaxVatNo);

            return new InvoiceDto
            {
                InvoiceNo = payment.InvoiceNo,
                InvoiceDate = invoice.InvoiceDate,
                Amount = payment.Amount,
                EditionDisplayName = edition.DisplayName,

                HostAddress = hostAddress.Replace("\r\n", "|").Replace(",", "|").Split('|').ToList(),
                HostLegalName = await SettingManager.GetSettingValueAsync(AppSettings.HostManagement.BillingLegalName),
                TenantBillingTaxVatNo = tenantBillingTaxVatNo,

                Address = invoice.Address.Replace("\r\n", "|").Replace(",", "|").Split('|').ToList(),
                LegalName = invoice.LegalName,
                TaxNo = invoice.TaxNo
            };
        }

        [UnitOfWork(IsolationLevel.ReadUncommitted)]
        public async Task<string> CreateInvoice(CreateInvoiceDto input)
        {
            var payment = await _subscriptionPaymentRepository.GetAsync(input.SubscriptionPaymentId);

            if (!string.IsNullOrEmpty(payment.InvoiceNo))
            {
                throw new UserFriendlyException(L("InvoiceIsAlreadyGeneratedForPayment", Abp.Logging.LogSeverity.Error));
            }

            var invoiceNo = await _invoiceNumberGenerator.GetNewInvoiceNumber();

            string legalName;
            string address;
            string taxNo;

            // if userid is null use the tenant details
            if (payment.UserId == null)
            {
                legalName = await SettingManager.GetSettingValueAsync(AppSettings.TenantManagement.BillingLegalName);
                address = await SettingManager.GetSettingValueAsync(AppSettings.TenantManagement.BillingAddress);
                taxNo = await SettingManager.GetSettingValueAsync(AppSettings.TenantManagement.BillingTaxVatNo);
            }
            // else use the user details from the current profile
            else
            {
                var owner = await _ownersServiceExt.GetOwnerForViewByUserId((long)payment.UserId);
                var sub = await _smeSubscriptionsAppService.GetSmeSubscriptionForView(payment.SmeSubscriptionId);
                var ownerCompany = await _ownerCompanyMappingAppService.GetOwnerCompanyMapForView(sub.SmeSubscription.OwnerCompanyMapId);
                var company = await _smeCompaniesAppService.GetSmeCompanyForView((int)ownerCompany.OwnerCompanyMap.SmeCompanyId);

                if (owner == null)
                {
                    //var user = await _userAppService.GetUserForEdit(new NullableIdDto<long>() { Id = payment.UserId });

                    legalName = company.SmeCompany.Name; //$"{user.User.Name} {user.User.Surname}";
                    address = company.SmeCompany.RegisteredAddress;
                    taxNo = L("NotSpecified");
                }
                else
                {
                    legalName = company.SmeCompany.Name; //$"{owner.Owner.Name} {owner.Owner.Surname}";
                    address = company.SmeCompany.RegisteredAddress;
                    taxNo = L("NotSpecified");
                }
            }

            if (string.IsNullOrEmpty(legalName) || string.IsNullOrEmpty(address) || string.IsNullOrEmpty(taxNo))
            {
                throw new UserFriendlyException(L("InvoiceInfoIsMissingOrNotCompleted", Abp.Logging.LogSeverity.Error));
            }

            await _invoiceRepository.InsertAsync(new Invoice
            {
                InvoiceNo = invoiceNo,
                InvoiceDate = Clock.Now,
                LegalName = legalName,
                Address = address,
                TaxNo = taxNo
            });

            payment.InvoiceNo = invoiceNo;

            return invoiceNo;
        }
    }
}