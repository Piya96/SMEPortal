using Abp.Threading;
using SME.Portal.Company;
using SME.Portal.ConsumerCredit;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Accounts.UserTestAccountRestJobLogic
{
    public class OwnersResetJob
    {
        private readonly OwnersAppServiceExt _ownersAppServiceExt;
        private readonly IOwnerCompanyMappingAppService _ownerCompanyMappingAppService;

        public OwnersResetJob(
            OwnersAppServiceExt ownersAppServiceExt,
            IOwnerCompanyMappingAppService ownerCompanyMappingAppService)
        {
            _ownersAppServiceExt = ownersAppServiceExt;
            _ownerCompanyMappingAppService = ownerCompanyMappingAppService;
        }

        public OwnersResetJob DeleteOwners(long userId)
        {

            AsyncHelper.RunSync(() => _ownerCompanyMappingAppService.HardDeleteForUser(userId));
            AsyncHelper.RunSync(() => _ownersAppServiceExt.DeleteForUser(userId));
            return this;
        }
    }
}
