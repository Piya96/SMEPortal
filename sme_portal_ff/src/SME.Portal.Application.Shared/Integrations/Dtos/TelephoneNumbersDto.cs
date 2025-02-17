using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SME.Portal.Integrations.Dtos
{
    public partial class TelephoneNumbersDto
    {
        [JsonProperty("Telephones")]
        public List<Telephone> Telephones { get; set; }


        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }

        [JsonProperty("status_message")]
        public string StatusMessage { get; set; }

    }

    public partial class Telephone
    {
        [JsonProperty("IDNumber")]
        public string IdNumber { get; set; }

        [JsonProperty("Passport")]
        public string Passport { get; set; }

        [JsonProperty("TelNumber")]
        public string TelNumber { get; set; }

        [JsonProperty("TelType")]
        public string TelType { get; set; }

        [JsonProperty("FirstDate")]
        public DateTimeOffset FirstDate { get; set; }

        [JsonProperty("LatestDate")]
        public DateTimeOffset LatestDate { get; set; }

        [JsonProperty("FirstStatus")]
        public string FirstStatus { get; set; }

        [JsonProperty("LatestStatus")]
        public string LatestStatus { get; set; }

        [JsonProperty("Score")]
        public long Score { get; set; }

        [JsonProperty("IsDiallable")]
        public string IsDiallable { get; set; }

        [JsonProperty("IsValid")]
        public string IsValid { get; set; }

        [JsonProperty("Region")]
        public string Region { get; set; }

        [JsonProperty("Network")]
        public string Network { get; set; }

        [JsonProperty("Source")]
        public List<string> Source { get; set; }

        [JsonProperty("Surname")]
        public string Surname { get; set; }

        [JsonProperty("FirstNames")]
        public string FirstNames { get; set; }

    }

    public partial class TelephoneNumbersDto
    {
        public static TelephoneNumbersDto FromJson(string json) => JsonConvert.DeserializeObject<TelephoneNumbersDto>(json, Converter.Settings);
    }

    public static class SerializeTelephoneNumbersDto
    {
        public static string ToJson(this TelephoneNumbersDto self) => JsonConvert.SerializeObject(self, Converter.Settings);
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
