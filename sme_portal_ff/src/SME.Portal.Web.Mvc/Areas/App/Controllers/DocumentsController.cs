using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Web.Areas.App.Models.Documents;
using SME.Portal.Web.Controllers;
using SME.Portal.Authorization;
using SME.Portal.Documents;
using SME.Portal.Documents.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using SME.Portal.Storage;
using System.Net.Http.Headers;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    //[AbpMvcAuthorize(AppPermissions.Pages_Administration_Documents)]
    public class DocumentsController : PortalControllerBase
    {
        private readonly IDocumentsAppService _documentsAppService;
        private readonly IBinaryObjectManager _binaryObjectManager;

        public DocumentsController(IDocumentsAppService documentsAppService, IBinaryObjectManager binaryObjectManager)
        {
            _documentsAppService = documentsAppService;
            _binaryObjectManager = binaryObjectManager;
        }

        public ActionResult Index()
        {
            var model = new DocumentsViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Documents_Create, AppPermissions.Pages_Administration_Documents_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetDocumentForEditOutput getDocumentForEditOutput;

            if (id.HasValue)
            {
                getDocumentForEditOutput = await _documentsAppService.GetDocumentForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getDocumentForEditOutput = new GetDocumentForEditOutput
                {
                    Document = new CreateOrEditDocumentDto()
                };
            }

            var viewModel = new CreateOrEditDocumentModalViewModel()
            {
                Document = getDocumentForEditOutput.Document,
                SmeCompanyName = getDocumentForEditOutput.SmeCompanyName,
            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        [HttpGet("App/Documents/DownloadFile/{documentId}")]
        public async Task<IActionResult> DownloadFile(int documentId)
        {
            var documentMeta = await _documentsAppService.GetDocumentForView(documentId);
            var file = await _binaryObjectManager.GetOrNullAsync(documentMeta.Document.BinaryObjectId);
            return new FileContentResult(file.Bytes, MediaTypeHeaderValue.Parse(documentMeta.Document.FileType).ToString());
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

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Documents_Create, AppPermissions.Pages_Administration_Documents_Edit)]
        public PartialViewResult SmeCompanyLookupTableModal(int? id, string displayName)
        {
            var viewModel = new DocumentSmeCompanyLookupTableViewModel()
            {
                Id = id,
                DisplayName = displayName,
                FilterText = ""
            };

            return PartialView("_DocumentSmeCompanyLookupTableModal", viewModel);
        }

    }
}