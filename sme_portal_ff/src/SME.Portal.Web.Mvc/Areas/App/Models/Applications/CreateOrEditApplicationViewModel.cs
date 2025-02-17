using SME.Portal.SME.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.Applications
{
    public class CreateOrEditApplicationModalViewModel
    {
        public CreateOrEditApplicationDto Application { get; set; }

        public string UserName { get; set; }

        public string SmeCompanyName { get; set; }

        public bool IsEditMode => Application.Id.HasValue;
    }
}