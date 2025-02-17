using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Qlana
{
    public enum QlanaEntityTypes
    {
        Contact,
        Company,
        Project
    };


    public class QlanaEventTriggerDto
    {
        public QlanaEntityTypes EntityType { get; set; }
        public int TenantId { get; set; }
        public long? OwnerId { get; set; }
        public long? CompanyId { get; set; }
        public long? ApplicationId { get; set; }
        public QlanaEntityTypes EventType { get; set; }
        
    }
}
