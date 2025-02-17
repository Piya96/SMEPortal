namespace SME.Portal.Lenders.Dtos
{
    public class GetFinanceProductForViewDto
    {
        public FinanceProductDto FinanceProduct { get; set; }

        public int LenderId { get; set; }
        public string LenderName { get; set; }

        public string CurrencyPairName { get; set; }

    }
}