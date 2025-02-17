using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Models.SefaDocuments
{
    public class DisplayControlVm
    {
        public int DocumentQuestionListId { get; set; }
        public string DocumentQuestion { get; set; }
        public SmeDocumentsManageVm SmeDocumentsManageVm { get; set; }
    }
}
