namespace SME.Portal.Lenders.Dtos
{
    public class GetLenderForViewDto
    {
		public LenderDto Lender { get; set; }

        public int FinanceProductCount { get; set; }
    }
}