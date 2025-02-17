using Abp.AspNetCore.Mvc.Authorization;
using Abp.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Company;
using SME.Portal.Documents;
using SME.Portal.Documents.Dtos;
using SME.Portal.List;
using SME.Portal.Storage;
using SME.Portal.Web.Areas.App.Models.SefaDocuments;
using SME.Portal.Web.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize]
    public class SefaDocumentsController : PortalControllerBase
    {
        private readonly SmeCompaniesAppServiceExt _smeCompaniesAppServiceExt;
        private readonly DocumentsAppServiceExt _documentsAppServiceExt;
        private readonly IBinaryObjectManager _binaryObjectManager;
        private readonly IRepository<ListItem, int> _listRepository;

        public SefaDocumentsController(
            SmeCompaniesAppServiceExt smeCompaniesAppServiceExt,
            DocumentsAppServiceExt documentsAppServiceExt,
            IBinaryObjectManager binaryObjectManager,
            IRepository<ListItem, int> listRepository)
        {
            _smeCompaniesAppServiceExt = smeCompaniesAppServiceExt;
            _documentsAppServiceExt = documentsAppServiceExt;
            _binaryObjectManager = binaryObjectManager;
            _listRepository = listRepository;

        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Manage(string loanTypeId, int companyId)
        {
            if (string.IsNullOrEmpty(loanTypeId))
            {
                //DEFAULT TO TREP
                loanTypeId = "626284e1f8ecc0f40b8edf00";
            }

            if(companyId == default(int))
            {
                //DEFAULT COMPANY FOR TESTING SET ABOVE IN COMPANY DOESN'T EXIST
                companyId = 323;
            }

            var documents = await _documentsAppServiceExt.GetAllSefaDocumentsByUser(AbpSession.UserId.Value, companyId);
            var documentQuestions = _listRepository.GetAll().Where(a => a.MetaOne.Contains(loanTypeId)).ToList();

            var model = new SmeDocumentsManageVm()
            {
                Documents = documents,
                //UserMessage = userMessage,
                CompanyId = companyId,
                DocumentUploadQuestions = documentQuestions
            };

            return View(model);
        }

		public class UploadSummaryArgs
		{
			public string FileName {get; set; }
			public int CompanyId { get; set; }
			public string DocumentType { get; set; }
			public string Bytes { get; set; }
		}

		[HttpPost]
		public async Task<IActionResult> UploadSummaryPdf([FromBody] UploadSummaryArgs args)
		{
			if(string.IsNullOrEmpty(args.DocumentType) || args.CompanyId == default(int))
			{
				return BadRequest("Failed to upload summary");
			}

			try
			{
				byte[] bytes = Convert.FromBase64String(args.Bytes);
				var binaryObject = new BinaryObject() { TenantId = AbpSession.TenantId, Bytes = bytes };
				await _binaryObjectManager.SaveAsync(binaryObject);
				var doc = new CreateOrEditDocumentDto()
				{
					FileName = args.FileName,
					FileType = "application/pdf",
					Type = args.DocumentType,
					BinaryObjectId = binaryObject.Id,
					SmeCompanyId = args.CompanyId
				};
				await _documentsAppServiceExt.CreateOrEdit(doc);
			}
			catch(Exception ex)
			{
				Logger.Error($"Failed to Upload Summary Document File with Exception:{ex.Message}");
				return BadRequest(ex.Message);
			}

			return Ok();
		}

		[HttpPost("SefaDocuments/UploadFiles")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> UploadFiles(DocumentsUploadPostVm model)
        {
            if (string.IsNullOrEmpty(model.DocumentType) || model.SmeCompanyId == default(int))
            {
                return BadRequest("Failed to upload document");
            }

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

                    await _documentsAppServiceExt.CreateOrEdit(doc);

                }
            }
            catch (Exception ex)
            {
                Logger.Error($"Failed to Upload SefaDocument Files with Exception:{ex.Message}");
                return BadRequest(ex.Message);
            }

            return Ok();
        }


        [HttpGet("App/SefaDocuments/Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _documentsAppServiceExt.Delete(new Abp.Application.Services.Dto.EntityDto(id));

            return RedirectToAction("Manage");
        }
    }
}
