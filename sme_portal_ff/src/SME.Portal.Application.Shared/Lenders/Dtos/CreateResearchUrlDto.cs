using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class CreateResearchUrlDto
    {
        public string Url { get; set; }
        
        public virtual int FinanceProductId { get; set; }

    }
}
