using SME.Portal.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Accounts
{
    public interface IShallowReset
    {
        List<User> GetShallowResetUsers(int tenantId);
        void PerformReset(int tenantId);
        void PerformReset(List<User> users);
    }
}
