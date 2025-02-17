using Abp.Auditing;
using SME.Portal.Configuration.Dto;

namespace SME.Portal.Configuration.Tenants.Dto
{
    public class TenantEmailSettingsEditDto : EmailSettingsEditDto
    {
        public bool UseHostDefaultEmailSettings { get; set; }
    }
}