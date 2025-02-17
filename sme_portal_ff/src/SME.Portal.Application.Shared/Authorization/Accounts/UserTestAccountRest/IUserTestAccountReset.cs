using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.Authorization.Accounts.UserTestAccountRest
{
    public interface IUserTestAccountReset
    {
        Task<bool> ResetAccountStartSync(long userId);
    }
}
