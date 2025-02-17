using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.ConsumerProfileBureau.Dtos
{
    public abstract class IndividualListRequestDto
    {
        public string PermissiblePurpose { get; set; }
        public string Term { get; set; }
        public string Filter1 { get; set; }
        public string Filter2 { get; set; }
        public string Filter3 { get; set; }
        public string Filter4 { get; set; }
        public string Filter5 { get; set; }
        public string SortBy { get; set; }
        public string MaxRow { get; set; }
    }
}
