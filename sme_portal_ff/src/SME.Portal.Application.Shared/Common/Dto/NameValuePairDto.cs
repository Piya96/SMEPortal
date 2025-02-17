using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;
using System.Globalization;

namespace SME.Portal.Common.Dto
{
    public partial class NameValuePairDto
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }

    public partial class NameValuePairDto
    {
        public static NameValuePairDto[] FromJson(string json) => JsonConvert.DeserializeObject<NameValuePairDto[]>(json, Converter.Settings);
        public static List<NameValuePairDto> FromJsonAsList(string json) => JsonConvert.DeserializeObject<List<NameValuePairDto>>(json, Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this NameValuePairDto[] self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}
