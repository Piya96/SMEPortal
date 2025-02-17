using Abp.Threading;
using SME.Portal.SME;
using SME.Portal.SME.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace SME.Portal.Accounts
{
    public class ApplicationsResetJob
    {
        private readonly ApplicationAppServiceExt _applicationsAppServiceExt;
        public List<ApplicationDto> _Applications;
        public ApplicationsResetJob(ApplicationAppServiceExt applicationsAppServiceExt)
        {
            _applicationsAppServiceExt = applicationsAppServiceExt;
        }

        public ApplicationsResetJob GetApplications(long userId)
        {
            var applicationsPaged = AsyncHelper.RunSync(() => _applicationsAppServiceExt.GetAllForUserId(userId));
            _Applications = applicationsPaged.Items.Select(x => x.Application).ToList();

            return this;
        }

        public ApplicationsResetJob DeleteApplications()
        {
            foreach (var app in _Applications)
            {
                AsyncHelper.RunSync(() => _applicationsAppServiceExt.HardDelete(new Abp.Application.Services.Dto.EntityDto() { Id = app.Id }));
            }

            return this;
        }
    }
}
