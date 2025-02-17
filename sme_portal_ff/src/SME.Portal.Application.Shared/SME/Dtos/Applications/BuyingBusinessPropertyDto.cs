using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.Applications
{
    public class BuyingBusinessPropertyDto
    {
        public int? PropertyValue { get; set; }
        public string PropertyTypeListId { get; set; }
        public string PropertyType { get; internal set; }
    }
}
