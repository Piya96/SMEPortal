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
using SME.Portal.Documents;
using Finfind.Data.Models.QLana;

using SME.Portal.SME;
using SME.Portal.SME.Dtos;


namespace SME.Portal.Integrations
{
    [AbpAuthorize]
    public class QLanaAppService : PortalAppServiceBase, IQLanaAppService
    {
        private FinfindAzureApiGatewaySettings Settings;

		private DocumentsAppServiceExt Documents;

		//private ApplicationAppServiceExt AppService;

		public QLanaAppService(
			ISettingManager settingManager,
			DocumentsAppServiceExt documents
			//ApplicationAppServiceExt appService
		)
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

			Documents = documents;

			//AppService = appService;

		}

		public async Task<string> CreateECDCFacility(PayloadArgs args)
        {
            try
            {
				//CreateFacilityResponseDto dto = new CreateFacilityResponseDto
				//{
				//	message = "Test pass",
				//	Success = true,
				//	Data = new FacilityData
				//	{
				//		uid = "897349837666",
				//		IsUpdate = false
				//	}
				//};
				//var response = JsonConvert.SerializeObject(dto);
				var response = await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/qlana/create-facility-in-ecdc")), args.Json);
				return response;
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
		}

		public async Task<bool> SendECDCPayload(PayloadArgs payloadArgs)
		{
			await CreateECDCFacility(payloadArgs);
			return true;
		}

		public async Task<string> Upload(UploadArgs args)
		{
			try
			{
				var dto = await Documents.GetAllECDCDocumentsForQLana(AbpSession.UserId.Value, args.CompanyId);
				dto.Files.Add(new File
				{
					Filename = args.SummaryName,
					Base64Content = args.SummaryBytes,
					DocumentType = "",
					Description = "Application Summary"
				});
				dto.FacilityGuid = args.Uid;
				string dataJson = JsonConvert.SerializeObject(dto);
				
				var response = await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/qlana/upload")), dataJson);

				return response;
			}
			catch(WebException ex)
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
