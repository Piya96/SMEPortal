using Abp.Domain.Repositories;
using Abp.Threading;
using SME.Portal.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Accounts.UserTestAccountRestJobLogic
{
    public class FullReset : IFullReset
    {
        private readonly IShallowReset _shallowReset;
        private readonly IPartialReset _partialReset;
        private readonly IRepository<User, long> _userRepository;
        public FullReset(
            IShallowReset shallowReset,
            IPartialReset partialReset,
            IRepository<User, long> userRepository)
        {
            _shallowReset = shallowReset;
            _partialReset = partialReset;
            _userRepository = userRepository;

        }

        public List<User> GetFullResetUsers(int tenantId)
        {
            var users = _userRepository.GetAllList(x =>
            x.IsDeleted == false &&
            x.TenantId == tenantId &&
            x.ResetFlag == ResetFlag.FullReset ||
            x.EmailAddress.Contains("getnada.com"));

            return users;
        }

        public void PerformReset(int tenantId)
        {
            var users = GetFullResetUsers(tenantId);

            //Shallow Reset first
            _shallowReset.PerformReset(users);

            //Partial Reset second
            _partialReset.PerformReset(users);

            PerformReset(users);
        }

        public void PerformReset(List<User> users)
        {
            foreach (var user in users)
            {
                AsyncHelper.RunSync(() => _userRepository.HardDeleteAsync(a => a.Id == user.Id));
            }
        }
    }
}
