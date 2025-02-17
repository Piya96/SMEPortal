using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class ChromeUrlToPdfRequestDto
    {
        public string Url { get; set; }
        public bool InlinePdf { get; set; }
        public string FileName { get; set; }
    }
}
