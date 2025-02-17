using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.SyncModels
{
    public class OwnershipRuleMatchingCriteria
    {
        public int Num { get; set; }
        public string Demographic { get; set; }
        public string Measure { get; set; }
        public string Operator { get; set; }
        public decimal? Percentage { get; set; }
    }
}
