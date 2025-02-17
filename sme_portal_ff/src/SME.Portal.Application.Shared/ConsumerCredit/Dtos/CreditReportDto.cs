using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.ConsumerCredit.Dtos
{
    public class CreditReportDto : EntityDto
    {
        public string CreditReportJson { get; set; }

        public DateTime EnquiryDate { get; set; }

        public long UserId { get; set; }

    }
}