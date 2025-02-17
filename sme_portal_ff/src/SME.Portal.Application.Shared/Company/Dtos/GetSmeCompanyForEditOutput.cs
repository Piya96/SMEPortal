using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Company.Dtos
{
    public class GetSmeCompanyForEditOutput
    {
        public CreateOrEditSmeCompanyDto SmeCompany { get; set; }

        public string UserName { get; set; }

    }
}