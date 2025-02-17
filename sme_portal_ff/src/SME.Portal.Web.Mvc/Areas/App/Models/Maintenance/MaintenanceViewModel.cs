using System.Collections.Generic;
using SME.Portal.Caching.Dto;

namespace SME.Portal.Web.Areas.App.Models.Maintenance
{
    public class MaintenanceViewModel
    {
        public IReadOnlyList<CacheDto> Caches { get; set; }
    }
}