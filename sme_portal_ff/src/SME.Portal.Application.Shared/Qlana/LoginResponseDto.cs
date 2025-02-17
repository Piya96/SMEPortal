using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SME.Portal.Qlana
{
    public partial class LoginResponseDto
    {
        [JsonProperty("data", NullValueHandling = NullValueHandling.Ignore)]
        public Data Data { get; set; }

        [JsonProperty("success", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Success { get; set; }

        [JsonProperty("zcServerDateTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? ZcServerDateTime { get; set; }

        [JsonProperty("zcServerIp", NullValueHandling = NullValueHandling.Ignore)]
        public string ZcServerIp { get; set; }

        [JsonProperty("zcServerHost", NullValueHandling = NullValueHandling.Ignore)]
        public string ZcServerHost { get; set; }
    }

    public partial class Data
    {
        [JsonProperty("user_code", NullValueHandling = NullValueHandling.Ignore)]
        public string UserCode { get; set; }

        [JsonProperty("is_deleted", NullValueHandling = NullValueHandling.Ignore)]
        public long? IsDeleted { get; set; }

        [JsonProperty("user_type", NullValueHandling = NullValueHandling.Ignore)]
        public string UserType { get; set; }

        [JsonProperty("login_attempts", NullValueHandling = NullValueHandling.Ignore)]
        public long? LoginAttempts { get; set; }

        [JsonProperty("is_locked", NullValueHandling = NullValueHandling.Ignore)]
        public long? IsLocked { get; set; }

        [JsonProperty("phone", NullValueHandling = NullValueHandling.Ignore)]
        public string Phone { get; set; }

        [JsonProperty("login_unique", NullValueHandling = NullValueHandling.Ignore)]
        public string LoginUnique { get; set; }

        [JsonProperty("email", NullValueHandling = NullValueHandling.Ignore)]
        public string Email { get; set; }

        [JsonProperty("first_name", NullValueHandling = NullValueHandling.Ignore)]
        public string FirstName { get; set; }

        [JsonProperty("middle_name")]
        public object MiddleName { get; set; }

        [JsonProperty("last_name", NullValueHandling = NullValueHandling.Ignore)]
        public string LastName { get; set; }

        [JsonProperty("role", NullValueHandling = NullValueHandling.Ignore)]
        public Role Role { get; set; }

        [JsonProperty("reportsTo", NullValueHandling = NullValueHandling.Ignore)]
        public ReportsTo ReportsTo { get; set; }

        [JsonProperty("last_login", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LastLogin { get; set; }

        [JsonProperty("last_login_ip", NullValueHandling = NullValueHandling.Ignore)]
        public string LastLoginIp { get; set; }

        [JsonProperty("last_login_device")]
        public object LastLoginDevice { get; set; }

        [JsonProperty("last_login_agent", NullValueHandling = NullValueHandling.Ignore)]
        public string LastLoginAgent { get; set; }

        [JsonProperty("mobile_access")]
        public object MobileAccess { get; set; }

        [JsonProperty("pic", NullValueHandling = NullValueHandling.Ignore)]
        public List<object> Pic { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty("last_accessed_on", NullValueHandling = NullValueHandling.Ignore)]
        public long? LastAccessedOn { get; set; }

        [JsonProperty("token", NullValueHandling = NullValueHandling.Ignore)]
        public string Token { get; set; }

        [JsonProperty("cacheKey", NullValueHandling = NullValueHandling.Ignore)]
        public string CacheKey { get; set; }

        [JsonProperty("addInfo", NullValueHandling = NullValueHandling.Ignore)]
        public AddInfo AddInfo { get; set; }

        [JsonProperty("expiry", NullValueHandling = NullValueHandling.Ignore)]
        public long? Expiry { get; set; }

        [JsonProperty("userGroups", NullValueHandling = NullValueHandling.Ignore)]
        public List<object> UserGroups { get; set; }

        [JsonProperty("app", NullValueHandling = NullValueHandling.Ignore)]
        public string App { get; set; }

        [JsonProperty("redirectUrl", NullValueHandling = NullValueHandling.Ignore)]
        public string RedirectUrl { get; set; }
    }

    public partial class AddInfo
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("phone", NullValueHandling = NullValueHandling.Ignore)]
        public string Phone { get; set; }

        [JsonProperty("email", NullValueHandling = NullValueHandling.Ignore)]
        public string Email { get; set; }

        [JsonProperty("first_name", NullValueHandling = NullValueHandling.Ignore)]
        public string FirstName { get; set; }

        [JsonProperty("last_name", NullValueHandling = NullValueHandling.Ignore)]
        public string LastName { get; set; }

        [JsonProperty("middle_name")]
        public object MiddleName { get; set; }

        [JsonProperty("salutation", NullValueHandling = NullValueHandling.Ignore)]
        public Country Salutation { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Ignore)]
        public Country Status { get; set; }

        [JsonProperty("user_code", NullValueHandling = NullValueHandling.Ignore)]
        public string UserCode { get; set; }

        [JsonProperty("login_unique", NullValueHandling = NullValueHandling.Ignore)]
        public string LoginUnique { get; set; }

        [JsonProperty("country", NullValueHandling = NullValueHandling.Ignore)]
        public Country Country { get; set; }

        [JsonProperty("reports_to", NullValueHandling = NullValueHandling.Ignore)]
        public ReportsToClass ReportsTo { get; set; }

        [JsonProperty("role", NullValueHandling = NullValueHandling.Ignore)]
        public Country Role { get; set; }

        [JsonProperty("user_reports_to", NullValueHandling = NullValueHandling.Ignore)]
        public UserReportsTo UserReportsTo { get; set; }

        [JsonProperty("signature", NullValueHandling = NullValueHandling.Ignore)]
        public List<Signature> Signature { get; set; }

        [JsonProperty("pic", NullValueHandling = NullValueHandling.Ignore)]
        public List<object> Pic { get; set; }

        [JsonProperty("app_user", NullValueHandling = NullValueHandling.Ignore)]
        public AppUser AppUser { get; set; }
    }

    public partial class AppUser
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("user_code", NullValueHandling = NullValueHandling.Ignore)]
        public string UserCode { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Ignore)]
        public string Status { get; set; }

        [JsonProperty("is_deleted", NullValueHandling = NullValueHandling.Ignore)]
        public long? IsDeleted { get; set; }

        [JsonProperty("user_type", NullValueHandling = NullValueHandling.Ignore)]
        public string UserType { get; set; }

        [JsonProperty("login_attempts", NullValueHandling = NullValueHandling.Ignore)]
        public long? LoginAttempts { get; set; }

        [JsonProperty("is_locked", NullValueHandling = NullValueHandling.Ignore)]
        public long? IsLocked { get; set; }

        [JsonProperty("meta_history", NullValueHandling = NullValueHandling.Ignore)]
        public string MetaHistory { get; set; }

        [JsonProperty("phone", NullValueHandling = NullValueHandling.Ignore)]
        public string Phone { get; set; }

        [JsonProperty("login_unique", NullValueHandling = NullValueHandling.Ignore)]
        public string LoginUnique { get; set; }

        [JsonProperty("email", NullValueHandling = NullValueHandling.Ignore)]
        public string Email { get; set; }

        [JsonProperty("first_name", NullValueHandling = NullValueHandling.Ignore)]
        public string FirstName { get; set; }

        [JsonProperty("middle_name")]
        public object MiddleName { get; set; }

        [JsonProperty("last_name", NullValueHandling = NullValueHandling.Ignore)]
        public string LastName { get; set; }

        [JsonProperty("role", NullValueHandling = NullValueHandling.Ignore)]
        public Role Role { get; set; }

        [JsonProperty("reportsTo", NullValueHandling = NullValueHandling.Ignore)]
        public ReportsTo ReportsTo { get; set; }

        [JsonProperty("last_login", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LastLogin { get; set; }

        [JsonProperty("last_login_ip", NullValueHandling = NullValueHandling.Ignore)]
        public string LastLoginIp { get; set; }

        [JsonProperty("last_login_device")]
        public object LastLoginDevice { get; set; }

        [JsonProperty("last_login_agent", NullValueHandling = NullValueHandling.Ignore)]
        public string LastLoginAgent { get; set; }

        [JsonProperty("mobile_access")]
        public object MobileAccess { get; set; }

        [JsonProperty("pic", NullValueHandling = NullValueHandling.Ignore)]
        public List<object> Pic { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty("last_accessed_on", NullValueHandling = NullValueHandling.Ignore)]
        public long? LastAccessedOn { get; set; }

        [JsonProperty("token", NullValueHandling = NullValueHandling.Ignore)]
        public string Token { get; set; }

        [JsonProperty("initiatedAt", NullValueHandling = NullValueHandling.Ignore)]
        public long? InitiatedAt { get; set; }

        [JsonProperty("deviceId")]
        public object DeviceId { get; set; }

        [JsonProperty("fbToken")]
        public object FbToken { get; set; }

        [JsonProperty("clientBuildVersion")]
        public object ClientBuildVersion { get; set; }

        [JsonProperty("client", NullValueHandling = NullValueHandling.Ignore)]
        public string Client { get; set; }

        [JsonProperty("cacheKey", NullValueHandling = NullValueHandling.Ignore)]
        public string CacheKey { get; set; }

        [JsonProperty("version", NullValueHandling = NullValueHandling.Ignore)]
        public string Version { get; set; }
    }

    public partial class ReportsTo
    {
        [JsonProperty("code")]
        public object Code { get; set; }

        [JsonProperty("first_name")]
        public object FirstName { get; set; }

        [JsonProperty("middle_name")]
        public object MiddleName { get; set; }

        [JsonProperty("last_name")]
        public object LastName { get; set; }

        [JsonProperty("email")]
        public object Email { get; set; }

        [JsonProperty("phone")]
        public object Phone { get; set; }
    }

    public partial class Role
    {
        [JsonProperty("mobileAccess", NullValueHandling = NullValueHandling.Ignore)]
        public long? MobileAccess { get; set; }

        [JsonProperty("value", NullValueHandling = NullValueHandling.Ignore)]
        public string Value { get; set; }

        [JsonProperty("code", NullValueHandling = NullValueHandling.Ignore)]
        public string Code { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty("label", NullValueHandling = NullValueHandling.Ignore)]
        public string Label { get; set; }

        [JsonProperty("icon", NullValueHandling = NullValueHandling.Ignore)]
        public string Icon { get; set; }
    }

    public partial class Country
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("code", NullValueHandling = NullValueHandling.Ignore)]
        public string Code { get; set; }

        [JsonProperty("isd_code", NullValueHandling = NullValueHandling.Ignore)]
        [JsonConverter(typeof(ParseStringConverter))]
        public long? IsdCode { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty("icon")]
        public string Icon { get; set; }

        [JsonProperty("other", NullValueHandling = NullValueHandling.Ignore)]
        public Other Other { get; set; }
    }

    public partial class Other
    {
        [JsonProperty("color")]
        public object Color { get; set; }
    }

    public partial class ReportsToClass
    {
        [JsonProperty("uid")]
        public object Uid { get; set; }

        [JsonProperty("email")]
        public object Email { get; set; }

        [JsonProperty("first_name")]
        public object FirstName { get; set; }
    }

    public partial class Signature
    {
        [JsonProperty("size", NullValueHandling = NullValueHandling.Ignore)]
        public long? Size { get; set; }

        [JsonProperty("saved", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Saved { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty("contentType", NullValueHandling = NullValueHandling.Ignore)]
        public string ContentType { get; set; }

        [JsonProperty("path", NullValueHandling = NullValueHandling.Ignore)]
        public string Path { get; set; }
    }

    public partial class UserReportsTo
    {
        [JsonProperty("uid")]
        public object Uid { get; set; }

        [JsonProperty("phone")]
        public object Phone { get; set; }
    }

    public partial class LoginResponseDto
    {
        public static LoginResponseDto FromJson(string json) => JsonConvert.DeserializeObject<LoginResponseDto>(json, Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this LoginResponseDto self) => JsonConvert.SerializeObject(self, Converter.Settings);
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
