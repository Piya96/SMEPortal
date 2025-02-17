using SME.Portal.Company.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.SmeCompanies
{
    public class CreateOrEditSmeCompanyModalViewModel
    {
        public CreateOrEditSmeCompanyDto SmeCompany { get; set; }

        public string UserName { get; set; }

        public bool IsEditMode => SmeCompany.Id.HasValue;
    }
}