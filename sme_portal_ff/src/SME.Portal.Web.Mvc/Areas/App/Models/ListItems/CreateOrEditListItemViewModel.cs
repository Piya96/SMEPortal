using SME.Portal.List.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.ListItems
{
    public class CreateOrEditListItemModalViewModel
    {
        public CreateOrEditListItemDto ListItem { get; set; }

        public bool IsEditMode => ListItem.Id.HasValue;
    }
}