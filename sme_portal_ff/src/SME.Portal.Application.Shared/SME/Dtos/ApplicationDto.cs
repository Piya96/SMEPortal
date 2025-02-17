using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.SME.Dtos
{
    public enum ApplicationStatus
    {
        Started,
        QueuedForMatching,
        Matched,
        MatchedNoResults,
        Locked,
        Abandoned,
        ExitedToFinfind,
        Cancelled
    }

    public class ApplicationDto : EntityDto
    {
        public DateTime? Locked { get; set; }

        public string Status { get; set; }

        public long UserId { get; set; }

        public int TenantId { get; set; }

        public int SmeCompanyId { get; set; }

        public string MatchCriteriaJson { get; set; }

        public string PropertiesJson { get; set; }

        public DateTime Created { get; set; }

		public DateTime? LastModificationTime { get; set; }

	}
}