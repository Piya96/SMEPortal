using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class ResearchUrlDto
    {
        public int Id { get; set; }

        public string Url { get; set; }
        
        public int FinanceProductId { get; set; }
    }
}
