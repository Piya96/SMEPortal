using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Globalization;

namespace SME.Portal.Web.Areas.App.Models.Common
{
    public partial class NameValuePairDto
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }

    public partial class FundingApplicationSubmissionDto
    {
        public static FundingApplicationSubmissionDto[] FromJson(string json) => JsonConvert.DeserializeObject<FundingApplicationSubmissionDto[]>(json, Converter.Settings);
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
