namespace SME.Portal.Company.Dtos
{
    public class GetSmeCompanyForViewDto
    {
        public SmeCompanyDto SmeCompany { get; set; }

        public string UserName { get; set; }

		public bool IsPrimaryOwner { get; set; }
		// Added extra bool for edit button.
		public bool IsEditable { get; set; }
	}

	public class DoesCompanyExistArgs
	{
        public int? Id { get; set; }    
		public string RegistrationNumber { get; set; }
	}
}