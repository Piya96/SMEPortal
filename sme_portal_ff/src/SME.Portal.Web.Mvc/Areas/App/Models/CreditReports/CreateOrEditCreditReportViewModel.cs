using SME.Portal.ConsumerCredit.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.CreditReports
{
    public class CreateOrEditCreditReportModalViewModel
    {
        public CreateOrEditCreditReportDto CreditReport { get; set; }

        public string UserName { get; set; }

        public bool IsEditMode => CreditReport.Id.HasValue;
    }
}