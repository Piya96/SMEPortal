using Abp.Application.Services.Dto;

namespace SME.Portal.SME.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}