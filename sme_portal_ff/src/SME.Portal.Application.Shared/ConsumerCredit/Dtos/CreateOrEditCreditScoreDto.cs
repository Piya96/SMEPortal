using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.ConsumerCredit.Dtos
{
    public class CreateOrEditCreditScoreDto : EntityDto<int?>
    {
        public int Score { get; set; }

        public DateTime EnquiryDate { get; set; }

        public long UserId { get; set; }

    }
}