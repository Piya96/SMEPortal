using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SME.Portal.Authentication;
using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using SME.Portal.Configuration;
using SME.Portal.Documents;
using SME.Portal.Helpers;
using SME.Portal.List;
using SME.Portal.PropertiesJson;
using SME.Portal.sefaLAS.Dto;
using SME.Portal.SME;
using SME.Portal.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.sefaLAS
{
    [AbpAuthorize]
    public class SefaLASAppService : PortalAppServiceBase, ISefaLASAppService
    {
        private readonly ISettingManager _settingManager;
        private FinfindAzureApiGatewaySettings _settings;
        private readonly UserManager _userManager;
        private readonly IUserAppService _userAppService;
        private readonly IApplicationsAppService _applicationAppService;
        private readonly SmeCompaniesAppServiceExt _companyAppService;
        private readonly DocumentsAppServiceExt _documentAppServiceExt;
        private readonly IDocumentsAppService _documentsAppService;
        private readonly IBinaryObjectManager _binaryObjectManager;
        private readonly OwnersAppServiceExt _ownersAppService;
        private readonly IListItemsAppService _listAppService;

        public SefaLASAppService(UserManager userManager,
                                  ISettingManager settingManager,
                                  IApplicationsAppService applicationAppService,
                                  SmeCompaniesAppServiceExt companyAppService,
                                  DocumentsAppServiceExt documentAppServiceExt,
                                  IDocumentsAppService documentsAppService,
                                  IBinaryObjectManager binaryObjectManager,
                                  OwnersAppServiceExt ownersAppService,
                                  IListItemsAppService listAppService,
                                  IUserAppService userAppService)
        {
            _userManager = userManager;
            _applicationAppService = applicationAppService;
            _companyAppService = companyAppService;
            _documentAppServiceExt = documentAppServiceExt;
            _binaryObjectManager = binaryObjectManager;
            _settingManager = settingManager;
            _ownersAppService = ownersAppService;
            _listAppService = listAppService;
            _userAppService = userAppService;
            _documentsAppService = documentsAppService;

            var settingValue = _settingManager.GetSettingValueForApplication(AppSettings.FinfindApi.AzureApiGateway);
            var settings = settingValue.FromJsonString<FinfindAzureApiGatewaySettings>();

            if (!settings.Enabled)
                throw new ArgumentException("FinfindApi is not enabled");

            if (string.IsNullOrEmpty(settings.KeyName))
                throw new ArgumentException("FinfindApi KeyName is not defined");

            if (string.IsNullOrEmpty(settings.KeyValue))
                throw new ArgumentException("FinfindApi KeyValue is not defined");

            if (string.IsNullOrEmpty(settings.ApiUrl))
                throw new ArgumentException("FinfindApi Base Api Url is not defined");

            _settings = settings;
        }


        public async Task<string> SendRequest(string jsonPayload, string endpoint)
        {
            // create the HubSpot APIM url 
            var uriBuilder = new UriBuilder(UriHelper.CombineUri(_settings.ApiUrl, endpoint));

            // create a query
            HttpClient httpClient = new HttpClient();

            HttpRequestMessage httpRequest = new HttpRequestMessage
            {
                RequestUri = uriBuilder.Uri,
                Method = HttpMethod.Post,
                Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
            };

            httpRequest.Headers.Add(_settings.KeyName, _settings.KeyValue);

            HttpResponseMessage response = await httpClient.SendAsync(httpRequest);

            var jsonResponse = await response.Content.ReadAsStringAsync();

            Logger.Info($"Call to sefa api uri:{uriBuilder.Uri} payload:{jsonPayload} response:{jsonResponse}");

            return jsonResponse;
        }

        public async Task<string> CollateApplicationDataJson(int applicationId)
        {
            var application = await _applicationAppService.GetApplicationForEdit(new EntityDto() { Id = applicationId });
            var company = await _companyAppService.GetSmeCompanyForView(application.Application.SmeCompanyId);
            var owner = await _ownersAppService.GetOwnerForViewByUserId(company.SmeCompany.UserId);
            var user = UserManager.GetUserById(application.Application.UserId);

            #region User data

            var userDto = new SefaLASUserDto()
            {
                Name = user.Name,
                Surname = user.Surname,
                UserName = user.UserName,
                EmailAddress = user.EmailAddress,
                PhoneNumber = user.PhoneNumber,
                IsEmailConfirmed = user.IsEmailConfirmed,
                IdentityOrPassport = user.IdentityOrPassport,
                IsOwner = user.IsOwner,
                RepresentativeCapacity = null,
                VerificationRecord = null,
                Properties = null,
                CreationTime = user.CreationTime
            };

            var userJObj = JObject.Parse(JsonConvert.SerializeObject(userDto));

            if (!string.IsNullOrEmpty(user.RepresentativeCapacity))
            {
                var representativeCapacityLI = _listAppService.GetAll().FirstOrDefault(x => x.ListId == user.RepresentativeCapacity);
                userJObj["RepresentativeCapacity"] = JObject.Parse(JsonConvert.SerializeObject(representativeCapacityLI));
            }

            if (!string.IsNullOrEmpty(user.VerificationRecordJson))
                userJObj["VerificationRecord"] = JObject.Parse(user.VerificationRecordJson);

            if (!string.IsNullOrEmpty(user.PropertiesJson))
                userJObj["Properties"] = JObject.Parse(user.PropertiesJson);

            #endregion

            #region Owner data

            var ownerDto = new SefaLASOwnerDto()
            {
                Name = owner.Owner.Name,
                Surname = owner.Owner.Surname,
                EmailAddress = owner.Owner.EmailAddress,
                PhoneNumber = owner.Owner.PhoneNumber,
                IsPhoneNumberConfirmed = owner.Owner.IsPhoneNumberConfirmed,
                IdentityOrPassport = owner.Owner.IdentityOrPassport,
                IsIdentityOrPassportConfirmed = owner.Owner.IsIdentityOrPassportConfirmed,
                Race = null,
                VerificationRecord = null,
                Properties = null,
                CreationTime = owner.Owner.CreationTime
            };

            var ownerJObj = JObject.Parse(JsonConvert.SerializeObject(ownerDto));

            if (!string.IsNullOrEmpty(owner.Owner.Race))
            {
                var raceLI = _listAppService.GetAll().FirstOrDefault(x => x.ListId == owner.Owner.Race);
                ownerJObj["Race"] = JObject.Parse(JsonConvert.SerializeObject(raceLI));
            }

            if (!string.IsNullOrEmpty(owner.Owner.VerificationRecordJson))
                ownerJObj["VerificationRecord"] = JObject.Parse(owner.Owner.VerificationRecordJson);

            if (!string.IsNullOrEmpty(owner.Owner.PropertiesJson))
                ownerJObj["Properties"] = JObject.Parse(owner.Owner.PropertiesJson);

            #endregion

            #region Company data

            // set PropertiesJson EntityType to serialized LI
            dynamic companyPropertiesJObj = JsonConvert.DeserializeObject<object>(company.SmeCompany.PropertiesJson);
            var entityTypeGUIDStr = (string)companyPropertiesJObj["entityType"];
            var entityTypeListItem = _listAppService.GetAll().FirstOrDefault(x => x.ListId == entityTypeGUIDStr);

            if (entityTypeListItem != null)
            {
                companyPropertiesJObj["entityType"] = JObject.Parse(JsonConvert.SerializeObject(entityTypeListItem));
                company.SmeCompany.PropertiesJson = companyPropertiesJObj.ToString(Formatting.None);
            }

            // registration Type LI and Industry LI
            var regTypeLI = _listAppService.GetAll().FirstOrDefault(x => x.ListId == company.SmeCompany.Type);
            var industryLI = _listAppService.GetAll().FirstOrDefault(x => x.ListId == company.SmeCompany.Industries);

            var compayDto = new SefaLASCompanyDto()
            {
                Name = company.SmeCompany.Name,
                RegistrationNumber = company.SmeCompany.RegistrationNumber,
                Type = null,
                RegistrationDate = company.SmeCompany.RegistrationDate,
                StartedTradingDate = company.SmeCompany.StartedTradingDate,
                RegisteredAddress = company.SmeCompany.RegisteredAddress,
                IndustrySector = null,
                Properties = null,
                VerificationRecord = null,
                CreationTime = company.SmeCompany.CreationTime
            };

            var companyJObj = JObject.Parse(JsonConvert.SerializeObject(compayDto));

            companyJObj["Type"] = JObject.Parse(JsonConvert.SerializeObject(regTypeLI));
            companyJObj["Properties"] = JObject.Parse(company.SmeCompany.PropertiesJson);
            companyJObj["IndustrySector"] = companyJObj["Properties"]["industry"];

            if (!string.IsNullOrEmpty(company.SmeCompany.VerificationRecordJson))
            {
                companyJObj["VerificationRecord"] = JObject.Parse(company.SmeCompany.VerificationRecordJson);

                if (string.IsNullOrEmpty((string)companyJObj["VerificationRecord"]["province"]))
                    companyJObj["VerificationRecord"]["province"] = GetProvinceFromRegAddress(company.SmeCompany.RegisteredAddress);
            }

            #endregion

            #region Application data

            var applicationDto = new SefaLASApplicationDto()
            {
                MatchCriteria = null,
                Properties = null,
                CreationTime = application.Application.CreationTime
            };

            var applicationJObj = JObject.Parse(JsonConvert.SerializeObject(applicationDto));
            applicationJObj["Properties"] = JObject.Parse(application.Application.PropertiesJson.Replace("\r\n  ", ""));

            #endregion

            #region Document data

            var documentsJObj = await CollateDocumentDataJson(application.Application.SmeCompanyId);

            #endregion

            var dataObj = new JObject
            {
                ["User"] = userJObj,
                ["Owner"] = ownerJObj,
                ["Company"] = companyJObj,
                ["Application"] = applicationJObj,
                ["Documents"] = documentsJObj["Documents"]
            };

            return JsonConvert.SerializeObject(dataObj, Formatting.None);
        }

        private string GetProvinceFromRegAddress(string registeredAddress)
        {
            var province = registeredAddress.Split(",").LastOrDefault();

            switch (province)
            {
                case "GT": return "Gauteng";
                case "KZ": return "KwaZulu-Natal";
                case "LP": return "Limpopo";
                case "MP": return "Mpumalanga"; 
                case "WC": return "Western Cape";
                case "NC": return "Northern Cape";
                case "EC": return "Eastern Cape";
                case "NW": return "North West";
                case "FS": return "Free State";
            }

            return "";
        }

        public async Task<JObject> CollateDocumentDataJson(int companyId)
        {
            var documents = await _documentAppServiceExt.GetAllByCompanyId(companyId);

            var sefaLASDocumentsDto = new SefaLAS_DocumentsDto()
            {
                Documents = new List<SefaDocument>()
            };

            foreach (var documentDto in documents.Items)
            {
                var document = documentDto.Document;
                //var file = await _binaryObjectManager.GetOrNullAsync(document.BinaryObjectId);
                //var base64 = Convert.ToBase64String(file.Bytes, 0, file.Bytes.Length);

                var documentTypeListItem = await _documentAppServiceExt.GetDocumentListItemByTypeListId(document.Type);

                var fileNameAndExtList = document.FileName.Split(".").ToList();

                var documentFilename = fileNameAndExtList.First();
                var documentExt = "." + fileNameAndExtList.Last();

                sefaLASDocumentsDto.Documents.Add(new SefaDocument()
                {
                    Id = document.Id,
                    Name = documentFilename,
                    Category = documentTypeListItem.Details,
                    Type = documentTypeListItem.ListId,
                    Extension = documentExt
                });
            }

            return JObject.Parse(JsonConvert.SerializeObject(sefaLASDocumentsDto));
        }

        public async Task<JObject> RequestEnquiryNumber(int applicationId)
        {
            var applicationDto = await _applicationAppService.GetApplicationForEdit(new EntityDto() { Id = applicationId });
            var applicationForEdit = applicationDto.Application;
            var user = await _userManager.GetUserAsync(new Abp.UserIdentifier(applicationForEdit.TenantId, applicationForEdit.UserId));

            var sefaLASRequest = new SefaLAS_Dto()
            {
                FirstName = user.Name,
                LastName = user.Surname,
                Email = user.EmailAddress,
                IsTest = IsTest(user.EmailAddress)
            };

            var jsonPayload = JsonConvert.SerializeObject(sefaLASRequest);

            sefaLASRequest.EnquiryNumber = await SendRequest(jsonPayload, "integrations/sefa-api/enquiry");

            var sefaLASRequestJson = JsonConvert.SerializeObject(new PropertiesJsonDto() { sefaLAS = sefaLASRequest }, Formatting.None);

            applicationForEdit.PropertiesJson = sefaLASRequestJson;
            await _applicationAppService.CreateOrEdit(applicationForEdit);

            return JObject.Parse(sefaLASRequestJson);

        }

        public async Task<string> RequestApplicationNumber(string propertiesJson, string dataJson = "")
        {
            var sefLASJObject = GetSefaLASJObject(propertiesJson);

            var enquiryNumber = (string)sefLASJObject["EnquiryNumber"];
            var isTest = (bool)sefLASJObject["IsTest"];

            if (string.IsNullOrEmpty(enquiryNumber))
            {
                Logger.Error($"Finance Application.PropertiesJson is null or empty, unable to retrieve the EnquiryNumber.");
                return null;
            }

            var request = new SefaLAS_Dto()
            {
                EnquiryNumber = enquiryNumber,
                DataJson = dataJson,
                IsTest = isTest
            };

            var requestJson = JsonConvert.SerializeObject(request);

            Logger.Info($"Json data posted to sefaLAS: {requestJson}");

            var response = await SendRequest(requestJson, "integrations/sefa-api/application");

            try
            {
                var responseDto = SefaLas_ResponseDto.FromJson(response);

                if (responseDto.Code != "200" && responseDto.Code != "201")
                    throw new SystemException($"Failed to submit Application to sefaLAS. EnquiryNumber:{request.EnquiryNumber} Payload:{dataJson}");

                return responseDto.Data;
            }
            catch (Exception x)
            {
                Logger.Error("Failed to deserialize response from sefaLAS in RequestApplicationNumber", x);
                return null;
            }

            //return responseDto.data;
        }

        private bool IsTest(string emailAddress)
        {
            if (emailAddress.Contains("finfind.co.za") ||
				emailAddress.Contains("sefa.org.za") ||
				emailAddress.Contains("ecdc.co.za") ||
				emailAddress.Contains("fetola.co.za") ||
				emailAddress.Contains("getnada.com") ||

				emailAddress.Contains("accpresh@gmail.com") ||
				emailAddress.Contains("darlene@smeasy.co.za") ||
				emailAddress.Contains("darlene@tdh.co.za") ||
				emailAddress.Contains("eugene.andrew.long@gmail.com") ||
				emailAddress.Contains("eugene@smeasy.co.za") ||
				emailAddress.Contains("gel.ssdd@gmail.com") ||
				emailAddress.Contains("madondotakundaoriginal@gmail.com") ||
				emailAddress.Contains("mandisangcamu4@gmail.com") ||
				emailAddress.Contains("mbathahlengiwe174@gmail.com") ||
				emailAddress.Contains("menzies@tdh.co.za") ||
				emailAddress.Contains("mikechauke77@gmail.com") ||
				emailAddress.Contains("phila77mc@gmail.com") ||
				emailAddress.Contains("phirisbongiseni87@gmail.com") ||
				emailAddress.Contains("rodtheonlyonearound@gmail.com") ||
				emailAddress.Contains("wayne@southafricanwebsitedesigner.co.za") ||
				emailAddress.Contains("wemcconnell@gmail.com") ||
                emailAddress.Contains("znomchane@gmail.com"))
            {
                return true;
            }

            return false;
        }

        public async Task SendApplicationDocumentData(string documentJson)
        {
            try
            {
                await SendRequest(documentJson, "integrations/sefa-api/documents");
            }
            catch (SystemException ex)
            {
                Logger.Error(ex.Message);
                throw;
            }
        }

        private JObject GetSefaLASJObject(string json)
        {
            dynamic propertiesJObj = JsonConvert.DeserializeObject<object>(json);

            if (propertiesJObj["sefaLAS"] != null)
                return propertiesJObj["sefaLAS"];

            return null;
        }

        public string GetEnquiryNumber(string propertiesJson)
        {
            var enquiryNo = string.Empty;

            if (propertiesJson == null)
                return enquiryNo;

            dynamic propertiesJObj = JsonConvert.DeserializeObject<object>(propertiesJson);

            if (propertiesJObj["sefaLAS"] != null)
                enquiryNo = (string)propertiesJObj["sefaLAS"].EnquiryNumber;

            return enquiryNo;
        }

        public string GetApplicationNo(string propertiesJson)
        {
            var appNp = string.Empty;

            if (propertiesJson == null)
                return appNp;

            dynamic propertiesJObj = JsonConvert.DeserializeObject<object>(propertiesJson);

            if (propertiesJObj["sefaLAS"] != null)
                appNp = (string)propertiesJObj["sefaLAS"].ApplicationNo;

            return appNp;
        }

        public JObject SetSefaLASObject(JObject sefaLASJObj, string propertiesJson)
        {
            if (propertiesJson == null)
                throw new ArgumentNullException(nameof(propertiesJson));

            dynamic propertiesJObj = JsonConvert.DeserializeObject<object>(propertiesJson);

            propertiesJObj["sefaLAS"] = sefaLASJObj["sefaLAS"];

            return propertiesJObj;
        }

        public async Task<JObject> GetDocumentBinaryData(int id)
        {
            var documentDto = await _documentsAppService.GetDocumentForView(id);

            var document = documentDto.Document;

            var file = await _binaryObjectManager.GetOrNullAsync(document.BinaryObjectId);
            var base64 = Convert.ToBase64String(file.Bytes, 0, file.Bytes.Length);

            var documentTypeListItem = await _documentAppServiceExt.GetDocumentListItemByTypeListId(document.Type);

            var fileNameAndExtList = document.FileName.Split(".").ToList();

            var documentFilename = fileNameAndExtList.First();
            var documentExt = "." + fileNameAndExtList.Last();

            var sefaDocumentObj = new SefaDocument()
            {
                Id = document.Id,
                Name = documentFilename,
                Category = documentTypeListItem.Details,
                Type = documentTypeListItem.ListId,
                DocumentContent = base64,
                Extension = documentExt
            };

            return JObject.Parse(JsonConvert.SerializeObject(sefaDocumentObj));
        }

        public async Task<JObject> SetApplicationNo(string applicationNo, string propertiesJson)
        {
            if (propertiesJson == null)
                throw new ArgumentNullException(nameof(propertiesJson));

            dynamic propertiesJObj = JsonConvert.DeserializeObject<object>(propertiesJson);

            var sefaLASJObj = propertiesJObj["sefaLAS"];

            if (sefaLASJObj == null)
                throw new SystemException("SefaLAS object not found in PropertiesJson");

            // set the application no
            sefaLASJObj["ApplicationNo"] = applicationNo;

            // set the sefaLAS object again
            propertiesJObj["sefaLAS"] = sefaLASJObj;

            return propertiesJObj;
        }
    }

}
