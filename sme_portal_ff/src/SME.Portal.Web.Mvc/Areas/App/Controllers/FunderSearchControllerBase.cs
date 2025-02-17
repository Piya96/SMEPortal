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
using Microsoft.Extensions.Configuration;
using SME.Portal.Configuration;
using SME.Portal.Web.Areas.App.Controllers.UserJourney;
using SME.Portal.Lenders.Helpers;

namespace SME.Portal.Web.Areas.App.Controllers
{
	[Area("App")]
	[AbpMvcAuthorize]
	public abstract class FunderSearchControllerBase : PortalControllerBase
	{
		protected readonly ApplicationAppServiceExt _applicationsAppServiceExt;
		protected readonly ApplicationsAppService _applicationsAppService;
		protected readonly IProfileAppService _profileAppService;
		protected readonly ITimingAppService _timingAppService;
		protected readonly SmeCompaniesAppServiceExt _smeCompaniesAppServiceExt;
		protected readonly OwnersAppServiceExt _ownersAppServiceExt;
		protected readonly IBackgroundJobManager _backgroundJobManager;
		protected readonly IListItemsAppService _listItemAppService;
		protected readonly IRepository<ListItem, int> _listRepository;
		protected readonly IFinanceProductsAppService _financeProductsAppService;
		protected readonly IMatchesAppService _matchesAppService;
		protected readonly ILendersAppService _lendersAppService;
		protected readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;
		protected readonly IUnitOfWorkManager _unitOfWorkManager;
		protected readonly ITenantCache _tenantCache;
		protected readonly DocumentsAppServiceExt _documentsAppServiceExt;
		protected readonly IBinaryObjectManager _binaryObjectManager;
		protected readonly IWebUrlService _webUrlService;
		protected readonly PdfCrowdAppService _pdfCrowdAppService;
		protected readonly CCRAppService _ccrAppService;
		protected readonly IWebHostEnvironment _webHostEnvironment;
		protected readonly IConfigurationRoot _appConfiguration;
		protected readonly IConfigurationRoot _appConfigurationIds;

		protected bool _finfindBaseline;

		public FunderSearchControllerBase(
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
			IWebHostEnvironment webHostEnvironment,
			IAppConfigurationAccessor configurationAccessor
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
			_appConfiguration = configurationAccessor.Configuration;
			_appConfigurationIds = webHostEnvironment.GetAppConfiguration();

			_finfindBaseline = GetFromSettings("Baseline:IsEnabled") == "True";
		}

		private string GetFromSettings(string name, string defaultValue = null)
		{
			return _appConfiguration[name] ?? defaultValue;
		}

		private async Task<Dictionary<string, List<FinanceProductDto>>> GetApplicationMatchedFinanceProductsDto(int applicationId)
		{
			var loanIndexPagedListItems = await _listItemAppService.GetAll(new List.Dtos.GetAllListItemsInput()
			{
				ParentListIdFilter = _appConfigurationIds["AppConfiguration:LoanIndexTypeListId"]
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
			{
				return _tenantCache.GetOrNull(AbpSession.TenantId.Value)?.TenancyName;
			}
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
			{
				listItems.Add(ObjectMapper.Map<ListItemDto>(o));
			}
			// Get all companies for owner
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
				var financeForListId = props.FirstOrDefault(x => x.Name == "financefor")?.Value;
				var financeForListItems = await _listItemAppService.GetAll(new List.Dtos.GetAllListItemsInput() { ParentListIdFilter = ListIdsHelper.FinanceForListId });

				var financeForListItem = financeForListItems.Items.FirstOrDefault(x => x.ListItem.ListId == financeForListId).ListItem;

				// add the finance for desc as a property
				props.Add(new NameValuePairDto() { Name = "FinanceForDesc", Value = financeForListItem.Name });

				// get the financeForType desc
				var financeForTypeDescProp = await GetFinanceForDescription(props, financeForListItem);

				// add the financefortype desc as a property
				if(financeForTypeDescProp != null)
				{
					props.Add(financeForTypeDescProp);
				}

				// add all props for this applications, 
				appProperties.Add(application.Id, props);

				var company = await _smeCompaniesAppServiceExt.GetSmeCompanyForView(application.SmeCompanyId);
				companies.Add(application.Id, company);

				var owner = await _ownersAppServiceExt.GetOwnerForViewByUser();
				owners.Add(application.Id, owner);

				ApplicationCriteriaDto appCriteria = null;
				ApplicationCriteriaDto_Baseline appCriteria_baseline = null;
				if(_finfindBaseline == false)
				{
					appCriteria = new ApplicationCriteriaDto(props, company.SmeCompany, owner.Owner, listItems, GetTenancyNameOrNull());
				}
				else
				{
					appCriteria_baseline = new ApplicationCriteriaDto_Baseline(props, company.SmeCompany, owner.Owner, listItems, GetTenancyNameOrNull());
				}
				//ApplicationCriteriaDto_Baseline appCriteria_baseline = new ApplicationCriteriaDto_Baseline(props, company.SmeCompany, owner.Owner, listItems, GetTenancyNameOrNull());

				#endregion

				#region Get Match and associated FinanceProducts

				matchedFinanceProducts.Add(application.Id, await GetApplicationMatchedFinanceProductsDto(application.Id));

				#endregion

				#region Get the SmeSubscription for the Companies in each application

				var smeSubscription = await _smeSubscriptionsAppServiceExt.GetCompanySmeSubscription(company.SmeCompany);

				if(!companySmeSubscriptions.ContainsKey(company.SmeCompany.Id))
				{
					companySmeSubscriptions.Add(company.SmeCompany.Id, smeSubscription);
				}
				#endregion

				#region Get the Documents 
				if(!companyDocuments.ContainsKey(application.SmeCompanyId))
				{
					var companyDocumentsPaged = await _documentsAppServiceExt.GetAllByCompanyId(application.SmeCompanyId);
					companyDocuments.Add(application.SmeCompanyId, companyDocumentsPaged.Items.Select(x => x.Document).ToList());
				}
				#endregion
				#region Check to show matches and pricing below 500k
				if(_finfindBaseline == false)
				{
					showMatches.Add(application.Id, ShowMatchesChecks(appCriteria, financeForListId));
					showPricing.Add(application.Id, ShowPricingChecks(appCriteria, smeSubscription));
				}
				else
				{
					showMatches.Add(application.Id, ShowMatchesChecks(appCriteria_baseline, financeForListId));
					showPricing.Add(application.Id, ShowPricingChecks(appCriteria_baseline, smeSubscription));
				}
				//showMatches.Add(application.Id, ShowMatchesChecks(appCriteria_baseline, financeForListId));
				//showPricing.Add(application.Id, ShowPricingChecks(appCriteria_baseline, smeSubscription));

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
				DoesCreditReportExist = doesReportExist,
				IsBaseline = _finfindBaseline
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
			{
				listItemsEx.Add(ObjectMapper.Map<ListItemDto>(o));
			}

			// set the company type
			//company.SmeCompany.Type = listItems.FirstOrDefault(x => x.ListId == company.SmeCompany.Type)?.Name;

			GetApplicationForEditOutput applicationForEdit = null;
			var application = applications.Items.FirstOrDefault(x => x.Application.Locked == null && x.Application.Status == ApplicationStatus.Started.ToString());

			if(application == null)
			{
				applicationForEdit = await GetCreateEditApplicationDto(companyId);
			}
			else
			{
				applicationForEdit = await _applicationsAppService.GetApplicationForEdit(new EntityDto() { Id = application.Application.Id });
			}
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

		private bool ShowMatchesChecks(ApplicationCriteriaDto_Baseline appCriteria, string financeForListId)
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

		private bool ShowPricingChecks(ApplicationCriteriaDto_Baseline appCriteria, SmeSubscriptionDto subscriptionDto)
		{
			return false;
		}

		private bool ShowPricingChecks(ApplicationCriteriaDto appCriteria, SmeSubscriptionDto subscriptionDto)
		{
			return false;
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
					IsBaseline = _finfindBaseline
				};
			}
		}

		private string GetTenancyNameOrNull(int? tenantId)
		{
			if(tenantId.HasValue)
			{
				return _tenantCache.GetOrNull(tenantId.Value)?.TenancyName;
			}
			else
			{
				return null;
			}
		}

		// Implement this method in the tenant specific controller.
		protected abstract string GetProductionUrl();

		// TODO: Get the relevant production url. Needs to be pure virtual. Override in tenant specific controller.
		private string GetBaseUrl()
		{
			if(_webHostEnvironment.IsProduction())
			{
				return GetProductionUrl();
				//return "https://app.finfind.co.za/";
			}
			else if(_webHostEnvironment.IsStaging())
			{
				return "https://app-staging.finfind.co.za/";
			}

			return _webUrlService.GetSiteRootAddress().EnsureEndsWith('/');
		}

		// Implement this method in the tenant specific controller.
		protected abstract string GetTenantName();

		// Implement this method in the tenant specific controller.
		protected virtual string GetBasicScreeningName()
		{
			return "BasicScreening";
		}

		// Implement this method in the tenant specific controller.
		protected virtual string GetFunderSearchName()
		{
			return "FunderSearch";
		}

		public virtual async Task<IActionResult> Index(bool reload = true)
		{
			var settings = await GetMySettings();

			if(!settings.IsOnboarded)
			{
				// TODO: Is this funder-search-index?
				return RedirectToAction("Index", GetTenantName() + GetBasicScreeningName(), new { userMessage = L("PleaseCompleteProfileInformationToContinue") });
			}
			// TODO: Is this funder-search-index?
			var viewModel = await GetFunderSearchesViewModel(null, reload, "Index");

			if(viewModel.PagedFunderSearches.Count == 0)
			{
				// TODO: Is this funder-search-index?
				return RedirectToAction("Index", GetTenantName() + GetBasicScreeningName(), new { userMessage = L("PleasePressStartFunderSearchButton") });
			}

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
						{
							forceEditCompany = false;
						}
					}
				}

				if(string.IsNullOrEmpty(companyPropertiesJson) || forceEditCompany)
				{
					return RedirectToAction("EditCompany", GetTenantName() + GetBasicScreeningName(), new { companyId = company.Id, userMessage = L("UpgradePathMandetoryCompanyEdit") });
				}
			}

			#endregion

			if(_finfindBaseline == true)
			{
				return View("/Areas/App/Views/FunderSearchCommon/funder-search-index.cshtml", viewModel);
			}
			else
			{
				return View(viewModel);
			}
		}

		public async Task<IActionResult> Detail(string id, bool reload = true)
		{
			var applicationId = Convert.ToInt32(SimpleStringCipher.Instance.Decrypt(id));

			// ensure that the application.id belongs to the user session
			var fundingApplicationsPagedDto = await _applicationsAppServiceExt.GetAllForUserId(AbpSession.UserId.Value);

			if(!fundingApplicationsPagedDto.Items.Any(x => x.Application.Id == applicationId))
			{
				// TODO: Is this funder-search-index?
				return RedirectToAction("Index", GetTenantName() + GetBasicScreeningName(), new { userMessage = "Oops we cannot find the associated Funder Search" });
			}

			var viewModel = await GetFunderSearchesViewModel(applicationId, reload, "Detail");

			if(_finfindBaseline == true)
			{
				return View("/Areas/App/Views/FunderSearchCommon/funder-search-detail.cshtml", viewModel);
			}
			else
			{
				return View(viewModel);
			}
		}

		[HttpPost]
		public async Task<ActionResult> Submit([FromBody] FunderSearchSubmissionDto data)
		{
			try
			{
				DateTime? locked = null;

				if(!AbpSession.UserId.HasValue)
				{
					throw new SystemException("User session has expired");
				}
				if(!data.Id.HasValue)
				{
					throw new SystemException("Funder Search Submit dto must have a non null Id");
				}
				#region Write the new Application to the database

				// update funder search / Application entity
				var applicationForEdit = await _applicationsAppService.GetApplicationForEdit(new EntityDto() { Id = data.Id.Value });

				// funder search submission criteria
				var funderSearchCriteria = NameValuePairDto.FromJson(data.MatchCriteriaJson).ToList();

				// concatinate the company properties and funder search properties for matching on final submission
				if(!data.Partial)
				{
					// Set the locked datetime to now
					locked = DateTime.Now;
					var company = await _smeCompaniesAppServiceExt.GetSmeCompanyForView(applicationForEdit.Application.SmeCompanyId);
					var companyProperties = new List<NameValuePairDto>();
					JObject o = JObject.Parse(company.SmeCompany.PropertiesJson);
					if(o["matchCriteriaJson"] != null)
					{
						companyProperties = NameValuePairDto.FromJson(o["matchCriteriaJson"].ToString()).ToList();
					}
					funderSearchCriteria = funderSearchCriteria.Where(x => !string.IsNullOrEmpty(x.Value)).ToList();
					funderSearchCriteria.AddRange(companyProperties.Where(x => !string.IsNullOrEmpty(x.Value)));
				}

				// Update the funder search / application
				var applicationId = await _applicationsAppService.CreateOrEdit(new CreateOrEditApplicationDto()
				{
					Id = data.Id,
					MatchCriteriaJson = JsonConvert.SerializeObject(funderSearchCriteria),
					Status = data.Partial ? ApplicationStatus.Started.ToString() : ApplicationStatus.QueuedForMatching.ToString(),
					Locked = locked,
					SmeCompanyId = applicationForEdit.Application.SmeCompanyId,
					TenantId = applicationForEdit.Application.TenantId,
					UserId = applicationForEdit.Application.UserId,
					CreationTime = applicationForEdit.Application.CreationTime
				});

				#endregion

				#region Queue Matching if final submission

				if(!data.Partial)
				{
					if(_finfindBaseline == true)
					{
						// Queue matching job
						await _backgroundJobManager.EnqueueAsync<MatchingBackgroundJob_Baseline, MatchApplicationDto>(new MatchApplicationDto()
						{
							TenantId = AbpSession.TenantId.Value,
							ApplicationId = applicationId,
							FSSummaryJson = data.FunderSearchJson,
						});
					}
					else
					{
						// Queue matching job
						await _backgroundJobManager.EnqueueAsync<MatchingBackgroundJob, MatchApplicationDto>(new MatchApplicationDto()
						{
							TenantId = AbpSession.TenantId.Value,
							ApplicationId = applicationId,
							FSSummaryJson = data.FunderSearchJson,
						});
					}
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

		public bool TryInsertUserJourney(MySettingsViewModel settings)
		{
			if(settings.PropertiesJson != null && settings.PropertiesJson != "")
			{
				dynamic json = JsonConvert.DeserializeObject<object>(settings.PropertiesJson);
				if(json["user-journey"] != null)
				{
					return false;
				}
				else
				{
					return true;
				}
			}
			else
			{
				return false;
			}
		}

		public async Task<IActionResult> Wizard(int id)
		{
			var settings = await GetMySettings();
			var companyId = id;//Convert.ToInt32(SimpleStringCipher.Instance.Decrypt(aId));

			#region Business Rule: ensure the company exists for the user of the current session.
			// TODO: Is this funder-search-index?
			if(!await _smeCompaniesAppServiceExt.ExistForUser(companyId, AbpSession.UserId.Value))
			{
				return RedirectToAction("Index", GetTenantName() + GetFunderSearchName());
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
				return RedirectToAction("Onboarding", GetTenantName() + GetBasicScreeningName(), new { userMessage = "The number of funder searches per company are limited." });
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
					{
						forceEditCompany = false;
					}
				}
			}

			if(string.IsNullOrEmpty(companyPropertiesJson) || forceEditCompany)
			{
				return RedirectToAction("EditCompany", GetTenantName() + GetBasicScreeningName(), new { companyId = companyId, userMessage = L("UpgradePathMandetoryCompanyEdit") });
			}
			#endregion

			if(_finfindBaseline == true)
			{
				return View("/Areas/App/Views/FunderSearchCommon/funder-search.cshtml", viewModel);
			}
			else
			{
				return View(viewModel);
			}
		}

		[HttpPost]
		public ActionResult FunderSearchSummaryPdfAJAX([FromBody] FunderSearchSummaryInput input)
		{
			var baseUrl = GetBaseUrl();
			var appId = EncryptUrlEncode(input.ApplicationId.ToString());
			var tenantId = EncryptUrlEncode(AbpSession.TenantId.ToString());

			// Create url to render funder search summary page
			var url = string.Empty;

			// TODO: Do this a better way when we have more time.
			//var controller = AbpSession.TenantId == 2
			//	? GetFunderSearchName()
			//	: GetTenantName() + GetFunderSearchName();

			var controller = GetTenantName() + GetFunderSearchName();

			if(_finfindBaseline == true)
			{
				url = $"{baseUrl}App/" + controller + $"/PdfExport_Baseline?appId={appId}&tenantId={tenantId}";
			}
			else
			{
				url = $"{baseUrl}App/" + controller + $"/PdfExport?appId={appId}&tenantId={tenantId}";
			}

			Logger.Info($"Funder Search Summary to Pdf using Url:{url}");
			// Checking if localhost then use finfind.co.za site
			if(baseUrl.Contains("localhost"))
			{
				url = "https://www.finfind.co.za";
			}
			// Create file name
			var filename = $"Funder Search Summary-{DateTime.Now:yyyyMMddHHmmss}.pdf";
			// Generate pdf file and associated output details
			var pdfFileOutput = _pdfCrowdAppService.PdfCrowdRenderUrl(url, filename);
			// Return to caller.
			return Json(pdfFileOutput);
		}

		[HttpPost]
		public ActionResult FunderSearchSummaryPdfAJAXHtml([FromBody] FunderSearchSummaryInput input)
		{
			var appId = EncryptUrlEncode(input.ApplicationId.ToString());
			var tenantId = EncryptUrlEncode(AbpSession.TenantId.ToString());

			//Logger.Info($"Funder Search Summary to Pdf using Url:{url}");

			// checking if localhost then use finfind.co.za site

			// create file name
			var filename = $"Funder Search Summary-{DateTime.Now:yyyyMMddHHmmss}.pdf";

			// generate pdf file and associated output details
			var pdfFileOutput = _pdfCrowdAppService.PdfCrowdRenderHtml(input.Html, filename);

			// return to calling context
			return Json(pdfFileOutput);
		}

		public async Task<ActionResult> PdfExport_Baseline_Test(
			string id
		)
		{
			int appId = Int32.Parse(id);
			return View("/Areas/App/Views/FunderSearchCommon/funder-search-pdf.cshtml", await GetFunderSearchSummaryViewModel(appId, (int)AbpSession.TenantId));
		}

		[AllowAnonymous]
		public async Task<ActionResult> PdfExport_Baseline(string appId, string tenantId)
		{
			var applicationId = DecryptToInt(appId);
			var tenantIdValue = DecryptToInt(tenantId);
			return View("/Areas/App/Views/FunderSearchCommon/funder-search-pdf.cshtml", await GetFunderSearchSummaryViewModel(applicationId, tenantIdValue));
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

		// TODO: What the hell is going on here. FunderSearh folder will be obsolete soon!!!
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
