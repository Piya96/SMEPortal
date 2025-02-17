using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SME.Portal.Qlana
{
    public partial class DataError
    {
        [JsonProperty("data", NullValueHandling = NullValueHandling.Ignore)]
        public Data Data { get; set; }

        [JsonProperty("success", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Success { get; set; }

        [JsonProperty("message", NullValueHandling = NullValueHandling.Ignore)]
        public string Message { get; set; }

        [JsonProperty("zcServerDateTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? ZcServerDateTime { get; set; }

        [JsonProperty("zcServerIp", NullValueHandling = NullValueHandling.Ignore)]
        public string ZcServerIp { get; set; }

        [JsonProperty("zcServerHost", NullValueHandling = NullValueHandling.Ignore)]
        public string ZcServerHost { get; set; }
    }

    public partial class Data
    {
        [JsonProperty("errors", NullValueHandling = NullValueHandling.Ignore)]
        public List<Error> Errors { get; set; }
    }

    public partial class Error
    {
        [JsonProperty("msg", NullValueHandling = NullValueHandling.Ignore)]
        public string Msg { get; set; }
    }

    public partial class DataError
    {
        public static DataError FromJson(string json) => JsonConvert.DeserializeObject<DataError>(json, Converter.Settings);
    }

    public static class DataErrorSerialize
    {
        public static string ToJson(this DataError self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }

    
}
