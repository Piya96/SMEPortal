﻿namespace SME.Portal.Authorization.Delegation
{
    public class UserDelegationConfiguration : IUserDelegationConfiguration
    {
        public bool IsEnabled { get; set; }

        public UserDelegationConfiguration()
        {
            IsEnabled = true;
        }
    }
}
