using SME.Portal.Company.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Models.SmeDocuments
{
    public class SmeDocumentsManageVm
    {
        public List<GetSmeCompanyForViewDto> SmeCompanies { get; set; }

        public string UserMessage { get; set; }

        public int? CompanyId { get; set; }
    }
}
