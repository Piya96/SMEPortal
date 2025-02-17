using System;

namespace SME.Portal.Tenants.Dashboard.Dto
{
    public class GetDailyRegistrationsInput
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}