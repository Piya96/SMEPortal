using System.Text.RegularExpressions;
using Abp.Extensions;

namespace SME.Portal.Validation
{
    public static class ValidationHelper
    {
        public const string EmailRegex = @"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$";
        public const string PhoneNumberRegex = @"^\d{10}$";

        public static bool IsEmail(string value)
        {
            if (value.IsNullOrEmpty())
            {
                return false;
            }

            var regex = new Regex(EmailRegex);
            return regex.IsMatch(value);
        }
        
        public static bool IsPhoneNumber(string value)
        {
            if (value.IsNullOrEmpty())
            {
                return false;
            }

            var regex = new Regex(PhoneNumberRegex);
            return regex.IsMatch(value);
        }
    }
}
