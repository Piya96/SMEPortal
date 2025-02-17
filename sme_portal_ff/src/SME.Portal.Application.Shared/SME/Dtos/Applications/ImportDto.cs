using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.Applications
{
    public class ImportDto
    {
        public bool? SignedContract { get; set; }
        public string CountryListIds { get; set; }
        public string ProductSectionListIds { get; set; }
    }
}
