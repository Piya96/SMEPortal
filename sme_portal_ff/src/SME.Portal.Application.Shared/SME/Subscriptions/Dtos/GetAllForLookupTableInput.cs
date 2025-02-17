using Abp.Application.Services.Dto;

namespace SME.Portal.Sme.Subscriptions.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}