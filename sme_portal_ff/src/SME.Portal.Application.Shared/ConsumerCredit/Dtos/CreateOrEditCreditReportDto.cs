using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.ConsumerCredit.Dtos
{
    public class CreateOrEditCreditReportDto : EntityDto<int?>
    {

        [Required]
        public string CreditReportJson { get; set; }

        public DateTime EnquiryDate { get; set; }

        public long UserId { get; set; }

    }
}