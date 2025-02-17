namespace SME.Portal.Company.Dtos
{
    public class GetOwnerCompanyMapForViewDto
    {
        public OwnerCompanyMapDto OwnerCompanyMap { get; set; }

        public string OwnerIdentityOrPassport { get; set; }

        public string SmeCompanyRegistrationNumber { get; set; }

    }
}