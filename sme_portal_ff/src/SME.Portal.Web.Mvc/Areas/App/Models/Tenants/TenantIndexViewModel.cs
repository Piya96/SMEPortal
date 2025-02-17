using System.Collections.Generic;
using SME.Portal.Editions.Dto;

namespace SME.Portal.Web.Areas.App.Models.Tenants
{
    public class TenantIndexViewModel
    {
        public List<SubscribableEditionComboboxItemDto> EditionItems { get; set; }
    }
}