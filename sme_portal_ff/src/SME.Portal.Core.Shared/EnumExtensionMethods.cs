using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Reflection;
using Newtonsoft.Json.Linq;

namespace SME.Portal
{
    public static class EnumExtensionMethods
    {
        public static string GetDisplayNameOfEnum(this Enum EnumType)
        {
            var enumtype = EnumType.GetType().GetMember(EnumType.ToString())
                           .First()
                           .GetCustomAttribute<DisplayAttribute>()
                           .Name;
            return enumtype;
        }

        public static string GetDisplayNameOfEnumUsingInt<TEnum>(int? enumvalue) where TEnum : struct, Enum
        {
            if(enumvalue != -1 && enumvalue!= null)
            {
            var enumValue = (TEnum)Enum.ToObject(typeof(TEnum), enumvalue);

            return enumValue.GetDisplayNameOfEnum();
            }
            return "";
        }
    }
}
