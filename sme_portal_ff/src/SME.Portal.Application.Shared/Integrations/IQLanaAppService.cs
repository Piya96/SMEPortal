using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.Portal.Integrations
{
	public class PayloadArgs
	{
		public string Json { get; set; }
	}

	public class UploadArgs
	{
		public string Uid { get; set; }
		public int CompanyId { get; set; }
		public int ApplicationId { get; set; }
		public string SummaryName { get; set; }
		public string SummaryBytes { get; set; }
	}

	public interface IQLanaAppService
    {
        Task<string> CreateECDCFacility(PayloadArgs args);
		Task<string> Upload(UploadArgs args);
	}
}
