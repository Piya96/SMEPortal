using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Documents.Dtos
{
    public class UploadedSefaDocumentDto
    {
        public string Name { get; set; }
        public bool HasBeenUploaded { get; set; }
        public bool IsRequired { get; set; }
        public string DocTypeGuid { get; set; }
        public string TemplateUrl { get; set; }
    }
}
