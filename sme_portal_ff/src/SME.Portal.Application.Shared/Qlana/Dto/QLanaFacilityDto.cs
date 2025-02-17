using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace SME.Portal.Qlana
{
    public class QlanaFacility_Dto
    {
        public string DataJson { get; set; }

    }

	public partial class CreateFacilityResponseDto
	{
		[JsonProperty("message")]
		public string message { get; set; }

		[JsonProperty("success")]
		public bool Success { get; set; }

		[JsonProperty("data")]
		public FacilityData Data { get; set; }
	}

	public partial class FacilityData
	{
		[JsonProperty("uid")]
		public string uid { get; set; }

		[JsonProperty("IsUpdate")]
		public bool IsUpdate { get; set; }
	}

	// TODO: Separate dto file???
	public partial class FileUploadResponseDto
	{
		public List<Document> data { get; set; }
		public bool success { get; set; }
	}

	public class Document
	{
		public string uuid { get; set; }
		public string name { get; set; }
		public int size { get; set; }
		public string contentType { get; set; }
		public string extension { get; set; }
		public string fullPath { get; set; }
	}
}
