using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class CreateWebsiteUrlDto
    {
        public string Url { get; set; }

        public virtual int FinanceProductId { get; set; }
        
        public virtual bool IsPrimary { get; set; }

    }
}
