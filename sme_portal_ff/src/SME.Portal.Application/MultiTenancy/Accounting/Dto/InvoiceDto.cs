using System;
using System.Collections.Generic;

namespace SME.Portal.MultiTenancy.Accounting.Dto
{
    public class InvoiceDto
    {
        public decimal Amount { get; set; }

        public decimal GetVatAmount()
        {
            var amountBeforeVat = Amount / (decimal)1.15;
            return Amount - amountBeforeVat;
        }

        public string EditionDisplayName { get; set; }
        
        public string InvoiceNo { get; set; }

        public DateTime InvoiceDate { get; set; }

        public string LegalName { get; set; }

        public List<string> Address { get; set; }

        public string TaxNo { get; set; }

        public string HostLegalName { get; set; }
        public string TenantBillingTaxVatNo { get; set; }
        public List<string> HostAddress { get; set; }
        
    }
}