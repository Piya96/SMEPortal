using System.Collections.Generic;
using Newtonsoft.Json;

namespace Finfind.Data.Models.QLana
{
	public partial class FileUploadDto
	{
		[JsonProperty("uid")]
		public string FacilityGuid { get; set; }

		[JsonProperty("files")]
		public List<File> Files { get; set; }
	}

	public partial class File
	{
		[JsonProperty("filename")]
		public string Filename { get; set; }

		[JsonProperty("base64content")]
		public string Base64Content { get; set; }

		[JsonProperty("document_type")]
		public string DocumentType { get; set; }

		[JsonProperty("description")]
		public string Description { get; set; }
	}
}
