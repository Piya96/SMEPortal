using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.Applications
{
    public class CommercialisingResearchDto
    {
        public bool? StudentStatus { get; set; }
        public bool? IncreasedExports { get; set; }
        public bool? JobCreation { get; set; }
        public bool? Innovation { get; set; }
        public string ProductListIds { get; set; }
        public string Products { get; internal set; }
    }
}
