using Abp.Authorization;
using Abp.Configuration;
using Abp.Json;
using Newtonsoft.Json;
using SME.Portal.Authentication;
using SME.Portal.Configuration;
using SME.Portal.ConsumerProfileBureau.Dtos;
using SME.Portal.Helpers;
using SME.Portal.Integrations.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace SME.Portal.Integrations
{
    [AbpAuthorize]
    public class CPBAppService : PortalAppServiceBase, ICPBAppService
    {
        private FinfindAzureApiGatewaySettings Settings;

        public CPBAppService(ISettingManager settingManager)
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

        public async Task<string> CipcDirectorsBy(string identityNo)
        {
            try
            {
                if (string.IsNullOrEmpty(identityNo))
                    throw new ArgumentNullException("identityNo");

                return await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cpb/cipcdirectors/identityno/{identityNo}")));
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
        }

        public async Task<string> CipcEnterprisesBy(string registrationNo)
        {
            try
            {
                if (string.IsNullOrEmpty(registrationNo))
                    throw new ArgumentNullException("registrationNo");

                return await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cpb/cipcenterprises/registration/{registrationNo}")));
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
        }

        public async Task<string> PersonValidationBy(string identityNo)
        {
            try
            {
                if (string.IsNullOrEmpty(identityNo))
                    throw new ArgumentNullException("identityNo");

                return await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cpb/person/validation/{identityNo}")));
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
        }

        public async Task<string> DebtReviewBy(string identityNo)
        {
            try
            {
                if (string.IsNullOrEmpty(identityNo))
                    throw new ArgumentNullException("identityNo");

                return await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cpb/debtreview/{identityNo}")));
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
        }

        public async Task<string> JudgementsBy(string identityNo)
        {
            try
            {
                if (string.IsNullOrEmpty(identityNo))
                    throw new ArgumentNullException("identityNo");

                return await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cpb/judgmentidv")));
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
        }

        public async Task<string> DefaultsBy(string identityNo)
        {
            try
            {
                if (string.IsNullOrEmpty(identityNo))
                    throw new ArgumentNullException("identityNo");

                return await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cpb/defaultidv/{identityNo}")));
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
        }

        public async Task<string> ProofOfAddressBy(string identityNo)
        {
            try
            {
                if (string.IsNullOrEmpty(identityNo))
                    throw new ArgumentNullException("identityNo");

                return await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cpb/proofofaddressidv/{identityNo}")));
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
        }

        public async Task<string> CreditReport(string identityNo, string dob, string firstName, string lastName, string enquiryReason, string enquiryDoneBy )
        {
            var request = new CreditReportRequestDto
            {
                IdentityNumber = identityNo,
                Dob = dob,
                FirstName = firstName,
                Surname = lastName,
                EnquiryReason = enquiryReason,
                EnquiryDoneBy = enquiryDoneBy
            };

            var uri = new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"/integrations/cpb/creditreport"));

            var jsonPayload = JsonConvert.SerializeObject(request);

            return await Send(uri, jsonPayload);
        }

        public async Task<string> CommercialDefaults(string registrationNo, string permissiblePurpose, string term, string sortBy, string maxRow, List<string> filters)
        {
            var request = new CommercialDefaultsListRequestDto
            {
                RegistrationNumber = registrationNo,
                PermissiblePurpose = permissiblePurpose,
                Term = term, 
                SortBy = sortBy,
                MaxRow = maxRow
            };

            var uri = new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"/integrations/cpb/commercialdefaultlist"));

            var jsonPayload = JsonConvert.SerializeObject(request);

            return await Send(uri, jsonPayload);
            
        }

        public async Task<string> CommercialJudgements(string registrationNo, string permissiblePurpose, string term, string sortBy, string maxRow, List<string> filters)
        {
            var request = new CommercialDefaultsListRequestDto
            {
                RegistrationNumber = registrationNo,
                PermissiblePurpose = permissiblePurpose,
                Term = term,
                SortBy = sortBy,
                MaxRow = maxRow
            };

            var uri = new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"/integrations/cpb/commercialjudgmentlist"));

            var jsonPayload = JsonConvert.SerializeObject(request);

            return await Send(uri, jsonPayload);
        }

        public async Task<string> TelephoneById(string identityNo )
        {
            try
            {
                if (string.IsNullOrEmpty(identityNo))
                    throw new ArgumentNullException("identityNo");

                return await Send(new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cpb/telephone/{identityNo}")));
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return null;
            }
        }

		public async Task<string> TelephoneByIdAndMobile(string identityNo, string mobileNo)
		{
			try
			{
				if(string.IsNullOrEmpty(identityNo))
				{
					throw new ArgumentNullException("identityNo");
				}
				var request = new TelephoneVerificationRequest
				{
					IdentityNumber = identityNo,
					TelephoneNumber = mobileNo
				};
				var uri =new UriBuilder(UriHelper.CombineUri(Settings.ApiUrl, $"integrations/cpb/telephone"));
				var jsonPayload = JsonConvert.SerializeObject(request);
				return await Send(uri, jsonPayload);
			}
			catch(WebException ex)
			{
				Logger.Error(ex.Message);

				return null;
			}
		}

		public async Task<bool> TelephoneExistsForId(string identityNo, string mobile)
        {
            try
            {
                var telephoneNosJson = await TelephoneByIdAndMobile(identityNo, mobile);

                var telephoneNosDto = TelephoneNumbersDto.FromJson(telephoneNosJson);

                if (telephoneNosDto.Telephones.Any(x => x.TelNumber == mobile))
                    return true;

                return false;
            }
            catch (WebException ex)
            {
                Logger.Error(ex.Message);

                return false;
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
