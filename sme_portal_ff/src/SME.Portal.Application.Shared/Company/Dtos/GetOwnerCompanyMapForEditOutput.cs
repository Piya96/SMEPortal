using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Company.Dtos
{
    public class GetOwnerCompanyMapForEditOutput
    {
        public CreateOrEditOwnerCompanyMapDto OwnerCompanyMap { get; set; }

        public string OwnerIdentityOrPassport { get; set; }

        public string SmeCompanyRegistrationNumber { get; set; }

    }
}