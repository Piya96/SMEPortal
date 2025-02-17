using Microsoft.AspNetCore.Http;
using SME.Portal.Documents;
using SME.Portal.SmeDocuments;
using System.Collections.Generic;

namespace SME.Portal.Web.Areas.App.Models.SmeDocuments
{
    public class DocumentsUploadPostVm
    {
        public int SmeCompanyId { get; set; }
        public string DocumentType { get; set; }
        public List<IFormFile> Files { get; set; }
    }
}
