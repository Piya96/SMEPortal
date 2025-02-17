using System;
using System.Collections.Generic;
using Newtonsoft.Json;


namespace SME.Portal.Qlana
{
    public partial class SearchResponseDto
    {
        [JsonProperty("message")]
        public object Message { get; set; }

        [JsonProperty("success", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Success { get; set; }

        [JsonProperty("data", NullValueHandling = NullValueHandling.Ignore)]
        public Data Data { get; set; }

        [JsonProperty("zcServerDateTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? ZcServerDateTime { get; set; }

        [JsonProperty("zcServerIp", NullValueHandling = NullValueHandling.Ignore)]
        public string ZcServerIp { get; set; }

        [JsonProperty("zcServerHost", NullValueHandling = NullValueHandling.Ignore)]
        public string ZcServerHost { get; set; }
    }

    public partial class Data
    {
        [JsonProperty("listData", NullValueHandling = NullValueHandling.Ignore)]
        public ListData ListData { get; set; }
    }

    public partial class ListData
    {
        [JsonProperty("records", NullValueHandling = NullValueHandling.Ignore)]
        [JsonConverter(typeof(ParseStringConverter))]
        public long? Records { get; set; }

        [JsonProperty("select", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Select { get; set; }

        [JsonProperty("total", NullValueHandling = NullValueHandling.Ignore)]
        public long? Total { get; set; }

        [JsonProperty("page", NullValueHandling = NullValueHandling.Ignore)]
        public long? Page { get; set; }

        [JsonProperty("rows", NullValueHandling = NullValueHandling.Ignore)]
        public List<Row> Rows { get; set; }

        [JsonProperty("zc_extra")]
        public object ZcExtra { get; set; }

        [JsonProperty("pivotData")]
        public object PivotData { get; set; }

        [JsonProperty("aggregation")]
        public object Aggregation { get; set; }

        [JsonProperty("size", NullValueHandling = NullValueHandling.Ignore)]
        public long? Size { get; set; }
    }

    public partial class Row
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("customer_id", NullValueHandling = NullValueHandling.Ignore)]
        public long? CustomerId { get; set; }

        [JsonProperty("deleted_status", NullValueHandling = NullValueHandling.Ignore)]
        public bool? DeletedStatus { get; set; }

        [JsonProperty("first_name", NullValueHandling = NullValueHandling.Ignore)]
        public string FirstName { get; set; }

        [JsonProperty("last_name", NullValueHandling = NullValueHandling.Ignore)]
        public string LastName { get; set; }

        [JsonProperty("middle_name")]
        public object MiddleName { get; set; }

        [JsonProperty("salutation", NullValueHandling = NullValueHandling.Ignore)]
        public Salutation Salutation { get; set; }

        [JsonProperty("contact_info", NullValueHandling = NullValueHandling.Ignore)]
        public ContactInfo ContactInfo { get; set; }

        [JsonProperty("contact_type", NullValueHandling = NullValueHandling.Ignore)]
        public ContactType ContactType { get; set; }

        [JsonProperty("contact_company", NullValueHandling = NullValueHandling.Ignore)]
        public ContactCompany ContactCompany { get; set; }

        [JsonProperty("created_id", NullValueHandling = NullValueHandling.Ignore)]
        public CreatedId CreatedId { get; set; }

        [JsonProperty("t24_customer_id")]
        public object T24CustomerId { get; set; }

        [JsonProperty("created_time", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? CreatedTime { get; set; }


        [JsonProperty("business_type", NullValueHandling = NullValueHandling.Ignore)]
        public BusinessType BusinessType { get; set; }

        [JsonProperty("company_name", NullValueHandling = NullValueHandling.Ignore)]
        public string CompanyName { get; set; }

        [JsonProperty("company_type", NullValueHandling = NullValueHandling.Ignore)]
        public CompanyType CompanyType { get; set; }

        [JsonProperty("company_contact_info", NullValueHandling = NullValueHandling.Ignore)]
        public CompanyContactInfo CompanyContactInfo { get; set; }
    }

    public partial class ContactCompany
    {
        [JsonProperty("uid")]
        public object Uid { get; set; }

        [JsonProperty("is_primary")]
        public object IsPrimary { get; set; }

        [JsonProperty("company", NullValueHandling = NullValueHandling.Ignore)]
        public Company Company { get; set; }
    }

    public partial class Company
    {
        [JsonProperty("uid")]
        public object Uid { get; set; }

        [JsonProperty("company_name")]
        public object CompanyName { get; set; }
    }

    public partial class ContactInfo
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("email_address", NullValueHandling = NullValueHandling.Ignore)]
        public string EmailAddress { get; set; }

        [JsonProperty("work_telephone", NullValueHandling = NullValueHandling.Ignore)]
        public string WorkTelephone { get; set; }

        [JsonProperty("contact_telephone_country", NullValueHandling = NullValueHandling.Ignore)]
        public ContactType ContactTelephoneCountry { get; set; }

        [JsonProperty("permanent_country", NullValueHandling = NullValueHandling.Ignore)]
        public ContactType PermanentCountry { get; set; }
    }

    public partial class ContactType
    {
        [JsonProperty("uid")]
        public string Uid { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("isd_code")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long? IsdCode { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }

    public partial class CreatedId
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("email", NullValueHandling = NullValueHandling.Ignore)]
        public string Email { get; set; }

        [JsonProperty("first_name", NullValueHandling = NullValueHandling.Ignore)]
        public string FirstName { get; set; }

        [JsonProperty("last_name", NullValueHandling = NullValueHandling.Ignore)]
        public string LastName { get; set; }

        [JsonProperty("middle_name")]
        public object MiddleName { get; set; }

        [JsonProperty("role", NullValueHandling = NullValueHandling.Ignore)]
        public Role Role { get; set; }
    }

    public partial class Salutation
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty("other", NullValueHandling = NullValueHandling.Ignore)]
        public Other Other { get; set; }

        [JsonProperty("icon")]
        public object Icon { get; set; }
    }

    public partial class BusinessType
    {
        [JsonProperty("uid")]
        public object Uid { get; set; }

        [JsonProperty("name")]
        public object Name { get; set; }

        [JsonProperty("other", NullValueHandling = NullValueHandling.Ignore)]
        public Other Other { get; set; }

        [JsonProperty("icon")]
        public object Icon { get; set; }
    }

    public partial class CompanyContactInfo
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("email_address", NullValueHandling = NullValueHandling.Ignore)]
        public string EmailAddress { get; set; }

        [JsonProperty("telephone", NullValueHandling = NullValueHandling.Ignore)]
        public string Telephone { get; set; }

        [JsonProperty("company_country", NullValueHandling = NullValueHandling.Ignore)]
        public CompanyType CompanyCountry { get; set; }

        [JsonProperty("company_telephone_country", NullValueHandling = NullValueHandling.Ignore)]
        public CompanyType CompanyTelephoneCountry { get; set; }

        [JsonProperty("country_main", NullValueHandling = NullValueHandling.Ignore)]
        public CompanyType CountryMain { get; set; }
    }

    public partial class CompanyType
    {
        [JsonProperty("uid")]
        public string Uid { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("isd_code")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long? IsdCode { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }


    public partial class SearchResponseDto
    {
        public static SearchResponseDto FromJson(string json) => JsonConvert.DeserializeObject<SearchResponseDto>(json, Converter.Settings);
    }

    public static class SerializeSearchResponseDto
    {
        public static string ToJson(this SearchResponseDto self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }
}
