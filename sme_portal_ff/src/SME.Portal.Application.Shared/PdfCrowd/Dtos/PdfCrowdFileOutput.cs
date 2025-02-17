using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.PdfCrowd.Dtos
{
    public class PdfCrowdFileOutput
    {
        public byte[] Bytes { get; set; }

        public string FileName { get; set; }

        public string ContentType { get; set; }

        public string CacheControl { get; set; }

        public string AcceptRanges { get; set; }

        public string ContentDisposition { get; set; }
    }
}
