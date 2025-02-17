using Abp.Domain.Repositories;
using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using SME.Portal.ConsumerCredit;
using SME.Portal.Documents;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.SME.Subscriptions;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Accounts.UserTestAccountRestJobLogic
{
    public class PartialReset : IPartialReset
    {
        private readonly IShallowReset _shallowReset;
        private readonly IRepository<User, long> _userRepository;
        private readonly DocumentsAppServiceExt _documentsAppServiceExt;
        private readonly ICreditReportsAppService _creditReportsAppService;
        private readonly ICreditScoresAppService _creditScoresAppService;
        private readonly OwnersAppServiceExt _ownersAppServiceExt;
        private readonly SmeCompaniesAppServiceExt _smeCompaniesAppServiceExt;
        private readonly IOwnerCompanyMappingAppService _ownerCompanyMappingAppService;
        private readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;
        private readonly IRepository<SubscriptionPayment, long> _subscriptionPaymentRepository;


        public PartialReset(
            IShallowReset shallowReset,
            IRepository<User, long> userRepository,
            DocumentsAppServiceExt documentsAppServiceExt,
            ICreditReportsAppService creditReportsAppService,
            ICreditScoresAppService creditScoresAppService,
            OwnersAppServiceExt ownersAppServiceExt,
            SmeCompaniesAppServiceExt smeCompaniesAppServiceExt,
            IOwnerCompanyMappingAppService ownerCompanyMappingAppService,
            IRepository<SubscriptionPayment, long> subscriptionPaymentRepository,
            SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt)
        {
            _shallowReset = shallowReset;
            _userRepository = userRepository;
            _documentsAppServiceExt = documentsAppServiceExt;
            _creditReportsAppService = creditReportsAppService;
            _creditScoresAppService = creditScoresAppService;
            _ownersAppServiceExt = ownersAppServiceExt;
            _smeCompaniesAppServiceExt = smeCompaniesAppServiceExt;
            _ownerCompanyMappingAppService = ownerCompanyMappingAppService;
            _smeSubscriptionsAppServiceExt = smeSubscriptionsAppServiceExt;
            _subscriptionPaymentRepository = subscriptionPaymentRepository;
        }

        public List<User> GetPartialResetUsers(int tenantId)
        {
            var users = _userRepository.GetAllList(x =>
            x.IsDeleted == false &&
            x.TenantId == tenantId &&
            x.ResetFlag == ResetFlag.PartialReset);
            
            return users;
        }

        public void PerformReset(int tenantId)
        {
            var users = GetPartialResetUsers(tenantId);

            //Shallow Reset first
            _shallowReset.PerformReset(users);

            PerformReset(users);
        }

        public void PerformReset(List<User> users)
        {
            foreach (var user in users)
            {
                new SmeSubscriptionsAndPaymentsResetJob(_smeSubscriptionsAppServiceExt, _subscriptionPaymentRepository, _ownerCompanyMappingAppService).DeleteSmeSubscriptionsAndPayments(user.Id);
                new DocumentsResetJob(_documentsAppServiceExt).GetDocuments(user.Id).DeleteDocuments();
                new CreditReportAndCreditScoreResetJob(_creditReportsAppService, _creditScoresAppService).DeleteCreditReportsAndCreditScores(user.Id);
                new OwnersResetJob(_ownersAppServiceExt, _ownerCompanyMappingAppService).DeleteOwners(user.Id);
                new CompaniesResetJob(_smeCompaniesAppServiceExt, _ownerCompanyMappingAppService).DeleteCompanies(user.Id);
                new UserUpdateResetJob(user).UpdateForReset(ResetFlag.PartialReset);
                
            }
        }
    }
}
