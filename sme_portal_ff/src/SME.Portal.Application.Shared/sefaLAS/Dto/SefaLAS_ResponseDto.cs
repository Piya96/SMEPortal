using Newtonsoft.Json;

namespace SME.Portal.sefaLAS.Dto
{
    public partial class SefaLas_ResponseDto
    {
        [JsonProperty("Code")]
        public string Code { get; set; }

        [JsonProperty("Status")]
        public string Status { get; set; }

        [JsonProperty("Data")]
        public string Data { get; set; }
    }

    public partial class SefaLas_ResponseDto
    {
        public static SefaLas_ResponseDto FromJson(string json) => JsonConvert.DeserializeObject<SefaLas_ResponseDto>(json, Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this SefaLas_ResponseDto self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }
}
