using Abp.Authorization;
using Abp.BackgroundJobs;
using Abp.Domain.Repositories;
using SME.Portal.Authorization.Users;
using SME.Portal.Company.Dtos;
using SME.Portal.Company.Exporting;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.List;
using SME.Portal.Qlana;
using SME.Portal.Sme.Subscriptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using SME.Portal.Integrations;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace SME.Portal.Company
{
    [AbpAuthorize]
    public class SmeCompaniesAppServiceExt : SmeCompaniesAppService
    {
        private readonly IRepository<SmeCompany> _smeCompanyRepository;
        private readonly ISmeCompaniesExcelExporter _smeCompaniesExcelExporter;
        private readonly IRepository<User, long> _lookup_userRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;
        private readonly IListItemsAppService _listItemsAppService;
        private readonly IOwnerCompanyMappingAppService _ownerCompanyMappingAppService;
        private readonly ISmeSubscriptionsAppService _smeSubscriptionsAppService;
        private readonly IRepository<OwnerCompanyMap> _ownerCompanyMapRepository;
        private readonly ICPBAppService _cpbAppService;

        public SmeCompaniesAppServiceExt(IRepository<SmeCompany> smeCompanyRepository,
                                          ISmeCompaniesExcelExporter smeCompaniesExcelExporter,
                                          IRepository<User, long> lookup_userRepository,
                                          IBackgroundJobManager backgroundJobManager,
                                          IListItemsAppService listItemsAppService,
                                          IOwnerCompanyMappingAppService ownerCompanyMappingAppService,
                                          ISmeSubscriptionsAppService smeSubscriptionsAppService,
                                          IRepository<OwnerCompanyMap> ownerCompanyMapRepository,
                                          ICPBAppService cpbAppService)
            : base(smeCompanyRepository, smeCompaniesExcelExporter, lookup_userRepository)
        {
            _smeCompanyRepository = smeCompanyRepository;
            _smeCompaniesExcelExporter = smeCompaniesExcelExporter;
            _lookup_userRepository = lookup_userRepository;
            _backgroundJobManager = backgroundJobManager;
            _listItemsAppService = listItemsAppService;
            _ownerCompanyMappingAppService = ownerCompanyMappingAppService;
            _smeSubscriptionsAppService = smeSubscriptionsAppService;
            _ownerCompanyMapRepository = ownerCompanyMapRepository;
            _cpbAppService = cpbAppService;
        }

        public async Task<GetSmeCompanyForEditOutput> GetSmeCompanyForEditByUser()
        {
            long userId = (long)AbpSession.UserId;
            var userRecord = await _lookup_userRepository.FirstOrDefaultAsync((long)userId);
            if (userRecord != null && userRecord.IsOnboarded == false)
            {
                var companyRecord = await _smeCompanyRepository.FirstOrDefaultAsync(x => x.UserId == userId);
                if (companyRecord != null)
                {
                    var result = new GetSmeCompanyForEditOutput { SmeCompany = ObjectMapper.Map<CreateOrEditSmeCompanyDto>(companyRecord) };
                    return result;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        public async Task<GetSmeCompanyForViewDto> GetSmeCompanyForViewByUser()
        {
            long userId = (long)AbpSession.UserId;
            var smeCompanyDto = await _smeCompanyRepository.FirstOrDefaultAsync(x => x.UserId == userId);
            if (smeCompanyDto == null)
            {
                return new GetSmeCompanyForViewDto { SmeCompany = null, UserName = null };
            }
            else
            {
                return await GetSmeCompanyForView(smeCompanyDto.Id);
            }
        }

        public async Task<List<GetSmeCompanyForViewDto>> GetSmeCompaniesForViewByUser(bool isPrimaryOwner = true)
        {
            if (AbpSession.UserId == null)
                throw new SystemException("Current User Session has expired");

            var mapList = _ownerCompanyMapRepository.GetAll().Where(x => x.UserId == AbpSession.UserId).ToList();

            List<GetSmeCompanyForViewDto> companyList = new List<GetSmeCompanyForViewDto>();

            foreach (var map in mapList)
            {
                SmeCompany smeCompany = _smeCompanyRepository.FirstOrDefault(x => x.Id == map.SmeCompanyId);

                var company = new GetSmeCompanyForViewDto { SmeCompany = ObjectMapper.Map<SmeCompanyDto>(smeCompany) };

                company.IsPrimaryOwner = map.IsPrimaryOwner;

                var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)smeCompany.UserId);
                company.UserName = _lookupUser?.Name?.ToString();

                if (company != null)
                {
                    companyList.Add(company);
                }
            }

            return companyList.Where(x => x.IsPrimaryOwner).ToList();
        }

        protected override async Task<int> Create(CreateOrEditSmeCompanyDto input)
        {
            if (input.StartedTradingDate != null)
            {
                input.StartedTradingDate = FixDate((DateTime)input.StartedTradingDate);
            }
            if (input.RegistrationDate != null)
                input.RegistrationDate = FixDate((DateTime)input.RegistrationDate);

            return await base.Create(input);
        }

        protected override async Task<int> Update(CreateOrEditSmeCompanyDto input)
        {
            if (input.StartedTradingDate != null)
            {
                input.StartedTradingDate = FixDate((DateTime)input.StartedTradingDate);
            }
            if (input.RegistrationDate != null)
                input.RegistrationDate = FixDate((DateTime)input.RegistrationDate);

            var smeCompany = await _smeCompanyRepository.FirstOrDefaultAsync((int)input.Id);

            ObjectMapper.Map(input, smeCompany);

            return smeCompany.Id;
        }

        private DateTime FixDate(DateTime dateTime)
        {
            DateTime temp = dateTime.ToUniversalTime();
            return Convert.ToDateTime(temp.ToString("u"));
        }

		public bool DoesCompanyExistEx(string id, string registrationNumber)
		{
			var existingCompanyDto = _smeCompanyRepository.GetAll().FirstOrDefault(x => x.RegistrationNumber.Replace("/", "") == registrationNumber.Replace("/", "") && x.Id.ToString() != id);
			return existingCompanyDto != null;
		}

		public SmeCompany DoesCompanyExist(DoesCompanyExistArgs input)
        {
            if(input.Id != null)
                return _smeCompanyRepository.GetAll().FirstOrDefault(x => x.Id == input.Id);

            var existingCompanyDto = _smeCompanyRepository.GetAll().FirstOrDefault(x => x.RegistrationNumber.Replace("/", "") == input.RegistrationNumber.Replace("/", ""));
            return existingCompanyDto;
        }

        public Task<bool> IsPrimaryOwner(int companyId)
        {
            long userId = (long)AbpSession.UserId;
            var ownerCompanyRecord = _ownerCompanyMapRepository.GetAll().FirstOrDefault(x => x.SmeCompanyId == companyId && x.CreatorUserId == userId);
            if (ownerCompanyRecord == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                return Task.FromResult(ownerCompanyRecord.IsPrimaryOwner);
            }
        }

        public override async Task<int> CreateOrEdit(CreateOrEditSmeCompanyDto input)
        {
            #region Validation and Business Rules

            // check the user session is valid
            if (!AbpSession.UserId.HasValue)
                throw new SystemException("There is no current user session for the request");

            // ensure a Company with the same Registration Number does not already exist
            if (!string.IsNullOrEmpty(input.RegistrationNumber))
            {
                var existingCompanyDto = _smeCompanyRepository.GetAll().FirstOrDefault(x => x.RegistrationNumber == input.RegistrationNumber);

                if (existingCompanyDto != null)
                {
                    // add a mapping for this owner and company combo if not exists and return existing companyId
                    if (_ownerCompanyMapRepository.GetAll().Any(x => x.OwnerId != input.OwnerId && x.SmeCompanyId == existingCompanyDto.Id))
                    {
                        await _ownerCompanyMappingAppService.CreateOrEdit(new CreateOrEditOwnerCompanyMapDto()
                        {
                            OwnerId = input.OwnerId,
                            SmeCompanyId = existingCompanyDto.Id,
                            IsPrimaryOwner = false
                        });

                        return existingCompanyDto.Id;
                    }
                }
            }

            #endregion

            #region Create the Company record, OwnerCompanyMap, and Default SmeSubscription

            if (input.StartedTradingDate != null)
            {
                input.StartedTradingDate = FixDate((DateTime)input.StartedTradingDate);
            }
            if (input.RegistrationDate != null)
            {
                input.RegistrationDate = FixDate((DateTime)input.RegistrationDate);
            }
            input.UserId = AbpSession.UserId.Value;

            // call base class method
            var companyId = await base.CreateOrEdit(input);
            var ownerId = input.OwnerId ?? null;

            // add the OwnerCompanyMapping and default SmeSubscription
            if (input.Id == null)
            {
                var ownerCompanyMapId = await _ownerCompanyMappingAppService.CreateOrEdit(new CreateOrEditOwnerCompanyMapDto()
                {
                    IsPrimaryOwner = true,
                    SmeCompanyId = companyId,
                    OwnerId = ownerId
                });

                await _smeSubscriptionsAppService.CreateOrEdit(new Sme.Subscriptions.Dtos.CreateOrEditSmeSubscriptionDto()
                {
                    StartDate = DateTime.Now,
                    Status = SmeSubscriptionStatus.Default.ToString(),
                    OwnerCompanyMapId = ownerCompanyMapId,
                    EditionId = PortalConsts.DefaultEditionId
                });
            }

            #endregion

            #region Create HubSpot Company Job and queue

            // queue the job to add Owner/contact to crm
            await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
            {
                TenantId = (int)AbpSession.TenantId,
                SmeCompanyId = companyId,
                OwnerId = ownerId,
                EventType = HubSpotEventTypes.CreateEdit,
                HSEntityType = HubSpotEntityTypes.companies,
                UserJourneyPoint = UserJourneyContextTypes.OnboardingCompleted
            }, BackgroundJobPriority.Normal);

            #endregion

            #region Queue the job to add Company to Qlana

            //await _backgroundJobManager.EnqueueAsync<QLanaCreateUpdateBackgroundJob, QlanaEventTriggerDto>(new QlanaEventTriggerDto()
            //{
            //    TenantId = (int)AbpSession.TenantId,
            //    CompanyId = companyId,
            //    OwnerId = ownerId,
            //    EntityType = QlanaEntityTypes.Company,
            //}, BackgroundJobPriority.Normal);

            #endregion

            return companyId;
        }

        public Task<bool> ExistForUser(int companyId, long userId, bool isPrimaryOwner = true)
        {
            return Task.FromResult(_ownerCompanyMapRepository.GetAll().Any(x => x.SmeCompanyId == companyId && x.CreatorUserId == userId && x.IsPrimaryOwner == isPrimaryOwner));
        }

        public OwnerCompanyMapDto GetOwnerCompanyMapForView(int companyId, long userId, bool isPrimaryOwner = true)
        {
            var record = _ownerCompanyMapRepository.GetAll().FirstOrDefault(x => x.SmeCompanyId == companyId && x.CreatorUserId == userId && x.IsPrimaryOwner == isPrimaryOwner);

            return ObjectMapper.Map<OwnerCompanyMapDto>(record);
        }

        override public async Task<bool> BackgroundChecksResult(int id)
        {
            var company = await _smeCompanyRepository.GetAsync(id);

            if (company == null)
                return false;

            dynamic jsonObj = JsonConvert.DeserializeObject<object>(company.PropertiesJson);

            try
            {
                string passed = jsonObj["basic-screening-checks"]["Success"];

                return (passed != null && passed == "True");
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<string> BasicScreeningCheck(int companyId)
        {
            var checks = new Dictionary<string, string>();
            var verificationsRecords = new Dictionary<string, JObject>();
            var smeCompany = await _smeCompanyRepository.GetAsync(companyId);

            dynamic verificationJObj = null;

            if (!string.IsNullOrEmpty(smeCompany.VerificationRecordJson))
                verificationJObj = JsonConvert.DeserializeObject<object>(smeCompany.VerificationRecordJson);

            dynamic propertiesJObj = JsonConvert.DeserializeObject<object>(smeCompany.PropertiesJson);

            // basic checks
            checks.Add("Industry Sector", BR01IndustrySectorCheck(propertiesJObj, verificationsRecords));
            checks.Add("Company Type", BR02CompanyTypeCheck(smeCompany, propertiesJObj, verificationJObj, verificationsRecords));

            checks.Add("Commercial Defaults/Judgements", await BR03CommercialDefaultsJudgementsCheck(smeCompany, verificationsRecords));
            checks.Add("Directors Under Debt Review", await BR03DirectorsUnderDebtReviewChecks(smeCompany, propertiesJObj, verificationJObj, verificationsRecords));
            checks.Add("South African Registered Company", BR04SARegisteredCompanyCheck(smeCompany, verificationJObj));
            checks.Add("CIPC Annual Fees Paid", BR05CIPCAnnualFeesPaidCheck(smeCompany));
            
            var basicScreeningCheckJson = JsonConvert.SerializeObject(new SmeCompanyBackgroundCheckResult() 
            { 
                Success = !checks.Any(x => x.Value.Contains("FAILED")), 
                Checks = checks,
                VerificationRecords = verificationsRecords
            });

            // write the propertiesJson with basic-screening-checks result json
            propertiesJObj["basic-screening-checks"] = JObject.Parse(basicScreeningCheckJson);

            //smeCompany.PropertiesJson = propertiesJObj.ToString();
			smeCompany.PropertiesJson = JsonConvert.SerializeObject(propertiesJObj);
			await _smeCompanyRepository.UpdateAsync(smeCompany);

            return basicScreeningCheckJson;
        }

		public async Task<string> BasicScreeningCheckECDC(int companyId)
		{
			var checks = new Dictionary<string, string>();
			var verificationsRecords = new Dictionary<string, JObject>();
			var smeCompany = await _smeCompanyRepository.GetAsync(companyId);

			dynamic verificationJObj = null;

			if(!string.IsNullOrEmpty(smeCompany.VerificationRecordJson))
				verificationJObj = JsonConvert.DeserializeObject<object>(smeCompany.VerificationRecordJson);

			dynamic propertiesJObj = JsonConvert.DeserializeObject<object>(smeCompany.PropertiesJson);

			// basic checks
			checks.Add("Industry Sector", BR01IndustrySectorCheckECDC(propertiesJObj, verificationsRecords));
			checks.Add("Company Type", BR02CompanyTypeCheckECDC(smeCompany, propertiesJObj, verificationJObj, verificationsRecords));
			checks.Add("Province Code", BR06ProvinceCodeCheckECDC(smeCompany, propertiesJObj, verificationJObj, verificationsRecords));

			checks.Add("Commercial Defaults/Judgements", await BR03CommercialDefaultsJudgementsCheckECDC(smeCompany, propertiesJObj, verificationsRecords));
			checks.Add("Directors Under Debt Review", await BR03DirectorsUnderDebtReviewChecksECDC(smeCompany, propertiesJObj, verificationJObj, verificationsRecords));
			checks.Add("South African Registered Company", BR04SARegisteredCompanyCheckECDC(smeCompany, propertiesJObj, verificationJObj));
			checks.Add("CIPC Annual Fees Paid", BR05CIPCAnnualFeesPaidCheckECDC(smeCompany, propertiesJObj, verificationJObj));

			var basicScreeningCheckJson = JsonConvert.SerializeObject(new SmeCompanyBackgroundCheckResult()
			{
				Success = !checks.Any(x => x.Value.Contains("FAILED")),
				Checks = checks,
				VerificationRecords = verificationsRecords
			});

			// write the propertiesJson with basic-screening-checks result json
			propertiesJObj["basic-screening-checks"] = JObject.Parse(basicScreeningCheckJson);

			smeCompany.PropertiesJson = JsonConvert.SerializeObject(propertiesJObj);

			//smeCompany.PropertiesJson = propertiesJObj.ToString();
			await _smeCompanyRepository.UpdateAsync(smeCompany);

			return basicScreeningCheckJson;
		}

		private async Task<string> BR03DirectorsUnderDebtReviewChecks(SmeCompany company, dynamic propertiesJObj, dynamic verificationJObj, Dictionary<string, JObject> verificationRecords)
        {
            long userId = (long)AbpSession.UserId;
            var userRecord = await _lookup_userRepository.FirstOrDefaultAsync((long)userId);

            if (!userRecord.IsOwner)
            {
                return "SKIPPED";
            }

            // if the company type is sole prop or parntership we skip
            if (company.Type == "5a6ab7ce506ea818e04548ad" || company.Type == "5a6ab7d3506ea818e04548b0")
                return "SKIPPED";
            
            // skip registered not listed
            if (propertiesJObj.companyCipcStatus == "RegisteredNotListed")
                return "SKIPPED";

            if (verificationJObj == null)
                return "FAILED";

            //Do a credit check for the owner only
            var idNumber = userRecord.IdentityOrPassport;
            var debtReviewJson = await _cpbAppService.DebtReviewBy(idNumber);

            dynamic debtReviewJObj = JsonConvert.DeserializeObject<object>(debtReviewJson);

            if (!verificationRecords.ContainsKey($"DirectorsUnderDebtReview_{idNumber}"))
                verificationRecords.Add($"DirectorsUnderDebtReview_{idNumber}", debtReviewJObj);

            if ((int)debtReviewJObj.TotalRecords != 0)
                return $"FAILED - Director with ID Number:{idNumber} in debt review.";

            //var directorsArray = verificationJObj.directors;
            //foreach (var director in directorsArray)
            //{
            //    var idNumber = (string)director.idNumber;
            //    var debtReviewJson = await _cpbAppService.DebtReviewBy(idNumber);

            //    dynamic debtReviewJObj = JsonConvert.DeserializeObject<object>(debtReviewJson);

            //    if(!verificationRecords.ContainsKey($"DirectorsUnderDebtReview_{idNumber}"))
            //        verificationRecords.Add($"DirectorsUnderDebtReview_{idNumber}", debtReviewJObj);

            //    if ((int)debtReviewJObj.TotalRecords != 0)
            //        return $"FAILED - Director with ID Number:{idNumber} in debt review.";
            //}

            return "PASSED";
        }

		private async Task<string> BR03DirectorsUnderDebtReviewChecksECDC(
			SmeCompany company,
			dynamic propertiesJObj,
			dynamic verificationJObj,
			Dictionary<string, JObject> verificationRecords
		)
		{
			long userId = (long)AbpSession.UserId;
			var userRecord = await _lookup_userRepository.FirstOrDefaultAsync((long)userId);

			if(!userRecord.IsOwner)
			{
				return "SKIPPED";
			}

			// if the company type is sole prop or parntership we skip
			if(company.Type == "5a6ab7ce506ea818e04548ad" || company.Type == "5a6ab7d3506ea818e04548b0")
				return "SKIPPED";

			// skip registered not listed
			if(	propertiesJObj.companyCipcStatus == "RegisteredNotListed" ||
				propertiesJObj.companyCipcStatus == "NotRegistered")
			{
				return "SKIPPED";
			}

			if(verificationJObj == null)
				return "FAILED";

			//Do a credit check for the owner only
			var idNumber = userRecord.IdentityOrPassport;
			var debtReviewJson = await _cpbAppService.DebtReviewBy(idNumber);

			dynamic debtReviewJObj = JsonConvert.DeserializeObject<object>(debtReviewJson);

			if(!verificationRecords.ContainsKey($"DirectorsUnderDebtReview_{idNumber}"))
				verificationRecords.Add($"DirectorsUnderDebtReview_{idNumber}", debtReviewJObj);

			if((int)debtReviewJObj.TotalRecords != 0)
				return $"FAILED - Director with ID Number:{idNumber} in debt review.";

			return "PASSED";
		}

		private string BR05CIPCAnnualFeesPaidCheck(SmeCompany company)
        {
            // if the company type is sole prop or partnership we skip
            if (company.Type == "5a6ab7ce506ea818e04548ad" || company.Type == "5a6ab7d3506ea818e04548b0")
                return "SKIPPED";

            return "PASSED";
        }

		private string BR05CIPCAnnualFeesPaidCheckECDC(
			SmeCompany company,
			dynamic propertiesJObj,
			dynamic verificationJObj
		)
		{
			// if the company type is sole prop or partnership we skip
			if(company.Type == "5a6ab7ce506ea818e04548ad" || company.Type == "5a6ab7d3506ea818e04548b0")
			{
				return "SKIPPED";
			}
			if(	propertiesJObj.companyCipcStatus != "RegisteredNotListed" &&
				propertiesJObj.companyCipcStatus != "NotRegistered" &&
				verificationJObj == null)
			{
				return "FAILED";
			}
			return "PASSED";
		}

		private string BR04SARegisteredCompanyCheck(SmeCompany company, dynamic verificationJObj)
        {
            // if the company type is sole prop or partnership we skip
            if (company.Type == "5a6ab7ce506ea818e04548ad" || company.Type == "5a6ab7d3506ea818e04548b0")
                return "SKIPPED";

            // verification record
            if (verificationJObj == null)
                return "FAILED";

            return "PASSED";
        }

		private string BR04SARegisteredCompanyCheckECDC(
			SmeCompany company,
			dynamic propertiesJObj,
			dynamic verificationJObj
		)
		{
			// if the company type is sole prop or partnership we skip. The only way for this to hold is for a business NotRegistered.
			if(company.Type == "5a6ab7ce506ea818e04548ad" || company.Type == "5a6ab7d3506ea818e04548b0")
			{
				return "SKIPPED";
			}
			if(propertiesJObj.companyCipcStatus != "RegisteredNotListed" &&
				propertiesJObj.companyCipcStatus != "NotRegistered" &&
				verificationJObj == null)
			{
				return "FAILED";
			}
			return "PASSED";
		}

		private async Task<string> BR03CommercialDefaultsJudgementsCheck(SmeCompany company, Dictionary<string, JObject> verificationRecords)
        {
            // if the company type is sole prop or partnership we skip
            if (company.Type == "5a6ab7ce506ea818e04548ad" || company.Type == "5a6ab7d3506ea818e04548b0")
                return "SKIPPED";

            var filters = new List<string>();

            var defaultsJson = await _cpbAppService.CommercialDefaults(company.RegistrationNumber, "Fraud Investigation", "Current Defaults", "", "10", filters);
            var judgementsJson = await _cpbAppService.CommercialJudgements(company.RegistrationNumber, "Fraud Investigation", "Current Judgements", "", "10", filters);

            dynamic defaultsJObj = JsonConvert.DeserializeObject<object>(defaultsJson);
            dynamic judgementsJObj = JsonConvert.DeserializeObject<object>(judgementsJson);

            verificationRecords.Add("CommercialDefaults", defaultsJObj);
            verificationRecords.Add("CommercialJudgements", judgementsJObj);

            if ((int)defaultsJObj.TotalRecords != 0)
                return $"FAILED - Company with Registration Number:{company.RegistrationNumber} has commercial defaults listed.";

            if ((int)judgementsJObj.TotalRecords != 0)
                return $"FAILED - Company with Registration Number:{company.RegistrationNumber} has commercial judgements listed.";

            return "PASSED";
        }

		private async Task<string> BR03CommercialDefaultsJudgementsCheckECDC(
			SmeCompany company,
			dynamic propertiesJObj,
			Dictionary<string, JObject> verificationRecords
		)
		{
			// if the company type is sole prop or partnership we skip
			if(company.Type == "5a6ab7ce506ea818e04548ad" || company.Type == "5a6ab7d3506ea818e04548b0")
				return "SKIPPED";

			if(	//propertiesJObj.companyCipcStatus == "RegisteredNotListed" ||
				propertiesJObj.companyCipcStatus == "NotRegistered")
			{
				return "SKIPPED";
			}

			var filters = new List<string>();

			var defaultsJson = await _cpbAppService.CommercialDefaults(company.RegistrationNumber, "Fraud Investigation", "Current Defaults", "", "10", filters);
			var judgementsJson = await _cpbAppService.CommercialJudgements(company.RegistrationNumber, "Fraud Investigation", "Current Judgements", "", "10", filters);

			dynamic defaultsJObj = JsonConvert.DeserializeObject<object>(defaultsJson);
			dynamic judgementsJObj = JsonConvert.DeserializeObject<object>(judgementsJson);

			verificationRecords.Add("CommercialDefaults", defaultsJObj);
			verificationRecords.Add("CommercialJudgements", judgementsJObj);

			if((int)defaultsJObj.TotalRecords != 0)
				return $"FAILED - Company with Registration Number:{company.RegistrationNumber} has commercial defaults listed.";

			if((int)judgementsJObj.TotalRecords != 0)
				return $"FAILED - Company with Registration Number:{company.RegistrationNumber} has commercial judgements listed.";

			return "PASSED";
		}

		private string BR02CompanyTypeCheck(SmeCompany company, dynamic propertiesJObj, dynamic verificationJObj, Dictionary<string, JObject> verificationRecords)
        {
            // if the company type is sole prop or partnership we PASS
            if (company.Type == "5a6ab7ce506ea818e04548ad" || company.Type == "5a6ab7d3506ea818e04548b0")
                return "PASSED";

            // skip registered not listed
            if(propertiesJObj.companyCipcStatus == "RegisteredNotListed")
                return "SKIPPED";

            // verification record
            if (verificationJObj == null)
                return "FAILED";

            verificationRecords.Add("Company", verificationJObj );

            var companyTypeCode = (string)verificationJObj.companyTypeCode;
            var registrationType = (string)verificationJObj.companyRegistrationType;

            var inclusions = new Dictionary<string, string>()
            {
                { "06","PUBLIC COMPANY"},
                { "07","PRIVATE COMPANY"},
                { "08","ARTICLE 21"},
                { "09","LIMITED BY GUARANTEE"},
                { "10","EXTERNAL COMPANY"},
                { "12","EXTERNAL COMPANY UNDER SECTION 21A"},
                { "21","INC"},
                { "22","UNLIMITED"},
                { "23","CLOSE CORPORATION"},
                { "24","PRIMARY COOPERATIVE"},
                { "25","SECONDARY COOPERATIVE"},
                { "26","TERTIARY COOPERATIVE"},
                { "31","STATUTORY BODY"}
            };

            if (!inclusions.ContainsKey(companyTypeCode))
                return $"FAILED - Company Type:{registrationType} Code:{companyTypeCode} prohibited.";

            return "PASSED";
        }

		private string BR01IndustrySectorCheck(dynamic propertiesJObj, Dictionary<string, JObject> verificationRecords)
        {
            verificationRecords.Add("IndustrySector", propertiesJObj["industry"]);

            var industrySectorGuid = propertiesJObj.industry.Guid;
            //var industrySectorClass = propertiesJObj.industry.Class;
            var industrySectorSubClass = (string)propertiesJObj.industry.Subclass;

            // Growing of tobacco
            if (industrySectorSubClass == "1150")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Tobacco growing";

            // Manufacture of tobacco products
            if (industrySectorSubClass == "12000")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Manufacture of tobacco products";

            // Machinery for preparation of tobacco manufacturing
            if (industrySectorSubClass == "28250")
            {
                if (industrySectorGuid == "62220beade5c0136ec2a4695" ||
                    industrySectorGuid == "62220beade5c0136ec2a4696" ||
                    industrySectorGuid == "62220beade5c0136ec2a4697" ||
                    industrySectorGuid == "62220beade5c0136ec2a46a1" ||
                    industrySectorGuid == "62220beade5c0136ec2a46a3" ||
                    industrySectorGuid == "62220beade5c0136ec2a46a7" ||
                    industrySectorGuid == "62220beade5c0136ec2a46b5" ||
                    industrySectorGuid == "62220beade5c0136ec2a46c3" ||
                    industrySectorGuid == "62220beade5c0136ec2a46ce" ||
                    industrySectorGuid == "62220beade5c0136ec2a46d0" ||
                    industrySectorGuid == "62220beade5c0136ec2a46dd" )
                { 
                    return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Machinery for preparation of tobacco manufacturing";
                }
            }

            // Wholesale of tobacco products
            if (industrySectorSubClass == "46303")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Wholesale of tobacco products";

            // Retail sale in non-specialized stores with food, beverages or tobacco predominating
            if (industrySectorSubClass == "47110")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Retail sale in non-specialized stores with food, beverages or tobacco predominating";

            // Retail sale of tobacco products in specialised stores
            if (industrySectorSubClass == "47230")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Retail sale of tobacco products in specialised stores";

            // Retail sale via stalls and markets of food, beverages and tobacco products
            if (industrySectorSubClass == "47710")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Retail sale via stalls and markets of food, beverages and tobacco products";

            // Distilling, rectifying and blending of spirits
            if (industrySectorSubClass == "11010")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Distilling, rectifying and blending of spirits";

            // Manufacture of wines
            if (industrySectorSubClass == "11020")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Manufacture of wines";

            // Manufacture of malt liquors such as beer, ale, porter and stout
            if (industrySectorSubClass == "11031")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Manufacture of malt liquors such as beer, ale, porter and stout";

            // Manufacture of sorghum beer
            if (industrySectorSubClass == "11032")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Manufacture of sorghum beer";

            // Manufacture of malt
            if (industrySectorSubClass == "11033")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Manufacture of malt";

            // Gambling and betting activities
            if (industrySectorSubClass == "92000")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Gambling and betting activities";

            // Manufacture of rubber sex articles
            if (industrySectorSubClass == "22190")
            { 
                if (industrySectorGuid == "62220cda013e151a9163679b" ||
                    industrySectorGuid == "62220cda013e151a916367a5" ||
                    industrySectorGuid == "62220cda013e151a916367df") 
                    {                 
                        return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Manufacture of rubber sex articles";
                    }
            }

            // Escort agency operation (Other personal service activities n.e.c)
            if (industrySectorSubClass == "96090")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Other personal service activities n.e.c";

            // Manufacture of weapons and ammunition
            if (industrySectorSubClass == "25200")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Manufacture of weapons and ammunition";

            // Activities of employment placement agencies
            if (industrySectorSubClass == "78100")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Activities of employment placement agencies";

            // Temporary employment agency activities
            if (industrySectorSubClass == "78200")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Temporary employment agency activities";

            // Activities of political organizations
            if (industrySectorSubClass == "94920")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Activities of political organizations";

            // Real estate activities with own or leased property (renting)
            if (industrySectorSubClass == "68100")
                return $"FAILED - Industry sector prohibited - {industrySectorSubClass} Real estate activities with own or leased property (renting)";

            return "PASSED";
        }

		private string BR02CompanyTypeCheckECDC(
			SmeCompany company,
			dynamic propertiesJObj,
			dynamic verificationJObj,
			Dictionary<string, JObject> verificationRecords
		)
		{
			// Registered and listed company with a verification record of null means something went wrong.
			if(propertiesJObj.companyCipcStatus != "RegisteredNotListed" &&
				propertiesJObj.companyCipcStatus != "NotRegistered" &&
				verificationJObj == null)
			{
				return "FAILED";
			}
			if(verificationJObj != null)
			{
				verificationRecords.Add("Company", verificationJObj);
			}
			// Code 06.
			if(company.Type == "5a6ab7d8506ea818e04548b1")
			{
				return $"FAILED - Company Type:Public Company Code:06 prohibited.";
			}
			// Code 08.
			if(company.Type == "5a6ab809506ea818e04548b3")
			{
				return $"FAILED - Company Type:Not for Profit Organisation (NPO) Code:08 prohibited.";
			}
			if(company.Type == "5a6ab80c506ea818e04548b5")
			{
				return $"FAILED - Company Type:Section 21 Code:08 prohibited.";
			}
			if(company.Type == "5a6ab817506ea818e04548b7")
			{
				return $"FAILED - Company Type:Public Benefit Organisation Code:08 prohibited.";
			}
			if(company.Type == "5c3cdda7261c1e011c7b67c6")
			{
				return $"FAILED - Company Type:Non Profit Company (NPC) Code:08 prohibited.";
			}
			if(company.Type == "5a6ab80b506ea818e04548b4")
			{
				return $"FAILED - Company Type:Non-Government Organisation (NGO) Code:08 prohibited.";
			}
			// Code 30.
			if(company.Type == "63ef3fe2677df4624d35deb7")
			{
				return $"FAILED - Company Type:State owned Company (SOC Ltd) Code:30 prohibited.";
			}
			// 06 (5a6ab7d8506ea818e04548b1)
			// 08 (5a6ab809506ea818e04548b3, 5a6ab80c506ea818e04548b5, 5a6ab817506ea818e04548b7, 5c3cdda7261c1e011c7b67c6, 5a6ab80b506ea818e04548b4)
			// 30 (63ef3fe2677df4624d35deb7)

			return "PASSED";
		}

		private string[] IndustrySectorExclusions_ECDC(
			string industrySectorGuid
		)
		{
			string [,] industrySectorGuidArr = 
			{
				{ "62220d3fb1b2c7508c7a9f91", "01610", "Farm labour contractors activities" },
				{ "62220cda013e151a916367a5", "22190", "Manufacture of rubber sex articles" },
				{ "62220bc604e69b315d773e47", "32400", "Gambling machines and equipment manufacturing" },
				{ "62220b92a20a493bd4234489", "46520", "Electronic gambling machine wholesaling" },
				{ "62220b4d501cdd6ad246f599", "47520", "Sex shop operation" },
				{ "62220b10e04bae05be7562ee", "78200", "Contract labour rental services" },
				{ "62220b10e04bae05be7562ef", "78200", "Contract labour supply service" },
				{ "62220b10e04bae05be7562f0", "78200", "Labour rental services" },
				{ "62220b10e04bae05be7562f1", "78200", "Labour-broking activities" },
				{ "62220b10e04bae05be7562f2", "78200", "Nursing placement agency employing on contract basis, providing training to staff" },
				{ "62220b10e04bae05be7562f3", "78200", "Outplacement services" },
				{ "62220b10e04bae05be7562f4", "78200", "Supplying workers to clients' businesses for limited periods of time to temporarily replace or supplement the working force of the client, where the individuals provided are employees of the temporary help service unit (Units do not provide direct supervi" },
				{ "62220b10e04bae05be7562f5", "78200", "Temporary employment agency activities" },
				{ "62220b10e04bae05be7562f6", "78200", "Temporary labour hire" },
				{ "62220b10e04bae05be7562f7", "78200", "Tradesman rental services" },
				{ "62220ade04e69b315d7739b2", "92000", "Activities of off-track betting" },
				{ "62220ade04e69b315d7739b3", "92000", "Automatic totalisator servicing" },
				{ "62220ade04e69b315d7739b4", "92000", "Betting shop operation" },
				{ "62220ade04e69b315d7739b5", "92000", "Bookmaker operation, independent" },
				{ "62220ade04e69b315d7739b6", "92000", "Bookmaking and other betting operations" },
				{ "62220ade04e69b315d7739b7", "92000", "Casino operation (including floating casino's)" },
				{ "62220ade04e69b315d7739b8", "92000", "Football pools operation" },
				{ "62220ade04e69b315d7739b9", "92000", "Gambling and betting activities" },
				{ "62220ade04e69b315d7739ba", "92000", "Gambling operation" },
				{ "62220ade04e69b315d7739bb", "92000", "Gambling services, such as lotteries" },
				{ "62220ade04e69b315d7739bc", "92000", "Gaming machine operation" },
				{ "62220ade04e69b315d7739bd", "92000", "Lottery agency operation" },
				{ "62220ade04e69b315d7739be", "92000", "Lottery operation" },
				{ "62220ade04e69b315d7739bf", "92000", "Lottery ticket selling agency" },
				{ "62220ade04e69b315d7739c0", "92000", "Off-course betting operation" },
				{ "62220ade04e69b315d7739c1", "92000", "Operation of casinos, including “floating casinos" },
				{ "62220ade04e69b315d7739c2", "92000", "Operation of coin-operated gambling machines" },
				{ "62220ade04e69b315d7739c3", "92000", "Operation of virtual gambling web sites" },
				{ "62220ade04e69b315d7739c4", "92000", "Race course betting" },
				{ "62220ade04e69b315d7739c5", "92000", "Racing tipster activity" },
				{ "62220ade04e69b315d7739c6", "92000", "Sale of lottery tickets" },
				{ "62220ade04e69b315d7739c7", "92000", "Tab operation" },
				{ "62220ade04e69b315d7739c8", "92000", "Totalisator agency board operation" },
				{ "62220ade04e69b315d773902", "93290", "Operation (exploitation) of coin-operated games (for operation (exploitation) of coin-operated gambling machines" },
				{ "62220ade04e69b315d7738a3", "94920", "Activities of political auxiliary organizations such as young people's auxiliaries associated with a political party" },
				{ "62220ade04e69b315d7738a4", "94920", "Activities of political organizations" },
				{ "62220ade04e69b315d7738a5", "94920", "Political association operation" },
				{ "62220ade04e69b315d7738a6", "94920", "Political organisation activities" },
				{ "62220ade04e69b315d7738a7", "94920", "Political party operation" },
				{ "62220ade04e69b315d7738a8", "94920", "Young people's auxiliaries associated with a political party" },
				{ "62220ade04e69b315d773750", "96090", "Sex services, all types" },
				{ "62220ade04e69b315d77375a", "96090", "Telephone sex operation" }
			};
			for(int i = 0; i < industrySectorGuidArr.Length / 3; i++)
			{
				if(industrySectorGuidArr[i, 0] == industrySectorGuid)
				{
					return new string [] { industrySectorGuidArr[i, 0], industrySectorGuidArr[i, 1], industrySectorGuidArr[i, 2] };
				}
			}
			return null;
		}

		private string BR01IndustrySectorCheckECDC(
			dynamic propertiesJObj,
			Dictionary<string, JObject> verificationRecords
		)
		{
			var guid = propertiesJObj["select-sic-sub-class"];
			string [] result = IndustrySectorExclusions_ECDC(guid.Value);
			if(result != null)
			{
				return "FAILED - Industry sector prohibited - " + result[1] + " " + result[2];
			} else
			{
				return "PASSED";
			}
			/*
			var divisionStr = propertiesJObj["select-sic-division"];
			var groupStr = propertiesJObj["select-sic-group"];

			//verificationRecords.Add("Industry Division", propertiesJObj["select-sic-division"]);
			//verificationRecords.Add("Industry Group", propertiesJObj["select-sic-group"]);


			int divisionVal = Int32.Parse(divisionStr.Value);
			// Division. 34,40,44,48,54,57,67,76,83,89
			if(divisionVal == 34)
			{
				return $"FAILED - Industry division prohibited - 34 - ";
			}
			if(divisionVal == 40)
			{
				return $"FAILED - Industry division prohibited - 40 - ";
			}
			if(divisionVal == 44)
			{
				return $"FAILED - Industry division prohibited - 44 - ";
			}
			if(divisionVal == 48)
			{
				return $"FAILED - Industry division prohibited - 48 - ";
			}
			if(divisionVal == 54)
			{
				return $"FAILED - Industry division prohibited - 54 - ";
			}
			if(divisionVal == 57)
			{
				return $"FAILED - Industry division prohibited - 57 - ";
			}
			if(divisionVal == 67)
			{
				return $"FAILED - Industry division prohibited - 67 - ";
			}
			if(divisionVal == 76)
			{
				return $"FAILED - Industry division prohibited - 76 - ";
			}
			if(divisionVal == 83)
			{
				return $"FAILED - Industry division prohibited - 83 - ";
			}
			if(divisionVal == 89)
			{
				return $"FAILED - Industry division prohibited - 89 - ";
			}
			int groupVal = Int32.Parse(groupStr.Value);
			// Group. 82..84,92..98,132..138,232..238,253..258,272..274,276..278,305..308,326..328,434..438,467..468,
			//        553..558,614..619,632..638,644..648,743..748,824..828,863..868,874..878,943..948,950,953..959

			if(groupVal >= 82 && groupVal <= 84)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 92 && groupVal <= 98)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 132 && groupVal <= 138)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 232 && groupVal <= 238)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 253 && groupVal <= 258)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 272 && groupVal <= 274)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 276 && groupVal <= 278)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 305 && groupVal <= 308)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 326 && groupVal <= 328)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 434 && groupVal <= 438)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 467 && groupVal <= 468)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}

			if(groupVal >= 553 && groupVal <= 558)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 614 && groupVal <= 619)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 632 && groupVal <= 638)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 644 && groupVal <= 648)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 743 && groupVal <= 748)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 824 && groupVal <= 828)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 863 && groupVal <= 868)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 874 && groupVal <= 878)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 943 && groupVal <= 948)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal == 950)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}
			if(groupVal >= 953 && groupVal <= 959)
			{
				return $"FAILED - Industry group prohibited - {groupStr.Value} - ";
			}

			return "PASSED";*/
		}

		private string BR06ProvinceCodeCheckECDC(
			SmeCompany company,
			dynamic propertiesJObj,
			dynamic verificationJObj,
			Dictionary<string, JObject> verificationRecords
		)
		{
			//verificationRecords.Add("Province Code", propertiesJObj["province-code"]);
			var provinceStr = propertiesJObj["province-code"];
			string provinceVal = provinceStr.Value;
			if(provinceVal == "LP")
			{
				return $"FAILED - Limpopo province (LP) prohibited";
			}
			if(provinceVal == "WC")
			{
				return $"FAILED - Western Cape (WC) prohibited";
			}
			if(provinceVal == "GT")
			{
				return $"FAILED - Gauteng (GT) prohibited";
			}
			if(provinceVal == "MP")
			{
				return $"FAILED - Mpumalanga (MP) prohibited";
			}
			if(provinceVal == "KZ")
			{
				return $"FAILED - KwaZulu-Natal (KZ) prohibited";
			}
			if(provinceVal == "NW")
			{
				return $"FAILED - North West (NW) prohibited";
			}
			if(provinceVal == "NC")
			{
				return $"FAILED - Northern Cape (NC) prohibited";
			}
			if(provinceVal == "EC")
			{
				return "PASSED";
			}
			return $"FAILED - Unknown province code";
		}
	}
}
