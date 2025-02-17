using System.Collections.Generic;
using SME.Portal.List.Dtos;

namespace SME.Portal.Web.Areas.App.Models.Common.ListItems
{
	public class ListItemsViewModel
	{
		public List<ListItemDto> ListItems { get; set; }
		public string Tenant { get; set; }
	};
}
