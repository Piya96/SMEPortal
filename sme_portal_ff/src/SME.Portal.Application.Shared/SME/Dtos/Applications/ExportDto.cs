using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.Applications
{
    public class ExportDto
    {
        public string ProductSectionListIds { get; set; }
        public bool? InternationalResearch { get; set; }
        public string CountryListIds { get; set; }
        public bool? ConfirmedExportOrder { get; set; }
        public int? OrderValue { get; set; }
    }
}
