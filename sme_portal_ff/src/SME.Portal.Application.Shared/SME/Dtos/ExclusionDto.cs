using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos
{
    public class ExclusionDto
    {
        public string MatchingCriteriaListId { get; set; }
        public int FinanceProductId { get; set; }
        public int LenderId { get; set; }
        public string LenderName { get; set; }
        public string Name { get; set; }
    }
}
