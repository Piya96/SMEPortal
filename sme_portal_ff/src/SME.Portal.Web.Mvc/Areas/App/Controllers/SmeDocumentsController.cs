using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Controllers;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Net.Http.Headers;
using SME.Portal.Web.Areas.App.Models.SmeDocuments;
using SME.Portal.Documents;
using SME.Portal.Documents.Dtos;
using SME.Portal.Storage;
using SME.Portal.Company;
using System;
using SME.Portal.Web.Areas.App.Models.Documents;
using SME.Portal.SME;
using SME.Portal.Web.Areas.App.Models.Profile;
using Abp.Configuration;
using SME.Portal.Timing.Dto;
using SME.Portal.Configuration;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Timing;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize]
    public class SmeDocumentsController : PortalControllerBase
    {
        private readonly IProfileAppService _profileAppService;
        private readonly ITimingAppService _timingAppService;
        private readonly IDocumentsAppService _documentsAppService;
        private readonly IBinaryObjectManager _binaryObjectManager;
        private readonly SmeCompaniesAppServiceExt _smeCompaniesAppServiceExt;
        private readonly ApplicationAppServiceExt _applicationsAppServiceExt;

        public SmeDocumentsController(
            IProfileAppService profileAppService,
            ITimingAppService timingAppService,
            IDocumentsAppService documentsAppService,
            IBinaryObjectManager binaryObjectManager,
            SmeCompaniesAppServiceExt smeCompaniesAppServiceExt,
            ApplicationAppServiceExt applicationsAppServiceExt)
        {
            _profileAppService = profileAppService;
            _timingAppService = timingAppService;
            _documentsAppService = documentsAppService;
            _binaryObjectManager = binaryObjectManager;
            _smeCompaniesAppServiceExt = smeCompaniesAppServiceExt;
            _applicationsAppServiceExt = applicationsAppServiceExt;
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

            mySettingsViewModel.SmsVerificationEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.SmsVerificationEnabled);

            return mySettingsViewModel;
        }


        public async Task<IActionResult> Index(string userMessage = null)
        {
            var mySettings = await GetMySettings();
            var hasApplications = _applicationsAppServiceExt.HasApplications().Data;

            if (!mySettings.IsOnboarded)
                return RedirectToAction("Index", "SME", new { userMessage = L("PleaseCompleteProfileInformationToContinue") });

            if (!hasApplications)
                return RedirectToAction("Onboarding", "SME", new { userMessage = L("PleasePressStartFunderSearchButton") });

            var model = new SmeDocumentsIndexVm
            {
                FilterText = "",
                HasApplications = hasApplications,
                HasOnboarded = mySettings.IsOnboarded,
                UserMessage = userMessage
            };

            
            return View(model);
        }

        public async Task<IActionResult> Manage(string userMessage = null, int? companyId = null)
        {
            var smeCompanies = await _smeCompaniesAppServiceExt.GetSmeCompaniesForViewByUser();

            var model = new SmeDocumentsManageVm()
            {
                SmeCompanies = smeCompanies,
                UserMessage = userMessage,
                CompanyId = companyId
            };

            return View(model);
        }

        [HttpGet("App/SmeDocuments/DownloadFile/{documentId}")]
        public async Task<IActionResult> DownloadFile(int documentId)
        {
            var documentMeta = await _documentsAppService.GetDocumentForView(documentId);

            if (documentMeta.Document.CreatorUserId != AbpSession.UserId) return new NotFoundResult();

            var file = await _binaryObjectManager.GetOrNullAsync(documentMeta.Document.BinaryObjectId);
            return new FileContentResult(file.Bytes, MediaTypeHeaderValue.Parse(documentMeta.Document.FileType).ToString());
        }


        [HttpPost("UploadFiles")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> UploadFiles(DocumentsUploadPostVm model)
        {
            try
            {
                foreach (var file in model.Files)
                {
                    long length = file.Length;
                    if (length <= 0)
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

                    await _documentsAppService.CreateOrEdit(doc);

                }
            }
            catch (Exception ex)
            {
                Logger.Error($"Failed to Upload SmeDocument Files with Exception:{ex.Message}");
                return BadRequest(ex.Message);
            }

            return Ok();
        }

        public async Task<PartialViewResult> ViewDocumentModal(int id)
        {
            var getDocumentForViewDto = await _documentsAppService.GetDocumentForView(id);

            var model = new DocumentViewModel()
            {
                Document = getDocumentForViewDto.Document,
                SmeCompanyName = getDocumentForViewDto.SmeCompanyName,
                TypeName = getDocumentForViewDto.TypeName
            };

            return PartialView("_ViewDocumentModal", model);
        }

    }
}
