using Abp.Application.Services.Dto;

namespace SME.Portal.Company.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}