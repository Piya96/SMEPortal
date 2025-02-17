﻿using SME.Portal.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Accounts.UserTestAccountRestJobLogic
{
    public interface IPartialReset
    {
        void PerformReset(int tenantId);
        void PerformReset(List<User> users);

    }
}
