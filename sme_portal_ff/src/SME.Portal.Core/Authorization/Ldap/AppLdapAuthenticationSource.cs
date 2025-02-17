using Abp.Zero.Ldap.Authentication;
using Abp.Zero.Ldap.Configuration;
using SME.Portal.Authorization.Users;
using SME.Portal.MultiTenancy;

namespace SME.Portal.Authorization.Ldap
{
    public class AppLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public AppLdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}