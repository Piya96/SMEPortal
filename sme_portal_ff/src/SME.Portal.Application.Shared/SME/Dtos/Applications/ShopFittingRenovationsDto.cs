using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.Applications
{
    public class ShopFittingRenovationsDto
    {
        public int? PropertyValue { get; set; }
        public string PropertyTypeListId { get; set; }
        public bool? IsPropertyBonded { get; set; }
        public int? BondAmount { get; set; }
        public string PropertyType { get; internal set; }
    }
}
