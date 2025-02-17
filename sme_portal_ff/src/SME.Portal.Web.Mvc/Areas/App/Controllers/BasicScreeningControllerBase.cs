using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Configuration;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Authorization.Users.Profile.Dto;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using SME.Portal.Configuration;
using SME.Portal.Timing;
using SME.Portal.Timing.Dto;
using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.Web.Areas.App.Models.SME;
using SME.Portal.Web.Controllers;
using SME.Portal.Web.Areas.App.Models.Owners;
using SME.Portal.SME;
using SME.Portal.List;
using Abp.Domain.Repositories;
using System.Linq;
using SME.Portal.SME.Dtos;
using SME.Portal.List.Dtos;
using SME.Portal.SME.Subscriptions;
using System.Collections.Generic;
using SME.Portal.Sme.Subscriptions.Dtos;
using System;
using Abp.Runtime.Security;
using Microsoft.Extensions.Configuration;


namespace SME.Portal.Web.Areas.App.Controllers
{
	[Area("App")]
	[AbpMvcAuthorize]
	public abstract class BasicScreeningControllerBase : PortalControllerBase
	{

		private readonly IProfileAppService _profileAppService;
		private readonly ITimingAppService _timingAppService;

		private readonly OwnersAppServiceExt _ownersAppServiceExt;
		private readonly SmeCompaniesAppServiceExt _smeCompaniesServiceExt;
		private readonly ApplicationAppServiceExt _applicationAppServiceExt;
		private readonly IRepository<ListItem, int> _listItemRepository;
		private readonly ApplicationAppServiceExt _applicationsAppServiceExt;
		private readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;
		protected readonly IConfigurationRoot _appConfiguration;

		protected bool _finfindBaseline;

		public BasicScreeningControllerBase(
			IProfileAppService profileAppService,
			ITimingAppService timingAppService,
			OwnersAppServiceExt ownersAppServiceExt,
			SmeCompaniesAppServiceExt smeCompaniesServiceExt,
			ApplicationAppServiceExt applicationAppServiceExt,
			IRepository<ListItem, int> listItemRepository,
			ApplicationAppServiceExt applicationsAppServiceExt,
			SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt,
			IAppConfigurationAccessor configurationAccessor
		)
		{
			_profileAppService = profileAppService;
			_timingAppService = timingAppService;
			_ownersAppServiceExt = ownersAppServiceExt;
			_smeCompaniesServiceExt = smeCompaniesServiceExt;
			_applicationAppServiceExt = applicationAppServiceExt;
			_listItemRepository = listItemRepository;
			_applicationsAppServiceExt = applicationsAppServiceExt;
			_smeSubscriptionsAppServiceExt = smeSubscriptionsAppServiceExt;
			_appConfiguration = configurationAccessor.Configuration;

			_finfindBaseline = GetFromSettings("Baseline:IsEnabled") == "True";
		}

		protected string GetFromSettings(string name, string defaultValue = null)
		{
			return _appConfiguration[name] ?? defaultValue;
		}

		private OwnerViewModel GetOwnerDetails()
		{
			var ownerModel = new OwnerViewModel();
			Task<GetOwnerForViewDto> ownerDto = _ownersAppServiceExt.GetOwnerForViewByUser();
			ownerModel.Owner = ownerDto.Result.Owner;
			ownerModel.UserName = ownerDto.Result.UserName;
			return ownerModel;
		}

		protected async Task<MySettingsViewModel> GetMySettings()
		{
			var output = await _profileAppService.GetCurrentUserProfileForEdit();
			var mySettingsViewModel = ObjectMapper.Map<MySettingsViewModel>(output);

			mySettingsViewModel.TimezoneItems = await _timingAppService.GetTimezoneComboboxItems(new GetTimezoneComboboxItemsInput
			{
				DefaultTimezoneScope = SettingScopes.User,
				SelectedTimezoneId = output.Timezone
			});

			mySettingsViewModel.TenantId = AbpSession.TenantId;

			mySettingsViewModel.SmsVerificationEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.SmsVerificationEnabled);

			return mySettingsViewModel;
		}

		public virtual async Task<IActionResult> __Index__(string userMessage = null)
		{
			var mySettingsVm = await GetMySettings();
			var applications = await _applicationAppServiceExt.GetAllForUserId(AbpSession.UserId.Value);

			if(mySettingsVm.IsOnboarded == true)
			{
				return RedirectToAction("Onboarding", GetTenantName() + "BasicScreening", new { userMessage = userMessage });
			}

			SMEOnboardingWizardViewModel vm = new SMEOnboardingWizardViewModel
			{
				CompanyCount = 0,
				MySettings = mySettingsVm,
				Mode = SMEMode.Normal,
				ListItems = GetListItems(),
				UserMessage = userMessage
			};

			if(_finfindBaseline == true)
			{
				return View("/Areas/App/Views/BasicScreeningCommon/basic-screening.cshtml", vm);
			}
			else
			{
				return View(vm);
			}
		}

		public virtual async Task<IActionResult> Index(string userMessage = null)
		{
			return await __Index__(userMessage);
		}

		public async Task<int> GetCompanyCount()
		{
			Task<List<GetSmeCompanyForViewDto>> companies = _smeCompaniesServiceExt.GetSmeCompaniesForViewByUser();
			await companies;
			return companies.Result.Count;
		}

		private List<ListItemDto> GetListItems()
		{
			var listItemsSet = _listItemRepository.GetAll().ToList();
			var listItems = new List<ListItemDto>();
			foreach(var o in listItemsSet)
			{
				listItems.Add(ObjectMapper.Map<ListItemDto>(o));
			}
			return listItems;
		}

		public async Task<IActionResult> AddCompany()
		{
			var viewModel = new SMEOnboardingWizardViewModel();

			var mySettings = await GetMySettings();

			viewModel.CompanyCount = 0;
			viewModel.MySettings = mySettings;
			viewModel.Mode = SMEMode.Add;
			viewModel.ListItems = GetListItems();

			if(_finfindBaseline == true)
			{
				return View("/Areas/App/Views/BasicScreeningCommon/basic-screening.cshtml", viewModel);
			}
			else
			{
				return View("Index", viewModel);
			}
		}

		public async Task<IActionResult> EditCompany(string cId, string userMessage)
		{
			var companyId = Convert.ToInt32(SimpleStringCipher.Instance.Decrypt(cId));

			var viewModel = new SMEOnboardingWizardViewModel();

			var mySettings = await GetMySettings();

			viewModel.CompanyCount = 0;
			viewModel.MySettings = mySettings;
			viewModel.Mode = SMEMode.Edit;
			viewModel.ListItems = GetListItems();
			viewModel.CompanyId = companyId;
			viewModel.UserMessage = userMessage;

			if(_finfindBaseline == true)
			{
				return View("/Areas/App/Views/BasicScreeningCommon/basic-screening.cshtml", viewModel);
			}
			else
			{
				return View("Index", viewModel);
			}
		}

		public async Task<IActionResult> EnableOnboarding()
		{
			Task<CurrentUserProfileEditDto> userDto = _profileAppService.GetCurrentUserProfileForEdit();
			await userDto;
			userDto.Result.IsOnboarded = false;
			Task userUpdateTask = _profileAppService.UpdateCurrentUserProfile(userDto.Result);
			await userUpdateTask;
			return RedirectToAction("Index", GetTenantName() + "BasicScreening");
		}

		[HttpPost]
		public IActionResult RenderPartialView([FromBody] SMEModalView view)
		{
			return PartialView(view.View);
		}

		// TODO: Not today, but sometime, find a away to make this finfind specific.
		public async Task<IActionResult> BaselineMigration()
		{
			SMEOnboardingSummary vm = new SMEOnboardingSummary
			{
				MySettings = await GetMySettings(),
				ListItems = GetListItems()
			};
			// TODO: Move this somewhere common.
			return View("/Areas/App/Views/BasicScreeningCommon/baseline-migration.cshtml", vm);
		}

		// Returns whether a company edit button should be active.
		private bool IsEditable(GetSmeCompanyForViewDto company, List<GetApplicationForViewDto> apps)
		{
			for(int i = 0; i < apps.Count; i++)
			{
				if(company.SmeCompany.Id == apps[i].Application.SmeCompanyId)
				{
					// The first submimtted application forces the associated company edit button to be taken out.
					if(	apps[i].Application.Status == "Matched" ||
						apps[i].Application.Status == "Locked" ||
						apps[i].Application.Status == "QueuedForMatching")
					{
						return false;
					}
				}
			}
			// This indicates that there is 1 application that has not yet been submitted. ie: We can still edit the associated company.
			return true;
		}

		public async Task<IActionResult> Onboarding(string userMessage = null)
		{
			var mySettingsVm = await GetMySettings();
			if(mySettingsVm.IsOnboarded == true)
			{
				if((mySettingsVm.PropertiesJson == "" || mySettingsVm.PropertiesJson == null) && _finfindBaseline == true && AbpSession.TenantId == 2)
				{
					return RedirectToAction("BaselineMigration", GetTenantName() + "BasicScreening");
				}

				var companySmeSubscriptions = new Dictionary<int, SmeSubscriptionDto>();
				var companies = await _smeCompaniesServiceExt.GetSmeCompaniesForViewByUser();
				var listItems = _listItemRepository.GetAll().ToList();

				foreach(var company in companies)
				{
					var regNo = L("NotRegistered");
					if(!string.IsNullOrEmpty(company.SmeCompany.RegistrationNumber))
					{
						regNo = company.SmeCompany.RegistrationNumber;
					}
					company.SmeCompany.RegistrationNumber = regNo;
					// Returns whether or not current user is the primary owner ( first to add company ) of the associated company.
					var isPrimaryOwner = _smeCompaniesServiceExt.IsPrimaryOwner(company.SmeCompany.Id);
					company.IsPrimaryOwner = isPrimaryOwner.Result;

					#region Get the SmeSubscription for the Companies in each application

					var smeSubscription = await _smeSubscriptionsAppServiceExt.GetCompanySmeSubscription(company.SmeCompany);

					companySmeSubscriptions.Add(company.SmeCompany.Id, smeSubscription);

					#endregion
				}

				var applicationsPaged = await _applicationsAppServiceExt.GetAll(new GetAllApplicationsInput()
				{
					UserNameFilter = mySettingsVm.UserName
				});

				var applications = applicationsPaged.Items.Where(x => x.Application.Locked.HasValue).ToList();

				var apps = applicationsPaged.Items.ToList();
				foreach(var company in companies)
				{
					company.IsEditable = IsEditable(company, apps);
				}

				//if (!applications.Any())
				//    return RedirectToAction("Wizard","FunderSearch");
				SMEOnboardingSummary vm = new SMEOnboardingSummary
				{
					MySettings = await GetMySettings(),
					ListItems = GetListItems(),
					Owner = GetOwnerDetails(),
					Applications = applications,
					Apps = applicationsPaged.Items.ToList(),
					Companies = companies,
					CompanySmeSubscriptions = companySmeSubscriptions,
					UserMessage = userMessage
				};
				if(_finfindBaseline == true)
				{
					return View("/Areas/App/Views/BasicScreeningCommon/basic-screening-summary.cshtml", vm);
				}
				else
				{
					return View("onboarding-summary", vm);
				}
			}
			else
			{
				return RedirectToAction("Index", GetTenantName() + "BasicScreening");
			}
		}

		protected abstract string GetTenantName();

		// Implement this method in the tenant specific controller.
		protected virtual string GetBasicScreeningName()
		{
			return "BasicScreening";
		}
	}
}
