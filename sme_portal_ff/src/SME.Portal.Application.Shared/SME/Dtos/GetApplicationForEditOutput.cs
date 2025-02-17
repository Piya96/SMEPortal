using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.SME.Dtos
{
    public class GetApplicationForEditOutput
    {
        public CreateOrEditApplicationDto Application { get; set; }

        public string UserName { get; set; }

        public string SmeCompanyName { get; set; }

    }
}