using SME.Portal.Company.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.Owners
{
    public class CreateOrEditOwnerModalViewModel
    {
        public CreateOrEditOwnerDto Owner { get; set; }

        public string UserName { get; set; }

        public bool IsEditMode => Owner.Id.HasValue;
    }
}