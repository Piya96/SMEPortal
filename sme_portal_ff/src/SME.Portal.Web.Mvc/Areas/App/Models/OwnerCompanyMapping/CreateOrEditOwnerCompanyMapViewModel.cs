using SME.Portal.Company.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.OwnerCompanyMapping
{
    public class CreateOrEditOwnerCompanyMapModalViewModel
    {
        public CreateOrEditOwnerCompanyMapDto OwnerCompanyMap { get; set; }

        public string OwnerIdentityOrPassport { get; set; }

        public string SmeCompanyRegistrationNumber { get; set; }

        public bool IsEditMode => OwnerCompanyMap.Id.HasValue;
    }
}