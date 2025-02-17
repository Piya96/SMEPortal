using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.sefaLAS
{
    public class SefaLASCreateEnquiryEventTriggerDto
    {
        public int TenantId { get; set; }
        public long UserId { get; set; }

        public int ApplicationId { get; set; }
    }
}
