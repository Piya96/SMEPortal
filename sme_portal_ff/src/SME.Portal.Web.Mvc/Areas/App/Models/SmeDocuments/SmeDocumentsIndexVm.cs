using SME.Portal.Company.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Models.SmeDocuments
{
    public class SmeDocumentsIndexVm
    {
        public bool HasApplications { get; set; }
        public string FilterText { get; set; }
        public bool HasOnboarded { get; internal set; }
        public string UserMessage { get; set; }
    }
}
