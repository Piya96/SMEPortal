namespace SME.Portal.Documents.Dtos
{
    public class GetDocumentForViewDto
    {
        public DocumentDto Document { get; set; }

        public string SmeCompanyName { get; set; }
        public string TypeName { get; set; }

    }
}