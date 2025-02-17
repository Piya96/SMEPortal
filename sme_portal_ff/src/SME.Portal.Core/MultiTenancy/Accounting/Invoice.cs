using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace SME.Portal.MultiTenancy.Accounting
{
    [Table("AppInvoices")]
    public class Invoice : Entity<int>
    {
        public string InvoiceNo { get; set; }

        public DateTime InvoiceDate { get; set; }

        public string LegalName { get; set; }

        public string Address { get; set; }

        public string TaxNo { get; set; }
    }
}
