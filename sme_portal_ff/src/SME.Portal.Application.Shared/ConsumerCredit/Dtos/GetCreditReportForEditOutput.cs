using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.ConsumerCredit.Dtos
{
    public class GetCreditReportForEditOutput
    {
        public CreateOrEditCreditReportDto CreditReport { get; set; }

        public string UserName { get; set; }

    }
}