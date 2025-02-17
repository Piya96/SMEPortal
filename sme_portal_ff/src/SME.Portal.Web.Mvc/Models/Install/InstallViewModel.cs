using System.Collections.Generic;
using Abp.Localization;
using SME.Portal.Install.Dto;

namespace SME.Portal.Web.Models.Install
{
    public class InstallViewModel
    {
        public List<ApplicationLanguage> Languages { get; set; }

        public AppSettingsJsonDto AppSettingsJson { get; set; }
    }
}
