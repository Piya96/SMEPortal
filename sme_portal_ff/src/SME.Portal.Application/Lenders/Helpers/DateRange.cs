using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Helpers
{
    public class DateRange
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string StartDateDisplay => Start.ToString("dd-MMM-yyyy");
        public string EndDateDisplay => End.ToString("dd-MMM-yyyy");
    }
}
