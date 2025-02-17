using Abp.Application.Services.Dto;

namespace SME.Portal.ConsumerCredit.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}