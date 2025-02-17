using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using SME.Portal.Accounts.UserTestAccountRestJobLogic;
using SME.Portal.Authorization.Accounts.UserTestAccountRest;
using SME.Portal.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.Accounts
{
    [AbpAuthorize]

    public class UserTestAccountResetAppService : PortalAppServiceBase, IUserTestAccountReset
    {
        private readonly IShallowReset _shallowReset;
        private readonly IPartialReset _partialReset;
        private readonly IFullReset _fullReset;
        private readonly IRepository<User, long> _userRepository;

        public UserTestAccountResetAppService(
            IShallowReset shallowReset,
            IPartialReset partialReset,
            IFullReset fullReset,
            IRepository<User, long> userRepository)
        {
            _shallowReset = shallowReset;
            _partialReset = partialReset;
            _fullReset = fullReset;
            _userRepository = userRepository;
        }

        public async Task<bool> ResetAccountStartSync(long userId)
        {
            var user = await _userRepository.GetAsync(userId);
            if (user.ResetFlag == null) return false;

            using (UnitOfWorkManager.Current.SetTenantId(user.TenantId))
            {
                using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.SoftDelete))
                {
                    try
                    {
                        switch (user.ResetFlag)
                        {
                            case ResetFlag.ShallowReset:
                                {
                                    _shallowReset.PerformReset(new List<User>() { user });
                                    break;
                                }
                            case ResetFlag.PartialReset:
                                {
                                    _shallowReset.PerformReset(new List<User>() { user });
                                    _partialReset.PerformReset(new List<User>() { user });
                                    break;
                                }
                            case ResetFlag.FullReset:
                                {
                                    _shallowReset.PerformReset(new List<User>() { user });
                                    _partialReset.PerformReset(new List<User>() { user });
                                    _fullReset.PerformReset(new List<User>() { user });
                                    break;
                                }
                        }

                    }
                    catch (Exception x)
                    {
                        Logger.Error($"Exception: {x.Message} {Environment.NewLine} Failed call to ResetAccountStartSync");
                        throw x;
                    }

                    return true;
                }
            }
        }
    }
}
