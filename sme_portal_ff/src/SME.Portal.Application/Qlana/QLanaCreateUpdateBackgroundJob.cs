using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SME.Portal.Authorization.Users;
using SME.Portal.Common.Dto;
using SME.Portal.Company;
using SME.Portal.Helpers;
using SME.Portal.SME;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

namespace SME.Portal.Qlana
{
    public class QLanaCreateUpdateBackgroundJob : BackgroundJob<QlanaEventTriggerDto>, ITransientDependency
    {
        private readonly IRepository<Owner, long> _ownerRepository;
        private readonly IRepository<Application, int> _applicationRepo;
        private readonly IRepository<SmeCompany, int> _smeCompaniesRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        private readonly UserManager _userManager;

        public QLanaCreateUpdateBackgroundJob( IRepository<Owner, long> ownerRepository,
                                          IRepository<Application, int> applicationRepo,
                                          IRepository<SmeCompany, int> smeCompaniesRepository,
                                          IUnitOfWorkManager unitOfWorkManager,
                                          UserManager userManager)
        {
            _ownerRepository = ownerRepository;
            _userManager = userManager;
            _applicationRepo = applicationRepo;
            _smeCompaniesRepository = smeCompaniesRepository;
            _unitOfWorkManager = unitOfWorkManager;
        }

        [UnitOfWork]
        public override void Execute(QlanaEventTriggerDto request)
        {
            try
            {


                using var uow = _unitOfWorkManager.Begin();
                using (UnitOfWorkManager.Current.SetTenantId(request.TenantId))
                {
                    Logger.Info($"Qlana integration job triggered for entity type:{request.EntityType}");

                    // Allow for SEFA only
                    if (request.TenantId != 3)
                    {
                        uow.Complete();
                        return;
                    }

                    //var authToken = Login();

                    //if (request.EntityType == QlanaEntityTypes.Contact && request.OwnerId.HasValue)
                    //    CreateUpdateContact(request, authToken);

                    //if (request.EntityType == QlanaEntityTypes.Company)
                    //    CreateUpdateCompany(request, authToken);

                    //if (request.EntityType == QlanaEntityTypes.Project)
                    //    CreateUpdateProject(request, authToken);

                    uow.Complete();
                }
            }
            catch (Exception x)
            {
                Logger.Error($"Qlana.CreateUpdateBackgroundJob failed with exception.Message:{x.Message}");
                throw x;
            }
        }

        private void CreateUpdateProject(QlanaEventTriggerDto request, string authToken, string companyUid = "", string contactUid = "")
        {
            var errorMessage = string.Empty;

            var application = _applicationRepo.Get((int)request.ApplicationId.Value);
            var company = _smeCompaniesRepository.Get(application.SmeCompanyId);
            var owner = _ownerRepository.FirstOrDefault(x => x.UserId == company.UserId);

            var applicationCriteria = NameValuePairDto.FromJson(application.MatchCriteriaJson).ToList();
            var loanAmt = applicationCriteria.FirstOrDefault(x => x.Name == "loanamount")?.Value;
            var projectName = $"{company.Name} - R{loanAmt}";

            if (string.IsNullOrEmpty(contactUid))
                contactUid = GetContactUid(owner.EmailAddress, authToken);

            if (string.IsNullOrEmpty(companyUid))
                companyUid = GetCompanyUid(company.Name, authToken);

            if (string.IsNullOrEmpty(companyUid) || string.IsNullOrEmpty(contactUid))
            {
                Logger.Error($"Failed to find Deal Owner({owner.EmailAddress}) OR Company({company.Name}) for Qlana Project Creation");
                return;
            }

            #region Project JObject creation

            #region Example Json 
            //{
            //    "project_twin": {
            //        "borrower_type": {
            //            "uid": "contact"
            //        }
            //    },
            //    "project_title": "TSS Project",
            //    "project_type": {
            //                      "uid": "11FFD5814054DD13E06634029136E461"
            //    },
            //    "project_company": {
            //                      "company": {
            //                          "uid": ""
            //                      }
            //                  },
            //    "project_contact": {
            //                      "contact": {
            //                          "uid": "11FFD5814054DD13E06634029136E461"
            //                      }
            //                  },
            //    "project_contact.is_primary": "1",
            //    "project_company.is_primary": "1"
            //}
            #endregion

            var borrowerTypeJObj = new JObject() {
                    { "borrower_type", new JObject() {
                            { "uid", "contact" }
                        }
                    }
                };
            var projectTwinJObj = new JObject() {
                     { "project_twin", borrowerTypeJObj }
                };
            var projectTypeJObj = new JObject() {
                     { "uid", "E837547753C62FD287A5EFC47C7482C7"},
                     { "code", "lrr"},
                     { "name", "Loan Restructuring Request" },
                     { "order", 3}
                };
            var companyJObj = new JObject() {
                     { "company", new JObject() {
                            {"uid", companyUid }
                        }
                     }
                };
            var contactJObj = new JObject() {
                     { "contact", new JObject() {
                            {"uid", contactUid }
                        }
                     }
                };
            var jsonObjStr = JsonConvert.SerializeObject(new JObject
                {
                    { "project_title", projectName },
                    { "project_twin", borrowerTypeJObj },
                    { "project_type", projectTypeJObj },
                    { "project_company", companyJObj },
                    { "project_contact", contactJObj },
                    { "project_contact.is_primary", "1" },
                    { "project_company.is_primary", "1" }
                });

            #endregion

            #region Qlana API integration - api/project/save-update/v1/

            var responseJson = SendRequest(jsonObjStr, "api/project/save-update/v1/", authToken);

            if (IsDataErrorResponse(responseJson, out errorMessage))
            {
                Logger.Error(errorMessage);
                return;
            }

            var projectCreateResponse = ProjectCreateResponseDto.FromJson(responseJson);

            var projectUid = projectCreateResponse.Data.Uid;

            Logger.Info($"Successful call to Qlana Project Save/Update for Project.Name:{projectName}");

            #endregion

            #region Facility JObject creation 

            #region example JSON
            //{
            //    "loan_currency": {
            //        "uid": "51C2E9F9C5F98900B6642FF8FA47249A"
            //    },
            //    "facility_type": {
            //        "uid": "11FFD5814054DD13E06634029136E461",
            //        "name": "",
            //        "code": ""
            //    },
            //    "facility_sub_type": {
            //                      "uid": "E837547753C62FD287A5EFC47C7482C7",
            //      "name": "",
            //      "code": "",
            //      "facility_type": {
            //                          "uid": "",
            //        "name": "",
            //        "code": ""
            //      }
            //                  },
            //    "name": "TSS Facility",
            //    "loan_amount": 20000,
            //    "loan_amt_in_words": "",
            //    "project": {
            //                      "uid": "64D9D9BE4A621E9C13A2C73404646655"
            //    },
            //    "stage": "origination"
            //}
            #endregion

            var loancurrencyJObj = new JObject() {
                { "uid", "D3A922661C1C10FB8476B8AB3636B381" }
            };
            var facilityTypeJObj = new JObject() {
                { "uid", "11FFD5814054DD13E06634029136E461" },
                { "name", "" },
                { "code", "" }
            };
            var facilitySubTypeJObj = new JObject() {
                { "uid", "E837547753C62FD287A5EFC47C7482C7" },
                { "name", "" },
                { "code", "" }
            };
            var facilityObjStr = JsonConvert.SerializeObject(new JObject {
                { "loan_currency", loancurrencyJObj },
                { "facility_type", facilityTypeJObj },
                { "facility_sub_type", facilitySubTypeJObj },
                { "name", projectName },
                { "loan_amount", int.Parse(loanAmt.Replace(" ","")) },
                { "loan_amt_in_words", ""},
                { "project", new JObject() {
                        { "uid", projectUid }
                    }
                },
                { "stage", "origination"},
            });

            #endregion

            #region Qlana API call - facility/save-update/v1/

            var facilityRespJson = SendRequest(facilityObjStr, "api/facility/save-update/v1/", authToken);

            if (IsDataErrorResponse(facilityRespJson, out errorMessage))
            {
                Logger.Error(errorMessage);
                return;
            }
            
            Logger.Info($"Successful call to Qlana Project Facility Save/Update for Facility.LoanAmt:{loanAmt}");

            #endregion

        }

        private void CreateUpdateCompany(QlanaEventTriggerDto request, string authToken)
        {
            var errorMessage = string.Empty;
            var company = _smeCompaniesRepository.Get((int)request.CompanyId.Value);
            var owner = _ownerRepository.FirstOrDefault(x => x.UserId == company.UserId);

            #region Company JObject creation

            #region Example Json
            //{
            //    "company_name": "TSS",
            //    "company_contact_info": {
            //        "email_address": "taurus.g@gmail.com",
            //        "company_telephone_country": {
            //             "uid": "ACE20BFC6651B87664C6D66BA2840F30"
            //        },
            //        "telephone": "9874632102"
            //    }
            //}
            #endregion

            var countryCodeJObj = new JObject {
                    { "uid", "5D25AC191CF328DD314E35981EDDA693" },
                    { "code", "ZA"},
                    { "isd_code", "27"},
                    { "name", "South Africa" }
                };

            var jsonObjStr = JsonConvert.SerializeObject(new JObject
                {
                    { "company_name", company.Name },
                    { "company_contact_info", new JObject {
                            { "email_address", owner.EmailAddress },
                            { "company_telephone_country", countryCodeJObj },
                            { "telephone", owner.PhoneNumber }
                        }
                    }
                });

            #endregion

            #region Qlana API integration

            var responseJson = SendRequest(jsonObjStr, "api/company/save-update/v1/", authToken);

            if (IsDataErrorResponse(responseJson, out errorMessage))
            {
                Logger.Error(errorMessage);
                return;
            }

            Logger.Info($"Successful call to Qlana Company Save/Update for Company.Name:{company.Name} Owner.Email:{owner.EmailAddress}");

            #endregion
        }

        private void CreateUpdateContact(QlanaEventTriggerDto request, string authToken)
        {
            var errorMessage = string.Empty;
            var owner = _ownerRepository.FirstOrDefault(x => x.Id == request.OwnerId.Value);

            #region Contact JObject creation

            #region Json example
            //{
            //    "salutation": {
            //        "uid": "mr"
            //    },
            //    "first_name": "Taurus",
            //    "middle_name": "",
            //    "last_name": "G",
            //    "contact_info": {
            //                      "email_address": "taurus.g@gmail.com",
            //      "contact_telephone_country": {
            //                          "uid": "ACE20BFC6651B87664C6D66BA2840F30"
            //      },
            //      "work_telephone": "9874632102"
            //    },
            //    "contact_type": {
            //                      "uid": "64D9D9BE4A621E9C13A2C73404646655"
            //    }
            //}
            #endregion

            var salutationJObj = new JObject {
                     { "uid", "mr" }
                };

            var contactTypeJObj = new JObject {
                     { "uid", "64D9D9BE4A621E9C13A2C73404646655" }
                };

            var countryCodeJObj = new JObject {
                    { "uid", "5D25AC191CF328DD314E35981EDDA693" },
                    { "code", "ZA"},
                    { "isd_code", "27"},
                    { "name", "South Africa" }
                };

            var contactInfoJObj = new JObject {
                     { "email_address", owner.EmailAddress },
                     { "contact_telephone_country", countryCodeJObj },
                     { "work_telephone", owner.PhoneNumber }
                 };

            var jsonObjStr = JsonConvert.SerializeObject(new JObject
                {
                    { "salutation", salutationJObj },
                    { "first_name", owner.Name },
                    { "last_name", owner.Surname },
                    { "contact_info", contactInfoJObj },
                    { "contact_type", contactTypeJObj }
                });

            #endregion

            #region Qlana API call 

            var responseJson = SendRequest(jsonObjStr, "api/contact/save-update/v1/", authToken);

            if (IsDataErrorResponse(responseJson, out errorMessage))
            {
                Logger.Error(errorMessage);
                return;
            }

            Logger.Info($"Successful call to Qlana Contact Save/Update for Email:{owner.EmailAddress}");
            
            #endregion
        }

        private string GetContactUid(string email, string authToken)
        {
            #region example json
            //{
            //    "page": 1,
            //    "rows": 10,
            //    "filter": {
            //          "email" : "gel.ssdd@gmail.com", 
            //          "phone" : ""
            //    },
            //    "globalFilter": {
            //          "fieldName": "globalFilter",
            //          "key": "globalFilter",
            //          "matchType": "any",
            //          "value": ""
            //    },
            //    "dependents": { },
            //    "sort": [
            //    {
            //          "key": "",
            //          "order": "ASC"
            //    }
            //    ]
            //}

            //var sortArrayJObj = JObject.Parse("[{'key', '' },{ 'order', 'ASC'}]");

            var jObjParams = JsonConvert.SerializeObject(new JObject
                {
                    { "page", 1 },
                    { "rows", 10},
                    { "filter", new JObject {
                            { "email", email },
                            { "phone", ""}
                        }},
                    { "globalFilter", new JObject() {
                            {"fieldName", "globalFilter"},
                            {"key", "globalFilter"},
                            {"matchType", "any"},
                            {"value", ""}
                        }},
                    { "dependents", new JObject() }
                });

            #endregion

            var responseJson = SendRequest(JsonConvert.SerializeObject(jObjParams), "api/contact/list/", authToken);

            var responseDto = SearchResponseDto.FromJson(responseJson);

            var contactUid = responseDto.Data.ListData.Rows.Where(x => x.ContactInfo.EmailAddress == email).First().Uid;

            return contactUid;
        }

        private string GetCompanyUid(string companyName, string authToken)
        {
            if (string.IsNullOrEmpty(companyName))
                throw new ArgumentNullException("companyName", "companyName parameter cannot be null or empty string");

            if (string.IsNullOrEmpty(authToken))
                throw new ArgumentNullException("authToken", "authToken parameter cannot be null or empty string");

            #region example json
            //{
            //    "page": 1,
            //    "rows": 10,
            //    "filter": {
            //        "companyName" : "",
            //        "customerId" : "100001",
            //        "email" : ""
            //    },
            //    "globalFilter": {
            //        "fieldName": "globalFilter",
            //        "key": "globalFilter",
            //        "matchType": "any",
            //        "value": ""
            //     },
            //     "dependents": { },
            //     "sort": [{
            //        "key": "",
            //        "order": "ASC"
            //     }]
            //}

            //var sortArrayJObj = JObject.Parse("[{'key', '' },{ 'order', 'ASC'}]");

            var jObjParams = JsonConvert.SerializeObject(new JObject
                {
                    { "page", 1 },
                    { "rows", 10},
                    { "filter", new JObject {
                            { "companyName", companyName },
                            //{ "customer_id",  },
                            { "email", "" }
                        }},
                    { "globalFilter", new JObject() {
                            {"fieldName", "globalFilter"},
                            {"key", "globalFilter"},
                            {"matchType", "any"},
                            {"value", ""}
                        }},
                    { "dependents", new JObject() }
                });
                        
            #endregion

            var responseJson = SendRequest(JsonConvert.SerializeObject(jObjParams), "api/company/list/", authToken);

            var responseDto = SearchResponseDto.FromJson(responseJson);

            var companyUid = responseDto.Data.ListData.Rows.Where(x => x.CompanyName == companyName).First().Uid;

            return companyUid;
        }

        private bool IsDataErrorResponse(string responseJson, out string errorMsg)
        {
            errorMsg = string.Empty;

            try
            {
                var dataError = DataError.FromJson(responseJson);
                
                errorMsg = $"Message:{dataError.Message}{Environment.NewLine} Error:{dataError.Data.Errors.FirstOrDefault()?.Msg}";
                
                return true;
            }
            catch (Exception)
            {
                
            }

            return false;
        }

        private string Login(string username = "Mable", string password = "Brd@2021")
        {
            var jsonObject = new JObject
            {
                { "appUserName", username },
                { "appPassword", password }
            };

            var responseJson = SendRequest(JsonConvert.SerializeObject(jsonObject), "login", null);
            
            if (!responseJson.Contains("success\":false"))
            {
                var response = LoginResponseDto.FromJson(responseJson);
                return response.Data.Token;
            }

            return string.Empty;
        }

        private string SendRequest(string jsonPayload, string endpoint, string authToken)
        {
            // Prod/Staging
            //var uriBuilder = new UriBuilder(UriHelper.CombineUri("https://dev-apis.zeroco.de/zc-v3.1-user-svc/2.0/finfind/api", directive));

            // Dev environment
            var uriBuilder = new UriBuilder(UriHelper.CombineUri("https://dev-apis.zeroco.de/zc-v3.1-user-svc/2.0/finfind/", endpoint));


            // create a query
            HttpClient httpClient = new HttpClient();

            HttpRequestMessage httpRequest = new HttpRequestMessage
            {
                RequestUri = uriBuilder.Uri,
                Method = HttpMethod.Post,
                Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
            };

            if(!string.IsNullOrEmpty(authToken) )
                httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            HttpResponseMessage response = AsyncHelper.RunSync(() => httpClient.SendAsync(httpRequest));

            var jsonResponse = AsyncHelper.RunSync(() => response.Content.ReadAsStringAsync());

            Logger.Info($"Call to Qlana api uri:{uriBuilder.Uri} payload:{jsonPayload} response:{jsonResponse}");

            return jsonResponse;
        }
    }
}
