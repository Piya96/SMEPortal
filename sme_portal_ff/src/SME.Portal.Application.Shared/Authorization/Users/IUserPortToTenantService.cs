using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

using SME.Portal.Authorization.Users.Dto;

namespace SME.Portal.Authorization.Users
{
    public interface IUserPortToTenantService
    {
        Task<bool> PortToTenant(UserEditDto user, int tenantId = 2);
    }
}
