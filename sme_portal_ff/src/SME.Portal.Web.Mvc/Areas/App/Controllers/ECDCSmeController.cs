
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
using SME.Portal.Web.Areas.App.Models.SmeCompanies;

using SME.Portal.Common.Dtos;
using SME.Portal.SME;
using SME.Portal.List;
using Abp.Domain.Repositories;
using System.Linq;
using SME.Portal.SME.Dtos;
using SME.Portal.List.Dtos;
using Abp.MultiTenancy;
using SME.Portal.Authorization;
using SME.Portal.SME.Subscriptions;
using System.Collections.Generic;
using SME.Portal.Sme.Subscriptions.Dtos;
using Abp.Application.Navigation;
using SME.Portal.Web.Areas.App.Startup;
using System;
using Abp.Runtime.Security;


using SME.Portal.Web.Areas.App.Controllers;
using SME.Portal.Web.Areas.App.Models.Common.UserJourney;
using SME.Portal.Web.Areas.App.Controllers.UserJourney;

namespace SME.Portal.Web.Areas.App.Controllers
{
	[Area("App")]
	[AbpMvcAuthorize]
	public class ECDCSmeController : PortalControllerBase
	{

		private readonly IProfileAppService _profileAppService;
		private readonly ITimingAppService _timingAppService;

		private readonly OwnersAppServiceExt _ownersAppServiceExt;
		private readonly SmeCompaniesAppServiceExt _smeCompaniesServiceExt;
		private readonly ApplicationAppServiceExt _applicationAppServiceExt;
		private readonly IRepository<ListItem, int> _listItemRepository;
		private readonly ApplicationAppServiceExt _applicationsAppServiceExt;
		private readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;

		public ECDCSmeController(
			IProfileAppService profileAppService,
			ITimingAppService timingAppService,
			OwnersAppServiceExt ownersAppServiceExt,
			SmeCompaniesAppServiceExt smeCompaniesServiceExt,
			ApplicationAppServiceExt applicationAppServiceExt,
			IRepository<ListItem, int> listItemRepository,
			ApplicationAppServiceExt applicationsAppServiceExt,
			SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt
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
		}

		private OwnerViewModel GetOwnerDetails()
		{
			var ownerModel = new OwnerViewModel();
			Task<GetOwnerForViewDto> ownerDto = _ownersAppServiceExt.GetOwnerForViewByUser();
			ownerModel.Owner = ownerDto.Result.Owner;
			ownerModel.UserName = ownerDto.Result.UserName;
			return ownerModel;
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

			mySettingsViewModel.TenantId = AbpSession.TenantId;

			mySettingsViewModel.SmsVerificationEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.SmsVerificationEnabled);

			return mySettingsViewModel;
		}

		//[Route("~/index", Name = "IndexPage")]
		public async Task<IActionResult> Index(string userMessage = null)
		{
			var mySettingsVm = await GetMySettings();
			var applications = await _applicationAppServiceExt.GetAllForUserId(AbpSession.UserId.Value);

			//if (applications.Items.Where(x=> !x.Application.Locked.HasValue).ToList().Count > 0)
			//    return RedirectToAction("Index", "FunderSearch");

			if(mySettingsVm.IsOnboarded)
				return RedirectToAction("Onboarding", new { userMessage = userMessage });

			return View("basic-screening", new SMEOnboardingWizardViewModel
			{
				CompanyCount = 0,
				MySettings = mySettingsVm,
				Mode = SMEMode.Normal,
				ListItems = GetListItems(),
				UserMessage = userMessage
			});
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

			return View("basic-screening", viewModel);
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

			return View("basic-screening", viewModel);
		}


		public async Task<IActionResult> EnableOnboarding()
		{
			Task<CurrentUserProfileEditDto> userDto = _profileAppService.GetCurrentUserProfileForEdit();
			await userDto;
			userDto.Result.IsOnboarded = false;
			Task userUpdateTask = _profileAppService.UpdateCurrentUserProfile(userDto.Result);
			await userUpdateTask;
			return RedirectToAction("Index");
		}

		[HttpPost]
		public IActionResult RenderPartialView([FromBody] SMEModalView view)
		{
			return PartialView(view.View);
		}

		// Returns whether a company edit button should be active.
		private bool IsEditable(GetSmeCompanyForViewDto company, List<GetApplicationForViewDto> apps)
		{
			for(int i = 0;i < apps.Count;i++)
			{
				if(company.SmeCompany.Id == apps[i].Application.SmeCompanyId)
				{
					// The first submimtted application forces the associated company edit button to be taken out.
					if(apps[i].Application.Status == "Matched")
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

			if(mySettingsVm.IsOnboarded)
			{
				var companySmeSubscriptions = new Dictionary<int, SmeSubscriptionDto>();
				var companies = await _smeCompaniesServiceExt.GetSmeCompaniesForViewByUser();
				var listItems = _listItemRepository.GetAll().ToList();

				foreach(var company in companies)
				{
					var regNo = L("NotRegistered");

					if(!string.IsNullOrEmpty(company.SmeCompany.RegistrationNumber))
						regNo = company.SmeCompany.RegistrationNumber;

					var industrySubSectorListId = company.SmeCompany.Industries;
					var industrySectorListId = listItems.FirstOrDefault(x => x.ListId == company.SmeCompany.Industries)?.ParentListId;
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
				return View("basic-screening-summary", new SMEOnboardingSummary
				{
					MySettings = await GetMySettings(),
					ListItems = GetListItems(),
					Owner = GetOwnerDetails(),
					Applications = applications,
					Apps = applicationsPaged.Items.ToList(),
					Companies = companies,
					CompanySmeSubscriptions = companySmeSubscriptions,
					UserMessage = userMessage
				});
			}
			else
			{
				return RedirectToAction("Index");
			}
		}
	}
}
