using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ConsumerProfileBureau.Dtos
{

    public partial class PersonVerificationDto
    {
        [JsonProperty("InputIDNumber", NullValueHandling = NullValueHandling.Ignore)]
        public string InputIdNumber { get; set; }

        [JsonProperty("IDNumber", NullValueHandling = NullValueHandling.Ignore)]
        public string IdNumber { get; set; }

        [JsonProperty("ConsumerHashID", NullValueHandling = NullValueHandling.Ignore)]
        public string ConsumerHashId { get; set; }

        [JsonProperty("Passport", NullValueHandling = NullValueHandling.Ignore)]
        public string Passport { get; set; }

        [JsonProperty("FirstName", NullValueHandling = NullValueHandling.Ignore)]
        public string FirstName { get; set; }

        [JsonProperty("SecondName", NullValueHandling = NullValueHandling.Ignore)]
        public string SecondName { get; set; }

        [JsonProperty("ThirdName", NullValueHandling = NullValueHandling.Ignore)]
        public string ThirdName { get; set; }

        [JsonProperty("Surname", NullValueHandling = NullValueHandling.Ignore)]
        public string Surname { get; set; }

        [JsonProperty("MaidenName", NullValueHandling = NullValueHandling.Ignore)]
        public string MaidenName { get; set; }

        [JsonProperty("DateOfBirth", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? DateOfBirth { get; set; }

        [JsonProperty("Age", NullValueHandling = NullValueHandling.Ignore)]
        public long? Age { get; set; }

        [JsonProperty("AgeBand", NullValueHandling = NullValueHandling.Ignore)]
        public string AgeBand { get; set; }

        [JsonProperty("Title", NullValueHandling = NullValueHandling.Ignore)]
        public string Title { get; set; }

        [JsonProperty("IsMinor", NullValueHandling = NullValueHandling.Ignore)]
        public bool? IsMinor { get; set; }

        [JsonProperty("InputIDPassedCDV", NullValueHandling = NullValueHandling.Ignore)]
        public bool? InputIdPassedCdv { get; set; }

        [JsonProperty("IDExists", NullValueHandling = NullValueHandling.Ignore)]
        public bool? IdExists { get; set; }

        [JsonProperty("Gender", NullValueHandling = NullValueHandling.Ignore)]
        public string Gender { get; set; }

        [JsonProperty("MarriageDate", NullValueHandling = NullValueHandling.Ignore)]
        public string MarriageDate { get; set; }

        [JsonProperty("MaritalStatus", NullValueHandling = NullValueHandling.Ignore)]
        public string MaritalStatus { get; set; }

        [JsonProperty("Score", NullValueHandling = NullValueHandling.Ignore)]
        public long? Score { get; set; }

        [JsonProperty("Country", NullValueHandling = NullValueHandling.Ignore)]
        public string Country { get; set; }

        [JsonProperty("Source", NullValueHandling = NullValueHandling.Ignore)]
        public string Source { get; set; }

        [JsonProperty("OriginalSource", NullValueHandling = NullValueHandling.Ignore)]
        public string OriginalSource { get; set; }

        [JsonProperty("LatestDate", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LatestDate { get; set; }

        [JsonProperty("UsingDHARealtime", NullValueHandling = NullValueHandling.Ignore)]
        public bool? UsingDhaRealtime { get; set; }

        [JsonProperty("Reference", NullValueHandling = NullValueHandling.Ignore)]
        public string Reference { get; set; }

        [JsonProperty("_Cached", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Cached { get; set; }
    }

    public partial class PersonVerificationDto
    {
        public static PersonVerificationDto FromJson(string json) => JsonConvert.DeserializeObject<PersonVerificationDto>(json, Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this PersonVerificationDto self) => JsonConvert.SerializeObject(self, Converter.Settings);
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

    internal class ParseStringConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(long) || t == typeof(long?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            long l;
            if (Int64.TryParse(value, out l))
            {
                return l;
            }
            throw new Exception("Cannot unmarshal type long");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (long)untypedValue;
            serializer.Serialize(writer, value.ToString());
            return;
        }

        public static readonly ParseStringConverter Singleton = new ParseStringConverter();
    }
}
