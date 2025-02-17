using Abp.Threading;
using SME.Portal.Company;
using SME.Portal.ConsumerCredit;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Accounts.UserTestAccountRestJobLogic
{
    public class CompaniesResetJob
    {
        private readonly SmeCompaniesAppServiceExt _smeCompaniesAppServiceExt;
        private readonly IOwnerCompanyMappingAppService _ownerCompanyMappingAppService;

        public CompaniesResetJob(
            SmeCompaniesAppServiceExt smeCompaniesAppServiceExt,
            IOwnerCompanyMappingAppService ownerCompanyMappingAppService)
        {
            _smeCompaniesAppServiceExt = smeCompaniesAppServiceExt;
            _ownerCompanyMappingAppService = ownerCompanyMappingAppService;
        }

        public CompaniesResetJob DeleteCompanies(long userId)
        {

            AsyncHelper.RunSync(() => _ownerCompanyMappingAppService.HardDeleteForUser(userId));
            AsyncHelper.RunSync(() => _smeCompaniesAppServiceExt.HardDeleteForUser(userId));
            return this;
        }
    }
}
