using Abp.Authorization;
using Abp.Configuration;
using Abp.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SME.Portal.Authentication;
using SME.Portal.Configuration;
using SME.Portal.ConsumerProfileBureau.Dtos;
using SME.Portal.Helpers;
using SME.Portal.Integrations.Dtos;
using SME.Portal.Qlana;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using static SME.Portal.SME.ApplicationAppServiceExt;

namespace SME.Portal.Integrations
{
    [AbpAuthorize]
    public class CompanyPartnersAppService : PortalAppServiceBase, ICompanyPartnersAppService
    {
        private FinfindAzureApiGatewaySettings Settings;

        public CompanyPartnersAppService(ISettingManager settingManager)
        {
            var settingValue = settingManager.GetSettingValueForApplication(AppSettings.FinfindApi.AzureApiGateway);
            var settings = settingValue.FromJsonString<FinfindAzureApiGatewaySettings>();

            if (!settings.Enabled)
                throw new ArgumentException("FinfindApi is not enabled");

            if (string.IsNullOrEmpty(settings.KeyName))
                throw new ArgumentException("FinfindApi KeyName is not defined");

            if (string.IsNullOrEmpty(settings.KeyValue))
                throw new ArgumentException("FinfindApi KeyValue is not defined");

            if (string.IsNullOrEmpty(settings.ApiUrl))
                throw new ArgumentException("FinfindApi Base Api Url is not defined");

            Settings = settings;
        }

        public async Task<string> CreateCompanyPartnersLead(string dataJson)
        {
            try
            {
                var response = await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cp-api/createcompanypartnerslead")), dataJson);

                return response;
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
        }
        
        private async Task<string> Send(UriBuilder url, string jsonContent = "")
        {
            try
            {
                var httpHelper = new HttpHelper(url, HttpMethod.Post, Settings.KeyName, Settings.KeyValue, jsonContent);

                var responseJson = await httpHelper.SendAsync();

                dynamic responseJObj = JsonConvert.DeserializeObject<object>(responseJson);

                return responseJson;
            }
            catch (Exception x)
            {
                Logger.Error(x.Message);
            }

            return null;
        }
    }
}
