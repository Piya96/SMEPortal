using Abp.Domain.Repositories;
using SME.Portal.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Accounts.UserTestAccountRestJobLogic
{
    public class UserUpdateResetJob
    {
        private readonly User _user;

        public UserUpdateResetJob(User user)
        {
            _user = user;
        }

        internal void UpdateForReset(ResetFlag flag)
        {
            if (flag == ResetFlag.PartialReset)
            {
                _user.IsEmailConfirmed = true;
                _user.IsPhoneNumberConfirmed = false;
                _user.IsIdentityOrPassportConfirmed = false;
                _user.IsOnboarded = false;
                _user.Race = null;
                _user.RepresentativeCapacity = null;
                _user.VerificationRecordJson = null;
                _user.PhoneNumber = null;
                _user.IdentityOrPassport = null;
                _user.IsOwner = false;
                _user.PropertiesJson = null;
            }
        }
    }
}
