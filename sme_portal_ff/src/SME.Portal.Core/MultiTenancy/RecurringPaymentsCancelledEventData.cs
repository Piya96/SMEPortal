using Abp.Events.Bus;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.MultiTenancy
{
    public class RecurringPaymentsCancelledEventData : EventData
    {
        public int? TenantId { get; set; }
        public long? UserId { get; set; }
    }
}
