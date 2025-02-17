using System;

namespace SME.Portal.Helpers
{
    public class DateTimeToUTC
    {
        /// <summary>
        /// Converts DateTime local to UTC and return UnixTimeMilliseconds
        /// </summary>
        /// <param name="dateTimeLocal">DateTime local</param>
        /// <returns>double UnixTimeMilliseconds</returns>
        public static double ConvertToUnixTimeMs(DateTime dateTimeLocal)
        {
            var utcDateTime = TimeZoneInfo.ConvertTimeToUtc(dateTimeLocal, TimeZoneInfo.Local);

            utcDateTime = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc).Date;

            return ((DateTimeOffset)utcDateTime).ToUnixTimeMilliseconds();
        }
    }
}
