using SME.Portal.ConsumerCredit.Dtos;

namespace SME.Portal.CCR.Dtos
{
	public class CCRStatusDto
	{
		public string Status { get; set; }
	}

	public class CCRInputDto
	{
		public bool UpdateIfAllowed { get; set; }
		public string IdentityNumber { get; set; }
		public string Dob { get; set; }
		public string FirstName { get; set; }
		public string Surname { get; set; }
		public string EnquiryReason { get; set; }
		public string EnquiryDoneBy { get; set; }
	}

	public class CCROutputDto
	{
		public string Status { get; set; }
		public GetCreditReportForViewDto Data { get; set; }
	}

	public class CCRInputHttp
	{
		public string IdentityNumber { get; set; }
		public string Dob { get; set; }
		public string FirstName { get; set; }
		public string Surname { get; set; }
		public string EnquiryReason { get; set; }
		public string EnquiryDoneBy { get; set; }
	}
}
