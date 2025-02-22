﻿using SME.Portal.Sessions.Dto;

namespace SME.Portal.Web.Views.Shared.Components.AccountLogo
{
    public class AccountLogoViewModel
    {
        public GetCurrentLoginInformationsOutput LoginInformations { get; }

        private string _skin = "light";

        public AccountLogoViewModel(GetCurrentLoginInformationsOutput loginInformations, string skin)
        {
            LoginInformations = loginInformations;
            _skin = skin;
        }

        public string GetBaseUrl()
        {
            var baseUrl = "~/";
            if(LoginInformations?.Tenant?.Id == 2)
            {
                baseUrl = "https://finfind.co.za";
            }

            return baseUrl;
        }

        public string GetLogoUrl(string appPath)
        {
            if (LoginInformations?.Tenant?.LogoId == null)
            {
                return appPath + "Common/Images/app-logo-on-" + _skin + ".svg";
            }

            return appPath + "TenantCustomization/GetLogo?tenantId=" + LoginInformations?.Tenant?.Id;
        }
    }
}