using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.Applications
{
    public class CashForInvoiceDto
    {
        public int? InvoiceValue { get; set; }
        public string CustomerProfileListId { get; set; }
        public bool? CustomerAgreedCompleted { get; set; }
        public bool? SaveAndContinueLater { get; set; }
        public bool? ChooseDifferentWorkingCapitalOption { get; set; }
        public string CustomerProfile { get; internal set; }
    }
}
