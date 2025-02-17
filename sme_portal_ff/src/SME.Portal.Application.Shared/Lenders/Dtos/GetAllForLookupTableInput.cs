using Abp.Application.Services.Dto;

namespace SME.Portal.Lenders.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}