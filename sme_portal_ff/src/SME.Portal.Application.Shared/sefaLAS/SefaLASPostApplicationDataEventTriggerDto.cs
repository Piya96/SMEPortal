using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.sefaLAS
{
    public class SefaLASPostApplicationDataEventTriggerDto
    {
        public int TenantId { get; set; }

        public int ApplicationId { get; set; }
    }

    public class SefaLASPostDocumentDataEventTriggerDto
    {
        public int TenantId { get; set; }
        public string DocumentJson { get; set; }
    }
}
