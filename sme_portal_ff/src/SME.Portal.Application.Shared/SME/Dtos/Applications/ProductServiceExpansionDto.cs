using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.Applications
{
    public class ProductServiceExpansionDto
    {
        public string TypeOfExpansionListId { get; set; }
        public string TypeOfExpansionOther { get; set; }
        public string TypeOfExpansion { get; internal set; }
    }
}
