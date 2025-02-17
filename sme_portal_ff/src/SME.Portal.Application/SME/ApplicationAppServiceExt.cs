using Abp.BackgroundJobs;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Runtime.Session;
using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.Lenders;
using SME.Portal.Lenders.Dtos;
using SME.Portal.SME.Dtos;
using SME.Portal.SME.Exporting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;

using System.Runtime;
using System.IO;

using SME.Portal.Common.Dtos;
using SME.Portal.FinanceProductActions.Dtos;

using SME.Portal.Common.Dto;
using Abp.Authorization;
using Abp.Application.Services.Dto;
using Microsoft.EntityFrameworkCore;
using SME.Portal.List;
using Abp.MultiTenancy;
using SME.Portal.sefaLAS;
using Newtonsoft.Json;
using SME.Portal.PropertiesJson;
using SME.Portal.Company.Dtos;
using Newtonsoft.Json.Linq;
using System.IO;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Documents;
using Microsoft.Extensions.Configuration;
using SME.Portal.Configuration;
using System.ComponentModel;
using SME.Portal.Integrations;

namespace SME.Portal.SME
{
	[AbpAuthorize]
	public class ApplicationAppServiceExt : ApplicationsAppService
    {
		private readonly UserManager _userManager;
		private readonly IRepository<Match> _matchRepository;
		private readonly IRepository<Application> _applicationRepository;
		private readonly IApplicationsExcelExporter _applicationsExcelExporter;
		private readonly IRepository<User, long> _lookup_userRepository;
		private readonly IRepository<SmeCompany, int> _lookup_smeCompanyRepository;
		private readonly IAbpSession _session;
		private readonly IUnitOfWorkManager _unitOfWorkManager;
		private readonly IBackgroundJobManager _backgroundJobManager;
		private readonly IMatchesAppService _matchesAppService;
		private readonly IApplicationsAppService _applicationsAppService;
		private readonly ISefaLASAppService _sefaLASAppService;
		private readonly IListItemsAppService _listItemsAppService;
		private readonly OwnersAppServiceExt _ownersAppServiceExt;
		private readonly IUserEmailer _userEmailer;
		private readonly IConfigurationRoot _appConfiguration;
		private readonly IAppConfigurationAccessor _appConfigurationAccessor;
		private readonly DocumentsAppServiceExt _documentsAppServiceExt;
		private readonly IQLanaAppService _qLanaAppService;
		private readonly ICompanyPartnersAppService _companyPartnersAppService;

		public ApplicationAppServiceExt(UserManager userManager,
			IRepository<Match> matchRepository,
			IRepository<Application> applicationRepository,
			IApplicationsExcelExporter applicationsExcelExporter,
			IRepository<User, long> lookup_userRepository,
			IRepository<SmeCompany, int> lookup_smeCompanyRepository,
			IAbpSession session,
			IUnitOfWorkManager unitOfWorkManager,
			IBackgroundJobManager backgroundJobManager,
			IMatchesAppService matchesAppService,
			IApplicationsAppService applicationsAppService,
			IRepository<Owner, long> ownerRepository,
			IRepository<ListItem, int> listRepository,
			ITenantCache tenantCache,
			ISefaLASAppService sefaLASAppService,
			IListItemsAppService listItemsAppService,
			OwnersAppServiceExt ownersAppServiceExt,
			IAppConfigurationAccessor configurationAccessor,
			IUserEmailer userEmailer,
			IQLanaAppService qLanaAppService,
			ICompanyPartnersAppService companyPartnersAppService

		)
			: base(matchRepository, applicationRepository, applicationsExcelExporter, lookup_userRepository, lookup_smeCompanyRepository, session, ownerRepository, listRepository, backgroundJobManager, tenantCache)
		{
			_matchRepository = matchRepository;
			_applicationRepository = applicationRepository;
			_applicationsExcelExporter = applicationsExcelExporter;
			_lookup_userRepository = lookup_userRepository;
			_lookup_smeCompanyRepository = lookup_smeCompanyRepository;
			_session = session;
			_unitOfWorkManager = unitOfWorkManager;
			_backgroundJobManager = backgroundJobManager;
			_matchesAppService = matchesAppService;
			_applicationsAppService = applicationsAppService;
			_sefaLASAppService = sefaLASAppService;
			_userManager = userManager;
			_listItemsAppService = listItemsAppService;
			_ownersAppServiceExt = ownersAppServiceExt;
			_appConfiguration = configurationAccessor.Configuration;
			_appConfigurationAccessor = configurationAccessor;
			_userEmailer = userEmailer;
			_qLanaAppService = qLanaAppService;
			_companyPartnersAppService = companyPartnersAppService;
		}

		public ApplicationAppServiceExt(UserManager userManager,
		IRepository<Match> matchRepository,
		IRepository<Application> applicationRepository,
		IApplicationsExcelExporter applicationsExcelExporter,
		IRepository<User, long> lookup_userRepository,
		IRepository<SmeCompany, int> lookup_smeCompanyRepository,
		IAbpSession session,
		IUnitOfWorkManager unitOfWorkManager,
		IBackgroundJobManager backgroundJobManager,
		IMatchesAppService matchesAppService,
		IApplicationsAppService applicationsAppService,
        IRepository<Owner, long> ownerRepository,
        IRepository<ListItem, int> listRepository,
        ITenantCache tenantCache,
        ISefaLASAppService sefaLASAppService,
        IListItemsAppService listItemsAppService,
        OwnersAppServiceExt ownersAppServiceExt,
		DocumentsAppServiceExt documentsAppServiceExt,
		IAppConfigurationAccessor configurationAccessor,
		IUserEmailer userEmailer,
		IQLanaAppService qLanaAppService,
		ICompanyPartnersAppService companyPartnersAppService

	) : this(userManager, matchRepository, applicationRepository, applicationsExcelExporter, lookup_userRepository, lookup_smeCompanyRepository, session, unitOfWorkManager, backgroundJobManager, matchesAppService, applicationsAppService, ownerRepository, listRepository, tenantCache, sefaLASAppService, listItemsAppService, ownersAppServiceExt, configurationAccessor, userEmailer, qLanaAppService, companyPartnersAppService)
        {
            _documentsAppServiceExt = documentsAppServiceExt;
			_appConfiguration = configurationAccessor.Configuration;
			_userEmailer = userEmailer;
			_qLanaAppService = qLanaAppService;
			_companyPartnersAppService = companyPartnersAppService;
		}

        public override async Task<int> CreateOrEdit(CreateOrEditApplicationDto data)
        {
			int appId = 0;

            using var uow = _unitOfWorkManager.Begin();
            using (UnitOfWorkManager.Current.SetTenantId(AbpSession.TenantId)) 
            {
                appId = await _applicationsAppService.CreateOrEdit(data);

                uow.Complete();
			}

			return appId;
        }
		

		public async Task<string> MandateFitCheck(int applicationId)
		{
			var applicationObj = await _applicationsAppService.GetApplicationForEdit(new EntityDto(applicationId));
			var application = applicationObj.Application;
			var company = await _lookup_smeCompanyRepository.GetAsync(application.SmeCompanyId);
			dynamic appPropertiesJObj = null;

			if (application.PropertiesJson != null)
			{
				appPropertiesJObj = JsonConvert.DeserializeObject<object>(application.PropertiesJson);
			}
			else
            {
				appPropertiesJObj = new JObject();
			}

			dynamic companyPropertiesJObj = JsonConvert.DeserializeObject<object>(company.PropertiesJson);

            #region Determine Company.PropertiesJson has a PASSED basic screening check
            var basicScreeningSuccessJObj = companyPropertiesJObj["basic-screening-checks"]["Success"];
			
			if (basicScreeningSuccessJObj == null || (bool)basicScreeningSuccessJObj == false)
            {
				Logger.Error("SmeCompany does not contain a Basic Screening Check result");
				return null;
            } 
			
			#endregion

			#region Perform mandate checks
			var checks = new Dictionary<string, string>();

			var criteria = NameValuePairDto.FromJson(application.MatchCriteriaJson).ToList();

			var loanAmountStr = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-loan-amount")?.Value; 
			var loanAmountInt = int.Parse(loanAmountStr.Replace(" ", ""));
			var cashflow = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-forecast-cash-flow-repayable")?.Value;
			var conflictOfInterest = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-conflict-of-interest-at-sefa")?.Value;
			var withinSABorders = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-operations-within-boarders-sa")?.Value;
			var controllingInterest = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-controlling-interest-greater-than-50")?.Value;
			var shareholdersInvolved = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-shareholder-involved")?.Value;
			var manTeamHasSkills = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-management-team-has-xp-skills")?.Value;
			var taxGoodStandingAndValidPIN = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-tax-in-good-standing-pin-not-expired")?.Value;
			var cipcAnnualFeesPaid = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-cipc-annual-fees-paid")?.Value;

			if(cipcAnnualFeesPaid != "Yes")
				checks.Add("CIPC Annual Fees Are Paid", "FAILED");
			else
				checks.Add($"CIPC Annual Fees Are Paid", "PASSED");

			// loan amount in range
			if (loanAmountInt < 15000 || loanAmountInt > 100000000)
				checks.Add($"Loan Amount must be more then R15 000 and less then R100 000 000", "FAILED");
			else
				checks.Add($"Loan Amount must be more then R15 000 and less then R100 000 000", "PASSED");

			if (cashflow != "Yes")
				checks.Add($"Cashflow is sufficient for loan", "FAILED");
			else
				checks.Add($"Cashflow is sufficient for loan", "PASSED");

			if (conflictOfInterest != "No")
				checks.Add($"Enquiry cannot have a conflict of interest with sefa", "FAILED");
			else
				checks.Add($"Enquiry cannot have a conflict of interest with sefa", "PASSED");

			if (withinSABorders != "Yes")
				checks.Add($"Operations must be within the borders of South Africa", "FAILED");
            else
                checks.Add($"Operations must be within the borders of South Africa", "PASSED");

			if (controllingInterest != "Yes")
				checks.Add($"Controlling interest must be greater than 50 percent", "FAILED");
            else
                checks.Add($"Controlling interest must be greater than 50 percent", "PASSED");

			if (shareholdersInvolved != "Yes")
				checks.Add($"Shareholder involvement is not sufficient", "FAILED");
            else
                checks.Add($"Shareholder involvement is not sufficient", "PASSED");

			if (manTeamHasSkills != "Yes")
				checks.Add($"Management team does not have sufficient skills", "FAILED");
            else
                checks.Add($"Management team does not have sufficient skills", "PASSED");

			if (taxGoodStandingAndValidPIN != "Yes")
				checks.Add($"Tax in good standing with valid PIN", "FAILED");
			else
				checks.Add($"Tax in good standing with valid PIN", "PASSED");

			#endregion

			#region Update Application.PropertiesJson with mandate fit check results

			var failedMandateCheck = checks.Any(x => x.Value != "PASSED");

			var checkJson = JsonConvert.SerializeObject(new SmeCompanyBackgroundCheckResult() { Success = !failedMandateCheck, Checks = checks });

			appPropertiesJObj["mandate-fit-checks"] = JObject.Parse(checkJson);

			application.PropertiesJson = appPropertiesJObj.ToString();

			await _applicationsAppService.CreateOrEdit(application);
            
			#endregion

            return checkJson;
		}

		private bool TestReasonForFinance(Dictionary<string, string> rff, string[] rffOptionsArr, string rffUserSelect)
		{
			for(int i = 0; i < rffOptionsArr.Length; i++)
			{
				string guid = rff[rffOptionsArr[i]];
				if(guid == rffUserSelect)
				{
					return true;
				}
			}
			return false;
		}

		private bool IsManufacturingSupportLendingProgram(dynamic companyPropertiesJObj, Dictionary<string, string> rff, int loanAmountInt, string reasonForFinanceListId, int? ownerAge)
		{
			bool hasReasonForFinance = TestReasonForFinance(
				rff,
				new string[]
				{
						"Buying equipment",
						"Buying existing business",
						"Buying franchise",
						"Buying machinery",
						"Buying vehicle",
						"Finance / acquisition of movable assets",
						"For operating / cash flow purposes",
						"Funding for Purchase orders",
						"Funding of Government / private sector contracts",
						"Funding of Government / private sector tenders",
						"Partner or management buyout",
						"Product or service expansion",
						"Property financing",
						"Shopfitting /renovations",
						"Short-term capital for delivery of existing contracts or orders",
						"Working capital"
				},
				reasonForFinanceListId
			);
			if(loanAmountInt < 15000000 && (ownerAge.HasValue && ownerAge > 35) && hasReasonForFinance == true)
			{

				var sectionId = companyPropertiesJObj["select-sic-section"];
				var divisionId = companyPropertiesJObj["select-sic-division"];
				var groupId = companyPropertiesJObj["select-sic-group"];
				var subClassId = companyPropertiesJObj["select-sic-sub-class"];
				if(sectionId != null && divisionId != null && groupId != null && subClassId != null)
				{
					var sectionValue = sectionId.Value;//C - Manufacturing.
					var divisionValue = divisionId.Value;//12 - Tobacco.
					var groupValue = groupId.Value;//463,472 - Tobacco.
					var subClassValue = subClassId.Value;//1150,28250,47110,47710 - Tobacco.
					if(sectionValue == "C")
					{
						if(	divisionValue != "12" &&
							groupValue != "463" && groupValue != "472" &&
							subClassValue != "1150" && subClassValue != "28250" && subClassValue != "47110" && subClassValue != "47710")
						{
							return true;
						}
					}
				}
			}
			return false;
		}

		public async Task<string> ProgramProductFit(int applicationId)
        {
			Dictionary<string, string> rff = new Dictionary<string, string>();

			// For readability purposes. ( Reasons for finance ).
			rff.Add("Buying equipment", "6169375bf2e88328fa1cf6c4");
			rff.Add("Buying existing business", "6169375bf2e88328fa1cf6c5");
			rff.Add("Buying franchise", "6169375bf2e88328fa1cf6c6");
			rff.Add("Buying machinery", "6169375bf2e88328fa1cf6c7");
			rff.Add("Buying vehicle", "6169375bf2e88328fa1cf6c8");
			rff.Add("Finance for Start - up or expanding", "6169375bf2e88328fa1cf6c9");
			rff.Add("Finance / acquisition of movable assets", "6169375bf2e88328fa1cf6ca");
			rff.Add("For operating / cash flow purposes", "6169375bf2e88328fa1cf6cb");
			rff.Add("Funding for Purchase orders", "6169375bf2e88328fa1cf6cc");
			rff.Add("Funding of Government / private sector contracts", "6169375bf2e88328fa1cf6cd");
			rff.Add("Funding of Government / private sector tenders", "6169375bf2e88328fa1cf6ce");
			rff.Add("Need finding for economic growth and employment creation", "6169375bf2e88328fa1cf6cf");
			rff.Add("Need funding for black agricultural end-users for mortgage loans or production costs", "6169375bf2e88328fa1cf6d0");
			rff.Add("Need funding for RFI requirements and strategies", "6169375bf2e88328fa1cf6d1");
			rff.Add("Need funding to grow asset and income base", "6169375bf2e88328fa1cf6d2");
			rff.Add("Need funding to operate a small panel beating business, service centre, spare part centre", "6169375bf2e88328fa1cf6d3");
			rff.Add("Need innovation for agricultural, ICT, health, or grains sector", "6169375bf2e88328fa1cf6d4");
			rff.Add("Partner or management buyout", "6169375bf2e88328fa1cf6d5");
			rff.Add("Product or service expansion", "6169375bf2e88328fa1cf6d6");
			rff.Add("Property financing", "6169375bf2e88328fa1cf6d7");
			rff.Add("Shopfitting /renovations", "6169375bf2e88328fa1cf6d8");
			rff.Add("Short-term capital for delivery of existing contracts or orders", "6169375bf2e88328fa1cf6d9");
			rff.Add("Working capital", "6169375bf2e88328fa1cf6da");



			#region Get Application and reason for finance

			var listItems = _listItemsAppService.GetAll();

			var application = await _applicationsAppService.GetApplicationForEdit(new EntityDto(applicationId));
			dynamic applicationPropertiesJObj = JsonConvert.DeserializeObject<object>(application.Application.MatchCriteriaJson);
			var criteria = NameValuePairDto.FromJson(application.Application.MatchCriteriaJson).ToList();

			var smeCompany = await _lookup_smeCompanyRepository.GetAsync(application.Application.SmeCompanyId);
			dynamic companyPropertiesJObj = JsonConvert.DeserializeObject<object>(smeCompany.PropertiesJson);

			var owner = await _ownersAppServiceExt.GetOwnerForViewByUserId(smeCompany.UserId);
			int? ownerAge = null;

			if(!string.IsNullOrEmpty(owner.Owner.VerificationRecordJson))
            {
				var ownerVerificationJObj = JObject.Parse(owner.Owner.VerificationRecordJson);
				ownerAge = (int?)ownerVerificationJObj["Age"];
			}


			var entityTypeListId = (string)companyPropertiesJObj["entityType"];
			var entityType = listItems.FirstOrDefault(x => x.ListId == entityTypeListId)?.Name;
			var loanAmountStr = criteria.FirstOrDefault(x => x.Name == "input-mandate-fit-loan-amount")?.Value;
			var loanAmountInt = int.Parse(loanAmountStr.Replace(" ", ""));
			var reasonForFinanceListId = criteria.FirstOrDefault(x => x.Name == "select-mandate-fit-reason-for-finance")?.Value;

			#endregion

			var programProductFit = string.Empty;

			#region Early-stage small-scale manufacturer operating in townships, rural towns, and villages

			// Manufacturing Support Lending Program ( Revised rules implementation )
			if(IsManufacturingSupportLendingProgram(companyPropertiesJObj, rff, loanAmountInt, reasonForFinanceListId, ownerAge) == true)
			{
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "62628556e79a488f50c98bc2"), applicationId);
			}
			// Manufacturing Support Lending Program
			//if (entityTypeListId == "62260eb61d4e1537377b38ac")
			//	return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "62628556e79a488f50c98bc2"), applicationId);

			#endregion

			#region Youth Challenge Fund (* discontinued 3.8.2022 - rolled into Direct Lending )

			//// and loan amount is less than R15m and owner 35 or younger then return Youth Challenge Fund
			if(entityTypeListId == "62a0a2bfa42a98fdd0ecdc43" || //  - Start-up with revenue 
				entityTypeListId == "62260eb61d4e1537377b38a6" || //  - Start-up without revenue
				entityTypeListId == "62260eb61d4e1537377b38a8" || //  - Small or Medium - sized Enterprise(SME)
				entityTypeListId == "628b8f8dd7092ab141859aba" || //  - Owner - managed micro, informal (home - based) enterprise
				entityTypeListId == "62260eb61d4e1537377b38a5" || //  - Not a part of specific entities mentioned 
				entityTypeListId == "62260eb61d4e1537377b38ab" || // - Small enterprises in townships, rural areas, or small towns
				entityTypeListId == "62628947fd9575f11babdc0e" || // - Micro or Survivalist Company (Annual Turnover of R1.5mil or less)
				entityTypeListId == "62260eb61d4e1537377b38ac")   // - Early-stage small-scale manufacturer operating in townships, rural towns, and villages   
			{
				if (loanAmountInt < 15000000 && (ownerAge.HasValue && ownerAge.Value <= 35))
				{
					// Youth Challenge Fund
					return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "6262851b4a757c7ed1f3097f"), applicationId);
				}
			}

			#endregion

			#region Purchase Order Product

			//// and loan amount is between R50K and R5m then return Purchase Order Product
			if (entityTypeListId == "62a0a2bfa42a98fdd0ecdc43" || //  - Start-up with revenue 
                entityTypeListId == "62260eb61d4e1537377b38a6" || //  - Start-up without revenue
                entityTypeListId == "62260eb61d4e1537377b38a8" || //  - Small or Medium - sized Enterprise(SME)
                entityTypeListId == "628b8f8dd7092ab141859aba" || //  - Owner - managed micro, informal (home - based) enterprise
                entityTypeListId == "62260eb61d4e1537377b38a5")   //  - Not a part of specific entities mentioned 
            {
                if (loanAmountInt < 5000000)
                {
					if (reasonForFinanceListId == "6169375bf2e88328fa1cf6cc") // - Funding for Purchase orders
					{
						return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "63232c9e0bd9ef3f1a8e3b82"), applicationId);
					}
					else 
					{
                        // TEMP - remove direct lending
                        programProductFit = await DirectLendingFilter(listItems, reasonForFinanceListId, applicationId, includeTenders: false);
                        if (!string.IsNullOrEmpty(programProductFit))
                            return programProductFit;
                        //var loanTypeNotAvailable = listItems.FirstOrDefault(x => x.ListId == "64db693d678b47343d72972f");
                        //string serializedLoanTypeNotAvailable = JsonConvert.SerializeObject(loanTypeNotAvailable);
                        //return serializedLoanTypeNotAvailable;
                    }
						       
                }
            }

			#endregion

			#region Township & Rural Entrepreneurial Program (TREP)

			// If entity type is 'Small enterprises in townships, rural areas, or small towns' AND loan amount less than R1m then TREP
			if (entityTypeListId == "62260eb61d4e1537377b38ab" && loanAmountInt < 1000000)
			// TEMP - remove direct lending
			//if (entityTypeListId == "62260eb61d4e1537377b38ab" && loanAmountInt < 15000000)
			{
				if (reasonForFinanceListId == "6169375bf2e88328fa1cf6cc") // - Funding for Purchase orders
				{
					return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "63232c9e0bd9ef3f1a8e3b82"), applicationId);
				}
				else
				{ 
					return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "626284e1f8ecc0f40b8edf00"), applicationId);
				}
			}

            #endregion

            #region Small enterprises in townships, rural areas, or small towns.

            // If entity type is 'Small enterprises in townships, rural areas, or small towns' AND loan amount is >= R1m AND < R15m
            // Note: don't include government tenders
            // TEMP - remove direct lending
            if (entityTypeListId == "62260eb61d4e1537377b38ab" && loanAmountInt >= 1000000 && loanAmountInt < 15000000)
            {
                programProductFit = await DirectLendingFilter(listItems, reasonForFinanceListId, applicationId, includeTenders: false);

                if (!string.IsNullOrEmpty(programProductFit))
                    return programProductFit;
            }

            #endregion

            #region Micro or Survivalist Company (Annual Turnover of R1.5mil or less)

            // If entity type is 'Micro or Survivalist Company (Annual Turnover of R1.5mil or less)' then Micro Finance
            if (entityTypeListId == "62628947fd9575f11babdc0e")
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "626282bbbf0a95435552dbeb"), applicationId);
            
			#endregion

            #region Transnet suppliers 
            
			// Specialised Funds lending program
            if (entityTypeListId == "62260eb61d4e1537377b38a9")
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "626661851c7472bd5d1ee51c"), applicationId);
			
			#endregion

			#region Financial Intermediaries 
			
			// Wholesale lending program
			if (entityTypeListId == "62260eb61d4e1537377b38a9")
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "62628008f9fce6eea1f8f611"), applicationId);
			
			#endregion

			#region Co-operative
			
			// Co-Op - Development Fund lending program
			if (entityTypeListId == "62260eb61d4e1537377b38a2")
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "626282d9530062eea92b5b18"), applicationId);
            
			#endregion

            #region Retail Financial Intermediary (RFI)
            
			// Retail Financial Intermediary lending program
            if (entityTypeListId == "62260eb61d4e1537377b38aa")
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "6266620183b96943ddf85151"), applicationId);
            
			#endregion

            #region Non-Bank Financial Intermediaries (NBFIs)
            
			// European Union lending program
            if (entityTypeListId == "62260eb61d4e1537377b38a4")
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "62628286639e7b9d112e6666"), applicationId);

			#endregion

			#region Military veteran that can be confirmed via the Department of Military Veterans database

			// Direct Lending Channel - Veteran Inyamazane Funding Scheme
			if (entityTypeListId == "62260eb61d4e1537377b38ad")
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "62666292443c96e336e77adb"), applicationId);
            
			#endregion

            #region Entrepreneurs with disabilities
            
			// Direct Lending Channel - Disability Amavulandlela Funding Scheme 
            if (entityTypeListId == "62260eb61d4e1537377b38ae")
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "626662df990a95913a1aa780"), applicationId);

			#endregion

			#region Direct Lending - catch all
			if (loanAmountInt < 15000000)
			{
                // Temporarily disabled
                programProductFit = await DirectLendingFilter(listItems, reasonForFinanceListId, applicationId);
                if (!string.IsNullOrEmpty(programProductFit))
                    return programProductFit;
                //var loanTypeNotAvailable = listItems.FirstOrDefault(x => x.ListId == "64db693d678b47343d72972f");
                //string serializedLoanTypeNotAvailable = JsonConvert.SerializeObject(loanTypeNotAvailable);
                //return serializedLoanTypeNotAvailable;
            }

			#endregion

			#region Wholesale Lending - catch all

			return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "62628008f9fce6eea1f8f611"), applicationId);

            #endregion
        }

		public string ECDCProgram(int applicationId)
		{
			return "8";
		}

		public async Task<bool> SubmitToECDC(SubmitToECDCDto payload)
		{
			try
			{
				string _ecdcSupportEmail; 
				string _ecdcInfoEmail = GetFromSettings("EcdcSupport:InfoEmail");
				switch (payload.RegionalOffice)
				{
					case "Buffalo City":
						// code block
						_ecdcSupportEmail = GetFromSettings("EcdcSupport:Email1");
						break;
					case "Amathole":
						// code block
						_ecdcSupportEmail = GetFromSettings("EcdcSupport:Email1");
						break;
					case "Chris Hani":
						// code block
						_ecdcSupportEmail = GetFromSettings("EcdcSupport:Email2");
						break;
					case "Joe Gqabi":
						// code block
						_ecdcSupportEmail = GetFromSettings("EcdcSupport:Email2");
						break;
					case "OR Tambo":
						// code block
						_ecdcSupportEmail = GetFromSettings("EcdcSupport:Email3");
						break;
					case "Alfred Nzo":
						// code block
						_ecdcSupportEmail = GetFromSettings("EcdcSupport:Email3");
						break;
					case "Sarah Bartman":
						// code block
						_ecdcSupportEmail = GetFromSettings("EcdcSupport:Email4");
						break;
					case "NMBM":
						// code block
						_ecdcSupportEmail = GetFromSettings("EcdcSupport:Email4");
						break;
					default:
						// code block
						_ecdcSupportEmail = GetFromSettings("EcdcSupport:Email1");
						break;
				}

				await _userEmailer.SendEcdcApplicationSubmittedNotification(_ecdcSupportEmail, _ecdcInfoEmail, payload);

			}
			catch(WebException ex)
			{
				return false;
			}
			return true;
		}
		private string GetFromSettings(string name, string defaultValue = null)
		{
			return _appConfiguration[name] ?? defaultValue;
		}


		private async Task<string> DirectLendingFilter (List<List.Dtos.ListItemDto> listItems, string reasonForFinanceListId, int applicationId, bool includeTenders = true)
        {
			// -- Reason for finance -- 
			if (reasonForFinanceListId == "6169375bf2e88328fa1cf6cd" ||						//  Funding of Government / private sector contracts
				reasonForFinanceListId == "6169375bf2e88328fa1cf6cc" ||						//	Funding for Purchase orders
				(reasonForFinanceListId == "6169375bf2e88328fa1cf6ce" && includeTenders) )  //  Funding of Government / private sector tenders)			
			{
				// Bridging Loan
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "626663b9b8ac31dfde290063"), applicationId);
			}
			else if (reasonForFinanceListId == "6169375bf2e88328fa1cf6c4" ||    //	Buying equipment
					reasonForFinanceListId == "6169375bf2e88328fa1cf6c7" ||     //	Buying machinery
					reasonForFinanceListId == "6169375bf2e88328fa1cf6d7" ||     //	Property financing
					reasonForFinanceListId == "6169375bf2e88328fa1cf6c8" ||     //	Buying vehicle
					reasonForFinanceListId == "6169375bf2e88328fa1cf6ca")       //	Finance/acquisition of of movable assets
			{
				// Assett Finance
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "626663ff9d63e9cf83e4126a"), applicationId);
			}
			else if (reasonForFinanceListId == "6169375bf2e88328fa1cf6cb" ||    //	For operating/cash flow purposes
					reasonForFinanceListId == "6169375bf2e88328fa1cf6d9" ||     //	Short-term capital for delivery of existing contracts or orders
					reasonForFinanceListId == "6169375bf2e88328fa1cf6da")       //	Working capital
			{
				// Revolving Loan
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "6266644706b2c31359cd102f"), applicationId);
			}
			else if (reasonForFinanceListId == "6169375bf2e88328fa1cf6d8" ||    //	Shopfitting /renovations
					reasonForFinanceListId == "6169375bf2e88328fa1cf6d6" ||     //	Product or service expansion
					reasonForFinanceListId == "6169375bf2e88328fa1cf6c6" ||     //	Buying franchise
					reasonForFinanceListId == "6169375bf2e88328fa1cf6c5" ||     //	Buying existing business
					reasonForFinanceListId == "6169375bf2e88328fa1cf6d5")       //	Partner or management buyout
			{
				//  Term Loan
				return await SaveProgramProductFit(listItems.FirstOrDefault(x => x.ListId == "62666479ae31305e9e16f2fe"), applicationId);
			}

			return String.Empty;
		}

        private async Task<string> SaveProgramProductFit(object input, int appId)
        {
			var application = await GetApplicationForEdit(new EntityDto() { Id = appId });

			if (input == null)
				return String.Empty;

			var json = JObject.Parse(JsonConvert.SerializeObject(input)).ToString();
			
			dynamic appPropertiesJObj = JsonConvert.DeserializeObject<object>(application.Application.PropertiesJson);
			appPropertiesJObj["program-product-fit"] = JObject.Parse(json);

			application.Application.PropertiesJson = appPropertiesJObj.ToString();

			await Update(application.Application);

			return json;
		}

		public async Task LockApplication(int id)
        {
            using var uow = _unitOfWorkManager.Begin();
            using (UnitOfWorkManager.Current.SetTenantId(AbpSession.TenantId))
            {

                var getApplicationDto = await _applicationsAppService.GetApplicationForView(id);

                var applicationDto = getApplicationDto.Application;

                if (applicationDto != null)
                {
                    var result = await _applicationsAppService.CreateOrEdit(new CreateOrEditApplicationDto()
                    {
                        Id = applicationDto.Id,
                        Status = ApplicationStatus.Locked.ToString(),
                        Locked = DateTime.Now
                    });
                }

                uow.Complete();
            }
        }

		public async Task CancelApplication(int id)
        {
			await SetApplicationStatus(id, ApplicationStatus.Cancelled);
		}

		public async Task SetApplicationStatus(int id, ApplicationStatus newStatus)
		{
			using var uow = _unitOfWorkManager.Begin();
			using (UnitOfWorkManager.Current.SetTenantId(AbpSession.TenantId))
			{
				var getApplicationDto = await _applicationsAppService.GetApplicationForEdit(new EntityDto() { Id = id });

				var applicationDto = getApplicationDto.Application;

				applicationDto.Status = newStatus.ToString();

				await _applicationsAppService.CreateOrEdit(applicationDto);
				uow.Complete();
			}
		}

		public async Task<ResultDto<MatchListResultDto>> GetAllMatches()
		{
			ResultDto<MatchListResultDto> output = new ResultDto<MatchListResultDto>()
			{
				Result = ResultEnum.Success,
				Message = "Success",
				Data = new MatchListResultDto()
				{
					Matches = new List<MatchResultDto>()
				}
			};

			long userId = (long)_session.UserId;
			var applicationList = _applicationRepository.GetAll().Where(x => x.UserId == userId).ToList();
			foreach(Application application in applicationList)
			{
				MatchResultDto match = new MatchResultDto()
				{
					ApplicationId = application.Id,
					MatchId = -1,
					Status = application.Status,
					Ids = ""
				};
				
				var applicationMatch = await _matchRepository.FirstOrDefaultAsync(x => x.ApplicationId == application.Id);

				if(applicationMatch != null)
				{
					match.MatchId = applicationMatch.Id;
					match.Ids = applicationMatch.FinanceProductIds;
				}
				output.Data.Matches.Add(match);
			}
			return output;
		}

		public async Task<ResultDto<MatchEditResultDto>> Edit(MatchEditDto input)
		{
			var output = new ResultDto<MatchEditResultDto>()
			{
				Result = ResultEnum.Success,
				Message = "Success",
				Data = new MatchEditResultDto
				{
					Id = -1,
					Json = ""
				}
			};

			try
			{

				var application = await _applicationRepository.FirstOrDefaultAsync(input.ApplicationId);

				if(application != null)
				{
					var nvp = NameValuePairDto.FromJson(application.MatchCriteriaJson);

					var loanAmount = nvp.FirstOrDefault(x => x.Name == "loanamount");
					var annualTurnover = nvp.FirstOrDefault(x => x.Name == "annualturnover");

					loanAmount.Value = input.LoanAmount.ToString();
					annualTurnover.Value = input.AnnualTurnover.ToString();

					nvp.FirstOrDefault(x => x.Name == "loanamount").Value = loanAmount.Value;
					nvp.FirstOrDefault(x => x.Name == "annualturnover").Value = annualTurnover.Value;

					output.Data.Id = application.Id;
					output.Data.Json = Serialize.ToJson(nvp);
				}
				else
				{
					output.Result = ResultEnum.Fail;
					output.Message = "Application not found";
				}
			}
			catch(WebException ex)
			{
				output.Result = ResultEnum.Exception;
				output.Message = ex.Message;
			}
			return output;
		}

		public ResultDto<bool> HasApplications(bool locked = true)
		{
			ResultDto<bool> output = new ResultDto<bool>()
			{
				Result = ResultEnum.Success,
				Message = "Success",
				Data = false
			};

			try
			{
				long userId = (long)_session.UserId;
				var application = _applicationRepository.FirstOrDefault(x => x.UserId == userId && x.Locked.HasValue == locked);
				output.Data = application != null;
				return output;
			}
			catch(WebException ex)
			{
				output.Result = ResultEnum.Exception;
				output.Message = ex.Message;
				return output;
			}
		}

		public async Task<PagedResultDto<GetApplicationForViewDto>> GetAllForUserId(long userId)
		{

			var filteredApplications = _applicationRepository.GetAll()
						.Include(e => e.UserFk)
						.Include(e => e.SmeCompanyFk)
						.Where(e => e.UserId == userId);

			var applications = from o in filteredApplications
							   join o1 in _lookup_userRepository.GetAll() on o.UserId equals o1.Id into j1
							   from s1 in j1.DefaultIfEmpty()

							   join o2 in _lookup_smeCompanyRepository.GetAll() on o.SmeCompanyId equals o2.Id into j2
							   from s2 in j2.DefaultIfEmpty()

							   select new GetApplicationForViewDto()
							   {
								   Application = new ApplicationDto
								   {
									   Locked = o.Locked,
									   Status = o.Status,
									   Id = o.Id,
									   SmeCompanyId = o.SmeCompanyId,
									   MatchCriteriaJson = o.MatchCriteriaJson,
									   Created = o.CreationTime,
									   LastModificationTime = o.LastModificationTime,
									   TenantId = (int)o.TenantId,
									   UserId = o.UserId,
									   PropertiesJson = o.PropertiesJson
								   },
								   UserName = s1 == null || s1.UserName == null ? "" : s1.UserName.ToString(),
								   SmeCompanyName = s2 == null || s2.Name == null ? "" : s2.Name.ToString()
							   };

			var totalCount = await filteredApplications.CountAsync();

			return new PagedResultDto<GetApplicationForViewDto>(
				totalCount,
				await applications.ToListAsync()
			);
		}

		public class PdfArgs
		{
			public string Bytes { get; set; }
			public string Name { get; set; }
			public int CompanyId { get; set; }
			public int ApplicationId { get; set; }
		}

		public async Task<bool> SendCompanyPartnersPayload(PayloadArgs payloadArgs)
		{
			// TODO: Replace with Company Partners version of this call.
			//await _companyPartnersAppService.CreateCompanyPartnersLead(payloadArgs.Json);
			return true;
		}

		public async Task<bool> SendECDCPdf(PdfArgs pdfArgs)
		{
			bool sendToSharepoint = _appConfiguration.GetValue<bool>("SharepointConfig:SharepointIntegration");
			if(sendToSharepoint == true)
            {
				byte[] bytes = Convert.FromBase64String(pdfArgs.Bytes);
				var userID = AbpSession.UserId.Value;
				string namePDF = pdfArgs.Name;
				int applicationID = pdfArgs.ApplicationId;
				try
				{
					List<Tuple<byte[], string>> getAllAttachedDocuments = await _documentsAppServiceExt.GetAllECDCDocumentsWithFileName(userID, pdfArgs.CompanyId);

					CallMSGraphApi uploadBytesPDF = new CallMSGraphApi(AbpSession, _userManager, _appConfigurationAccessor);
					await uploadBytesPDF.RunAsync(bytes, getAllAttachedDocuments, applicationID);
				}
				catch(Exception ex)
				{
					Logger.Debug($"SendECDCPdf {Environment.NewLine} Failed to send pdf document." + ex.Message);
					return false;
				}

				return true;
			}
            else
            {
				return true;
            }
		}

        public async Task<int> CountFor(int companyId, bool lockedOnly = true)
		{
			if (lockedOnly)
				return await _applicationRepository.CountAsync(app => app.SmeCompanyId == companyId && app.Locked.HasValue);

			return await _applicationRepository.CountAsync(app => app.SmeCompanyId == companyId);

		}

        #region HubSpot Sync
        public async Task HubSpotStartSync(long userId)
		{
			var applications = await GetLockedApplicationsByUserId(userId);

			foreach (var application in applications)
			{
				if (application.TenantId == default(int) || application.Id == default(int) || application.SmeCompanyId == default(int) || application.UserId == default(long))
				{
					Logger.Debug($"HubSpotEventTriggerBackgroundJob {Environment.NewLine} Failed to get application entity properties. Application Json: {JsonConvert.SerializeObject(application)} ");
				}
				var tenancyName = GetTenancyNameOrNull(application.TenantId);
				await HubSpotSync(tenancyName, application.TenantId, application.Id, application.SmeCompanyId, application.UserId);
			}
		}

		private string GetTenancyNameOrNull(int? tenantId)
		{
			if (tenantId.HasValue)
				return _tenantCache.GetOrNull(tenantId.Value)?.TenancyName;

			return null;
		}

		private async Task HubSpotSync(string tenancyName, int tenantId, int applicationId, int companyId, long userId)
		{
			// queue the job to add funder search to crm
			await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
			{
				TenancyName = tenancyName,
				TenantId = tenantId,
				ApplicationId = applicationId,
				EventType = HubSpotEventTypes.CreateEdit,
				HSEntityType = HubSpotEntityTypes.deals,
				UserJourneyPoint = UserJourneyContextTypes.ApplicationLocked
			});

			// queue the job to add company to crm
			await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
			{
				TenancyName = tenancyName,
				TenantId = tenantId,
				SmeCompanyId = companyId,
				ApplicationId = applicationId,
				EventType = HubSpotEventTypes.CreateEdit,
				HSEntityType = HubSpotEntityTypes.companies,
				UserJourneyPoint = UserJourneyContextTypes.ApplicationLocked
			});

			// queue the job to add company to crm
			await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
			{
				TenancyName = tenancyName,
				TenantId = tenantId,
				SmeCompanyId = companyId,
				ApplicationId = applicationId,
				EventType = HubSpotEventTypes.CreateEdit,
				HSEntityType = HubSpotEntityTypes.contacts,
				UserId = userId,
				UserJourneyPoint = UserJourneyContextTypes.ApplicationLocked
			});
		}
        #endregion
    }
}
