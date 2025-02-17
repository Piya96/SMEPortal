using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.Applications
{
    public class BuyingABusinessDto
    {
        public string IndustrySectorLevel1ListId { get; set; }
        public string IndustrySectorListId { get; set; }
        public string BusinessTypeListId { get; set; }
        public bool? RuralOrTownship { get; set; }
        public string BusinessType { get; internal set; }
    }
}
