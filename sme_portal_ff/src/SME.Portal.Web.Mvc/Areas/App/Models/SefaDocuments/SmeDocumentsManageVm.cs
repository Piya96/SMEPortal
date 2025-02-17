using SME.Portal.Company.Dtos;
using SME.Portal.Documents.Dtos;
using SME.Portal.List;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Models.SefaDocuments
{
    public class SmeDocumentsManageVm
    {
        public List<GetDocumentForViewDto> Documents { get; set; }
        public List<ListItem> DocumentUploadQuestions { get; set; }

        public string UserMessage { get; set; }

        public int CompanyId { get; set; }
    }
}
