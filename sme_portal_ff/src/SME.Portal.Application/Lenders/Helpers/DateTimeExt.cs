using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace SME.Portal.Lenders.Helpers
{
    public class DateTimeExt
    {
        public static DateTime GetSaNow()
        {
            var timeZoneCode = "South Africa Standard Time";

            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                timeZoneCode = "Africa/Johannesburg";

            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneCode);
            DateTime cstTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cstZone);
            return cstTime;
        }
    }
}
