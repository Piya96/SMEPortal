namespace SME.Portal.Authorization.Users.Profile.Dto
{
    public class SendVerificationSmsInputDto
    {
        public string PhoneNumber { get; set; }
    }

	public class SendOTPToPhoneDto
	{
		public int TenantId { get; set; }
		public long UserId { get; set; }
		public string PhoneNumber { get; set; }
	}

	public class SendOTPToEmailDto
	{
		public int TenantId { get; set; }
		public long UserId { get; set; }
		public string EmailAddress { get; set; }
		public string Subject { get; set; }
		public string Body { get; set; }
	}
}