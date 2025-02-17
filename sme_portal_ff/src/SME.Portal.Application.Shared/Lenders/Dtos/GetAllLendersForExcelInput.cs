using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Lenders.Dtos
{
    public class GetAllLendersForExcelInput
    {
        public string Filter { get; set; }

        public string NameFilter { get; set; }

        public string FSPRegistrationNumberFilter { get; set; }

        public int? IsSection12JFilter { get; set; }

        public int? HasContractFilter { get; set; }

        public int? LendersMatchingFilter { get; set; }

        public string AlphabeticSearchFilter { get; set; }



    }
}