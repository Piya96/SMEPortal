namespace SME.Portal.ConsumerCredit.Dtos
{
    public class GetCreditReportForViewDto
    {
        public CreditReportDto CreditReport { get; set; }

        public string UserName { get; set; }

    }

	public class CreditReportStatusDto
	{
		public string Status { get; set; }
	}

	public class CreditReportPOSTArgsDto
	{
		public bool UpdateIfAllowed { get; set; }
		public string IdentityNumber { get; set; }
		public string Dob { get; set; }
		public string FirstName { get; set; }
		public string Surname { get; set; }
		public string EnquiryReason { get; set; }
		public string EnquiryDoneBy { get; set; }
	}
}