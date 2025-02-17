using PayFast;
using System;


namespace SME.Portal.PayFast.Dtos
{
    public class PaymentRedirectDto
    {
        public string PaymentId { get; set; }

        public DateTime BillingDate { get; set; }

        public int? Cycles { get; set; }

        public string BuyerEmail { get; set; }

        public string BuyerName { get; set; }

        public string BuyerSurname { get; set; }

        public double TransactionAmount { get; set; }

        public double Amount { get; set; }
        public int? Frequency { get; set; }

        public int? SubscriptionType { get; set; }

        public string ItemName { get; set; }

        public string ItemDescription { get; set; }

        public bool EmailConfirmation { get; set; }

        public string ConfirmationEmailAddress { get; set; }
    }
}
