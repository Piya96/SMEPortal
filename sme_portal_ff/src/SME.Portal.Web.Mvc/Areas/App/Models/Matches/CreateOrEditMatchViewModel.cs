using SME.Portal.Lenders.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.Matches
{
    public class CreateOrEditMatchModalViewModel
    {
        public CreateOrEditMatchDto Match { get; set; }

        public bool IsEditMode => Match.Id.HasValue;
    }
}