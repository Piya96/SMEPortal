namespace SME.Portal.Authorization.Users.Profile.Dto
{
    public class VerifySmsCodeInputDto
    {
        public string Code { get; set; }
        public string PhoneNumber { get; set; }
    }

	public class VerifyOTPDto
	{
		public int TenantId { get; set; }
		public long UserId { get; set; }
		public string Code { get; set; }
	}
}