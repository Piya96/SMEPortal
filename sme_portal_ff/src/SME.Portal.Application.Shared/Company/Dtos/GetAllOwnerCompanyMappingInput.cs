using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Company.Dtos
{
    public class GetAllOwnerCompanyMappingInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }

        public int? IsPrimaryOwnerFilter { get; set; }

        public string OwnerIdentityOrPassportFilter { get; set; }

        public string SmeCompanyRegistrationNumberFilter { get; set; }

    }
}