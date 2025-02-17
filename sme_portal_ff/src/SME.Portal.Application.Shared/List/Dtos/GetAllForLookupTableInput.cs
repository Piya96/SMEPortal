using Abp.Application.Services.Dto;

namespace SME.Portal.List.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}