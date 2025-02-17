
namespace SME.Portal.Web.Areas.App.Models.FSS
{
	public class FSSViewModel
	{
		public FSSViewModel()
		{
			this.HeaderColor = "green";
		}

		public string StyleWidth { get; set; }

		public string StyleCol { get; set; }

		public int ApplicationId { get; set; }

		public int TenantId { get; set; }

		public string HeaderColor { get; set; }
	}
}
