using SME.Portal.Lenders.Dtos;
using System.Collections.Generic;

namespace SME.Portal.SME.Dtos
{
    public class MatchApplicationDto
    {
        public string TenancyName { get; set; }
        public int TenantId { get; set; }
        public int ApplicationId { get; set; }

        public string FSSummaryJson { get; set; }
    }
}
