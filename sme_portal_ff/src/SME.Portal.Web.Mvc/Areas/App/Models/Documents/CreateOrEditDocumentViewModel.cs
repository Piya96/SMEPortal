using SME.Portal.Documents.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.Documents
{
    public class CreateOrEditDocumentModalViewModel
    {
        public CreateOrEditDocumentDto Document { get; set; }

        public string SmeCompanyName { get; set; }

        public bool IsEditMode => Document.Id.HasValue;
    }
}