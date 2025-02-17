using Abp.Threading;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SME.Portal.Helpers;
using SME.Portal.Configuration;
using SME.Portal.HubSpot.Dtos;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Abp.Dependency;
using SME.Portal.Configuration.Dto;
using SME.Portal.Configuration.Host.Dto;

namespace SME.Portal.HubSpot
{
    public class HubSpotIntegrationService : IHubSpotIntegrationService, ISingletonDependency
    {
        //private string ApiKey { get; set; }
        private string ApiUrl { get; set; }

        public HubSpotIntegrationService()
        {
            var apiUrl = "http://localhost:7071/integrations/hubspot/create-or-update";
            var apiKey = string.Empty;

            //if (string.IsNullOrEmpty(apiKey))
            //    throw new ArgumentNullException("apiKey", "ApiKey cannot be null or empty string");

            if (string.IsNullOrEmpty(apiUrl))
                throw new ArgumentNullException("apiUrl", "ApiUrl cannot be null or empty string");

            ApiUrl = apiUrl;
            //ApiKey = apiKey;
        }

        public string CreateEditEntity(HubSpotEventTriggerDto data)
        {
            return SendRequest(JsonConvert.SerializeObject(data), "CreateOrUpdateEntity", HttpMethod.Post);
        }

        private string SendRequest(string jsonPayload, string endpoint, HttpMethod method)
        {
            // create the api url 
            //var uriBuilder = new UriBuilder(UriHelper.CombineUri(ApiUrl, $"{endpoint}?hapikey={ApiKey}"));
            var uriBuilder = new UriBuilder(ApiUrl);

            // create a query
            HttpClient httpClient = new HttpClient();

            HttpRequestMessage request = new HttpRequestMessage
            {
                RequestUri = uriBuilder.Uri,
                Method = method,
                Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
            };

            HttpResponseMessage response = AsyncHelper.RunSync(() => httpClient.SendAsync(request));

            return response.ToString();
        }
    }
}
