using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SME.Portal.Qlana
{
    public partial class ProjectCreateResponseDto
    {
        [JsonProperty("message", NullValueHandling = NullValueHandling.Ignore)]
        public string Message { get; set; }

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
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("isUpdate", NullValueHandling = NullValueHandling.Ignore)]
        public bool? IsUpdate { get; set; }

        [JsonProperty("deleted_status", NullValueHandling = NullValueHandling.Ignore)]
        public bool? DeletedStatus { get; set; }

        [JsonProperty("project_description")]
        public object ProjectDescription { get; set; }

        [JsonProperty("project_id", NullValueHandling = NullValueHandling.Ignore)]
        [JsonConverter(typeof(ParseStringConverter))]
        public long? ProjectId { get; set; }

        [JsonProperty("project_title", NullValueHandling = NullValueHandling.Ignore)]
        public string ProjectTitle { get; set; }

        [JsonProperty("owner", NullValueHandling = NullValueHandling.Ignore)]
        public QlanaOwner Owner { get; set; }

        [JsonProperty("project_company", NullValueHandling = NullValueHandling.Ignore)]
        public ProjectCompany ProjectCompany { get; set; }

        [JsonProperty("sub_stage", NullValueHandling = NullValueHandling.Ignore)]
        public Stage SubStage { get; set; }

        [JsonProperty("status", NullValueHandling = NullValueHandling.Ignore)]
        public Stage Status { get; set; }

        [JsonProperty("project_contact", NullValueHandling = NullValueHandling.Ignore)]
        public ProjectContact ProjectContact { get; set; }

        [JsonProperty("project_parent", NullValueHandling = NullValueHandling.Ignore)]
        public ProjectParent ProjectParent { get; set; }

        [JsonProperty("project_twin", NullValueHandling = NullValueHandling.Ignore)]
        public ProjectTwin ProjectTwin { get; set; }

        [JsonProperty("project_type", NullValueHandling = NullValueHandling.Ignore)]
        public ProjectType ProjectType { get; set; }

        [JsonProperty("stage", NullValueHandling = NullValueHandling.Ignore)]
        public Stage Stage { get; set; }
    }

    public partial class QlanaOwner
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("first_name", NullValueHandling = NullValueHandling.Ignore)]
        public string FirstName { get; set; }
    }

    public partial class ProjectCompany
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("is_primary", NullValueHandling = NullValueHandling.Ignore)]
        public bool? IsPrimary { get; set; }

        [JsonProperty("company", NullValueHandling = NullValueHandling.Ignore)]
        public Company Company { get; set; }
    }

    public partial class ProjectContact
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("is_primary", NullValueHandling = NullValueHandling.Ignore)]
        public bool? IsPrimary { get; set; }

        [JsonProperty("contact", NullValueHandling = NullValueHandling.Ignore)]
        public QlanaOwner Contact { get; set; }
    }

    public partial class ProjectParent
    {
        [JsonProperty("uid")]
        public object Uid { get; set; }

        [JsonProperty("project_id")]
        public object ProjectId { get; set; }
    }

    public partial class ProjectTwin
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("borrower_type", NullValueHandling = NullValueHandling.Ignore)]
        public BorrowerType BorrowerType { get; set; }
    }

    public partial class BorrowerType
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

    public partial class ProjectType
    {
        [JsonProperty("uid", NullValueHandling = NullValueHandling.Ignore)]
        public string Uid { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }
    }

    public partial class Stage
    {
        [JsonProperty("uid")]
        public object Uid { get; set; }

        [JsonProperty("code")]
        public object Code { get; set; }
    }

    public partial class ProjectCreateResponseDto
    {
        public static ProjectCreateResponseDto FromJson(string json) => JsonConvert.DeserializeObject<ProjectCreateResponseDto>(json, Converter.Settings);
    }

    public static class SerializeProjectCreateResponseDto
    {
        public static string ToJson(this ProjectCreateResponseDto self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }
}
