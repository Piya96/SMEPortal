using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Helpers
{
    public static class DateRangeHelper
    {
        public static DateRange Today(DateTime date)
        {
            var range = new DateRange();

            range.Start = new DateTime(date.Year, date.Month, date.Day);
            range.End = range.Start.AddDays(1).AddSeconds(-1);

            return range;
        }
    }
}
