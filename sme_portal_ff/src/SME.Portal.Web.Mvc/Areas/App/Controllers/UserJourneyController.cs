using Abp.AspNetCore.Mvc.Authorization;
using Abp.BackgroundJobs;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.MultiTenancy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SME.Portal.Authorization.Users;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Company;
using SME.Portal.Configuration;
using SME.Portal.ConsumerCredit;
using SME.Portal.Documents;
using SME.Portal.Lenders;
using SME.Portal.List;
using SME.Portal.Net.Sms;
using SME.Portal.PdfCrowd;
using SME.Portal.sefaLAS;
using SME.Portal.SME;
using SME.Portal.SME.Subscriptions;
using SME.Portal.Storage;
using SME.Portal.Timing;
using SME.Portal.Timing.Dto;
using SME.Portal.Url;
using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.Web.Controllers;
using System.Threading.Tasks;
using SME.Portal.Web.Areas.App.Models.Common.UserJourney;

namespace SME.Portal.Web.Areas.App.Controllers.UserJourney
{

	[Area("App")]
	[AbpMvcAuthorize]
	public class UserJourneyController : PortalControllerBase
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
		private readonly IRepository<Application, int> _applicationRepo;
		private readonly IRepository<Owner, long> _ownersRepo;
		private readonly IRepository<SmeCompany, int> _companiesRepo;
		private readonly IDocumentsAppService _documentsAppService;
		private readonly ISefaLASAppService _sefaLASAppService;
		private readonly UserManager _userManager;
		private readonly ISmsSender _smsSender;
		private readonly IUserEmailer _userEmailer;
		private readonly IConfigurationRoot _appConfiguration;

		private readonly IRepository<ListItem, int> _listItemRepository;

		public UserJourneyController(
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
			IRepository<Application, int> applicationRepo,
			IRepository<Owner, long> ownersRepo,
			IDocumentsAppService documentsAppService,
			IRepository<SmeCompany, int> companiesRepo,
			ISefaLASAppService sefaLASAppService,
			IAppConfigurationAccessor configurationAccessor,
			UserManager userManager,
			ISmsSender smsSender,
			IUserEmailer userEmailer,
			IRepository<ListItem, int> listItemRepository
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
			_applicationRepo = applicationRepo;
			_ownersRepo = ownersRepo;
			_documentsAppService = documentsAppService;
			_companiesRepo = companiesRepo;
			_sefaLASAppService = sefaLASAppService;
			_userManager = userManager;
			_smsSender = smsSender;
			_userEmailer = userEmailer;
			_appConfiguration = configurationAccessor.Configuration;
			_listItemRepository = listItemRepository;
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

		public async Task<IActionResult> Insert()
		{
			UserJourneyReturn vm = new UserJourneyReturn();
			vm.Controller = "SME";
			vm.Action = "__Index__";
			return View("/Areas/App/Views/SME/user-journey.cshtml", vm);
		}

		public static bool MustInsert(MySettingsViewModel settings)
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

		public class UserJourneyRouteValues
		{
			public int Id { get; set; }
		}
	}
}
