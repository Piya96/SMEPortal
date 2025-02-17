using Abp.Application.Services.Dto;

namespace SME.Portal.Currency.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }
    }
}