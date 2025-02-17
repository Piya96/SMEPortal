using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.MultiTenancy.Accounting.Dto
{
    public class CreateInvoiceForSmeDto : CreateInvoiceDto
    {
        public string LegalName { get; set; }
        public string Address { get; set; }
        public string TaxNo { get; set; }
    }
}
