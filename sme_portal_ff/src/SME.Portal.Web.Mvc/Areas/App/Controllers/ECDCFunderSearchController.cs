using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Controllers;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SME.Portal.SME;
using Abp.UI;
using SME.Portal.Timing;
using SME.Portal.Timing.Dto;
using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.Authorization.Users.Profile;

using Abp.Configuration;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using Abp.BackgroundJobs;
using SME.Portal.SME.Dtos;
using SME.Portal.List;
using SME.Portal.Common.Dto;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Lenders;
using Abp.Domain.Uow;
using Abp.MultiTenancy;
using SME.Portal.Authorization;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.SME.Subscriptions;
using SME.Portal.Web.Areas.App.Models.FunderSearch;
using SME.Portal.Storage;
using SME.Portal.Documents.Dtos;
using SME.Portal.Web.Areas.App.Models.SmeDocuments;
using SME.Portal.Documents;
using System.IO;
using Abp.Domain.Repositories;
using SME.Portal.Matching;
using Abp.Runtime.Security;
using Abp.Application.Services.Dto;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using SME.Portal.Url;
using Abp.Extensions;
using SME.Portal.PdfCrowd;
using SME.Portal.List.Dtos;
using Microsoft.AspNetCore.Authorization;
using System.Web;

using SME.Portal.ConsumerCredit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.Web.Areas.App.Models.Common.UserJourney;
using SME.Portal.Web.Areas.App.Controllers.UserJourney;
using Microsoft.Extensions.Configuration;
using SME.Portal.Configuration;
using SME.Portal.Lenders.Helpers;

namespace SME.Portal.Web.Areas.App.Controllers
{
	[Area("App")]
	[AbpMvcAuthorize]
	public class ECDCFunderSearchController : PortalControllerBase
	{
		private readonly ApplicationAppServiceExt _applicationsAppServiceExt;
		private readonly ApplicationsAppService _applicationsAppService;
		private readonly IProfileAppService _profileAppService;
		private readonly ITimingAppService _timingAppService;
		private readonly SmeCompaniesAppServiceExt _smeCompaniesAppServiceExt;
		private readonly OwnersAppServiceExt _ownersAppServiceExt;
		private readonly IBackgroundJobManager _backgroundJobManager;
		private readonly IListItemsAppService _listItemAppService;
		private readonly IRepository<ListItem, int> _listRepository;
		private readonly IFinanceProductsAppService _financeProductsAppService;
		private readonly IMatchesAppService _matchesAppService;
		private readonly ILendersAppService _lendersAppService;
		private readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;
		private readonly IUnitOfWorkManager _unitOfWorkManager;
		private readonly ITenantCache _tenantCache;
		private readonly DocumentsAppServiceExt _documentsAppServiceExt;
		private readonly IBinaryObjectManager _binaryObjectManager;
		private readonly IWebUrlService _webUrlService;
		private readonly PdfCrowdAppService _pdfCrowdAppService;
		private readonly CCRAppService _ccrAppService;
		private readonly IWebHostEnvironment _webHostEnvironment;
		private readonly List<string> _faultyProps;
        protected readonly IConfigurationRoot _appConfiguration;

		#region Constructor and utility methods

		public ECDCFunderSearchController(
			ApplicationAppServiceExt applicationsAppServiceExt,
			ApplicationsAppService applicationsAppService,
			IProfileAppService profileAppService,
			ITimingAppService timingAppService,
			SmeCompaniesAppServiceExt smeCompaniesAppServiceExt,
			OwnersAppServiceExt ownersAppServiceExt,
			IBackgroundJobManager backgroundJobManager,
			IListItemsAppService listItemAppService,
			IFinanceProductsAppService financeProductsAppService,
			IMatchesAppService matchesAppService,
			ILendersAppService lendersAppService,
			IUnitOfWorkManager unitOfWorkManager,
			ITenantCache tenantCache,
			SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt,
			DocumentsAppServiceExt documentsAppServiceExt,
			IBinaryObjectManager binaryObjectManager,
			IRepository<ListItem, int> listRepository,
			IWebUrlService webUrlService,
			PdfCrowdAppService pdfCrowdAppService,
			CCRAppService ccrAppService,
			IWebHostEnvironment webHostEnvironment
		)
		{
			_applicationsAppServiceExt = applicationsAppServiceExt;
			_applicationsAppService = applicationsAppService;
			_profileAppService = profileAppService;
			_timingAppService = timingAppService;
			_smeCompaniesAppServiceExt = smeCompaniesAppServiceExt;
			_ownersAppServiceExt = ownersAppServiceExt;
			_backgroundJobManager = backgroundJobManager;
			_listItemAppService = listItemAppService;
			_financeProductsAppService = financeProductsAppService;
			_matchesAppService = matchesAppService;
			_lendersAppService = lendersAppService;
			_unitOfWorkManager = unitOfWorkManager;
			_tenantCache = tenantCache;
			_smeSubscriptionsAppServiceExt = smeSubscriptionsAppServiceExt;
			_documentsAppServiceExt = documentsAppServiceExt;
			_binaryObjectManager = binaryObjectManager;
			_listRepository = listRepository;
			_webUrlService = webUrlService;
			_pdfCrowdAppService = pdfCrowdAppService;
			_ccrAppService = ccrAppService;
			_webHostEnvironment = webHostEnvironment;
			_appConfiguration = webHostEnvironment.GetAppConfiguration();

            _faultyProps = new List<string>
			{
				"id",
				"ev",
				"dl",
				"rl",
				"if",
				"ts",
				"cd[buttonFeatures]",
				"cd[buttonText]",
				"cd[formFeatures]",
				"cd[pageFeatures]",
				"cd[parameters]",
				"sw",
				"sh",
				"v",
				"r",
				"a",
				"ec",
				"o",
				"fbp",
				"it",
				"coo",
				"es",
				"tm",
				"rqm"
			};
		}

		private async Task<Dictionary<string, List<FinanceProductDto>>> GetApplicationMatchedFinanceProductsDto(int applicationId)
		{
			var loanIndexPagedListItems = await _listItemAppService.GetAll(new List.Dtos.GetAllListItemsInput()
			{
				ParentListIdFilter = ListIdsHelper.LoanIndexTypeListId
			});

			var loanIndexListItems = loanIndexPagedListItems.Items;

			var loanIndexToFinanceProductsMap = new Dictionary<string, List<FinanceProductDto>>();

			var matchesDto = await _matchesAppService.GetAll(new GetAllMatchesInput()
			{
				MaxApplicationIdFilter = applicationId,
				MinApplicationIdFilter = applicationId,
			});

			if(matchesDto.TotalCount == 0)
				return loanIndexToFinanceProductsMap;

			// finance product id list
			var matchDto = matchesDto.Items.FirstOrDefault();
			var financeProductIdsList = matchDto.Match.FinanceProductIds.Split(',').ToList();

			foreach(var fpId in financeProductIdsList.Where(x => x != "").ToList())
			{
				var financeProductDto = await _financeProductsAppService.GetFinanceProductForView(int.Parse(fpId));
				var financeProduct = financeProductDto.FinanceProduct;

				// get the lenderid and name
				var lenderDto = await _lendersAppService.GetLenderForView(financeProduct.LenderId);
				var lender = lenderDto.Lender;

				financeProduct.LenderId = lender.Id;
				financeProduct.LenderName = lender.Name;

				// get the loan index type
				var financeProductCriteriaDto = FinanceProductCriteriaDto.FromJson(financeProduct.MatchCriteriaJson);

				financeProduct.LoanIndexIds = financeProductCriteriaDto.LoanIndexListIds;

				if(financeProduct.LoanIndexIds == null)
					continue;

				var loanIndexListIds = financeProduct.LoanIndexIds.Split(',').ToList();

				foreach(var loanIndex in loanIndexListIds)
				{
					var loanIndexName = loanIndexListItems.FirstOrDefault(x => x.ListItem.ListId == loanIndex)?.ListItem.Name;

					if(loanIndexToFinanceProductsMap.ContainsKey(loanIndexName))
					{
						var fpList = new List<FinanceProductDto>();
						if(loanIndexToFinanceProductsMap.TryGetValue(loanIndexName, out fpList))
						{
							fpList.Add(financeProduct);
						}
					}
					else
					{
						loanIndexToFinanceProductsMap.Add(loanIndexName, new List<FinanceProductDto> { financeProduct });
					}
				}

			}

			var loanIndexMap = new Dictionary<string, List<FinanceProductDto>>
			{
				{ "Government", new List<FinanceProductDto>() },
				{ "Banks", new List<FinanceProductDto>() },
				{ "Funders - other than Banks and Government", new List<FinanceProductDto>() }
			};

			if(loanIndexToFinanceProductsMap.ContainsKey("Government"))
				loanIndexMap["Government"].AddRange(loanIndexToFinanceProductsMap["Government"]);
			if(loanIndexToFinanceProductsMap.ContainsKey("Bank"))
				loanIndexMap["Banks"].AddRange(loanIndexToFinanceProductsMap["Bank"]);
			if(loanIndexToFinanceProductsMap.ContainsKey("Private Lender"))
				loanIndexMap["Funders - other than Banks and Government"].AddRange(loanIndexToFinanceProductsMap["Private Lender"]);
			if(loanIndexToFinanceProductsMap.ContainsKey("Private Equity"))
				loanIndexMap["Funders - other than Banks and Government"].AddRange(loanIndexToFinanceProductsMap["Private Equity"]);
			if(loanIndexToFinanceProductsMap.ContainsKey("Private Venture Capital"))
				loanIndexMap["Funders - other than Banks and Government"].AddRange(loanIndexToFinanceProductsMap["Private Venture Capital"]);

			return loanIndexMap;
		}

		private async Task<NameValuePairDto> GetFinanceForDescription(List<NameValuePairDto> props, List.Dtos.ListItemDto financeForListItem)
		{
			var listId = "";
			if(financeForListItem.Name.ToLower().Contains("asset"))
			{
				listId = props.FirstOrDefault(x => x.Name == "assetfinancetype").Value;
			}
			else if(financeForListItem.Name.ToLower().Contains("working"))
			{
				listId = props.FirstOrDefault(x => x.Name == "workingcapitaltype").Value;
			}
			else if(financeForListItem.Name.ToLower().Contains("growth"))
			{
				listId = props.FirstOrDefault(x => x.Name == "growthfinancetype").Value;
			}
			else if(financeForListItem.Name.ToLower().Contains("franchise"))
			{
				listId = props.FirstOrDefault(x => x.Name == "franchiseacquisitiontype").Value;
			}
			else if(financeForListItem.Name.ToLower().Contains("research"))
			{
				listId = props.FirstOrDefault(x => x.Name == "researchinnovationfundingtype").Value;
			}
			else if(financeForListItem.Name.ToLower().Contains("other"))
			{
				listId = props.FirstOrDefault(x => x.Name == "otherfinancetype").Value;
			}

			if(!string.IsNullOrEmpty(listId))
			{
				var listItem = await _listItemAppService.GetAll(new List.Dtos.GetAllListItemsInput() { ListIdFilter = listId });
				var desc = listItem.Items.First().ListItem.Name;

				return new NameValuePairDto() { Name = "FinanceForTypeDesc", Value = desc };
			}

			return null;
		}

		private async Task<MySettingsViewModel> GetMySettings()
		{
			var output = await _profileAppService.GetCurrentUserProfileForEdit();
			var mySettingsViewModel = ObjectMapper.Map<MySettingsViewModel>(output);

			mySettingsViewModel.TimezoneItems = await _timingAppService.GetTimezoneComboboxItems(new GetTimezoneComboboxItemsInput
			{
				DefaultTimezoneScope = SettingScopes.User,
				SelectedTimezoneId = output.Timezone
			});

			return mySettingsViewModel;
		}

		private string GetTenancyNameOrNull()
		{
			if(AbpSession.TenantId.HasValue)
				return _tenantCache.GetOrNull(AbpSession.TenantId.Value)?.TenancyName;

			return null;
		}

		private async Task<FunderSearchesViewModel> GetFunderSearchesViewModel(int? id = null, bool reload = true, string view = "Index")
		{
			var appProperties = new Dictionary<int, List<NameValuePairDto>>();
			var companies = new Dictionary<int, GetSmeCompanyForViewDto>();
			var owners = new Dictionary<int, GetOwnerForViewDto>();
			var matchedFinanceProducts = new Dictionary<int, Dictionary<string, List<FinanceProductDto>>>();
			var companySmeSubscriptions = new Dictionary<int, SmeSubscriptionDto>();
			var companyDocuments = new Dictionary<int, List<DocumentDto>>();
			var showMatches = new Dictionary<int, bool>();
			var showPricing = new Dictionary<int, bool>();

			// List items
			var listItemsSet = _listRepository.GetAll().ToList();
			var listItems = new List<ListItemDto>();
			foreach(var o in listItemsSet)
				listItems.Add(ObjectMapper.Map<ListItemDto>(o));

			// get all companies for owner
			var allCompanies = await _smeCompaniesAppServiceExt.GetSmeCompaniesForViewByUser();

			var mySettingsVm = await GetMySettings();

			var fundingApplicationsPagedDto = await _applicationsAppServiceExt.GetAllForUserId(AbpSession.UserId.Value);

			var applications = fundingApplicationsPagedDto.Items.ToList();

			if(id.HasValue)
			{
				applications = applications.Where(x => x.Application.Id == id.Value && x.Application.Locked != null).ToList();
			}
			else /*if(view == "Detail")*/
			{
				applications = applications.Where(x => x.Application.Locked != null).OrderByDescending(x => x.Application.Created).ToList();
			}

			foreach(var appDto in applications)
			{
				var application = appDto.Application;
				var props = NameValuePairDto.FromJson(application.MatchCriteriaJson).ToList();

				#region Get Financefor and Financefortype descriptions for view

				// get all Finance For List Items
				//var financeForListId = props.FirstOrDefault(x => x.Name == "financefor")?.Value;
				//var financeForListItems = await _listItemAppService.GetAll(new List.Dtos.GetAllListItemsInput() { ParentListIdFilter = "59c2c6a37c83b736d463c250" });

				//var financeForListItem = financeForListItems.Items.FirstOrDefault(x => x.ListItem.ListId == financeForListId).ListItem;

				// add the finance for desc as a property
				//props.Add(new NameValuePairDto() { Name = "FinanceForDesc", Value = financeForListItem.Name });

				// get the financeForType desc
				//var financeForTypeDescProp = await GetFinanceForDescription(props, financeForListItem);

				// add the financefortype desc as a property
				//if(financeForTypeDescProp != null)
					//props.Add(financeForTypeDescProp);

				// add all props for this applications, 
				appProperties.Add(application.Id, props);

				var company = await _smeCompaniesAppServiceExt.GetSmeCompanyForView(application.SmeCompanyId);
				companies.Add(application.Id, company);

				var owner = await _ownersAppServiceExt.GetOwnerForViewByUser();
				owners.Add(application.Id, owner);

				var appCriteria = new ApplicationCriteriaDto(props, company.SmeCompany, owner.Owner, listItems, GetTenancyNameOrNull());

				#endregion

				#region Get Match and associated FinanceProducts

				matchedFinanceProducts.Add(application.Id, await GetApplicationMatchedFinanceProductsDto(application.Id));

				#endregion

				#region Get the SmeSubscription for the Companies in each application

				var smeSubscription = await _smeSubscriptionsAppServiceExt.GetCompanySmeSubscription(company.SmeCompany);

				if(!companySmeSubscriptions.ContainsKey(company.SmeCompany.Id))
					companySmeSubscriptions.Add(company.SmeCompany.Id, smeSubscription);

				#endregion

				#region Get the Documents 
				if(!companyDocuments.ContainsKey(application.SmeCompanyId))
				{
					var companyDocumentsPaged = await _documentsAppServiceExt.GetAllByCompanyId(application.SmeCompanyId);
					companyDocuments.Add(application.SmeCompanyId, companyDocumentsPaged.Items.Select(x => x.Document).ToList());
				}


				#endregion

				#region Check to show matches and pricing below 500k

				//showMatches.Add(application.Id, ShowMatchesChecks(appCriteria, financeForListId));
				showPricing.Add(application.Id, ShowPricingChecks(appCriteria, smeSubscription));

				#endregion
			}

			var doesReportExist = _ccrAppService.DoesReportExist();

			return new FunderSearchesViewModel()
			{
				Settings = mySettingsVm,
				PagedFunderSearches = applications,
				ApplicationProperties = appProperties,
				Companies = companies,
				AllCompanies = allCompanies,
				Owners = owners,
				MatchedFinanceProducts = matchedFinanceProducts,
				CompanySmeSubscriptions = companySmeSubscriptions,
				CompanyDocuments = companyDocuments,
				HasOnboarded = mySettingsVm.IsOnboarded,
				ListItems = listItems,
				Reload = reload,
				View = view,
				ShowMatches = showMatches,
				ShowPricing = showPricing,
				DoesCreditReportExist = doesReportExist
			};
		}

		private async Task<CreateEditFunderSearchViewModel> CreateEditFunderSearchViewModel(int companyId, SmeSubscriptionDto subscription)
		{
			var settings = await GetMySettings();
			var company = await _smeCompaniesAppServiceExt.GetSmeCompanyForView(companyId);
			var owner = await _ownersAppServiceExt.GetOwnerForViewByUser();
			var applications = await _applicationsAppServiceExt.GetAll(new GetAllApplicationsInput() { UserNameFilter = settings.UserName, SmeCompanyId = companyId });
			var pagedDocuments = await _documentsAppServiceExt.GetAllByCompanyId(companyId);
			var listItems = _listRepository.GetAll().ToList();

			var listItemsSet = _listRepository.GetAll().ToList();
			var listItemsEx = new List<ListItemDto>();
			foreach(var o in listItemsSet)
				listItemsEx.Add(ObjectMapper.Map<ListItemDto>(o));

			// set the company type
			//company.SmeCompany.Type = listItems.FirstOrDefault(x => x.ListId == company.SmeCompany.Type)?.Name;

			GetApplicationForEditOutput applicationForEdit = null;
			var application = applications.Items.FirstOrDefault(x => x.Application.Locked == null && x.Application.Status == ApplicationStatus.Started.ToString());

			if(application == null)
				applicationForEdit = await GetCreateEditApplicationDto(companyId);
			else
				applicationForEdit = await _applicationsAppService.GetApplicationForEdit(new EntityDto() { Id = application.Application.Id });


			return new CreateEditFunderSearchViewModel
			{
				IsOnboarded = settings.IsOnboarded,
				SmeCompany = company,
				Application = applicationForEdit,
				UserProfile = settings,
				OwnerProfile = owner,
				ListItems = listItems,
				ListItemsEx = listItemsEx,
				Documents = pagedDocuments.Items.ToList(),
				Subscription = subscription
			};
		}

		private async Task<GetApplicationForEditOutput> GetCreateEditApplicationDto(int companyId)
		{
			var applicationId = await _applicationsAppServiceExt.CreateOrEdit(new CreateOrEditApplicationDto()
			{
				SmeCompanyId = companyId,
				TenantId = (int)AbpSession.TenantId,
				MatchCriteriaJson = "[]",
				Status = ApplicationStatus.Started.ToString(),
				UserId = (long)AbpSession.UserId
			});


			var application = await _applicationsAppService.GetApplicationForEdit(new EntityDto()
			{
				Id = applicationId
			});
			return application;
		}

		private void ExportFunderSummaryPdfCrowd(int applicationId, string outputFileName)
		{
			try
			{
				// create the API client instance
				pdfcrowd.HtmlToPdfClient client = new pdfcrowd.HtmlToPdfClient("FinfindSupport", "33a27bd132c7840311a75c8c4532eb8d");

				// configure the conversion
				client.setPageSize("A3");

				// run the conversion and write the result to a file
				var baseUrl = _webUrlService.GetSiteRootAddress(GetTenancyNameOrNull()).EnsureEndsWith('/');
				var encryptedId = SimpleStringCipher.Instance.Encrypt(applicationId.ToString());
				var url = $"{baseUrl}App/ECDCFunderSearch/Wizard?applicationId={applicationId}";

				client.convertUrlToFile(url, outputFileName);
			}
			catch(pdfcrowd.Error why)
			{
				// report the error
				Logger.Error($"Pdfcrowd failed to render FunderSearch.Id:{applicationId} Summary Error: {why}");

				// rethrow or handle the exception
				throw;
			}
		}

		public byte[] PdfSharpConvert(string html)
		{
			try
			{
				// create the API client instance
				pdfcrowd.HtmlToPdfClient client = new pdfcrowd.HtmlToPdfClient("FinfindSupport", "33a27bd132c7840311a75c8c4532eb8d");
				client.setPageHeight("-1");

				return client.convertString(html);

			}
			catch(pdfcrowd.Error why)
			{
				// report the error
				Logger.Error("Pdfcrowd Error: " + why);

				// rethrow or handle the exception
				throw;
			}
		}

		private bool ShowMatchesChecks(ApplicationCriteriaDto appCriteria, string financeForListId)
		{
			// annual turnover check
			if(appCriteria.AverageAnnualTurnoverMax <= 500000 || appCriteria.MonthsTrading < 6)
			{
				// financeFor and FinanceFor Sub
				var financeForSubListId = appCriteria.FinanceForSubListId;

				if(financeForSubListId == "59cc9d26132f4c40c446a4f7" ||        // Cash advance for an invoice
					financeForSubListId == "59cca8a430e9df02c82d0795" ||        // Money to help with a contract
					financeForSubListId == "59cca89030e9df02c82d0794" ||        // Money to help with a tender
					financeForSubListId == "5b213996b958c008605883e8" ||        // Purchase order funding
					financeForSubListId == "59d26a1620070a604097b04d" ||        // Funding to buy an existing business
					financeForSubListId == "59d26a5320070a604097b051" ||        // Funding for green initiatives
					financeForSubListId == "5acb467062ba593724e0a78a" ||        // Cash for retailers with a card machine
					financeForSubListId == "59d26a4820070a604097b050")          // Tech innovation
				{
					return true;
				}
			}

			// annual turnover check
			if(appCriteria.AverageAnnualTurnoverMax > 500000 && appCriteria.MonthsTrading >= 6)
			{
				return true;
			}

			// basically we never show matches
			return false;
		}

		private bool ShowPricingChecks(ApplicationCriteriaDto appCriteria, SmeSubscriptionDto subscriptionDto)
		{
			return false;

			//if (subscriptionDto.EditionFk.DisplayName.Contains("Paid"))
			//    return false;

			//// annual turnover and trading months check
			//if (appCriteria.AverageAnnualTurnoverMax > 500000 && appCriteria.MonthsTrading >= 6)
			//    return true;

			//// annual turnover below R500k or months trading less than 6 months
			//if (appCriteria.AverageAnnualTurnoverMax <= 500000 || appCriteria.MonthsTrading < 6)
			//{
			//    // financeFor and FinanceFor Sub
			//    var financeForSubListId = appCriteria.FinanceForSubListId;

			//    if (financeForSubListId == "59cc9d26132f4c40c446a4f7" ||        // Cash advance for an invoice
			//        financeForSubListId == "59cca8a430e9df02c82d0795" ||        // Money to help with a contract
			//        financeForSubListId == "59cca89030e9df02c82d0794" ||        // Money to help with a tender
			//        financeForSubListId == "5b213996b958c008605883e8" ||        // Purchase order funding
			//        financeForSubListId == "59d26a1620070a604097b04d" ||        // Funding to buy an existing business
			//        financeForSubListId == "59d26a5320070a604097b051" ||        // Funding for green initiatives
			//        financeForSubListId == "5acb467062ba593724e0a78a" ||        // Cash for retailers with a card machine
			//        financeForSubListId == "59d26a4820070a604097b050")          // Tech innovation
			//    {
			//        return true;
			//    }
			//}

			//return false;
		}

		private async Task<FunderSearchSummaryViewModel> GetFunderSearchSummaryViewModel(int applicationId, int tenantId)
		{
			using(CurrentUnitOfWork.SetTenantId(tenantId))
			{
				// List items
				var listItemsSet = _listRepository.GetAll().ToList();
				var listItems = new List<ListItemDto>();
				foreach(var o in listItemsSet)
					listItems.Add(ObjectMapper.Map<ListItemDto>(o));

				// Funder Search / Application
				var applicationForView = await _applicationsAppService.GetApplicationForView(applicationId);
				var application = applicationForView.Application;

				// User Profile
				var userProfile = await _profileAppService.GetUserProfileForEdit((int)application.UserId);
				var mySettingsViewModel = ObjectMapper.Map<MySettingsViewModel>(userProfile);

				// Company and Subscription
				var company = await _smeCompaniesAppServiceExt.GetSmeCompanyForView(application.SmeCompanyId);
				var companySmeSubscription = await _smeSubscriptionsAppServiceExt.GetCompanySmeSubscription(company.SmeCompany);

				// Owner
				var owner = await _ownersAppServiceExt.GetOwnerForViewByUserId(company.SmeCompany.UserId);

				var applicationCriteria = NameValuePairDto.FromJsonAsList(application.MatchCriteriaJson);
				string productGuid = string.Empty;
				var documents = new List<UploadedSefaDocumentDto>();
				for(int i = 0; i < applicationCriteria.Count; i++)
				{
					NameValuePairDto nvp = applicationCriteria[i];
					if(nvp.Name == "input-product-guid")
					{
						productGuid = nvp.Value;
						break;
					}
				}
				if(productGuid != "")
				{
					documents = await _documentsAppServiceExt.GetAllUploadedSefaDocuments(productGuid, company.SmeCompany.Id);
				}
				return new FunderSearchSummaryViewModel
				{
					SmeCompany = company.SmeCompany,
					Application = applicationForView.Application,
					OwnerProfile = owner.Owner,
					Settings = mySettingsViewModel,
					ListItems = listItems,
					Subscription = companySmeSubscription,
					TenancyName = GetTenancyNameOrNull(application.TenantId),
					IncludeHeader = true,
					Documents = documents
				};
			}
		}

		private string GetTenancyNameOrNull(int? tenantId)
		{
			if(tenantId.HasValue)
				return _tenantCache.GetOrNull(tenantId.Value)?.TenancyName;

			return null;
		}

		private string GetBaseUrl()
		{
			if(_webHostEnvironment.IsProduction())
			{
				return "https://app.finfind.co.za/";
			}
			else if(_webHostEnvironment.IsStaging())
			{
				return "https://app-staging.finfind.co.za/";
			}

			return _webUrlService.GetSiteRootAddress().EnsureEndsWith('/');
		}

		#endregion

		public async Task<IActionResult> Index(bool reload = true)
		{

			#region Authorize Routing

			if(AbpSession.MultiTenancySide == MultiTenancySides.Host)
			{
				if(await IsGrantedAsync(AppPermissions.Pages_Administration_Host_Dashboard))
				{
					return RedirectToAction("Index", "HostDashboard");
				}

				if(await IsGrantedAsync(AppPermissions.Pages_Tenants))
				{
					return RedirectToAction("Index", "Tenants");
				}
			}
			else
			{
				if(await IsGrantedAsync(AppPermissions.Pages_Tenant_Dashboard))
				{
					return RedirectToAction("Index", "TenantDashboard");
				}

				// TODO: Make sure this is needed.
				if(AbpSession.TenantId == 2)
					return RedirectToAction("Index", "FunderSearch");

				// Tenant SME split
				if(AbpSession.TenantId == 3)
					return RedirectToAction("Index", "SefaApplication");

				// ECDC???
			}

			#endregion

			var settings = await GetMySettings();

			if(!settings.IsOnboarded)
				return RedirectToAction("Index", "ECDCSme", new { userMessage = L("PleaseCompleteProfileInformationToContinue") });

			var viewModel = await GetFunderSearchesViewModel(null, reload, "Index");

			if(viewModel.PagedFunderSearches.Count == 0)
				return RedirectToAction("Index", "ECDCSme", new { userMessage = L("PleasePressStartFunderSearchButton") });

			#region Upgrade path: version 2 compatibility check. 

			foreach(var company in viewModel.Companies.Values.Select(x => x.SmeCompany).ToList())
			{
				var forceEditCompany = true;
				var companyPropertiesJson = company.PropertiesJson;

				if(!string.IsNullOrEmpty(companyPropertiesJson))
				{
					dynamic obj = JsonConvert.DeserializeObject<object>(companyPropertiesJson);

					foreach(var item in obj)
					{
						if(item.Name == "matchCriteriaJson")
							forceEditCompany = false;
					}
				}

				if(string.IsNullOrEmpty(companyPropertiesJson) || forceEditCompany)
					return RedirectToAction("EditCompany", "ECDCSme", new { companyId = company.Id, userMessage = L("UpgradePathMandetoryCompanyEdit") });
			}

			#endregion

			//var applicationId = 5664;
			//var tenantIdValue = 5;

			//return View("PdfExport", await GetFunderSearchSummaryViewModel(applicationId, tenantIdValue));

			//return View("PdfExport", viewModel);
			return View(viewModel);
		}

		public async Task<IActionResult> Detail(string id, bool reload = true)
		{
			var applicationId = Convert.ToInt32(SimpleStringCipher.Instance.Decrypt(id));

			// ensure that the application.id belongs to the user session
			var fundingApplicationsPagedDto = await _applicationsAppServiceExt.GetAllForUserId(AbpSession.UserId.Value);

			if(!fundingApplicationsPagedDto.Items.Any(x => x.Application.Id == applicationId))
				return RedirectToAction("Index", "ECDCSme", new { userMessage = "Oops we cannot find the associated Funder Search" });

			var viewModel = await GetFunderSearchesViewModel(applicationId, reload, "Detail");

			return View(viewModel);
		}

		[HttpPost]
		public async Task<ActionResult> Submit([FromBody] FunderSearchSubmissionDto data)
		{
			try
			{
				#region Session and Application.Id validation

				if(!AbpSession.UserId.HasValue)
					throw new SystemException("User session has expired");

				if(!data.Id.HasValue)
					throw new SystemException("ECDC Application Submit dto must have a non null Id");

				#endregion

				var applicationForEdit = await _applicationsAppService.GetApplicationForEdit(new EntityDto() { Id = data.Id.Value });

				#region Concatinate the Company.PropertiesJson.MatchCriteriaJson and Application.MatchCriteriaJson

				var applicationCriteria = NameValuePairDto.FromJsonAsList(data.MatchCriteriaJson);

				foreach(var fault in _faultyProps)
				{
					if(applicationCriteria.Exists(x => x.Name == fault))
						applicationCriteria.Remove(applicationCriteria.FirstOrDefault(x => x.Name == fault));
				}

				if(!data.Partial)
				{
					var company = await _smeCompaniesAppServiceExt.GetSmeCompanyForView(applicationForEdit.Application.SmeCompanyId);
					var companyProperties = new List<NameValuePairDto>();

					#region Backwards compatibility where we had match criteria

					JObject o = JObject.Parse(company.SmeCompany.PropertiesJson);

					if(o["matchCriteriaJson"] != null)
						companyProperties = NameValuePairDto.FromJson(o["matchCriteriaJson"].ToString()).ToList();

					applicationCriteria.AddRange(companyProperties.Where(x => !string.IsNullOrEmpty(x.Value)));

					#endregion

					applicationCriteria = applicationCriteria.Where(x => !string.IsNullOrEmpty(x.Value)).ToList();
				}

				#endregion

				#region Copy Application.MatchcriteriaJson to Application.PropertiesJson

				var matchCriteriaProps = new Dictionary<string, string>();

				foreach(var pair in applicationCriteria)
				{
					if(matchCriteriaProps.ContainsKey(pair.Name) == false)
					{
						matchCriteriaProps.Add(pair.Name, pair.Value);
					}
					else
					{
						var valueStr = string.Empty;
						// handle duplicates with comma separated list
						if(matchCriteriaProps.TryGetValue(pair.Name, out valueStr))
							valueStr = $"{valueStr},{pair.Value}";
					}
				}

				foreach(var fault in _faultyProps)
				{
					if(matchCriteriaProps.ContainsKey(fault))
						matchCriteriaProps.Remove(fault);
				}

				// create if not exist
				if(applicationForEdit.Application.PropertiesJson == null)
				{
					var propertiesJObj = new JObject
					{
						["match-criteria"] = JObject.Parse(JsonConvert.SerializeObject(matchCriteriaProps))
					};
				}
				else // add to existing 
				{
					dynamic appPropertiesJObj = JsonConvert.DeserializeObject<object>(applicationForEdit.Application.PropertiesJson);
					appPropertiesJObj["match-criteria"] = JObject.Parse(JsonConvert.SerializeObject(matchCriteriaProps));
					applicationForEdit.Application.PropertiesJson = appPropertiesJObj.ToString();
				}

				#endregion

				#region Update Application

				var applicationId = await _applicationsAppService.CreateOrEdit(new CreateOrEditApplicationDto()
				{
					Id = data.Id,
					MatchCriteriaJson = JsonConvert.SerializeObject(applicationCriteria),
					Status = data.Partial ? ApplicationStatus.Started.ToString() : ApplicationStatus.Matched.ToString(),
					Locked = data.Partial ? (DateTime?)null : DateTime.Now,
					SmeCompanyId = applicationForEdit.Application.SmeCompanyId,
					TenantId = applicationForEdit.Application.TenantId,
					UserId = applicationForEdit.Application.UserId,
					PropertiesJson = applicationForEdit.Application.PropertiesJson,
					CreationTime = applicationForEdit.Application.CreationTime
				});

				#endregion

				#region Final submission functionality

				if(!data.Partial)
				{
					#region QLana integration job
					//await _backgroundJobManager.EnqueueAsync<QLanaCreateUpdateBackgroundJob, QlanaEventTriggerDto>(new QlanaEventTriggerDto()
					//{
					//    TenantId = (int)AbpSession.TenantId,
					//    ApplicationId = applicationId,
					//    EntityType = QlanaEntityTypes.Project,
					//}, BackgroundJobPriority.Normal);
					#endregion

					#region Queue HubSpot Event

					Logger.Info("Queuing HubSpot Job - Finance Application, Company and Owner properties sync");

					// queue the job to add funder search to crm
					await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
					{
						TenancyName = "ecdc",
						TenantId = applicationForEdit.Application.TenantId,
						ApplicationId = applicationForEdit.Application.Id,
						EventType = HubSpotEventTypes.CreateEdit,
						HSEntityType = HubSpotEntityTypes.deals,
						UserJourneyPoint = UserJourneyContextTypes.ApplicationLocked
					});

					// queue the job to add company to crm
					await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
					{
						TenancyName = "ecdc",
						TenantId = applicationForEdit.Application.TenantId,
						SmeCompanyId = applicationForEdit.Application.SmeCompanyId,
						ApplicationId = applicationForEdit.Application.Id,
						EventType = HubSpotEventTypes.CreateEdit,
						HSEntityType = HubSpotEntityTypes.companies,
						UserJourneyPoint = UserJourneyContextTypes.ApplicationLocked
					});

					// queue the job to add contact/owner to crm
					await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
					{
						TenancyName = "ecdc",
						TenantId = applicationForEdit.Application.TenantId,
						SmeCompanyId = applicationForEdit.Application.SmeCompanyId,
						ApplicationId = applicationForEdit.Application.Id,
						EventType = HubSpotEventTypes.CreateEdit,
						HSEntityType = HubSpotEntityTypes.contacts,
						UserId = applicationForEdit.Application.UserId,
						UserJourneyPoint = UserJourneyContextTypes.ApplicationLocked
					});

					#endregion

					#region SMS Messaging to Owner

					//var owner = await _ownersAppServiceExt.GetOwnerForViewByUser();
					//var applicationNumber = _sefaLASAppService.GetApplicationNo(applicationForEdit.Application.PropertiesJson);
					//await _smsSender.SendAsync(owner.Owner.PhoneNumber, $"You have submitted a loan application to sefa. Your application number is #{applicationNumber}.");

					#endregion

				}

				#endregion

				return Json(new { id = HttpUtility.UrlEncode(SimpleStringCipher.Instance.Encrypt(applicationId.ToString())) });
			}
			catch(Exception x)
			{
				Logger.Error(x.Message);

				throw new UserFriendlyException(x.Message);
			}
		}

		public async Task<IActionResult> Wizard(int id)
		{
			var companyId = id;//Convert.ToInt32(SimpleStringCipher.Instance.Decrypt(aId));

			var settings = await GetMySettings();
			#region Business Rule: ensure the company exists for the user of the current session.
			if(!await _smeCompaniesAppServiceExt.ExistForUser(companyId, AbpSession.UserId.Value))
			{
				return RedirectToAction("Index");
			}
			#endregion

			var companySmeSubscription = await _smeSubscriptionsAppServiceExt.GetCompanySmeSubscriptionById(companyId);

			#region Business Rule: limit the number of funder searches per company
			var applicationCountForCompany = await _applicationsAppServiceExt.GetAll(new GetAllApplicationsInput()
			{
				SmeCompanyId = companyId
			});

			if(applicationCountForCompany.TotalCount >= 3)
			{
				return RedirectToAction("Onboarding", "ECDCSme", new { userMessage = "The number of funder searches per company are limited." });
			}
			#endregion

			var viewModel = await CreateEditFunderSearchViewModel(companyId, companySmeSubscription);

			#region Upgrade path: version 2 compatibility check. 

			var forceEditCompany = true;
			var companyPropertiesJson = viewModel.SmeCompany.SmeCompany.PropertiesJson;

			if(!string.IsNullOrEmpty(companyPropertiesJson))
			{
				dynamic obj = JsonConvert.DeserializeObject<object>(companyPropertiesJson);

				foreach(var item in obj)
				{
					if(item.Name == "matchCriteriaJson")
						forceEditCompany = false;
				}
			}

			if(string.IsNullOrEmpty(companyPropertiesJson) || forceEditCompany)
				return RedirectToAction("EditCompany", "ECDCSme", new { companyId = companyId, userMessage = L("UpgradePathMandetoryCompanyEdit") });

			#endregion

			return View("funder-search", viewModel);
			//return View(viewModel);
		}

		public async Task<ActionResult> PdfExport_Baseline_Test(
			string id
		)
		{
			int appId = Int32.Parse(id);
			return View("PdfExport", await GetFunderSearchSummaryViewModel(appId, (int)AbpSession.TenantId));
		}

		[HttpPost]
		public ActionResult FunderSearchSummaryPdfAJAX([FromBody] FunderSearchSummaryInput input)
		{
			// get base url
			var baseUrl = GetBaseUrl();

			var appId = EncryptUrlEncode(input.ApplicationId.ToString());
			var tenantId = EncryptUrlEncode(AbpSession.TenantId.ToString());

			// create url to render funder search summary page
			var url = $"{baseUrl}App/ECDCFunderSearch/PdfExport?appId={appId}&tenantId={tenantId}";

			Logger.Info($"Funder Search Summary to Pdf using Url:{url}");

			// checking if localhost then use finfind.co.za site
			if(baseUrl.Contains("localhost"))
				url = "https://www.finfind.co.za";

			// create file name
			var filename = $"Funder Search Summary-{DateTime.Now:yyyyMMddHHmmss}.pdf";


			var vm = GetFunderSearchSummaryViewModel(input.ApplicationId, (int) AbpSession.TenantId);

			// generate pdf file and associated output details
			var pdfFileOutput = _pdfCrowdAppService.PdfCrowdRenderUrl(url, filename);

			// return to calling context
			return Json(pdfFileOutput);
		}

		[AllowAnonymous]
		public async Task<ActionResult> PdfExport(string appId, string tenantId)
		{
			var applicationId = DecryptToInt(appId);
			var tenantIdValue = DecryptToInt(tenantId);

			return View(await GetFunderSearchSummaryViewModel(applicationId, tenantIdValue));
		}

		[AllowAnonymous]
		public ActionResult PdfExportById(int id, string tenantId)
		{
			return RedirectToAction("PdfExport", new { appId = DecryptToInt(id.ToString()), tenantId = DecryptToInt(tenantId.ToString()) });
		}

		[HttpPost("App/FunderSearch/UploadFiles")]
		[IgnoreAntiforgeryToken]
		public async Task<IActionResult> UploadFiles(DocumentsUploadPostVm model)
		{
			try
			{
				foreach(var file in model.Files)
				{
					long length = file.Length;
					if(length <= 0)
						continue;

					using var fileStream = file.OpenReadStream();
					byte[] bytes = new byte[length];
					fileStream.Read(bytes, 0, (int)file.Length);

					var binaryObject = new BinaryObject() { TenantId = AbpSession.TenantId, Bytes = bytes };
					await _binaryObjectManager.SaveAsync(binaryObject);

					var doc = new CreateOrEditDocumentDto()
					{
						FileName = file.FileName,
						FileType = file.ContentType,
						Type = model.DocumentType,
						BinaryObjectId = binaryObject.Id,
						SmeCompanyId = model.SmeCompanyId
					};

					await _documentsAppServiceExt.CreateOrEdit(doc);
				}
			}
			catch(Exception ex)
			{
				Logger.Error($"Failed to Upload SmeDocument Files with Exception:{ex.Message}");
				return BadRequest(ex.Message);
			}

			return Ok();
		}

	}
}
