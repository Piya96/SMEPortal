using Abp.Application.Services.Dto;

namespace SME.Portal.Documents.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}