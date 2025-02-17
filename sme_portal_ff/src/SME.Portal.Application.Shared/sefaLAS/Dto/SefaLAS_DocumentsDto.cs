using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SME.Portal.sefaLAS.Dto
{
    public partial class SefaLAS_DocumentsDto
    {

        [JsonProperty("Documents")]
        public List<SefaDocument> Documents { get; set; }
    }

    public partial class SefaDocument
    {
        [JsonProperty("Id")]
        public int Id { get; set; }

        [JsonProperty("Category")]
        public string Category { get; set; }

        [JsonProperty("Type")]
        public string Type { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("Extension")]
        public string Extension { get; set; }

        [JsonProperty("DocumentContent")]
        public string DocumentContent { get; set; }
    }

    public partial class SefaLAS_DocumentsDto
    {
        public static SefaLAS_DocumentsDto FromJson(string json) => JsonConvert.DeserializeObject<SefaLAS_DocumentsDto>(json, Converter.Settings);
    }

    public static class SerializeSefaLAS_DocumentsDto
    {
        public static string ToJson(this SefaLAS_DocumentsDto self) => JsonConvert.SerializeObject(self, Converter.Settings);
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
