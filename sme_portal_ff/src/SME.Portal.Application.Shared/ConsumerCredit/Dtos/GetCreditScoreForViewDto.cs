namespace SME.Portal.ConsumerCredit.Dtos
{
    public class GetCreditScoreForViewDto
    {
        public CreditScoreDto CreditScore { get; set; }

        public string UserName { get; set; }

    }

	public class CreditScorePOSTArgsDto
	{
		public string IdentityNumber { get; set; }
		public bool UpdateIfAllowed { get; set; }
	}
}