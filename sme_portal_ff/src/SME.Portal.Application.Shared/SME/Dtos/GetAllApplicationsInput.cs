using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.SME.Dtos
{
    public class GetAllApplicationsInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public DateTime? MaxLockedFilter { get; set; }
        public DateTime? MinLockedFilter { get; set; }

        public string StatusFilter { get; set; }

        public long? UserId { get; set; }

        public string UserNameFilter { get; set; }

        public string SmeCompanyNameFilter { get; set; }

        public int? SmeCompanyId { get; set; }

    }
}