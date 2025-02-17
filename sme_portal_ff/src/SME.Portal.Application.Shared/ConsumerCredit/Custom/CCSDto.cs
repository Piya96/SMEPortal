using SME.Portal.ConsumerCredit.Dtos;

namespace SME.Portal.CCS.Dtos
{
	public class CCSStatusDto
	{
		public string Status { get; set; }
	}

	public class CCSInputDto
	{
		public string IdentityNumber { get; set; }
		public bool UpdateIfAllowed { get; set; }
	}

	public class CCSOutputDto
	{
		public string Status { get; set; }
		public GetCreditScoreForViewDto Data { get; set; }
	}
}
