using Abp.AspNetCore.Mvc.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using SME.Portal.Configuration;
using SME.Portal.List;
using SME.Portal.List.Dtos;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.SME;
using SME.Portal.SME.Dtos;
using SME.Portal.SME.Subscriptions;
using SME.Portal.Timing;
using SME.Portal.Timing.Dto;
using SME.Portal.Web.Areas.App.Models.Owners;
using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.Web.Areas.App.Models.SME;
using SME.Portal.Web.Controllers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Runtime.Security;
using System;
using SME.Portal.Authorization.Users.Profile.Dto;
using Newtonsoft.Json;
using SME.Portal.Authorization.Users;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using SME.Portal.Identity;
using Abp;
using Abp.Runtime.Session;
using SME.Portal.Authorization.Users.Dto;
using SME.Portal.MultiTenancy;

using SME.Portal.Web.Areas.App.Models.Common.UserJourney;
using SME.Portal.Web.Areas.App.Controllers.UserJourney;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize]
    public class SefaSmeController : PortalControllerBase
    {
        private readonly IProfileAppService _profileAppService;
        private readonly ITimingAppService _timingAppService;

        private readonly OwnersAppServiceExt _ownersAppServiceExt;
        private readonly SmeCompaniesAppServiceExt _smeCompaniesServiceExt;
        private readonly ApplicationAppServiceExt _applicationAppServiceExt;
        private readonly IRepository<ListItem, int> _listItemRepository;
        private readonly ApplicationAppServiceExt _applicationsAppServiceExt;
        private readonly SmeSubscriptionsAppServiceExt _smeSubscriptionsAppServiceExt;
        private readonly IUserPortToTenantService _userPortToTenantService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly SignInManager _signInManager;
        private readonly UserManager _userManager;
        private readonly TenantManager _tenantManager;

        public SefaSmeController(
            IProfileAppService profileAppService,
            ITimingAppService timingAppService,
            OwnersAppServiceExt ownersAppServiceExt,
            SmeCompaniesAppServiceExt smeCompaniesServiceExt,
            ApplicationAppServiceExt applicationAppServiceExt,
            IRepository<ListItem, int> listItemRepository,
            ApplicationAppServiceExt applicationsAppServiceExt,
            SmeSubscriptionsAppServiceExt smeSubscriptionsAppServiceExt,
            IUserPortToTenantService userPortToTenantService,
            IWebHostEnvironment webHostEnvironment,
            SignInManager signInManager,
            UserManager userManager,
            TenantManager tenantManager)
        {
            _profileAppService = profileAppService;
            _timingAppService = timingAppService;
            _ownersAppServiceExt = ownersAppServiceExt;
            _smeCompaniesServiceExt = smeCompaniesServiceExt;
            _applicationAppServiceExt = applicationAppServiceExt;
            _listItemRepository = listItemRepository;
            _applicationsAppServiceExt = applicationsAppServiceExt;
            _smeSubscriptionsAppServiceExt = smeSubscriptionsAppServiceExt;
            _userPortToTenantService = userPortToTenantService;
            _webHostEnvironment = webHostEnvironment;
            _signInManager = signInManager;
            _userManager = userManager;
            _tenantManager = tenantManager;
        }

        #region Private Methods

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

        private List<ListItemDto> GetListItems()
        {
            var listItemsSet = _listItemRepository.GetAll().ToList();
            var listItems = new List<ListItemDto>();
            foreach (var o in listItemsSet)
            {
                listItems.Add(ObjectMapper.Map<ListItemDto>(o));
            }
            return listItems;
        }

        private OwnerViewModel GetOwnerDetails()
        {
            var ownerModel = new OwnerViewModel();
            Task<GetOwnerForViewDto> ownerDto = _ownersAppServiceExt.GetOwnerForViewByUser();
            ownerModel.Owner = ownerDto.Result.Owner;
            ownerModel.UserName = ownerDto.Result.UserName;
            return ownerModel;
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
			//return View("Index", viewModel);
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
			//return View("Index", viewModel);
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

        #endregion


        public async Task<IActionResult> Index(string userMessage = null)
        {
            var mySettingsVm = await GetMySettings();
			var applications = await _applicationAppServiceExt.GetAllForUserId(AbpSession.UserId.Value);

            // if there is any Application that has been started, the user is redirect to that application to
            // continue and either complete or cancel it.
            if(applications.Items.Any(x=> x.Application.Status == ApplicationStatus.Started.ToString()))
            {
                var appInProgress = applications.Items.FirstOrDefault(x => x.Application.Status == ApplicationStatus.Started.ToString());

                return RedirectToAction("Wizard", "SefaApplication", new { id = appInProgress.Application.SmeCompanyId });
            }
                

            if (applications.Items.Where(x => x.Application.Locked.HasValue).ToList().Count > 0)
                userMessage = "Click the 'View Finance Application' button to view your submission";

            if (mySettingsVm.IsOnboarded)
                return RedirectToAction("Profiling", new { userMessage = userMessage });

			var vm = new SMEOnboardingWizardViewModel
			{
				CompanyCount = 0,
				MySettings = mySettingsVm,
				Mode = SMEMode.Normal,
				ListItems = GetListItems(),
				UserMessage = userMessage
			};
			return View("basic-screening", vm);
			//return View(vm);
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

		public async Task<IActionResult> Profiling(string userMessage = null)
        {
            var mySettingsVm = await GetMySettings();

            if (!mySettingsVm.IsOnboarded)
                return RedirectToAction("Index");

            Dictionary<int, SMECompanyInfo> companyInfoDictionary = new Dictionary<int, SMECompanyInfo>();
            var companySmeSubscriptions = new Dictionary<int, SmeSubscriptionDto>();
            var listItems = _listItemRepository.GetAll().ToList();
            var companies = await _smeCompaniesServiceExt.GetSmeCompaniesForViewByUser();
            var applicationsPaged = await _applicationAppServiceExt.GetAllForUserId(AbpSession.UserId.Value);

            foreach (var company in companies)
            {
                SMECompanyInfo companyInfo = new SMECompanyInfo()
                {
                    CanEdit = false,
                    Company = company,
                    BackgroundCheck = new SMECompanyBackgroundCheck()
                    {
                        Pass = true,
                        Message = new SMEUserMessage()
                        {
                            Type = SMEUserMessageType.Success,
                            Text = ""
                        }
                    }
                };

                if (await _smeCompaniesServiceExt.BackgroundChecksResult(company.SmeCompany.Id) == false)
                {
                    companyInfo.BackgroundCheck.Pass = false;
                    companyInfo.BackgroundCheck.Message.Type = SMEUserMessageType.Failure;
                    companyInfo.BackgroundCheck.Message.Text = "One or more background checks failed during the onboarding process. Please edit company and / or madate fit details to correct this.";
                }

                var apps = applicationsPaged.Items.Where(x =>
                    (x.Application.Status == ApplicationStatus.Started.ToString() || x.Application.Status == ApplicationStatus.QueuedForMatching.ToString()) &&
                     x.Application.SmeCompanyId == company.SmeCompany.Id).ToList();

                if (apps.Count == 0 || companyInfo.BackgroundCheck.Pass == false)
                {
                    companyInfo.CanEdit = true;
                }

                companyInfoDictionary.Add(company.SmeCompany.Id, companyInfo);

                var regNo = L("NotRegistered");

                if (!string.IsNullOrEmpty(company.SmeCompany.RegistrationNumber))
                    regNo = company.SmeCompany.RegistrationNumber;

                var industrySubSectorListId = company.SmeCompany.Industries;
                var industrySectorListId = listItems.FirstOrDefault(x => x.ListId == company.SmeCompany.Industries)?.ParentListId;

                if (company.SmeCompany.Type == "Private Company")
                {
                    company.SmeCompany.Type = listItems.FirstOrDefault(x => x.ListId == "5a6ab7cd506ea818e04548ac")?.Name;
                }
                else
                {
                    company.SmeCompany.Type = listItems.FirstOrDefault(x => x.ListId == company.SmeCompany.Type)?.Name;
                }

                company.SmeCompany.BeeLevel = listItems.FirstOrDefault(x => x.ListId == company.SmeCompany.BeeLevel)?.Name;
                company.SmeCompany.RegistrationNumber = regNo;
                company.SmeCompany.Industries = listItems.FirstOrDefault(x => x.ListId == industrySectorListId)?.Name;
                company.SmeCompany.IndustrySubSector = listItems.FirstOrDefault(x => x.ListId == industrySubSectorListId)?.Name;

                // Returns whether or not current user is the primary owner ( first to add company ) of the associated company.
                company.IsPrimaryOwner = await _smeCompaniesServiceExt.IsPrimaryOwner(company.SmeCompany.Id);

                #region Get the SmeSubscription for the Companies in each application

                var smeSubscription = await _smeSubscriptionsAppServiceExt.GetCompanySmeSubscription(company.SmeCompany);

                companySmeSubscriptions.Add(company.SmeCompany.Id, smeSubscription);

                #endregion
            }

            var applications = applicationsPaged.Items.ToList();
			var appz = applicationsPaged.Items.ToList();
			foreach(var company in companies)
			{
				company.IsEditable = IsEditable(company, appz);
			}
			var vm = new SMEOnboardingSummary
			{
				ListItems = GetListItems(),
				Owner = GetOwnerDetails(),
				MySettings = mySettingsVm,
				Applications = applications,
				Companies = companies,
				CompanySmeSubscriptions = companySmeSubscriptions,
				UserMessage = userMessage,
				CompanyInfo = companyInfoDictionary
			};
			return View("basic-screening-summary", vm);
			//return View("profile-summary", vm);
        }

        public async Task<IActionResult> SignoutRedirectToTenantView(int tenantId = 2, string view = "Register")
        {
            //var user = await _userManager.GetUserAsync(AbpSession.ToUserIdentifier());

            //var userEditDto = new UserEditDto();

            //ObjectMapper.Map(user, userEditDto);
            // no reset for new users
            //userEditDto.ResetFlag = null;

            //var wasUserPorted = await _userPortToTenantService.PortToTenant(userEditDto, tenantId);

            //if (wasUserPorted)
            //{

            var currentTenant = await _tenantManager.GetByIdAsync(AbpSession.GetTenantId());


            SetTenantIdCookie(tenantId);
            CurrentUnitOfWork.SetTenantId(tenantId);
            await _signInManager.SignOutAsync();

            if (_webHostEnvironment.IsDevelopment())
                return RedirectToAction(view, "Account", new { successMessage = "Please register and complete a new Funder Search.", area = "", origin = currentTenant.TenancyName });

            var baseUrl = _webHostEnvironment.IsStaging() ? "https://app-staging.finfind.co.za" : "https://app.finfind.co.za";

            var redirectUrl = baseUrl + Url.Action(view, "Account", new { successMessage = "Please register and complete a new Funder Search.", area = "", origin = currentTenant.TenancyName });

            return Redirect(redirectUrl);

            //}

            //return RedirectToAction("Index", "SefaSme");
        }

        public IActionResult Support()
        {
            return View();
        }
    }
}
