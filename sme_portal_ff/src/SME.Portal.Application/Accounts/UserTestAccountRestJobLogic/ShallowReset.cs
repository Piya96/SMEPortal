using Abp.Domain.Repositories;
using SME.Portal.Authorization.Users;
using SME.Portal.Lenders;
using SME.Portal.SME;
using System.Collections.Generic;

namespace SME.Portal.Accounts
{
    public class ShallowReset : IShallowReset
    {
        private readonly IRepository<User, long> _userRepository;
        private readonly ApplicationAppServiceExt _applicationsAppServiceExt;
        private readonly IMatchesAppService _matchesAppService;

        public ShallowReset(
           IRepository<User, long> userRepository,
           ApplicationAppServiceExt applicationsAppServiceExt,
           IMatchesAppService matchesAppService)
        {
            _userRepository = userRepository;
            _applicationsAppServiceExt = applicationsAppServiceExt;
            _matchesAppService = matchesAppService;
        }

        public List<User> GetShallowResetUsers(int tenantId)
        {
            var users = _userRepository.GetAllList(x =>
            x.IsDeleted == false &&
            x.TenantId == tenantId &&
            x.ResetFlag == ResetFlag.ShallowReset);
            
            return users;
        }

        public void PerformReset(int tenantId)
        {
            var users = GetShallowResetUsers(tenantId);
            PerformReset(users);
        }

        public void PerformReset(List<User> users)
        {
            foreach (var user in users)
            {
                var applications = new ApplicationsResetJob(_applicationsAppServiceExt).GetApplications(user.Id);

                foreach (var application in applications._Applications)
                {
                    new MatchesResetJob(_matchesAppService).GetMatches(application.Id).DeleteMatches();
                }

                applications.DeleteApplications();
            }
        }
    }
}
