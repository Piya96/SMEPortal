using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Lenders.Dtos
{
    public class GetAllLendersInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public string NameFilter { get; set; }

        public string FSPRegistrationNumberFilter { get; set; }

        public string LenderTypesFilter { get; set; }

        public int? HasContractFilter { get; set; }

        public string HeadOfficeProvinceFilter { get; set; }

        public string AlphabeticSearchFilter { get; set; }
        
        public int? hasArchivedFilter { get; set; }



        
    }
}