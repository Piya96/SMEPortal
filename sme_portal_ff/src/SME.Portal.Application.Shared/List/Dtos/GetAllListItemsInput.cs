using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.List.Dtos
{
    public class GetAllListItemsInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public string NameFilter { get; set; }

        public string ParentListIdFilter { get; set; }

        public int? MaxPriorityFilter { get; set; }
        public int? MinPriorityFilter { get; set; }

        public string MetaOneFilter { get; set; }

        public string MetaTwoFilter { get; set; }

        public string ListIdFilter { get; set; }

        public string SlugFilter { get; set; }

        public string MetaThreeFilter { get; set; }

        public string DetailsFilter { get; set; }

    }
}