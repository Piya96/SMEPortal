using Abp.AspNetCore.Mvc.Authorization;
using Abp.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.ConsumerCredit;
using SME.Portal.Web.Areas.App.Models.ConsumerCredit;
using SME.Portal.Web.Controllers;
using System;
using System.Text;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Web.Areas.App.Models.Profile;
using SME.Portal.ConsumerCredit.Dtos;
using SME.Portal.SME;
using SME.Portal.List;
using SME.Portal.List.Dtos;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize]
    public class ConsumerCreditController : PortalControllerBase
    {
		private readonly IProfileAppService _profileAppService;
		private readonly ICreditScoresAppService _creditScoreAppService;
        private readonly ICreditReportsAppService _creditReportAppService;
        private readonly ApplicationAppServiceExt _applicationsAppServiceExt;
		private readonly IRepository<ListItem, int> _listItemRepository;

		public ConsumerCreditController(
			ICreditScoresAppService creditScoreAppService, 
            ICreditReportsAppService creditReportAppService,
			IProfileAppService profileAppService,
            ApplicationAppServiceExt applicationsAppServiceExt,
			IRepository<ListItem, int> listItemRepository

		)
        {
            _creditScoreAppService = creditScoreAppService;
            _creditReportAppService = creditReportAppService;
			_profileAppService = profileAppService;
            _applicationsAppServiceExt = applicationsAppServiceExt;
			_listItemRepository = listItemRepository;
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

		public async Task<IActionResult> Index(ConsumerCreditViewModel model = null)
        {
            var settings = await GetMySettings();
			//if(settings.IsOnboarded == false)
			//{
			//	return RedirectToAction("Index", "SME", new { userMessage = L("PleaseCompleteProfileInformationToContinue") });
			//}

            var hasApplications = _applicationsAppServiceExt.HasApplications().Data;

            if (model == null)
            {
                model = new ConsumerCreditViewModel()
                {
                    CreditScore = 0,
                    CreditScoreEnquiryDate = null,
                    CreditScoreNextEnquiryDate = null,
                    CreditReportEnquiryDate = null,
                    CreditReportNextEnquiryDate = null,
					IdentityNumber = "",
                    HasApplications = hasApplications,
                    HasOnboarded = settings.IsOnboarded
				};
            }
			model.IdentityNumber = settings.IdentityOrPassport;
            model.HasOnboarded = settings.IsOnboarded;
            model.HasApplications = _applicationsAppServiceExt.HasApplications().Data;
			model.FirstName = settings.Name;
			model.Surname = settings.Surname;
			model.ListItems = GetListItems();
			return View(model);
        }

		private async Task<MySettingsViewModel> GetMySettings()
		{
			var output = await _profileAppService.GetCurrentUserProfileForEdit();
			var mySettingsViewModel = ObjectMapper.Map<MySettingsViewModel>(output);
			return mySettingsViewModel;
		}
    }
}
