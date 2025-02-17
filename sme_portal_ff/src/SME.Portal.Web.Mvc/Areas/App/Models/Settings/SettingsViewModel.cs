using System.Collections.Generic;
using Abp.Application.Services.Dto;
using SME.Portal.Configuration.Tenants.Dto;

namespace SME.Portal.Web.Areas.App.Models.Settings
{
    public class SettingsViewModel
    {
        public TenantSettingsEditDto Settings { get; set; }
        
        public List<ComboboxItemDto> TimezoneItems { get; set; }
        
        public List<string> EnabledSocialLoginSettings { get; set; } = new List<string>();
    }
}